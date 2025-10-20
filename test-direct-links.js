const axios = require('axios');
const cheerio = require('cheerio');

// Mock provider context
const providerContext = {
  axios,
  cheerio,
  getBaseUrl: async (provider) => {
    return 'https://katmoviefix.cards';
  },
  extractors: {
    hubcloudExtracter: async (link, signal) => {
      console.log(`🔍 Mock hubcloudExtracter called with: ${link}`);
      return [];
    }
  }
};

// Load the compiled provider modules
const katfixProvider = {
  getStream: require('./dist/katfix/stream').getStream
};

async function testDirectLinks() {
  console.log('🔍 Testing Direct Download Links\n');
  console.log('=' .repeat(60));

  // Test with the same link from the logs
  const testLink = 'https://katlinks.in/archives/68567';
  
  try {
    console.log(`\n📡 Testing link: ${testLink}`);
    
    // Test the stream extraction
    const streams = await katfixProvider.getStream({
      link: testLink,
      type: 'movie',
      signal: new AbortController().signal,
      providerContext
    });
    
    console.log(`\n📊 Stream extraction results:`);
    console.log(`  Found ${streams.length} streams`);
    
    if (streams.length === 0) {
      console.log('❌ No streams found!');
      return;
    }
    
    streams.forEach((stream, i) => {
      console.log(`\n  ${i+1}. Server: ${stream.server}`);
      console.log(`     Link: ${stream.link}`);
      console.log(`     Type: ${stream.type}`);
      console.log(`     Quality: ${stream.quality}`);
      
      // Check if it's a direct video file
      const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
      const isDirectVideo = videoExtensions.test(stream.link);
      
      if (isDirectVideo) {
        console.log(`     ✅ Direct video file detected`);
      } else {
        console.log(`     ⚠️  Not a direct video file (download page)`);
      }
    });
    
    // Test if the URLs are accessible
    console.log(`\n🌐 Testing URL accessibility:`);
    for (const stream of streams) {
      try {
        const response = await axios.head(stream.link, {
          timeout: 5000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        
        console.log(`  ✅ ${stream.server}: ${response.status} - ${response.headers['content-type'] || 'Unknown type'}`);
        
        // Check content type
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('video/')) {
          console.log(`     🎥 Video content detected!`);
        } else if (contentType.includes('text/html')) {
          console.log(`     📄 HTML page (download page)`);
        } else {
          console.log(`     ❓ Unknown content type: ${contentType}`);
        }
        
      } catch (error) {
        console.log(`  ❌ ${stream.server}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDirectLinks();
