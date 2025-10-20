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
        const server = getServerName(href);
        const fileType = getFileType(href, server);
        
        // For cloud storage services, we need to extract the actual video URL
        // For now, let's use the hubcloudExtracter to get direct links
        streamLinks.push({
          server: server,
          link: href,
          type: fileType,
          quality: "1080" // Default quality, could be enhanced to detect from text
        });
      }
    });

    // --- Extract actual video URLs from cloud storage links ---
    if (streamLinks.length > 0) {
      const directStreams: Stream[] = [];
      
      for (const stream of streamLinks) {
        try {
          // Use hubcloudExtracter to get direct video URLs from cloud storage links
          const directLinks = await hubcloudExtracter(stream.link, signal);
          directStreams.push(...directLinks);
        } catch (error) {
          // If hubcloudExtracter fails, keep the original link as fallback
          directStreams.push(stream);
        }
      }
      
      // Replace cloud storage links with direct video URLs
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

    // --- Remove duplicates based on link ---
    const uniqueStreams = streamLinks.filter((stream, index, self) => 
      index === self.findIndex(s => s.link === stream.link)
    );

    // Debug: Show final results
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Final stream links found:", uniqueStreams.length);
      window.console.log("🔍 DEBUG - Sample streams:", uniqueStreams.slice(0, 3).map(s => ({ server: s.server, link: s.link })));
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Final stream links found: ${uniqueStreams.length}\n`);
      process.stdout.write(`🔍 DEBUG - Sample streams: ${JSON.stringify(uniqueStreams.slice(0, 3).map(s => ({ server: s.server, link: s.link })))}\n`);
    }

    return uniqueStreams;
  } catch (error: any) {
    console.error("KatFix getStream error:", error.message);
    return [];
  }
}
