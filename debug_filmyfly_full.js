const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Complete FilmyFly Provider Debug Script
 * This script traces the entire flow from post -> meta -> episodes -> stream
 */

const providerContext = {
  axios,
  cheerio,
  commonHeaders: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },
  getBaseUrl: async () => 'https://filmyfly.observer',
  extractors: {
    hubcloudExtracter: require('./dist/hubcloudExtractor.js').hubcloudExtracter,
    gofileExtracter: require('./dist/gofileExtracter.js').gofileExtracter,
    gdFlixExtracter: require('./dist/gdflixExtractor.js').gdFlixExtracter
  }
};

async function debugFullFlow() {
  console.log('='.repeat(80));
  console.log('FILMYFLY PROVIDER FULL DEBUG');
  console.log('='.repeat(80));
  
  // Step 1: Get Posts (find a movie)
  console.log('\n📋 STEP 1: Getting Posts from Homepage');
  console.log('-'.repeat(80));
  
  try {
    const homeUrl = 'https://filmyfly.observer';
    const postsRes = await axios.get(homeUrl, { headers: providerContext.commonHeaders });
    const $ = cheerio.load(postsRes.data);
    
    const posts = [];
    $('.A10').each((i, element) => {
      if (i >= 3) return; // Only get first 3
      const $el = $(element);
      const linkEl = $el.find('a').first();
      const titleEl = $el.find("div[style*='font-weight:bold']").first();
      
      const title = titleEl.text().trim();
      const link = linkEl.attr('href');
      const image = $el.find('img').attr('src');
      
      if (title && link && image) {
        posts.push({
          title,
          link: 'https://filmyfly.observer' + link,
          image
        });
      }
    });
    
    console.log(`Found ${posts.length} posts`);
    posts.forEach((post, i) => {
      console.log(`\n  Post ${i + 1}:`);
      console.log(`    Title: ${post.title}`);
      console.log(`    Link: ${post.link}`);
    });
    
    if (posts.length === 0) {
      console.log('❌ No posts found! Check the website structure.');
      return;
    }
    
    // Step 2: Get Meta (movie details)
    const testMovie = posts[0];
    console.log('\n\n🎬 STEP 2: Getting Meta for:', testMovie.title);
    console.log('-'.repeat(80));
    
    const metaRes = await axios.get(testMovie.link, { headers: providerContext.commonHeaders });
    const $meta = cheerio.load(metaRes.data);
    
    const type = testMovie.link.includes('tvshows') || testMovie.link.includes('series') ? 'series' : 'movie';
    const title = $meta('h2').first().text().trim();
    const downloadLink = $meta('.dlbtn a').attr('href');
    const downloadText = $meta('.dlbtn a').text().trim();
    
    console.log(`  Title: ${title}`);
    console.log(`  Type: ${type}`);
    console.log(`  Download Link: ${downloadLink}`);
    console.log(`  Download Text: ${downloadText}`);
    
    if (!downloadLink) {
      console.log('❌ No download link found! Check the meta extraction.');
      return;
    }
    
    // Step 3: Get Episodes/Links (extract download links)
    console.log('\n\n🔗 STEP 3: Getting Episodes/Links');
    console.log('-'.repeat(80));
    
    const episodesUrl = downloadLink;
    console.log(`  Episodes URL: ${episodesUrl}`);
    
    const episodesRes = await axios.get(episodesUrl, { headers: providerContext.commonHeaders });
    const $episodes = cheerio.load(episodesRes.data);
    
    const episodes = [];
    
    // Check if it's a linkmake.in URL
    if (episodesUrl.includes('linkmake.in')) {
      console.log('  ✓ Detected linkmake.in URL');
      
      // Look for download quality links
      $episodes('a').each((i, element) => {
        const qualityText = $episodes(element).text().trim();
        const qualityLink = $episodes(element).attr('href');
        
        if (qualityText && qualityText.includes('Download') && qualityLink && qualityLink.includes('filesdl')) {
          episodes.push({
            title: qualityText,
            link: qualityLink.startsWith('http') ? qualityLink : `https://linkmake.in${qualityLink}`
          });
        }
      });
    }
    
    console.log(`\n  Found ${episodes.length} quality options:`);
    episodes.slice(0, 5).forEach((ep, i) => {
      console.log(`\n    Quality ${i + 1}:`);
      console.log(`      Title: ${ep.title}`);
      console.log(`      Link: ${ep.link.substring(0, 80)}...`);
    });
    
    if (episodes.length === 0) {
      console.log('  ❌ No episodes/quality links found!');
      return;
    }
    
    // Step 4: Get Streams (extract server links)
    const testEpisode = episodes[0];
    console.log('\n\n🎥 STEP 4: Getting Streams for:', testEpisode.title);
    console.log('-'.repeat(80));
    
    const streamUrl = testEpisode.link;
    console.log(`  Stream URL: ${streamUrl.substring(0, 80)}...`);
    
    const streamRes = await axios.get(streamUrl, { headers: providerContext.commonHeaders });
    const $stream = cheerio.load(streamRes.data);
    
    const servers = [];
    
    // Look for server buttons
    $stream('a[href], button[onclick]').each((i, element) => {
      const serverText = $stream(element).text().trim();
      const serverLink = $stream(element).attr('href') || $stream(element).attr('onclick');
      
      if (serverText && serverLink && !serverLink.includes('javascript:void')) {
        servers.push({
          server: serverText,
          link: serverLink.startsWith('http') ? serverLink : streamUrl.split('/').slice(0, 3).join('/') + serverLink
        });
      }
    });
    
    console.log(`\n  Found ${servers.length} servers:`);
    servers.slice(0, 10).forEach((server, i) => {
      console.log(`\n    Server ${i + 1}:`);
      console.log(`      Name: ${server.server}`);
      console.log(`      Link: ${server.link.substring(0, 80)}...`);
      
      // Identify server type
      if (server.link.includes('awsstorage')) {
        console.log(`      Type: AWS Direct`);
      } else if (server.link.includes('bbdownload') || server.link.includes('filesdl')) {
        console.log(`      Type: BBDownload/FilesDL (needs extraction)`);
      } else if (server.link.includes('gofile')) {
        console.log(`      Type: GoFile (needs extractor)`);
      } else if (server.link.includes('gdflix')) {
        console.log(`      Type: GDFlix (needs extractor)`);
      } else if (server.link.includes('hubcloud')) {
        console.log(`      Type: HubCloud (needs extractor)`);
      } else {
        console.log(`      Type: Unknown`);
      }
    });
    
    // Step 5: Test a few server URLs
    console.log('\n\n🧪 STEP 5: Testing Server URLs');
    console.log('-'.repeat(80));
    
    for (let i = 0; i < Math.min(3, servers.length); i++) {
      const server = servers[i];
      console.log(`\n  Testing: ${server.server}`);
      console.log(`  URL: ${server.link.substring(0, 80)}...`);
      
      try {
        const testRes = await axios.get(server.link, {
          timeout: 5000,
          maxRedirects: 0,
          validateStatus: (status) => status >= 200 && status < 500,
          headers: providerContext.commonHeaders
        });
        
        console.log(`    Status: ${testRes.status}`);
        console.log(`    Content-Type: ${testRes.headers['content-type']}`);
        
        if (testRes.status === 302 || testRes.status === 301) {
          console.log(`    Redirect Location: ${testRes.headers['location']}`);
        }
        
        const preview = typeof testRes.data === 'string' ? testRes.data.substring(0, 200) : 'Binary data';
        console.log(`    Preview: ${preview}`);
        
        if (typeof testRes.data === 'string' && testRes.data.includes('Token expired')) {
          console.log(`    ⚠️  Token expired!`);
        } else if (typeof testRes.data === 'string' && testRes.data.includes('<html')) {
          console.log(`    ⚠️  HTML page returned`);
        } else if (testRes.headers['content-type']?.includes('video') || 
                   testRes.headers['content-type']?.includes('octet-stream')) {
          console.log(`    ✅ Valid video data!`);
        }
      } catch (error) {
        console.log(`    ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(80));
    console.log('DEBUG COMPLETE');
    console.log('='.repeat(80));
    
  } catch (error) {
    console.error('\n❌ Error in debug flow:', error.message);
    console.error(error.stack);
  }
}

debugFullFlow();
