const axios = require('axios');
const cheerio = require('cheerio');

async function debugThumbnailIssue() {
  console.log('🔍 Debugging Thumbnail URL Issue');
  console.log('=' .repeat(60));
  
  try {
    const baseUrl = 'https://ogomovies.dad/';
    const hindiDubbedUrl = `${baseUrl}genre/hindi-dubbed/`;
    
    console.log(`🌐 Fetching: ${hindiDubbedUrl}`);
    
    const headers = {
      Referer: "https://www.google.com",
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    };
    
    const response = await axios.get(hindiDubbedUrl, { headers });
    const html = response.data;
    const $ = cheerio.load(html);
    
    console.log(`✅ Page loaded! Size: ${html.length} characters`);
    
    // Check the first few .ml-item elements
    console.log('\n📋 Analyzing first 5 .ml-item elements:');
    const elements = $('.ml-item').slice(0, 5);
    for (let index = 0; index < elements.length; index++) {
      const el = elements[index];
      const anchor = $(el).find('a.ml-mask');
      const title = anchor.attr('title')?.trim() || anchor.find('h2').text().trim() || '';
      const link = anchor.attr('href') || '';
      
      // Check all possible image sources
      const imgElement = anchor.find('img');
      const dataOriginal = imgElement.attr('data-original');
      const dataSrc = imgElement.attr('data-src');
      const dataLazy = imgElement.attr('data-lazy');
      const src = imgElement.attr('src');
      
      // Also check parent element for images
      const parentImg = $(el).find('img');
      const parentDataOriginal = parentImg.attr('data-original');
      const parentSrc = parentImg.attr('src');
      
      console.log(`\n   ${index + 1}. ${title}`);
      console.log(`      Link: ${link}`);
      console.log(`      Image sources:`);
      console.log(`         data-original: ${dataOriginal || 'None'}`);
      console.log(`         data-src: ${dataSrc || 'None'}`);
      console.log(`         data-lazy: ${dataLazy || 'None'}`);
      console.log(`         src: ${src || 'None'}`);
      console.log(`         parent data-original: ${parentDataOriginal || 'None'}`);
      console.log(`         parent src: ${parentSrc || 'None'}`);
      
      // Check if any of these URLs are accessible
      const testUrls = [dataOriginal, dataSrc, dataLazy, src, parentDataOriginal, parentSrc].filter(Boolean);
      if (testUrls.length > 0) {
        console.log(`      Testing URL accessibility:`);
        for (const url of testUrls.slice(0, 2)) { // Test first 2 URLs
          try {
            const imgResponse = await axios.head(url, { timeout: 5000 });
            console.log(`         ✅ ${url}: Status ${imgResponse.status}`);
          } catch (error) {
            console.log(`         ❌ ${url}: ${error.message}`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   URL: ${error.response.config.url}`);
    }
  }
}

debugThumbnailIssue();
