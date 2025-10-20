const axios = require('axios');
const cheerio = require('cheerio');

async function testExtractFunction() {
  console.log('🧪 Testing extractKmhdLink Function Logic');
  console.log('=' .repeat(50));

  try {
    const testLink = 'https://links.kmhd.net/file/Liar_fe8eb354';
    
    // Replicate the exact logic from extractKmhdLink
    console.log(`Testing with: ${testLink}`);
    
    // Step 1: Get initial response
    const initialResponse = await axios.get(testLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://katmoviehd.observer/'
      }
    });
    
    console.log(`Initial status: ${initialResponse.status}`);
    console.log(`Initial redirect: ${initialResponse.request.res.responseUrl}`);
    
    // Check if we need to unlock
    if (initialResponse.request.res.responseUrl?.includes('/locked')) {
      console.log("Links are locked, attempting to unlock...");
      
      // Step 2: Extract unlock form data
      const $locked = cheerio.load(initialResponse.data);
      const form = $locked('form');
      const action = form.attr('action');
      
      if (!action) {
        console.log("No unlock form found");
        return null;
      }
      
      // Step 3: Submit unlock form
      const lockedUrl = initialResponse.request.res.responseUrl;
      // Use the exact action as-is since it works
      const unlockUrl = `https://links.kmhd.net/locked${action}`;
      console.log("Submitting unlock form:", unlockUrl);
      
      const unlockResponse = await axios.post(unlockUrl, {}, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': lockedUrl,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://links.kmhd.net'
        },
        maxRedirects: 5
      });
      
      let cookies = '';
      if (unlockResponse.headers['set-cookie']) {
        cookies = unlockResponse.headers['set-cookie'].join('; ');
      }

      // Step 4: Get unlocked content
      const unlockedResponse = await axios.get(testLink, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': unlockResponse.request.res.responseUrl || testLink,
          'Cookie': cookies
        }
      });
      
      const unlockedData = unlockedResponse.data;
      
      // Step 5: Extract server data
      const uploadLinksMatch = unlockedData.match(/upload_links:\{([^}]+)\}/);
      if (uploadLinksMatch) {
        console.log("Found upload_links!");
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
            console.log(`  🎯 This should be returned!`);
            return serverUrl;
          } else {
            console.log(`  ❌ ${serverKey} not available`);
          }
        }
        
        console.log("No server URLs found, will try 1xplayer fallback");
      }
      
      // Fallback: Look for 1xplayer pattern
      const chibiPathMatch = unlockedData.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
      if (chibiPathMatch && chibiPathMatch[1]) {
        const baseUrl = chibiPathMatch[1];
        const fileIdMatch = testLink.match(/\/file\/([^\/]+)$/);
        if (fileIdMatch && fileIdMatch[1]) {
          const finalLink = `${baseUrl}/${fileIdMatch[1]}`;
          console.log("Fallback 1xplayer link:", finalLink);
          return finalLink;
        }
      }
    } else {
      // Direct access - look for 1xplayer pattern
      const data = initialResponse.data;
      const chibiPathMatch = data.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
      if (chibiPathMatch && chibiPathMatch[1]) {
        const baseUrl = chibiPathMatch[1];
        const fileIdMatch = testLink.match(/\/file\/([^\/]+)$/);
        if (fileIdMatch && fileIdMatch[1]) {
          const finalLink = `${baseUrl}/${fileIdMatch[1]}`;
          console.log("Direct 1xplayer link:", finalLink);
          return finalLink;
        }
      }
    }
    
    console.log("No valid streaming link found");
    return null;
    
  } catch (error) {
    console.error("Error in extractKmhdLink:", error.message);
    return null;
  }
}

testExtractFunction().then(result => {
  console.log(`\n🎯 Final result: ${result}`);
  
  if (result) {
    if (result.includes('hubcloud.ink')) {
      console.log('🎉 SUCCESS: HubCloud URL found!');
    } else if (result.includes('1xplayer.com')) {
      console.log('⚠️  Fallback: 1xplayer URL found');
    } else {
      console.log('❓ Unknown URL type');
    }
  } else {
    console.log('❌ No result returned');
  }
});