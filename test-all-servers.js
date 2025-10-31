const axios = require('axios');
const cheerio = require('cheerio');

// Import compiled providers
const skyMovieHD = require('./dist/skyMovieHD/stream');
const { getMeta } = require('./dist/skyMovieHD/meta');
const { getStream, extractLazyServer } = skyMovieHD;
const { uptomegaExtractor } = require('./dist/uptomegaExtractor');
const { uploadhubExtractor } = require('./dist/uploadhubExtractor');
const { streamhgExtractor } = require('./dist/streamhgExtractor');
const { streamtapeExtractor } = require('./dist/streamtapeExtractor');
const { voeExtractor } = require('./dist/voeExtractor');
const { indishareExtractor } = require('./dist/indishareExtractor');
const { doodExtractor } = require('./dist/doodExtractor');
const { mixdropExtractor } = require('./dist/mixdropExtractor');

// Create provider context with all extractors
const providerContext = {
  axios,
  cheerio,
  extractors: {
    streamtapeExtractor,
    voeExtractor,
    streamhgExtractor,
    uptomegaExtractor,
    uploadhubExtractor,
    indishareExtractor,
    doodExtractor,
    mixdropExtractor,
  }
};

async function testAllServers() {
  const movieUrl = 'https://skymovieshd.mba/movie/Nishaanchi-(2025)-Hindi-720p-HEVC-HDRip-x265-AAC-ESubs-Full-Bollywood-Movie-[1GB].html';
  
  console.log('\n🚀 Testing All Servers for SkyMovieHD');
  console.log('='.repeat(80) + '\n');

  try {
    // Step 1: Get metadata
    console.log('📋 Step 1: Getting metadata...');
    const metadata = await getMeta({ link: movieUrl, providerContext });
    
    if (!metadata.linkList || metadata.linkList.length === 0) {
      console.log('❌ No link list found');
      return;
    }

    // Step 2: Get streams (eager + lazy list)
    const firstLink = metadata.linkList[0].directLinks[0];
    console.log(`\n🔗 Step 2: Getting stream list from: ${firstLink.title}`);
    const streams = await getStream({
      link: firstLink.link,
      type: 'movie',
      providerContext,
    });

    console.log(`\n✅ Found ${streams.length} total servers\n`);

    // Step 3: Test each server
    for (let i = 0; i < streams.length; i++) {
      const stream = streams[i];
      console.log(`\n${'='.repeat(80)}`);
      console.log(`🧪 Testing Server ${i + 1}/${streams.length}: ${stream.server}`);
      console.log('='.repeat(80));

      if (stream.type === 'lazy') {
        console.log('💤 Lazy-load server - extracting on-demand...');
        const startTime = Date.now();
        
        try {
          const extracted = await extractLazyServer({
            link: stream.link,
            providerContext,
          });

          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);

          if (extracted && extracted.length > 0) {
            console.log(`✅ SUCCESS (${elapsed}s)`);
            console.log(`   Server: ${extracted[0].server}`);
            console.log(`   Type: ${extracted[0].type}`);
            console.log(`   Link: ${extracted[0].link.slice(0, 100)}...`);
          } else {
            console.log(`❌ FAILED (${elapsed}s) - No streams returned`);
          }
        } catch (error) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          console.log(`❌ FAILED (${elapsed}s) - Error: ${error.message}`);
        }
      } else {
        console.log(`✅ EAGER - Already extracted`);
        console.log(`   Type: ${stream.type}`);
        console.log(`   Link: ${stream.link.slice(0, 100)}...`);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('🎉 All tests completed!');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

testAllServers();
