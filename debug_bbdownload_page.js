const axios = require('axios');
const cheerio = require('cheerio');

async function debugBBDownloadPage() {
  // Use a fresh URL from the current movie
  const testUrl = 'https://bbdownload.filesdl.in/fdownload.php?id=aHR0cHM6Ly9waG90b3MuZ29vZ2xlLmNvbS9zaGFyZS9BRjFRaXBOQWxPcmVvV3dWMFlTRXVrRUtmSzF1Y01XQWhUX2N4bGg2ZzBsZFdRMGxkRGxSP2tleT1TRWx3Tmt4bE1XcHVWV1pzYVhkQk9FaGFZMnRHUldvelQwRTVOdz09&name=Kadaram+Kondan+%282019%29+%28Hindi+%2B+Tamil%29+Dual+Audio+UnCut+South+Movie+480p.mkv';
  
  console.log('Debugging BBDownload Page');
  console.log('='.repeat(80));
  console.log('URL:', testUrl.substring(0, 80) + '...\n');
  
  try {
    const response = await axios.get(testUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    console.log('Status:', response.status);
    console.log('Content-Type:', response.headers['content-type']);
    console.log('Content-Length:', response.headers['content-length']);
    
    const $ = cheerio.load(response.data);
    
    console.log('\n' + '='.repeat(80));
    console.log('PAGE STRUCTURE ANALYSIS');
    console.log('='.repeat(80));
    
    // Check for buttons
    console.log('\n1. Looking for download buttons:');
    console.log('   .btn-success:', $('.btn-success').length);
    console.log('   .btn-danger:', $('.btn-danger').length);
    console.log('   .btn-secondary:', $('.btn-secondary').length);
    console.log('   button elements:', $('button').length);
    
    // Check for links
    console.log('\n2. Looking for links:');
    const allLinks = $('a[href]');
    console.log('   Total links:', allLinks.length);
    
    allLinks.each((i, el) => {
      if (i < 10) { // Show first 10 links
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        console.log(`   Link ${i + 1}:`, text.substring(0, 40), '→', href?.substring(0, 60));
      }
    });
    
    // Check page title/heading
    console.log('\n3. Page info:');
    console.log('   Title:', $('title').text());
    console.log('   H1:', $('h1').text());
    console.log('   H2:', $('h2').text());
    
    // Check for specific text patterns
    console.log('\n4. Text content check:');
    const bodyText = $('body').text();
    console.log('   Contains "download":', bodyText.toLowerCase().includes('download'));
    console.log('   Contains "expired":', bodyText.toLowerCase().includes('expired'));
    console.log('   Contains "token":', bodyText.toLowerCase().includes('token'));
    console.log('   Contains "forbidden":', bodyText.toLowerCase().includes('forbidden'));
    
    // Check for forms
    console.log('\n5. Forms:');
    console.log('   Form count:', $('form').length);
    $('form').each((i, el) => {
      console.log(`   Form ${i + 1} action:`, $(el).attr('action'));
    });
    
    // Show first 500 chars of HTML
    console.log('\n6. HTML Preview:');
    console.log(response.data.substring(0, 500));
    console.log('...');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data.substring(0, 200));
    }
  }
}

debugBBDownloadPage();
