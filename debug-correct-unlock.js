const axios = require('axios');
const cheerio = require('cheerio');

async function debugCorrectUnlock() {
  console.log('🔍 Debugging Correct Unlock URL');
  console.log('=' .repeat(50));

  try {
    const testLink = 'https://links.kmhd.net/file/Liar_fe8eb354';
    
    // Get initial response
    const initialResponse = await axios.get(testLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://katmoviehd.observer/'
      }
    });
    
    console.log(`Initial status: ${initialResponse.status}`);
    console.log(`Initial redirect: ${initialResponse.request.res.responseUrl}`);
    
    // Parse the form
    const $locked = cheerio.load(initialResponse.data);
    const form = $locked('form');
    const action = form.attr('action');
    
    console.log(`Form action: "${action}"`);
    
    // Try different unlock URL constructions
    const unlockUrls = [
      `https://links.kmhd.net${action}`,
      `https://links.kmhd.net/locked${action}`,
      `https://links.kmhd.net/unlock${action}`,
      `https://links.kmhd.net${action.replace('?', '/')}`,
      `https://links.kmhd.net/locked${action.replace('?', '/')}`,
      `https://links.kmhd.net/unlock${action.replace('?', '/')}`
    ];
    
    for (let i = 0; i < unlockUrls.length; i++) {
      const unlockUrl = unlockUrls[i];
      console.log(`\nTrying unlock URL ${i + 1}: ${unlockUrl}`);
      
      try {
        const unlockResponse = await axios.post(unlockUrl, {}, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': initialResponse.request.res.responseUrl,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Origin': 'https://links.kmhd.net'
          },
          maxRedirects: 5,
          timeout: 5000
        });
        
        console.log(`  ✅ Status: ${unlockResponse.status}`);
        console.log(`  Final URL: ${unlockResponse.request.res.responseUrl}`);
        
        if (unlockResponse.headers['set-cookie']) {
          console.log(`  🍪 Cookies set: ${unlockResponse.headers['set-cookie'].length} cookies`);
        }
        
        // Try to get the unlocked content
        try {
          const unlockedResponse = await axios.get(testLink, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': initialResponse.request.res.responseUrl,
              'Cookie': unlockResponse.headers['set-cookie'] ? unlockResponse.headers['set-cookie'].join('; ') : ''
            },
            timeout: 5000
          });
          
          console.log(`  🔓 Unlocked content status: ${unlockedResponse.status}`);
          
          // Check if we can find server data
          const content = unlockedResponse.data;
          const uploadLinksMatch = content.match(/upload_links:\{([^}]+)\}/);
          if (uploadLinksMatch) {
            console.log(`  🎯 Found upload_links! This URL works!`);
            return unlockUrl;
          } else {
            console.log(`  ❌ No upload_links found`);
          }
          
        } catch (unlockError) {
          console.log(`  ❌ Failed to get unlocked content: ${unlockError.message}`);
        }
        
      } catch (error) {
        console.log(`  ❌ Failed: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugCorrectUnlock();
