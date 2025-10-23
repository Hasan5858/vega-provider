const axios = require('axios');
const cheerio = require('cheerio');

async function testFilesdl() {
  try {
    const url = 'https://new6.filesdl.site/cloud/Em9JtGDNHW';
    console.log('🔍 Testing filesdl.site URL:', url);
    console.log('');
    
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://linkmake.in/'
      },
      maxRedirects: 0,
      validateStatus: (status) => status < 400
    });
    
    console.log('📊 Status:', response.status);
    console.log('📊 Headers:', JSON.stringify(response.headers, null, 2));
    console.log('');
    
    const $ = cheerio.load(response.data);
    
    // Look for download links
    const links = $('a[href]').toArray().slice(0, 10);
    console.log(`📦 Found ${links.length} links (showing first 10):`);
    links.forEach((link, i) => {
      const href = $(link).attr('href');
      const text = $(link).text().trim();
      console.log(`${i + 1}. ${text || '(no text)'}: ${href}`);
    });
    
  } catch (error) {
    if (error.response) {
      console.log('🔄 Redirect detected!');
      console.log('📊 Status:', error.response.status);
      console.log('📊 Location:', error.response.headers.location);
    } else {
      console.error('❌ Error:', error.message);
    }
  }
}

testFilesdl();
