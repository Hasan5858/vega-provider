import { Stream, ProviderContext } from "../types";

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
  const headers = {
    "sec-ch-ua":
      '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
    Cookie:
      "61cn=1; 61wk=1; __cf_bm=wtv9Eoa2wrUDgevtAnJ6wUOZrxtVYBcddhUDtT0Wj_M-1757137848-1.0.1.1-8Tr7rV19zNgUcRYe_5567LKb2IZrKyxwrc1VWgTmMDd06Givhil3U2kMtUYTYkTnuD3sHUgfh8CO9Y5LrEcZACBbrPE.3Sq5F_JLXaK7Hrw; conv_tracking_data-2=%7B%22mf_source%22%3A%22regular_download-59%22%2C%22mf_content%22%3A%22Free%22%2C%22mf_medium%22%3A%22unknown%5C%2FDefault%20Browser%22%2C%22mf_campaign%22%3A%22616qpccbrq0y4oe%22%2C%22mf_term%22%3A%22d11b8f533377139aa38d757e5057630e%22%7D; ukey=pu2dyp35fyongstav3km969l8d6u2z82",
  };

  try {
    if (type === "movie") {
      const linkRes = await axios.get(url, { headers });
      const linkData = linkRes.data;
      const $ = cheerio.load(linkData);
      url = $('strong:contains("INSTANT")').parent().attr("href") || url;
    }

    // w4links.skin - redirects to fastilinks.online
    if (url.includes("w4links.skin")) {
      console.log("w4links.skin detected, following redirect...");
      const w4linksRes = await axios.get(url, { headers });
      const w4linksData = w4linksRes.data;
      const $w4 = cheerio.load(w4linksData);
      
      // Look for fastilinks.online redirect
      const fastilinksRedirect = $w4('a[href*="fastilinks.online"]').attr("href");
      if (fastilinksRedirect) {
        console.log("Found fastilinks.online redirect:", fastilinksRedirect);
        url = fastilinksRedirect;
      } else {
        console.log("No fastilinks.online redirect found in w4links.skin");
      }
    }

    // fastilinks (both fastilinks.skin and fastilinks.online)
    if (url.includes("fastilinks")) {
      console.log("Processing fastilinks URL:", url);
      const fastilinksRes = await axios.get(url, { headers });
      const fastilinksData = fastilinksRes.data;
      const $$ = cheerio.load(fastilinksData);
      const fastilinksKey = $$(
        'input[name="_csrf_token_645a83a41868941e4692aa31e7235f2"]'
      ).attr("value");
      console.log("fastilinksKey", fastilinksKey);
      
      if (!fastilinksKey) {
        console.log("No CSRF token found, checking for other patterns...");
        // Try to find any CSRF token
        const anyCsrfToken = $$('input[name*="csrf"]').attr("value");
        console.log("Any CSRF token found:", anyCsrfToken);
      }
      
      const fastilinksFormData = new FormData();
      fastilinksFormData.append(
        "_csrf_token_645a83a41868941e4692aa31e7235f2",
        fastilinksKey || ""
      );
      console.log(
        "fastilinksFormData",
        fastilinksFormData,
        "fastilinksUrl",
        url
      );
      const fastilinksRes2 = await fetch(url, {
        method: "POST",
        headers: headers,
        body: fastilinksFormData,
      });
      const fastilinksHtml = await fastilinksRes2.text();
      console.log("fastilinks response status:", fastilinksRes2.status);
      console.log("fastilinks response length:", fastilinksHtml.length);
      
      const $$$ = cheerio.load(fastilinksHtml);
      // Try photolinx first, then mediafire (since mediafire links often expire)
      const photolinxLink = $$$('a:contains("photolinx")').attr("href");
      const mediafireLink = $$$('a:contains("mediafire")').attr("href");
      
      console.log("photolinxLink", photolinxLink);
      console.log("mediafireLink", mediafireLink);
      
      // Prefer photolinx over mediafire since mediafire links often expire
      const fastilinksLink = photolinxLink || mediafireLink;
      console.log("fastilinksLink (selected)", fastilinksLink);
      
      // Also check for any download links
      const allLinks = $$$('a[href]');
      console.log("Total links found:", allLinks.length);
      allLinks.each((i, el) => {
        const href = $$$(el).attr("href");
        const text = $$$(el).text();
        if (href && (href.includes("mediafire") || href.includes("photolinx") || href.includes("download"))) {
          console.log(`Link ${i}: "${text}" -> ${href}`);
        }
      });
      
      url = fastilinksLink || url;
    }
    console.log("world4uGetStream", type, url);

    if (url.includes("photolinx")) {
      console.log("photolinx", url);
      const photolinxBaseUrl = url.split("/").slice(0, 3).join("/");
      console.log("photolinxBaseUrl", photolinxBaseUrl);
      // const photolinxBaseUrl = url.split('/').slice(0, 3).join('/');
      const photolinxRes = await fetch(
        url,
        {
          headers: {
            accept:
              "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
            "cache-control": "no-cache",
            pragma: "no-cache",
            priority: "u=0, i",
            "sec-ch-ua":
              '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": "1",
            cookie:
              "PHPSESSID=f2211def7938d7228daaa37ffeabcfe0; ext_name=ojplmecpdpgccookcobabopnaifgidhf",
          },
          body: null,
          method: "GET",
        }
      );
      const photolinxData = await photolinxRes.text();
      const $$$ = cheerio.load(photolinxData);
      const access_token = $$$("#generate_url").attr("data-token");
      const uid = $$$("#generate_url").attr("data-uid");
      const body = {
        type: "DOWNLOAD_GENERATE",
        payload: {
          access_token,
          uid,
        },
      };
      console.log("photolinxData", JSON.stringify(body));

      const photolinxRes2 = await fetch(`${photolinxBaseUrl}/action`, {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,en-IN;q=0.8",
          "cache-control": "no-cache",
          "content-type": "application/json; charset=UTF-8",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not;A=Brand";v="99", "Microsoft Edge";v="139", "Chromium";v="139"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"Windows"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "xmlhttprequest",
          cookie:
            "PHPSESSID=f2211def7938d7228daaa37ffeabcfe0; ext_name=ojplmecpdpgccookcobabopnaifgidhf",
          Referer: url,
        },
        body: JSON.stringify(body),
        method: "POST",
      });
      const photolinxData2 = await photolinxRes2.json();
      console.log("photolinxData2", photolinxData2);
      const dwUrl = photolinxData2?.download_url;
      if (dwUrl) {
        const streamLinks = [
          {
            server: "Photolinx",
            link: dwUrl,
            type: "mkv",
          },
        ];
        return streamLinks;
      }
    }

    const res = await fetch(url, { headers: headers });
    if (!res.ok) {
      console.log(`Failed to fetch URL: ${url}, Status: ${res.status}`);
      // If this is a mediafire link that failed, try to find alternative links
      if (url.includes("mediafire")) {
        console.log("Mediafire link failed, returning empty array");
      }
      return [];
    }
    const html = await res.text();
    const streamLinks: Stream[] = [];
    let data = { download: "" };
    try {
      const key =
        html.match(/formData\.append\('key',\s*'(\d+)'\);/)?.[1] || "";
      console.log("key", key, "url", url);
      const formData = new FormData();
      formData.append("key", key);
      const streamRes = await fetch(url, {
        method: "POST",
        headers: headers,
        body: formData,
      });
      data = await streamRes.json();
    } catch (err) {
      console.log(
        "error in world4uGetStream key extraction",
        err instanceof Error ? err.message : err
      );
      console.log("URL that failed:", url);
    }

    // console.log('streamRes', streamRes);
    let $ = cheerio.load(html);
    // console.log('data', html);
    const mediafireUrl =
      $('h1:contains("Download")').find("a").attr("href") ||
      $(".input.popsok").attr("href") ||
      url;
    console.log("mediafireUrl", mediafireUrl);
    console.log("HTML content preview:", html.substring(0, 500));
    if (mediafireUrl) {
      const directUrl = await fetch(mediafireUrl, {
        headers: {
          Referer: url,
        },
      });
      const urlContentType = directUrl.headers.get("content-type");
      console.log("mfcontentType", urlContentType);
      if (urlContentType && urlContentType.includes("video")) {
        streamLinks.push({
          server: "Mediafire",
          link: mediafireUrl,
          type: "mkv",
        });
        return streamLinks;
      } else {
        const repairRes = await fetch(mediafireUrl, {
          headers: {
            Referer: url,
          },
        });
        const repairHtml = await repairRes.text();

        // Regex to match the window.location.href assignment in the script content
        const base64Link = cheerio
          .load(repairHtml)(".input.popsok")
          .attr("data-scrambled-url");
        console.log("base64Link", base64Link);
        const href = base64Link ? atob(base64Link) : null;
        console.log("href", href);

        // If a match is found, return the URL; otherwise return null
        let downloadLInk = href?.startsWith("https://") ? href : null;
        console.log("downloadLInk", downloadLInk);

        if (downloadLInk) {
          streamLinks.push({
            server: "Mediafire",
            link: downloadLInk,
            type: "mkv",
          });
        }
        return streamLinks;
      }
    }

    const requireRepairRes = await fetch(data.download);
    const contentType = requireRepairRes.headers.get("content-type");
    console.log("contentType", contentType);
    if (contentType && contentType.includes("video")) {
      streamLinks.push({
        server: "Mediafire",
        link: data.download,
        type: "mkv",
      });
      return streamLinks;
    } else {
      const repairRes = await fetch(data.download, {
        headers: {
          Referer: url,
        },
      });
      const repairHtml = await repairRes.text();
      const $ = cheerio.load(repairHtml);
      const repairLink = $("#continue-btn").attr("href");
      console.log("repairLink", "https://www.mediafire.com" + repairLink);
      const repairRequireRepairRes = await fetch(
        "https://www.mediafire.com" + repairLink
      );
      const $$ = cheerio.load(await repairRequireRepairRes.text());
      const repairDownloadLink = $$(".input.popsok").attr("href");
      console.log("repairDownloadLink", repairDownloadLink);
      if (repairDownloadLink) {
        streamLinks.push({
          server: "Mediafire",
          link: repairDownloadLink,
          type: "mkv",
        });
      }
    }

    return streamLinks;
  } catch (err) {
    console.log(err instanceof Error ? err.message : err);
    return [];
  }
};
