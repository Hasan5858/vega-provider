const axios = require('axios');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function testAppJS() {
  try {
    const appJsUrl = "https://savefiles.com/js2/app.js?v=16";
    console.log("Fetching:", appJsUrl);

    const response = await axios.get(appJsUrl, {
      headers: {
        "User-Agent": USER_AGENT,
      },
      timeout: 10000,
    });

    const content = response.data;
    console.log("✓ Fetched " + content.length + " bytes\n");

    // Save to file for inspection
    const fs = require('fs');
    fs.writeFileSync('savefiles-app.js', content);
    console.log("✓ Saved to savefiles-app.js");

    // Look for interesting patterns
    console.log("\n🔍 Searching for patterns...\n");

    if (content.includes('download')) {
      const lines = content.split('\n').filter(l => l.includes('download'));
      console.log(`Found ${lines.length} lines with 'download'`);
      lines.slice(0, 5).forEach(l => {
        console.log(" ", l.substring(0, 150));
      });
    }

    if (content.includes('api')) {
      console.log("\n✓ Contains 'api' references");
    }

    if (content.includes('file')) {
      const lines = content.split('\n').filter(l => l.includes('file'));
      console.log(`\nFound ${lines.length} lines with 'file'`);
      lines.slice(0, 5).forEach(l => {
        console.log(" ", l.substring(0, 150));
      });
    }

    // Look for CDN patterns
    const cdnPattern = /https?:\/\/[^"'\s]+(?:cdn|dl|download|store)[^"'\s]*/gi;
    const cdnMatches = content.match(cdnPattern);
    if (cdnMatches) {
      console.log(`\nFound ${cdnMatches.length} CDN-like URLs`);
      cdnMatches.slice(0, 5).forEach(url => {
        console.log(" ", url);
      });
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testAppJS();
