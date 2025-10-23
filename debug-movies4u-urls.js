const axios = require('axios');
const cheerio = require('cheerio');

async function testUrls() {
  const urls = [
    'https://movies4u.ps/',
    'https://movies4u.ps//category/bollywood',
    'https://movies4u.ps/category/bollywood',
  ];
  
  for (const url of urls) {
    try {
      console.log(`\n🔍 Testing URL: ${url}`);
      
      const response = await axios.get(url, {
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
      
      console.log(`  Status: ${response.status}`);
      console.log(`  Length: ${response.data.length}`);
      
      const $ = cheerio.load(response.data);
      
      // Test the exact selectors from the code
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
      ].join(",");
      
      const elements = $(POST_SELECTORS);
      console.log(`  Found ${elements.length} elements with selectors`);
      
      if (elements.length > 0) {
        console.log(`  Sample titles:`);
        elements.slice(0, 3).each((i, el) => {
          const card = $(el);
          const title = card.find("h2, h3, .title, .entry-title").first().text().trim() || 
                       card.find("a").first().text().trim() ||
                       card.text().trim().substring(0, 50);
          console.log(`    ${i+1}. ${title}`);
        });
      }
      
    } catch (error) {
      console.log(`  Error: ${error.message}`);
    }
  }
}

testUrls();
