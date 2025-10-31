/**
 * Debug script to test SkyMovieHD provider extraction
 * Mimics the React Native app behavior
 */

const axios = require('axios');
const cheerio = require('cheerio');

// Import compiled extractors from dist
const streamtapeExtractor = require('./dist/streamtapeExtractor');
const doodExtractor = require('./dist/doodExtractor');
const voeExtractor = require('./dist/voeExtractor');
const streamhgExtractor = require('./dist/streamhgExtractor');
const mixdropExtractor = require('./dist/mixdropExtractor');
const uptomegaExtractor = require('./dist/uptomegaExtractor');
const uploadhubExtractor = require('./dist/uploadhubExtractor');
const indishareExtractor = require('./dist/indishareExtractor');

// Import skyMovieHD provider
const { getStream } = require('./dist/skyMovieHD/stream');
const { getMeta } = require('./dist/skyMovieHD/meta');

// Create provider context (mimics app's provider context)
const providerContext = {
  axios,
  cheerio,
  extractors: {
    streamtapeExtractor: streamtapeExtractor.streamtapeExtractor,
    doodExtractor: doodExtractor.doodExtractor,
    voeExtractor: voeExtractor.voeExtractor,
    streamhgExtractor: streamhgExtractor.streamhgExtractor,
    mixdropExtractor: mixdropExtractor.mixdropExtractor,
    uptomegaExtractor: uptomegaExtractor.uptomegaExtractor,
    uploadhubExtractor: uploadhubExtractor.uploadhubExtractor,
    indishareExtractor: indishareExtractor.indishareExtractor,
  }
};

async function testMovie() {
  const movieUrl = 'https://skymovieshd.mba/movie/Nishaanchi-(2025)-Hindi-720p-HEVC-HDRip-x265-AAC-ESubs-Full-Bollywood-Movie-[1GB].html';
  
  console.log('\n' + '='.repeat(80));
  console.log(`🎬 Testing Movie: ${movieUrl}`);
  console.log('='.repeat(80) + '\n');

  try {
    // Step 1: Get metadata (mimics app's getMeta call)
    console.log('📋 Step 1: Fetching metadata...\n');
    const metadata = await getMeta({ link: movieUrl, providerContext });
    
    console.log('✅ Metadata received:');
    console.log('   Title:', metadata.title);
    console.log('   Type:', metadata.type);
    console.log('   Link List:', metadata.linkList?.length || 0);
    
    if (metadata.linkList && metadata.linkList.length > 0) {
      console.log('\n📦 Link List:');
      metadata.linkList.forEach((dl, i) => {
        console.log(`   ${i + 1}. ${dl.title} (${dl.quality})`);
        console.log(`      Direct Links:`, dl.directLinks?.length || 0);
      });
      
      // Step 2: Extract streams from first quality's first direct link (mimics app's behavior)
      const firstQuality = metadata.linkList[0];
      if (firstQuality.directLinks && firstQuality.directLinks.length > 0) {
        const firstLink = firstQuality.directLinks[0];
        console.log('\n' + '-'.repeat(80));
        console.log('🔗 Step 2: Extracting streams from:', firstLink.title);
        console.log('   Link:', firstLink.link.substring(0, 100) + '...');
        console.log('-'.repeat(80) + '\n');
        
        const streams = await getStream({
          link: firstLink.link,
          type: 'movie',
          axios,
          providerContext
        });
        
        console.log('\n✅ Extraction complete!\n');
        console.log('📊 Results:');
        console.log('   Total servers found:', streams.length);
      
      if (streams.length > 0) {
        console.log('\n🎯 Server Details:\n');
        
        const eagerServers = streams.filter(s => s.type !== 'lazy');
        const lazyServers = streams.filter(s => s.type === 'lazy');
        
        console.log(`   ✅ Eager extracted (${eagerServers.length}):`);
        eagerServers.forEach((stream, i) => {
          console.log(`      ${i + 1}. ${stream.server} (${stream.type})`);
          console.log(`         Link: ${stream.link.substring(0, 80)}...`);
        });
        
        console.log(`\n   💤 Lazy-load (${lazyServers.length}):`);
        lazyServers.forEach((stream, i) => {
          try {
            const meta = JSON.parse(stream.link);
            console.log(`      ${i + 1}. ${stream.server} (${meta.type})`);
            console.log(`         Href: ${meta.href}`);
          } catch (e) {
            console.log(`      ${i + 1}. ${stream.server}`);
          }
        });
        
        // Step 3: Test lazy extraction for first lazy server
        if (lazyServers.length > 0) {
          console.log('\n' + '-'.repeat(80));
          console.log('🧪 Step 3: Testing lazy extraction for first lazy server');
          console.log('-'.repeat(80) + '\n');
          
          const lazyServer = lazyServers[0];
          console.log(`Testing: ${lazyServer.server}`);
          
          try {
            const lazyStreams = await getStream({
              link: lazyServer.link,
              type: 'movie',
              axios,
              providerContext
            });
            
            if (lazyStreams && lazyStreams.length > 0) {
              console.log(`✅ Lazy extraction successful!`);
              console.log(`   Extracted link: ${lazyStreams[0].link.substring(0, 80)}...`);
            } else {
              console.log(`❌ Lazy extraction returned no streams`);
            }
          } catch (error) {
            console.log(`❌ Lazy extraction failed:`, error.message);
          }
        }
        } else {
          console.log('⚠️  No servers found!');
        }
      } else {
        console.log('⚠️  No direct links in first quality');
      }
    } else {
      console.log('⚠️  No link list found in metadata');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ Test complete!');
  console.log('='.repeat(80) + '\n');
}

// Test URLs
const TEST_MOVIES = [
  'https://skymovieshd.mba/movie/Nishaanchi-(2025)-Hindi-1080p-HDRip-x264-AAC-5.1-ESubs-Full-Bollywood-Movie-[3.2GB].html',
  // Add more test URLs here if needed
];

// Run tests
async function runTests() {
  console.log('🚀 Starting SkyMovieHD Debug Tests\n');
  
  for (const url of TEST_MOVIES) {
    await testMovie(url);
    
    // Wait a bit between tests to avoid rate limiting
    if (TEST_MOVIES.indexOf(url) < TEST_MOVIES.length - 1) {
      console.log('⏳ Waiting 2 seconds before next test...\n');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log('🎉 All tests completed!\n');
}

// Run if called directly
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testMovie, runTests };
