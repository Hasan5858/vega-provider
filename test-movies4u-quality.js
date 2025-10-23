/**
 * Test script to verify Movies4U stream extraction and quality formatting
 * Mimics the app's behavior when fetching streams
 */

const axios = require('axios');

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

// Test Movie links (you can find these from the app)
const testLinks = [
  // Add a movie link here to test
  // Example: 'https://movies4u.movie/movie/some-movie'
];

async function getQualityFromService(serviceName) {
  // Extract quality based on service name or URL pattern
  if (serviceName.includes('1080') || serviceName.includes('4K')) return '1080';
  if (serviceName.includes('2160')) return '2160';
  if (serviceName.includes('480')) return '480';
  if (serviceName.includes('360')) return '360';
  if (serviceName.includes('FastDL')) return '720';
  if (serviceName.includes('GDFlix')) return '720';
  if (serviceName.includes('HubCloud')) return '720';
  if (serviceName.includes('GoFile')) return '720';
  if (serviceName.includes('VCloud')) return '720';
  if (serviceName.includes('FilePres')) return '480';
  return '720'; // Default quality
}

async function testWorkerResponse() {
  console.log('\n🧪 Testing Movies4U Worker Response...\n');
  
  try {
    // Test with a sample movie link (if available)
    if (testLinks.length === 0) {
      console.log('⚠️  No test links provided. Using generic test of quality function.\n');
      
      // Test the quality function
      const services = ['FastDL', 'VCloud', 'FilePres', 'GDFlix', 'HubCloud', 'GoFile'];
      console.log('Quality Detection Results:');
      console.log('─'.repeat(50));
      for (const service of services) {
        const quality = await getQualityFromService(service);
        console.log(`${service.padEnd(15)} → Quality: ${quality}`);
      }
      console.log('─'.repeat(50));
      return;
    }

    for (const link of testLinks) {
      console.log(`\n📽️  Testing link: ${link}\n`);
      
      const response = await axios.get(WORKER_URL, {
        params: {
          action: 'stream',
          link: link,
        },
        timeout: 30000,
      });

      if (!response.data.success) {
        console.log('❌ Worker returned error:', response.data.error);
        continue;
      }

      const streams = response.data.streams || [];
      console.log(`✅ Worker returned ${streams.length} stream links\n`);

      // Group streams by server
      const streamsByServer = {};
      
      for (const stream of streams) {
        const server = stream.server || 'Unknown';
        if (!streamsByServer[server]) {
          streamsByServer[server] = [];
        }
        streamsByServer[server].push({
          link: stream.link,
          quality: await getQualityFromService(server),
          server: server,
        });
      }

      // Display formatted results
      console.log('📊 Stream Breakdown by Service:');
      console.log('─'.repeat(70));
      
      for (const [server, streamList] of Object.entries(streamsByServer)) {
        console.log(`\n${server.toUpperCase()}:`);
        for (const stream of streamList) {
          const linkPreview = stream.link.substring(0, 50) + '...';
          console.log(
            `  • Quality: ${stream.quality.padEnd(5)} | Link: ${linkPreview}`
          );
        }
      }
      
      console.log('\n' + '─'.repeat(70));
      console.log(`\n✨ Total unique servers: ${Object.keys(streamsByServer).length}`);
      console.log(`✨ Total streams: ${streams.length}\n`);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response?.status === 404) {
      console.error(
        '\n⚠️  Worker returned 404. This could mean:\n' +
        '   1. The Cloudflare Worker is down\n' +
        '   2. The movie page structure has changed\n' +
        '   3. The link format is invalid\n'
      );
    }
  }
}

async function testQualityMapping() {
  console.log('\n🎬 Testing Quality Mapping Function...\n');
  
  const testCases = [
    { input: 'FastDL - 720p', expected: '720' },
    { input: 'VCloud - 480p', expected: '480' },
    { input: 'GDFlix - 1080p', expected: '1080' },
    { input: 'HubCloud - 2160p', expected: '2160' },
    { input: 'GoFile', expected: '720' },
    { input: 'FilePres', expected: '480' },
    { input: 'Unknown Service', expected: '720' },
  ];

  let passed = 0;
  let failed = 0;

  console.log('Test Results:');
  console.log('─'.repeat(70));
  
  for (const testCase of testCases) {
    const result = await getQualityFromService(testCase.input);
    const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL';
    
    if (result === testCase.expected) {
      passed++;
    } else {
      failed++;
    }
    
    console.log(
      `${status} | Input: "${testCase.input}" → Expected: ${testCase.expected}, Got: ${result}`
    );
  }

  console.log('─'.repeat(70));
  console.log(`\nResults: ${passed} passed, ${failed} failed\n`);
  
  return failed === 0;
}

async function testStreamFormatting() {
  console.log('\n📋 Testing Stream Object Formatting...\n');
  
  const mockStreams = [
    {
      server: 'FastDL',
      link: 'https://fastdl.zip/embed?download=abc123',
      type: 'mp4',
    },
    {
      server: 'VCloud',
      link: 'https://vcloud.site/download/xyz789',
      type: 'mkv',
    },
    {
      server: 'FilePres',
      link: 'https://filepress.io/file/123',
      type: 'mp4',
    },
  ];

  console.log('Expected Stream Format:');
  console.log('─'.repeat(70));
  console.log(JSON.stringify(
    {
      server: 'string (service name)',
      link: 'string (download URL)',
      type: 'string (mp4, mkv, etc)',
      quality: 'string (360, 480, 720, 1080, 2160)',
    },
    null,
    2
  ));

  console.log('\nFormatted Test Streams:');
  console.log('─'.repeat(70));
  
  for (const stream of mockStreams) {
    const quality = await getQualityFromService(stream.server);
    const formatted = {
      server: stream.server,
      link: stream.link,
      type: stream.type,
      quality: quality,
    };
    
    console.log(`\n✅ ${stream.server}:`);
    console.log(JSON.stringify(formatted, null, 2));
  }
  
  console.log('\n' + '─'.repeat(70) + '\n');
}

// Main test runner
async function runAllTests() {
  console.log('\n' + '═'.repeat(70));
  console.log('🚀 Movies4U Stream Quality Test Suite');
  console.log('═'.repeat(70));

  try {
    // Test 1: Quality mapping function
    const qualityTestPassed = await testQualityMapping();
    
    // Test 2: Stream formatting
    await testStreamFormatting();
    
    // Test 3: Worker response (if we have test links)
    await testWorkerResponse();

    console.log('\n' + '═'.repeat(70));
    if (qualityTestPassed) {
      console.log('✨ All unit tests passed! Ready to push changes.');
    } else {
      console.log('⚠️  Some tests failed. Please review before pushing.');
    }
    console.log('═'.repeat(70) + '\n');
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
}

// Run the tests
runAllTests();
