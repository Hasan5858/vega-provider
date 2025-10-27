const axios = require('axios');
const cheerio = require('cheerio');

// Test URLs from "The Long Walk" movie
const STREAMTAPE_URL = 'https://streamta.site/e/pkyXZVbyAJHrOKq/The.Long.Walk.2025.720p.WEB.H264-SLOT.mkv.mp4';
const DOODSTREAM_URL = 'https://dood.watch/e/b5gaxp2xh6t3';

async function testStreamTape(url) {
  console.log('\n🎬 Testing StreamTape Extractor...');
  console.log(`URL: ${url}\n`);
  
  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Referer': url,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const html = data;
    
    // Extract the JavaScript-manipulated robotlink value
    const robotlinkMatch = html.match(/getElementById\('robotlink'\)\.innerHTML\s*=\s*'([^']+)'\s*\+\s*\('([^']+)'\)\.substring\((\d+)\)(?:\.substring\((\d+)\))?/);
    
    if (robotlinkMatch) {
      const prefix = robotlinkMatch[1];
      const mangledString = robotlinkMatch[2];
      const firstSubstring = parseInt(robotlinkMatch[3]);
      const secondSubstring = robotlinkMatch[4] ? parseInt(robotlinkMatch[4]) : 0;
      
      let processed = mangledString.substring(firstSubstring);
      if (secondSubstring > 0) {
        processed = processed.substring(secondSubstring);
      }
      
      const rawLink = prefix + processed;
      console.log(`✅ Parsed JavaScript: ${rawLink}`);
      
      // Normalize URL
      const finalUrl = rawLink.startsWith('//') ? `https:${rawLink}` : rawLink;
      const streamUrl = finalUrl.includes('&stream=') ? finalUrl : `${finalUrl}&stream=1`;
      
      console.log(`✅ Final Stream URL: ${streamUrl}`);
      
      // Test if URL returns video content
      const headResponse = await axios.head(streamUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': url,
        },
        maxRedirects: 5,
        validateStatus: (status) => status < 500
      });
      
      console.log(`📊 Response Status: ${headResponse.status}`);
      console.log(`📊 Content-Type: ${headResponse.headers['content-type']}`);
      console.log(`📊 Content-Length: ${headResponse.headers['content-length'] || 'N/A'}`);
      
      if (headResponse.status === 200 && headResponse.headers['content-type']?.includes('video')) {
        console.log('✅ StreamTape: WORKING - Returns valid video content!');
        return true;
      } else {
        console.log(`❌ StreamTape: FAILED - Content-Type: ${headResponse.headers['content-type']}`);
        return false;
      }
    } else {
      console.log('❌ Could not parse robotlink JavaScript');
      return false;
    }
  } catch (error) {
    console.error('❌ StreamTape Error:', error.message);
    return false;
  }
}

async function testDoodStream(url) {
  console.log('\n🎬 Testing DoodStream Extractor...');
  console.log(`URL: ${url}\n`);
  
  try {
    // Extract video ID
    const videoId = url.match(/\/e\/([^/?]+)/)?.[1];
    if (!videoId) {
      console.log('❌ Could not extract video ID');
      return false;
    }
    console.log(`✅ Video ID: ${videoId}`);
    
    // Try different hosts
    const hosts = ['https://dood.watch', 'https://dsvplay.com', 'https://dood.la'];
    let embedHtml = null;
    let activeHost = null;
    
    for (const host of hosts) {
      try {
        const embedUrl = `${host}/e/${videoId}`;
        const response = await axios.get(embedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': `${host}/d/${videoId}`,
          },
          timeout: 5000
        });
        embedHtml = response.data;
        activeHost = host;
        console.log(`✅ Active host: ${activeHost}`);
        break;
      } catch (err) {
        console.log(`⚠️  Host ${host} failed, trying next...`);
      }
    }
    
    if (!embedHtml || !activeHost) {
      console.log('❌ All hosts failed');
      return false;
    }
    
    // Parse pass_md5 and token from JavaScript
    const passMatch = embedHtml.match(/\/pass_md5\/([^'"\n]+)/);
    const tokenMatch = embedHtml.match(/token=([a-z0-9]+)/i);
    
    if (!passMatch || !tokenMatch) {
      console.log('❌ Could not parse pass_md5 or token from HTML');
      console.log('Pass match:', passMatch?.[1] || 'Not found');
      console.log('Token match:', tokenMatch?.[1] || 'Not found');
      return false;
    }
    
    console.log(`✅ Found pass_md5: ${passMatch[1]}`);
    console.log(`✅ Found token: ${tokenMatch[1]}`);
    
    // Get the base stream URL
    const passUrl = `${activeHost}/pass_md5/${passMatch[1]}`;
    console.log(`📡 Fetching stream base from: ${passUrl}`);
    
    const tokenResponse = await axios.get(passUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': `${activeHost}/e/${videoId}`,
      }
    });
    
    const baseStream = tokenResponse.data;
    const randomStr = Math.random().toString(36).substring(2, 12);
    const finalUrl = `${baseStream}${randomStr}?token=${tokenMatch[1]}&expiry=${Date.now()}`;
    console.log(`✅ Final Stream URL: ${finalUrl}`);
    
    // Test if URL returns video content
    const headResponse = await axios.head(finalUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': url,
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 500
    });
    
    console.log(`📊 Response Status: ${headResponse.status}`);
    console.log(`📊 Content-Type: ${headResponse.headers['content-type']}`);
    console.log(`📊 Content-Length: ${headResponse.headers['content-length'] || 'N/A'}`);
    
    if (headResponse.status === 200 && (headResponse.headers['content-type']?.includes('video') || headResponse.headers['content-type']?.includes('octet-stream'))) {
      console.log('✅ DoodStream: WORKING - Returns valid video content!');
      return true;
    } else {
      console.log(`❌ DoodStream: FAILED - Content-Type: ${headResponse.headers['content-type']}`);
      return false;
    }
  } catch (error) {
    console.error('❌ DoodStream Error:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🧪 Starting Extractor Tests...');
  console.log('=' .repeat(60));
  
  const streamtapeResult = await testStreamTape(STREAMTAPE_URL);
  const doodstreamResult = await testDoodStream(DOODSTREAM_URL);
  
  console.log('\n' + '=' .repeat(60));
  console.log('📊 TEST RESULTS:');
  console.log('=' .repeat(60));
  console.log(`StreamTape:  ${streamtapeResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`DoodStream:  ${doodstreamResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log('=' .repeat(60));
  
  if (streamtapeResult && doodstreamResult) {
    console.log('\n✨ All extractors working correctly! Safe to push.');
    process.exit(0);
  } else {
    console.log('\n⚠️  Some extractors failed! Review before pushing.');
    process.exit(1);
  }
}

runTests();
