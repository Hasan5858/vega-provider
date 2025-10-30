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
  // Use providers/modflixData.js directly
  try {
    // Try require first
    const modflixData = require(path.join(process.cwd(), 'providers', 'modflixData.js'));
    const providerData = modflixData.showbox || modflixData['showbox'] || (modflixData.default && modflixData.default.showbox);
    if (providerData && providerData.url) {
      return providerData.url.replace(/\/$/, '');
    }
  } catch (e) {
    // Fallback: read and parse JSON directly
    const dataPath = path.join(process.cwd(), 'data', 'modflix.json');
    const jsonData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    const providerData = jsonData.showbox;
    if (providerData && providerData.url) {
      return providerData.url.replace(/\/$/, '');
    }
  }
  throw new Error('Showbox base URL not found in modflix data');
}

function buildAxios() {
  const axios = require('axios');
  const instance = axios.create({
    // 15s timeout to avoid hangs
    timeout: 15000,
    maxRedirects: 5,
    validateStatus: () => true,
    decompress: true,
    responseType: 'text',
    transformResponse: [(data) => data],
  });
  instance.interceptors.request.use((config) => {
    // Merge provided headers with a realistic Chrome fingerprint
    const url = new URL(config.url);
    const cookieHeader = (config.headers && config.headers.Cookie) || process.env.CF_COOKIES;
    const merged = {
      // Pseudo/derived headers
      Host: url.host,
      // Critical fingerprint headers
      'User-Agent': process.env.UA || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Accept-Encoding': process.env.DISABLE_COMPRESSION === '1' ? 'identity' : 'gzip, deflate, br, zstd',
      'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
      'Cache-Control': 'max-age=0',
      Referer: `https://${url.host}/?__cf_chl_tk=vc_Ykhf5naHHWMu1x5t3C0u68Pub41vnwB9IjDRsEac-1761780064-1.0.1.1-5nTxrQwWML_87WWK3m.OMZVQcN.LdXEXvo2bK8JDmUI`,
      'sec-ch-ua': '"Google Chrome";v="141", "Not?A_Brand";v="8", "Chromium";v="141"',
      'sec-ch-ua-arch': '"arm"',
      'sec-ch-ua-bitness': '"64"',
      'sec-ch-ua-full-version': '"141.0.7390.123"',
      'sec-ch-ua-full-version-list': '"Google Chrome";v="141.0.7390.123", "Not?A_Brand";v="8.0.0.0", "Chromium";v="141.0.7390.123"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-model': '""',
      'sec-ch-ua-platform': '"macOS"',
      'sec-ch-ua-platform-version': '"15.6.1"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'Upgrade-Insecure-Requests': '1',
      // Optional Priority header (Node/axios treats as regular header)
      Priority: 'u=0, i',
      // Merge any pre-set headers
      ...config.headers,
    };
    if (cookieHeader) merged.Cookie = cookieHeader;
    config.headers = merged;
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
    // Save body for inspection when testing catalog paths
    try {
      if (r1.body) {
        fs.writeFileSync(path.join(DEBUG_DIR, 'showbox_response.html'), r1.body);
        console.log(`Saved response -> ${path.join(DEBUG_DIR, 'showbox_response.html')}`);
      }
    } catch {}
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

    // Optional: end-to-end provider test when E2E=1
    if (process.env.E2E === '1') {
      console.log('\n=== E2E Provider Test (catalog -> meta -> streams) ===');
      const cheerio = require('cheerio');
      const axios = buildAxios();
      // Inject cookies if provided
      const cookie = process.env.CF_COOKIES || loadLocalCookies();
      // Create axios instance with proper headers AND cookies
      const providerAxios = buildAxios();
      if (cookie) {
        providerAxios.interceptors.request.use((config) => {
          config.headers = config.headers || {};
          config.headers.Cookie = cookie;
          return config;
        });
      }
      const providerContext = {
        axios: providerAxios,
        cheerio: cheerio,
        getBaseUrl: async () => base,
      };
      const abort = new AbortController();

      // 1) Catalog fetch (Movies page 1)
      const showboxPosts = require(path.join(process.cwd(), 'dist', 'showbox', 'posts.js'));
      const catalog = await showboxPosts.getPosts({ filter: '/movie', page: 1, signal: abort.signal, providerContext });
      console.log(`Catalog items fetched: ${catalog.length}`);
      if (!catalog.length) {
        console.log('No catalog items found. Running selector probes...');
        try {
          // Probe selectors directly against live HTML using provider axios (which has cookies)
          const res = await providerAxios.get(`${base}/movie?page=1/`);
          let html = res.data;
          console.log(`Response status: ${res.status}`);
          console.log(`Content-Type: ${res.headers['content-type']}`);
          console.log(`HTML length: ${html.length}`);
          
          // Check if it's actually HTML or binary/compressed
          const htmlStr = typeof html === 'string' ? html : String(html);
          const isHtml = htmlStr.includes('<!DOCTYPE') || htmlStr.includes('<html') || htmlStr.includes('<body');
          console.log(`Is HTML: ${isHtml}`);
          
          if (!isHtml && htmlStr.charCodeAt(0) < 32) {
            console.log('Response appears to be compressed/binary, not HTML');
            console.log('First bytes:', Array.from(htmlStr.slice(0, 50)).map(c => c.charCodeAt(0)).join(','));
          } else {
            console.log(`First 800 chars: ${htmlStr.substring(0, 800)}`);
          }
          
          const $ = cheerio.load(htmlStr);

          // Comprehensive selector probes
          const candidates = [
            {name: '.movie-item,.flw-item', sel: '.movie-item,.flw-item'},
            {name: '.film_list-wrap .film_list .flw-item', sel: '.film_list-wrap .film_list .flw-item'},
            {name: '.film_list .flw-item', sel: '.film_list .flw-item'},
            {name: '.flw-item', sel: '.flw-item'},
            {name: '.movie-item', sel: '.movie-item'},
            {name: 'a[href*="/movie/"]', sel: 'a[href*="/movie/"]'},
            {name: 'a[href*="/tv/"]', sel: 'a[href*="/tv/"]'},
            {name: '.item, .card, .poster, .grid-item', sel: '.item, .card, .poster, .grid-item'},
            {name: 'article a', sel: 'article a'},
            {name: 'div a[href]', sel: 'div a[href]'},
            {name: '[class*="item"] a', sel: '[class*="item"] a'},
            {name: '[class*="card"] a', sel: '[class*="card"] a'},
            {name: '[class*="poster"] a', sel: '[class*="poster"] a'},
            {name: 'img[src*="poster"], img[src*="thumb"]', sel: 'img[src*="poster"], img[src*="thumb"]'},
          ];
          
          // Also try to find common patterns
          console.log('\nScanning for common patterns...');
          const allLinks = $('a[href]');
          console.log(`Total links found: ${allLinks.length}`);
          if (allLinks.length > 0) {
            console.log('Sample links (first 5):');
            allLinks.slice(0, 5).each((i, el) => {
              const href = $(el).attr('href');
              const text = $(el).text().trim();
              if (href && (href.includes('/movie/') || href.includes('/tv/'))) {
                console.log(`  [${i}] href="${href.substring(0, 80)}" text="${text.substring(0, 50)}"`);
              }
            });
          }
          
          const allImgs = $('img[src]');
          console.log(`Total images found: ${allImgs.length}`);
          if (allImgs.length > 0) {
            console.log('Sample images (first 5):');
            allImgs.slice(0, 5).each((i, el) => {
              const src = $(el).attr('src');
              const alt = $(el).attr('alt');
              if (src) {
                console.log(`  [${i}] src="${src.substring(0, 80)}" alt="${alt || ''}"`);
              }
            });
          }

          for (const c of candidates) {
            const nodes = $(c.sel);
            console.log(`Probe ${c.name}: nodes=${nodes.length}`);
            if (nodes.length > 0) {
              const n = nodes.first();
              const title = n.find('.film-name, img[alt], .title, .name').first().text().trim() || n.attr('title') || n.find('img').attr('alt') || '';
              const link = n.attr('href') || n.find('a').attr('href') || '';
              const img = n.find('img').attr('src') || '';
              console.log(`  sample -> title:"${title}" link:"${link}" img:"${img}"`);
            }
          }
        } catch (e) {
          console.log('Selector probe failed:', e.message);
        }
        console.log('Aborting E2E after probes.');
        return;
      }
      const first = catalog[0];
      console.log('First item:', first.title, first.link);

      // 2) Meta fetch for first item
      const showboxMeta = require(path.join(process.cwd(), 'dist', 'showbox', 'meta.js'));
      const meta = await showboxMeta.getMeta({ link: first.link, providerContext });
      console.log('Meta title:', meta.title);
      console.log('LinkList count:', meta.linkList?.length || 0);
      if (!meta.linkList?.length) {
        console.log('No linkList; cannot test streams.');
        return;
      }

      // 3) Streams for first link
      const firstEpisode = meta.linkList[0]?.directLinks?.[0]?.link || meta.linkList[0]?.episodesLink;
      if (!firstEpisode) {
        console.log('No episode/link found in first linkList item.');
        return;
      }
      const showboxStream = require(path.join(process.cwd(), 'dist', 'showbox', 'stream.js'));
      const streams = await showboxStream.getStream({ link: firstEpisode, type: 'movie', signal: abort.signal, providerContext });
      console.log(`Streams found: ${streams.length}`);
      if (streams[0]) {
        console.log('First stream:', streams[0]);
      }
    }

  } catch (e) {
    console.error('Error:', e.message || e);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  main();
}


