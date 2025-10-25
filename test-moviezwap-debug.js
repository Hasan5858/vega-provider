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

async function testStreamDebug() {
  try {
    console.log('🧪 Testing MoviezWap - Stream Debug');
    console.log('=' .repeat(60));
    
    const movieUrl = "https://www.moviezwap.haus/movie/Thank-You-Dear-(2025)-Telugu-Original.html";
    console.log(`🔗 Testing movie: ${movieUrl}`);
    
    const streams = await getStream({
      link: movieUrl,
      type: "movie",
      signal: new AbortController().signal,
      providerContext: providerContext
    });
    
    console.log(`\n✅ Final Result: ${streams.length} streams returned`);
    if (streams.length > 0) {
      console.log('🎯 Streams should now be visible in app!');
    } else {
      console.log('❌ No streams returned - this is the problem!');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testStreamDebug();
