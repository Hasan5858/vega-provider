/**
 * StreamWish HTML Inspection
 * Let's see what the actual page structure looks like
 */

const axios = require('axios');

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Referer": "https://streamwish.to/",
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};

async function inspectStreamWish(url) {
  console.log('🔍 Inspecting StreamWish URL:', url);
  console.log('='.repeat(80));

  try {
    const response = await axios.get(url, {
      headers,
      timeout: 15000,
      maxRedirects: 10, // Follow redirects
    });

    const html = response.data;
    
    console.log('\n📄 Response Details:');
    console.log('   Status:', response.status);
    console.log('   Final URL:', response.request.res.responseUrl || url);
    console.log('   Content-Type:', response.headers['content-type']);
    console.log('   Content-Length:', html.length, 'chars');
    
    console.log('\n📝 Response Headers:');
    Object.keys(response.headers).forEach(key => {
      console.log(`   ${key}: ${response.headers[key]}`);
    });

    console.log('\n📄 Full HTML Content:');
    console.log('─'.repeat(80));
    console.log(html);
    console.log('─'.repeat(80));

    // Check for common patterns
    console.log('\n🔍 Content Analysis:');
    console.log('   Contains "eval":', html.includes('eval'));
    console.log('   Contains "function":', html.includes('function'));
    console.log('   Contains "script":', html.includes('script'));
    console.log('   Contains "iframe":', html.includes('iframe'));
    console.log('   Contains "embed":', html.includes('embed'));
    console.log('   Contains "video":', html.includes('video'));
    console.log('   Contains "source":', html.includes('source'));
    console.log('   Contains "m3u8":', html.includes('m3u8'));
    console.log('   Contains "mp4":', html.includes('mp4'));
    console.log('   Contains "file":', html.includes('file'));
    console.log('   Contains "player":', html.includes('player'));
    
    // Check for iframes
    const iframeMatches = html.match(/<iframe[^>]*src=["']([^"']+)["']/gi);
    if (iframeMatches) {
      console.log('\n🎬 Found iframes:');
      iframeMatches.forEach((match, idx) => {
        const srcMatch = match.match(/src=["']([^"']+)["']/i);
        if (srcMatch) {
          console.log(`   ${idx + 1}. ${srcMatch[1]}`);
        }
      });
    }

    // Check for meta refresh
    const metaRefresh = html.match(/<meta[^>]*http-equiv=["']refresh["'][^>]*content=["']([^"']+)["']/i);
    if (metaRefresh) {
      console.log('\n🔄 Meta refresh found:', metaRefresh[1]);
    }

    // Check for window.location
    const locationMatch = html.match(/window\.location\s*=\s*["']([^"']+)["']/i);
    if (locationMatch) {
      console.log('\n🔄 JavaScript redirect found:', locationMatch[1]);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
      console.error('Data:', error.response.data);
    }
  }
}

async function run() {
  const testUrls = [
    'https://streamwish.to/e/b0z6i87x4iki',
  ];

  for (const url of testUrls) {
    await inspectStreamWish(url);
    console.log('\n');
  }
}

run().catch(console.error);
