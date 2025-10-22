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
    // Update URL to use new domain
    const url = link.replace('filmyfly.deals', 'filmyfly.observer');
    const res = await axios.get(url, { headers });
    const data = res.data;
    const $ = cheerio.load(data);
    
    // Determine type based on content
    const type = url.includes("tvshows") || url.includes("series") || $('h2').text().includes('Series') ? "series" : "movie";
    const imdbId = "";
    
    // Extract title from page title or h2
    const title = $('h2').first().text().trim() || 
                  $('title').text().replace('FilmyFly', '').trim() ||
                  $('.fname').filter((i, el) => $(el).text().includes('Name:')).find(".colora").text().trim();
    
    // Extract image from movie thumbnail
    const image = $('.movie-thumb img').attr('src') || 
                  $(".ss img").attr("src") || 
                  "";
    
    // Extract synopsis from description
    const synopsis = $('.fname').filter((i, el) => $(el).text().includes('Description:')).find(".colorg").text().trim();
    
    // Extract tags from genre
    const tags = $('.fname').filter((i, el) => $(el).text().includes('Genre:')).find(".colorb").text().split(",").map(tag => tag.trim()) || [];
    
    const rating = "";
    const links: Link[] = [];
    
    // Extract download link from dlbtn
    const downloadLink = $(".dlbtn a").attr("href");
    if (downloadLink) {
      links.push({
        title: "Download",
        episodesLink: downloadLink,
        directLinks: [{
          title: "Download Movie",
          link: downloadLink,
          type: type as "movie" | "series"
        }]
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
