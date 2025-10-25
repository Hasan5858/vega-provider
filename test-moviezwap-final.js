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
const { getPosts } = require('./dist/moviezwap/posts.js');
const { getMeta } = require('./dist/moviezwap/meta.js');
const { getStream } = require('./dist/moviezwap/stream.js');

async function testCompleteAppFlow() {
  try {
    console.log('🧪 Testing MoviezWap - Complete App Flow Simulation');
    console.log('=' .repeat(70));
    
    // Step 1: Test posts extraction (homepage)
    console.log('\n📋 Step 1: Homepage Posts Extraction');
    console.log('-'.repeat(50));
    
    const posts = await getPosts({
      filter: "/category/Telugu-(2025)-Movies.html",
      page: 1,
      providerValue: "moviezwap",
      signal: new AbortController().signal,
      providerContext: providerContext
    });
    
    console.log(`✅ Found ${posts.length} posts`);
    if (posts.length > 0) {
      console.log(`📝 Sample post:`, {
        title: posts[0].title.substring(0, 50) + '...',
        image: posts[0].image,
        link: posts[0].link
      });
      
      // Test thumbnail URL
      if (posts[0].image) {
        try {
          const thumbResponse = await fetch(posts[0].image);
          console.log(`🖼️  Thumbnail status: ${thumbResponse.status} ${thumbResponse.statusText}`);
        } catch (e) {
          console.log(`❌ Thumbnail error: ${e.message}`);
        }
      }
    }
    
    // Step 2: Test meta extraction (movie details) - use the specific movie from screenshot
    console.log('\n🎬 Step 2: Movie Details Extraction');
    console.log('-'.repeat(50));
    
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
      console.log(`📋 LinkList details:`);
      meta.linkList.forEach((link, index) => {
        console.log(`  ${index + 1}. "${link.title}"`);
        console.log(`     - directLinks: ${link.directLinks?.length || 0}`);
        console.log(`     - episodesLink: ${link.episodesLink ? 'Yes' : 'No'}`);
        if (link.directLinks && link.directLinks.length > 0) {
          console.log(`     - URL: ${link.directLinks[0].link}`);
        }
      });
      
      // Step 3: Test stream extraction (what app calls)
      console.log('\n🎥 Step 3: Stream Extraction (App Call)');
      console.log('-'.repeat(50));
      
      // Find the directLinks entry (should be "Watch Movie")
      const watchMovieLink = meta.linkList.find(link => link.title === "Watch Movie");
      
      if (watchMovieLink && watchMovieLink.directLinks && watchMovieLink.directLinks.length > 0) {
        const streamUrl = watchMovieLink.directLinks[0].link;
        console.log(`🔗 App calls getStream with: ${streamUrl}`);
        
        const streams = await getStream({
          link: streamUrl,
          type: "movie",
          signal: new AbortController().signal,
          providerContext: providerContext
        });
        
        console.log(`✅ Found ${streams.length} streams`);
        streams.forEach((stream, index) => {
          console.log(`  ${index + 1}. ${stream.server} - ${stream.quality}p - ${stream.type}`);
          console.log(`     URL: ${stream.link.substring(0, 80)}...`);
        });
        
        // Test if streams are actually playable
        if (streams.length > 0) {
          console.log('\n🔍 Step 4: Stream URL Playability Test');
          console.log('-'.repeat(50));
          
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
    
    console.log('\n🎉 Complete App Flow Test Finished!');
    console.log('=' .repeat(70));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testCompleteAppFlow();
