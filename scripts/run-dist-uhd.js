/*
  Usage:
    node scripts/run-dist-uhd.js <url>
  Where <url> is the resolver URL (?sid=...) or direct link the provider expects.
*/
const axios = require('axios');
const cheerio = require('cheerio');
const { getStream } = require('../dist/uhd/stream.js');

async function main() {
  const url = process.argv[2];
  if (!url) {
    console.log('Usage: node scripts/run-dist-uhd.js <url>');
    process.exit(1);
  }
  const providerContext = { axios, cheerio };
  console.log('=== Run dist uhd.getStream ===');
  console.log('URL:', url);
  try {
    const streams = await getStream({ link: url, providerContext });
    if (!streams || streams.length === 0) {
      console.log('[Result] No streams.');
    } else {
      console.log(`[Result] ${streams.length} streams:`);
      for (const s of streams) console.log('-', s.server, '=>', s.link);
    }
  } catch (e) {
    console.error('Error:', e);
  }
}

main();
