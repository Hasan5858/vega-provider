/**
 * StreamWish Extractor Test
 * Tests the complete extraction flow before implementing the extractor
 */

const axios = require('axios');

const DEOBFUSCATE_API = "https://js-deobfuscator-api.replit.app/api/deobfuscate";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Referer": "https://streamwish.to/",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};

async function testStreamWishExtraction(url) {
  console.log('\n🧪 Testing StreamWish extraction for:', url);
  console.log('='.repeat(80));

  try {
    // Step 1: Extract video ID
    console.log('\n📝 Step 1: Extracting video ID...');
    const idMatch = url.match(/\/(?:e|embed|v)\/([A-Za-z0-9_-]+)/i);
    if (!idMatch) {
      console.error('❌ Failed: Could not extract video ID from URL');
      return false;
    }
    const videoId = idMatch[1];
    console.log('✅ Video ID:', videoId);

    // Step 2: Construct embed URL
    const embedUrl = `https://streamwish.to/e/${videoId}`;
    console.log('\n📝 Step 2: Embed URL:', embedUrl);

    // Step 3: Fetch embed page
    console.log('\n📝 Step 3: Fetching embed page...');
    const response = await axios.get(embedUrl, {
      headers,
      timeout: 15000,
    });
    console.log('✅ Page fetched:', response.data.length, 'chars');
    console.log('   Status:', response.status);
    console.log('   Content-Type:', response.headers['content-type']);

    // Step 4: Look for eval code
    console.log('\n📝 Step 4: Searching for eval code...');
    const html = response.data;
    
    // Try multiple patterns
    const patterns = [
      /eval\(function\(p,a,c,k,e,d\)[\s\S]+?\.split\('\|'\)\)\)/,
      /eval\(function\(p,a,c,k,e,d\)[\s\S]+?\.split\("\|"\)\)\)/,
      /eval\(function\(p,a,c,k,e,r\)[\s\S]+?\.split\('\|'\)\)\)/,
    ];

    let evalCode = null;
    for (let i = 0; i < patterns.length; i++) {
      const match = html.match(patterns[i]);
      if (match) {
        evalCode = match[0];
        console.log(`✅ Found eval code using pattern ${i + 1}`);
        break;
      }
    }

    if (!evalCode) {
      console.error('❌ Failed: Could not find eval code');
      console.log('\n🔍 Searching for alternative patterns...');
      
      // Look for script tags
      const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
      if (scriptMatches) {
        console.log(`   Found ${scriptMatches.length} script tags`);
        scriptMatches.forEach((script, idx) => {
          if (script.includes('eval') || script.includes('file') || script.includes('sources')) {
            console.log(`   Script ${idx + 1} contains interesting content (${script.length} chars)`);
          }
        });
      }
      
      // Look for JSON data
      if (html.includes('sources')) {
        console.log('   ⚠️ Found "sources" in HTML - might use direct JSON');
      }
      if (html.includes('file:')) {
        console.log('   ⚠️ Found "file:" in HTML - might use direct file property');
      }
      
      return false;
    }

    console.log('   Eval code length:', evalCode.length, 'chars');
    console.log('   Preview:', evalCode.substring(0, 100) + '...');

    // Step 5: Deobfuscate
    console.log('\n📝 Step 5: Deobfuscating code...');
    const deobfuscateResponse = await axios.post(
      DEOBFUSCATE_API,
      { code: evalCode },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    if (!deobfuscateResponse.data.success) {
      console.error('❌ Deobfuscation failed:', deobfuscateResponse.data.error);
      return false;
    }

    const deobfuscated = deobfuscateResponse.data.result;
    console.log('✅ Deobfuscation successful');
    console.log('   Deobfuscated length:', deobfuscated.length, 'chars');
    console.log('   Preview:', deobfuscated.substring(0, 200));

    // Step 6: Extract stream URL
    console.log('\n📝 Step 6: Extracting stream URL...');
    
    // Try multiple extraction patterns
    const extractionPatterns = [
      { name: 'Direct m3u8', regex: /https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i },
      { name: 'Sources array', regex: /"sources":\s*\[[\s\S]*?"file":\s*"([^"]+)"/ },
      { name: 'File property', regex: /"file":\s*"([^"]+)"/ },
      { name: 'Source property', regex: /"source":\s*"([^"]+)"/ },
      { name: 'Src property', regex: /"src":\s*"([^"]+)"/ },
    ];

    let streamUrl = null;
    let matchedPattern = null;

    for (const pattern of extractionPatterns) {
      const match = deobfuscated.match(pattern.regex);
      if (match) {
        streamUrl = match[pattern.name === 'Direct m3u8' ? 0 : 1];
        streamUrl = streamUrl.replace(/\\/g, "").replace(/&amp;/g, "&");
        matchedPattern = pattern.name;
        console.log(`✅ Found stream URL using: ${pattern.name}`);
        break;
      }
    }

    if (!streamUrl) {
      console.error('❌ Failed: Could not extract stream URL');
      console.log('\n🔍 Deobfuscated content analysis:');
      console.log('   Contains "file":', deobfuscated.includes('file'));
      console.log('   Contains "source":', deobfuscated.includes('source'));
      console.log('   Contains "m3u8":', deobfuscated.includes('m3u8'));
      console.log('   Contains "mp4":', deobfuscated.includes('mp4'));
      console.log('\n📄 Full deobfuscated content:');
      console.log(deobfuscated);
      return false;
    }

    console.log('   Stream URL:', streamUrl);
    console.log('   Type:', streamUrl.includes('.m3u8') ? 'm3u8' : 'mp4');

    // Step 7: Verify stream URL
    console.log('\n📝 Step 7: Verifying stream URL...');
    try {
      const streamHeaders = {
        "User-Agent": headers["User-Agent"],
        "Referer": "https://streamwish.to/",
      };
      
      const streamResponse = await axios.head(streamUrl, {
        headers: streamHeaders,
        timeout: 10000,
        maxRedirects: 5,
      });
      
      console.log('✅ Stream URL is accessible');
      console.log('   Status:', streamResponse.status);
      console.log('   Content-Type:', streamResponse.headers['content-type']);
      console.log('   Content-Length:', streamResponse.headers['content-length']);
    } catch (error) {
      console.warn('⚠️ Could not verify stream (might need GET request or player):', error.message);
    }

    // Success summary
    console.log('\n' + '='.repeat(80));
    console.log('✅ EXTRACTION TEST PASSED');
    console.log('='.repeat(80));
    console.log('📊 Summary:');
    console.log('   Video ID:', videoId);
    console.log('   Eval code length:', evalCode.length, 'chars');
    console.log('   Deobfuscated length:', deobfuscated.length, 'chars');
    console.log('   Extraction method:', matchedPattern);
    console.log('   Stream URL:', streamUrl);
    console.log('   Stream type:', streamUrl.includes('.m3u8') ? 'm3u8' : 'mp4');
    console.log('='.repeat(80));

    return true;

  } catch (error) {
    console.error('\n❌ EXTRACTION TEST FAILED');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data?.substring?.(0, 500));
    }
    console.error('Stack:', error.stack);
    return false;
  }
}

