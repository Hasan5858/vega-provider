import { ProviderContext, Stream } from "../types";

export async function getStream({
  link,
  type,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}) {
  console.log(`moviezwap stream function called with link: ${link}, type: ${type}`);
  const { axios, cheerio, commonHeaders: headers, getBaseUrl } = providerContext;
  
  // Check if this is a download.php link (wrong URL format from app)
  if (link.includes('/download.php?file=')) {
    console.log('moviezwap: Received download.php link, this is wrong - should be movie page URL');
    return [];
  }
  
  const res = await axios.get(link, { headers, signal });
  const html = res.data;
  const $ = cheerio.load(html);
  const Streams: Stream[] = [];
  const baseUrl = await getBaseUrl("moviezwap");
  
  console.log(`moviezwap: Fetched movie page, looking for download links...`);

  // Extract download links with different qualities and get direct MP4 URLs
  const downloadLinks: Array<{url: string, quality: "360" | "480" | "720" | "1080" | "2160" | undefined, text: string}> = [];
  $('a[href*="/dwload.php?file="]').each((i, el) => {
    const href = $(el).attr("href");
    const text = $(el).text().trim();
    
    if (href && text) {
      // Extract quality from the text (e.g., "320p", "480p", "720p")
      const qualityMatch = text.match(/(\d+)p/i);
      let quality: "360" | "480" | "720" | "1080" | "2160" | undefined;
      
      if (qualityMatch) {
        const qualityNum = parseInt(qualityMatch[1]);
        // Map to valid quality values
        if (qualityNum <= 360) quality = "360";
        else if (qualityNum <= 480) quality = "480";
        else if (qualityNum <= 720) quality = "720";
        else if (qualityNum <= 1080) quality = "1080";
        else if (qualityNum <= 2160) quality = "2160";
      }
      
      // Convert dwload.php to download.php (skip intermediate step)
      const downloadUrl = href.replace('/dwload.php?', '/download.php?');
      const fullDownloadUrl = downloadUrl.startsWith('http') ? downloadUrl : `${baseUrl}${downloadUrl}`;
      
      downloadLinks.push({
        url: fullDownloadUrl,
        quality: quality,
        text: text
      });
    }
  });

  // Return all available streams - let the app handle quality selection
  // The app will filter by quality on the client side
  const filteredDownloadLinks = downloadLinks;
  console.log(`moviezwap: Found ${filteredDownloadLinks.length} total download links`);

  // Process each download link to get the direct MP4 URL
  for (const downloadLink of filteredDownloadLinks) {
    try {
      // Get the download page
      const downloadPageRes = await axios.get(downloadLink.url, {
        headers: { ...headers, "Referer": baseUrl },
        signal,
        timeout: 10000
      });
      
      const $downloadPage = cheerio.load(downloadPageRes.data);
      
      // Look for the "Fast Download Server" button (the real download button)
      let directDownloadUrl = null;
      
      // Method 1: Look for "Fast Download Server" text in links/buttons
      $downloadPage('a:contains("Fast Download Server"), button:contains("Fast Download Server")').each((i, el) => {
        const href = $downloadPage(el).attr('href');
        if (href && (href.includes('.mp4') || href.includes('moviezzwaphd.xyz'))) {
          directDownloadUrl = href;
        }
      });
      
      // Method 2: Look for onclick handlers with download URLs
      if (!directDownloadUrl) {
        $downloadPage('[onclick*="window.location"], [onclick*="location.href"]').each((i, el) => {
          const onclick = $downloadPage(el).attr('onclick');
          if (onclick) {
            const urlMatch = onclick.match(/['"](https?:\/\/[^'"]*\.mp4[^'"]*)['"]/);
            if (urlMatch) {
              directDownloadUrl = urlMatch[1];
            }
          }
        });
      }
      
      // Method 3: Look for any links containing .mp4 or moviezzwaphd.xyz
      if (!directDownloadUrl) {
        $downloadPage('a[href*=".mp4"], a[href*="moviezzwaphd.xyz"]').each((i, el) => {
          const href = $downloadPage(el).attr('href');
          if (href && href.includes('.mp4')) {
            directDownloadUrl = href;
          }
        });
      }
      
      // If we found a direct download URL, add it to streams
      if (directDownloadUrl) {
        Streams.push({
          link: directDownloadUrl,
          type: "mp4",
          server: "MoviezWap",
          quality: downloadLink.quality,
          headers: {
            ...headers,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Referer": baseUrl,
          },
        });
      }
      
    } catch (error) {
      console.error(`Error processing download link ${downloadLink.url}:`, error instanceof Error ? error.message : 'Unknown error');
      // Continue with other download links even if one fails
    }
  }

  return Streams;
}
