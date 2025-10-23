const axios = require('axios');

async function testUrl() {
  const testUrl = 'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBOeUJTWnBlYXJVcjBQUEJOZ2xmVlh0UWZRUThaRTh6ZTlHNjFNT19sdmw2NnFUP2tleT1NSGwzWVhFMFlrdGpWVnBHYW14blVrWlNjRUkwZWpnNE9RPT0&name=Baaghi+4+%282025%29+Bollywood+Hindi+Movie+720p.mkv';
  
  console.log('Testing URL:', testUrl.substring(0, 80) + '...\n');
  
  try {
    const response = await axios.get(testUrl, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 500,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Length:', response.headers['content-length']);
    
    const data = response.data;
    const dataPreview = typeof data === 'string' ? data.substring(0, 500) : 'Binary data';
    
    console.log('\nResponse preview:');
    console.log(dataPreview);
    
    // Check if it's HTML (error page) or binary video data
    if (typeof data === 'string' && data.includes('<html')) {
      console.log('\n❌ This is an HTML page, not a video file!');
    } else if (response.headers['content-type']?.includes('video') || 
               response.headers['content-type']?.includes('octet-stream')) {
      console.log('\n✅ This appears to be video data');
    } else {
      console.log('\n⚠️ Unknown content type');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testUrl();