// Test with real StreamWish URLs
async function runTests() {
  console.log('🚀 StreamWish Extractor Test Suite');
  console.log('Testing extraction flow before creating the extractor\n');

  // Test URLs - Real StreamWish URLs from Primewire debug
  const testUrls = [
    'https://streamwish.to/e/b0z6i87x4iki',
    'https://streamwish.to/e/zzmrsww6b3cn',
  ];

  if (testUrls.length === 0) {
    console.log('⚠️ No test URLs provided');
    console.log('📝 Please add real StreamWish URLs to test');
    console.log('   You can get these from Primewire server links');
    console.log('\n💡 Usage:');
    console.log('   1. Find a movie/show on Primewire');
    console.log('   2. Check server list for StreamWish links');
    console.log('   3. Add the URLs to the testUrls array');
    console.log('   4. Run: node test-streamwish-extraction.js');
    return;
  }

  let passed = 0;
  let failed = 0;

  for (const url of testUrls) {
    const result = await testStreamWishExtraction(url);
    if (result) {
      passed++;
    } else {
      failed++;
    }
    
    // Wait between tests
    if (testUrls.indexOf(url) < testUrls.length - 1) {
      console.log('\n⏳ Waiting 3 seconds before next test...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${passed}/${testUrls.length}`);
  console.log(`❌ Failed: ${failed}/${testUrls.length}`);
  console.log('='.repeat(80));

  if (passed === testUrls.length) {
    console.log('\n🎉 All tests passed! Ready to create the extractor.');
  } else {
    console.log('\n⚠️ Some tests failed. Review the output and adjust extraction logic.');
  }
}

runTests().catch(console.error);
