const { hubcloudExtracter } = require('./dist/hubcloudExtractor.js');

async function testBbdownload() {
  const testUrl = 'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBQc2NwUF90VEhsRTVScTRRSE9iaHBmY0JnRkZ1R1JrWm1WaGMxejNaSmFGN29uP2tleT1aRTlKUmtvNE9FbEJRMnhNZWxwcllYSkNRMkk1VVZGbFp3&name=Baaghi+4+%282025%29+Bollywood+Hindi+Movie+480p.mkv';
  
  console.log('Testing bbdownload URL extraction...');
  console.log('URL:', testUrl.substring(0, 100) + '...');
  
  try {
    const streams = await hubcloudExtracter(testUrl, new AbortController().signal);
    
    console.log(`\n✅ Extracted ${streams.length} streams:`);
    streams.forEach((stream, index) => {
      console.log(`\nStream ${index + 1}:`);
      console.log('  Server:', stream.server);
      console.log('  Type:', stream.type);
      console.log('  Link:', stream.link.substring(0, 100) + '...');
    });
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testBbdownload();
