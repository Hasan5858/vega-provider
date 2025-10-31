import { ProviderContext, Stream } from "../types";

const REQUEST_HEADERS = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Cache-Control": "no-store",
  "Accept-Language": "en-US,en;q=0.9",
  DNT: "1",
  "sec-ch-ua":
    '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};

const DEFAULT_STREAM_HEADERS = {
  Range: "bytes=0-",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};

const preferHostScore = (url: string) => {
  if (/googleusercontent\.com|googlevideo\.com|googleapis\.com/i.test(url)) {
    return 60;
  }
  if (/gofile\.io|gofilecdn\.com/i.test(url)) {
    return 110;
  }
  if (/filepress/i.test(url)) {
    return 90;
  }
  if (/hubcloud|hubcdn|cloudflarestorage/i.test(url)) {
    return 80;
  }
  if (/gdflix|resumecloud|resumebot|fastcdn/i.test(url)) {
    return 70;
  }
  return 10;
};

const inferTypeFromUrl = (url: string): Stream["type"] => {
  if (/\.m3u8($|\?|#)/i.test(url)) return "m3u8";
  if (/\.mkv($|\?|#)/i.test(url)) return "mkv";
  if (/\.mpd($|\?|#)/i.test(url)) return "mpd";
  if (/\.mp4($|\?|#)|googleusercontent\.com/i.test(url)) return "mp4";
  return "mp4";
};

const withDefaultHeaders = (stream: Stream): Stream => {
  const url = stream.link || "";
  const headers = { ...(stream.headers || {}) } as Record<string, string | undefined>;

  if (/googleusercontent\.com|googlevideo\.com|gofile\.io|gofilecdn\.com/i.test(url)) {
    headers.Range ??= DEFAULT_STREAM_HEADERS.Range;
    headers["User-Agent"] ??= DEFAULT_STREAM_HEADERS["User-Agent"];
  }

  if (/hubcloud|hubcdn|resume|pixel/i.test(url)) {
    headers.Range ??= DEFAULT_STREAM_HEADERS.Range;
    headers["User-Agent"] ??= DEFAULT_STREAM_HEADERS["User-Agent"];
  }

  Object.keys(headers).forEach((key) => {
    if (headers[key] === undefined || headers[key] === null) {
      delete headers[key];
    }
  });

  if (!Object.keys(headers).length) {
    return { ...stream, headers: undefined };
  }

  return { ...stream, headers: headers as Record<string, string> };
};

const normaliseStream = (
  raw: Stream,
  fallbackServer: string,
  referer?: string,
): Stream | null => {
  if (!raw?.link) return null;

  const link = raw.link.trim();
  if (!link) return null;

  const server = raw.server?.trim() || fallbackServer;
  const type = raw.type || inferTypeFromUrl(link);

  const normalised = {
    ...raw,
    server,
    link,
    type,
  };

  if (referer) {
    const headers = { ...(normalised.headers || {}) };
    headers.Referer ??= referer;
    normalised.headers = headers;
  }

  return withDefaultHeaders(normalised);
};

const dedupeStreams = (streams: Stream[]) => {
  const seen = new Set<string>();
  return streams.filter((item) => {
    const key = item.link;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export async function getStream({
  link,
  type,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}) {
  const { axios, cheerio, extractors } = providerContext;
  const { hubcloudExtracter } = extractors as any;
  const streamtapeExtractor = (extractors as any)
    .streamtapeExtractor as (
    u: string,
    a: any,
    s?: AbortSignal,
  ) => Promise<{ link: string; headers?: Record<string, string>; type?: string } | null>;
  const streamhgExtractor = (extractors as any)
    .streamhgExtractor as (
    u: string,
    a: any,
    s?: AbortSignal,
  ) => Promise<{ link: string; headers?: Record<string, string>; type?: string } | null>;
  const gdFlixExtracter = (extractors as any).gdFlixExtracter as (
    u: string,
    s?: AbortSignal,
  ) => Promise<Stream[]>;
  const filepresExtractor = (extractors as any).filepresExtractor as (
    u: string,
    s?: AbortSignal,
  ) => Promise<Stream[]>;
  const gofileExtracter = (extractors as any).gofileExtracter as (
    id: string,
  ) => Promise<{ link: string; token: string }>;
  try {
    console.log("[skyMovieHD] Incoming link:", link);
    let target = link;
    // Normalize StreamHG hglink -> dumbalag embed
    if (/hglink\.to\//i.test(target)) {
      try {
        const id = (target.match(/hglink\.to\/([A-Za-z0-9_-]{4,})/i) || [])[1];
        if (id) target = `https://dumbalag.com/e/${id}`;
      } catch {}
    }

    // howblogs aggregator - extract only supported servers (gofile, streamtape, voe)
    if (/howblogs\.xyz\//i.test(target)) {
      console.log("[skyMovieHD] 📥 Loading howblogs aggregator (SERVER 01):", target);
      try {
        const res = await axios.get(target, { signal, headers: REQUEST_HEADERS });
        const $ = cheerio.load(res.data || "");
        const anchors = $("a[href]").toArray();
        
        const collected: Stream[] = [];
        
        for (const anchor of anchors) {
          const hrefRaw = ($(anchor).attr("href") || "").trim();
          if (!hrefRaw) continue;
          
          const href = hrefRaw.startsWith("//") ? `https:${hrefRaw}` : hrefRaw;
          if (!/^https?:\/\//i.test(href)) continue;
          
          // Skip GoFile - causes parsing errors with MKV files
          if (/gofile\.io/i.test(href)) {
            console.log("[skyMovieHD] ⏭️ Skipping GoFile (causes parsing issues)");
            continue;
          }
          
          // StreamTape extraction
          if (/streamtape/i.test(href)) {
            try {
              console.log("[skyMovieHD] 🔗 Resolving StreamTape:", href);
              const st = await streamtapeExtractor(href, axios, signal);
              if (st) {
                const stream = normaliseStream(
                  {
                    server: "StreamTape",
                    link: st.link,
                    type: st.type || "mp4",
                    headers: st.headers,
                  },
                  "StreamTape",
                );
                if (stream) collected.push(stream);
              }
            } catch (error) {
              console.log("[skyMovieHD] ❌ StreamTape extraction failed:", error);
            }
            continue;
          }
          
          // VOE extraction
          if (/voe\.sx|voe\./i.test(href)) {
            try {
              console.log("[skyMovieHD] 🔗 Resolving VOE:", href);
              const voeExtractor = (extractors as any).voeExtractor as (
                u: string,
                s?: AbortSignal,
              ) => Promise<Stream[]>;
              
              if (typeof voeExtractor === "function") {
                const voeStreams = await voeExtractor(href, signal);
                console.log("[skyMovieHD] VOE result:", voeStreams?.length || 0, "streams");
                if (voeStreams && voeStreams.length > 0) {
                  voeStreams.forEach((voeStream) => {
                    if (voeStream?.link) {
                      const stream: Stream = {
                        server: "VOE",
                        link: voeStream.link,
                        type: voeStream.type || inferTypeFromUrl(voeStream.link) || "mp4",
                        headers: voeStream.headers || DEFAULT_STREAM_HEADERS,
                      };
                      collected.push(stream);
                      console.log("[skyMovieHD] ✅ VOE stream added:", stream.link.slice(0, 100));
                    }
                  });
                } else {
                  console.log("[skyMovieHD] ⚠️ VOE returned no streams");
                }
              }
            } catch (error) {
              console.log("[skyMovieHD] ❌ VOE extraction failed:", error);
            }
            continue;
          }
          
          // Indishare extraction
          if (/indishare\.info|indi-share\.com|indi-down/i.test(href)) {
            try {
              console.log("[skyMovieHD] 🔗 Resolving Indishare:", href);
              const indishareExtractor = (extractors as any).indishareExtractor as (
                u: string,
                a: any,
              ) => Promise<{ link: string; type?: string } | null>;
              
              if (typeof indishareExtractor === "function") {
                const indishareResult = await indishareExtractor(href, axios);
                if (indishareResult && indishareResult.link) {
                  const stream: Stream = {
                    server: "Indishare",
                    link: indishareResult.link,
                    type: indishareResult.type || inferTypeFromUrl(indishareResult.link) || "mkv",
                    headers: DEFAULT_STREAM_HEADERS,
                  };
                  collected.push(stream);
                  console.log("[skyMovieHD] ✅ Indishare stream added:", stream.link.slice(0, 100));
                } else {
                  console.log("[skyMovieHD] ⚠️ Indishare returned no stream");
                }
              }
            } catch (error) {
              console.log("[skyMovieHD] ❌ Indishare extraction failed:", error);
            }
            continue;
          }
        }
        
        const cleaned = dedupeStreams(collected);
        console.log("[skyMovieHD] ✅ Total streams extracted:", collected.length);
        console.log("[skyMovieHD] 📋 Servers:", cleaned.map(s => `${s.server} (${s.type})`).join(", "));
        return cleaned;
      } catch (error) {
        console.log("[skyMovieHD] ❌ Howblogs aggregator failed:", error);
        return [];
      }
    }

    // Prefer StreamHG
    if (/dumbalag\.com\//i.test(target) && typeof streamhgExtractor === "function") {
      const shg = await streamhgExtractor(target, axios, signal);
      if (shg) {
        const arr: Stream[] = [
          { server: "StreamHG", link: shg.link, type: shg.type || "m3u8", headers: shg.headers },
        ];
        return arr;
      }
    }

    // StreamTape family
    if (/streamtape|watchadsontape|tape/i.test(target) && typeof streamtapeExtractor === "function") {
      const st = await streamtapeExtractor(target, axios, signal);
      if (st) {
        const arr: Stream[] = [
          { server: "StreamTape", link: st.link, type: st.type || "mp4", headers: st.headers },
        ];
        return arr;
      }
    }

    // Fallback
    console.log("[skyMovieHD] ⚠️ Falling back to HubCloud extractor");
    const fallbackStreams = await hubcloudExtracter(target, signal);
    const cleanedFallback = dedupeStreams(
      fallbackStreams
        .map((stream: Stream) =>
          normaliseStream(
            {
              ...stream,
              server: stream.server || "HubCloud",
            },
            "HubCloud",
            target,
          ),
        )
        .filter(Boolean) as Stream[],
    );
    console.log(
      "[skyMovieHD] 🔄 Fallback streams:",
      cleanedFallback.map((item) => ({
        server: item.server,
        type: item.type,
        link: item.link?.slice(0, 120),
      })),
    );
    return cleanedFallback;
  } catch (error: any) {
    console.log("[skyMovieHD] ❌ getStream error:", error?.message || error);
    return [];
  }
}
