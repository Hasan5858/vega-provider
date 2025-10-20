const { getStream } = require('./dist/katmovies/stream.js');

async function testSimpleStream() {
  console.log('🧪 Testing Simple Stream Function');
  console.log('=' .repeat(50));

  try {
    // Test with the working link from our debug
    const testLink = 'https://links.kmhd.net/file/Liar_fe8eb354';
    const testType = 'movie';
    
    console.log(`Testing with link: ${testLink}`);
    
    // Create a mock provider context
    const providerContext = {
      axios: require('axios'),
      cheerio: require('cheerio'),
      extractors: {
        hubcloudExtracter: require('./dist/hubcloudExtractor.js').hubcloudExtracter,
        gdFlixExtracter: require('./dist/gdflixExtractor.js').gdFlixExtracter
      }
    };
    
    // Create an abort signal
    const controller = new AbortController();
    const signal = controller.signal;
    
    console.log('\n🚀 Calling getStream...');
    const streams = await getStream({
      link: testLink,
      type: testType,
      signal: signal,
      providerContext: providerContext
    });
    
    console.log(`\n✅ SUCCESS: Found ${streams.length} stream links!`);
    
    streams.forEach((stream, index) => {
      console.log(`\n${index + 1}. Server: ${stream.server}`);
      console.log(`   Link: ${stream.link}`);
      console.log(`   Type: ${stream.type}`);
      console.log(`   Quality: ${stream.quality || 'N/A'}`);
      
      // Check if this is a working URL
      if (stream.link.includes('hubcloud.ink') || stream.link.includes('gd.kmhd.net')) {
        console.log(`   🎯 This looks like a working server URL!`);
      } else if (stream.link.includes('1xplayer.com')) {
        console.log(`   ⚠️  This is a 1xplayer URL - may need further processing`);
      } else {
        console.log(`   ❓ Unknown URL type`);
      }
    });
    
    if (streams.length > 0) {
      console.log('\n🎉 Stream extraction completed!');
    } else {
      console.log('\n❌ No streams found');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(`Status Text: ${error.response.statusText}`);
    }
  }
}

testSimpleStream();
