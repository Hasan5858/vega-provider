import axios from "axios";

const getOrigin = (input: string): string => {
  const match = input.match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1] : "https://dood.watch";
};

const getLastPathSegment = (input: string): string => {
  const cleaned = input.split("?")[0];
  const segments = cleaned.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
};

const randomAlphaNumeric = (length: number) => {
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
 * 
 * DoodStream uses multiple mirror hosts and requires:
 * 1. Finding the correct working host
 * 2. Extracting pass_md5 and token from HTML
 * 3. Fetching the base stream URL
 * 4. Constructing final URL with random string, token, and expiry
 * 
 * @param url - DoodStream embed URL (e.g., https://dood.watch/e/xxx)
 * @param axiosInstance - Axios instance to use for requests
 * @param signal - AbortSignal for request cancellation
 * @returns Object with video link and headers, or null if extraction fails
 */
export async function doodExtractor(
  url: string,
  axiosInstance: any = axios,
  signal?: AbortSignal
): Promise<{
  link: string;
  headers?: Record<string, string>;
  type?: string;
} | null> {
  try {
    const id = getLastPathSegment(url);
    if (!id) {
      return null;
    }

    // Try multiple DoodStream hosts
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

    // Find a working host
    for (const host of candidateHosts) {
      const embedUrl = `${host}/e/${id}`;
      try {
        const { data } = await axiosInstance.get(embedUrl, {
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
          signal,
        });
        embedHtml = data;
        activeHost = host;
        break;
      } catch {
        // Try next host
      }
    }

    if (!embedHtml || !activeHost) {
      return null;
    }

    // Extract pass_md5 path and token from HTML
    const passMatch = embedHtml.match(/\/pass_md5\/([^'"\n]+)/);
    const tokenMatch = embedHtml.match(/token=([a-z0-9]+)/i);

    if (!passMatch || !tokenMatch) {
      return null;
    }

    const embedUrl = `${activeHost}/e/${id}`;
    const passUrl = `${activeHost}/pass_md5/${passMatch[1]}`;
    
    // Get the base stream URL
    const response = await axiosInstance.get(passUrl, {
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
      signal,
    });

    const baseStream = typeof response.data === "string" ? response.data : null;
    if (!baseStream) {
      return null;
    }

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
}
