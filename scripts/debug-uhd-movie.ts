import axios from 'axios';
import * as cheerio from 'cheerio';
import { getStream as getUhdStream } from '../providers/uhd/stream';
import type { ProviderContext } from '../providers/types';

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
  return html1 as string;
}

async function main() {
  const postUrl = process.argv[2];
  if (!postUrl) {
    console.log('Usage: ts-node scripts/debug-uhd-movie.ts <uhd_movie_post_url>');
    process.exit(1);
  }

  const providerContext: ProviderContext = {
    axios: axios as any,
    cheerio: cheerio as any,
  } as any;

  console.log('=== UHD Movie Debug ===');
  console.log('Post URL:', postUrl);

  const commonHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  const res = await axios.get(postUrl, { headers: commonHeaders });
  const $ = cheerio.load(res.data);
  const candidates = new Set<string>();
  $('a[href*="?sid"], a[href*="tech.unblockedgames.world"]').each((_, el) => {
    const href = ($(el).attr('href') || '').trim();
    if (href) candidates.add(href);
  });

  const first = Array.from(candidates)[0];
  if (!first) {
    console.log('No resolver link found on the page.');
    process.exit(2);
  }

  console.log('Resolver link:', first);

  // Resolve meta redirect and drive link
  let redirectHtml = '';
  try {
    redirectHtml = await extractDownloadRedirect(first);
  } catch (e: any) {
    console.log('redirect extraction failed:', e?.message || e);
  }
  const ddl = redirectHtml.match(/content="0;url=(.*?)"/)?.[1] || first;
  console.log('ddl:', ddl);
  const driveLink = await isDriveLink(ddl);

  // Probe drive page for buttons/links
  try {
    const inst = await axios.get(driveLink, { headers: commonHeaders });
    const $d = cheerio.load(inst.data);
    const seed = $d('.btn-danger').attr('href') || $d('a[href*="/instant"]').attr('href') || '';
    if (seed) console.log('instant seed:', seed);

    console.log('resume/worker candidates:');
    const resumeUrl = driveLink.replace('/file', '/zfile');
    const r = await axios.get(resumeUrl, { headers: commonHeaders });
    const $r = cheerio.load(r.data);
    $r('a.btn-success, a.btn, a[href*="workers.dev"]').each((_, el) => {
      const link = (el as any).attribs?.href;
      if (link) console.log('-', link);
    });
    for (const t of [1, 2]) {
      const wurl = driveLink.replace('/file', '/wfile') + `?type=${t}`;
      const wr = await axios.get(wurl, { headers: commonHeaders });
      const $w = cheerio.load(wr.data);
      $w('a.btn-success, a.btn, a[href*="workers.dev"]').each((_, el) => {
        const link = (el as any).attribs?.href;
        if (link) console.log(`- worker${t}:`, link);
      });
    }
  } catch (e) {
    console.log('drive probe failed:', (e as any)?.message || e);
  }

  // Finally, run provider getStream
  const streams = await getUhdStream({ link: first, providerContext });
  if (streams.length === 0) {
    console.log('[Result] No streams returned');
  } else {
    console.log(`[Result] ${streams.length} streams:`);
    for (const s of streams) {
      console.log('-', s.server, '=>', s.link);
    }
  }
}

main().catch((e) => {
  console.error('Debug failed:', e);
  process.exit(1);
});
