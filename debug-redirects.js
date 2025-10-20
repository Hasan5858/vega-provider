const axios = require('axios');

async function debugRedirects() {
  console.log('🔍 Debugging Redirects\n');
  console.log('=' .repeat(60));

  const testUrls = [
    'https://gdflix.dev/file/N54oID7dg713AfK',
    'https://new27.gdtot.dad/file/3853500143', 
    'https://gofile.io/d/D7rlQS'
  ];

  for (const url of testUrls) {
    console.log(`\n📡 Testing: ${url}`);
    
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        maxRedirects: 5,
        timeout: 10000,
        validateStatus: function (status) {
          return status < 500; // Accept any status code less than 500
        }
      });

      console.log(`  Status: ${response.status}`);
      console.log(`  Final URL: ${response.request?.responseURL || response.config?.url}`);
      console.log(`  Content-Type: ${response.headers['content-type']}`);
      console.log(`  Content-Length: ${response.headers['content-length'] || 'Unknown'}`);
      
      // Check if there are any video links in the response
      const cheerio = require('cheerio');
      const $ = cheerio.load(response.data);
      
      const videoLinks = $('a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".webm"], a[href*=".m4v"]');
      console.log(`  Video links found: ${videoLinks.length}`);
      
      videoLinks.each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        console.log(`    ${i+1}. ${href} (${text})`);
      });
      
      // Check for direct video URLs in the HTML
      const videoUrlPattern = /https?:\/\/[^\s"']+\.(mp4|mkv|avi|mov|webm|m4v)(\?[^\s"']*)?/gi;
      const matches = response.data.match(videoUrlPattern);
      if (matches) {
        console.log(`  Direct video URLs in HTML: ${matches.length}`);
        matches.slice(0, 3).forEach((match, i) => {
          console.log(`    ${i+1}. ${match}`);
        });
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
  }
}

debugRedirects();
