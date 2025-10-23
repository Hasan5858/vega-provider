import { ProviderContext, Stream } from "../types";

const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Cache-Control": "no-store",
  "Accept-Language": "en-US,en;q=0.9",
  DNT: "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

// Helper function to get server name from URL
function getServerName(url: string): string {
  if (url.includes("gofile.io")) return "GoFile";
  if (url.includes("send.cm")) return "Send";
  if (url.includes("gdflix")) return "GDFlix";
  if (url.includes("filepress")) return "FilePress";
  if (url.includes("gdtot")) return "GDTot";
  if (url.includes("pixeldrain")) return "PixelDrain";
  if (url.includes("hubcloud")) return "HubCloud";
  if (url.includes("1fichier")) return "1fichier";
  if (url.includes("mega.nz")) return "Mega";
  if (url.includes("drive.google")) return "Google Drive";
  return "Unknown";
}

// Helper function to determine file type from URL or content
function getFileType(url: string, server: string): string {
  // Check URL extension first
  const extension = url.match(/\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v)$/i);
  if (extension) return extension[1].toLowerCase();
  
  // Default based on server
  const serverDefaults: { [key: string]: string } = {
    "GoFile": "mkv",
    "Send": "mkv", 
    "GDFlix": "mkv",
    "FilePress": "mkv",
    "GDTot": "mkv",
    "PixelDrain": "mp4",
    "HubCloud": "mkv",
    "1fichier": "mkv",
    "Mega": "mkv",
    "Google Drive": "mkv"
  };
  
  return serverDefaults[server] || "mkv";
}

