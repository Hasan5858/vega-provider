const axios = require('axios');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function testDirectURL() {
  try {
    const videoId = "k8zyey44415m";
    
    // The download page shows: https://savefiles.com/d/k8zyey44415m_n
    // This is likely what you click to trigger the download
    // Let's see if we can directly construct a CDN URL pattern
    
    // Common patterns used by cloud storage sites:
    const patterns = [
      `https://savefiles.com/d/${videoId}_n/stream`,
      `https://savefiles.com/api/file/${videoId}/download`,
      `https://savefiles.com/api/download/${videoId}`,
      `https://savefiles.com/api/stream/${videoId}`,
      `https://savefiles.com/file/${videoId}/stream`,
      `https://cdn.savefiles.com/d/${videoId}`,
      `https://storage.savefiles.com/d/${videoId}`,
    ];

    for (const testUrl of patterns) {
      console.log("\nTesting:", testUrl);
      try {
        const response = await axios.head(testUrl, {
          headers: {
            "User-Agent": USER_AGENT,
          },
          timeout: 5000,
          maxRedirects: 2,
          validateStatus: () => true,
        }).catch(() => 
          axios.get(testUrl, {
            headers: {
              "User-Agent": USER_AGENT,
            },
            timeout: 5000,
            maxRedirects: 2,
            validateStatus: () => true,
          })
        );

        console.log("  Status:", response.status);
        console.log("  Content-Type:", response.headers['content-type']);
        if (response.headers['content-length']) {
          console.log("  Content-Length:", response.headers['content-length']);
        }
      } catch (error) {
        console.log("  Error:", error.message.substring(0, 80));
      }
    }

    // Alternative: Check if the download page itself has a redirect
    console.log("\n" + "=".repeat(70));
    console.log("Following the download link from the page...");
    console.log("=".repeat(70));

    const downloadPageUrl = `https://savefiles.com/d/${videoId}_n`;
    const pageResponse = await axios.get(downloadPageUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": `https://savefiles.com/d/${videoId}`,
      },
      timeout: 10000,
      maxRedirects: 0,
      validateStatus: () => true,
    }).catch(error => {
      // Might throw on redirect
      if (error.response) return error.response;
      throw error;
    });

    console.log("\nPage Status:", pageResponse.status);
    console.log("Page Headers:", {
      'content-type': pageResponse.headers['content-type'],
      'content-length': pageResponse.headers['content-length'],
      'content-disposition': pageResponse.headers['content-disposition'],
      'location': pageResponse.headers['location'],
    });

    // If there's a redirect, follow it
    if (pageResponse.status >= 300 && pageResponse.status < 400 && pageResponse.headers.location) {
      console.log("\n✓ Found redirect to:", pageResponse.headers.location);
      
      const finalResponse = await axios.head(pageResponse.headers.location, {
        headers: {
          "User-Agent": USER_AGENT,
          "Referer": downloadPageUrl,
        },
        timeout: 10000,
        validateStatus: () => true,
      }).catch(() => ({headers: {}}));

      console.log("  Final Content-Type:", finalResponse.headers['content-type']);
      console.log("  Final Content-Length:", finalResponse.headers['content-length']);
    }

  } catch (error) {
    console.error("Error:", error.message);
  }
}

testDirectURL();
