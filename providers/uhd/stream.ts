import { ProviderContext, Stream } from "../types";

const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
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
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0",
};

export const getStream = async ({
  link: url,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Stream[]> => {
  try {
    const { axios, cheerio } = providerContext;
    let downloadLink = await modExtractor(url, providerContext);

    // console.log(downloadLink.data);

    const ddl = downloadLink?.data?.match(/content="0;url=(.*?)"/)?.[1] || url;

    console.log("ddl", ddl);
    // console.log(ddl);
    const driveLink = await isDriveLink(ddl);
    const ServerLinks: Stream[] = [];

    const driveRes = await axios.get(driveLink, { headers });
    const driveHtml = driveRes.data;
    const $drive = cheerio.load(driveHtml);
    // ResumeBot (some driveseed variants)
    try {
      const resumeBot = $drive(".btn.btn-light").attr("href") || "";
      if (resumeBot) {
        const resumeBotRes = await axios.get(resumeBot, { headers });
        const resumeBotToken = resumeBotRes.data.match(
          /formData\.append\('token', '([a-f0-9]+)'\)/
        )?.[1];
        const resumeBotBody = new FormData();
        if (resumeBotToken) {
          resumeBotBody.append("token", resumeBotToken);
        }
        const resumeBotPath = resumeBotRes.data.match(
          /fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/
        )?.[1];
        const resumeBotBaseUrl = resumeBot.split("/download")[0];
        if (resumeBotPath) {
          const resumeBotDownload = await fetch(
            resumeBotBaseUrl + "/download?id=" + resumeBotPath,
            {
              method: "POST",
              body: resumeBotBody,
              headers: {
                Referer: resumeBot,
                Cookie: "PHPSESSID=7e9658ce7c805dab5bbcea9046f7f308",
              },
            }
          );
          const resumeBotDownloadData = await resumeBotDownload.json();
          if (resumeBotDownloadData?.url) {
            ServerLinks.push({
              server: "ResumeBot",
              link: resumeBotDownloadData.url,
              type: "mkv",
            });
          }
        }
      }
    } catch (err) {
      console.log("ResumeBot link not found", err);
    }

    //instant link
    try {
      // Broaden selector in case the button class differs on series pages
      const seed =
        $drive("a.btn-danger").attr("href") ||
        $drive('a[href*="/instant"]').attr("href") ||
        "";

      if (seed) {
        let instantToken = "";
        try {
          const urlObj = new URL(seed);
          instantToken =
            urlObj.searchParams.get("keys") ||
            urlObj.searchParams.get("key") ||
            urlObj.searchParams.get("token") ||
            "";
        } catch {
          // Fallback to legacy split if URL constructor fails
          instantToken = (seed.split("?")[1] || "").split("&").find(p => p.startsWith("keys=") || p.startsWith("key=") || p.startsWith("token="))?.split("=")[1] || seed.split("=")[1] || "";
        }

        // Derive additional token candidates
        const driveId = (driveLink.match(/\/file\/([^/?#]+)/)?.[1] || "").trim();
        const pepeCookie = (downloadLink as any)?.cookie || "";
        const hexEncode = (s: string) => Array.from(s).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
        const candidates = Array.from(new Set([
          instantToken,
          driveId,
          pepeCookie,
          hexEncode(instantToken || ''),
          hexEncode(driveId || ''),
          hexEncode(pepeCookie || ''),
        ].filter(Boolean)));

        const origin = seed.split("/").slice(0, 3).join("/");
        const videoSeedUrl = origin + "/api";

        let instantOk = false;
        for (const candidate of candidates) {
          try {
            const fd = new FormData();
            fd.append("keys", candidate);
            const res = await fetch(videoSeedUrl, {
              method: "POST",
              body: fd,
              headers: { "x-token": videoSeedUrl, Referer: seed, Origin: origin },
            });
            const js = await res.json();
            if (js && js.error === false && js.url) {
              ServerLinks.push({ server: "Gdrive-Instant", link: js.url, type: "mkv" });
              instantOk = true;
              break;
            }
          } catch (_) {
            // try next candidate
          }
        }
        if (!instantOk) {
          console.log("Instant link not found", { tried: candidates.length });
        }
      }
    } catch (err) {
      console.log("Instant link not found", err);
    }

    // resume link (broaden selectors)
    try {
      const resumeDrive = driveLink.replace("/file", "/zfile");
      //   console.log('resumeDrive', resumeDrive);
      const resumeDriveRes = await axios.get(resumeDrive, { headers });
      const resumeDriveHtml = resumeDriveRes.data;
      const $resumeDrive = cheerio.load(resumeDriveHtml);
      let resumeLink = $resumeDrive(".btn-success").attr("href");
      if (!resumeLink) {
        resumeLink =
          $resumeDrive('a[href*="workers.dev"]').attr('href') ||
          $resumeDrive('a.btn').attr('href') || '';
      }
      //   console.log('resumeLink', resumeLink);
      if (resumeLink) {
        ServerLinks.push({
          server: "ResumeCloud",
          link: resumeLink,
          type: "mkv",
        });
      }
    } catch (err) {
      console.log("Resume link not found");
    }

    // CF workers type 1 (broaden selectors)
    try {
      const cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=1";
      const cfWorkersRes = await axios.get(cfWorkersLink, { headers });
      const cfWorkersHtml = cfWorkersRes.data;
      const $cfWorkers = cheerio.load(cfWorkersHtml);
      const cfWorkersStream = $cfWorkers("a.btn-success, a.btn, a[href*=\"workers.dev\"]");
      cfWorkersStream.each((i, el) => {
        const link = (el as any).attribs?.href;
        if (link) {
          ServerLinks.push({
            server: "Cf Worker 1." + i,
            link: link,
            type: "mkv",
          });
        }
      });
    } catch (err) {
      console.log("CF workers link not found", err);
    }

    // CF workers type 2 (broaden selectors)
    try {
      const cfWorkersLink = driveLink.replace("/file", "/wfile") + "?type=2";
      const cfWorkersRes = await axios.get(cfWorkersLink, { headers });
      const cfWorkersHtml = cfWorkersRes.data;
      const $cfWorkers = cheerio.load(cfWorkersHtml);
      const cfWorkersStream = $cfWorkers("a.btn-success, a.btn, a[href*=\"workers.dev\"]");
      cfWorkersStream.each((i, el) => {
        const link = (el as any).attribs?.href;
        if (link) {
          ServerLinks.push({
            server: "Cf Worker 2." + i,
            link: link,
            type: "mkv",
          });
        }
      });
    } catch (err) {
      console.log("CF workers link not found", err);
    }

    // Generic anchors on main drive page that may directly point to workers/download mirrors
    try {
      $drive('a[href*="workers.dev"], a[href*="/download"], a[href*="/wfile"], a[href*="/zfile"], a.btn-primary, a.btn-warning').each((i, el) => {
        const link = (el as any).attribs?.href;
        if (link && /^https?:\/\//.test(link)) {
          ServerLinks.push({ server: "Drive Link " + i, link, type: "mkv" });
        }
      });
    } catch (err) {
      // ignore
    }

    console.log("ServerLinks", ServerLinks);
    // If none found and ddl is a direct file (.mkv/.mp4), return it as fallback
    if (ServerLinks.length === 0 && /\.(mkv|mp4)(\?|$)/i.test(ddl)) {
      ServerLinks.push({ server: "Direct", link: ddl, type: "mkv" });
    }
    return ServerLinks;
  } catch (err) {
    console.log("getStream error", err);
    return [];
  }
};

const isDriveLink = async (ddl: string) => {
  if (ddl.includes("drive")) {
    const driveLeach = await fetch(ddl);
    const driveLeachData = await driveLeach.text();
    const pathMatch = driveLeachData.match(
      /window\.location\.replace\("([^"]+)"\)/
    );
    const path = pathMatch?.[1];
    const mainUrl = ddl.split("/")[2];
    console.log(`driveUrl = https://${mainUrl}${path}`);
    return `https://${mainUrl}${path}`;
  } else {
    return ddl;
  }
};

async function modExtractor(url: string, providerContext: ProviderContext) {
  const { axios, cheerio } = providerContext;
  try {
    const wpHttp = url.split("sid=")[1];
    var bodyFormData0 = new FormData();
    bodyFormData0.append("_wp_http", wpHttp);
    const res = await fetch(url.split("?")[0], {
      method: "POST",
      body: bodyFormData0,
    });
    const data = await res.text();
    // console.log('', data);
    const html = data;
    const $ = cheerio.load(html);

    // find input with name="_wp_http2"
    const wpHttp2 = $("input").attr("name", "_wp_http2").val();

    // console.log('wpHttp2', wpHttp2);

    // form data
    var bodyFormData = new FormData();
    bodyFormData.append("_wp_http2", wpHttp2);
    const formUrl1 = $("form").attr("action");
    const formUrl = formUrl1 || url.split("?")[0];

    const res2 = await fetch(formUrl, {
      method: "POST",
      body: bodyFormData,
    });
    const html2: any = await res2.text();
    const link = html2.match(/setAttribute\("href",\s*"(.*?)"/)[1];
    console.log(link);
    const cookie = link.split("=")[1];
    console.log("cookie", cookie);

    const downloadLink = await axios.get(link, {
      headers: {
        Referer: formUrl,
        Cookie: `${cookie}=${wpHttp2}`,
      },
    });
    // attach cookie for later token fallback attempts
    (downloadLink as any).cookie = cookie;
    return downloadLink;
  } catch (err) {
    console.log("modGetStream error", err);
  }
}
