const axios = require('axios');

async function testVOE() {
  const url = 'https://voe.sx/e/vtyacxsw3cxu';
  
  console.log('🔍 Testing VOE.sx:', url);
  console.log('═'.repeat(60));
  
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const html = response.data;
    console.log('✓ Page fetched, length:', html.length);
    
    // Check for eval packing
    if (html.includes('eval(function(p,a,c,k,e')) {
      console.log('\n❌ FOUND: eval() packed/obfuscated JavaScript');
      console.log('   This NEEDS your deobfuscator!');
      console.log('   Pattern detected: eval(function(p,a,c,k,e,d)...');
      return;
    }
    
    console.log('✓ No eval() packing detected');
    
    // Look for video URLs
    console.log('\n🔍 Looking for video URLs...');
    const patterns = [
      { name: 'hls single quote', regex: /'hls':\s*'([^']+)'/ },
      { name: 'hls double quote', regex: /"hls":\s*"([^"]+)"/ },
      { name: 'mp4 single quote', regex: /'mp4':\s*'([^']+)'/ },
      { name: 'mp4 double quote', regex: /"mp4":\s*"([^"]+)"/ },
      { name: 'm3u8 url', regex: /"url":\s*"([^"]+\.m3u8[^"]*)"/ },
      { name: 'mp4 url', regex: /"url":\s*"([^"]+\.mp4[^"]*)"/ },
      { name: 'sources', regex: /sources:\s*\[?\s*{[^}]*src:\s*['"]([^'"]+)['"]/ }
    ];
    
    for (const { name, regex } of patterns) {
      const match = html.match(regex);
      if (match && match[1]) {
        console.log(`✓ Found using "${name}" pattern`);
        console.log('  URL:', match[1].substring(0, 120));
        if (match[1].length > 120) console.log('  ... (truncated)');
        return;
      }
    }
    
    console.log('❌ No video URL found with standard patterns');
    console.log('\n💡 Saving HTML for manual inspection...');
    require('fs').writeFileSync('voe-page-sample.html', html);
    console.log('   Saved to: voe-page-sample.html');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testVOE();
