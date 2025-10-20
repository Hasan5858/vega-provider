const axios = require('axios');
const cheerio = require('cheerio');

async function debug1xplayerUrl() {
  console.log('🔍 Debugging 1xplayer URL');
  console.log('=' .repeat(50));

  try {
    const testUrl = 'https://upload-kat.mm.1xplayer.com/static/assets/index-legacy-kEKQzjId.js';
    
    console.log(`Testing URL: ${testUrl}`);
    
    const response = await axios.get(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers['content-type']}`);
    console.log(`Content length: ${response.data.length}`);
    
    if (response.headers['content-type']?.includes('javascript')) {
      console.log('❌ This is a JavaScript file, not a video page');
      console.log('First 200 chars:', response.data.substring(0, 200));
    } else {
      console.log('✅ This appears to be HTML content');
      
      const $ = cheerio.load(response.data);
      
      // Look for video elements
      const videoElements = $('video');
      console.log(`Video elements found: ${videoElements.length}`);
      
      // Look for iframe elements
      const iframeElements = $('iframe');
      console.log(`Iframe elements found: ${iframeElements.length}`);
      
      // Look for download links
      const downloadLinks = $('a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".wmv"], a[href*=".flv"], a[href*=".webm"]');
      console.log(`Download links found: ${downloadLinks.length}`);
      
      if (downloadLinks.length > 0) {
        downloadLinks.each((i, el) => {
          const href = $(el).attr('href');
          console.log(`Download link ${i + 1}: ${href}`);
        });
      }
      
      // Look for JavaScript variables
      const scriptContent = response.data;
      const patterns = [
        /file:\s*["']([^"']+)["']/i,
        /src:\s*["']([^"']+)["']/i,
        /url:\s*["']([^"']+)["']/i,
        /"url":\s*"([^"]+)"/i,
        /'url':\s*'([^']+)'/i,
        /videoUrl:\s*["']([^"']+)["']/i,
        /streamUrl:\s*["']([^"']+)["']/i,
        /playUrl:\s*["']([^"']+)["']/i
      ];
      
      patterns.forEach((pattern, i) => {
        const matches = scriptContent.match(pattern);
        if (matches) {
          console.log(`Pattern ${i + 1} matched: ${matches[0]}`);
          if (matches[1]) {
            console.log(`  Captured: ${matches[1]}`);
          }
        }
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Status Text: ${error.response.statusText}`);
    }
  }
}

debug1xplayerUrl();
