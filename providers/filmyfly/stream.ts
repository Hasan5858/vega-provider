import { Stream, ProviderContext } from "../types";

export const getStream = async function ({
  link,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  try {
    // Update URL to use new domain
    const url = link.replace('filmyfly.deals', 'filmyfly.observer');
    const res = await providerContext.axios.get(url, { signal });
    const data = res.data;
    const $ = providerContext.cheerio.load(data);
    const streams: Stream[] = [];
    
    // Check if it's a direct download link (linkmake.in)
    if (url.includes('linkmake.in')) {
      streams.push({
        server: "Direct Download",
        link: url,
        type: "mkv",
      });
      return streams;
    }
    
    // Look for download buttons and links
    const elements = $(".dlbtn a, .button2,.button1,.button3,.button4,.button").toArray();
    const promises = elements.map(async (element) => {
      const title = $(element).text();
      let link = $(element).attr("href");
      
      if (title.includes("GDFLIX") && link) {
        const gdLinks = await providerContext.extractors.gdFlixExtracter(
          link,
          signal
        );
        streams.push(...gdLinks);
      }
      
      const alreadyAdded = streams.find((s) => s.link === link);
      if (
        title &&
        link &&
        !title.includes("Watch") &&
        !title.includes("Login") &&
        !title.includes("GoFile") &&
        !alreadyAdded
      ) {
        streams.push({
          server: title,
          link: link,
          type: "mkv",
        });
      }
    });
    
    await Promise.all(promises);
    return streams;
  } catch (err) {
    console.error(err);
    return [];
  }
};
