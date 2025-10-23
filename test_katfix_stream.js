const axios = require('axios');
const cheerio = require('cheerio');

// Test KatFix stream extraction
async function testKatFixStream() {
  try {
    console.log('🔍 Testing KatFix stream extraction...\n');
    
    // Test URL - The Jester 2 movie page
    const testUrl = 'https://katlinks.in/archives/68545';
    
    console.log(`📝 Fetching: ${testUrl}\n`);
    
    const headers = {
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'Cache-Control': 'no-store',
      'Accept-Language': 'en-US,en;q=0.9',
      DNT: '1',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    };
    
    const response = await axios.get(testUrl, { headers, timeout: 10000 });
    console.log(`✅ Response status: ${response.status}`);
    console.log(`📊 Response data length: ${response.data.length} bytes\n`);
    
    const $ = cheerio.load(response.data);
    
    // Cloud storage link selectors
    const cloudSelectors = [
      "a[href*='gofile.io']",
      "a[href*='send.cm']",
      "a[href*='gdflix']",
      "a[href*='filepress']",
      "a[href*='gdtot']",
      "a[href*='pixeldrain.dev']",
      "a[href*='hubcloud']",
      "a[href*='1fichier.com']",
      "a[href*='mega.nz']",
      "a[href*='drive.google.com']"
    ];
    
    console.log('📍 Cloud storage links found:');
    cloudSelectors.forEach(selector => {
      const count = $(selector).length;
      if (count > 0) {
        console.log(`  ✅ ${selector}: ${count} elements`);
      }
    });
    console.log('');
    
    // Extract cloud storage links
    const foundLinks = [];
    $(cloudSelectors.join(', ')).each((_, el) => {
      const href = $(el).attr('href')?.trim();
      const text = $(el).text().trim();
      
      if (href) {
        foundLinks.push({
          text,
          href,
          server: getServerName(href)
        });
      }
    });
    
    console.log(`🔗 Total cloud storage links extracted: ${foundLinks.length}\n`);
    
    if (foundLinks.length > 0) {
      console.log('📋 Extracted links:');
      foundLinks.forEach((link, i) => {
        console.log(`  ${i + 1}. Server: ${link.server}`);
        console.log(`     Text: "${link.text}"`);
        console.log(`     URL: ${link.href.substring(0, 80)}...`);
        console.log('');
      });
    }
    
    // Test filtering logic
    console.log('🔍 Testing filtering logic:\n');
    
    let passedCount = 0;
    let filteredCount = 0;
    
    foundLinks.forEach((link, i) => {
      const text = link.text;
      
      // Check irrelevant
      const isIrrelevant = /(imdb|rating|score|\d+\.\d+\/10)/i.test(text) ||
                          /^(hindi|english|tamil|telugu|bengali|korean|turkish|urdu)$/i.test(text) ||
                          /(share|telegram|whatsapp|facebook|twitter|instagram)/i.test(text) ||
                          /(how to download|click to|disclaimer)/i.test(text) ||
                          text.length < 2;
      
      if (!isIrrelevant) {
        passedCount++;
        console.log(`  ✅ Link ${i + 1}: PASS`);
        console.log(`     Text: "${text}" → Server: ${link.server}`);
      } else {
        filteredCount++;
        console.log(`  ❌ Link ${i + 1}: FILTERED`);
        console.log(`     Text: "${text}"`);
      }
      console.log('');
    });
    
    console.log(`\n📊 Summary:`);
    console.log(`  ✅ Passed filtering: ${passedCount}`);
    console.log(`  ❌ Filtered out: ${filteredCount}`);
    console.log(`  📦 Total: ${foundLinks.length}`);
    
    if (passedCount > 0) {
      console.log(`\n🎉 SUCCESS: Found ${passedCount} valid cloud storage links!`);
    } else {
      console.log(`\n⚠️  WARNING: No valid links found after filtering!`);
    }
    
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
    if (error.response?.status) {
      console.error(`   Status: ${error.response.status}`);
    }
  }
}

// Helper function to get server name from URL
function getServerName(url) {
  if (url.includes('gofile.io')) return 'GoFile';
  if (url.includes('send.cm')) return 'Send';
  if (url.includes('gdflix')) return 'GDFlix';
  if (url.includes('filepress')) return 'FilePress';
  if (url.includes('gdtot')) return 'GDTot';
  if (url.includes('pixeldrain')) return 'PixelDrain';
  if (url.includes('hubcloud')) return 'HubCloud';
  if (url.includes('1fichier')) return '1fichier';
  if (url.includes('mega.nz')) return 'Mega';
  if (url.includes('drive.google')) return 'Google Drive';
  return 'Unknown';
}

// Run test
testKatFixStream();
