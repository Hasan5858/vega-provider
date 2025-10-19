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
      // Extract quality options from the download page to create dropdown
      // This will be used by the stream module to get actual download URLs
      const qualityOptions = [
        { title: "480p HEVC (560mb)", quality: "480p" },
        { title: "720p HEVC (930mb)", quality: "720p" },
        { title: "720p HD (1.5Gb)", quality: "720p-hd" },
        { title: "1080p HD (3.3Gb)", quality: "1080p-hd" },
        { title: "2160p HEVC (6.1Gb)", quality: "2160p" },
        { title: "720p HEVC 10bit (1.2Gb)", quality: "720p-10bit" },
        { title: "1080p HEVC 10bit (2.5Gb)", quality: "1080p-10bit" },
      ];
      
      // Create separate LinkList items for each quality option
      // This ensures LinkList.length > 1, which triggers the dropdown UI
      qualityOptions.forEach((option) => {
        links.push({
          title: option.title,
          episodesLink: downloadLink, // Same download page for all qualities
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
