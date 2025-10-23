const axios = require('axios');
const cheerio = require('cheerio');

async function testLatestMovie() {
  console.log('Testing FilmyFly with LATEST Movie');
  console.log('='.repeat(80));
  
  try {
    // Get homepage to find latest movie
    const homeUrl = 'https://filmyfly.observer';
    const homeRes = await axios.get(homeUrl);
    const $ = cheerio.load(homeRes.data);
    
    // Get first movie (latest)
    const firstMovie = $('.A10').first();
    const title = firstMovie.find("div[style*='font-weight:bold']").text().trim();
    const link = 'https://filmyfly.observer' + firstMovie.find('a').attr('href');
    
    console.log(`\nLatest Movie: ${title}`);
    console.log(`Link: ${link}\n`);
    
    // Get movie page
    const movieRes = await axios.get(link);
    const $movie = cheerio.load(movieRes.data);
    
    const downloadLink = $movie('.dlbtn a').attr('href');
    console.log(`Download Link: ${downloadLink}\n`);
    
    // Get linkmake page (quality selection)
    const linkmakeRes = await axios.get(downloadLink);
    const $linkmake = cheerio.load(linkmakeRes.data);
    
    // Get first quality option
    let firstQualityLink = '';
    let firstQualityText = '';
    $linkmake('a').each((i, el) => {
      const text = $linkmake(el).text().trim();
      const href = $linkmake(el).attr('href');
      if (text.includes('Download') && href && href.includes('filesdl') && !firstQualityLink) {
        firstQualityText = text;
        firstQualityLink = href;
      }
    });
    
    console.log(`First Quality: ${firstQualityText}`);
    console.log(`Quality Link: ${firstQualityLink}\n`);
    
    // Get server page
    const serverPageRes = await axios.get(firstQualityLink);
    const $server = cheerio.load(serverPageRes.data);
    
    console.log('Available Servers:');
    console.log('-'.repeat(80));
    
    const servers = [];
    $server('a[href]').each((i, el) => {
      const text = $server(el).text().trim();
      const href = $server(el).attr('href');
      if (text && href && text.length > 3 && text.length < 100) {
        servers.push({ name: text, url: href });
      }
    });
    
    // Test first 3 servers
    for (let i = 0; i < Math.min(3, servers.length); i++) {
      const server = servers[i];
      console.log(`\n${i + 1}. ${server.name}`);
      console.log(`   URL: ${server.url.substring(0, 70)}...`);
      
      try {
        const testRes = await axios.head(server.url, {
          timeout: 5000,
          maxRedirects: 5,
          validateStatus: (status) => status >= 200 && status < 500,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': firstQualityLink
          }
        });
        
        console.log(`   Status: ${testRes.status}`);
        console.log(`   Content-Type: ${testRes.headers['content-type']}`);
        
        if (testRes.status === 200 && 
            (testRes.headers['content-type']?.includes('video') ||
             testRes.headers['content-type']?.includes('octet-stream') ||
             testRes.headers['content-type']?.includes('matroska'))) {
          console.log(`   ✅ WORKING VIDEO FILE!`);
        } else if (testRes.status === 200) {
          console.log(`   ⚠️ Returns ${testRes.headers['content-type']}`);
        }
      } catch (error) {
        console.log(`   ❌ ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testLatestMovie();
