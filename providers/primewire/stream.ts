import { Stream, ProviderContext } from "../types";
import { decodeLinkKeys } from "./blowfish";

// Handle primesrc.me embed URLs
async function handlePrimeSrcEmbed(url: string, axios: any, cheerio: any): Promise<Stream[]> {
  try {
    console.log("Fetching embed page from primesrc.me...");
    
    // Extract parameters from the embed URL
    const urlObj = new URL(url);
    const sId = urlObj.searchParams.get('s_id');
    const embedType = urlObj.pathname.includes('/tv/') ? 'tv' : 'movie';
    
    console.log(`Type: ${embedType}, ID: ${sId}`);
    
    // Fetch the embed page
    const embedRes = await axios.get(url);
    const $ = cheerio.load(embedRes.data);
    
    const streamLinks: Stream[] = [];
    
    // Look for video sources in the page
    $('video source, source[src*=".mp4"], source[src*=".m3u8"]').each((i: number, el: any) => {
      const src = $(el).attr('src');
      if (src) {
        streamLinks.push({
          server: `Stream ${i + 1}`,
          link: src.startsWith('http') ? src : `https://primesrc.me${src}`,
          type: src.includes('m3u8') ? 'm3u8' : 'mp4',
        });
      }
    });
    
    // If no direct video sources found, check for data attributes
    if (streamLinks.length === 0) {
      $('[data-src]').each((i: number, el: any) => {
        const dataSrc = $(el).attr('data-src');
        if (dataSrc && (dataSrc.includes('.mp4') || dataSrc.includes('.m3u8'))) {
          streamLinks.push({
            server: `Source ${i + 1}`,
            link: dataSrc.startsWith('http') ? dataSrc : `https://primesrc.me${dataSrc}`,
            type: dataSrc.includes('m3u8') ? 'm3u8' : 'mp4',
          });
        }
      });
    }
    
    console.log(`Found ${streamLinks.length} streaming sources`);
    
    // If still no sources, fallback to iframe
    if (streamLinks.length === 0) {
      streamLinks.push({
        server: "Embed",
        link: url,
        type: "iframe",
      });
    }
    
    return streamLinks;
  } catch (err: any) {
    console.error("Error handling primesrc embed:", err?.message || err);
    return [];
  }
}

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
    console.log("pwGetStream", type, url);
    
    // Check if this is a primesrc.me embed URL
    if (url.includes('primesrc.me')) {
      console.log("✅ Detected primesrc.me embed URL");
      return await handlePrimeSrcEmbed(url, axios, cheerio);
    }
    
    const baseUrl = url.split("/").slice(0, 3).join("/");
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    
    console.log("Step 1: Extracting encrypted data...");
    // Try new Primewire structure with encrypted data
    const userData = $('#user-data').attr('v');
    if (userData && userData.length > 10) {
      console.log("✅ Found encrypted data in #user-data");
      const decodedKeys = decodeLinkKeys(userData);
      console.log(`Decrypted ${decodedKeys.length} keys`);
      
      const streamLinks: Stream[] = [];
      
      // Extract version metadata and match with decoded keys
      $('[data-wp-menu]').each((i: number, element: any) => {
        const wpMenuKey = $(element).attr('data-wp-menu');
        if (!wpMenuKey || !decodedKeys.includes(wpMenuKey)) return;
        
        const $row = $(element).closest('tr');
        const versionText = $row.find('.embed-link').text().trim();
        const domain = $row.find('.version-host').text().trim();
        const qualitySize = $row.find('.quality_tag').text().trim();
        
        if (domain && qualitySize) {
          const streamUrl = `${baseUrl}/links/gos/${wpMenuKey}`;
          streamLinks.push({
            server: `${domain} - ${qualitySize}`,
            link: streamUrl,
            type: "iframe",
          });
          
          console.log(`Added: ${versionText} from ${domain} (${qualitySize})`);
        }
      });
      
      if (streamLinks.length > 0) {
        console.log(`✅ Extracted ${streamLinks.length} stream(s) using new structure`);
        return streamLinks;
      }
    }
    
    // Fallback to old mixdrop structure
    console.log("Trying old mixdrop structure...");
    const streamLinks: Stream[] = [];
    const urls: { id: string; size: string }[] = [];
    
    // Filter tr elements that contain mixdrop
    $('tr').each((i, element) => {
      const text = $(element).text().toLowerCase();
      if (text.includes('mixdrop')) {
        const id = $(element).find(".wp-menu-btn").attr("data-wp-menu");
        const size = $(element).find(".wp-menu-btn").next().text();
        if (id) {
          urls.push({ id: baseUrl + "/links/go/" + id, size });
        }
      }
    });

    console.log("Found mixdrop URLs:", urls.length);
    
    if (urls.length === 0) {
      console.log("⚠️ No mixdrop links found on page");
      return [];
    }

    for (const url of urls) {
      try {
        console.log("Processing URL:", url.id);
        const res2 = await axios.head(url.id);
        const location = res2.request?.responseURL.replace("/f/", "/e/");
        console.log("Redirect location:", location);

        const res3 = await fetch(location, {
        credentials: "include",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.5",
          "Upgrade-Insecure-Requests": "1",
          "Sec-Fetch-Dest": "iframe",
          "Sec-Fetch-Mode": "navigate",
          "Sec-Fetch-Site": "same-origin",
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
          referer: res2.request?.responseURL,
        },
        referrer: res2.request?.responseURL,
        method: "GET",
        mode: "cors",
      });
      const data3 = await res3.text();

      // let MDCore: any = {};
      // Step 1: Extract the function parameters and the encoded string
      var functionRegex =
        /eval\(function\((.*?)\)\{.*?return p\}.*?\('(.*?)'\.split/;
      var match = functionRegex.exec(data3);
      let p = "";
      if (match) {
        // var params = match[1].split(',').map(param => param.trim());
        var encodedString = match[2];
        console.log("Encoded String:", encodedString);

        // console.log('Parameters:', params);
        // console.log('Encoded String:', encodedString.split("',36,")[0], '🔥🔥');

        const base = Number(
          encodedString.split(",'|MDCore|")[0].split(",")[
            encodedString.split(",'|MDCore|")[0].split(",").length - 1
          ]
        );
        console.log("Base:", base);

        p = encodedString.split(`',${base},`)?.[0].trim();
        let a = base;
        let c = encodedString.split(`',${base},`)[1].slice(2).split("|").length;
        let k = encodedString.split(`',${base},`)[1].slice(2).split("|");

        // console.log('p:', p);
        // console.log('a:', a);
        // console.log('c:', c);
        // console.log('k:', k);

        const decode = function (
          p: any,
          a: any,
          c: any,
          k: any,
          e: any,
          d: any
        ) {
          e = function (c: any) {
            return c.toString(36);
          };
          if (!"".replace(/^/, String)) {
            while (c--) {
              d[c.toString(a)] = k[c] || c.toString(a);
            }
            k = [
              function (e: any) {
                return d[e];
              },
            ];
            e = function () {
              return "\\w+";
            };
            c = 1;
          }
          while (c--) {
            if (k[c]) {
              p = p.replace(new RegExp("\\b" + e(c) + "\\b", "g"), k[c]);
            }
          }
          return p;
        };

        const decoded = decode(p, a, c, k, 0, {});
        console.log("Decoded string length:", decoded.length);
        
        // get MDCore.wurl=
        const wurl = decoded.match(/MDCore\.wurl="([^"]+)"/)?.[1];
        console.log("Extracted wurl:", wurl);
        
        if (wurl) {
          const streamUrl = "https:" + wurl;
          console.log("✅ Extracted playable stream URL:", streamUrl);
          streamLinks.push({
            server: "Mixdrop " + url.size,
            link: streamUrl,
            type: "mp4",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0",
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
              "Accept-Language": "en-US,en;q=0.5",
              "Upgrade-Insecure-Requests": "1",
              "Sec-Fetch-Dest": "iframe",
              "Sec-Fetch-Mode": "navigate",
              "Sec-Fetch-Site": "same-origin",
              Pragma: "no-cache",
              "Cache-Control": "no-cache",
              referer: res2.request?.responseURL,
            },
          });
        } else {
          console.log("Could not extract wurl from decoded string");
        }
      } else {
        console.log("No match found in response");
      }
      } catch (fetchErr) {
        console.error("❌ Error processing stream link:", fetchErr);
      }
    }
    
    console.log(`✅ Successfully extracted ${streamLinks.length} playable stream(s)`);
    return streamLinks;
  } catch (err) {
    console.error(err);
    return [];
  }
};
