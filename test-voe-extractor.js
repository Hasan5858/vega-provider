const axios = require('axios');

async function testVOEExtractor() {
  try {
    const url = 'https://voe.sx/e/vtyacxsw3cxu';
    
    console.log(`\n🎬 Testing VOE.sx Extractor`);
    console.log(`URL: ${url}\n`);
    
    // Fetch with redirects
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://voe.sx/'
      },
      maxRedirects: 5
    });

    const html = response.data;
    console.log(`✓ Page fetched, length: ${html.length} bytes`);
    console.log(`✓ Final URL: ${response.request.res.responseUrl || url}`);

    // Extract video source
    const sourceMatch = html.match(/var\s+source\s*=\s*['"](https?:\/\/[^'"]+)['"]/);
    
    if (!sourceMatch || !sourceMatch[1]) {
      console.log('❌ Could not find video source');
      return;
    }

    const videoUrl = sourceMatch[1];
    console.log(`\n✓ Video URL extracted:`);
    console.log(`  ${videoUrl}`);

    // Test video URL
    const videoResponse = await axios.head(videoUrl, {
      headers: {
        'Referer': 'https://voe.sx/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    console.log(`\n✓ Video URL is accessible:`);
    console.log(`  Status: ${videoResponse.status}`);
    console.log(`  Content-Type: ${videoResponse.headers['content-type']}`);
    if (videoResponse.headers['content-length']) {
      const sizeMB = (parseInt(videoResponse.headers['content-length']) / 1024 / 1024).toFixed(2);
      console.log(`  Size: ${sizeMB} MB`);
    }

    console.log(`\n✅ VOE.sx extractor works perfectly!`);
    console.log(`\n📝 Summary:`);
    console.log(`   - No eval() obfuscation`);
    console.log(`   - Simple var source='url' extraction`);
    console.log(`   - Video URL is directly playable`);
    console.log(`   - Ready to add to Primewire provider`);

  } catch (error) {
    console.error(`\n❌ Test failed:`, error.message);
  }
}

testVOEExtractor();
