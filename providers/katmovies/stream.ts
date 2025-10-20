import { Stream, ProviderContext } from "../types";

async function extractKmhdLink(
  katlink: string,
  providerContext: ProviderContext
) {
  const { axios } = providerContext;
  try {
    const res = await axios.get(katlink);
    const data = res.data;
    
    const hubDriveResMatch = data.match(/hubdrive_res:\s*"([^"]+)"/);
    if (!hubDriveResMatch || !hubDriveResMatch[1]) {
      console.error("Failed to extract hubDriveRes from katlink");
      return null;
    }
    const hubDriveRes = hubDriveResMatch[1];
    
    const hubDriveLinkMatch = data.match(
      /hubdrive_res\s*:\s*{[^}]*?link\s*:\s*"([^"]+)"/
    );
    if (!hubDriveLinkMatch || !hubDriveLinkMatch[1]) {
      console.error("Failed to extract hubDriveLink from katlink");
      return null;
    }
    const hubDriveLink = hubDriveLinkMatch[1];
    
    return hubDriveLink + hubDriveRes;
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
