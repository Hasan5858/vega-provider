/**
 * BigWarp Extractor
 * Extracts video streams from bigwarp.cc/bigwarp.pro
 * 
 * Flow:
 * 1. Extract file_code from embed URL (e.g., /e/iw2hmw2sz246 -> iw2hmw2sz246)
 * 2. POST to /dl endpoint with form data (op=embed, file_code, auto=1)
 * 3. Parse jwplayer().setup() configuration from HTML response
 * 4. Extract video sources array with quality labels
 */

import { AxiosStatic } from "axios";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

/**
 * Extract stream from BigWarp URL
 * @param url - BigWarp embed URL (e.g., https://bigwarp.cc/e/iw2hmw2sz246)
 * @param axios - Axios instance
 * @param signal - AbortSignal for cancellation
 * @returns Stream info with link and headers
 */
export async function bigwarpExtractor(
  url: string,
  axios: AxiosStatic,
  signal?: AbortSignal
): Promise<{ link: string; headers?: Record<string, string>; type?: string } | null> {
  try {
    console.log("BigWarp: Starting extraction for:", url.substring(0, 80));

    // Extract file code from URL
    // Pattern: /e/CODE or /e/CODE-filename.html
    const codeMatch = url.match(/\/e\/([A-Za-z0-9_-]+)/i);
    if (!codeMatch) {
      console.error("BigWarp: Could not extract file code from URL");
      return null;
    }

    const fileCode = codeMatch[1];
    console.log("BigWarp: File code:", fileCode);

    // Extract origin from URL (bigwarp.cc, bigwarp.pro, etc.)
    const originMatch = url.match(/^(https?:\/\/[^/]+)/i);
    const origin = originMatch ? originMatch[1] : "https://bigwarp.cc";
    console.log("BigWarp: Origin:", origin);

    // Try multiple hosts if needed
    const candidateHosts = Array.from(
      new Set([
        origin,
        "https://bigwarp.pro",
        "https://bigwarp.cc",
      ])
    );

    for (const host of candidateHosts) {
      try {
        const dlUrl = `${host}/dl`;
        console.log(`BigWarp: Trying ${dlUrl}...`);

        // Prepare form data
        const formData = new URLSearchParams();
        formData.append('op', 'embed');
        formData.append('file_code', fileCode);
        formData.append('auto', '1');
        formData.append('referer', url);

        // POST to /dl endpoint
        const response = await axios.post(dlUrl, formData, {
          headers: {
            "User-Agent": USER_AGENT,
            "Referer": url,
            "Content-Type": "application/x-www-form-urlencoded",
            "Origin": host,
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          },
          signal,
          timeout: 15000,
          maxRedirects: 10,
        });

        const html = typeof response.data === 'string' ? response.data : '';
        console.log("BigWarp: Response received (" + html.length + " chars)");

        // Extract jwplayer setup configuration
        // Pattern: jwplayer("vplayer").setup({sources: [{file:"URL",label:"QUALITY"}],...})
        const jwplayerMatch = html.match(/jwplayer\([^)]+\)\.setup\((\{[\s\S]+?\})\);/i);
        
        if (!jwplayerMatch) {
          console.error("BigWarp: Could not find jwplayer configuration");
          continue; // Try next host
        }

        const configStr = jwplayerMatch[1];
        console.log("BigWarp: Found jwplayer config");

        // Extract sources array from config
        // Pattern: sources: [{file:"URL",label:"QUALITY"},{file:"URL2",label:"QUALITY2"}]
        const sourcesMatch = configStr.match(/sources:\s*\[([^\]]+)\]/i);
        
        if (!sourcesMatch) {
          console.error("BigWarp: Could not extract sources from config");
          continue;
        }

        const sourcesStr = sourcesMatch[1];
        
        // Extract all video URLs from sources
        // Pattern: file:"https://fs47.bigwarp.io/v/..."
        const fileMatches = [...sourcesStr.matchAll(/file:\s*["']([^"']+)["']/gi)];
        
        if (fileMatches.length === 0) {
          console.error("BigWarp: No video files found in sources");
          continue;
        }

        // Get the first (usually highest quality) video URL
        const videoUrl = fileMatches[0][1];
        console.log("BigWarp: Extracted video URL:", videoUrl.substring(0, 100) + "...");

        // Optional: Extract quality labels
        const labelMatches = [...sourcesStr.matchAll(/label:\s*["']([^"']+)["']/gi)];
        const quality = labelMatches.length > 0 ? labelMatches[0][1] : undefined;
        
        if (quality) {
          console.log("BigWarp: Quality:", quality);
        }

        return {
          link: videoUrl,
          headers: {
            "User-Agent": USER_AGENT,
            "Referer": host,
          },
          type: 'mp4',
        };

      } catch (error: any) {
        console.error(`BigWarp: Error with host ${host}:`, error.message);
        continue; // Try next host
      }
    }

    console.error("BigWarp: All hosts failed");
    return null;

  } catch (error: any) {
    if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
      console.log("BigWarp: Request aborted");
      return null;
    }
    
    console.error("BigWarp: Extraction error:", error.message);
    return null;
  }
}
