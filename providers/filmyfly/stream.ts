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
      
      // Skip unwanted links
      if (
        title.includes("Watch") ||
        title.includes("Login") ||
        title.includes("Signup") ||
        title.includes("Privacy") ||
        title.includes("DMCA") ||
        title.includes("Contact") ||
        title.includes("Linkmake") ||
        title.includes("Telegram")
      ) {
        return;
      }
      
      // If link is to filesdl.site, extract actual download URLs
      if (elementLink.includes("filesdl.site")) {
        try {
          const filesdlRes = await providerContext.axios.get(elementLink, { signal });
          const filesdl$ = providerContext.cheerio.load(filesdlRes.data);
          
          // Extract actual download links from filesdl page
          const downloadLinks = filesdl$("a[href]").toArray();
          
          for (const dlLink of downloadLinks) {
            const dlTitle = filesdl$(dlLink).text().trim();
            const dlHref = filesdl$(dlLink).attr("href");
            
            if (!dlHref || !dlTitle) continue;
            
            // Skip unwanted links
            if (
              dlTitle.includes("Watch") ||
              dlTitle.includes("Login") ||
              dlTitle.includes("Signup") ||
              dlTitle.includes("Telegram")
            ) {
              continue;
            }
            
            // Handle GoFile links
            if (dlHref.includes("gofile.io")) {
              const gofileId = dlHref.split("/d/")[1]?.split("?")[0];
              if (gofileId) {
                const gofileResult = await providerContext.extractors.gofileExtracter(gofileId);
                if (gofileResult.link) {
                  streams.push({
                    server: `${title} - ${dlTitle}`,
                    link: gofileResult.link,
                    type: "mkv",
                  });
                }
              }
              continue;
            }
            
            // Handle GDFLIX links
            if (dlHref.includes("gdflix")) {
              const gdLinks = await providerContext.extractors.gdFlixExtracter(
                dlHref,
                signal
              );
              streams.push(...gdLinks.map(s => ({
                ...s,
                server: `${title} - ${dlTitle}`
              })));
              continue;
            }
            
            // Handle HubCloud links
            if (dlHref.includes("hubcloud")) {
              const hubLinks = await providerContext.extractors.hubcloudExtracter(
                dlHref,
                signal
              );
              streams.push(...hubLinks.map(s => ({
                ...s,
                server: `${title} - ${dlTitle}`
              })));
              continue;
            }
            
            // Handle direct video links (Fast Cloud and Ultra FastDL only)
            // Skip Direct Download and Fast Cloud-02 (Cloudflare blocked)
            if (
              (dlTitle.includes("Fast Cloud") && !dlTitle.includes("Fast Cloud-02")) ||
              dlTitle.includes("Ultra FastDL")
            ) {
              // Check if link looks like a direct video URL
              if (
                dlHref.includes(".mkv") ||
                dlHref.includes(".mp4") ||
                dlHref.includes(".m3u8") ||
                dlHref.includes("awsstorage") ||
                dlHref.includes("download") ||
                dlHref.includes("filesd1.xyz")
              ) {
                streams.push({
                  server: `${title} - ${dlTitle}`,
                  link: dlHref,
                  type: "mkv",
                });
              }
            }
          }
        } catch (filesdlErr) {
          console.error("Error extracting from filesdl:", filesdlErr);
        }
        return;
      }
      
      // Handle GDFLIX links directly
      if (title.includes("GDFLIX") && elementLink) {
        const gdLinks = await providerContext.extractors.gdFlixExtracter(
          elementLink,
          signal
        );
        streams.push(...gdLinks);
        return;
      }
      
      // Handle GoFile links directly
      if (elementLink.includes("gofile.io")) {
        const gofileId = elementLink.split("/d/")[1]?.split("?")[0];
        if (gofileId) {
          const gofileResult = await providerContext.extractors.gofileExtracter(gofileId);
          if (gofileResult.link) {
            streams.push({
              server: title,
              link: gofileResult.link,
              type: "mkv",
            });
          }
        }
        return;
      }
      
      // Check if already added
      const alreadyAdded = streams.find((s) => s.link === elementLink);
      if (alreadyAdded) return;
      
      // Add the stream for other links
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
