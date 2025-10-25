const cheerio = require('cheerio');

// Mock provider context
const providerContext = {
  cheerio: cheerio,
  getBaseUrl: async (provider) => {
    return "https://www.moviezwap.haus/";
  }
};

// Import the posts function
const { getPosts } = require('./dist/moviezwap/posts.js');

async function testCategoryPosts() {
  try {
    console.log('Testing MoviezWap category posts extraction...');
    
    // Test with a category URL
    const categoryUrl = "https://www.moviezwap.haus/category/Telugu-(2025)-Movies.html";
    const posts = await getPosts({
      filter: "/category/Telugu-(2025)-Movies.html",
      page: 1,
      providerValue: "moviezwap",
      signal: new AbortController().signal,
      providerContext: providerContext
    });
    
    console.log(`Found ${posts.length} posts`);
    posts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   Link: ${post.link}`);
      console.log(`   Image: ${post.image}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error testing MoviezWap category posts:', error);
  }
}

testCategoryPosts();
