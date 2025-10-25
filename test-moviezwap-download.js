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
const { getMeta } = require('./dist/moviezwap/meta.js');
const { getStream } = require('./dist/moviezwap/stream.js');

async function testDownloadFunctionality() {
  try {
    console.log('🧪 Testing MoviezWap - Download Functionality');
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
      console.log(`📋 LinkList details (should show "Download Movie" option):`);
      meta.linkList.forEach((link, index) => {
        console.log(`  ${index + 1}. "${link.title}"`);
        console.log(`     - directLinks: ${link.directLinks?.length || 0}`);
        if (link.directLinks && link.directLinks.length > 0) {
          console.log(`     - URL: ${link.directLinks[0].link}`);
        }
      });
      
      // Test download extraction (what app calls)
      console.log('\n📥 Step 2: Download Link Extraction');
      console.log('-'.repeat(40));
      
      const downloadLink = meta.linkList.find(link => link.title === "Download Movie");
      
      if (downloadLink && downloadLink.directLinks && downloadLink.directLinks.length > 0) {
        const streamUrl = downloadLink.directLinks[0].link;
        console.log(`🔗 App calls getStream with: ${streamUrl}`);
        
        const streams = await getStream({
          link: streamUrl,
          type: "movie",
          signal: new AbortController().signal,
          providerContext: providerContext
        });
        
        console.log(`✅ Found ${streams.length} download links`);
        streams.forEach((stream, index) => {
          console.log(`  ${index + 1}. ${stream.server} - ${stream.quality}p - ${stream.type}`);
          console.log(`     URL: ${stream.link.substring(0, 80)}...`);
        });
        
        // Test if download URLs are accessible
        if (streams.length > 0) {
          console.log('\n🔍 Step 3: Download URL Accessibility Test');
          console.log('-'.repeat(40));
          
          for (let i = 0; i < Math.min(3, streams.length); i++) {
            try {
              const downloadResponse = await fetch(streams[i].link, {
                method: 'HEAD',
                headers: streams[i].headers || {}
              });
              console.log(`  Download ${i + 1} (${streams[i].quality}p): ${downloadResponse.status} ${downloadResponse.statusText}`);
              console.log(`    Content-Type: ${downloadResponse.headers.get('content-type')}`);
              console.log(`    Content-Length: ${downloadResponse.headers.get('content-length')}`);
              
              if (downloadResponse.status === 200) {
                console.log(`    ✅ Download link is accessible`);
              } else {
                console.log(`    ❌ Download link failed`);
              }
            } catch (e) {
              console.log(`  Download ${i + 1} (${streams[i].quality}p): Error - ${e.message}`);
            }
          }
        }
      } else {
        console.log('❌ No "Download Movie" directLinks found in meta');
      }
    } else {
      console.log('❌ No linkList found in meta');
    }
    
    console.log('\n🎉 Download Functionality Test Finished!');
    console.log('=' .repeat(60));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testDownloadFunctionality();
