const cheerio = require('cheerio');

// Mock provider context exactly as the app provides it
const providerContext = {
  cheerio: cheerio,
  axios: {
    get: async (url, options = {}) => {
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
const { getMeta } = require('./dist/moviezwap/meta.js');
const { getStream } = require('./dist/moviezwap/stream.js');

async function testStreamsFix() {
  try {
    console.log('🧪 Testing MoviezWap - Streams Fix (App Approach)');
    console.log('=' .repeat(60));
    
    // Test meta extraction (movie details)
    console.log('\n🎬 Step 1: Movie Details Extraction');
    console.log('-'.repeat(40));
    
    const movieUrl = "https://www.moviezwap.haus/movie/Thank-You-Dear-(2025)-Telugu-Original.html";
    console.log(`🔗 Testing movie: ${movieUrl}`);
      
    const meta = await getMeta({
      link: movieUrl,
      providerContext: providerContext
    });
      
    console.log(`✅ Meta extracted:`, {
      title: meta.title.substring(0, 60) + '...',
      type: meta.type,
      linkListCount: meta.linkList?.length || 0
    });
      
    if (meta.linkList && meta.linkList.length > 0) {
      console.log(`📋 LinkList details (should show single "Watch Movie" option):`);
      meta.linkList.forEach((link, index) => {
        console.log(`  ${index + 1}. "${link.title}"`);
        console.log(`     - directLinks: ${link.directLinks?.length || 0}`);
        if (link.directLinks && link.directLinks.length > 0) {
          console.log(`     - URL: ${link.directLinks[0].link}`);
        }
      });
      
      // Test stream extraction (what app calls)
      console.log('\n🎥 Step 2: Stream Extraction (App Call)');
      console.log('-'.repeat(40));
      
      const watchMovieLink = meta.linkList.find(link => link.title === "Watch Movie");
      
      if (watchMovieLink && watchMovieLink.directLinks && watchMovieLink.directLinks.length > 0) {
        const streamUrl = watchMovieLink.directLinks[0].link;
        console.log(`🔗 App calls getStream with: ${streamUrl}`);
        console.log(`   type: "movie" (as app passes)`);
        
        const streams = await getStream({
          link: streamUrl,
          type: "movie", // This is what the app actually passes
          signal: new AbortController().signal,
          providerContext: providerContext
        });
        
        console.log(`✅ Found ${streams.length} streams (all qualities)`);
        streams.forEach((stream, index) => {
          console.log(`  ${index + 1}. ${stream.server} - ${stream.quality}p - ${stream.type}`);
          console.log(`     URL: ${stream.link.substring(0, 80)}...`);
        });
        
        // Test if streams are actually playable
        if (streams.length > 0) {
          console.log('\n🔍 Step 3: Stream URL Playability Test');
          console.log('-'.repeat(40));
          
          for (let i = 0; i < Math.min(3, streams.length); i++) {
            try {
              const streamResponse = await fetch(streams[i].link, {
                method: 'HEAD',
                headers: streams[i].headers || {}
              });
              console.log(`  Stream ${i + 1} (${streams[i].quality}p): ${streamResponse.status} ${streamResponse.statusText}`);
            } catch (e) {
              console.log(`  Stream ${i + 1} (${streams[i].quality}p): Error - ${e.message}`);
            }
          }
        }
      } else {
        console.log('❌ No "Watch Movie" directLinks found in meta');
      }
    } else {
      console.log('❌ No linkList found in meta');
    }
    
    console.log('\n🎉 Streams Fix Test Finished!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testStreamsFix();
