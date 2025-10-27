const axios = require('axios');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function testFollow() {
  try {
    const videoId = "k8zyey44415m";
    const downloadUrl = `https://savefiles.com/d/${videoId}_n`;

    console.log("Following download URL with maxRedirects disabled...");
    console.log("URL:", downloadUrl);
    console.log("=".repeat(70));

    const response = await axios.get(downloadUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": `https://savefiles.com/d/${videoId}`,
      },
      timeout: 10000,
      maxRedirects: 0,
      validateStatus: () => true,
    }).catch(error => {
      if (error.response) return error.response;
      throw error;
    });

    console.log("\nResponse Status:", response.status);
    console.log("Response Headers:");
    console.log(JSON.stringify(response.headers, null, 2));

    if (response.status >= 300 && response.status < 400) {
      console.log("\n✓ Redirect found!");
      console.log("Location:", response.headers.location);
      
      // Try to get the actual file
      if (response.headers.location) {
        console.log("\nFollowing redirect...");
        const redirectResponse = await axios.get(response.headers.location, {
          headers: {
            "User-Agent": USER_AGENT,
            "Referer": downloadUrl,
          },
          timeout: 10000,
          maxRedirects: 5,
          validateStatus: () => true,
        });

        console.log("\nFinal Status:", redirectResponse.status);
        console.log("Final Content-Type:", redirectResponse.headers['content-type']);
        console.log("Final Content-Length:", redirectResponse.headers['content-length']);
        console.log("Final URL:", redirectResponse.config.url);
      }
    } else {
      console.log("\n❌ No redirect. Status:", response.status);
      console.log("Content-Type:", response.headers['content-type']);
      console.log("Content-Length:", response.headers['content-length']);
      
      // Show first 500 chars
      if (typeof response.data === 'string') {
        console.log("\nFirst 500 chars:");
        console.log(response.data.substring(0, 500));
      }
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testFollow();
