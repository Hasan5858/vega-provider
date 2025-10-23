const axios = require('axios');
const cheerio = require('cheerio');

async function testURLExtraction() {
  try {
    // Test with the same linkmake URL from logs
    const url = 'https://linkmake.in/view/1nbv4JbVt6';
    console.log('🔍 Testing URL extraction from:', url);
    console.log('');
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Test our current selector
    const elements = $("a[href]:contains('Download'), .button2,.button1,.button3,.button4,.button").toArray();
    
    console.log(`📦 Found ${elements.length} total elements`);
    console.log('');
    
    for (let i = 0; i < Math.min(elements.length, 10); i++) {
      const element = $(elements[i]);
      const title = element.text().trim();
      const link = element.attr('href');
      
      console.log(`${i + 1}. Title: ${title}`);
      console.log(`   Link: ${link}`);
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testURLExtraction();
