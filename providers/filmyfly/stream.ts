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
    const res = await providerContext.axios.get(link, { signal });
    const data = res.data;
    const $ = providerContext.cheerio.load(data);
    const streams: Stream[] = [];
    
    // For linkmake.in pages, look for download links
    // For direct movie pages, look for button classes
    const elements = $("a[href]:contains('Download'), .button2,.button1,.button3,.button4,.button").toArray();
    
    const promises = elements.map(async (element) => {
      const title = $(element).text().trim();
      let elementLink = $(element).attr("href");
      
      if (!title || !elementLink) return;
      
      // Handle GDFLIX links
      if (title.includes("GDFLIX") && elementLink) {
        const gdLinks = await providerContext.extractors.gdFlixExtracter(
          elementLink,
          signal
        );
        streams.push(...gdLinks);
        return;
      }
      
      // Skip unwanted links
      if (
        title.includes("Watch") ||
        title.includes("Login") ||
        title.includes("Signup") ||
        title.includes("Privacy") ||
        title.includes("DMCA") ||
        title.includes("Contact") ||
        title.includes("Linkmake")
      ) {
        return;
      }
      
      // Check if already added
      const alreadyAdded = streams.find((s) => s.link === elementLink);
      if (alreadyAdded) return;
      
      // Add the stream
      streams.push({
        server: title,
        link: elementLink,
        type: "mkv",
      });
    });
    
    await Promise.all(promises);
    return streams;
  } catch (err) {
    console.error(err);
    return [];
  }
};
