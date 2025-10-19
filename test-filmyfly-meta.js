const axios = require('axios');
const cheerio = require('cheerio');

// Test the FilmyFly meta function
async function testFilmyFlyMeta() {
  try {
    console.log('🧪 Testing FilmyFly meta extraction...');
    
    // Test URL (you can change this to any FilmyFly movie URL)
    const testUrl = 'https://filmyfly.deals/page-download/5833/War-2-2025-Bollywood-Hindi-Movie-HD-ESub.html';
    
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
    };

    console.log('📡 Fetching page:', testUrl);
    const res = await axios.get(testUrl, { 
      headers,
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });
    
    const data = res.data;
    const $ = cheerio.load(data);
    
    console.log('✅ Page loaded successfully');
    
    // Extract basic info
    const title = $('.fname').filter((i, el) => $(el).text().includes('Name:')).find(".colora").text().trim();
    const image = $(".ss").find("img").attr("src") || "";
    const synopsis = $('.fname').filter((i, el) => $(el).text().includes('Description:')).find(".colorg").text().trim();
    const tags = $('.fname').filter((i, el) => $(el).text().includes('Genre:')).find(".colorb").text().split(",") || [];
    const type = testUrl.includes("tvshows") ? "series" : "movie";
    
    console.log('📝 Basic Info:');
    console.log('  Title:', title);
    console.log('  Image:', image);
    console.log('  Synopsis:', synopsis.substring(0, 100) + '...');
    console.log('  Tags:', tags);
    console.log('  Type:', type);
    
    // Extract download links
    console.log('\n🔗 Download Links:');
    const directLinks = [];
    
    // Look for download buttons
    $(".dlbtn").each((i, element) => {
      const $btn = $(element);
      const downloadLink = $btn.find("a").attr("href");
      const buttonText = $btn.text().trim();
      
      console.log(`  Button ${i + 1}:`, {
        text: buttonText,
        link: downloadLink
      });
      
      if (downloadLink) {
        let quality = "HD";
        if (buttonText.includes("480p")) quality = "480p";
        else if (buttonText.includes("720p")) quality = "720p";
        else if (buttonText.includes("1080p")) quality = "1080p";
        else if (buttonText.includes("2160p") || buttonText.includes("4K")) quality = "2160p";
        
        const sizeMatch = buttonText.match(/(\d+(?:\.\d+)?[GMK]b)/i);
        const size = sizeMatch ? sizeMatch[1] : "";
        
        const linkTitle = size ? `${quality} (${size})` : quality;
        
        directLinks.push({
          title: linkTitle,
          link: downloadLink,
          type: type,
        });
      }
    });
    
    // If no download buttons found, try alternative selectors
    if (directLinks.length === 0) {
      console.log('  No .dlbtn found, trying alternative selectors...');
      $("a[href*='download'], a[href*='file']").each((i, element) => {
        const $link = $(element);
        const href = $link.attr("href");
        const linkText = $link.text().trim();
        
        console.log(`  Link ${i + 1}:`, {
          text: linkText,
          href: href
        });
      });
    }
    
    console.log('\n📊 Final directLinks array:');
    console.log(JSON.stringify(directLinks, null, 2));
    
    // Create final result
    const result = {
      title,
      tags,
      rating: "",
      synopsis,
      image,
      imdbId: "",
      type,
      linkList: directLinks.length > 0 ? [{
        title: title,
        directLinks: directLinks,
      }] : []
    };
    
    console.log('\n🎯 Final Result:');
    console.log(JSON.stringify(result, null, 2));
    
    return result;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return null;
  }
}

// Run the test
testFilmyFlyMeta().then(result => {
  if (result) {
    console.log('\n✅ Test completed successfully!');
    console.log('Number of directLinks found:', result.linkList[0]?.directLinks?.length || 0);
  } else {
    console.log('\n❌ Test failed!');
  }
});
