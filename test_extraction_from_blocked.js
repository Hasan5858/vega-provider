const axios = require('axios');
const cheerio = require('cheerio');

async function testExtraction() {
  try {
    console.log('🔍 Testing extraction from FilesD1 blocked URLs\n');
    console.log('='.repeat(90));

    // Test Direct Download URL
    const directDownloadUrl = 'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBNdjNob3JlT0ZubjdrT2thTmFwYzdsUEgtaHczZ3FSTE93MkpWZHJTTFpkeXBVbGg0QjZZUHpyOF8wS1RzTDNBP2tleT1PVTF6WkdKWVVUVTNOM1pVYTI1eE9Fd3pObmhRVDNjNVV5MDBORFpu&token=MjIxMDI1';
    
    console.log('\n🔗 URL 1: Direct Download (FilesD1)\n');
    console.log(`Full URL: ${directDownloadUrl.substring(0, 100)}...`);

    try {
      const response = await axios.get(directDownloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://filesdl.site/',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Connection': 'keep-alive'
        },
        timeout: 10000,
        maxRedirects: 5
      });

      const pageContent = response.data;
      const pageLength = pageContent.length;

      console.log(`\n📊 Page Content Analysis:`);
      console.log(`   Content Length: ${pageLength} bytes`);
      console.log(`   Status: ${response.status}`);

      // Check for different extraction patterns
      console.log(`\n🔎 Checking for extraction patterns:\n`);

      // Check 1: eval(function) pattern
      if (pageContent.includes('eval(function')) {
        console.log(`   ✅ Found: eval(function) - Can use superVideoExtractor`);
        const evalMatch = pageContent.match(/eval\(function\([^)]*\)\{.*?\}\('(.*?)'\./);
        if (evalMatch) {
          console.log(`      Pattern found: YES`);
        }
      } else {
        console.log(`   ❌ Not found: eval(function)`);
      }

      // Check 2: .m3u8 URLs
      const m3u8Matches = pageContent.match(/https?:\/\/[^\s"'<>]*\.m3u8[^\s"'<>]*/gi);
      if (m3u8Matches && m3u8Matches.length > 0) {
        console.log(`   ✅ Found: ${m3u8Matches.length} .m3u8 URL(s)`);
        m3u8Matches.forEach((url, i) => {
          console.log(`      ${i+1}. ${url.substring(0, 80)}...`);
        });
      } else {
        console.log(`   ❌ Not found: .m3u8 URLs`);
      }

      // Check 3: .mkv URLs
      const mkvMatches = pageContent.match(/https?:\/\/[^\s"'<>]*\.mkv[^\s"'<>]*/gi);
      if (mkvMatches && mkvMatches.length > 0) {
        console.log(`   ✅ Found: ${mkvMatches.length} .mkv URL(s)`);
        mkvMatches.forEach((url, i) => {
          console.log(`      ${i+1}. ${url.substring(0, 80)}...`);
        });
      } else {
        console.log(`   ❌ Not found: .mkv URLs`);
      }

      // Check 4: .mp4 URLs
      const mp4Matches = pageContent.match(/https?:\/\/[^\s"'<>]*\.mp4[^\s"'<>]*/gi);
      if (mp4Matches && mp4Matches.length > 0) {
        console.log(`   ✅ Found: ${mp4Matches.length} .mp4 URL(s)`);
        mp4Matches.forEach((url, i) => {
          console.log(`      ${i+1}. ${url.substring(0, 80)}...`);
        });
      } else {
        console.log(`   ❌ Not found: .mp4 URLs`);
      }

      // Check 5: location/redirect
      if (response.headers.location) {
        console.log(`   ✅ Found: Location header (redirect)`);
        console.log(`      ${response.headers.location}`);
      } else {
        console.log(`   ❌ Not found: Location header`);
      }

      // Check 6: HTML structure
      const $ = cheerio.load(pageContent);
      const links = $('a[href]').toArray();
      if (links.length > 0) {
        console.log(`   ✅ Found: ${links.length} links in HTML`);
        
        // Filter for video-like links
        const videoLinks = links.filter(link => {
          const href = $(link).attr('href');
          return href && (href.includes('.mkv') || href.includes('.mp4') || href.includes('.m3u8') || href.includes('video') || href.includes('stream'));
        });
        
        if (videoLinks.length > 0) {
          console.log(`   ✅ Found: ${videoLinks.length} potential video links in HTML`);
          videoLinks.slice(0, 5).forEach((link, i) => {
            const href = $(link).attr('href');
            const text = $(link).text().trim();
            console.log(`      ${i+1}. [${text}] ${href.substring(0, 60)}...`);
          });
        }
      } else {
        console.log(`   ❌ Not found: HTML links`);
      }

      // Check 7: JSON data
      const jsonMatches = pageContent.match(/\{[^{}]*(?:"url"|"link"|"src"|"stream")[^{}]*\}/gi);
      if (jsonMatches && jsonMatches.length > 0) {
        console.log(`   ✅ Found: ${jsonMatches.length} JSON objects with url/link/src/stream`);
        jsonMatches.slice(0, 3).forEach((json, i) => {
          console.log(`      ${i+1}. ${json.substring(0, 80)}...`);
        });
      } else {
        console.log(`   ❌ Not found: JSON with url/link/src`);
      }

      // Check 8: Cloudflare challenge
      if (pageContent.includes('challenge') || pageContent.includes('cf_clearance')) {
        console.log(`   ⚠️  Found: Cloudflare challenge/protection`);
      }

      // Show first 2KB of content for analysis
      console.log(`\n📄 Page Content Preview (first 2000 chars):\n`);
      console.log('─'.repeat(90));
      console.log(pageContent.substring(0, 2000));
      console.log('─'.repeat(90));

    } catch (error) {
      console.log(`❌ Error fetching page: ${error.message}`);
      if (error.response) {
        console.log(`   Status: ${error.response.status}`);
        console.log(`   Data preview: ${error.response.data.substring(0, 500)}`);
      }
    }

    console.log('\n' + '='.repeat(90));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testExtraction();
