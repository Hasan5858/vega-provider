const axios = require('axios');
const cheerio = require('cheerio');

async function testBaaghi4() {
  try {
    console.log('🎬 Testing Baaghi 4 FilmyFly Flow...\n');
    
    // Step 1: Fetch linkmake.in page
    const linkmakeUrl = 'https://linkmake.in/view/Ny4ebkVkM2';
    console.log('📡 Step 1: Fetching linkmake.in page:', linkmakeUrl);
    
    const response = await axios.get(linkmakeUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Log all buttons found
    console.log('\n🔍 Analyzing page structure...\n');
    
    // Check for different button classes
    const buttonClasses = ['.button2', '.button1', '.button3', '.button4', '.button'];
    buttonClasses.forEach(cls => {
      const count = $(cls).length;
      if (count > 0) {
        console.log(`Found ${count} elements with class: ${cls}`);
        $(cls).each((i, el) => {
          const text = $(el).text().trim();
          const href = $(el).attr('href');
          console.log(`  [${i+1}] Text: "${text}", Link: ${href ? href.substring(0, 60) + '...' : 'No href'}`);
        });
      }
    });
    
    // Check for any anchor tags
    console.log('\n🔗 All anchor tags on page:');
    let anchorCount = 0;
    $('a').each((i, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href');
      if (text && href) {
        anchorCount++;
        if (anchorCount <= 20) { // Show first 20
          console.log(`  [${anchorCount}] "${text}" -> ${href.substring(0, 70)}`);
        }
      }
    });
    console.log(`\nTotal anchor tags with text and href: ${anchorCount}`);
    
    // Save HTML to file for inspection
    const fs = require('fs');
    fs.writeFileSync('baaghi4_page.html', response.data);
    console.log('\n💾 Saved page HTML to: baaghi4_page.html');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testBaaghi4();
