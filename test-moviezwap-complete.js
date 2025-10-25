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

async function testCompleteFlow() {
  try {
    console.log('🧪 Testing MoviezWap Complete Flow (App Simulation)');
    console.log('=' .repeat(60));
    
    // Step 1: Test posts extraction (homepage)
    console.log('\n📋 Step 1: Testing Posts Extraction (Homepage)');
    console.log('-'.repeat(40));
    
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
        title: posts[0].title,
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
    
    // Step 2: Test meta extraction (movie details) - use a specific movie with download links
    console.log('\n🎬 Step 2: Testing Meta Extraction (Movie Details)');
    console.log('-'.repeat(40));
    
    // Use the specific movie that has download links
    const movieUrl = "https://www.moviezwap.haus/movie/Bhadrakaali-(2025)-Telugu-Original.html";
    console.log(`🔗 Testing movie: ${movieUrl}`);
      
    const meta = await getMeta({
      link: movieUrl,
      providerContext: providerContext
    });
      
    console.log(`✅ Meta extracted:`, {
      title: meta.title,
      type: meta.type,
      linkListCount: meta.linkList?.length || 0
    });
      
    if (meta.linkList && meta.linkList.length > 0) {
      console.log(`📋 LinkList sample:`, {
        title: meta.linkList[0].title,
        directLinks: meta.linkList[0].directLinks?.length || 0,
        episodesLink: meta.linkList[0].episodesLink ? 'Yes' : 'No'
      });
      
      // Step 3: Test stream extraction (what app calls)
      console.log('\n🎥 Step 3: Testing Stream Extraction (App Call)');
      console.log('-'.repeat(40));
      
      if (meta.linkList[0].directLinks && meta.linkList[0].directLinks.length > 0) {
        const streamUrl = meta.linkList[0].directLinks[0].link;
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
          console.log('\n🔍 Step 4: Testing Stream URLs (Playability)');
          console.log('-'.repeat(40));
          
          for (let i = 0; i < Math.min(2, streams.length); i++) {
            try {
              const streamResponse = await fetch(streams[i].link, {
                method: 'HEAD',
                headers: streams[i].headers || {}
              });
              console.log(`  Stream ${i + 1}: ${streamResponse.status} ${streamResponse.statusText}`);
            } catch (e) {
              console.log(`  Stream ${i + 1}: Error - ${e.message}`);
            }
          }
        }
      } else {
        console.log('❌ No directLinks found in meta');
      }
    } else {
      console.log('❌ No linkList found in meta');
    }
    
    console.log('\n🎉 Complete Flow Test Finished!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testCompleteFlow();