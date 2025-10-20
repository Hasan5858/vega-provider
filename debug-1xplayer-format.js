const axios = require('axios');
const cheerio = require('cheerio');

async function debug1xplayerFormat() {
  console.log('🔍 Debugging 1xplayer URL Format');
  console.log('=' .repeat(50));

  try {
    // Test with the working example from our previous tests
    const workingLink = 'https://links.kmhd.net/file/Ask_048cb9c4';
    
    console.log(`Testing with working link: ${workingLink}`);
    
    // Step 1: Get initial response
    const initialResponse = await axios.get(workingLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://katmoviehd.observer/'
      }
    });
    
    // Step 2: Unlock
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
    const unlockedResponse = await axios.get(workingLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': lockedUrl,
        'Cookie': cookies
      }
    });
    
    const content = unlockedResponse.data;
    
    // Look for different patterns that might contain the correct 1xplayer URL
    console.log('\n🔍 Looking for 1xplayer URL patterns...');
    
    // Pattern 1: Look for any 1xplayer.com URLs
    const onexplayerMatches = content.match(/https?:\/\/[^"'\s]*1xplayer\.com[^"'\s]*/g);
    if (onexplayerMatches) {
      console.log('Found 1xplayer URLs:');
      onexplayerMatches.forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
    }
    
    // Pattern 2: Look for upload-kat.mm.1xplayer.com URLs
    const uploadKatMatches = content.match(/https?:\/\/[^"'\s]*upload-kat\.mm\.1xplayer\.com[^"'\s]*/g);
    if (uploadKatMatches) {
      console.log('Found upload-kat URLs:');
      uploadKatMatches.forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
    }
    
    // Pattern 3: Look for any URLs that might be player URLs
    const playerMatches = content.match(/https?:\/\/[^"'\s]*(?:player|watch|stream)[^"'\s]*/g);
    if (playerMatches) {
      console.log('Found player/watch/stream URLs:');
      playerMatches.forEach((url, i) => {
        console.log(`  ${i + 1}. ${url}`);
      });
    }
    
    // Pattern 4: Look for the specific format we're constructing
    const chibiPathMatch = content.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
    if (chibiPathMatch) {
      const baseUrl = chibiPathMatch[1];
      console.log(`\nPUBLIC_CHIBI_PATH: ${baseUrl}`);
      
      const fileIdMatch = workingLink.match(/\/file\/([^\/]+)$/);
      if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        console.log(`File ID: ${fileId}`);
        
        // Try different URL constructions
        const constructions = [
          `${baseUrl}/${fileId}`,
          `${baseUrl}/player/${fileId}`,
          `${baseUrl}/watch/${fileId}`,
          `${baseUrl}/stream/${fileId}`,
          `https://1xplayer.com/player/${fileId}`,
          `https://1xplayer.com/watch/${fileId}`,
          `https://1xplayer.com/stream/${fileId}`
        ];
        
        console.log('\nTesting different URL constructions:');
        for (const url of constructions) {
          try {
            const testResponse = await axios.head(url, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              },
              timeout: 3000
            });
            
            console.log(`✅ ${url} - Status: ${testResponse.status}, Type: ${testResponse.headers['content-type']}`);
            
            if (testResponse.headers['content-type']?.includes('text/html')) {
              console.log(`  🎯 This looks like a player page!`);
            }
            
          } catch (error) {
            console.log(`❌ ${url} - ${error.message}`);
          }
        }
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Status Text: ${error.response.statusText}`);
    }
  }
}

debug1xplayerFormat();
