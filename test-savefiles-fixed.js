const axios = require('axios');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function savefilesExtractor(url) {
  try {
    console.log("SaveFiles: Starting extraction for:", url.substring(0, 80));

    // Extract video ID from URL (handles both /e/{id} and /d/{id})
    const idMatch = url.match(/\/(?:e|d)\/([A-Za-z0-9_-]+)/i);
    if (!idMatch) {
      console.error("SaveFiles: Could not extract video ID from URL");
      return null;
    }

    const videoId = idMatch[1];
    console.log("SaveFiles: Video ID:", videoId);

    // Construct download URL with quality suffix (_n = normal quality)
    const downloadUrl = `https://savefiles.com/d/${videoId}_n`;
    console.log("SaveFiles: Download URL:", downloadUrl);

    try {
      // Step 1: Fetch the download page to get form parameters
      console.log("SaveFiles: Fetching download page...");
      const pageResponse = await axios.get(downloadUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          "Referer": url,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
        timeout: 15000,
      });

      const html = typeof pageResponse.data === 'string' ? pageResponse.data : '';
      console.log("SaveFiles: Page fetched (" + html.length + " chars)");

      // Extract form parameters from hidden inputs
      const hashMatch = html.match(/name="hash"\s+value="([^"]+)"/i);
      if (!hashMatch) {
        console.error("SaveFiles: Could not extract hash from download page");
        return null;
      }

      const hash = hashMatch[1];
      console.log("SaveFiles: Hash extracted");

      // Step 2: POST the form to get the direct download link
      console.log("SaveFiles: Submitting download form...");
      
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
        maxRedirects: 10,
      });

      const contentType = downloadResponse.headers['content-type'] || '';
      console.log("SaveFiles: Response Content-Type:", contentType);

      // Check if we got a direct file or redirect
      if (contentType.includes('video') || contentType.includes('application/octet')) {
        console.log("SaveFiles: Got direct video file");
        const finalUrl = downloadResponse.config.url || downloadUrl;
        return {
          link: typeof finalUrl === 'string' ? finalUrl : downloadUrl,
          headers: {
            "User-Agent": USER_AGENT,
            "Referer": downloadUrl,
          },
          type: 'mp4',
        };
      }

      // If response is HTML, check if it contains a download link
      if (contentType.includes('text/html')) {
        const responseHtml = typeof downloadResponse.data === 'string' ? downloadResponse.data : '';
        
        // Look for SaveFiles CDN link
        // Pattern: https://s{number}.savefiles.com/v/{path}/filename.mp4?t=...
        const cdnLinkMatch = responseHtml.match(/https?:\/\/s\d+\.savefiles\.com\/v\/[^\s"'<>]+\.(?:mp4|mkv|avi|webm|mov)[^\s"'<>]*/i);
        
        if (cdnLinkMatch) {
          const directLink = cdnLinkMatch[0];
          console.log("SaveFiles: Found CDN link:", directLink.substring(0, 100) + "...");
          return {
            link: directLink,
            headers: {
              "User-Agent": USER_AGENT,
              "Referer": downloadUrl,
            },
            type: 'mp4',
          };
        }
        
        // Fallback: Look for any download-related link
        const directLinkMatch = responseHtml.match(/https?:\/\/[^\s"'<>]+(?:download|get_file|dl|storage|cdn)[^\s"'<>]+\.(?:mp4|mkv|avi|webm|mov)[^\s"'<>]*/i);
        
        if (directLinkMatch) {
          const directLink = directLinkMatch[0];
          console.log("SaveFiles: Found direct link in response");
          return {
            link: directLink,
            headers: {
              "User-Agent": USER_AGENT,
              "Referer": downloadUrl,
            },
            type: 'mp4',
          };
        }
        
        console.error("SaveFiles: No video link found in HTML response");
        return null;
      }

      // If form submission redirected to a file, use that URL
      console.log("SaveFiles: Using submission response URL");
      const finalUrl = downloadResponse.config.url || downloadUrl;
      return {
        link: typeof finalUrl === 'string' ? finalUrl : downloadUrl,
        headers: {
          "User-Agent": USER_AGENT,
          "Referer": downloadUrl,
        },
        type: 'mp4',
      };

    } catch (error) {
      console.error("SaveFiles: Error during extraction:", error.message);
      return null;
    }

  } catch (error) {
    console.error("SaveFiles: Extraction error:", error.message);
    return null;
  }
}

// Test with the URL from logs
savefilesExtractor("https://savefiles.com/e/oopfumrwlo3n").then(result => {
  console.log("\n✅ FINAL RESULT:");
  console.log(JSON.stringify(result, null, 2));
});