// Helper function to extract direct video URLs from cloud storage services
async function extractDirectVideoUrl(link: string, server: string, axios: any, cheerio: any): Promise<Stream[]> {
  try {
    // Debug logging
    if (typeof window !== 'undefined' && window.console) {
      window.console.log(`🔍 DEBUG - Extracting direct URL from ${server}: ${link}`);
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Extracting direct URL from ${server}: ${link}\n`);
    }

    const response = await axios.get(link, { 
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      },
      maxRedirects: 5,
      timeout: 10000
    });

    const finalUrl = response.request?.responseURL || response.config?.url || link;
    
    // Debug the final URL
    if (typeof window !== 'undefined' && window.console) {
      window.console.log(`🔍 DEBUG - Final URL for ${server}: ${finalUrl}`);
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Final URL for ${server}: ${finalUrl}\n`);
    }

    // Special handling for fastcdn-dl.pages.dev URLs - extract the actual video URL from query parameter
    if (finalUrl.includes('fastcdn-dl.pages.dev')) {
      try {
        // Extract URL parameter manually since URLSearchParams might not be available
        const urlMatch = finalUrl.match(/[?&]url=([^&]+)/);
        if (urlMatch && urlMatch[1]) {
          const encodedUrl = urlMatch[1];
          const decodedUrl = decodeURIComponent(encodedUrl);
          // Check if the decoded URL is a direct video file
          const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
          if (videoExtensions.test(decodedUrl)) {
            return [{
              server: server,
              link: decodedUrl,
              type: getFileType(decodedUrl, server),
              quality: "1080"
            }];
          }
        }
      } catch (error) {
        // If decoding fails, continue with other methods
      }
    }

    // Check if the final URL is a direct video file
    const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
    if (videoExtensions.test(finalUrl)) {
      return [{
        server: server,
        link: finalUrl,
        type: getFileType(finalUrl, server),
        quality: "1080"
      }];
    }

    // If not a direct video file, parse the HTML to find video links
    const $ = cheerio.load(response.data);
    const videoLinks: Stream[] = [];
    
    // Look for direct video links in the HTML
    const videoSelectors = [
      'a[href*=".mp4"]',
      'a[href*=".mkv"]', 
      'a[href*=".avi"]',
      'a[href*=".mov"]',
      'a[href*=".webm"]',
      'a[href*=".m4v"]',
      'a[href*=".m3u8"]'
    ].join(', ');
    
    $(videoSelectors).each((_: any, el: any) => {
      const href = $(el).attr('href')?.trim();
      const text = $(el).text().trim();
      
      if (href) {
        // Make sure it's a full URL
        const fullUrl = href.startsWith('http') ? href : new URL(href, finalUrl).href;
        
        // Special handling for fastcdn-dl.pages.dev URLs
        if (fullUrl.includes('fastcdn-dl.pages.dev')) {
          try {
            // Extract URL parameter manually since URLSearchParams might not be available
            const urlMatch = fullUrl.match(/[?&]url=([^&]+)/);
            if (urlMatch && urlMatch[1]) {
              const encodedUrl = urlMatch[1];
              const decodedUrl = decodeURIComponent(encodedUrl);
              // Check if the decoded URL is a direct video file
              const videoExtensions = /\.(mp4|mkv|avi|mov|wmv|flv|webm|m4v|m3u8)$/i;
              if (videoExtensions.test(decodedUrl)) {
                videoLinks.push({
                  server: server,
                  link: decodedUrl,
                  type: getFileType(decodedUrl, server),
                  quality: "1080"
                });
                return; // Skip adding the original URL
              }
            }
          } catch (error) {
            // If decoding fails, continue with original URL
          }
        }
        
        videoLinks.push({
          server: server,
          link: fullUrl,
          type: getFileType(fullUrl, server),
          quality: "1080"
        });
      }
    });
    
    // Also look for video URLs in the HTML content using regex
    const videoUrlPattern = /https?:\/\/[^\s"']+\.(mp4|mkv|avi|mov|webm|m4v|m3u8)(\?[^\s"']*)?/gi;
    const matches = response.data.match(videoUrlPattern);
    if (matches) {
      matches.forEach((match: string) => {
        videoLinks.push({
          server: server,
          link: match,
          type: getFileType(match, server),
          quality: "1080"
        });
      });
    }
    
    
    if (videoLinks.length > 0) {
      // Debug found video links
      if (typeof window !== 'undefined' && window.console) {
        window.console.log(`🔍 DEBUG - Found ${videoLinks.length} video links in HTML`);
        videoLinks.forEach((link, i) => {
          window.console.log(`  ${i+1}. ${link.link}`);
        });
      }
      if (typeof process !== 'undefined' && process.stdout) {
        process.stdout.write(`🔍 DEBUG - Found ${videoLinks.length} video links in HTML\n`);
        videoLinks.forEach((link, i) => {
          process.stdout.write(`  ${i+1}. ${link.link}\n`);
        });
      }
      
      return videoLinks;
    }

    // If no video links found, return the original link as fallback
    return [{
      server: server,
      link: link,
      type: getFileType(link, server),
      quality: "1080"
    }];

  } catch (error: any) {
    // If extraction fails, return the original link as fallback
    if (typeof window !== 'undefined' && window.console) {
      window.console.log(`🔍 DEBUG - Extraction failed for ${server}: ${error.message}`);
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Extraction failed for ${server}: ${error.message}\n`);
    }

    return [{
      server: server,
      link: link,
      type: getFileType(link, server),
      quality: "1080"
    }];
  }
}

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
  const { axios, cheerio, extractors } = providerContext;
  const { hubcloudExtracter } = extractors;

  try {
    // Debug logging that survives minification
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Stream link received:", link);
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Stream link received: ${link}\n`);
    }

    const streamLinks: Stream[] = [];
    const response = await axios.get(link, { headers });
    
    // Debug the response
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Response status:", response.status);
      window.console.log("🔍 DEBUG - Response URL:", response.request?.responseURL || response.config?.url);
      window.console.log("🔍 DEBUG - Response data length:", response.data ? response.data.length : 'no data');
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Response status: ${response.status}\n`);
      process.stdout.write(`🔍 DEBUG - Response URL: ${response.request?.responseURL || response.config?.url}\n`);
      process.stdout.write(`🔍 DEBUG - Response data length: ${response.data ? response.data.length : 'no data'}\n`);
    }

    const $ = cheerio.load(response.data);

    // --- Extract all cloud storage links ---
    const cloudSelectors = [
      "a[href*='gofile.io']",           // GoFile
      "a[href*='send.cm']",             // Send
      "a[href*='gdflix']",              // GDFlix
      "a[href*='filepress']",           // FilePress
      "a[href*='gdtot']",               // GDTot
      "a[href*='pixeldrain.dev']",      // PixelDrain
      "a[href*='hubcloud']",            // HubCloud
      "a[href*='1fichier.com']",        // 1fichier
      "a[href*='mega.nz']",             // Mega
      "a[href*='drive.google.com']"     // Google Drive
    ].join(", ");

    // Debug: Check how many elements each selector finds
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Testing cloud selectors:");
      cloudSelectors.split(',').forEach(selector => {
        const count = $(selector).length;
        window.console.log(`  ${selector}: ${count} elements`);
      });
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write("🔍 DEBUG - Testing cloud selectors:\n");
      cloudSelectors.split(',').forEach(selector => {
        const count = $(selector).length;
        process.stdout.write(`  ${selector}: ${count} elements\n`);
      });
    }

    $(cloudSelectors).each((_, el) => {
      const href = $(el).attr("href")?.trim();
      const text = $(el).text().trim();
      
      if (href) {
        // Skip only clearly irrelevant options
        const isIrrelevant = /(imdb|rating|score|\d+\.\d+\/10)/i.test(text) ||
                            /^(hindi|english|tamil|telugu|bengali|korean|turkish|urdu)$/i.test(text) ||
                            /(share|telegram|whatsapp|facebook|twitter|instagram)/i.test(text) ||
                            /(how to download|click to|disclaimer)/i.test(text) ||
                            text.length < 2; // Skip very short text
        
        // Include cloud storage links if they're not irrelevant
        if (!isIrrelevant) {
          const server = getServerName(href);
          const fileType = getFileType(href, server);
          
          // Extract quality from text (e.g., "480p Links [436MB]" -> "480")
          let quality: "360" | "480" | "720" | "1080" | "2160" = "1080"; // Default
          const qualityMatch = text.match(/(\d+)p/i);
          if (qualityMatch) {
            const qualityNum = parseInt(qualityMatch[1]);
            if (qualityNum <= 360) quality = "360";
            else if (qualityNum <= 480) quality = "480";
            else if (qualityNum <= 720) quality = "720";
            else if (qualityNum <= 1080) quality = "1080";
            else if (qualityNum >= 2160) quality = "2160";
          }
          
          streamLinks.push({
            server: server,
            link: href,
            type: fileType,
            quality: quality
          });
        }
      }
    });

    // --- Extract actual video URLs from cloud storage links using appropriate extractors ---
    if (streamLinks.length > 0) {
      const directStreams: Stream[] = [];
      
      for (const stream of streamLinks) {
        try {
          // Route to appropriate extractor based on server
          if (stream.server === 'GoFile') {
            // Extract GoFile ID and use gofileExtracter
            const gofileId = stream.link.split('/d/')[1]?.split('?')[0];
            if (gofileId) {
              try {
                const gofileResult = await providerContext.extractors.gofileExtracter(gofileId);
                if (gofileResult?.link) {
                  directStreams.push({
                    ...stream,
                    link: gofileResult.link,
                    server: `${stream.server} - ${stream.quality}p`
                  });
                } else {
                  directStreams.push(stream);
                }
              } catch (gofileError) {
                directStreams.push(stream);
              }
            }
          } else if (stream.server === 'GDFlix') {
            // Use gdFlixExtracter
            try {
              const gdflixLinks = await providerContext.extractors.gdFlixExtracter(stream.link, signal);
              if (gdflixLinks && gdflixLinks.length > 0) {
                directStreams.push(...gdflixLinks.map(s => ({
                  ...s,
                  server: `${stream.server} - ${stream.quality}p`,
                  quality: stream.quality
                })));
              } else {
                directStreams.push(stream);
              }
            } catch (gdflixError) {
              directStreams.push(stream);
            }
          } else if (stream.server === 'GDTot' || stream.server === 'HubCloud') {
            // Use hubcloudExtracter
            try {
              const hubcloudLinks = await hubcloudExtracter(stream.link, signal);
              if (hubcloudLinks && hubcloudLinks.length > 0) {
                directStreams.push(...hubcloudLinks.map(s => ({
                  ...s,
                  server: `${stream.server} - ${stream.quality}p`,
                  quality: stream.quality
                })));
              } else {
                directStreams.push(stream);
              }
            } catch (hubcloudError) {
              directStreams.push(stream);
            }
          } else {
            // For unknown servers, try general extraction
            try {
              const directLinks = await extractDirectVideoUrl(stream.link, stream.server, axios, cheerio);
              directStreams.push(...directLinks);
            } catch (error) {
              directStreams.push(stream);
            }
          }
        } catch (error) {
          // Last resort: keep original link
          directStreams.push(stream);
        }
      }
      
      // Replace cloud storage links with extracted URLs
      streamLinks.length = 0;
      streamLinks.push(...directStreams);
    } else {
      // --- Try hubcloud extraction as fallback ---
      try {
        const hubcloudStreams = await hubcloudExtracter(link, signal);
        streamLinks.push(...hubcloudStreams);
      } catch (hubcloudError) {
        // HubCloud extraction failed, continue with what we have
      }
    }

    // --- Remove duplicates ---
    const uniqueStreams = streamLinks
      .filter((stream, index, self) => 
        index === self.findIndex(s => s.link === stream.link)
      );

    // Debug: Show final results
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Final stream links found:", uniqueStreams.length);
      window.console.log("🔍 DEBUG - Sample streams:", uniqueStreams.slice(0, 3).map(s => ({ server: s.server, link: s.link, quality: s.quality })));
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Final stream links found: ${uniqueStreams.length}\n`);
      process.stdout.write(`🔍 DEBUG - Sample streams: ${JSON.stringify(uniqueStreams.slice(0, 3).map(s => ({ server: s.server, link: s.link, quality: s.quality })))}\n`);
    }

    return uniqueStreams;
  } catch (error: any) {
    console.error("KatFix getStream error:", error.message);
    return [];
  }
}
