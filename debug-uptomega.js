const axios = require('axios');

async function testUptomega() {
  const testUrl = 'https://uptomega.net/i8jemguk465g';
  
  console.log('🧪 Testing Uptomega Extractor');
  console.log('URL:', testUrl);
  console.log('\n' + '='.repeat(80) + '\n');
  
  try {
    // Step 1: Get the embed page
    console.log('📥 Step 1: Fetching embed page...');
    const embedRes = await axios.get(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://howblogs.xyz/'
      }
    });
    
    console.log('✅ Status:', embedRes.status);
    console.log('📄 Content length:', embedRes.data.length);
    
    // Extract file ID
    const fileId = testUrl.match(/uptomega\.net\/([A-Za-z0-9]+)/)?.[1];
    console.log('🔑 File ID:', fileId);
    
    // Step 2: Submit download form
    console.log('\n📤 Step 2: Submitting download form...');
    const formData = new URLSearchParams({
      op: 'download2',
      id: fileId,
      rand: '',
      referer: 'https://howblogs.xyz/',
      method_free: 'Free Download >>',
      method_premium: ''
    });
    
    console.log('📋 Form data:', Object.fromEntries(formData));
    
    const downloadRes = await axios.post(testUrl, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': testUrl,
        'Origin': 'https://uptomega.net'
      },
      maxRedirects: 0,
      validateStatus: (status) => status >= 200 && status < 400
    });
    
    console.log('✅ Response status:', downloadRes.status);
    console.log('📍 Location header:', downloadRes.headers.location || 'None');
    
    if (downloadRes.status === 302 && downloadRes.headers.location) {
      console.log('\n✅ SUCCESS! Direct link:', downloadRes.headers.location);
    } else {
      console.log('\n⚠️ No redirect found');
      console.log('Response headers:', downloadRes.headers);
      
      // Check if link is in HTML
      const directLinkMatch = downloadRes.data.match(/https?:\/\/[^\s"'<>]+\.mkv/i);
      if (directLinkMatch) {
        console.log('✅ Found link in HTML:', directLinkMatch[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testUptomega();
