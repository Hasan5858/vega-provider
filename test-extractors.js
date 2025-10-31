/**
 * Test extractors independently to verify they work
 */

const axios = require('axios');
const { uptomegaExtractor } = require('./dist/uptomegaExtractor');
const { streamhgExtractor } = require('./dist/streamhgExtractor');
const { voeExtractor } = require('./dist/voeExtractor');
const { doodExtractor } = require('./dist/doodExtractor');
const { mixdropExtractor } = require('./dist/mixdropExtractor');
const { streamtapeExtractor } = require('./dist/streamtapeExtractor');

async function testExtractors() {
  console.log('🧪 Testing Extractors...\n');

  // Test URLs from the logs
  const tests = [
    {
      name: 'Uptomega',
      url: 'https://uptomega.net/du2vw879veo1',
      extractor: uptomegaExtractor,
      withAxios: true,
    },
    {
      name: 'StreamHG',
      url: 'https://hglink.to/zqpw2hy39tck',
      extractor: streamhgExtractor,
      withAxios: true,
    },
    {
      name: 'VOE',
      url: 'https://voe.sx/e/example', // Need real URL
      extractor: voeExtractor,
      withAxios: false,
    },
    {
      name: 'Dood',
      url: 'https://dood.watch/e/example', // Need real URL
      extractor: doodExtractor,
      withAxios: true,
    },
    {
      name: 'Mixdrop',
      url: 'https://mixdrop.ag/e/example', // Need real URL
      extractor: mixdropExtractor,
      withAxios: true,
    },
    {
      name: 'StreamTape',
      url: 'https://streamtape.com/e/example', // Need real URL
      extractor: streamtapeExtractor,
      withAxios: true,
    },
  ];

  for (const test of tests) {
    console.log(`\n📝 Testing ${test.name}...`);
    console.log(`   URL: ${test.url}`);
    
    try {
      const startTime = Date.now();
      let result;
      
      if (test.withAxios) {
        result = await test.extractor(test.url, axios);
      } else {
        result = await test.extractor(test.url);
      }
      
      const duration = Date.now() - startTime;
      
      if (result) {
        if (Array.isArray(result)) {
          console.log(`   ✅ Success (${duration}ms) - ${result.length} streams`);
          result.forEach((stream, i) => {
            console.log(`      [${i}] ${stream.server}: ${stream.link?.substring(0, 80)}...`);
          });
        } else {
          console.log(`   ✅ Success (${duration}ms)`);
          console.log(`      Link: ${result.link?.substring(0, 80)}...`);
          console.log(`      Type: ${result.type}`);
        }
      } else {
        console.log(`   ❌ Failed (${duration}ms) - Returned null`);
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      if (error.code) console.log(`      Code: ${error.code}`);
      if (error.response) {
        console.log(`      Status: ${error.response.status}`);
      }
    }
  }
}

// Run tests
testExtractors().then(() => {
  console.log('\n✨ Tests complete!');
}).catch(error => {
  console.error('\n💥 Test runner error:', error);
  process.exit(1);
});
