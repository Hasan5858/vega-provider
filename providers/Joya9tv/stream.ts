import { ProviderContext, Stream } from "../types";

const headers = {
  accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
  "cache-control": "no-cache",
  pragma: "no-cache",
  priority: "u=0, i",
  "sec-ch-ua":
    '"Chromium";v="140", "Not=A?Brand";v="24", "Microsoft Edge";v="140"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "sec-fetch-dest": "document",
  "sec-fetch-mode": "navigate",
  "sec-fetch-site": "none",
  "sec-fetch-user": "?1",
  "upgrade-insecure-requests": "1",
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
  const { hubcloudExtracter, gdFlixExtracter } = extractors;
  try {
    const streamLinks: Stream[] = [];
    console.log("Joya9tv getStream - processing link:", link?.substring(0, 80));
    
    if (type === "movie") {
      // vlink
      const dotlinkRes = await fetch(`${link}`, { headers });
      const dotlinkText = await dotlinkRes.text();
      // console.log('dotlinkText', dotlinkText);
      const vlink = dotlinkText.match(/<a\s+href="([^"]*cloud\.[^"]*)"/i) || [];
      // console.log('vLink', vlink[1]);
      link = vlink[1];
      console.log("Joya9tv getStream - extracted vlink:", link?.substring(0, 80));

      // filepress link
      try {
        const $ = cheerio.load(dotlinkText);
        const filepressLink = $(
          '.btn.btn-sm.btn-outline[style="background:linear-gradient(135deg,rgb(252,185,0) 0%,rgb(0,0,0)); color: #fdf8f2;"]'
        )
          .parent()
          .attr("href");
        // console.log('filepressLink', filepressLink);
        const filepressID = filepressLink?.split("/").pop();
        const filepressBaseUrl = filepressLink
          ?.split("/")
          .slice(0, -2)
          .join("/");
        console.log("Joya9tv getStream - found filepress link");
        // console.log('filepressID', filepressID);
        // console.log('filepressBaseUrl', filepressBaseUrl);
        
        if (filepressBaseUrl && filepressID) {
          const filepressTokenRes = await axios.post(
            filepressBaseUrl + "/api/file/downlaod/",
            {
              id: filepressID,
              method: "indexDownlaod",
              captchaValue: null,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Referer: filepressBaseUrl,
              },
            }
          );
          // console.log('filepressTokenRes', filepressTokenRes.data);
          if (filepressTokenRes.data?.status) {
            const filepressToken = filepressTokenRes.data?.data;
            const filepressStreamLink = await axios.post(
              filepressBaseUrl + "/api/file/downlaod2/",
              {
                id: filepressToken,
                method: "indexDownlaod",
                captchaValue: null,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Referer: filepressBaseUrl,
                },
              }
            );
            // console.log('filepressStreamLink', filepressStreamLink.data);
            if (filepressStreamLink.data?.data?.[0]) {
              streamLinks.push({
                server: "filepress",
                link: filepressStreamLink.data?.data?.[0],
                type: "mkv",
              });
              console.log("Joya9tv getStream - filepress link added");
            }
          }
        }
      } catch (error) {
        console.log("Joya9tv getStream - filepress extraction failed:", error instanceof Error ? error.message : String(error));
        // Continue to hubcloud extraction
      }
    }

    // Extract hubcloud/gdflix links
    if (link) {
      console.log("Joya9tv getStream - extracting from:", link?.substring(0, 80));
      
      let extractedLinks: Stream[] = [];
      
      // Try hubcloud first
      if (link.includes("hubcloud")) {
        extractedLinks = await hubcloudExtracter(link, signal);
        console.log("Joya9tv getStream - extracted", extractedLinks.length, "links from hubcloud");
      }
      // Try gdflix if link contains gdflix or if hubcloud failed
      else if (link.includes("gdflix") || extractedLinks.length === 0) {
        console.log("Joya9tv getStream - trying gdflix extractor");
        extractedLinks = await gdFlixExtracter(link, signal);
        console.log("Joya9tv getStream - extracted", extractedLinks.length, "links from gdflix");
      }
      
      if (extractedLinks.length > 0) {
        streamLinks.push(...extractedLinks);
      } else {
        console.log("Joya9tv getStream - extraction failed, returning intermediate link as fallback");
        // Fallback: return the intermediate link as-is
        streamLinks.push({
          server: "hubcloud/gdflix",
          link: link,
          type: "mkv",
        });
      }
    }

    console.log("Joya9tv getStream - returning", streamLinks.length, "total stream links");
    return streamLinks;
  } catch (error: any) {
    console.log("Joya9tv getStream - error:", error?.message || String(error));
    if (error.message?.includes("Aborted")) {
      console.log("Joya9tv getStream - request was aborted");
    }
    return [];
  }
}
