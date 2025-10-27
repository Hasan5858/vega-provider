const axios = require('axios');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function testSaveFilesExtraction() {
  try {
    // Test URLs from debug file
    const testUrls = [
      "https://savefiles.com/e/k8zyey44415m",
      "https://savefiles.com/e/8f2y2e8ep9as"
    ];

    for (const embedUrl of testUrls) {
      console.log("\n" + "=".repeat(70));
      console.log("Testing embed URL:", embedUrl);
      console.log("=".repeat(70));

      // Extract video ID
      const idMatch = embedUrl.match(/\/(?:e|d)\/([A-Za-z0-9_-]+)/i);
      if (!idMatch) {
        console.error("❌ Could not extract video ID");
        continue;
      }

      const videoId = idMatch[1];
      console.log("✓ Video ID extracted:", videoId);

      // Convert to download URL
      const downloadUrl = `https://savefiles.com/d/${videoId}`;
      console.log("✓ Download URL:", downloadUrl);

      try {
        // Fetch download page
        const response = await axios.get(downloadUrl, {
          headers: {
            "User-Agent": USER_AGENT,
            "Referer": embedUrl,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          },
          timeout: 15000,
          maxRedirects: 5,
        });

        const html = response.data;
        console.log("✓ Download page fetched (" + html.length + " chars)");

        // Look for direct download links
        console.log("\n📋 Analyzing HTML for download links...\n");

        // Pattern 1: Direct href links to download
        const hrefPattern = /href\s*=\s*["']([^"']*(?:download|d\/)[^"']*?)["']/gi;
        let match;
        let found = 0;
        while ((match = hrefPattern.exec(html)) !== null) {
          console.log(`  [Href ${++found}]:`, match[1].substring(0, 120));
        }

        // Pattern 2: onclick handlers
        const onclickPattern = /onclick\s*=\s*["']([^"']+)["']/gi;
        found = 0;
        while ((match = onclickPattern.exec(html)) !== null) {
          console.log(`  [Onclick ${++found}]:`, match[1].substring(0, 120));
        }

        // Pattern 3: data attributes
        const dataPattern = /data-\w+\s*=\s*["']([^"']+)["']/gi;
        found = 0;
        while ((match = dataPattern.exec(html)) !== null) {
          console.log(`  [Data attr ${++found}]:`, match[1].substring(0, 120));
        }

        // Pattern 4: cloudflare CDN links
        const cdnPattern = /https?:\/\/[^"'\s]+(?:savefiles|cdn|dl|download)[^"'\s]+/gi;
        found = 0;
        while ((match = cdnPattern.exec(html)) !== null) {
          console.log(`  [CDN link ${++found}]:`, match[0].substring(0, 120));
        }

        // Pattern 5: Look for form action
        const formPattern = /<form[^>]*action\s*=\s*["']([^"']+)["'][^>]*>/gi;
        found = 0;
        while ((match = formPattern.exec(html)) !== null) {
          console.log(`  [Form action ${++found}]:`, match[1].substring(0, 120));
        }

        // Pattern 6: Extract all URLs
        const urlPattern = /(https?:\/\/[^\s"'<>]+)/g;
        found = 0;
        const urls = new Set();
        while ((match = urlPattern.exec(html)) !== null) {
          const url = match[1];
          if (url.length > 30 && url.length < 500 && !url.includes("script") && !url.includes("css")) {
            urls.add(url);
          }
        }
        
        if (urls.size > 0) {
          console.log(`\n🔗 Found ${urls.size} unique URLs:\n`);
          Array.from(urls).slice(0, 15).forEach((url, i) => {
            console.log(`  [URL ${i + 1}]:`, url.substring(0, 120));
          });
        }

        // Pattern 7: Look for JSON data
        const jsonPattern = /\{[\s\S]*?"(?:link|url|file|download)[\s\S]*?\}/;
        const jsonMatch = html.match(jsonPattern);
        if (jsonMatch) {
          console.log("\n📦 Found potential JSON data:");
          console.log(jsonMatch[0].substring(0, 300));
        }

        // Pattern 8: Look for base64 encoded data
        const base64Pattern = /["']([A-Za-z0-9+/]{50,})={0,2}["']/;
        const base64Match = html.match(base64Pattern);
        if (base64Match) {
          console.log("\n🔐 Found potential base64 data");
          try {
            const decoded = Buffer.from(base64Match[1], 'base64').toString();
            if (decoded.includes('http') || decoded.includes('download')) {
              console.log("📖 Decoded:", decoded.substring(0, 200));
            }
          } catch (e) {
            // Not valid base64
          }
        }

      } catch (error) {
        console.error("❌ Error fetching download page:", error.message);
        if (error.response?.status) {
          console.error("   Status:", error.response.status);
        }
      }
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testSaveFilesExtraction();
