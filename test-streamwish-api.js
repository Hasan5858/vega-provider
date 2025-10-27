/**
 * StreamWish API Endpoint Test
 * Check if there are API endpoints we can call directly
 */

const axios = require('axios');

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Referer": "https://streamwish.to/",
  "Accept": "application/json, */*",
  "Origin": "https://streamwish.to",
};

async function testAPIEndpoints(videoId) {
  console.log('🔍 Testing StreamWish API endpoints for ID:', videoId);
  console.log('='.repeat(80));

  // Common API patterns used by similar sites
  const apiPatterns = [
    `https://streamwish.to/api/source/${videoId}`,
    `https://streamwish.to/api/file/${videoId}`,
    `https://streamwish.to/api/video/${videoId}`,
    `https://streamwish.to/sources/${videoId}`,
    `https://streamwish.to/api/player/${videoId}`,
    `https://awish.pro/api/source/${videoId}`,
    `https://awish.pro/api/file/${videoId}`,
  ];

  for (const apiUrl of apiPatterns) {
    try {
      console.log(`\n📡 Testing: ${apiUrl}`);
      
      const response = await axios.post(apiUrl, {}, {
        headers,
        timeout: 10000,
      });

      console.log('✅ SUCCESS!');
      console.log('   Status:', response.status);
      console.log('   Data:', JSON.stringify(response.data, null, 2));
      
      return { success: true, endpoint: apiUrl, data: response.data };
      
    } catch (error) {
      if (error.response) {
        console.log(`   ❌ ${error.response.status}: ${error.response.statusText}`);
      } else {
        console.log(`   ❌ ${error.message}`);
      }
    }
  }

  console.log('\n❌ No working API endpoints found');
  return { success: false };
}

async function run() {
  const videoIds = [
    'b0z6i87x4iki',  // From your debug file
    'zzmrsww6b3cn',
  ];

  for (const id of videoIds) {
    const result = await testAPIEndpoints(id);
    if (result.success) {
      console.log('\n✅ Found working API!');
      console.log('Endpoint:', result.endpoint);
      console.log('Response:', result.data);
      break;
    }
    console.log('\n' + '='.repeat(80));
  }
}

run().catch(console.error);
