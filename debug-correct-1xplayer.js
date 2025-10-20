const axios = require('axios');
const cheerio = require('cheerio');

async function debugCorrect1xplayer() {
  console.log('🔍 Debugging Correct 1xplayer URL Construction');
  console.log('=' .repeat(50));

  try {
    const testLink = 'https://links.kmhd.net/file/Liar_fe8eb354';
    
    // Step 1: Get initial response
    console.log('1️⃣ Getting initial response...');
    const initialResponse = await axios.get(testLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://katmoviehd.observer/'
      }
    });
    
    console.log(`Initial status: ${initialResponse.status}`);
    console.log(`Initial redirect: ${initialResponse.request.res.responseUrl}`);
    
    // Step 2: Unlock
    console.log('\n2️⃣ Unlocking...');
    const $locked = cheerio.load(initialResponse.data);
    const form = $locked('form');
    const action = form.attr('action');
    const lockedUrl = initialResponse.request.res.responseUrl;
    const unlockUrl = `https://links.kmhd.net/locked${action}`;
    
    const unlockResponse = await axios.post(unlockUrl, {}, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': lockedUrl,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Origin': 'https://links.kmhd.net'
      },
      maxRedirects: 5
    });
    
    const cookies = unlockResponse.headers['set-cookie'] ? unlockResponse.headers['set-cookie'].join('; ') : '';
    
    // Step 3: Get unlocked content
    console.log('\n3️⃣ Getting unlocked content...');
    const unlockedResponse = await axios.get(testLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': lockedUrl,
        'Cookie': cookies
      }
    });
    
    const content = unlockedResponse.data;
    
    // Step 4: Look for PUBLIC_CHIBI_PATH
    console.log('\n4️⃣ Looking for PUBLIC_CHIBI_PATH...');
    const chibiPathMatch = content.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
    if (chibiPathMatch) {
      const baseUrl = chibiPathMatch[1];
      console.log(`Found PUBLIC_CHIBI_PATH: ${baseUrl}`);
      
      // Extract file ID
      const fileIdMatch = testLink.match(/\/file\/([^\/]+)$/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        console.log(`File ID: ${fileId}`);
        
        const constructedUrl = `${baseUrl}/${fileId}`;
        console.log(`Constructed URL: ${constructedUrl}`);
        
        // Test if this URL is accessible
        try {
          const testResponse = await axios.head(constructedUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 5000
          });
          
          console.log(`✅ URL accessible: ${testResponse.status}`);
          console.log(`Content-Type: ${testResponse.headers['content-type']}`);
          
          if (testResponse.headers['content-type']?.includes('text/html')) {
            console.log('✅ This is an HTML page - good for 1xplayer');
            
            // Try to get the page content
            const pageResponse = await axios.get(constructedUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              },
              timeout: 5000
            });
            
            const $page = cheerio.load(pageResponse.data);
            
            // Look for video elements
            const videoElements = $page('video');
            console.log(`Video elements found: ${videoElements.length}`);
            
            // Look for iframe elements
            const iframeElements = $page('iframe');
            console.log(`Iframe elements found: ${iframeElements.length}`);
            
            // Look for download links
            const downloadLinks = $page('a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".wmv"], a[href*=".flv"], a[href*=".webm"]');
            console.log(`Download links found: ${downloadLinks.length}`);
            
            if (downloadLinks.length > 0) {
              downloadLinks.each((i, el) => {
                const href = $page(el).attr('href');
                console.log(`Download link ${i + 1}: ${href}`);
              });
            }
            
            // Look for JavaScript variables
            const scriptContent = pageResponse.data;
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
            
          } else {
            console.log('❌ This is not an HTML page');
          }
          
        } catch (testError) {
          console.log(`❌ URL not accessible: ${testError.message}`);
        }
      } else {
        console.log('❌ Could not extract file ID from URL');
      }
    } else {
      console.log('❌ No PUBLIC_CHIBI_PATH found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Status Text: ${error.response.statusText}`);
    }
  }
}

debugCorrect1xplayer();
