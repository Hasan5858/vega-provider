const axios = require('axios');
const cheerio = require('cheerio');

// Mock provider context
const providerContext = {
  axios,
  cheerio,
  getBaseUrl: async (provider) => {
    if (provider === 'movies4u') return 'https://movies4u.lt';
    return 'https://movies4u.lt';
  },
  commonHeaders: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-User': '?1',
    'Upgrade-Insecure-Requests': '1',
  }
};

const { getPosts } = require('./dist/movies4u/posts.js');

async function testBuiltPosts() {
  console.log('🧪 Testing Built Posts Function...');
  
  try {
    // Test with empty filter (homepage)
    console.log('Testing homepage (empty filter)...');
    const posts = await getPosts({
      filter: '',
      page: 1,
      providerContext
    });
    
    console.log(`📄 Found ${posts.length} posts`);
    if (posts.length > 0) {
      console.log('📝 Sample posts:');
      posts.slice(0, 3).forEach((post, i) => {
        console.log(`${i + 1}. ${post.title}`);
        console.log(`   Link: ${post.link}`);
        console.log(`   Image: ${post.image ? 'Yes' : 'No'}`);
        console.log('');
      });
    }
    
    // Test with Bollywood filter
    console.log('\nTesting Bollywood filter...');
    const bollywoodPosts = await getPosts({
      filter: '/category/bollywood/',
      page: 1,
      providerContext
    });
    
    console.log(`📄 Found ${bollywoodPosts.length} Bollywood posts`);
    
    return posts.length > 0;
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
    return false;
  }
}

testBuiltPosts();
