const axios = require('axios');

async function testExtraction() {
  try {
    console.log('🔍 Testing Direct Download URL with different approaches\n');
    console.log('='.repeat(90));

    const url = 'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBNdjNob3JlT0ZubjdrT2thTmFwYzdsUEgtaHczZ3FSTE93MkpWZHJTTFpkeXBVbGg0QjZZUHpyOF8wS1RzTDNBP2tleT1PVTF6WkdKWVVUVTNOM1pVYTI1eE9Fd3pObmhRVDNjNVV5MDBORFpu&token=MjIxMDI1';

    // Check 1: HEAD request
    console.log('📊 Attempt 1: HEAD Request\n');
    try {
      const headRes = await axios.head(url, { timeout: 3000 });
      console.log(`   Status: ${headRes.status}`);
      console.log(`   Location: ${headRes.headers.location || 'None'}`);
      console.log(`   Content-Type: ${headRes.headers['content-type'] || 'Unknown'}`);
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }

    // Check 2: GET with maxRedirects: 0
    console.log('\n📊 Attempt 2: GET with maxRedirects: 0 (to capture redirect)\n');
    try {
      const getRes = await axios.get(url, {
        maxRedirects: 0,
        timeout: 3000,
        validateStatus: (status) => status < 400
      });
      console.log(`   Status: ${getRes.status}`);
      console.log(`   Location: ${getRes.headers.location || 'None'}`);
      if (getRes.headers.location) {
        console.log(`   ✅ REDIRECT FOUND: ${getRes.headers.location}`);
      }
    } catch (err) {
      if (err.response && err.response.status) {
        console.log(`   Status: ${err.response.status}`);
        console.log(`   Location: ${err.response.headers.location || 'None'}`);
        if (err.response.headers.location) {
          console.log(`   ✅ REDIRECT FOUND: ${err.response.headers.location}`);
        }
      } else {
        console.log(`   ❌ Failed: ${err.message}`);
      }
    }

    // Check 3: Try to fetch actual URL (might be encoded)
    console.log('\n📊 Attempt 3: Check if ID is encoded URL\n');
    try {
      const encodedPart = 'aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBNdjNob3JlT0ZubjdrT2thTmFwYzdsUEgtaHczZ3FSTE93MkpWZHJTTFpkeXBVbGg0QjZZUHpyOF8wS1RzTDNBP2tleT1PVTF6WkdKWVVUVTNOM1pVYTI1eE9Fd3pObmhRVDNjNVV5MDBORFpu';
      const decoded = Buffer.from(encodedPart, 'base64').toString('utf-8');
      console.log(`   Encoded ID decodes to: ${decoded}`);
      if (decoded.startsWith('http')) {
        console.log(`   ✅ This is a redirect URL: ${decoded}`);
      }
    } catch (err) {
      console.log(`   ❌ Failed: ${err.message}`);
    }

    // Check 4: Try visiting the decoded URL directly
    console.log('\n📊 Attempt 4: Try visiting the decoded URL directly\n');
    try {
      const decodedUrl = 'https://photos.google.com/share/AF1QipMv3horeOFnn7kOkaNapc7lPH-hw3gqSLOw2JVdrSLZdypUlh4B6YPzr8_0KTsL3A?key=OU1zZGJYUTU3N1ZUa25xOEwzNnhQT3c5Uy00NDZn';
      const decodedRes = await axios.head(decodedUrl, { timeout: 3000 });
      console.log(`   ✅ Decoded URL is accessible!`);
      console.log(`   Status: ${decodedRes.status}`);
      console.log(`   Content-Type: ${decodedRes.headers['content-type']}`);
    } catch (err) {
      console.log(`   ❌ Decoded URL not accessible: ${err.message}`);
    }

    console.log('\n' + '='.repeat(90));
    console.log('\n📋 CONCLUSION:\n');
    console.log('FilesD1 URLs use base64-encoded redirect URLs in the ID parameter.');
    console.log('When decoded: They point to Google Photos or similar hosting.');
    console.log('Direct Download flow:');
    console.log('  1. User sends request to fdownload.php?id=BASE64_ENCODED_URL');
    console.log('  2. FilesD1 server decodes the ID');
    console.log('  3. Redirects to actual video hosting URL');
    console.log('  4. Cloudflare blocks direct axios requests (needs browser)');
    console.log('\nTo fix: Either use browser automation or follow redirects with proper headers');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testExtraction();
