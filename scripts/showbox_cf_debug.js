#!/usr/bin/env node
/**
 * Showbox Cloudflare Debug Script
 *
 * What it does:
 * - Resolves Showbox base URL via providers/getBaseUrl
 * - Attempts multiple fetch strategies and prints diagnostics:
 *   1) Plain axios with common headers
 *   2) Axios with optional cookies (from env or saved file)
 *   3) Optional headless-browser fetch (Puppeteer), saves cookies for reuse
 * - Detects Cloudflare pages ("Just a moment", cf-chl, 403/503) and reports
 * - Saves useful artifacts in ./.debug/
 *
 * Usage:
 *   node scripts/showbox_cf_debug.js               # plain + cookies attempts
 *   WITH_BROWSER=1 node scripts/showbox_cf_debug.js # also tries puppeteer
 *
 * Optional env:
 *   CF_COOKIES   - cookie string to send (e.g., "name=value; cf_clearance=...;")
 *   TARGET_PATH  - path to append to base URL (default: "/")
 */

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const os = require('os');

const DEBUG_DIR = path.join(process.cwd(), '.debug');
const COOKIES_FILE = path.join(DEBUG_DIR, 'showbox_cookies.json');
const HTML_SNAPSHOT = path.join(DEBUG_DIR, 'showbox_snapshot.html');

function ensureDebugDir() {
  try { fs.mkdirSync(DEBUG_DIR, { recursive: true }); } catch {}
}

function loadLocalCookies() {
  try {
    const buf = fs.readFileSync(COOKIES_FILE, 'utf8');
    const list = JSON.parse(buf);
    // Convert to cookie header string
    const cookieStr = list
      .filter(Boolean)
      .map(c => `${c.name}=${c.value}`)
      .join('; ');
    return cookieStr || undefined;
  } catch {
    return undefined;
  }
}

async function resolveShowboxBaseUrl() {
  // Use providers/modflixData.js via providers/getBaseUrl
  const getBaseUrl = require(path.join(process.cwd(), 'providers', 'getBaseUrl.js'));
  const url = await getBaseUrl.getBaseUrl('showbox');
  if (!url) throw new Error('Showbox base URL not found in modflix data');
  return url.replace(/\/$/, '');
}

function buildAxios() {
  const axios = require('axios');
  const instance = axios.create({
    // 15s timeout to avoid hangs
    timeout: 15000,
    maxRedirects: 5,
    validateStatus: () => true,
  });
  instance.interceptors.request.use((config) => {
    config.headers = {
      // Common headers that often help with CF and WAFs
      'User-Agent': process.env.UA || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      DNT: '1',
      Upgrade-Insecure-Requests: '1',
      ...config.headers,
    };
    return config;
  });
  return instance;
}

function looksLikeCloudflare(html, status) {
  if (!html) return false;
  const s = String(html).toLowerCase();
  return (
    status === 403 || status === 503 ||
    s.includes('just a moment') ||
    s.includes('cf-chl') ||
    s.includes('cloudflare') ||
    s.includes('attention required')
  );
}

async function attemptPlainAxios(url) {
  const axios = buildAxios();
  console.log(`\n[1] Plain axios GET: ${url}`);
  const res = await axios.get(url);
  console.log(`Status: ${res.status}`);
  const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data).slice(0, 400);
  console.log(`Body preview: ${String(body).slice(0, 200)}...`);
  const cf = looksLikeCloudflare(body, res.status);
  console.log(`Cloudflare detected: ${cf}`);
  if (cf) {
    ensureDebugDir();
    try { fs.writeFileSync(HTML_SNAPSHOT, body); console.log(`Saved HTML snapshot -> ${HTML_SNAPSHOT}`);} catch {}
  }
  return { status: res.status, cf, body: body ? String(body) : '' };
}

