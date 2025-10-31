import { ProviderContext, Stream } from "../types";

type ExtractedStream = {
  link: string;
  headers?: Record<string, string>;
  type?: string;
};

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

/**
 * Check if a host has a working extractor
 */
const hasExtractor = (href: string): boolean => {
  if (/indishare\.info/i.test(href)) return true;
  // DISABLED: React Native axios doesn't support Range header in POST redirects
  // if (/uptomega\.net/i.test(href)) return true;
  if (/uploadhub\.dad/i.test(href)) return true;
  if (/streamtape/i.test(href)) return true;
  if (/voe\.sx/i.test(href)) return true;
  if (/dumbalag\.com|hglink\.to/i.test(href)) return true; // StreamHG
  if (/dood/i.test(href)) return true; // Dood
  if (/mixdrop/i.test(href)) return true; // Mixdrop
  if (/gofile\.io/i.test(href)) return true; // GoFile
  return false;
};

/**
 * Extract server name from URL
 */
const getServerName = (href: string): string => {
  if (/indishare\.info/i.test(href)) return "Indishare";
  // DISABLED: if (/uptomega\.net/i.test(href)) return "Uptomega";
  if (/uploadhub\.dad/i.test(href)) return "Uploadhub";
  if (/streamtape/i.test(href)) return "StreamTape";
  if (/voe\.sx/i.test(href)) return "VOE";
  if (/dumbalag\.com|hglink\.to/i.test(href)) return "StreamHG";
  if (/dood/i.test(href)) return "Dood";
  if (/mixdrop/i.test(href)) return "Mixdrop";
  if (/gofile\.io/i.test(href)) return "GoFile";
  return "Unknown";
};

/**
 * Extract stream for a specific host/server
 * On-demand extraction routing
 */
