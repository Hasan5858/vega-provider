const axios = require('axios');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function testSaveFilesDeep() {
  try {
    const embedUrl = "https://savefiles.com/e/k8zyey44415m";
    const idMatch = embedUrl.match(/\/(?:e|d)\/([A-Za-z0-9_-]+)/i);
    const videoId = idMatch[1];
    const downloadUrl = `https://savefiles.com/d/${videoId}`;

    console.log("Testing:", downloadUrl);
    console.log("=" . repeat(70));

    const response = await axios.get(downloadUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": embedUrl,
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const html = response.data;

    // Look for JavaScript variables with file/download info
    console.log("\n🔍 Looking for JS variables...\n");

    // Pattern: file: "url"
    const fileVarPattern = /file\s*:\s*["']([^"']+)["']/gi;
    let match;
    while ((match = fileVarPattern.exec(html)) !== null) {
      const url = match[1];
      if (url.length > 30) {
        console.log("  [file var]:", url.substring(0, 120));
      }
    }

    // Pattern: url: "url"
    const urlVarPattern = /url\s*:\s*["']([^"']+)["']/gi;
    while ((match = urlVarPattern.exec(html)) !== null) {
      const url = match[1];
      if (url.length > 30) {
        console.log("  [url var]:", url.substring(0, 120));
      }
    }

    // Pattern: src: "url"
    const srcVarPattern = /src\s*:\s*["']([^"']+)["']/gi;
    while ((match = srcVarPattern.exec(html)) !== null) {
      const url = match[1];
      if (url.length > 30) {
        console.log("  [src var]:", url.substring(0, 120));
      }
    }

    // Look for app.js script content
    console.log("\n📜 Looking for app.js...");
    const appJsMatch = html.match(/src\s*=\s*["']([^"']*app\.js[^"']*)["']/i);
    if (appJsMatch) {
      console.log("Found app.js at:", appJsMatch[1]);
      
      try {
        const appJsUrl = appJsMatch[1].startsWith('http') ? appJsMatch[1] : `https://savefiles.com${appJsMatch[1]}`;
        console.log("Fetching:", appJsUrl);
        const appJsResponse = await axios.get(appJsUrl, { timeout: 15000 });
        const appJsContent = appJsResponse.data;
        
        console.log("\n📝 app.js content (first 2000 chars):");
        console.log(appJsContent.substring(0, 2000));
        
        // Look for download patterns in app.js
        if (appJsContent.includes('download')) {
          console.log("\n✓ Found 'download' references in app.js");
          const lines = appJsContent.split('\n');
          lines.forEach((line, idx) => {
            if (line.toLowerCase().includes('download') && line.length < 200) {
              console.log(`  Line ${idx}:`, line.substring(0, 150));
            }
          });
        }
      } catch (e) {
        console.log("Could not fetch app.js:", e.message);
      }
    }

    // Look for xupload.js script content
    console.log("\n📜 Looking for xupload.js...");
    const xuploadMatch = html.match(/src\s*=\s*["']([^"']*xupload\.js[^"']*)["']/i);
    if (xuploadMatch) {
      console.log("Found xupload.js at:", xuploadMatch[1]);
      
      try {
        const xuploadUrl = xuploadMatch[1].startsWith('http') ? xuploadMatch[1] : `https://savefiles.com${xuploadMatch[1]}`;
        console.log("Fetching:", xuploadUrl);
        const xuploadResponse = await axios.get(xuploadUrl, { timeout: 15000 });
        const xuploadContent = xuploadResponse.data;
        
        console.log("\n📝 xupload.js content (first 2000 chars):");
        console.log(xuploadContent.substring(0, 2000));
      } catch (e) {
        console.log("Could not fetch xupload.js:", e.message);
      }
    }

    // Look for button with download click handler
    console.log("\n🔘 Looking for download buttons...");
    const buttonPattern = /<button[^>]*>([^<]*download[^<]*)<\/button>/gi;
    while ((match = buttonPattern.exec(html)) !== null) {
      console.log("  Found button:", match[0].substring(0, 150));
    }

    // Look for links with specific IDs or classes
    console.log("\n🔗 Looking for specific elements...");
    const elemPattern = /<(?:a|button)[^>]*(?:id|class)\s*=\s*["']([^"']*download[^"']*)["'][^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;
    while ((match = elemPattern.exec(html)) !== null) {
      console.log("  ID/Class:", match[1], "-> URL:", match[2].substring(0, 100));
    }

    // Save HTML snippet for manual inspection
    const divPattern = /<div[^>]*class\s*=\s*["']([^"]*download[^"']*)["'][^>]*>[\s\S]{0,500}<\/div>/i;
    const divMatch = html.match(divPattern);
    if (divMatch) {
      console.log("\n📦 Found download div:");
      console.log(divMatch[0].substring(0, 300));
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testSaveFilesDeep();
