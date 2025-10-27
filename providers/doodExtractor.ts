import { ProviderContext } from "./types";

type ExtractedStream = {
  link: string;
  headers?: Record<string, string>;
  type?: string;
};

const getLastPathSegment = (input: string): string => {
  const cleaned = input.split("?")[0];
  const segments = cleaned.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
};

const getOrigin = (input: string): string => {
  const match = input.match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1] : "https://dood.la";
};

const randomAlphaNumeric = (length: number): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * DoodStream Video Extractor
 * Extracts direct video links from DoodStream embed pages
 * Hosts: dood.la, dood.ws, dood.cx, dsvplay.com, etc.
 * 
 * This extractor tries multiple known DoodStream hosts to find working streams
 */
export const extractDood = async (
  url: string,
  axios: ProviderContext["axios"]
): Promise<ExtractedStream | null> => {
  try {
    // Extract video ID from URL
    const id = getLastPathSegment(url);
    if (!id) {
      console.warn("Dood extractor: Could not extract video ID from URL");
      return null;
    }

    // List of known DoodStream hosts to try
    const candidateHosts = Array.from(
      new Set([
        getOrigin(url),
        "https://dsvplay.com",
        "https://dood.la",
        "https://dood.ws",
        "https://dood.cx",
      ])
    );

    let embedHtml: string | null = null;
    let activeHost: string | null = null;

    // Try each host until one works
    for (const host of candidateHosts) {
      const embedUrl = `${host}/e/${id}`;
      try {
        const { data } = await axios.get(embedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
            Referer: `${host}/d/${id}`,
            Accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "Cache-Control": "no-cache",
            Pragma: "no-cache",
          },
        });
        embedHtml = data;
        activeHost = host;
        break;
      } catch {
        // Continue to next host
      }
    }

    if (!embedHtml || !activeHost) {
      console.warn("Dood extractor: Could not fetch embed page from any host");
      return null;
    }

    // Extract pass_md5 path and token from embed HTML
    const passMatch = embedHtml.match(/\/pass_md5\/([^'"\n]+)/);
    const tokenMatch = embedHtml.match(/token=([a-z0-9]+)/i);

    if (!passMatch || !tokenMatch) {
      console.warn("Dood extractor: Could not find pass_md5 or token in embed page");
      return null;
    }

    const embedUrl = `${activeHost}/e/${id}`;
    const passUrl = `${activeHost}/pass_md5/${passMatch[1]}`;
    
    // Fetch the base stream URL
    const response = await axios.get(passUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Referer: embedUrl,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    const baseStream = typeof response.data === "string" ? response.data : null;
    if (!baseStream) {
      console.warn("Dood extractor: Invalid response from pass_md5 endpoint");
      return null;
    }

    // Build final stream URL with random string, token, and expiry
    const token = tokenMatch[1];
    const finalUrl = `${baseStream}${randomAlphaNumeric(10)}?token=${token}&expiry=${Date.now()}`;

    return {
      link: finalUrl,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
        Referer: embedUrl,
      },
      type: "mp4",
    };
  } catch (error) {
    console.error("Dood extractor failed", error);
    return null;
  }
};
