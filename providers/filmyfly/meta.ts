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
    
    // Extract download links from the page
    const directLinks: Link["directLinks"] = [];
    
    // Look for download buttons and extract quality information
    $(".dlbtn").each((i, element) => {
      const $btn = $(element);
      const downloadLink = $btn.find("a").attr("href");
      const buttonText = $btn.text().trim();
      
      if (downloadLink) {
        // Extract quality from button text or surrounding elements
        let quality = "HD";
        if (buttonText.includes("480p")) quality = "480p";
        else if (buttonText.includes("720p")) quality = "720p";
        else if (buttonText.includes("1080p")) quality = "1080p";
        else if (buttonText.includes("2160p") || buttonText.includes("4K")) quality = "2160p";
        
        // Try to extract file size from surrounding text
        const sizeMatch = buttonText.match(/(\d+(?:\.\d+)?[GMK]b)/i);
        const size = sizeMatch ? sizeMatch[1] : "";
        
        const linkTitle = size ? `${quality} (${size})` : quality;
        
        directLinks.push({
          title: linkTitle,
          link: downloadLink,
          type: type as "movie" | "series",
        });
      }
    });
    
    // If no download buttons found, try alternative selectors
    if (directLinks.length === 0) {
      // Look for other download link patterns
      $("a[href*='download'], a[href*='file']").each((i, element) => {
        const $link = $(element);
        const href = $link.attr("href");
        const linkText = $link.text().trim();
        
        if (href && linkText) {
          let quality = "HD";
          if (linkText.includes("480p")) quality = "480p";
          else if (linkText.includes("720p")) quality = "720p";
          else if (linkText.includes("1080p")) quality = "1080p";
          else if (linkText.includes("2160p") || linkText.includes("4K")) quality = "2160p";
          
          const sizeMatch = linkText.match(/(\d+(?:\.\d+)?[GMK]b)/i);
          const size = sizeMatch ? sizeMatch[1] : "";
          
          const linkTitle = size ? `${quality} (${size})` : quality;
          
          directLinks.push({
            title: linkTitle,
            link: href,
            type: type as "movie" | "series",
          });
        }
      });
    }
    
    // If we found direct links, add them to the linkList
    if (directLinks.length > 0) {
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
