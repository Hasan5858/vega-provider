const axios = require('axios');
const cheerio = require('cheerio');

console.log('🧪 Testing Movies4U Provider (Direct Fetching)\n');

const BASE_URL = 'https://movies4u.ps';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
};

async function testPosts() {
  try {
    console.log('🔍 Fetching Bollywood category page...');
    const url = BASE_URL + '/category/bollywood/';
    
    const response = await axios.get(url, {
      timeout: 30000,
      headers: HEADERS
    });

    const html = response.data;
    const $ = cheerio.load(html);

    console.log(`✅ Fetched ${html.length} bytes`);
    console.log(`✅ Contains <article>: ${html.includes('<article')}`);
    console.log(`✅ Contains entry-card: ${html.includes('entry-card')}`);

    // Parse posts
    const posts = [];
    $('article.entry-card').each((_, elem) => {
      const $article = $(elem);
      const title = $article.find('h2.entry-title a').text().trim();
      const link = $article.find('h2.entry-title a').attr('href');
      let image = $article.find('img.wp-post-image').attr('src');
      if (!image) {
        image = $article.find('img.wp-post-image').attr('data-src');
      }

      if (title && link) {
        const cleanTitle = title
          .replace(/\[.*?\]/g, '')
          .replace(/\(.*?\)/g, '')
          .trim();

        posts.push({
          title: cleanTitle,
          image: image || '',
          link: link,
        });
      }
    });

    console.log(`\n📺 Found ${posts.length} posts!\n`);
    
    if (posts.length > 0) {
      console.log('First 3 posts:');
      posts.slice(0, 3).forEach((post, i) => {
        console.log(`\n  ${i+1}. ${post.title}`);
        console.log(`     Link: ${post.link.substring(0, 60)}...`);
        console.log(`     Image: ${post.image ? '✅' : '❌'}`);
      });
      
      console.log('\n✨ SUCCESS! Provider can now fetch posts directly from the website!');
      return true;
    } else {
      console.log('❌ No posts found');
      return false;
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

testPosts();
