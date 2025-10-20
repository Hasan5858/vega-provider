import { Stream, ProviderContext } from "../types";

async function extractKmhdLink(
  katlink: string,
  providerContext: ProviderContext
) {
  const { axios } = providerContext;
  try {
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
  const { axios, cheerio, extractors } = providerContext;
  const { hubcloudExtracter, gdFlixExtracter } = extractors;
  const streamLinks: Stream[] = [];
  console.log("katGetStream", link);
  try {
    if (link.includes("gdflix")) {
      return await gdFlixExtracter(link, signal);
    }
    if (link.includes("kmhd")) {
      const hubcloudLink = await extractKmhdLink(link, providerContext);
      if (!hubcloudLink) {
        console.error("Failed to extract hubcloud link from kmhd");
        return [];
      }
      return await hubcloudExtracter(hubcloudLink, signal);
    }
    const streams = await hubcloudExtracter(link, signal);
    return streams;
  } catch (error: any) {
    console.log("katgetStream error: ", error);
    return [];
  }
};
