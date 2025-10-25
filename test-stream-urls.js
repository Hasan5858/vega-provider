const cheerio = require('cheerio');

// Mock provider context exactly as the app provides it
const providerContext = {
  cheerio: cheerio,
  axios: {
    get: async (url, options = {}) => {
      console.log(`🔗 Fetching: ${url}`);
      const response = await fetch(url, {
        headers: options.headers || {},
        signal: options.signal
      });
      return {
        data: await response.text()
      };
    }
  },
  getBaseUrl: async (provider) => {
    return "https://www.moviezwap.haus/";
  },
  commonHeaders: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://www.moviezwap.haus/'
  }
};

// Import the built modules
const { getStream } = require('./dist/moviezwap/stream.js');

async function testStreamUrls() {
  try {
    console.log('🧪 Testing MoviezWap - Stream URL Validation');
    console.log('=' .repeat(60));
    
    const movieUrl = "https://www.moviezwap.haus/movie/Thank-You-Dear-(2025)-Telugu-Original.html";
    console.log(`🔗 Testing movie: ${movieUrl}`);
    
    const streams = await getStream({
      link: movieUrl,
      type: "movie",
      signal: new AbortController().signal,
      providerContext: providerContext
    });
    
    console.log(`\n✅ Found ${streams.length} streams`);
    
    // Test each stream URL
    for (let i = 0; i < streams.length; i++) {
      const stream = streams[i];
      console.log(`\n🔍 Testing Stream ${i + 1}: ${stream.quality}p`);
      console.log(`   URL: ${stream.link}`);
      console.log(`   Type: ${stream.type}`);
      console.log(`   Server: ${stream.server}`);
      
      try {
        // Test with HEAD request first
        const headResponse = await fetch(stream.link, {
          method: 'HEAD',
          headers: stream.headers || {}
        });
        console.log(`   HEAD Status: ${headResponse.status} ${headResponse.statusText}`);
        console.log(`   Content-Type: ${headResponse.headers.get('content-type')}`);
        console.log(`   Content-Length: ${headResponse.headers.get('content-length')}`);
        
        // Test with partial GET request
        const getResponse = await fetch(stream.link, {
          method: 'GET',
          headers: {
            ...stream.headers,
            'Range': 'bytes=0-1023' // First 1KB
          }
        });
        console.log(`   GET Status: ${getResponse.status} ${getResponse.statusText}`);
        
        if (getResponse.status === 206) {
          console.log(`   ✅ Stream is accessible and supports range requests`);
        } else if (getResponse.status === 200) {
          console.log(`   ✅ Stream is accessible but may not support range requests`);
        } else {
          console.log(`   ❌ Stream access failed`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error testing stream: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testStreamUrls();
