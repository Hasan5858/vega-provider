import axios from "axios";

const PACKED_EVAL_REGEX =
  /eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\([\s\S]*?\)\)/;

/**
 * Mixdrop Video Extractor
 * Extracts direct video links from Mixdrop embed pages
 * 
 * Mixdrop obfuscates video URLs using packed JavaScript (eval function).
 * This extractor:
 * 1. Fetches the embed page
 * 2. Finds the packed eval() JavaScript
 * 3. Executes it to unpack the code
 * 4. Extracts MDCore.wurl (the video URL)
 * 
 * @param url - Mixdrop embed URL (e.g., https://mixdrop.ag/e/xxx or /f/xxx)
 * @param axiosInstance - Axios instance to use for requests
 * @param signal - AbortSignal for request cancellation
 * @returns Object with video link and headers, or null if extraction fails
 */
export async function mixdropExtractor(
  url: string,
  axiosInstance: any = axios,
  signal?: AbortSignal
): Promise<{
  link: string;
  headers?: Record<string, string>;
  type?: string;
} | null> {
  try {
    // Mixdrop uses /f/ for file links and /e/ for embed - normalize to /e/
    const embedUrl = url.replace("/f/", "/e/");
    
    const { data } = await axiosInstance.get(embedUrl, {
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
      timeout: 30000,
      signal,
    });

    // Find the packed eval() code
    const match = data.match(PACKED_EVAL_REGEX);
    if (!match) {
      return null;
    }

    // Unpack the JavaScript by executing it
    let decoded: string;
    try {
      const transformed = match[0].replace(/^eval\(/, "(") + ";";
      decoded = Function(`"use strict"; return ${transformed}`)();
    } catch (error) {
      console.error("Mixdrop extractor: unpack failed", error);
      return null;
    }

    // Extract the video URL from MDCore.wurl
    const wurl = decoded.match(/MDCore\.wurl="([^"\n]+)"/);
    if (!wurl || !wurl[1]) {
      return null;
    }

    // Normalize URL (add https: if protocol-relative)
    const link = wurl[1].startsWith("http") ? wurl[1] : `https:${wurl[1]}`;
    
    return {
      link,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Referer: embedUrl,
      },
      type: "mp4",
    };
  } catch (error) {
    console.error("Mixdrop extractor failed", error);
    return null;
  }
}
