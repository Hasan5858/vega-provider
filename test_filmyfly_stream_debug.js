const { getStream } = require('./dist/filmyfly/stream.js');

async function testStreamDebug() {
  try {
    console.log('Testing FilmyFly stream extraction with debug...');
    
    const result = await getStream({
      link: 'https://linkmake.in/view/Ny4ebkVkM2',
      type: 'movie',
      providerContext: {
        axios: require('axios'),
        cheerio: require('cheerio'),
        extractors: {
          hubcloudExtracter: require('./dist/hubcloudExtractor.js'),
          gofileExtracter: require('./dist/gofileExtracter.js'),
          gdFlixExtracter: require('./dist/gdflixExtractor.js')
        }
      }
    });
    
    console.log('Stream result count:', result?.length || 0);
    
    if (result && result.length > 0) {
      console.log('\nFirst 3 streams:');
      result.slice(0, 3).forEach((stream, index) => {
        console.log(`\nStream ${index + 1}:`);
        console.log('  Server:', stream.server);
        console.log('  Type:', stream.type);
        console.log('  Quality:', stream.quality);
        console.log('  Link:', stream.link.substring(0, 100) + '...');
        console.log('  Link length:', stream.link.length);
        
        // Check if it's a direct file URL
        const isDirectFile = stream.link.includes('.mkv') || stream.link.includes('.mp4') || stream.link.includes('.avi');
        console.log('  Is direct file:', isDirectFile);
        
        // Check if it's a redirect URL
        const isRedirect = stream.link.includes('fastcdn-dl.pages.dev') || stream.link.includes('linkmake.in');
        console.log('  Is redirect URL:', isRedirect);
      });
    }
    
  } catch (error) {
    console.error('Error testing stream:', error);
  }
}

testStreamDebug();
