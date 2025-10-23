const cheerio = require('cheerio');
const fs = require('fs');

// Load the saved HTML
const html = fs.readFileSync('baaghi4_page.html', 'utf8');
const $ = cheerio.load(html);

console.log('🔍 Testing stream extraction logic...\n');

// Test the selector
const elements = $("a[href]:contains('Download'), .button2,.button1,.button3,.button4,.button").toArray();

console.log(`Found ${elements.length} elements\n`);

const streams = [];
elements.forEach((element, i) => {
  const title = $(element).text().trim();
  const link = $(element).attr("href");
  
  if (!title || !link) return;
  
  // Skip unwanted
  if (
    title.includes("Watch") ||
    title.includes("Login") ||
    title.includes("Signup") ||
    title.includes("Privacy") ||
    title.includes("DMCA") ||
    title.includes("Contact") ||
    title.includes("Linkmake")
  ) {
    console.log(`❌ Skipped: "${title}"`);
    return;
  }
  
  const alreadyAdded = streams.find((s) => s.link === link);
  if (alreadyAdded) return;
  
  streams.push({
    server: title,
    link: link,
    type: "mkv",
  });
  
  console.log(`✅ Added: "${title}" -> ${link}`);
});

console.log(`\n📊 Total streams extracted: ${streams.length}`);
streams.forEach((s, i) => {
  console.log(`  [${i+1}] ${s.server}`);
});
