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

    // New site: buttons/links are plain anchors with texts like WATCH ONLINE, SERVER 01..06, Google Drive Direct Links
    const directLinks: DirectLink[] = [];
    $("a[href]")
      .filter((_, a) => {
        const text = ($(a).text() || "").trim().toLowerCase();
        return (
          text.includes("watch online") ||
          text.includes("server") ||
          text.includes("google drive") ||
          text.includes("direct link")
        );
      })
      .each((_, a) => {
        let href = ($(a).attr("href") || "").trim();
        if (!href) return;
        if (!href.startsWith("http")) href = new URL(href, link).href;
        const text = ($(a).text() || "Link").trim();
        directLinks.push({ link: href, title: text, quality: "AUTO", type: "movie" });
      });

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
