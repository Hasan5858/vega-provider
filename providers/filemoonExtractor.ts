import { AxiosStatic } from "axios";
import { Stream } from "./types";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

/**
 * FileMoon extractor
 * - Fetch embed page to extract iframe src URL (e.g., ico3c.com/bkg/...)
 * - Fetch iframe page to get eval(...) obfuscated JS
 * - Send eval string to deobfuscation API
 * - Extract .m3u8 link from deobfuscated code (prioritize hls2)
 */
export async function filemoonExtractor(
  url: string,
  axios: AxiosStatic,
  signal?: AbortSignal
): Promise<{ link: string; headers?: Record<string, string>; type?: string } | null> {
  try {
    // Step 1: Extract ID and construct embed URL
    const idMatch = url.match(/\/e\/([A-Za-z0-9_-]+)/i);
    const id = idMatch ? idMatch[1] : null;
    if (!id) {
      console.error("FileMoon: failed to parse id from url", url);
      return null;
    }

    const embedUrl = `https://filemoon.sx/e/${id}`;
    console.log(`FileMoon: Fetching embed page: ${embedUrl}`);

    // Step 2: Fetch embed page to extract iframe src
    const embedRes = await axios.get(embedUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: url,
      },
      responseType: "text",
      signal,
    });

    const embedHtml: string = embedRes.data || "";

    // Extract iframe src URL (e.g., https://ico3c.com/bkg/grhfx3vyteyu)
    const iframeMatch = embedHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);
    if (!iframeMatch || !iframeMatch[1]) {
      console.error("FileMoon: no iframe src found in embed page");
      return null;
    }

    const iframeSrc = iframeMatch[1];
    console.log(`FileMoon: Found iframe src: ${iframeSrc}`);

    // Step 3: Fetch iframe page to get eval code
    const iframeRes = await axios.get(iframeSrc, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: embedUrl,
      },
      responseType: "text",
      signal,
    });

    const iframeHtml: string = iframeRes.data || "";

    // Step 4: Extract the complete eval() packed code without <script> tags
    // Pattern: eval(function(p,a,c,k,e,d){...}('...'.split('|')))
    const evalPattern = /eval\(function\(p,a,c,k,e,d\)[\s\S]+?\.split\('\|'\)\)\)/;
    const evalMatch = iframeHtml.match(evalPattern);

    if (!evalMatch) {
      console.error("FileMoon: no eval code found in iframe page");
      // Try direct m3u8 as fallback
      const directM3u8 = iframeHtml.match(/https?:\/\/[^\s"']+\.m3u8[^\s"']*/i);
      if (directM3u8) {
        return {
          link: directM3u8[0].replace(/&amp;/g, "&"),
          headers: {
            "User-Agent": USER_AGENT,
            Referer: iframeSrc,
          },
          type: "m3u8",
        };
      }
      return null;
    }

    const evalCode = evalMatch[0];
    console.log(`FileMoon: Extracted eval code (${evalCode.length} chars)`);

    // Step 5: Call external deobfuscation API
    try {
      const apiResp = await axios.post(
        "https://js-deobfuscator-api.replit.app/api/deobfuscate",
        { code: evalCode },
        { headers: { "Content-Type": "application/json" }, timeout: 15000 }
      );

      const data = apiResp.data || {};
      if (!data.success || !data.result) {
        console.error("FileMoon: deobfuscation API failed", data.error || data);
        return null;
      }

      const deob = String(data.result);

      // Step 6: Extract m3u8 with priority to hls2
      let m3u8Url = null;

      // Try to extract hls2 first (best quality, full URL)
      const hls2Match = deob.match(/"hls2"\s*:\s*"([^"]+\.m3u8[^"]*)"/i);
      if (hls2Match && hls2Match[1]) {
        m3u8Url = hls2Match[1];
        console.log("FileMoon: Found HLS2 source");
      }

      // Fallback: find any m3u8 URL
      if (!m3u8Url) {
        const m3u8Match = deob.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
        if (m3u8Match) {
          m3u8Url = m3u8Match[0];
          console.log("FileMoon: Found m3u8 (fallback)");
        }
      }

      if (m3u8Url) {
        const cleanUrl = m3u8Url.replace(/&amp;/g, "&");
        return {
          link: cleanUrl,
          headers: {
            "User-Agent": USER_AGENT,
            Referer: iframeSrc,
          },
          type: "m3u8",
        };
      }

      console.error("FileMoon: no m3u8 found in deobfuscated code");
      return null;
    } catch (deErr) {
      console.error("FileMoon: deobfuscation API error", deErr);
      return null;
    }
  } catch (error) {
    console.error("FileMoon extractor failed", error);
    return null;
  }
}
