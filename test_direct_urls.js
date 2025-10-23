const axios = require('axios');

async function testDirectUrls() {
  try {
    // Test URLs from filesdl.site
    const urls = {
      fastCloud: 'https://awsssaaaa.awsstorage11.online/y0t27n/Kadaram%20Kondan%20%282019%29%20%28Hindi%20%2B%20Tamil%29%20Dual%20Audio%20UnCut%20South%20Movie%20HEVC%20720p%20ESub.mkv?expired=H68f8d6a0e6b278.563916241d56ad34eedcecf1&userid=6861074175625&vaid=68f8d6a0e6b3d8.93799946',
      directDownload: 'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBNdjNob3JlT0ZubjdrT2thTmFwYzdsUEgtaHczZ3FSTE93MkpWZHJTTFpkeXBVbGg0QjZZUHpyOF8wS1RzTDNBP2tleT1PVTF6WkdKWVVUVTNOM1pVYTI1eE9Fd3pObmhRVDNjNVV5MDBORFpu&token=MjIxMDI1',
      ultraFastDL: 'https://bbdownload.iwabp.xyz/fastdla.php?id=MAmjO9p1HR6R&name=Kadaram+Kondan+%282019%29+%28Hindi+%2B+Tamil%29+Dual+Audio+UnCut+South+Movie+HEVC+720p+ESub.mkv',
      fastCloud02: 'https://bbdownload.filesdl.in/adl.php?id=oqh9nqznf38u'
    };

    console.log('🔍 Testing Direct URLs to check if they are playable or need extraction\n');
    console.log('='.repeat(90));

    for (const [name, url] of Object.entries(urls)) {
      console.log(`\n🔗 Testing: ${name.toUpperCase()}`);
      console.log(`   URL: ${url.substring(0, 80)}...`);
      
      try {
        const response = await axios.head(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://filesdl.site/'
          },
          timeout: 5000,
          maxRedirects: 5,
          validateStatus: (status) => status < 400
        });

        console.log(`   📊 Status: ${response.status}`);
        console.log(`   📊 Content-Type: ${response.headers['content-type']}`);
        console.log(`   📊 Content-Length: ${response.headers['content-length']}`);
        
        // Check if it's a direct video file
        const contentType = response.headers['content-type'] || '';
        if (contentType.includes('video') || contentType.includes('mkv') || contentType.includes('mp4')) {
          console.log(`   ✅ DIRECT VIDEO LINK - Can pass to player directly`);
        } else if (contentType.includes('text/html')) {
          console.log(`   ⚠️  HTML PAGE - Needs extraction/processing`);
          
          // Try to get the page and check for video extraction patterns
          try {
            const pageRes = await axios.get(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://filesdl.site/'
              },
              timeout: 5000,
              maxRedirects: 5
            });
            
            const pageContent = pageRes.data;
            
            // Check for common video extraction patterns
            if (pageContent.includes('eval(function')) {
              console.log(`      🔧 Found: eval(function) - NEEDS superVideoExtractor`);
            }
            if (pageContent.includes('.m3u8')) {
              console.log(`      🔧 Found: .m3u8 pattern - NEEDS superVideoExtractor`);
            }
            if (pageContent.includes('file:')) {
              console.log(`      🔧 Found: file: pattern - NEEDS extraction`);
            }
            if (pageContent.match(/https?:\/\/[^\s"'<>]+\.(mkv|mp4|m3u8)/gi)) {
              const matches = pageContent.match(/https?:\/\/[^\s"'<>]+\.(mkv|mp4|m3u8)/gi);
              console.log(`      ✅ Found direct video URLs in page: ${matches.length} match(es)`);
              console.log(`         First match: ${matches[0].substring(0, 60)}...`);
            }
          } catch (pageErr) {
            console.log(`      ❌ Error fetching page content: ${pageErr.message}`);
          }
        } else if (contentType.includes('application/octet-stream') || contentType.includes('application/x-mkv')) {
          console.log(`   ✅ DIRECT VIDEO BINARY - Can pass to player directly`);
        } else if (contentType.includes('text/plain') && url.includes('.mkv')) {
          console.log(`   ✅ MKV FILE (text/plain header) - Can pass to player directly`);
        } else {
          console.log(`   ❓ UNKNOWN - Content-Type: ${contentType}`);
        }
        
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
        if (error.response) {
          console.log(`      Status: ${error.response.status}`);
          console.log(`      Headers: ${JSON.stringify(error.response.headers, null, 2)}`);
        }
      }
    }

    console.log('\n' + '='.repeat(90));
    console.log('\n📋 SUMMARY:\n');
    console.log('Fast Cloud (AWS)        → Direct .mkv URL? Need to check content-type');
    console.log('Direct Download (FilesD1) → HTML page that may need extraction');
    console.log('Ultra FastDL            → Unknown (need to test)');
    console.log('Fast Cloud-02           → Unknown (need to test)');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDirectUrls();
