const { getStream } = require('./dist/katmovies/stream.js');

async function testActualLink() {
  console.log('🧪 Testing Actual Link from App');
  console.log('=' .repeat(50));

  try {
    // This is the actual link from the app logs
    const testLink = 'https://links.kmhd.net/file/Liar_fe8eb354';
    const testType = 'movie';
    
    console.log(`Testing with link: ${testLink}`);
    console.log(`Type: ${testType}`);
    
    // Create a mock provider context
    const providerContext = {
      axios: require('axios'),
      cheerio: require('cheerio'),
      extractors: {
        hubcloudExtracter: require('./dist/hubcloudExtractor.js').hubcloudExtracter,
        gdFlixExtracter: require('./dist/gdflixExtractor.js').gdFlixExtracter
      }
    };
    
    // Create an abort signal
    const controller = new AbortController();
    const signal = controller.signal;
    
    console.log('\n🚀 Calling getStream...');
    const streams = await getStream({
      link: testLink,
      type: testType,
      signal: signal,
      providerContext: providerContext
    });
    
    console.log(`\n✅ SUCCESS: Found ${streams.length} stream links!`);
    
    streams.forEach((stream, index) => {
      console.log(`\n${index + 1}. Server: ${stream.server}`);
      console.log(`   Link: ${stream.link}`);
      console.log(`   Type: ${stream.type}`);
      console.log(`   Quality: ${stream.quality || 'N/A'}`);
    });
    
    if (streams.length > 0) {
      console.log('\n🎉 COMPLETE SUCCESS: Stream extraction working!');
    } else {
      console.log('\n❌ No streams found - investigating...');
      
      // Let's test the unlock flow manually
      console.log('\n🔍 Testing unlock flow manually...');
      const axios = require('axios');
      const cheerio = require('cheerio');
      
      try {
        const initialResponse = await axios.get(testLink, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://katmoviehd.observer/'
          }
        });
        
        console.log(`Initial status: ${initialResponse.status}`);
        console.log(`Redirect URL: ${initialResponse.request.res.responseUrl}`);
        
        if (initialResponse.request.res.responseUrl?.includes('/locked')) {
          console.log('✅ Links are locked - unlock flow needed');
          
          const $locked = cheerio.load(initialResponse.data);
          const form = $locked('form');
          const action = form.attr('action');
          
          if (action) {
            console.log(`Form action found: ${action}`);
            
            const unlockUrl = `https://links.kmhd.net${action}`;
            console.log(`Unlock URL: ${unlockUrl}`);
            
            const unlockResponse = await axios.post(unlockUrl, {}, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': initialResponse.request.res.responseUrl,
                'Content-Type': 'application/x-www-form-urlencoded',
                'Origin': 'https://links.kmhd.net'
              },
              maxRedirects: 5
            });
            
            console.log(`Unlock status: ${unlockResponse.status}`);
            console.log(`Unlock cookies: ${unlockResponse.headers['set-cookie'] || 'None'}`);
            
            const cookies = unlockResponse.headers['set-cookie'] ? unlockResponse.headers['set-cookie'].join('; ') : '';
            
            const unlockedResponse = await axios.get(testLink, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': initialResponse.request.res.responseUrl,
                'Cookie': cookies
              }
            });
            
            console.log(`Unlocked status: ${unlockedResponse.status}`);
            console.log(`Content length: ${unlockedResponse.data.length}`);
            
            // Check for upload_links
            if (unlockedResponse.data.includes('upload_links')) {
              console.log('✅ Found upload_links in unlocked content');
            } else {
              console.log('❌ No upload_links found in unlocked content');
            }
            
            // Check for server data
            if (unlockedResponse.data.includes('hubdrive_res')) {
              console.log('✅ Found hubdrive_res in unlocked content');
            } else {
              console.log('❌ No hubdrive_res found in unlocked content');
            }
            
          } else {
            console.log('❌ No form action found');
          }
        } else {
          console.log('❌ Links are not locked - different issue');
        }
        
      } catch (error) {
        console.log(`❌ Manual test error: ${error.message}`);
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

testActualLink();
