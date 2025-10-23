const axios = require('axios');

async function testServers() {
  const servers = [
    {
      name: 'AWS Direct',
      url: 'https://awsssaaaa.awsstorage11.online/y0t27n/Kadaram%20Kondan%20%282019%29%20%28Hindi%20%2B%20Tamil%29%20Dual%20Audio%20UnCut%20South%20Movie%20480p.mkv'
    },
    {
      name: 'BBDownload',
      url: 'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBOQWxPcmVvV3dWMFlTRXVrRUtmSzF1Y01XQWhUX2N4bGg2ZzBsZFdRMGxkRGxSP2tleT1TRWx3Tmt4bE1XcHVWV1pzYVhkQk9FaGFZMnRHUldvelQwRTVOdz09&name=Kadaram+Kondan+%282019%29+%28Hindi+%2B+Tamil%29+Dual+Audio+UnCut+South+Movie+480p.mkv'
    },
    {
      name: 'Ultra FastDL',
      url: 'https://bbdownload.iwabp.xyz/fastdla.php?id=MAmjO9p1HR6R&name=Kadaram+Kondan+%282019%29+%28Hindi+%2B+Tamil%29+Dual+Audio+UnCut+South+Movie+480p.mkv'
    },
    {
      name: 'Fast Cloud-02',
      url: 'https://bbdownload.filesdl.in/adl.php?id=oqh9nqznf38u'
    },
    {
      name: 'GoFile',
      url: 'https://gofile.io/d/N5mZku'
    }
  ];
  
  console.log('Testing FilmyFly Server URLs');
  console.log('='.repeat(80));
  
  for (const server of servers) {
    console.log(`\n📡 Testing: ${server.name}`);
    console.log(`URL: ${server.url.substring(0, 80)}...`);
    
    try {
      const response = await axios.head(server.url, {
        timeout: 8000,
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 500,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${response.headers['content-type']}`);
      console.log(`Content-Length: ${response.headers['content-length'] ? (response.headers['content-length'] / 1024 / 1024).toFixed(2) + ' MB' : 'unknown'}`);
      
      if (response.status === 200) {
        if (response.headers['content-type']?.includes('video') || 
            response.headers['content-type']?.includes('octet-stream') ||
            response.headers['content-type']?.includes('application/x-matroska')) {
          console.log('✅ WORKING - Valid video file!');
        } else if (response.headers['content-type']?.includes('html')) {
          console.log('⚠️  Returns HTML (might be a redirect page)');
        } else {
          console.log('⚠️  Unknown content type');
        }
      } else {
        console.log('❌ NOT OK - Status not 200');
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        console.log(`❌ HTTP Error: ${error.response.statusText}`);
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
}

testServers();
