const axios = require('axios');
const fs = require('fs');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function testSaveFiles() {
  const videoId = "oopfumrwlo3n";
  const downloadUrl = `https://savefiles.com/d/${videoId}_n`;
  
  const pageResponse = await axios.get(downloadUrl, {
    headers: { "User-Agent": USER_AGENT },
    timeout: 15000,
  });

  const html = pageResponse.data;
  const hashMatch = html.match(/name="hash"\s+value="([^"]+)"/i);
  const hash = hashMatch[1];

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

  const responseHtml = downloadResponse.data;
  fs.writeFileSync('savefiles-response-debug.html', responseHtml);
  console.log("Saved to savefiles-response-debug.html");
  
  // Find all https:// URLs
  const allUrls = responseHtml.match(/https:\/\/[^\s"'<>]+/g);
  console.log("\nAll HTTPS URLs found:");
  if (allUrls) {
    allUrls.forEach((url, i) => {
      if (url.includes('savefiles.com') && url.includes('/v/')) {
        console.log(`⭐ ${i + 1}. ${url}`);
      }
    });
  }
  
  // Try the specific pattern
  const cdnPattern = /https?:\/\/s\d+\.savefiles\.com\/v\/[^\s"'<>]+\.(?:mp4|mkv|avi|webm|mov)[^\s"'<>]*/gi;
  const matches = responseHtml.match(cdnPattern);
  console.log("\n CDN Pattern matches:", matches);
}

testSaveFiles().catch(console.error);
