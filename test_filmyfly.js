const { getMeta } = require('./dist/filmyfly/meta.js');

async function testFilmyFly() {
  try {
    console.log('Testing FilmyFly meta function...');
    
    const mockContext = {
      axios: require('axios'),
      cheerio: require('cheerio'),
      commonHeaders: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };
    
    const result = await getMeta({
      link: 'https://filmyfly.deals/page-download/5852/Baaghi-4-2025-Bollywood-Hindi-Movie-HD-ESub.html',
      providerContext: mockContext
    });
    
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testFilmyFly();
