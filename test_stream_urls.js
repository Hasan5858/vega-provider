const axios = require('axios');

async function testStreamUrls() {
  try {
    console.log('Testing stream URLs...');
    
    const testUrls = [
      'https://awsssaaaa.awsstorage11.online/sscjn9/Baaghi%204%20%282025%29%20Bollywood%20Hindi%20Movie%20HEVC%20480p%20ESub.mkv',
      'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBQcTNUT3FpU2JELWc0Sm12RjVqSS1JdXREbjJiLVFfN3lnVVFjUENxdVg3SmdrTGV4eC1zanZjUloxLXMwMkF3P2tleT1Vemw1VGpneldXcElSMDVYYXpOeVZ6bERWV3hVUkRoc01rYzJlR2RC&token=MjIxMDI1',
      'https://bbdownload.iwabp.xyz/fastdla.php?id=ZXXoWtwRVb7K&name=Baaghi+4+%282025%29+Bollywood+Hindi+Movie+HEVC+480p+ESub.mkv'
    ];
    
    for (let i = 0; i < testUrls.length; i++) {
      const url = testUrls[i];
      console.log(`\nTesting URL ${i + 1}:`);
      console.log('URL:', url.substring(0, 80) + '...');
      
      try {
        const response = await axios.head(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        });
        
        console.log('Status:', response.status);
        console.log('Content-Type:', response.headers['content-type']);
        console.log('Content-Length:', response.headers['content-length']);
        console.log('✅ URL is accessible');
        
      } catch (error) {
        console.log('❌ URL failed:', error.message);
        if (error.response) {
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        }
      }
    }
    
  } catch (error) {
    console.error('Error testing URLs:', error);
  }
}

testStreamUrls();
