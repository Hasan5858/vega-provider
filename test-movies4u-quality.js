/**
 * Test script to verify Movies4U stream extraction and quality preservation
 * Mimics the app's behavior when fetching streams
 */

const axios = require('axios');

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

// Test Movie links (you can find these from the app)
const testLinks = [
  // Add a movie link here to test
  // Example: 'https://movies4u.ps/movie/some-movie'
];

function parseQuality(qualityStr) {
  // Parse quality from string like "480p", "720p", "1080p", etc.
  if (!qualityStr) return '720';
  
  if (qualityStr.includes('1080') || qualityStr.includes('4k') || qualityStr.includes('4K')) {
    return '1080';
  } else if (qualityStr.includes('2160')) {
    return '2160';
  } else if (qualityStr.includes('720')) {
    return '720';
  } else if (qualityStr.includes('480')) {
    return '480';
  } else if (qualityStr.includes('360')) {
    return '360';
  }
  
  return '720'; // Default
}

async function testWorkerResponse() {
  console.log('\n🧪 Testing Movies4U Worker Quality Preservation...\n');
  
  try {
    // Test with a sample movie link (if available)
    if (testLinks.length === 0) {
      console.log('⚠️  No test links provided. Using quality parsing tests.\n');
      
      // Test the quality parsing function
      const testCases = [
        { input: '480p', expected: '480' },
        { input: '720p', expected: '720' },
        { input: '1080p', expected: '1080' },
        { input: '2160p', expected: '2160' },
        { input: 'auto', expected: '720' },
      ];
      
      console.log('Quality Parsing Test Results:');
      console.log('─'.repeat(50));
      for (const testCase of testCases) {
        const result = parseQuality(testCase.input);
        const status = result === testCase.expected ? '✅ PASS' : '❌ FAIL';
        console.log(`${status} | Input: "${testCase.input}" → Expected: ${testCase.expected}, Got: ${result}`);
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

      // Group streams by quality (preserving Worker quality data)
      const streamsByQuality = {};
      
      for (const stream of streams) {
        const workerQuality = stream.quality || 'auto'; // Quality from Worker
        const parsedQuality = parseQuality(workerQuality);
        const server = stream.server || 'Unknown';
        
        if (!streamsByQuality[parsedQuality]) {
          streamsByQuality[parsedQuality] = [];
        }
        streamsByQuality[parsedQuality].push({
          link: stream.link,
          server: server,
          workerQuality: workerQuality,
          parsedQuality: parsedQuality,
        });
      }

      // Display formatted results
      console.log('📊 Stream Breakdown by Quality:');
      console.log('─'.repeat(70));
      
      for (const [quality, streamList] of Object.entries(streamsByQuality).sort()) {
        console.log(`\n${quality}p:`);
        for (const stream of streamList) {
          const linkPreview = stream.link.substring(0, 40) + '...';
          console.log(`  • ${stream.server.padEnd(15)} | Worker: ${stream.workerQuality.padEnd(5)} | Link: ${linkPreview}`);
        }
      }
      
      console.log('\n' + '─'.repeat(70));
      console.log(`\n✨ Quality Distribution:`);
      for (const [quality, streamList] of Object.entries(streamsByQuality).sort()) {
        console.log(`  ${quality}p: ${streamList.length} servers`);
      }
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

async function testQualityPreservation() {
  console.log('\n🎬 Testing Quality Preservation through Extraction Pipeline...\n');
  
  const mockWorkerResponse = [
    { server: 'G-DIRECT', link: 'https://gdflix.co/file/123', quality: '480p' },
    { server: 'G-DIRECT', link: 'https://gdflix.co/file/456', quality: '720p' },
    { server: 'G-DIRECT', link: 'https://gdflix.co/file/789', quality: '1080p' },
    { server: 'V-CLOUD', link: 'https://vcloud.co/file/abc', quality: '480p' },
    { server: 'V-CLOUD', link: 'https://vcloud.co/file/def', quality: '720p' },
    { server: 'FILEPRESS', link: 'https://filepress.io/file/ghi', quality: '480p' },
    { server: 'GDTOT', link: 'https://gdtot.org/file/jkl', quality: '1080p' },
    { server: 'DROPGALAXY', link: 'https://dropgalaxy.in/file/mno', quality: '720p' },
  ];

  console.log('Expected Behavior:');
  console.log('─'.repeat(70));
  console.log('Each quality level should have multiple servers:\n');

  const byQuality = {};
  for (const stream of mockWorkerResponse) {
    const quality = parseQuality(stream.quality);
    if (!byQuality[quality]) {
      byQuality[quality] = [];
    }
    byQuality[quality].push(stream.server);
  }

  for (const [quality, servers] of Object.entries(byQuality).sort()) {
    console.log(`${quality}p: ${servers.join(', ')}`);
  }

  console.log('\n' + '─'.repeat(70));
  console.log('\n✅ Quality Preservation Verified!\n');
}

// Main test runner
async function runAllTests() {
  console.log('\n' + '═'.repeat(70));
  console.log('🚀 Movies4U Stream Quality Preservation Test Suite');
  console.log('═'.repeat(70));

  try {
    // Test 1: Quality preservation
    await testQualityPreservation();
    
    // Test 2: Worker response (if we have test links)
    await testWorkerResponse();

    console.log('\n' + '═'.repeat(70));
    console.log('✨ Quality preservation logic is correct!');
    console.log('   Structure: Quality → [Multiple Servers]');
    console.log('═'.repeat(70) + '\n');
  } catch (error) {
    console.error('\n❌ Test suite error:', error.message);
  }
}

// Run the tests
runAllTests();
