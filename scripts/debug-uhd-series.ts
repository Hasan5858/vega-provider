import axios from 'axios';
import * as cheerio from 'cheerio';
import { getStream as getUhdStream } from '../providers/uhd/stream';
import type { ProviderContext } from '../providers/types';

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.log('Usage: ts-node scripts/debug-uhd-series.ts <uhd_series_episode_url>');
    process.exit(1);
  }

  const providerContext: ProviderContext = {
    axios: axios as any,
    cheerio: cheerio as any,
    // the provider runtime provides more fields, but getStream uses only axios/cheerio here
  } as any;

  console.log('=== UHD Series Debug ===');
  console.log('Input URL:', url);

  console.log('\n[1] Calling UHD getStream...');
  const streams = await getUhdStream({ link: url, providerContext });
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
