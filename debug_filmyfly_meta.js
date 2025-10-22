const axios = require('axios');
const cheerio = require('cheerio');

async function debugMeta() {
  try {
    console.log('Debugging FilmyFly page structure...');
    
    const url = 'https://filmyfly.observer/page-download/5852/Baaghi-4-2025-Bollywood-Hindi-Movie-HD-ESub.html';
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    const res = await axios.get(url, { headers });
    const data = res.data;
    const $ = cheerio.load(data);
    
    console.log('Page title:', $('title').text());
    console.log('H2 elements:', $('h2').length);
    $('h2').each((i, el) => {
      console.log(`  H2 ${i + 1}:`, $(el).text().trim());
    });
    
    console.log('\nDownload button selectors:');
    console.log('.dwd-button count:', $('.dwd-button').length);
    console.log('.dlbtn count:', $('.dlbtn').length);
    console.log('a[href*="linkmake"] count:', $('a[href*="linkmake"]').length);
    
    console.log('\nAll download-related links:');
    $('a[href*="linkmake"], .dwd-button, .dlbtn').each((i, el) => {
      const $el = $(el);
      console.log(`  ${i + 1}. Tag: ${el.tagName}, Class: ${$el.attr('class')}, Text: "${$el.text().trim()}", Href: ${$el.attr('href')}`);
    });
    
    console.log('\nLooking for quality indicators:');
    $('*').each((i, el) => {
      const text = $(el).text();
      if (text.includes('480p') || text.includes('720p') || text.includes('1080p') || text.includes('4K')) {
        console.log(`  Quality found in ${el.tagName}: "${text.trim()}"`);
      }
    });
    
  } catch (error) {
    console.error('Error debugging meta:', error);
  }
}

debugMeta();
