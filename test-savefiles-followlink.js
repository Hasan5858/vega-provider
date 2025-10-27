const axios = require('axios');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function testFollowLink() {
  try {
    const videoId = "k8zyey44415m";
    
    // Try different suffix patterns
    const patterns = [
      `https://savefiles.com/d/${videoId}`,
      `https://savefiles.com/d/${videoId}_n`,
      `https://savefiles.com/d/${videoId}/stream`,
      `https://savefiles.com/get_file/${videoId}`,
    ];

    for (const testUrl of patterns) {
      console.log("\n" + "=".repeat(70));
      console.log("Testing:", testUrl);
      console.log("=".repeat(70));

      try {
        const response = await axios.get(testUrl, {
          headers: {
            "User-Agent": USER_AGENT,
            "Referer": `https://savefiles.com/d/${videoId}`,
          },
          timeout: 10000,
          maxRedirects: 5,
          validateStatus: () => true, // Accept all status codes
        });

        console.log("✓ Status:", response.status);
        console.log("✓ Content-Type:", response.headers['content-type']);
        console.log("✓ Content-Length:", response.headers['content-length']);
        console.log("✓ Redirect URL:", response.request.res.responseUrl || 'N/A');

        // Check if it's a video file
        if (response.headers['content-type']?.includes('video') || 
            response.headers['content-type']?.includes('application/octet')) {
          console.log("✅ FOUND DIRECT VIDEO LINK!");
          console.log("   Final URL:", response.config.url);
          console.log("   Content-Length:", response.headers['content-length']);
        }

        // Show first 500 chars if HTML
        if (response.headers['content-type']?.includes('text/html')) {
          console.log("📄 HTML response (first 300 chars):");
          console.log(response.data.substring(0, 300));
        }

      } catch (error) {
        console.error("❌ Error:", error.message);
      }
    }

  } catch (error) {
    console.error("Fatal error:", error.message);
  }
}

testFollowLink();
