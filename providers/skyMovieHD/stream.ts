import { ProviderContext, Stream } from "../types";

const headers = {
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
  Cookie:
    "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
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
  const streamtapeExtractor = (extractors as any).streamtapeExtractor as ((u: string, a: any, s?: AbortSignal) => Promise<{ link: string; headers?: Record<string, string>; type?: string } | null>);
  const streamhgExtractor = (extractors as any).streamhgExtractor as ((u: string, a: any, s?: AbortSignal) => Promise<{ link: string; headers?: Record<string, string>; type?: string } | null>);
  const gdFlixExtracter = (extractors as any).gdFlixExtracter as (u: string, s?: AbortSignal) => Promise<Stream[]>;
  const filepresExtractor = (extractors as any).filepresExtractor as (u: string, a: any, s?: AbortSignal) => Promise<{ link: string; headers?: Record<string, string>; type?: string } | null>;
  const gofileExtracter = (extractors as any).gofileExtracter as (id: string) => Promise<{ link: string; token: string }>; 
  try {
    console.log("dotlink", link);
    let target = link;
    // Normalize StreamHG hglink -> dumbalag embed
    if (/hglink\.to\//i.test(target)) {
      try {
        const id = (target.match(/hglink\.to\/([A-Za-z0-9_-]{4,})/i) || [])[1];
        if (id) target = `https://dumbalag.com/e/${id}`;
      } catch {}
    }

    // howblogs aggregator with multiple hosts
    if (/howblogs\.xyz\//i.test(target)) {
      const res = await axios.get(target, { signal });
      const $ = cheerio.load(res.data || "");
      const anchors = $("a[href]").toArray();
      const out: Stream[] = [];
      for (const a of anchors) {
        const href = ($(a).attr("href") || "").trim();
        if (!href) continue;
        // skip media.cm, dgdrive, hubdrive, gdtot
        if (/media\.cm|dgdrive|hubdrive|gdtot/i.test(href)) continue;
        // gofile
        if (/gofile\.io\/d\//i.test(href)) {
          const id = href.split("/d/")[1]?.split("?")[0];
          if (id) {
            try {
              const go = await gofileExtracter(id);
              if (go?.link) out.push({ server: "GoFile", link: go.link, type: "mkv" });
            } catch {}
          }
          continue;
        }
        // gdflix
        if (/gdflix/i.test(href)) {
          try {
            const links = await gdFlixExtracter(href, signal);
            out.push(...links.map((l: Stream) => ({ ...l, server: (l as any).server || "GDFLIX" })));
          } catch {}
          continue;
        }
        // hubcloud
        if (/hubcloud/i.test(href)) {
          try {
            const links = await hubcloudExtracter(href, signal);
            out.push(...links.map((l: Stream) => ({ ...l, server: (l as any).server || "HubCloud" })));
          } catch {}
          continue;
        }
        // filepress
        if (/filepress\./i.test(href)) {
          try {
            const fp = await filepresExtractor(href, axios, signal);
            if (fp?.link) out.push({ server: "FilePress", link: fp.link, type: fp.type || "m3u8", headers: fp.headers });
          } catch {}
          continue;
        }
      }
      // Post-filter: drop known non-playable wrappers and archives; normalize types and priority
      const filtered = out
        .filter((s) => s.link &&
          !/fastcdn-dl\.|workers\.dev\//i.test(s.link) && // HTML wrappers
          !/\.zip($|\?|#)/i.test(s.link)) // archives not playable
        .map((s) => {
          const link = s.link;
          let type: string = s.type || "mp4";
          if (/googleusercontent\.com/i.test(link) || /\.mp4($|\?|#)/i.test(link)) type = "mp4";
          else if (/\.m3u8($|\?|#)/i.test(link)) type = "m3u8";
          else if (/\.mkv($|\?|#)/i.test(link)) type = "mkv";
          return { ...s, type } as Stream;
        });
      // Sort: prefer Google (mp4), then GoFile, then HubCloud/others
      filtered.sort((a, b) => {
        const score = (x: Stream) => (
          /googleusercontent\.com/i.test(x.link) ? 100 :
          /gofile\.io/i.test(x.link) ? 90 :
          /hubcloud|hubcdn/i.test(x.link) ? 60 :
          /gdflix/i.test(x.link) ? 50 : 10
        );
        return score(b) - score(a);
      });
      return filtered;
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
    return await hubcloudExtracter(target, signal);
  } catch (error: any) {
    console.log("getStream error: ", error);
    if (error.message.includes("Aborted")) {
    } else {
    }
    return [];
  }
}
