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
  const streamtapeExtractor = (extractors as any).streamtapeExtractor as ((u: string, a: any, s?: AbortSignal) => Promise<Stream | Stream[] | null>);
  const streamhgExtractor = (extractors as any).streamhgExtractor as ((u: string, a: any, s?: AbortSignal) => Promise<Stream | Stream[] | null>);
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

    // Prefer StreamHG
    if (/dumbalag\.com\//i.test(target) && typeof streamhgExtractor === "function") {
      const shg = await streamhgExtractor(target, axios, signal);
      if (shg) return shg;
    }

    // StreamTape family
    if (/streamtape|watchadsontape|tape/i.test(target) && typeof streamtapeExtractor === "function") {
      return await streamtapeExtractor(target, axios, signal);
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
