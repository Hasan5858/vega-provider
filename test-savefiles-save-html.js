const axios = require('axios');
const fs = require('fs');

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

async function saveSaveFilesHTML() {
  try {
    const embedUrl = "https://savefiles.com/e/k8zyey44415m";
    const idMatch = embedUrl.match(/\/(?:e|d)\/([A-Za-z0-9_-]+)/i);
    const videoId = idMatch[1];
    const downloadUrl = `https://savefiles.com/d/${videoId}`;

    console.log("Fetching:", downloadUrl);

    const response = await axios.get(downloadUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": embedUrl,
      },
      timeout: 15000,
      maxRedirects: 5,
    });

    const html = response.data;
    fs.writeFileSync('savefiles-download.html', html);
    console.log("✓ Saved to savefiles-download.html (" + html.length + " bytes)");

  } catch (error) {
    console.error("Error:", error.message);
  }
}

saveSaveFilesHTML();
