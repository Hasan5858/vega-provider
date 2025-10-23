const axios = require('axios');

async function testActualServers() {
  console.log('Testing Actual FilmyFly Server URLs (From Fresh Extraction)');
  console.log('='.repeat(80));
  
  const servers = [
    {
      name: 'Fast Cloud',
      url: 'https://awsssaaaa.awsstorage11.online/y0t27n/Kadaram%20Kondan%20%282019%29%20%28Hindi%20%2B%20Tamil%29%20Dual%20Audio%20UnCut%20South%20Movie%20480p.mkv',
      type: 'direct'
    },
    {
      name: 'Direct Download (bbdownload)',
      url: 'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBOQWxPcmVvV3dWMFlTRXVrRUtmSzF1Y01XQWhUX2N4bGg2ZzBsZFdRMGxkRGxSP2tleT1TRWx3Tmt4bE1XcHVWV1pzYVhkQk9FaGFZMnRHUldvelQwRTVOdz09&name=Kadaram+Kondan+%282019%29+%28Hindi+%2B+Tamil%29+Dual+Audio+UnCut+South+Movie+480p.mkv',
      type: 'bbdownload'
    },
    {
      name: 'Ultra FastDL',
      url: 'https://bbdownload.iwabp.xyz/fastdla.php?id=MAmjO9p1HR6R&name=Kadaram+Kondan+%282019%29+%28Hindi+%2B+Tamil%29+Dual+Audio+UnCut+South+Movie+480p.mkv',
      type: 'bbdownload'
    },
    {
      name: 'Fast Cloud-02',
      url: 'https://bbdownload.filesdl.in/adl.php?id=oqh9nqznf38u',
      type: 'bbdownload'
    }
  ];
  
  for (const server of servers) {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Testing: ${server.name} (${server.type})`);
    console.log(`URL: ${server.url.substring(0, 80)}...`);
    
    try {
      const response = await axios.head(server.url, {
        timeout: 8000,
        maxRedirects: 5,
        validateStatus: (status) => status >= 200 && status < 500,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://filmyfly.observer/'
        }
      });
      
      console.log(`Status: ${response.status}`);
      console.log(`Content-Type: ${response.headers['content-type']}`);
      const size = response.headers['content-length'];
      console.log(`Content-Length: ${size ? (size / 1024 / 1024).toFixed(2) + ' MB' : 'unknown'}`);
      
      if (response.status === 200 && 
          (response.headers['content-type']?.includes('video') || 
           response.headers['content-type']?.includes('octet-stream') ||
           response.headers['content-type']?.includes('matroska'))) {
        console.log('✅ WORKING - This is a valid video file!');
      } else if (response.status === 200 && response.headers['content-type']?.includes('html')) {
        console.log('❌ Returns HTML - Not a direct video link');
      } else {
        console.log(`⚠️ Status ${response.status} - May need investigation`);
      }
      
    } catch (error) {
      if (error.response) {
        console.log(`Status: ${error.response.status}`);
        if (error.response.status === 403) {
          console.log('❌ 403 Forbidden - Access denied');
        } else if (error.response.status === 404) {
          console.log('❌ 404 Not Found - File does not exist');
        } else {
          console.log(`❌ Error: ${error.response.statusText}`);
        }
      } else if (error.code === 'ECONNABORTED') {
        console.log('❌ Timeout - Server too slow');
      } else {
        console.log(`❌ Error: ${error.message}`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('SUMMARY: Test which servers actually return playable video files');
  console.log('='.repeat(80));
}

testActualServers();
