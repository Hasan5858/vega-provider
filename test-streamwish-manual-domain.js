/**
 * StreamWish with Manual Domain Test
 * Using yuguaab.com as the working domain
 */

const axios = require('axios');

const DEOBFUSCATE_API = "https://js-deobfuscator-api.replit.app/api/deobfuscate";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Referer": "https://yuguaab.com/",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};

async function testStreamWishWithDomain(originalUrl, workingDomain) {
  console.log('\n🧪 Testing StreamWish with manual domain');
  console.log('='.repeat(80));
  console.log('Original URL:', originalUrl);
  console.log('Working Domain:', workingDomain);

  try {
    // Step 1: Extract video ID from original URL
    console.log('\n📝 Step 1: Extracting video ID...');
    const idMatch = originalUrl.match(/\/(?:e|embed|v)\/([A-Za-z0-9_-]+)/i);
    if (!idMatch) {
      console.error('❌ Could not extract video ID');
      return false;
    }
    const videoId = idMatch[1];
    console.log('✅ Video ID:', videoId);

    // Step 2: Convert to working domain
    const embedUrl = `${workingDomain}/e/${videoId}`;
    console.log('\n📝 Step 2: Converted URL:', embedUrl);

    // Step 3: Fetch embed page
    console.log('\n📝 Step 3: Fetching embed page...');
    const response = await axios.get(embedUrl, {
      headers,
      timeout: 15000,
    });
    console.log('✅ Page fetched:', response.data.length, 'chars');

    const html = response.data;

    // Step 4: Look for eval code
    console.log('\n📝 Step 4: Searching for eval code...');
    const evalPattern = /eval\(function\(p,a,c,k,e,d\)[\s\S]+?\.split\('\|'\)\)\)/;
    const evalMatch = html.match(evalPattern);

    if (!evalMatch) {
      console.error('❌ No eval code found');
      console.log('\n📄 Page content preview:');
      console.log(html.substring(0, 500));
      return false;
    }

    const evalCode = evalMatch[0];
    console.log('✅ Found eval code:', evalCode.length, 'chars');
    console.log('   Preview:', evalCode.substring(0, 150) + '...');

    // Step 5: Deobfuscate
    console.log('\n📝 Step 5: Deobfuscating...');
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
    console.log('✅ Deobfuscated:', deobfuscated.length, 'chars');
    console.log('   Preview:', deobfuscated.substring(0, 300));

    // Step 6: Extract stream URL
    console.log('\n📝 Step 6: Extracting stream URL...');
    
    // Try multiple patterns
    let streamUrl = null;
    let streamType = null;

    // Pattern 1: Direct m3u8
    const m3u8Match = deobfuscated.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
    if (m3u8Match) {
      streamUrl = m3u8Match[0].replace(/&amp;/g, "&");
      streamType = 'm3u8';
      console.log('✅ Found m3u8 URL (direct)');
    }

    // Pattern 2: Sources array
    if (!streamUrl) {
      const sourcesMatch = deobfuscated.match(/"sources":\s*\[[\s\S]*?"file":\s*"([^"]+)"/);
      if (sourcesMatch) {
        streamUrl = sourcesMatch[1].replace(/\\/g, "").replace(/&amp;/g, "&");
        streamType = streamUrl.includes('.m3u8') ? 'm3u8' : 'mp4';
        console.log('✅ Found stream URL (sources)');
      }
    }

    // Pattern 3: File property
    if (!streamUrl) {
      const fileMatch = deobfuscated.match(/"file":\s*"([^"]+)"/);
      if (fileMatch) {
        streamUrl = fileMatch[1].replace(/\\/g, "").replace(/&amp;/g, "&");
        streamType = streamUrl.includes('.m3u8') ? 'm3u8' : 'mp4';
        console.log('✅ Found stream URL (file)');
      }
    }

    if (!streamUrl) {
      console.error('❌ Could not extract stream URL');
      console.log('\n📄 Deobfuscated content:');
      console.log(deobfuscated);
      return false;
    }

    console.log('   Stream URL:', streamUrl);
    console.log('   Type:', streamType);

    // Step 7: Verify stream URL
    console.log('\n📝 Step 7: Verifying stream...');
    try {
      const streamHeaders = {
        "User-Agent": headers["User-Agent"],
        "Referer": workingDomain + "/",
      };
      
      const streamResponse = await axios.head(streamUrl, {
        headers: streamHeaders,
        timeout: 10000,
        maxRedirects: 5,
      });
      
      console.log('✅ Stream is accessible');
      console.log('   Status:', streamResponse.status);
      console.log('   Content-Type:', streamResponse.headers['content-type']);
    } catch (error) {
      console.warn('⚠️ Could not verify (may need GET):', error.message);
    }

    // SUCCESS!
    console.log('\n' + '='.repeat(80));
    console.log('✅ ✅ ✅ EXTRACTION SUCCESSFUL! ✅ ✅ ✅');
    console.log('='.repeat(80));
    console.log('📊 Results:');
    console.log('   Working Domain: ' + workingDomain);
    console.log('   Video ID: ' + videoId);
    console.log('   Stream URL: ' + streamUrl);
    console.log('   Stream Type: ' + streamType);
    console.log('   Eval Code Length: ' + evalCode.length + ' chars');
    console.log('   Deobfuscated Length: ' + deobfuscated.length + ' chars');
    console.log('='.repeat(80));

    return {
      success: true,
      videoId,
      workingDomain,
      streamUrl,
      streamType,
      evalCodeLength: evalCode.length,
      deobfuscatedLength: deobfuscated.length,
    };

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data?.substring?.(0, 500));
    }
    return false;
  }
}

async function run() {
  console.log('🚀 StreamWish Manual Domain Test');
  console.log('Strategy: Use yuguaab.com (DMCA-free) → Extract eval → Deobfuscate → Get stream\n');

  const testCases = [
    {
      original: 'https://streamwish.to/e/b0z6i87x4iki',
      domain: 'https://yuguaab.com',
    },
    {
      original: 'https://streamwish.to/e/zzmrsww6b3cn',
      domain: 'https://yuguaab.com',
    },
  ];

  let successCount = 0;
  const results = [];

  for (const test of testCases) {
    const result = await testStreamWishWithDomain(test.original, test.domain);
    if (result && result.success) {
      successCount++;
      results.push(result);
    }

    // Wait between tests
    if (testCases.indexOf(test) < testCases.length - 1) {
      console.log('\n⏳ Waiting 3 seconds before next test...\n');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('📊 FINAL TEST RESULTS');
  console.log('='.repeat(80));
  console.log(`✅ Passed: ${successCount}/${testCases.length}`);
  console.log(`❌ Failed: ${testCases.length - successCount}/${testCases.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 SUCCESS! Ready to create StreamWish extractor!');
    console.log('\n📝 Extractor Configuration:');
    console.log('   - Working Domain: https://yuguaab.com');
    console.log('   - Pattern: eval() unpacking (like FileLions)');
    console.log('   - Deobfuscation: Required');
    console.log('   - Update Strategy: Replace domain when blocked');
  } else {
    console.log('\n⚠️ All tests failed. Domain may be blocked or pattern changed.');
  }
  console.log('='.repeat(80));
}

run().catch(console.error);
