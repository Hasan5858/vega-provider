/**
 * StreamWish JavaScript Analysis
 * Fetch and analyze the main.js file
 */

const axios = require('axios');

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Referer": "https://streamwish.to/",
  "Accept": "*/*",
};

async function analyzeMainJS() {
  console.log('🔍 Analyzing StreamWish main.js');
  console.log('='.repeat(80));

  try {
    const jsUrl = 'https://streamwish.to/main.js?v=1.1.2';
    console.log('📥 Fetching:', jsUrl);
    
    const response = await axios.get(jsUrl, {
      headers,
      timeout: 15000,
    });

    const jsContent = response.data;
    
    console.log('\n✅ JavaScript fetched:', jsContent.length, 'chars');
    console.log('\n📄 Full JavaScript Content:');
    console.log('─'.repeat(80));
    console.log(jsContent);
    console.log('─'.repeat(80));

    console.log('\n🔍 Content Analysis:');
    console.log('   Contains "eval":', jsContent.includes('eval'));
    console.log('   Contains "fetch":', jsContent.includes('fetch'));
    console.log('   Contains "XMLHttpRequest":', jsContent.includes('XMLHttpRequest'));
    console.log('   Contains "ajax":', jsContent.includes('ajax'));
    console.log('   Contains "/api/":', jsContent.includes('/api/'));
    console.log('   Contains "/e/":', jsContent.includes('/e/'));
    console.log('   Contains "m3u8":', jsContent.includes('m3u8'));
    console.log('   Contains "mp4":', jsContent.includes('mp4'));
    console.log('   Contains "source":', jsContent.includes('source'));
    console.log('   Contains "video":', jsContent.includes('video'));
    
    // Look for API endpoints
    const apiMatches = jsContent.match(/["'](\/[^"']*api[^"']*)["']/gi);
    if (apiMatches) {
      console.log('\n🔌 Found API endpoints:');
      apiMatches.forEach(match => {
        console.log('   ', match.replace(/["']/g, ''));
      });
    }

    // Look for fetch/axios calls
    const fetchMatches = jsContent.match(/fetch\([^)]+\)/gi);
    if (fetchMatches) {
      console.log('\n📡 Found fetch calls:');
      fetchMatches.forEach((match, idx) => {
        console.log(`   ${idx + 1}. ${match.substring(0, 100)}...`);
      });
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
    }
  }
}

analyzeMainJS().catch(console.error);
