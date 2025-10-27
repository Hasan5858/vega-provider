import { ProviderContext } from "./types";

type ExtractedStream = {
  link: string;
  headers?: Record<string, string>;
  type?: string;
};

const getOrigin = (input: string): string => {
  const match = input.match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1] : "https://streamtape.com";
};

/**
 * StreamTape Video Extractor
 * Extracts direct video links from StreamTape embed pages
 * Hosts: streamtape.com, streamta.pe, etc.
 */
export const extractStreamTape = async (
  url: string,
  axios: ProviderContext["axios"]
): Promise<ExtractedStream | null> => {
  try {
    const { data } = await axios.get(url, {
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
    });

    const html = data as string;
    
    // Try to extract video link from robotlink element or JavaScript
    const directMatch =
      html.match(/id="robotlink"[^>]*>([^<]+)</) ??
      html.match(/document\.getElementById\('robotlink'\)\.innerHTML\s*=\s*'([^']+)'/);

    if (!directMatch || !directMatch[1]) {
      console.warn("StreamTape extractor: Could not find video link");
      return null;
    }

    // Decode the extracted link
    const rawLink = directMatch[1]
      .replace(/\\u0026/g, "&")
      .replace(/&amp;/g, "&")
      .trim();

    // Normalize the URL
    const normalized =
      rawLink.startsWith("http") || rawLink.startsWith("https")
        ? rawLink
        : rawLink.startsWith("//")
        ? `https:${rawLink}`
        : rawLink.startsWith("/")
        ? `${getOrigin(url)}${rawLink}`
        : rawLink;

    // Ensure stream parameter is included
    const finalUrl =
      normalized.includes("&stream=") || normalized.includes("stream=")
        ? normalized
        : `${normalized}&stream=1`;

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
};
