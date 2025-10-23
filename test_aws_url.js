const axios = require('axios');

async function testAwsUrl() {
  const testUrl = 'https://awsssaaaa.awsstorage11.online/sscjn9/Baaghi%204%20%282025%29%20Bollywood%20Hindi%20Movie%20HDRip%20480p.mkv';
  
  console.log('Testing AWS URL access...');
  console.log('URL:', testUrl);
  
  try {
    // Try HEAD request first
    const headResponse = await axios.head(testUrl, {
      timeout: 10000,
      maxRedirects: 5,
      validateStatus: (status) => status >= 200 && status < 500
    });
    
    console.log('\nHEAD Response:');
    console.log('Status:', headResponse.status);
    console.log('Content-Type:', headResponse.headers['content-type']);
    console.log('Content-Length:', headResponse.headers['content-length']);
    console.log('Final URL:', headResponse.request?.res?.responseURL || testUrl);
    
    if (headResponse.status === 200) {
      console.log('\n✅ URL is accessible!');
    } else {
      console.log('\n❌ URL returned status:', headResponse.status);
    }
  } catch (error) {
    console.error('\n❌ Error accessing URL:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testAwsUrl();
