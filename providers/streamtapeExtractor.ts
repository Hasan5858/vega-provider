import axios from "axios";

const getOrigin = (input: string): string => {
  const match = input.match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1] : "https://streamta.site";
};

/**
 * StreamTape Video Extractor
 * Extracts direct video links from StreamTape embed pages by parsing obfuscated JavaScript
 * 
 * The extractor handles StreamTape's JavaScript obfuscation which manipulates the robotlink
 * element's innerHTML using substring operations to hide the actual video URL.
 * 
 * @param url - StreamTape embed URL (e.g., https://streamta.site/e/xxx)
 * @param axiosInstance - Axios instance to use for requests (defaults to imported axios)
 * @param signal - AbortSignal for request cancellation
 * @returns Object with video link and headers, or null if extraction fails
 */
export async function streamtapeExtractor(
  url: string,
  axiosInstance: any = axios,
  signal?: AbortSignal
): Promise<{
  link: string;
  headers?: Record<string, string>;
  type?: string;
} | null> {
  try {
    console.log(`StreamTape: Fetching embed page: ${url}`);
    const { data } = await axiosInstance.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Referer: url,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
      signal,
    });

    const html = data as string;
    
    // Extract the JavaScript-manipulated robotlink value
    // The page uses: document.getElementById('robotlink').innerHTML = '//streamta.site/get_video?id='+ ('xcdpkyXZVbyAJHrOKq...').substring(2).substring(1);
    const robotlinkMatch = html.match(/getElementById\('robotlink'\)\.innerHTML\s*=\s*'([^']+)'\s*\+\s*\('([^']+)'\)\.substring\((\d+)\)(?:\.substring\((\d+)\))?/);
    
    let rawLink = "";
    
    if (robotlinkMatch) {
      // Parse the JavaScript manipulation
      const prefix = robotlinkMatch[1]; // e.g., "//streamta.site/get_video?id="
      const mangledString = robotlinkMatch[2]; // e.g., "xcdpkyXZVbyAJHrOKq..."
      const firstSubstring = parseInt(robotlinkMatch[3]);
      const secondSubstring = robotlinkMatch[4] ? parseInt(robotlinkMatch[4]) : 0;
      
      // Apply substring operations
      let processed = mangledString.substring(firstSubstring);
      if (secondSubstring > 0) {
        processed = processed.substring(secondSubstring);
      }
      
      rawLink = prefix + processed;
      console.log(`StreamTape: Parsed JavaScript manipulation: ${rawLink}`);
    } else {
      // Fallback to direct extraction
      let directMatch = html.match(/id="robotlink"[^>]*>([^<]+)</);
      if (!directMatch) {
        directMatch = html.match(/document\.getElementById\('robotlink'\)\.innerHTML\s*=\s*'([^']+)'/);
      }
      if (!directMatch) {
        directMatch = html.match(/'robotlink'\)\.innerHTML\s*=\s*'([^']+)'/);
      }

      if (!directMatch || !directMatch[1]) {
        console.warn("StreamTape: Could not find video link in page");
        return null;
      }

      rawLink = directMatch[1];
      console.log(`StreamTape: Extracted from HTML: ${rawLink}`);
    }

    rawLink = rawLink
      .replace(/\\u0026/g, "&")
      .replace(/&amp;/g, "&")
      .trim();

    console.log(`StreamTape: Cleaned link: ${rawLink}`);

    // Handle different URL formats
    let normalized: string;
    if (rawLink.startsWith("http") || rawLink.startsWith("https")) {
      // Already a complete URL
      normalized = rawLink;
    } else if (rawLink.startsWith("//")) {
      // Protocol-relative URL
      normalized = `https:${rawLink}`;
    } else if (rawLink.startsWith("/")) {
      // Normal path, prepend origin
      normalized = `${getOrigin(url)}${rawLink}`;
    } else {
      // Relative path
      normalized = `${getOrigin(url)}/${rawLink}`;
    }

    const finalUrl =
      normalized.includes("&stream=") || normalized.includes("stream=")
        ? normalized
        : `${normalized}&stream=1`;

    console.log(`StreamTape: Final URL: ${finalUrl}`);

    return {
      link: finalUrl,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Referer: url,
      },
      type: "mp4",
    };
  } catch (error) {
    console.error("StreamTape extractor failed", error);
    return null;
  }
}