const extractStreamForHost = async (
  href: string,
  axios: ProviderContext["axios"],
  providerContext: ProviderContext,
  signal?: AbortSignal
): Promise<ExtractedStream | null> => {
  const { extractors } = providerContext;
  
  try {
    // Indishare
    if (/indishare\.info/i.test(href)) {
      const indishareExtractor = (extractors as any).indishareExtractor as (
        url: string,
        axios: any
      ) => Promise<ExtractedStream | null>;
      if (typeof indishareExtractor === "function") {
        return await indishareExtractor(href, axios);
      }
    }
    
    // DISABLED: Uptomega - React Native axios doesn't support Range header in POST redirects
    // This causes "Network Error" that cannot be caught properly in RN environment
    // if (/uptomega\.net/i.test(href)) {
    //   const uptomegaExtractor = (extractors as any).uptomegaExtractor as (
    //     url: string,
    //     axios: any,
    //     signal?: AbortSignal
    //   ) => Promise<ExtractedStream | null>;
    //   if (typeof uptomegaExtractor === "function") {
    //     return await uptomegaExtractor(href, axios, signal);
    //   }
    // }
    
    // Uploadhub
    if (/uploadhub\.dad/i.test(href)) {
      const uploadhubExtractor = (extractors as any).uploadhubExtractor as (
        url: string,
        axios: any
      ) => Promise<ExtractedStream | null>;
      if (typeof uploadhubExtractor === "function") {
        return await uploadhubExtractor(href, axios);
      }
    }
    
    // StreamTape
    if (/streamtape/i.test(href)) {
      const streamtapeExtractor = (extractors as any).streamtapeExtractor as (
        url: string,
        axios: any,
        signal?: AbortSignal
      ) => Promise<ExtractedStream | null>;
      if (typeof streamtapeExtractor === "function") {
        return await streamtapeExtractor(href, axios, signal);
      }
    }
    
    // VOE
    if (/voe\.sx/i.test(href)) {
      const voeExtractor = (extractors as any).voeExtractor as (
        url: string
      ) => Promise<Stream[]>;
      if (typeof voeExtractor === "function") {
        const streams = await voeExtractor(href);
        if (streams && streams.length > 0) {
          return {
            link: streams[0].link,
            type: streams[0].type,
            headers: streams[0].headers,
          };
        }
      }
    }
    
    // StreamHG (dumbalag/hglink)
    if (/dumbalag\.com|hglink\.to/i.test(href)) {
      const streamhgExtractor = (extractors as any).streamhgExtractor as (
        url: string,
        axios: any,
        signal?: AbortSignal
      ) => Promise<ExtractedStream | null>;
      if (typeof streamhgExtractor === "function") {
        return await streamhgExtractor(href, axios, signal);
      }
    }
    
    // Dood
    if (/dood/i.test(href)) {
      const doodExtractor = (extractors as any).doodExtractor as (
        url: string,
        axios: any
      ) => Promise<Stream[]>;
      if (typeof doodExtractor === "function") {
        const streams = await doodExtractor(href, axios);
        if (streams && streams.length > 0) {
          return {
            link: streams[0].link,
            type: streams[0].type,
            headers: streams[0].headers,
          };
        }
      }
    }
    
    // Mixdrop
    if (/mixdrop/i.test(href)) {
      const mixdropExtractor = (extractors as any).mixdropExtractor as (
        url: string,
        axios: any
      ) => Promise<Stream[]>;
      if (typeof mixdropExtractor === "function") {
        const streams = await mixdropExtractor(href, axios);
        if (streams && streams.length > 0) {
          return {
            link: streams[0].link,
            type: streams[0].type,
            headers: streams[0].headers,
          };
        }
      }
    }
    
    // GoFile
    if (/gofile\.io/i.test(href)) {
      const gofileExtracter = (extractors as any).gofileExtracter as (
        id: string
      ) => Promise<{ link: string; token: string }>;
      if (typeof gofileExtracter === "function") {
        // Extract GoFile ID from URL (e.g., https://gofile.io/d/abc123 -> abc123)
        const idMatch = href.match(/gofile\.io\/d\/([a-zA-Z0-9]+)/);
        if (idMatch && idMatch[1]) {
          const result = await gofileExtracter(idMatch[1]);
          if (result && result.link) {
            return {
              link: result.link,
              type: "mkv",
              headers: {
                "Cookie": `accountToken=${result.token}`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
              },
            };
          }
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error(`[skyMovieHD] Extraction error for ${getServerName(href)}:`, error);
    return null;
  }
};

/**
 * Extract a single skyMovieHD server on-demand (lazy extraction)
 * Used when user selects a lazy-loaded server from the player
 */
export const extractLazyServer = async function ({
  link,
  signal,
  providerContext,
}: {
  link: string;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  const { axios } = providerContext;

  try {
    // Parse lazy-load metadata
    const metadata = JSON.parse(link);
    
    if (metadata.type !== "skymovie-lazy") {
      console.error("[skyMovieHD] ❌ Invalid lazy-load metadata, expected type 'skymovie-lazy'");
      return [];
    }

    console.log(`[skyMovieHD] 🔄 On-demand extraction for ${metadata.serverName}: ${metadata.href}`);
    
    // Add timeout wrapper for extraction (45 seconds max to account for slow networks)
    const extractionPromise = extractStreamForHost(metadata.href, axios, providerContext, signal);
    const timeoutPromise = new Promise<null>((resolve) => {
      setTimeout(() => {
        console.log(`[skyMovieHD] ⏱️ Extraction timeout for ${metadata.serverName} after 45 seconds`);
        resolve(null);
      }, 45000);
    });
    
    const extracted = await Promise.race([extractionPromise, timeoutPromise]);
    
    if (extracted) {
      console.log(`[skyMovieHD] ✅ Successfully extracted ${metadata.serverName}`);
      
      // Verify the link is valid before returning
      if (!extracted.link || extracted.link.trim().length === 0) {
        console.error(`[skyMovieHD] ❌ ${metadata.serverName} returned empty link`);
        return [];
      }
      
      return [{
        server: metadata.serverName,
        link: extracted.link,
        type: extracted.type || "mkv",
        headers: extracted.headers,
      }];
    }
    
    console.error(`[skyMovieHD] ❌ Extraction failed for ${metadata.serverName} - No stream returned or timeout`);
    return [];
  } catch (error: any) {
    const serverName = (() => {
      try {
        return JSON.parse(link).serverName;
      } catch {
        return "Unknown";
      }
    })();
    console.error(`[skyMovieHD] ❌ Lazy-load extraction error for ${serverName}:`, error?.message || error);
    return [];
  }
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
    
    // Check if this is a lazy-load request (app should call extractLazyServer but might call getStream)
    try {
      const parsed = JSON.parse(link);
      if (parsed.type === "skymovie-lazy") {
        console.log("[skyMovieHD] 🔄 Detected lazy-load metadata, delegating to extractLazyServer");
        return await extractLazyServer({ link, signal, providerContext });
      }
    } catch {
      // Not JSON or not lazy metadata, continue with normal flow
    }
    
    let target = link;
    
    // Check if target contains SERVER 01 URL (we only extract from SERVER 01, skip WATCH ONLINE)
    let aggregatorUrls: string[] = [];
    
    try {
      const parsed = JSON.parse(target);
      if (parsed.server01) {
        aggregatorUrls = [parsed.server01];
        console.log("[skyMovieHD] 📥 Loading SERVER 01 aggregator (skipping WATCH ONLINE)");
      }
    } catch {
      // Not JSON, check if it's a direct aggregator URL
      if (/howblogs\.xyz\//i.test(target)) {
        aggregatorUrls = [target];
        console.log(`[skyMovieHD] 📥 Loading SERVER 01 aggregator`);
      }
    }
    
    // Process aggregator URLs (SERVER 01 and/or WATCH ONLINE)
    if (aggregatorUrls.length > 0) {
      try {
        const collected: Stream[] = [];
        let attemptedCount = 0; // Count of extraction attempts, not successes
        let successCount = 0; // Count of successful extractions
        const MAX_EAGER_EXTRACTIONS = 1; // Extract only 1 server immediately, rest as lazy-load
        const seenServers = new Set<string>(); // Dedupe across both pages
        
        // Fetch and process SERVER 01 aggregator page
        for (const aggUrl of aggregatorUrls) {
          try {
            console.log(`[skyMovieHD] � Fetching SERVER 01 aggregator page: ${aggUrl}`);
            const res = await axios.get(aggUrl, { signal, headers: REQUEST_HEADERS });
            const $ = cheerio.load(res.data || "");
            const anchors = $("a[href]").toArray();
            console.log(`[skyMovieHD] 📊 Found ${anchors.length} total links on page`);
            
            let linksWithExtractor = 0;
            let linksProcessed = 0;
            
            for (const anchor of anchors) {
              const hrefRaw = ($(anchor).attr("href") || "").trim();
              if (!hrefRaw) continue;
              
              const href = hrefRaw.startsWith("//") ? `https:${hrefRaw}` : hrefRaw;
              if (!/^https?:\/\//i.test(href)) continue;
              
              // Check if host has extractor
              if (!hasExtractor(href)) {
                linksProcessed++;
                continue;
              }
              
              linksWithExtractor++;
              const serverName = getServerName(href);
              
              // Skip if we've already seen this server
              if (seenServers.has(serverName)) {
                console.log(`[skyMovieHD] ⏭️ Skipping duplicate ${serverName}`);
                continue;
              }
              seenServers.add(serverName);
              
              // Attempt first MAX_EAGER_EXTRACTIONS servers immediately
              if (attemptedCount < MAX_EAGER_EXTRACTIONS) {
                attemptedCount++; // Increment regardless of success
                try {
                  console.log(`[skyMovieHD] 🔗 Resolving ${serverName}:`, href);
                  const extracted = await extractStreamForHost(href, axios, providerContext, signal);
                  
                  if (extracted) {
                    const stream = normaliseStream(
                      {
                        server: serverName,
                        link: extracted.link,
                        type: extracted.type || "mkv",
                        headers: extracted.headers,
                      },
                      serverName,
                    );
                    if (stream) {
                      collected.push(stream);
                      console.log(`[skyMovieHD] ✅ ${serverName} stream added:`, stream.link.slice(0, 100));
                      successCount++;
                    } else {
                      // If normalization failed, add as lazy-load for retry
                      console.log(`[skyMovieHD] 💤 Normalization failed for ${serverName}, adding as lazy-load`);
                      collected.push({
                        server: serverName,
                        link: JSON.stringify({
                          type: "skymovie-lazy",
                          serverName: serverName,
                          href: href,
                        }),
                        type: "lazy",
                      });
                    }
                  } else {
                    // If extraction returned null, add as lazy-load for retry
                    console.log(`[skyMovieHD] 💤 Extraction returned null for ${serverName}, adding as lazy-load`);
                    collected.push({
                      server: serverName,
                      link: JSON.stringify({
                        type: "skymovie-lazy",
                        serverName: serverName,
                        href: href,
                      }),
                      type: "lazy",
                    });
                  }
                } catch (error) {
                  // If extraction failed with error, add as lazy-load for retry
                  console.log(`[skyMovieHD] ❌ ${serverName} extraction failed, adding as lazy-load:`, error);
                  collected.push({
                    server: serverName,
                    link: JSON.stringify({
                      type: "skymovie-lazy",
                      serverName: serverName,
                      href: href,
                    }),
                    type: "lazy",
                  });
                }
              } else {
                // Add remaining servers as lazy-load
                console.log(`[skyMovieHD] 💤 Adding ${serverName} as lazy-load`);
                collected.push({
                  server: serverName,
                  link: JSON.stringify({
                    type: "skymovie-lazy",
                    serverName: serverName,
                    href: href,
                  }),
                  type: "lazy",
                });
              }
            }
            
            console.log(`[skyMovieHD] 📊 Aggregator stats: ${linksProcessed} links processed, ${linksWithExtractor} with extractors, ${seenServers.size} unique servers found so far`);
          } catch (error) {
            console.log(`[skyMovieHD] ⚠️ Failed to fetch aggregator ${aggUrl}:`, error);
          }
        }
        
        if (collected.length > 0) {
          const lazyCount = collected.filter(s => s.type === "lazy").length;
          console.log(`[skyMovieHD] ✅ Total streams: ${collected.length} (${successCount} eager, ${lazyCount} lazy)`);
          return dedupeStreams(collected);
        }
        
        console.log("[skyMovieHD] ⚠️ No streams extracted from aggregators");
      } catch (error) {
        console.log("[skyMovieHD] ❌ Aggregator processing failed:", error);
        return [];
      }
    }

    // Normalize StreamHG hglink -> dumbalag embed (for direct links only, not merged JSON)
    if (/hglink\.to\//i.test(target)) {
      try {
        const id = (target.match(/hglink\.to\/([A-Za-z0-9_-]{4,})/i) || [])[1];
        if (id) target = `https://dumbalag.com/e/${id}`;
      } catch {}
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
