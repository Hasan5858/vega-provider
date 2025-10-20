import { Stream, ProviderContext } from "../types";

async function extractKmhdLink(
  katlink: string,
  providerContext: ProviderContext
) {
  const { axios } = providerContext;
  try {
    const res = await axios.get(katlink);
    const data = res.data;
    
    // Extract the new 1xplayer pattern
    const chibiPathMatch = data.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
    if (!chibiPathMatch || !chibiPathMatch[1]) {
      console.error("Failed to extract PUBLIC_CHIBI_PATH from data");
      return null;
    }
    const baseUrl = chibiPathMatch[1];
    
    // Extract file ID from the original link
    const fileIdMatch = katlink.match(/\/file\/([^\/]+)$/);
    if (!fileIdMatch || !fileIdMatch[1]) {
      console.error("Failed to extract file ID from link");
      return null;
    }
    const fileId = fileIdMatch[1];
    
    // Construct final streaming link
    const finalLink = `${baseUrl}/${fileId}`;
    console.log("Extracted 1xplayer link:", finalLink);
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
