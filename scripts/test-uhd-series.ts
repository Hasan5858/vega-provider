/*
  Debug UHDMovies series extraction.
  Usage: ts-node scripts/test-uhd-series.ts <uhd_series_page_url>
*/
import axios from 'axios';
import * as cheerio from 'cheerio';

async function isDriveLink(ddl: string) {
  if (!ddl.includes('drive')) return ddl;
  const res = await fetch(ddl);
  const text = await res.text();
  const pathMatch = text.match(/window\.location\.replace\("([^"]+)"\)/);
  const path = pathMatch?.[1];
  const mainUrl = ddl.split('/')[2];
  const drive = `https://${mainUrl}${path}`;
  console.log('driveUrl =', drive);
  return drive;
}

async function extractDownloadRedirect(url: string) {
  // Simulate modExtractor minimal
  const wpHttp = url.split('sid=')[1];
  const base = url.split('?')[0];
  const fd0 = new FormData();
  fd0.append('_wp_http', wpHttp);
  const r0 = await fetch(base, { method: 'POST', body: fd0 });
  const html0 = await r0.text();
  const $0 = cheerio.load(html0);
  const wp2 = ($0('input[name="_wp_http2"]').attr('value') || '').trim();
  const formUrl = $0('form').attr('action') || base;
  const fd1 = new FormData();
  fd1.append('_wp_http2', wp2);
  const r1 = await fetch(formUrl, { method: 'POST', body: fd1 });
  const html1 = await r1.text();
  const link = html1.match(/setAttribute\("href",\s*"(.*?)"/ )?.[1];
  if (!link) throw new Error('redirect link not found');
  const cookie = link.split('=')[1];
  const res = await axios.get(link, { headers: { Referer: formUrl, Cookie: `${cookie}=${wp2}` } });
  return res.data as string;
}

async function testUhd(url: string) {
  const commonHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  };
  console.log('🔍 Fetching series page:', url);
  const page = await axios.get(url, { headers: commonHeaders });
  const $ = cheerio.load(page.data);
  const episodeAnchors = $('a[href*="tech.unblockedgames.world"], a[href*="?sid="]').slice(0, 6);
  console.log('Episodes detected:', episodeAnchors.length);
  for (let i = 0; i < episodeAnchors.length; i++) {
    const a = episodeAnchors[i] as any;
    const href = ($(a).attr('href') || '').trim();
    const title = ($(a).text() || `Episode ${i + 1}`).trim();
    if (!href) continue;
    console.log(`\n=== Episode ${i + 1}: ${title} ===`);
    console.log('Step 1: resolve redirect/cookie...');
    let redirectHtml: string = '';
    try {
      redirectHtml = await extractDownloadRedirect(href);
    } catch (e: any) {
      console.log('redirect extraction failed:', e?.message || e);
      continue;
    }
    const $redir = cheerio.load(redirectHtml);
    const ddl = redirectHtml.match(/content="0;url=(.*?)"/)?.[1] || href;
    console.log('ddl:', ddl);
    const driveLink = await isDriveLink(ddl);

    console.log('Step 2: driveseed instant token...');
    try {
      const inst = await axios.get(driveLink, { headers: commonHeaders });
      const $d = cheerio.load(inst.data);
      const seed = $d('.btn-danger').attr('href') || '';
      if (seed) {
        const instantToken = seed.split('=')[1];
        const videoSeedUrl = seed.split('/').slice(0, 3).join('/') + '/api';
        const fd = new FormData();
        fd.append('keys', instantToken);
        const apiRes = await fetch(videoSeedUrl, { method: 'POST', body: fd, headers: { 'x-token': videoSeedUrl } });
        const apiJson = await apiRes.json();
        console.log('instant API:', apiJson);
      } else {
        console.log('instant seed not found');
      }
    } catch (e) {
      console.log('instant check failed:', (e as any)?.message || e);
    }

    console.log('Step 3: resume link (.btn-success on /zfile) ...');
    try {
      const resumeUrl = driveLink.replace('/file', '/zfile');
      const res = await axios.get(resumeUrl, { headers: commonHeaders });
      const $r = cheerio.load(res.data);
      $r('a.btn-success, a.btn, a[href*="workers.dev"]').each((_, el) => {
        const link = (el as any).attribs?.href;
        if (link) console.log('resume candidate:', link);
      });
    } catch (e) {
      console.log('resume check failed:', (e as any)?.message || e);
    }

    console.log('Step 4: worker links (/wfile?type=1/2) ...');
    for (const t of [1, 2]) {
      try {
        const wurl = driveLink.replace('/file', '/wfile') + `?type=${t}`;
        const wr = await axios.get(wurl, { headers: commonHeaders });
        const $w = cheerio.load(wr.data);
        $w('a.btn-success, a.btn, a[href*="workers.dev"]').each((_, el) => {
          const link = (el as any).attribs?.href;
          if (link) console.log(`worker${t} candidate:`, link);
        });
      } catch (e) {
        console.log(`worker ${t} failed`);
      }
    }
  }
}

const arg = process.argv[2];
if (!arg) {
  console.log('Pass a UHD series detail URL.');
  process.exit(1);
}
testUhd(arg).catch(e => {
  console.error('Test failed:', e);
});


