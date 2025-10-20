import { EpisodeLink, ProviderContext } from "../types";

export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { axios, cheerio } = providerContext;
  const episodesLink: EpisodeLink[] = [];
  try {
    if (url.includes("gdflix")) {
      const urlParts = url.split("/pack");
      if (!urlParts || urlParts.length === 0) {
        console.error("Invalid gdflix URL structure:", url);
        return [];
      }
      const baseUrl = urlParts[0];
      const res = await axios.get(url);
      const data = res.data;
      const $ = cheerio.load(data);
      const links = $(".list-group-item");
      links?.map((i, link) => {
        episodesLink.push({
          title: $(link).text() || "",
          link: baseUrl + $(link).find("a").attr("href") || "",
        });
      });
      if (episodesLink.length > 0) {
        return episodesLink;
      }
    }
    if (url.includes("/pack")) {
      const epIds = await extractKmhdEpisodes(url, providerContext);
      epIds?.forEach((id: string, index: number) => {
        episodesLink.push({
          title: `Episode ${index + 1}`,
          link: url.split("/pack")[0] + "/file/" + id,
        });
      });
    }
    const res = await axios.get(url, {
      headers: {
        Cookie:
          "_ga_GNR438JY8N=GS1.1.1729446000.1.1729446000.0.0.0; _ga=GA1.1.372196696.1722150754; unlocked=true",
      },
    });
    const episodeData = res.data;
    const $ = cheerio.load(episodeData);
    const links = $(".autohyperlink");
    links?.map((i, link) => {
      episodesLink.push({
        title: $(link).parent().children().remove().end().text() || "",
        link: $(link).attr("href") || "",
      });
    });

    return episodesLink;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export async function extractKmhdLink(
  katlink: string,
  providerContext: ProviderContext
) {
  try {
    const { axios } = providerContext;
    const res = await axios.get(katlink);
    const data = res.data;
    
    // Extract upload_links: get hubdrive_res ID
    const uploadLinksMatch = data.match(/upload_links:\s*{[^}]*?hubdrive_res:"([^"]+)"/);
    if (!uploadLinksMatch || !uploadLinksMatch[1]) {
      console.error("Failed to extract hubdrive_res ID from upload_links");
      return null;
    }
    const hubdriveId = uploadLinksMatch[1];
    
    // Extract links: get hubdrive_res base URL
    const linksMatch = data.match(/hubdrive_res:\s*{[^}]*?link:\s*"([^"]+)"/);
    if (!linksMatch || !linksMatch[1]) {
      console.error("Failed to extract hubdrive base URL from links");
      return null;
    }
    const hubdriveBaseUrl = linksMatch[1];
    
    // Construct final hubdrive link
    const finalLink = hubdriveBaseUrl + hubdriveId;
    console.log("Extracted hubdrive link:", finalLink);
    return finalLink;
  } catch (error: any) {
    console.error("Error in extractKmhdLink:", error.message);
    return null;
  }
}

async function extractKmhdEpisodes(
  katlink: string,
  providerContext: ProviderContext
) {
  try {
    const { axios } = providerContext;
    const res = await axios.get(katlink);
    const data = res.data;
    const ids = data.match(/[\w]+_[a-f0-9]{8}/g);
    if (!ids || ids.length === 0) {
      console.warn("No episodes found for katlink:", katlink);
      return [];
    }
    return ids;
  } catch (error: any) {
    console.error("Error in extractKmhdEpisodes:", error.message);
    return [];
  }
}
