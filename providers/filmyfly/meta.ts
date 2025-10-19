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
      // For FilmyFly, we'll create multiple LinkList items for different qualities
      // This will make the UI show a dropdown instead of a flat list
      const qualityOptions = [
        { title: "480p HEVC", quality: "480p" },
        { title: "720p HEVC", quality: "720p" },
        { title: "1080p HD", quality: "1080p" },
        { title: "2160p 4K", quality: "2160p" },
        { title: "720p HEVC 10bit", quality: "720p-10bit" },
        { title: "1080p HEVC 10bit", quality: "1080p-10bit" },
      ];
      
      qualityOptions.forEach(option => {
        links.push({
          title: `${title} - ${option.title}`,
          episodesLink: downloadLink,
          quality: option.quality as any,
        });
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
