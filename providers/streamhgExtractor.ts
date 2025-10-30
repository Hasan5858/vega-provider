import { AxiosStatic } from "axios";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

/**
 * StreamHG extractor (dumbalag.com)
 * - Normalize hglink.to/<id> to https://dumbalag.com/e/<id>
 * - Extract eval(...) obfuscated JS from embed HTML
 * - Unpack locally (P.A.C.K.E.R); fallback to public deobfuscator
 * - Parse .m3u8 from result
 */
export async function streamhgExtractor(
  url: string,
  axios: AxiosStatic,
  signal?: AbortSignal
): Promise<{ link: string; headers?: Record<string, string>; type?: string } | null> {
  try {
    const idMatch = url.match(/https?:\/\/(?:www\.)?(?:hglink\.to|dumbalag\.com)(?:\/(?:e|v))?\/([A-Za-z0-9_-]{4,})/i);
    const id = idMatch ? idMatch[1] : null;
    if (!id) {
      console.error("StreamHG: failed to parse id from url", url);
      return null;
    }

    const embedUrl = `https://dumbalag.com/e/${id}`;
    const res = await axios.get(embedUrl, {
      headers: { "User-Agent": USER_AGENT, Referer: url },
      responseType: "text",
      signal,
    });

    const html: string = res.data || "";

    // Direct m3u8 in HTML
    const direct = html.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
    if (direct) {
      return { link: direct[0].replace(/&amp;/g, "&"), headers: { "User-Agent": USER_AGENT, Referer: embedUrl }, type: "m3u8" };
    }

    // Capture full PACKER eval
    const evalPattern = /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*d\s*\)\s*\{[\s\S]*?\}\s*\(\s*['\"][\s\S]*?\.split\(\s*['\"]\|['\"]\s*\)\s*\)\s*\)/i;
    const evalMatch = html.match(evalPattern);
    if (!evalMatch) {
      console.error("StreamHG: no eval block found in embed page");
      return null;
    }
    const evalCode = evalMatch[0];

    // Try local unpack first
    let deob = unpackPackerFromGroups(evalCode) || unpackPacker(evalCode) || "";
    if (!deob) {
      try {
        const apiResp = await axios.post(
          "https://js-deobfuscator-api.replit.app/api/deobfuscate",
          { code: evalCode },
          { headers: { "Content-Type": "application/json" }, timeout: 15000 }
        );
        const data = apiResp.data || {};
        if (data.success && data.result) deob = String(data.result);
      } catch (e) {
        console.error("StreamHG: deobfuscation API error", e);
      }
    }

    const m3u8Match = deob.match(/https?:\/\/[^"'\s]+\.m3u8[^"'\s]*/i);
    const m3u8Url = m3u8Match ? m3u8Match[0] : null;
    if (!m3u8Url) {
      console.error("StreamHG: no m3u8 found after unpack");
      return null;
    }

    return {
      link: m3u8Url.replace(/&amp;/g, "&"),
      headers: { "User-Agent": USER_AGENT, Referer: embedUrl },
      type: "m3u8",
    };
  } catch (error) {
    console.error("StreamHG extractor failed", error);
    return null;
  }
}

function unpackPacker(code: string): string | null {
  try {
    const argsMatch = code.match(/eval\(function\(p,a,c,k,e,d\)\{[\s\S]*?\}\(([^)]+)\)\)/);
    if (!argsMatch) return null;
    const argsSrc = argsMatch[1];
    const list: any[] = Function("return [" + argsSrc + "]; ")();
    let p: string = String(list[0]);
    const a: number = parseInt(list[1]);
    const c: number = parseInt(list[2]);
    let ks: any = list[3];
    if (typeof ks === "string") ks = (ks as string).split("|");
    const k: string[] = ks as string[];
    let result = p;
    for (let i = c; i >= 0; i--) {
      const from = new RegExp("\\b" + i.toString(a) + "\\b", "g");
      const to = k[i] || i.toString(a);
      result = result.replace(from, to);
    }
    return result;
  } catch {
    return null;
  }
}

function unpackPackerFromGroups(code: string): string | null {
  try {
    const rx = /eval\s*\(\s*function\s*\(\s*p\s*,\s*a\s*,\s*c\s*,\s*k\s*,\s*e\s*,\s*d\s*\)[\s\S]*?\}\s*\(\s*(["'])([\s\S]*?)\1\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(["'])([\s\S]*?)\5\s*\.split\(\s*['\"]\|['\"]\s*\)/i;
    const m: any = code.match(rx);
    if (!m) return null;
    const p: string = String(m[2]);
    const a: number = parseInt(String(m[3]), 10);
    const c: number = parseInt(String(m[4]), 10);
    const k: string[] = String(m[6]).split("|");
    let result = p;
    for (let i = c; i >= 0; i--) {
      const from = new RegExp("\\b" + i.toString(a) + "\\b", "g");
      const to = k[i] || i.toString(a);
      result = result.replace(from, to);
    }
    return result;
  } catch {
    return null;
  }
}


