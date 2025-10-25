const cheerio = require('cheerio');

// Mock provider context exactly as the app would provide it
const providerContext = {
  cheerio: cheerio,
  getBaseUrl: async (provider) => {
    return "https://www.moviezwap.haus/";
  }
};

// Import the built version that the app uses
const { getPosts } = require('./dist/moviezwap/posts.js');

async function debugAppCall() {
  try {
    console.log('Testing MoviezWap getPosts exactly as the app calls it...');
    
    // Test with the exact same parameters the app uses
    const posts = await getPosts({
      filter: "/category/Telugu-(2025)-Movies.html",
      page: 1,
      providerValue: "moviezwap",
      signal: new AbortController().signal,
      providerContext: providerContext
    });
    
    console.log(`Found ${posts.length} posts`);
    
    if (posts.length > 0) {
      posts.forEach((post, index) => {
        console.log(`${index + 1}. ${post.title}`);
        console.log(`   Link: ${post.link}`);
        console.log(`   Image: ${post.image}`);
        console.log('');
      });
    } else {
      console.log('No posts found - investigating...');
      
      // Let's debug step by step
      console.log('\n--- Debugging step by step ---');
      
      // Test the internal posts function directly
      const { posts: internalPosts } = require('./dist/moviezwap/posts.js');
      
      const testUrl = "https://www.moviezwap.haus/category/Telugu-(2025)-Movies.html";
      console.log(`Testing internal posts function with URL: ${testUrl}`);
      
      const internalResult = await internalPosts({
        url: testUrl,
        signal: new AbortController().signal,
        cheerio: providerContext.cheerio
      });
      
      console.log(`Internal posts function returned: ${internalResult.length} posts`);
      
      if (internalResult.length > 0) {
        console.log('First few posts:');
        internalResult.slice(0, 3).forEach((post, index) => {
          console.log(`${index + 1}. ${post.title}`);
        });
      }
    }
    
  } catch (error) {
    console.error('Error debugging app call:', error);
  }
}

debugAppCall();
