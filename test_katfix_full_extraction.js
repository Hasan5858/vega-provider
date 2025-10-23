const axios = require('axios');
const cheerio = require('cheerio');

// Test full stream extraction with extractor simulation
async function testKatFixStreamExtraction() {
  try {
    console.log('🔍 Testing KatFix FULL stream extraction with extractors...\n');
    
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
    console.log(`✅ Response status: ${response.status}\n`);
    
    const $ = cheerio.load(response.data);
    
    // Extract cloud storage links
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
    
    const streamLinks = [];
    
    $(cloudSelectors.join(', ')).each((_, el) => {
      const href = $(el).attr('href')?.trim();
      const text = $(el).text().trim();
      
      if (href) {
        // Simple filter - skip only clearly irrelevant
        const isIrrelevant = /(imdb|rating|score|\d+\.\d+\/10)/i.test(text) ||
                            /^(hindi|english|tamil|telugu|bengali|korean|turkish|urdu)$/i.test(text) ||
                            /(share|telegram|whatsapp|facebook|twitter|instagram)/i.test(text) ||
                            /(how to download|click to|disclaimer)/i.test(text) ||
                            text.length < 2;
        
        if (!isIrrelevant) {
          const server = getServerName(href);
          streamLinks.push({
            server,
            link: href,
            text,
            type: getFileType(href, server),
            quality: extractQuality(text)
          });
        }
      }
    });
    
    console.log(`🔗 Cloud storage links found: ${streamLinks.length}\n`);
    
    if (streamLinks.length > 0) {
      console.log('📋 Links that will be passed to extractors:\n');
      streamLinks.forEach((link, i) => {
        console.log(`  ${i + 1}. ${link.server}`);
        console.log(`     Quality: ${link.quality}`);
        console.log(`     Type: ${link.type}`);
        console.log(`     URL: ${link.link.substring(0, 70)}...`);
        console.log(`     Text: "${link.text}"\n`);
      });
      
      // Simulate extraction attempts
      console.log('🎬 Simulating extractor calls:\n');
      
      for (const stream of streamLinks) {
        try {
          console.log(`  🔄 Extracting from ${stream.server}: ${stream.link.substring(0, 60)}...`);
          
          // For this test, we'll check if the extractor WOULD attempt extraction
          if (stream.link.includes('gofile.io')) {
            const gofileId = stream.link.split('/d/')[1]?.split('?')[0];
            console.log(`     ✅ GoFile ID extracted: ${gofileId}`);
            console.log(`     📌 Extractor would call: gofileExtracter("${gofileId}")`);
          } else if (stream.link.includes('gdflix')) {
            console.log(`     ✅ GDFlix URL detected`);
            console.log(`     📌 Extractor would call: gdFlixExtracter("${stream.link}")`);
          } else if (stream.link.includes('gdtot')) {
            console.log(`     ✅ GDTot URL detected`);
            console.log(`     📌 Extractor would call: hubcloudExtracter("${stream.link}")`);
          }
          console.log('');
        } catch (error) {
          console.log(`     ❌ Extraction would fail: ${error.message}\n`);
        }
      }
      
      console.log(`\n🎉 SUCCESS: ${streamLinks.length} streams ready for extraction!`);
    } else {
      console.log(`\n❌ No valid links found!`);
    }
    
  } catch (error) {
    console.error(`\n❌ ERROR: ${error.message}`);
  }
}

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

function getFileType(url, server) {
  const extension = url.match(/\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v)$/i);
  if (extension) return extension[1].toLowerCase();
  
  const serverDefaults = {
    'GoFile': 'mkv',
    'Send': 'mkv',
    'GDFlix': 'mkv',
    'FilePress': 'mkv',
    'GDTot': 'mkv',
    'PixelDrain': 'mp4',
    'HubCloud': 'mkv',
    '1fichier': 'mkv',
    'Mega': 'mkv',
    'Google Drive': 'mkv'
  };
  
  return serverDefaults[server] || 'mkv';
}

function extractQuality(text) {
  const qualityMatch = text.match(/(\d+)p/i);
  if (!qualityMatch) return '1080';
  
  const qualityNum = parseInt(qualityMatch[1]);
  if (qualityNum <= 360) return '360';
  if (qualityNum <= 480) return '480';
  if (qualityNum <= 720) return '720';
  if (qualityNum <= 1080) return '1080';
  return '2160';
}

// Run test
testKatFixStreamExtraction();
