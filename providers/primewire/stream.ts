import { Stream, ProviderContext } from "../types";
import { decodeLinkKeys } from "./blowfish";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const QUALITY_MAP: Record<string, Stream["quality"]> = {
  quality_cam: "360",
  quality_ts: "480",
  quality_dvd: "720",
  quality_hd: "1080",
};

type CheerioInstance = any;

const randomAlphaNumeric = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const mapQuality = (className?: string): Stream["quality"] | undefined => {
  if (!className) {
    return undefined;
  }

  for (const token of className.split(" ")) {
    if (QUALITY_MAP[token]) {
      return QUALITY_MAP[token];
    }
  }

  return undefined;
};

async function handlePrimeSrcEmbed(
  url: string,
  axios: ProviderContext["axios"],
  cheerioModule: any
): Promise<Stream[]> {
  try {
    const embedRes = await axios.get(url);
    const $ = cheerioModule.load(embedRes.data);

    const streams: Stream[] = [];

    $('video source, source[src*=".mp4"], source[src*=".m3u8"]').each((index: number, el: any) => {
      const src = $(el).attr("src");
      if (!src) {
        return;
      }

      const absolute = src.startsWith("http") ? src : `https://primesrc.me${src}`;
      streams.push({
        server: `PrimeSrc ${index + 1}`,
        link: absolute,
        type: absolute.includes(".m3u8") ? "m3u8" : "mp4",
      });
    });

    if (streams.length === 0) {
      $('[data-src]').each((index: number, el: any) => {
        const src = $(el).attr("data-src");
        if (!src) {
          return;
        }

        if (src.includes(".mp4") || src.includes(".m3u8")) {
          const absolute = src.startsWith("http") ? src : `https://primesrc.me${src}`;
          streams.push({
            server: `PrimeSrc ${index + 1}`,
            link: absolute,
            type: absolute.includes(".m3u8") ? "m3u8" : "mp4",
          });
        }
      });
    }

    if (streams.length === 0) {
      streams.push({
        server: "PrimeSrc Embed",
        link: url,
        type: "iframe",
      });
    }

    return streams;
  } catch (error) {
    console.error("Failed to handle primesrc embed", error);
    return [];
  }
}

const extractMixdrop = async (
  mixdropUrl: string,
  axios: ProviderContext["axios"]
): Promise<{ link: string; headers: Record<string, string> } | null> => {
  try {
    const embedUrl = mixdropUrl.replace("/f/", "/e/");
    const { data } = await axios.get(embedUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: mixdropUrl,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Cache-Control": "no-cache",
        Pragma: "no-cache",
      },
    });

    const functionRegex = /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
    const match = functionRegex.exec(data);

    if (!match) {
      return null;
    }

    const encodedString = match[2];
    const header = encodedString.split(",'|MDCore|")[0].split(",");
    const base = Number(header[header.length - 1]);

    if (Number.isNaN(base)) {
      return null;
    }

    const splitMarker = `',${base},`;
    const [p, remainder] = encodedString.split(splitMarker);
    if (!p || !remainder) {
      return null;
    }

    const body = remainder.slice(2).split("|");
    const decode = function (
      payload: string,
      a: number,
      c: number,
      k: string[],
      e: (value: number) => string,
      d: Record<string, string>
    ) {
      e = function (index: number) {
        return index.toString(36);
      };

      if (!"".replace(/^/, String)) {
        while (c--) {
          d[c.toString(a)] = k[c] || c.toString(a);
        }
        k = [
          function (value: string) {
            return d[value];
          },
        ] as unknown as string[];
        e = function () {
          return "\\w+";
        } as unknown as (value: number) => string;
        c = 1;
      }

      while (c--) {
        if (k[c]) {
          const regex = new RegExp(`\\b${e(c)}\\b`, "g");
          payload = payload.replace(regex, k[c] as string);
        }
      }

      return payload;
    };

    const decoded = decode(p.trim(), base, body.length, body, (value) => value.toString(36), {});
    const wurl = decoded.match(/MDCore\.wurl="([^"]+)"/);

    if (!wurl || !wurl[1]) {
      return null;
    }

    const link = wurl[1].startsWith("http") ? wurl[1] : `https:${wurl[1]}`;

    return {
      link,
      headers: {
        "User-Agent": USER_AGENT,
        Referer: embedUrl,
      },
    };
  } catch (error) {
    console.error("Failed extracting Mixdrop stream", error);
    return null;
  }
};

