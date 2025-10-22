import { EpisodeLink, ProviderContext } from "../types";

export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  try {
    const headers = providerContext.commonHeaders;
    const { axios, cheerio } = providerContext;
    // Update URL to use new domain
    const updatedUrl = url.replace('filmyfly.deals', 'filmyfly.observer');
    const res = await axios.get(updatedUrl, { headers });
    const data = res.data;
    const $ = cheerio.load(data);
    const episodeLinks: EpisodeLink[] = [];

    // Look for download links in the new structure
    $(".dlbtn a, .dlink.dl").each((i, element) => {
      const title = $(element)
        .text()
        ?.replace("Download", "")
        ?.trim();
      const link = $(element).attr("href");

      if (title && link) {
        episodeLinks.push({
          title,
          link,
        });
      }
    });
    
    return episodeLinks;
  } catch (err) {
    console.error("cl episode links", err);
    return [];
  }
};
