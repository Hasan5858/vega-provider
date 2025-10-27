const axios = require('axios');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function testSaveFilesResponse() {
  try {
    const videoId = "oopfumrwlo3n";
    const downloadUrl = `https://savefiles.com/d/${videoId}_n`;
    
    console.log("Step 1: Fetching download page...");
    const pageResponse = await axios.get(downloadUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      },
      timeout: 15000,
    });

    const html = pageResponse.data;
    console.log("Page length:", html.length);

    // Extract hash
    const hashMatch = html.match(/name="hash"\s+value="([^"]+)"/i);
    if (!hashMatch) {
      console.error("Could not extract hash");
      return;
    }
    const hash = hashMatch[1];
    console.log("Hash:", hash);

    // Step 2: POST the form
    console.log("\nStep 2: Submitting form...");
    const formData = new URLSearchParams();
    formData.append('op', 'download_orig');
    formData.append('id', videoId);
    formData.append('mode', 'n');
    formData.append('hash', hash);

    const downloadResponse = await axios.post(downloadUrl, formData.toString(), {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": downloadUrl,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      timeout: 15000,
      maxRedirects: 0, // Don't follow redirects
      validateStatus: (status) => status >= 200 && status < 400, // Accept redirects
    });

    console.log("Response status:", downloadResponse.status);
    console.log("Response headers:");
    console.log(JSON.stringify(downloadResponse.headers, null, 2));
    
    const contentType = downloadResponse.headers['content-type'] || '';
    console.log("\nContent-Type:", contentType);

    // Check for redirects
    if (downloadResponse.headers['location']) {
      console.log("\n🔗 REDIRECT Location:", downloadResponse.headers['location']);
    }

    if (contentType.includes('text/html')) {
      const responseHtml = downloadResponse.data;
      console.log("\nResponse is HTML, length:", responseHtml.length);
      
      // Look for direct download link
      const directLinkMatch = responseHtml.match(/https?:\/\/[^\s"'<>]+(?:download|get_file|dl|storage|cdn|file)[^\s"'<>]*/gi);
      
      if (directLinkMatch) {
        console.log("\n✅ Found potential download links:");
        directLinkMatch.forEach((link, i) => {
          console.log(`  ${i + 1}. ${link}`);
        });
      } else {
        console.log("\n❌ No download links found in HTML");
        
        // Save the HTML for inspection
        const fs = require('fs');
        fs.writeFileSync('savefiles-post-response.html', responseHtml);
        console.log("Saved response to savefiles-post-response.html");
        
        // Look for any URLs
        const allUrls = responseHtml.match(/https?:\/\/[^\s"'<>]+/gi);
        if (allUrls) {
          console.log("\nAll URLs found:");
          allUrls.slice(0, 10).forEach((url, i) => {
            console.log(`  ${i + 1}. ${url}`);
          });
        }
      }
    } else if (contentType.includes('video') || contentType.includes('octet')) {
      console.log("\n✅ Response is a video file!");
      console.log("Final URL:", downloadResponse.config.url || downloadUrl);
    }

  } catch (error) {
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response headers:", error.response.headers);
      if (error.response.headers['location']) {
        console.log("\n🔗 ERROR REDIRECT Location:", error.response.headers['location']);
      }
    } else {
      console.error("Error:", error.message);
    }
  }
}

testSaveFilesResponse();
