const axios = require('axios');
const cheerio = require('cheerio');

// Test the FilmyFly stream function
async function testFilmyFlyStream() {
  try {
    console.log('🧪 Testing FilmyFly stream extraction...');
    
    // Test URL from the logs
    const testUrl = 'https://linkmake.in/view/Ny4ebkVkM2';
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    console.log('📡 Fetching stream page:', testUrl);
    const res = await axios.get(testUrl, { 
      headers,
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });
    
    const data = res.data;
    const $ = cheerio.load(data);
    
    console.log('✅ Page loaded successfully');
    
    // Test the current selectors from stream.ts
    console.log('\n🔍 Testing current selectors:');
    const elements = $(".button2,.button1,.button3,.button4,.button").toArray();
    console.log(`Found ${elements.length} elements with current selectors`);
    
    elements.forEach((element, i) => {
      const title = $(element).text();
      const link = $(element).attr("href");
      console.log(`  Element ${i + 1}:`, { title: title.trim(), link });
    });
    
    // Look for other possible download button selectors
    console.log('\n🔍 Looking for other download selectors:');
    const allButtons = $('a[href*="download"], a[href*="file"], .btn, button, [class*="download"], [class*="button"]');
    console.log(`Found ${allButtons.length} potential download elements`);
    
    allButtons.each((i, element) => {
      const $el = $(element);
      const text = $el.text().trim();
      const href = $el.attr("href");
      const className = $el.attr("class");
      
      if (text && href) {
        console.log(`  Button ${i + 1}:`, { 
          text: text.substring(0, 50), 
          href: href.substring(0, 50),
          class: className 
        });
      }
    });
    
    // Look for any links that might be download links
    console.log('\n🔍 Looking for any links:');
    const allLinks = $('a[href]');
    console.log(`Found ${allLinks.length} total links`);
    
    allLinks.each((i, element) => {
      const $el = $(element);
      const text = $el.text().trim();
      const href = $el.attr("href");
      
      if (text && href && (href.includes('download') || href.includes('file') || text.includes('Download') || text.includes('480p') || text.includes('720p'))) {
        console.log(`  Link ${i + 1}:`, { 
          text: text.substring(0, 50), 
          href: href.substring(0, 50)
        });
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testFilmyFlyStream().then(() => {
  console.log('\n✅ Stream test completed!');
});
