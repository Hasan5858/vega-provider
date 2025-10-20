const axios = require('axios');
const cheerio = require('cheerio');

// Mock provider context exactly like the app
const providerContext = {
  axios,
  cheerio,
  getBaseUrl: async (provider) => {
    return 'https://katmoviefix.cards';
  }
};

// Load the compiled provider modules
const katfixProvider = {
  getPosts: require('./dist/katfix/posts').getPosts
};

async function debugKatFixFocused() {
  console.log('🔍 Focused KatFix Debug - Finding the Real Issue\n');
  console.log('=' .repeat(60));

  try {
    // Test with Netflix category - exactly like the app
    console.log('\n📡 Testing Netflix category (like app)...');
    console.log('Filter: /category/netflix/, Page: 1');
    
    const netflixPosts = await katfixProvider.getPosts({
      filter: '/category/netflix/',
      page: 1,
      providerContext
    });
    
    console.log(`\n📊 Result: ${netflixPosts.length} posts returned`);
    
    if (netflixPosts.length === 0) {
      console.log('\n🔍 Debugging why 0 posts returned...');
      
      // Let's manually test the URL the provider should be hitting
      const testUrl = 'https://katmoviefix.cards/category/netflix/';
      console.log(`\n🌐 Testing URL directly: ${testUrl}`);
      
      const response = await axios.get(testUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      
      console.log(`✅ URL loaded: ${response.status} (${response.data.length} chars)`);
      
      const $ = cheerio.load(response.data);
      
      // Test different selectors that might be used
      const selectors = [
        '.pstr_box',
        'article',
        '.result-item', 
        '.post',
        '.item',
        '.thumbnail',
        '.latest-movies',
        '.movie-item',
        '.movie-box',
        '.box',
        '.card',
        '.content-item'
      ];
      
      console.log('\n🔍 Testing post selectors:');
      selectors.forEach(selector => {
        const elements = $(selector);
        console.log(`   ${selector}: ${elements.length} elements`);
        
        if (elements.length > 0) {
          console.log(`   ✅ Found posts with: ${selector}`);
          elements.slice(0, 3).each((idx, el) => {
            const title = $(el).find('h2, h3, h4, a, .title').first().text().trim();
            const link = $(el).find('a').first().attr('href');
            console.log(`      ${idx + 1}. ${title.substring(0, 50)}... -> ${link}`);
          });
        }
      });
      
      // Check if there are any posts at all on the page
      const allLinks = $('a[href*="/"]');
      console.log(`\n📋 Total links on page: ${allLinks.length}`);
      
      const movieLinks = allLinks.filter((i, el) => {
        const href = $(el).attr('href');
        return href && href.includes('/') && !href.includes('category') && !href.includes('http');
      });
      
      console.log(`🎬 Potential movie links: ${movieLinks.length}`);
      
      if (movieLinks.length > 0) {
        console.log('\n📄 Sample movie links:');
        movieLinks.slice(0, 5).each((idx, el) => {
          const href = $(el).attr('href');
          const text = $(el).text().trim();
          console.log(`   ${idx + 1}. ${text.substring(0, 40)}... -> ${href}`);
        });
      }
      
    } else {
      console.log('\n✅ Posts found! Sample:');
      netflixPosts.slice(0, 3).forEach((post, idx) => {
        console.log(`   ${idx + 1}. ${post.title}`);
        console.log(`      Link: ${post.link}`);
      });
    }

  } catch (error) {
    console.error('❌ Debug failed:', error.message);
    console.error('Stack:', error.stack);
  }

  console.log('\n' + '=' .repeat(60));
  console.log('🎉 Focused Debug Complete!');
}

// Run the debug
debugKatFixFocused();
