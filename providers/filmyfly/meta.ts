import { Info, Link, ProviderContext } from "../types";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const { axios, cheerio, commonHeaders: headers } = providerContext;
    const url = link;
    const res = await axios.get(url, { headers });
    const data = res.data;
    const $ = cheerio.load(data);
    const type = url.includes("tvshows") ? "series" : "movie";
    const imdbId = "";
    // Updated selectors to match current website structure
    const title = $('.fname').filter((i, el) => $(el).text().includes('Name:')).find(".colora").text().trim();
    const image = $(".ss").find("img").attr("src") || "";
    const synopsis = $('.fname').filter((i, el) => $(el).text().includes('Description:')).find(".colorg").text().trim();
    const tags = $('.fname').filter((i, el) => $(el).text().includes('Genre:')).find(".colorb").text().split(",") || [];
    const rating = "";
    const links: Link[] = [];
    const downloadLink = $(".dlbtn").find("a").attr("href");
    if (downloadLink) {
      // Create a single LinkList item with directLinks for all qualities
      // This will show as a dropdown with quality options
      const directLinks: Link["directLinks"] = [
        {
          title: "480p HEVC (560mb)",
          link: downloadLink,
          type: type as "movie" | "series",
        },
        {
          title: "720p HEVC (930mb)",
          link: downloadLink,
          type: type as "movie" | "series",
        },
        {
          title: "720p HD (1.5Gb)",
          link: downloadLink,
          type: type as "movie" | "series",
        },
        {
          title: "1080p HD (3.3Gb)",
          link: downloadLink,
          type: type as "movie" | "series",
        },
        {
          title: "2160p 4K (6.1Gb)",
          link: downloadLink,
          type: type as "movie" | "series",
        },
        {
          title: "720p HEVC 10bit (1.2Gb)",
          link: downloadLink,
          type: type as "movie" | "series",
        },
        {
          title: "1080p HEVC 10bit (2.5Gb)",
          link: downloadLink,
          type: type as "movie" | "series",
        },
      ];
      
      links.push({
        title: title,
        directLinks: directLinks,
      });
    }
    return {
      title,
      tags,
      rating,
      synopsis,
      image,
      imdbId,
      type,
      linkList: links,
    };
  } catch (err) {
    console.error(err);
    return {
      title: "",
      synopsis: "",
      image: "",
      imdbId: "",
      type: "movie",
      linkList: [],
    };
  }
};
