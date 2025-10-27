import type { ProviderContext } from "../types";

export type ExtractedStream = {
  link: string;
  headers?: Record<string, string>;
  type?: string;
};

type Extractor = (
  url: string,
  axios: ProviderContext["axios"]
) => Promise<ExtractedStream | null>;

const normalizeHost = (value: string) => value.toLowerCase();

const randomAlphaNumeric = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const getOrigin = (input: string): string => {
  const match = input.match(/^(https?:\/\/[^/]+)/i);
  return match ? match[1] : "https://www.primewire.mov";
};

const getLastPathSegment = (input: string): string => {
  const cleaned = input.split("?")[0];
  const segments = cleaned.split("/").filter(Boolean);
  return segments[segments.length - 1] || "";
};

const PACKED_EVAL_REGEX =
  /eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\([\s\S]*?\)\)/;

const extractMixdrop: Extractor = async (mixdropUrl, axios) => {
  try {
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

    const match = data.match(PACKED_EVAL_REGEX);
    if (!match) {
      return null;
    }

    let decoded: string;
    try {
      const transformed = match[0].replace(/^eval\(/, "(") + ";";
      decoded = Function(`"use strict"; return ${transformed}`)();
    } catch (error) {
      console.error("Primewire extractor (Mixdrop) unpack failed", error);
      return null;
    }

    const wurl = decoded.match(/MDCore\.wurl="([^\"]+)"/);
    if (!wurl || !wurl[1]) {
      return null;
    }

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
    console.error("Primewire extractor (Mixdrop) failed", error);
    return null;
  }
};

const extractDood: Extractor = async (url, axios) => {
  try {
    const id = getLastPathSegment(url);
    if (!id) {
      return null;
    }

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
        // try next host
      }
    }

    if (!embedHtml || !activeHost) {
      return null;
    }

    const passMatch = embedHtml.match(/\/pass_md5\/([^'\"]+)/);
    const tokenMatch = embedHtml.match(/token=([a-z0-9]+)/i);

    if (!passMatch || !tokenMatch) {
      return null;
    }

    const embedUrl = `${activeHost}/e/${id}`;
    const passUrl = `${activeHost}/pass_md5/${passMatch[1]}`;
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
    console.error("Primewire extractor (Dood) failed", error);
    return null;
  }
};

const extractStreamTape: Extractor = async (url, axios) => {
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
    const directMatch =
      html.match(/id="robotlink"[^>]*>([^<]+)</) ??
      html.match(/document\.getElementById\('robotlink'\)\.innerHTML\s*=\s*'([^']+)'/);

    if (!directMatch || !directMatch[1]) {
      return null;
    }

    const rawLink = directMatch[1]
      .replace(/\\u0026/g, "&")
      .replace(/&amp;/g, "&")
      .trim();

    const normalized =
      rawLink.startsWith("http") || rawLink.startsWith("https")
        ? rawLink
        : rawLink.startsWith("//")
        ? `https:${rawLink}`
        : rawLink.startsWith("/")
        ? `${getOrigin(url)}${rawLink}`
        : rawLink;

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
    console.error("Primewire extractor (StreamTape) failed", error);
    return null;
  }
};

const HOST_EXTRACTORS: Array<{
  match: (link: string, host: string) => boolean;
  extractor: Extractor;
}> = [
  {
    match: (link, host) =>
      normalizeHost(host).includes("mixdrop") || link.includes("mixdrop"),
    extractor: extractMixdrop,
  },
  {
    match: (link, host) =>
      normalizeHost(host).includes("dood") || link.includes("dood"),
    extractor: extractDood,
  },
  {
    match: (link, host) =>
      normalizeHost(host).includes("streamtape") ||
      link.includes("streamtape") ||
      link.includes("streamta"),
    extractor: extractStreamTape,
  },
];

export const extractStreamForHost = async (
  hostLabel: string,
  directLink: string,
  axios: ProviderContext["axios"]
): Promise<ExtractedStream | null> => {
  const host = normalizeHost(hostLabel);
  for (const { match, extractor } of HOST_EXTRACTORS) {
    if (match(directLink, host)) {
      return extractor(directLink, axios);
    }
  }
  return null;
};
