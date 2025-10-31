const axios = require('axios');
const cheerio = require('cheerio');

async function checkQuality() {
  // Try the 720p quality link
  const movieUrl = 'https://skymovieshd.mba/movie/Nishaanchi-(2025)-Hindi-720p-HEVC-HDRip-x265-AAC-ESubs-Full-Bollywood-Movie-[1GB].html';
  
  console.log('🔍 Fetching 720p movie page:', movieUrl);
  const res = await axios.get(movieUrl);
  const $ = cheerio.load(res.data);
  
  // Find SERVER 01 button
  const server01Link = $('a[href*="howblogs.xyz"]').first().attr('href');
  
  if (!server01Link) {
    console.log('❌ Could not find SERVER 01 link');
    return;
  }
  
  console.log('\n✅ SERVER 01 link:', server01Link);
  console.log('\n📥 Fetching SERVER 01 page...\n');
  
  const aggRes = await axios.get(server01Link);
  const $$ = cheerio.load(aggRes.data);
  
  console.log('Links on 720p SERVER 01:\n');
  $$('a[href]').each((i, el) => {
    const href = $$(el).attr('href');
    if (href && /^https?:\/\//i.test(href) && !href.includes('howblogs.xyz')) {
      console.log(href);
    }
  });
}

checkQuality();
