import { AxiosStatic } from "axios";
import { Stream } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

/**
 * FileLions extractor
 * - Convert view URL (/v/{id}) to embed (/embed/{id})
 * - Extract eval(...) obfuscated JS from the embed HTML (without surrounding <script> when possible)
 * - Send the eval string to an external deobfuscation API
 * - Parse the returned deobfuscated JS and extract the .m3u8 link
 */
export async function filelionsExtractor(
  url: string,
  axios: AxiosStatic,
  signal?: AbortSignal
): Promise<{ link: string; headers?: Record<string, string>; type?: string } | null> {
  try {
    // Normalize to embed URL
    const idMatch = url.match(/\/(?:v|embed)\/([A-Za-z0-9_-]{4,})/i);
    const id = idMatch ? idMatch[1] : null;
    if (!id) {
      console.error("FileLions: failed to parse id from url", url);
      return null;
    }

    const embedUrl = `https://filelions.to/embed/${id}`;

    const res = await axios.get(embedUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: url,
      },
      responseType: "text",
      signal,
    });

    const html: string = res.data || "";

    // Extract the complete eval() packed code without <script> tags
    // Pattern: eval(function(p,a,c,k,e,d){...}('...'.split('|')))
    let evalCode = null;
    
    // Match the complete eval statement until .split('|'))
    const evalPattern = /eval\(function\(p,a,c,k,e,d\)[\s\S]+?\.split\('\|'\)\)\)/;
    const evalMatch = html.match(evalPattern);
    
    if (evalMatch) {
      evalCode = evalMatch[0];
      console.log(`FileLions: Extracted eval code (${evalCode.length} chars)`);
    }

    // If still not found, fallback: search for m3u8 directly in the page
    if (!evalCode) {
      const directM3u8 = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
      if (directM3u8) {
        return {
          link: directM3u8[0].replace(/&amp;/g, "&"),
          headers: {
            "User-Agent": USER_AGENT,
            Referer: embedUrl,
          },
          type: "m3u8",
        };
      }
      console.error("FileLions: no eval block and no m3u8 found in embed page");
      return null;
    }

    // Call external deobfuscation API (rate limited: 10 requests/minute)
    try {
      const apiResp = await axios.post(
        "https://js-deobfuscator-api.replit.app/api/deobfuscate",
        { code: evalCode },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );

      const data = apiResp.data || {};
      if (!data.success || !data.result) {
        console.error("FileLions: deobfuscation API failed", data.error || data);
        return null;
      }

      const deob = String(data.result);

      // FileLions uses a `links` object with multiple sources (hls2, hls3, hls4)
      // Priority: hls2 (acek-cdn.com with .m3u8) is the best quality
      let m3u8Url = null;
      
      // Try to extract hls2 first (best quality, full URL)
      const hls2Match = deob.match(/"hls2"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
      if (hls2Match && hls2Match[1]) {
        m3u8Url = hls2Match[1];
        console.log("FileLions: Found HLS2 source");
      }
      
      // Fallback: find any m3u8 URL
      if (!m3u8Url) {
        const m3u8Match = deob.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
        if (m3u8Match) {
          m3u8Url = m3u8Match[0];
          console.log("FileLions: Found m3u8 (fallback)");
        }
      }
      
      if (m3u8Url) {
        const cleanUrl = m3u8Url.replace(/&amp;/g, "&");
        return {
          link: cleanUrl,
          headers: {
            "User-Agent": USER_AGENT,
            Referer: embedUrl,
          },
          type: "m3u8",
        };
      }

      console.error("FileLions: no m3u8 found in deobfuscated code");
      return null;
    } catch (deErr) {
      console.error("FileLions: deobfuscation API error", deErr);
      return null;
    }
  } catch (error) {
    console.error("FileLions extractor failed", error);
    return null;
  }
}
