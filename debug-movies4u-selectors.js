const axios = require('axios');
const cheerio = require('cheerio');

async function testSelectors() {
  try {
    console.log('🔍 Testing Movies4U selectors...');
    
    // Test homepage
    const response = await axios.get('https://movies4u.ps/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Referer': 'https://movies4u.ps/',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
      }
    });
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response length: ${response.data.length}`);
    
    const $ = cheerio.load(response.data);
    
    // Test current selectors
    const POST_SELECTORS = [
      ".entry-card",
      "article.entry-card", 
      ".pstr_box",
      "article",
      ".result-item",
      ".post",
      ".item",
      ".thumbnail",
      ".latest-movies",
      ".movie-item",
    ];
    
    console.log('\n🔍 Testing current selectors:');
    POST_SELECTORS.forEach(selector => {
      const count = $(selector).length;
      console.log(`  ${selector}: ${count} elements`);
    });
    
    // Look for common patterns
    console.log('\n🔍 Looking for common patterns:');
    const commonSelectors = [
      'div[class*="movie"]',
      'div[class*="post"]', 
      'div[class*="item"]',
      'div[class*="card"]',
      'div[class*="box"]',
      'a[href*="/movie/"]',
      'a[href*="/watch/"]',
      'a[href*="/film/"]',
      '.container div',
      '.row div',
      'div[class]',
    ];
    
    commonSelectors.forEach(selector => {
      const count = $(selector).length;
      if (count > 0) {
        console.log(`  ${selector}: ${count} elements`);
      }
    });
    
    // Look for links that might be movies
    console.log('\n🔍 Looking for movie links:');
    const movieLinks = $('a[href*="/movie/"], a[href*="/watch/"], a[href*="/film/"]');
    console.log(`Found ${movieLinks.length} potential movie links`);
    
    if (movieLinks.length > 0) {
      console.log('Sample links:');
      movieLinks.slice(0, 5).each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        console.log(`  ${i+1}. ${text} -> ${href}`);
      });
    }
    
    // Check for any divs with classes
    console.log('\n🔍 All divs with classes:');
    $('div[class]').slice(0, 10).each((i, el) => {
      const className = $(el).attr('class');
      const text = $(el).text().trim().substring(0, 50);
      console.log(`  ${i+1}. class="${className}" -> "${text}..."`);
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSelectors();
