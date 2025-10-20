const axios = require('axios');
const cheerio = require('cheerio');

async function debugUrlConstruction() {
  console.log('🔍 Debugging URL Construction Process');
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
    
    // Step 4: Look for upload_links first
    console.log('\n4️⃣ Looking for upload_links...');
    const uploadLinksMatch = content.match(/upload_links:\{([^}]+)\}/);
    if (uploadLinksMatch) {
      console.log('✅ Found upload_links!');
      const uploadLinksStr = uploadLinksMatch[1];
      
      // Parse upload links manually
      const uploadLinks = {};
      const linkPairs = uploadLinksStr.split(',');
      linkPairs.forEach(pair => {
        const [key, value] = pair.split(':');
        if (key && value) {
          uploadLinks[key.trim()] = value.trim().replace(/"/g, '');
        }
      });
      
      console.log('Parsed upload links:', uploadLinks);
      
      // Look for server links
      const serverLinks = {};
      
      const hubdriveMatch = content.match(/hubdrive_res:\{mx:(\d+),link:"([^"]+)"/);
      if (hubdriveMatch) {
        serverLinks.hubdrive_res = {
          mx: parseInt(hubdriveMatch[1]),
          link: hubdriveMatch[2]
        };
        console.log('Found hubdrive_res:', serverLinks.hubdrive_res);
      }
      
      const gdflixMatch = content.match(/gdflix_res:\{mx:(\d+),link:"([^"]+)"/);
      if (gdflixMatch) {
        serverLinks.gdflix_res = {
          mx: parseInt(gdflixMatch[1]),
          link: gdflixMatch[2]
        };
        console.log('Found gdflix_res:', serverLinks.gdflix_res);
      }
      
      // Try to construct server URLs
      const serverOrder = ['hubdrive_res', 'gdflix_res'];
      
      for (const serverKey of serverOrder) {
        if (uploadLinks[serverKey] && uploadLinks[serverKey] !== 'None' && serverLinks[serverKey]) {
          const serverUrl = serverLinks[serverKey].link + uploadLinks[serverKey];
          console.log(`\n✅ Constructed ${serverKey} URL: ${serverUrl}`);
          
          // Test if this URL is accessible
          try {
            const serverResponse = await axios.head(serverUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              },
              timeout: 5000
            });
            
            console.log(`  ✅ Server accessible: ${serverResponse.status}`);
            console.log(`  Content-Type: ${serverResponse.headers['content-type']}`);
            
            if (serverResponse.headers['content-type']?.includes('text/html')) {
              console.log(`  🎯 This is an HTML page - should work with hubcloudExtractor!`);
            }
            
            break; // Found a working server
          } catch (serverError) {
            console.log(`  ❌ Server not accessible: ${serverError.message}`);
          }
        }
      }
    } else {
      console.log('❌ No upload_links found - checking fallback...');
      
      // Step 5: Look for PUBLIC_CHIBI_PATH fallback
      console.log('\n5️⃣ Looking for PUBLIC_CHIBI_PATH fallback...');
      const chibiPathMatch = content.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
      if (chibiPathMatch) {
        const baseUrl = chibiPathMatch[1];
        console.log(`Found PUBLIC_CHIBI_PATH: ${baseUrl}`);
        
        const fileIdMatch = testLink.match(/\/file\/([^\/]+)$/);
        if (fileIdMatch) {
          const fileId = fileIdMatch[1];
          console.log(`File ID: ${fileId}`);
          
          const constructedUrl = `${baseUrl}/${fileId}`;
          console.log(`Constructed fallback URL: ${constructedUrl}`);
          
          // Test if this URL is accessible
          try {
            const testResponse = await axios.head(constructedUrl, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
              },
              timeout: 5000
            });
            
            console.log(`✅ Fallback URL accessible: ${testResponse.status}`);
            console.log(`Content-Type: ${testResponse.headers['content-type']}`);
            
            if (testResponse.headers['content-type']?.includes('text/html')) {
              console.log('🎯 This is an HTML page - should work!');
            } else {
              console.log('❌ This is not an HTML page');
            }
            
          } catch (testError) {
            console.log(`❌ Fallback URL not accessible: ${testError.message}`);
          }
        }
      } else {
        console.log('❌ No PUBLIC_CHIBI_PATH found either');
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

debugUrlConstruction();
