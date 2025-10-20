const axios = require('axios');

async function debugKissKhError() {
  try {
    console.log('🔍 Debugging KissKh Stream Error...\n');
    
    // Test with the episode ID that was working in our previous test
    const episodeId = "195566";
    const streamUrl = `https://adorable-salamander-ecbb21.netlify.app/api/kisskh/video?id=${episodeId}`;
    
    console.log('📡 Testing Stream URL:', streamUrl);
    
    const response = await axios.get(streamUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('✅ Response Status:', response.status);
    console.log('📊 Full Response Data:', JSON.stringify(response.data, null, 2));
    
    const stream = response.data?.source?.Video;
    
    if (stream) {
      console.log('\n🎬 Stream URL Found:', stream);
      console.log('🔗 URL Type:', stream.startsWith('http') ? 'HTTP URL' : 'Local Path');
      console.log('📁 File Extension:', stream.split('.').pop());
      
      // Check if it's a valid HTTP URL
      if (stream.startsWith('http')) {
        console.log('✅ Valid HTTP URL');
        
        // Test if the URL is accessible
        try {
          const streamTest = await axios.head(stream, { timeout: 5000 });
          console.log('✅ Stream URL is accessible (Status:', streamTest.status + ')');
        } catch (streamErr) {
          console.log('❌ Stream URL not accessible:', streamErr.message);
        }
      } else {
        console.log('❌ Invalid URL - appears to be a local path');
        console.log('   This explains the FileNotFoundException in the app');
      }
    } else {
      console.log('❌ No stream found in response');
    }
    
    // Check for any redirects or unusual data
    console.log('\n🔍 Checking for redirects or unusual data...');
    if (response.data?.source) {
      console.log('Source object:', JSON.stringify(response.data.source, null, 2));
    }
    
    if (response.data?.redirect) {
      console.log('Redirect found:', response.data.redirect);
    }
    
  } catch (error) {
    console.error('❌ Error debugging KissKh stream:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

debugKissKhError();
