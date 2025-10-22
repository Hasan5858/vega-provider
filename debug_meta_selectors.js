const axios = require('axios');
const cheerio = require('cheerio');

async function debugMetaSelectors() {
  try {
    console.log('Debugging meta selectors...');
    
    const url = 'https://filmyfly.observer/page-download/5852/Baaghi-4-2025-Bollywood-Hindi-Movie-HD-ESub.html';
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    };
    
    const res = await axios.get(url, { headers });
    const data = res.data;
    const $ = cheerio.load(data);
    
    console.log('Testing selectors:');
    console.log('.dlbtn count:', $('.dlbtn').length);
    console.log('.dlbtn a count:', $('.dlbtn a').length);
    console.log('.dlbtn a href:', $('.dlbtn a').attr('href'));
    console.log('.dlbtn a text:', JSON.stringify($('.dlbtn a').text().trim()));
    
    console.log('\nTesting other selectors:');
    console.log('.dwd-button count:', $('.dwd-button').length);
    console.log('a[href*="linkmake"] count:', $('a[href*="linkmake"]').length);
    
    // Test the actual meta function
    console.log('\nTesting meta function:');
    const { getMeta } = require('./dist/filmyfly/meta.js');
    
    const result = await getMeta({
      link: url,
      providerContext: {
        axios: require('axios'),
        cheerio: require('cheerio'),
        commonHeaders: headers
      }
    });
    
    console.log('Meta result links count:', result.linkList?.length || 0);
    if (result.linkList && result.linkList.length > 0) {
      result.linkList.forEach((link, index) => {
        console.log(`Link ${index + 1}:`, {
          title: link.title,
          quality: link.quality,
          directLinksCount: link.directLinks?.length || 0
        });
      });
    }
    
  } catch (error) {
    console.error('Error debugging meta selectors:', error);
  }
}

debugMetaSelectors();
