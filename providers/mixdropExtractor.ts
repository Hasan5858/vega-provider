import { ProviderContext } from "./types";

type ExtractedStream = {
  link: string;
  headers?: Record<string, string>;
  type?: string;
};

const PACKED_EVAL_REGEX =
  /eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\([\s\S]*?\)\)/;

/**
 * Mixdrop Video Extractor
 * Extracts direct video links from Mixdrop embed pages
 * Hosts: mixdrop.co, mixdrop.to, etc.
 * 
 * This extractor unpacks obfuscated JavaScript to find the video URL
 */
export const extractMixdrop = async (
  mixdropUrl: string,
  axios: ProviderContext["axios"]
): Promise<ExtractedStream | null> => {
  try {
    // Convert /f/ URLs to /e/ embed URLs
    const embedUrl = mixdropUrl.replace("/f/", "/e/");
    
    const { data } = await axios.get(embedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Referer: mixdropUrl,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    // Find packed JavaScript eval function
    const match = data.match(PACKED_EVAL_REGEX);
    if (!match) {
      console.warn("Mixdrop extractor: Could not find packed JavaScript");
      return null;
    }

    let decoded: string;
    try {
      // Unpack the JavaScript by executing it
      const transformed = match[0].replace(/^eval\(/, "(") + ";";
      decoded = Function(`"use strict"; return ${transformed}`)();
    } catch (error) {
      console.error("Mixdrop extractor: Failed to unpack JavaScript", error);
      return null;
    }

    // Extract the video URL from unpacked code
    const wurl = decoded.match(/MDCore\\.wurl="([^"\n]+)"/);
    if (!wurl || !wurl[1]) {
      console.warn("Mixdrop extractor: Could not find wurl in unpacked code");
      return null;
    }

    // Normalize the URL
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
};
