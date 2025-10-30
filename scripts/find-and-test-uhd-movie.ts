import axios from 'axios';
import * as cheerio from 'cheerio';
const { getStream } = require('../dist/uhd/stream.js');

async function getRecentMoviePosts(): Promise<string[]> {
  const res = await axios.get('https://uhdmovies.rip/');
  const $ = cheerio.load(res.data);
  const links: string[] = [];
  $('a').each((_, el) => {
    const href = ($(el).attr('href') || '').trim();
    const txt = ($(el).text() || '').toLowerCase();
    if (href.includes('https://uhdmovies.rip/download') && txt.includes('download')) {
      links.push(href);
    }
  });
  return Array.from(new Set(links));
}

async function getResolverLinks(postUrl: string): Promise<string[]> {
  const res = await axios.get(postUrl);
  const $ = cheerio.load(res.data);
  const links: string[] = [];
  $('a[href*="?sid"], a[href*="tech.unblockedgames.world"]').each((_, el) => {
    const href = ($(el).attr('href') || '').trim();
    if (href) links.push(href);
  });
  return Array.from(new Set(links));
}

async function main() {
  console.log('Scanning UHDMovies for recent posts...');
  const posts = await getRecentMoviePosts();
  console.log('Found posts:', posts.slice(0, 5));
  for (const post of posts.slice(0, 5)) {
    console.log('\nTesting post:', post);
    const resolvers = await getResolverLinks(post);
    console.log('Resolver candidates:', resolvers.length);
    for (const url of resolvers) {
      console.log('Trying resolver:', url);
      try {
        const streams = await getStream({ link: url, providerContext: { axios, cheerio } });
        if (streams && streams.length) {
          console.log(`[OK] Streams for ${post}:`);
          for (const s of streams) console.log('-', s.server, '=>', s.link);
          return;
        }
      } catch (e) {
        console.log('Resolver failed');
      }
    }
  }
  console.log('No working movie resolvers found in first 5 posts.');
}

main().catch(e => {
  console.error('Failed:', e);
  process.exit(1);
});