const extractDoodStream = async (
  doodUrl: string,
  axios: ProviderContext["axios"]
): Promise<{ link: string; headers: Record<string, string> } | null> => {
  try {
    const url = new URL(doodUrl);
    const id = url.pathname.split("/").pop();
    if (!id) {
      return null;
    }

    const candidateHosts = Array.from(
      new Set([
        `${url.protocol}//${url.hostname}`,
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
            "User-Agent": USER_AGENT,
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
        continue;
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
        "User-Agent": USER_AGENT,
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
        "User-Agent": USER_AGENT,
        Referer: embedUrl,
      },
    };
  } catch (error) {
    console.error("Failed extracting Dood stream", error);
    return null;
  }
};

const extractStreamTape = async (
  streamTapeUrl: string,
  axios: ProviderContext["axios"]
): Promise<{ link: string; headers: Record<string, string> } | null> => {
  try {
    const { data } = await axios.get(streamTapeUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: streamTapeUrl,
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
        ? `https://${new URL(streamTapeUrl).hostname}${rawLink}`
        : rawLink;

    const finalUrl =
      normalized.includes("&stream=") || normalized.includes("stream=")
        ? normalized
        : `${normalized}&stream=1`;

    return {
      link: finalUrl,
      headers: {
        "User-Agent": USER_AGENT,
        Referer: streamTapeUrl,
      },
    };
  } catch (error) {
    console.error("Failed extracting StreamTape stream", error);
    return null;
  }
};

const resolveGoEntries = async (
  url: string,
  $: CheerioInstance,
  axios: ProviderContext["axios"]
): Promise<Stream[]> => {
  const baseUrl = new URL(url).origin;
  const linkKeys = decodeLinkKeys($("#user-data").attr("v") || "");

  const entries: Array<{
    index: number;
    fallbackKey: string | null;
    host: string;
    quality?: Stream["quality"];
  }> = [];

  $("a.go-link").each((_: number, element: any) => {
    const versionAttr = $(element).attr("link_version");
    if (!versionAttr) {
      return;
    }

    const index = Number(versionAttr);
    if (Number.isNaN(index)) {
      return;
    }

    const row = $(element).closest("tr");
    entries.push({
      index,
      fallbackKey: $(element).attr("key") || null,
      host: row.find(".version-host").text().trim(),
      quality: mapQuality(row.find(".link_version_quality span").attr("class") || undefined),
    });
  });

  if (!entries.length) {
    return [];
  }

  const results: Stream[] = [];

  for (const entry of entries) {
    const key = linkKeys[entry.index] || entry.fallbackKey;
    if (!key) {
      continue;
    }

    const goUrl = `${baseUrl}/links/go/${encodeURIComponent(key)}?embed=true`;

    let goData: any;
    try {
      const response = await axios.get(goUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          Referer: url,
          Accept: "application/json, text/plain, */*",
        },
      });

      goData = response.data;
    } catch (error) {
      console.error("Failed to fetch go endpoint", goUrl, error);
      continue;
    }

    const directLink =
      typeof goData === "string" ? goData : goData?.link || goData?.url || null;
    if (!directLink) {
      continue;
    }

    const hostLabel = (goData?.host || entry.host || "Primewire").trim();
    const host = hostLabel.toLowerCase();

    let extracted:
      | { link: string; headers?: Record<string, string>; type?: string }
      | null = null;

    if (directLink.includes("mixdrop") || host.includes("mixdrop")) {
      extracted = await extractMixdrop(directLink, axios);
      if (extracted) {
        extracted.type = extracted.type || "mp4";
      }
    } else if (directLink.includes("dood") || host.includes("dood")) {
      extracted = await extractDoodStream(directLink, axios);
      if (extracted) {
        extracted.type = extracted.type || "mp4";
      }
    } else if (
      directLink.includes("streamtape") ||
      directLink.includes("streamta") ||
      host.includes("streamtape")
    ) {
      extracted = await extractStreamTape(directLink, axios);
      if (extracted) {
        extracted.type = extracted.type || "mp4";
      }
    }

    if (extracted) {
      results.push({
        server: hostLabel,
        link: extracted.link,
        type: extracted.type || "mp4",
        quality: entry.quality,
        headers: extracted.headers,
      });
      continue;
    }

    const fallbackType = directLink.includes(".m3u8")
      ? "m3u8"
      : directLink.match(/\.(mp4|mkv|webm)(\?|$)/)
      ? "mp4"
      : "iframe";

    results.push({
      server: hostLabel,
      link: directLink,
      type: fallbackType,
      quality: entry.quality,
    });
  }

  return results;
};

export const getStream = async function ({
  link: url,
  type,
  providerContext,
}: {
  link: string;
  type: string;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  const { axios, cheerio } = providerContext;

  try {
    if (url.includes("primesrc.me")) {
      return await handlePrimeSrcEmbed(url, axios, cheerio);
    }

    const pageResponse = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const $ = cheerio.load(pageResponse.data);

    const decodedStreams = await resolveGoEntries(url, $, axios);
    if (decodedStreams.length) {
      return decodedStreams;
    }

    // Fallback: if nothing was decoded, try mixdrop legacy extraction
    const mixdropCandidates: Stream[] = [];
    $("a.embed-link").each((_: number, element: any) => {
      const href = $(element).attr("href") || "";
      if (href.includes("mixdrop")) {
        mixdropCandidates.push({
          server: "Mixdrop",
          link: href,
          type: "iframe",
        });
      }
    });

    if (mixdropCandidates.length) {
      const streams: Stream[] = [];
      for (const candidate of mixdropCandidates) {
        const extracted = await extractMixdrop(candidate.link, axios);
        if (extracted) {
          streams.push({
            server: candidate.server,
            link: extracted.link,
            type: "mp4",
            headers: extracted.headers,
          });
        }
      }
      if (streams.length) {
        return streams;
      }
    }

    return [];
  } catch (error) {
    console.error("Primewire getStream failed", error);
    return [];
  }
};
