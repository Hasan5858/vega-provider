const axios = require('axios');

const testUrl = 'https://luluvdoo.com/e/lxha81u0t6jr';

async function debugLuluvdoo() {
  try {
    console.log('Fetching:', testUrl);
    const response = await axios.get(testUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    const html = response.data;
    console.log('\n=== HTML LENGTH ===');
    console.log(html.length, 'characters');

    // Look for eval patterns
    console.log('\n=== EVAL PATTERNS ===');
    const evalMatches = html.match(/eval\(function\(p,a,c,k,e,[rd]\)/g);
    if (evalMatches) {
      console.log('Found', evalMatches.length, 'eval patterns');
    }

    // Extract packed function
    const packedMatch = html.match(/eval\(function\(p,a,c,k,e,[rd]\)\{.*?\}\((.*?)\)\)/s);
    if (packedMatch) {
      console.log('\n=== PACKED FUNCTION FOUND ===');
      console.log('First 200 chars:', packedMatch[0].substring(0, 200));
    }

    // Look for file/sources
    console.log('\n=== FILE/SOURCE PATTERNS ===');
    const fileMatch = html.match(/"file":\s*"([^"]+)"/);
    if (fileMatch) console.log('file:', fileMatch[1]);
    
    const sourcesMatch = html.match(/"sources":\s*\[([^\]]+)\]/);
    if (sourcesMatch) console.log('sources:', sourcesMatch[1]);

    // Look for video URLs
    console.log('\n=== VIDEO URL PATTERNS ===');
    const mp4Matches = html.match(/https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/gi);
    if (mp4Matches) {
      console.log('Found MP4 URLs:');
      mp4Matches.forEach(url => console.log(' -', url));
    }

    // Save full HTML
    const fs = require('fs');
    fs.writeFileSync('luluvdoo-page.html', html);
    console.log('\n✅ Full HTML saved to luluvdoo-page.html');

  } catch (error) {
    console.error('Error:', error.message);
  }
}

debugLuluvdoo();
