const axios = require('axios');
const fs = require('fs');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function getDownloadPage() {
  try {
    const videoId = "k8zyey44415m";
    const downloadUrl = `https://savefiles.com/d/${videoId}_n`;

    console.log("Fetching download page:", downloadUrl);

    const response = await axios.get(downloadUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": `https://savefiles.com/d/${videoId}`,
      },
      timeout: 15000,
      maxRedirects: 10,
    });

    const html = response.data;
    console.log("✓ Fetched " + html.length + " bytes");

    fs.writeFileSync('savefiles-download-page.html', html);
    console.log("✓ Saved to savefiles-download-page.html");

    // Look for download links
    console.log("\n🔍 Looking for direct download links...\n");

    // Pattern 1: href links
    const hrefPattern = /href\s*=\s*["']([^"']*(?:http|download|get_file|dl)[^"']*)["']/gi;
    let match;
    let count = 0;
    while ((match = hrefPattern.exec(html)) !== null) {
      if (match[1].length > 40) {
        console.log(`[${++count}] href:`, match[1].substring(0, 150));
      }
    }

    // Pattern 2: onclick handlers with URLs
    const onclickPattern = /onclick\s*=\s*["']([^"']*(?:http|download)[^"']*)["']/gi;
    count = 0;
    while ((match = onclickPattern.exec(html)) !== null) {
      console.log(`[${++count}] onclick:`, match[1].substring(0, 150));
    }

    // Pattern 3: All URLs
    console.log("\n🔗 All URLs found:\n");
    const urlPattern = /(https?:\/\/[^\s"'<>]+)/g;
    const urls = new Set();
    while ((match = urlPattern.exec(html)) !== null) {
      const url = match[1];
      if (url.length > 50 && !url.includes('google') && !url.includes('script') && !url.includes('css')) {
        urls.add(url);
      }
    }
    
    Array.from(urls).forEach((url, i) => {
      console.log(`[${i + 1}]`, url);
    });

  } catch (error) {
    console.error("Error:", error.message);
  }
}

getDownloadPage();