async function attemptAxiosWithCookies(url) {
  const axios = buildAxios();
  const cookieFromEnv = process.env.CF_COOKIES;
  const cookieFromFile = loadLocalCookies();
  const cookie = cookieFromEnv || cookieFromFile;
  if (!cookie) {
    console.log('\n[2] Axios with cookies: skipped (no CF_COOKIES env or saved cookies)');
    return { status: -1, cf: false };
  }
  console.log(`\n[2] Axios with cookies header (length=${cookie.length})`);
  const res = await axios.get(url, { headers: { Cookie: cookie } });
  console.log(`Status: ${res.status}`);
  const body = typeof res.data === 'string' ? res.data : JSON.stringify(res.data).slice(0, 400);
  console.log(`Body preview: ${String(body).slice(0, 200)}...`);
  const cf = looksLikeCloudflare(body, res.status);
  console.log(`Cloudflare detected: ${cf}`);
  return { status: res.status, cf };
}

async function attemptHeadless(url) {
  if (!process.env.WITH_BROWSER) {
    console.log('\n[3] Headless (Puppeteer): skipped (set WITH_BROWSER=1 to enable)');
    return { used: false };
  }
  console.log(`\n[3] Headless (Puppeteer) GET: ${url}`);
  let puppeteer;
  try {
    // Lazy require; user may not have it installed
    puppeteer = require('puppeteer-extra');
    try { puppeteer.use(require('puppeteer-extra-plugin-stealth')()); } catch {}
  } catch (e) {
    console.log('Puppeteer not installed. Run: npm i -D puppeteer-extra puppeteer-extra-plugin-stealth puppeteer');
    return { used: false };
  }
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox','--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(process.env.UA || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    const status = resp?.status?.() || -1;
    console.log(`Puppeteer status: ${status}`);
    const content = await page.content();
    ensureDebugDir();
    try { fs.writeFileSync(HTML_SNAPSHOT, content); console.log(`Saved HTML snapshot -> ${HTML_SNAPSHOT}`);} catch {}
    // Save cookies for reuse with axios
    const cookies = await page.cookies();
    try {
      fs.writeFileSync(COOKIES_FILE, JSON.stringify(cookies, null, 2));
      console.log(`Saved cookies -> ${COOKIES_FILE}`);
    } catch {}
    const cf = looksLikeCloudflare(content, status);
    console.log(`Cloudflare detected (headless): ${cf}`);
    return { used: true, status, cf };
  } finally {
    await browser.close();
  }
}

async function main() {
  try {
    ensureDebugDir();
    const base = await resolveShowboxBaseUrl();
    const pathSuffix = process.env.TARGET_PATH || '/';
    const targetUrl = `${base}${pathSuffix.startsWith('/') ? pathSuffix : '/' + pathSuffix}`;
    console.log(`Resolved Showbox base: ${base}`);
    console.log(`Target URL: ${targetUrl}`);

    const r1 = await attemptPlainAxios(targetUrl);
    const r2 = await attemptAxiosWithCookies(targetUrl);
    const r3 = await attemptHeadless(targetUrl);

    console.log('\n=== Summary ===');
    console.log(`Plain axios -> status: ${r1.status}, cf: ${r1.cf}`);
    console.log(`Axios+cookies -> status: ${r2.status}, cf: ${r2.cf}`);
    if (r3.used) console.log(`Headless -> status: ${r3.status}, cf: ${r3.cf}`);

    if (r1.cf || r2.cf || r3.cf) {
      console.log('\nCloudflare challenge likely active. Next steps:');
      console.log('- Inspect .debug/showbox_snapshot.html');
      console.log('- If WITH_BROWSER saved cookies, re-run without browser so axios uses CF_COOKIES=cat .debug/showbox_cookies.json');
      console.log('- You can also export cookie string: CF_COOKIES="name=value; cf_clearance=..."');
    }

    console.log('\nExample reruns:');
    console.log(' TARGET_PATH=/ MOVIES WITH_BROWSER=1 node scripts/showbox_cf_debug.js');
    console.log(' CF_COOKIES="$(node -e \"console.log(require(\'./.debug/showbox_cookies.json\').map(c=>c.name+\'=\'+c.value).join(\'; \'))\")" node scripts/showbox_cf_debug.js');

  } catch (e) {
    console.error('Error:', e.message || e);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}


