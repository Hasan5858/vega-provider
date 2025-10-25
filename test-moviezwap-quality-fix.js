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

async function testQualityDropdownFix() {
  try {
    console.log('🧪 Testing MoviezWap - Quality Dropdown Fix');
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
      console.log(`📋 LinkList details (should show individual quality options):`);
      meta.linkList.forEach((link, index) => {
        console.log(`  ${index + 1}. "${link.title}"`);
        console.log(`     - directLinks: ${link.directLinks?.length || 0}`);
        if (link.directLinks && link.directLinks.length > 0) {
          console.log(`     - URL: ${link.directLinks[0].link}`);
        }
      });
      
      // Test stream extraction for each quality
      console.log('\n🎥 Step 2: Stream Extraction for Each Quality');
      console.log('-'.repeat(40));
      
      for (const link of meta.linkList) {
        if (link.directLinks && link.directLinks.length > 0) {
          const streamUrl = link.directLinks[0].link;
          const quality = link.title; // e.g., "320p", "480p", "720p"
          
          console.log(`\n🔗 Testing quality: ${quality}`);
          console.log(`   URL: ${streamUrl}`);
          
          const streams = await getStream({
            link: streamUrl,
            type: quality, // Pass the quality as type
            signal: new AbortController().signal,
            providerContext: providerContext
          });
          
          console.log(`   ✅ Found ${streams.length} streams for ${quality}`);
          streams.forEach((stream, index) => {
            console.log(`     ${index + 1}. ${stream.server} - ${stream.quality}p - ${stream.type}`);
            console.log(`        URL: ${stream.link.substring(0, 80)}...`);
          });
          
          // Test if streams are actually playable
          if (streams.length > 0) {
            try {
              const streamResponse = await fetch(streams[0].link, {
                method: 'HEAD',
                headers: streams[0].headers || {}
              });
              console.log(`   🎯 Playability: ${streamResponse.status} ${streamResponse.statusText}`);
            } catch (e) {
              console.log(`   ❌ Playability: Error - ${e.message}`);
            }
          }
        }
      }
    } else {
      console.log('❌ No linkList found in meta');
    }
    
    console.log('\n🎉 Quality Dropdown Fix Test Finished!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testQualityDropdownFix();
