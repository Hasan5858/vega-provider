const axios = require("axios");

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

async function testLuluvdoo(url) {
  console.log(`\nTesting: ${url}`);
  console.log("─".repeat(60));
  
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": "https://luluvdoo.com/",
      },
      timeout: 15000,
    });

    console.log(`✓ Page fetched (${response.data.length} chars)`);
    
    const html = response.data;
    
    // Try different patterns
    const patterns = [
      { name: "Current pattern", regex: /sources:\s*\[\s*\{\s*file:\s*["']([^"']+)["']/i },
      { name: "Simple sources", regex: /sources:\s*\[\{file:"([^"]+)"/i },
      { name: "file: pattern", regex: /file:\s*["']([^"']+\.m3u8[^"']*)["']/i },
      { name: "m3u8 direct", regex: /(https:\/\/[^\s"']+\.m3u8[^\s"']*)/i },
    ];
    
    for (const { name, regex } of patterns) {
      const match = html.match(regex);
      if (match) {
        console.log(`✓ Match found with "${name}"`);
        console.log(`  URL: ${match[1].substring(0, 100)}...`);
      } else {
        console.log(`✗ No match with "${name}"`);
      }
    }
    
    // Check for sources keyword
    if (html.includes("sources:")) {
      console.log("\n✓ 'sources:' found in HTML");
      const sourcesIdx = html.indexOf("sources:");
      console.log(`  Context: ${html.substring(sourcesIdx, sourcesIdx + 150)}`);
    } else {
      console.log("\n✗ 'sources:' NOT found in HTML");
    }
    
    // Check for m3u8
    if (html.includes(".m3u8")) {
      console.log("✓ '.m3u8' found in HTML");
      const m3u8Matches = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi);
      if (m3u8Matches) {
        console.log(`  Found ${m3u8Matches.length} m3u8 URLs:`);
        m3u8Matches.forEach((url, i) => {
          console.log(`  ${i + 1}. ${url.substring(0, 80)}...`);
        });
      }
    } else {
      console.log("✗ '.m3u8' NOT found in HTML");
    }
    
  } catch (error) {
    console.log(`✗ Error: ${error.message}`);
  }
}

// Test with the failing URL from logs
testLuluvdoo("https://luluvdoo.com/e/y32qr13jchxo").then(() => {
  console.log("\n" + "─".repeat(60));
  console.log("Test completed");
  process.exit(0);
});
