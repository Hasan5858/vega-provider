/**
 * StreamWish Extractor
 * Extracts video streams from streamwish.to using a manually configured DMCA-free domain
 * 
 * Strategy: StreamWish checks domains against DMCA lists and redirects.
 * We bypass this by using a working domain (yuguaab.com) and updating it when needed.
 * 
 * Update Instructions:
 * If yuguaab.com becomes blocked, find a new working domain and replace WORKING_DOMAIN constant.
 * Working domains usually last months to a year before DMCA blocking.
 */

import { AxiosStatic } from "axios";

// Manual DMCA-free domain (update when blocked)
const WORKING_DOMAIN = "https://yuguaab.com";

const DEOBFUSCATE_API = "https://js-deobfuscator-api.replit.app/api/deobfuscate";

const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "Referer": `${WORKING_DOMAIN}/`,
  "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
};

/**
 * Extract stream from StreamWish URL
 * @param url - StreamWish embed or video URL (any domain)
 * @param axios - Axios instance
 * @param signal - AbortSignal for cancellation
 * @returns Stream info with link and headers
 */
export async function streamwishExtractor(
  url: string,
  axios: AxiosStatic,
  signal?: AbortSignal
): Promise<{ link: string; headers?: Record<string, string>; type?: string } | null> {
  try {
    console.log("StreamWish: Starting extraction for:", url.substring(0, 80));

    // Extract video ID from URL (works with any StreamWish domain)
    const idMatch = url.match(/\/(?:e|embed|v)\/([A-Za-z0-9_-]+)/i);
    if (!idMatch) {
      console.error("StreamWish: Could not extract video ID from URL");
      return null;
    }

    const videoId = idMatch[1];
    console.log("StreamWish: Video ID:", videoId);

    // Convert to working domain
    const embedUrl = `${WORKING_DOMAIN}/e/${videoId}`;
    console.log("StreamWish: Using working domain:", embedUrl);

    // Fetch embed page
    const response = await axios.get(embedUrl, {
      headers,
      signal,
      timeout: 15000,
    });

    const html = response.data;
    console.log("StreamWish: Embed page fetched (" + html.length + " chars)");

    // Extract eval code (complete with .split('|'))
    const evalPattern = /eval\(function\(p,a,c,k,e,d\)[\s\S]+?\.split\('\|'\)\)\)/;
    const evalMatch = html.match(evalPattern);

    if (!evalMatch) {
      console.error("StreamWish: Could not find eval code in embed page");
      return null;
    }

    const evalCode = evalMatch[0];
    console.log("StreamWish: Extracted eval code (" + evalCode.length + " chars)");

    // Deobfuscate using API
    console.log("StreamWish: Sending to deobfuscation API...");
    const deobfuscateResponse = await axios.post(
      DEOBFUSCATE_API,
      { code: evalCode },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    if (!deobfuscateResponse.data.success) {
      console.error("StreamWish: Deobfuscation failed:", deobfuscateResponse.data.error);
      return null;
    }

    const deobfuscated = deobfuscateResponse.data.result;
    console.log("StreamWish: Deobfuscation successful (" + deobfuscated.length + " chars)");

    // Try to extract m3u8 URL from deobfuscated code
    // StreamWish typically has direct m3u8 URLs in the deobfuscated code
    
    // Pattern 1: Direct m3u8 URL
    const m3u8Match = deobfuscated.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
    if (m3u8Match) {
      const m3u8Url = m3u8Match[0].replace(/&amp;/g, "&");
      console.log("StreamWish: Found m3u8 URL (direct)");
      return {
        link: m3u8Url,
        headers: {
          "User-Agent": headers["User-Agent"],
          "Referer": `${WORKING_DOMAIN}/`,
        },
        type: "m3u8",
      };
    }

    // Pattern 2: Sources array with file property
    const sourcesMatch = deobfuscated.match(/"sources":\s*\[[\s\S]*?"file":\s*"([^"]+)"/);
    if (sourcesMatch) {
      const fileUrl = sourcesMatch[1].replace(/\\/g, "").replace(/&amp;/g, "&");
      console.log("StreamWish: Found stream URL (sources)");
      return {
        link: fileUrl,
        headers: {
          "User-Agent": headers["User-Agent"],
          "Referer": `${WORKING_DOMAIN}/`,
        },
        type: fileUrl.includes(".m3u8") ? "m3u8" : "mp4",
      };
    }

    // Pattern 3: File property
    const fileMatch = deobfuscated.match(/"file":\s*"([^"]+)"/);
    if (fileMatch) {
      const fileUrl = fileMatch[1].replace(/\\/g, "").replace(/&amp;/g, "&");
      console.log("StreamWish: Found stream URL (file)");
      return {
        link: fileUrl,
        headers: {
          "User-Agent": headers["User-Agent"],
          "Referer": `${WORKING_DOMAIN}/`,
        },
        type: fileUrl.includes(".m3u8") ? "m3u8" : "mp4",
      };
    }

    console.error("StreamWish: Could not find stream URL in deobfuscated code");
    return null;
  } catch (error: any) {
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      console.log("StreamWish: Request aborted");
      return null;
    }
    console.error("StreamWish: Extraction error:", error.message);
    return null;
  }
}
