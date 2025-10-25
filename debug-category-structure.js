const cheerio = require('cheerio');

async function debugCategoryStructure() {
  try {
    console.log('Fetching category page...');
    const response = await fetch("https://www.moviezwap.haus/category/Telugu-(2025)-Movies.html");
    const html = await response.text();
    
    console.log('Parsing HTML with cheerio...');
    const $ = cheerio.load(html);
    
    console.log('Looking for movie links...');
    
    // Check different selectors
    console.log('\n1. Links containing /movie/:');
    $('a[href*="/movie/"]').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      console.log(`   ${i + 1}. "${text}" -> ${href}`);
    });
    
    console.log('\n2. All links:');
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();
      if (href && text && i < 10) { // Limit to first 10
        console.log(`   ${i + 1}. "${text}" -> ${href}`);
      }
    });
    
    console.log('\n3. Divs with class mylist:');
    $('.mylist').each((i, el) => {
      const text = $(el).text().trim();
      const links = $(el).find('a');
      console.log(`   ${i + 1}. Text: "${text}"`);
      links.each((j, link) => {
        const href = $(link).attr('href');
        const linkText = $(link).text().trim();
        console.log(`      Link ${j + 1}: "${linkText}" -> ${href}`);
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

debugCategoryStructure();
