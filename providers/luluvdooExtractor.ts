/**
 * LuluVDoo Extractor
 * Extracts HLS streams from luluvdoo.com embed pages
 * 
 * Strategy:
 * 1. Fetch the embed page HTML
 * 2. Extract the HLS URL from the sources configuration
 * 3. Return the m3u8 playlist URL
 * 
 * The embed page contains a JW Player setup with sources directly in HTML:
 * sources: [{file:"https://domain.tnmr.org/hls2/.../master.m3u8?t=..."}]
 */

import { AxiosStatic } from "axios";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

/**
 * Extract HLS stream from LuluVDoo URL
 * @param url - LuluVDoo embed URL (e.g., https://luluvdoo.com/e/lxha81u0t6jr)
 * @param axios - Axios instance
 * @param signal - AbortSignal for cancellation
 * @returns Stream info with HLS link and headers
 */
export async function luluvdooExtractor(
  url: string,
  axios: AxiosStatic,
  signal?: AbortSignal
): Promise<{ link: string; headers?: Record<string, string>; type?: string } | null> {
  try {
    console.log("LuluVDoo: Starting extraction for:", url.substring(0, 80));

    // Fetch the embed page
    const response = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": "https://luluvdoo.com/",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal,
      timeout: 15000,
    });

    const html = typeof response.data === 'string' ? response.data : '';
    console.log("LuluVDoo: Page fetched (" + html.length + " chars)");

    // Extract HLS URL from sources configuration
    // Pattern: sources: [{file:"https://domain.tnmr.org/hls2/.../master.m3u8?t=..."}]
    const sourcesMatch = html.match(/sources:\s*\[\s*\{\s*file:\s*["']([^"']+)["']/i);
    
    if (!sourcesMatch) {
      console.error("LuluVDoo: Could not find sources in page");
      return null;
    }

    const hlsUrl = sourcesMatch[1];
    console.log("LuluVDoo: HLS URL extracted:", hlsUrl.substring(0, 100) + "...");

    // Validate it's an m3u8 URL
    if (!hlsUrl.includes('.m3u8')) {
      console.error("LuluVDoo: Extracted URL is not an m3u8 playlist");
      return null;
    }

    return {
      link: hlsUrl,
      headers: {
        "User-Agent": USER_AGENT,
        "Referer": url,
      },
      type: "m3u8",
    };

  } catch (error: any) {
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      console.log("LuluVDoo: Request aborted");
      return null;
    }
    
    console.error("LuluVDoo: Extraction error:", error.message);
    return null;
  }
}
