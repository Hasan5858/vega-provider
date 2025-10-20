const axios = require('axios');
const cheerio = require('cheerio');

async function debugExtractFunction() {
  console.log('🔍 Debugging extractKmhdLink Function');
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
    
    const unlockedData = unlockedResponse.data;
    
    // Step 4: Test the exact logic from extractKmhdLink
    console.log('\n4️⃣ Testing extractKmhdLink logic...');
    
    // Extract upload_links using simple regex
    const uploadLinksMatch = unlockedData.match(/upload_links:\{([^}]+)\}/);
    if (uploadLinksMatch) {
      console.log("✅ Found upload_links!");
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
      
      // Extract server links using simple regex patterns
      const serverLinks = {};
      
      // HubDrive
      const hubdriveMatch = unlockedData.match(/hubdrive_res:\{mx:(\d+),link:"([^"]+)"/);
      if (hubdriveMatch) {
        serverLinks.hubdrive_res = {
          mx: parseInt(hubdriveMatch[1]),
          link: hubdriveMatch[2]
        };
        console.log('Found hubdrive_res:', serverLinks.hubdrive_res);
      }
      
      // GDFlix
      const gdflixMatch = unlockedData.match(/gdflix_res:\{mx:(\d+),link:"([^"]+)"/);
      if (gdflixMatch) {
        serverLinks.gdflix_res = {
          mx: parseInt(gdflixMatch[1]),
          link: gdflixMatch[2]
        };
        console.log('Found gdflix_res:', serverLinks.gdflix_res);
      }
      
      // Try different servers in order of preference
      const serverOrder = ['hubdrive_res', 'gdflix_res', 'katdrive_res', 'clicknupload_res', 'ffast_res', 'fichier_res'];
      
      for (const serverKey of serverOrder) {
        console.log(`\nChecking ${serverKey}...`);
        console.log(`  uploadLinks[${serverKey}]: ${uploadLinks[serverKey]}`);
        console.log(`  serverLinks[${serverKey}]: ${serverLinks[serverKey] ? 'Found' : 'Not found'}`);
        
        if (uploadLinks[serverKey] && uploadLinks[serverKey] !== 'None' && serverLinks[serverKey]) {
          const serverUrl = serverLinks[serverKey].link + uploadLinks[serverKey];
          console.log(`  ✅ Found ${serverKey} link: ${serverUrl}`);
          console.log(`  🎯 This should be returned by extractKmhdLink!`);
          return; // This should be the return value
        } else {
          console.log(`  ❌ ${serverKey} not available`);
        }
      }
      
      console.log("No server URLs found, will try 1xplayer fallback");
    } else {
      console.log('❌ No upload_links found');
    }
    
    // Step 5: Check 1xplayer fallback
    console.log('\n5️⃣ Checking 1xplayer fallback...');
    const chibiPathMatch = unlockedData.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
    if (chibiPathMatch && chibiPathMatch[1]) {
      const baseUrl = chibiPathMatch[1];
      console.log(`Found PUBLIC_CHIBI_PATH: ${baseUrl}`);
      
      const fileIdMatch = testLink.match(/\/file\/([^\/]+)$/);
      if (fileIdMatch && fileIdMatch[1]) {
        const finalLink = `${baseUrl}/${fileIdMatch[1]}`;
        console.log(`Fallback 1xplayer link: ${finalLink}`);
        console.log(`⚠️  This is what's being returned instead of server URLs!`);
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

debugExtractFunction();
