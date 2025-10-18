const axios = require("axios");
const cheerio = require("cheerio");
const { getBaseUrl } = require("./dist/getBaseUrl.js");

// Mock providerContext
const providerContext = {
  axios,
  cheerio,
  getBaseUrl,
  commonHeaders: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  },
};

async function debugA111477Mobile() {
  try {
    console.log("🧪 Testing A111477 Provider - Mobile App Thumbnail Issues");
    console.log("=".repeat(70));

    const { getPosts } = require("./dist/a111477/posts.js");

    // Test the exact same call that the mobile app would make
    console.log("\n📋 Testing getPosts for mobile app...");
    try {
      const posts = await getPosts({
        filter: "",
        page: 1,
        providerValue: "a111477",
        signal: new AbortController().signal,
        providerContext,
      });
      
      console.log(`✅ Found ${posts.length} posts`);
      
      if (posts.length > 0) {
        console.log("\n📋 Analyzing thumbnail URLs for mobile compatibility:");
        
        for (let i = 0; i < Math.min(3, posts.length); i++) {
          const post = posts[i];
          console.log(`\n${i + 1}. Title: ${post.title}`);
          console.log(`   Link: ${post.link}`);
          console.log(`   Image URL: ${post.image}`);
          
          // Test the image URL with different methods
          await testImageForMobile(post.image, post.title);
        }
      }
    } catch (error) {
      console.log(`❌ Error getting posts: ${error.message}`);
    }

    // Test specific image URLs that might be problematic
    console.log("\n📋 Testing specific image URL patterns...");
    const testUrls = [
      "https://placehold.jp/23/000000/ffffff/200x400.png?text=test&css=%7B%22background%22%3A%22%20-webkit-gradient(linear%2C%20left%20bottom%2C%20left%20top%2C%20from(%233f3b3b)%2C%20to(%23000000))%22%2C%22text-transform%22%3A%22%20capitalize%22%7D",
      "https://placehold.jp/23/000000/ffffff/200x400.png?text=movies",
      "https://via.placeholder.com/200x400/000000/ffffff?text=movies"
    ];
    
    for (const url of testUrls) {
      await testImageForMobile(url, "Test Image");
    }

  } catch (error) {
    console.error("❌ Error in mobile debug:", error.message);
    console.error("Stack:", error.stack);
  }
}

async function testImageForMobile(url, title) {
  try {
    console.log(`\n🔍 Testing image: ${title}`);
    console.log(`   URL: ${url}`);
    
    // Test 1: Basic accessibility
    const response = await fetch(url, { 
      method: 'HEAD',
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
      }
    });
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Content-Type: ${response.headers.get('content-type')}`);
    console.log(`   Content-Length: ${response.headers.get('content-length')}`);
    
    if (response.ok) {
      console.log(`   ✅ Image is accessible`);
      
      // Test 2: Check if it's actually an image
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.startsWith('image/')) {
        console.log(`   ✅ Valid image content type`);
      } else {
        console.log(`   ❌ Not a valid image content type: ${contentType}`);
      }
      
      // Test 3: Check for CORS headers
      const corsOrigin = response.headers.get('access-control-allow-origin');
      const corsMethods = response.headers.get('access-control-allow-methods');
      console.log(`   CORS Origin: ${corsOrigin || 'None'}`);
      console.log(`   CORS Methods: ${corsMethods || 'None'}`);
      
    } else {
      console.log(`   ❌ Image not accessible: ${response.status}`);
    }
    
    // Test 4: Try to get the actual image data
    try {
      const imageResponse = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1'
        }
      });
      
      if (imageResponse.ok) {
        const imageData = await imageResponse.arrayBuffer();
        console.log(`   Image size: ${imageData.byteLength} bytes`);
        
        if (imageData.byteLength > 0) {
          console.log(`   ✅ Image data received successfully`);
        } else {
          console.log(`   ❌ Empty image data`);
        }
      }
    } catch (imageError) {
      console.log(`   ❌ Error fetching image data: ${imageError.message}`);
    }
    
  } catch (error) {
    console.log(`   ❌ Error testing image: ${error.message}`);
  }
}

debugA111477Mobile();
