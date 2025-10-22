const { getMeta } = require('./dist/filmyfly/meta.js');

async function testMeta() {
  try {
    console.log('Testing FilmyFly meta extraction...');
    
    const result = await getMeta({
      link: 'https://filmyfly.observer/page-download/5852/Baaghi-4-2025-Bollywood-Hindi-Movie-HD-ESub.html',
      providerContext: {
        axios: require('axios'),
        cheerio: require('cheerio'),
        commonHeaders: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    });
    
    console.log('Meta result:');
    console.log('Title:', result.title);
    console.log('Type:', result.type);
    console.log('Links count:', result.linkList?.length || 0);
    
    if (result.linkList && result.linkList.length > 0) {
      result.linkList.forEach((link, index) => {
        console.log(`\nLink ${index + 1}:`);
        console.log('  Title:', link.title);
        console.log('  Quality:', link.quality);
        console.log('  Direct Links:', link.directLinks?.length || 0);
        if (link.directLinks) {
          link.directLinks.forEach((dl, dlIndex) => {
            console.log(`    ${dlIndex + 1}. ${dl.title} - ${dl.link.substring(0, 50)}...`);
          });
        }
      });
    }
    
  } catch (error) {
    console.error('Error testing meta:', error);
  }
}

testMeta();
