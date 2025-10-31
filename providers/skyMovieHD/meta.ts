import { Info, Link, ProviderContext } from "../types";

interface DirectLink {
  link: string;
  title: string;
  quality: string;
  type: "movie" | "series";
}

interface Episode {
  title: string;
  directLinks: DirectLink[];
}

const headers = {
  Referer: "https://google.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

export async function fetchEpisodesFromSelectedLink(
  url: string,
  providerContext: ProviderContext
): Promise<Episode[]> {
  const { axios, cheerio } = providerContext;
  const res = await axios.get(url, { headers });
  const $ = cheerio.load(res.data);

  const episodes: Episode[] = [];

  $("h4").each((_, h4El) => {
    const epTitle = $(h4El).text().trim();
    if (!epTitle) return;

    const directLinks: DirectLink[] = [];

    $(h4El)
      .nextUntil("h4, hr")
      .find("a[href]")
      .each((_, linkEl) => {
        let href = ($(linkEl).attr("href") || "").trim();
        if (!href) return;
        if (!href.startsWith("http")) href = new URL(href, url).href;

        const btnText = $(linkEl).text().trim() || "Watch Episode";
        directLinks.push({
          link: href,
          title: btnText,
          quality: "AUTO",
          type: "series",
        });
      });

    if (directLinks.length > 0) {
      episodes.push({
        title: epTitle,
        directLinks,
      });
    }
  });

  return episodes;
}

// --- Main getMeta function
export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<
  Info & { extraInfo: Record<string, string>; episodeList: Episode[] }
> {
  const { axios, cheerio } = providerContext;
  if (!link.startsWith("http")) link = new URL(link, "https://skymovieshd.mba").href;

  try {
    const res = await axios.get(link, { headers });
    const $ = cheerio.load(res.data);

    const title = ($("title").text() || "").trim() || "Unknown";
    const type: "movie" | "series" = "movie";
    const image = "";
    const synopsis = "";
    const imdbId = "";
    const tags: string[] = [];
    const extra: Record<string, string> = {};

    const episodeList: Episode[] = [];
    const links: Link[] = [];

    // New site: Extract WATCH ONLINE and SERVER 01
    // Store both links but return only SERVER 01 with WATCH ONLINE embedded in link data
    const directLinks: DirectLink[] = [];
    let watchOnlineLink = "";
    let server01Link = "";
    
    $("a[href]")
      .filter((_, a) => {
        const text = ($(a).text() || "").trim().toLowerCase();
        return text.includes("watch online") || text === "server 01";
      })
      .each((_, a) => {
        let href = ($(a).attr("href") || "").trim();
        if (!href) return;
        if (!href.startsWith("http")) href = new URL(href, link).href;
        const text = ($(a).text() || "").trim().toLowerCase();
        
        if (text.includes("watch online")) {
          watchOnlineLink = href;
        } else if (text === "server 01") {
          server01Link = href;
        }
      });

    // Only add SERVER 01 button, but embed WATCH ONLINE link in the data
    // stream.ts will extract servers from both aggregator pages
    if (server01Link) {
      const linkData = watchOnlineLink 
        ? JSON.stringify({ server01: server01Link, watchOnline: watchOnlineLink })
        : server01Link;
      
      directLinks.push({ 
        link: linkData, 
        title: "SERVER 01", 
        quality: "AUTO", 
        type: "movie" 
      });
    }

    if (directLinks.length) {
      links.push({
        title,
        quality: title.match(/\d+p/)?.[0] || "AUTO",
        episodesLink: "",
        directLinks,
      });
    }

    return {
      title,
      synopsis,
      image,
      imdbId,
      type,
      tags,
      cast: [],
      rating: "",
      linkList: links,
      extraInfo: extra,
      episodeList,
    };
  } catch (err) {
    console.error("getMeta error:", err);
    return {
      title: "",
      synopsis: "",
      image: "",
      imdbId: "",
      type: "movie",
      tags: [],
      cast: [],
      rating: "",
      linkList: [],
      extraInfo: {},
      episodeList: [],
    };
  }
};
