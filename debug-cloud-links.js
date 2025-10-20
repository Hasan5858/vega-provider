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
      // Return mock direct video URLs for testing
      return [
        {
          server: 'Test Server',
          link: 'https://example.com/video1.mp4',
          type: 'mp4',
          quality: '1080'
        }
      ];
    }
  }
};

// Load the compiled provider modules
const katfixProvider = {
  getStream: require('./dist/katfix/stream').getStream
};

async function debugCloudLinks() {
  console.log('🔍 Debugging Cloud Storage Links\n');
  console.log('=' .repeat(60));

  // Test with the same link from the logs
  const testLink = 'https://katlinks.in/archives/68567';
  
  try {
    console.log(`\n📡 Testing link: ${testLink}`);
    
    // First, let's see what the page contains
    const response = await axios.get(testLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    console.log(`✅ Page loaded successfully (${response.data.length} chars)`);
    
    // Check what cloud storage links are found
    const cloudSelectors = [
      "a[href*='gofile.io']",
      "a[href*='send.cm']", 
      "a[href*='gdflix']",
      "a[href*='filepress']",
      "a[href*='gdtot']",
      "a[href*='pixeldrain.dev']",
      "a[href*='hubcloud']",
      "a[href*='1fichier.com']",
      "a[href*='mega.nz']",
      "a[href*='drive.google.com']"
    ];
    
    console.log('\n🔍 Cloud storage links found:');
    cloudSelectors.forEach(selector => {
      const links = $(selector);
      console.log(`  ${selector}: ${links.length} links`);
      links.each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        console.log(`    ${i+1}. ${href} (${text})`);
      });
    });
    
    // Now test the stream extraction
    console.log('\n📡 Testing stream extraction...');
    const streams = await katfixProvider.getStream({
      link: testLink,
      type: 'movie',
      signal: new AbortController().signal,
      providerContext
    });
    
    console.log(`\n📊 Stream extraction results:`);
    console.log(`  Found ${streams.length} streams`);
    streams.forEach((stream, i) => {
      console.log(`  ${i+1}. Server: ${stream.server}`);
      console.log(`     Link: ${stream.link}`);
      console.log(`     Type: ${stream.type}`);
      console.log(`     Quality: ${stream.quality}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugCloudLinks();
