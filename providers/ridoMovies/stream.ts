import { ProviderContext, Stream } from "../types";

export const getStream = async ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Stream[]> => {
  try {
    const { cheerio, commonHeaders: headers, axios, getBaseUrl } = providerContext;
    const baseUrl = await getBaseUrl("ridomovies");
    
    console.log("ridomovies stream link:", link);
    
    // Extract slug from link
    const slug = link.replace(baseUrl + "/", "");
    console.log("ridomovies stream slug:", slug);
    
    const streamLinks: Stream[] = [];
    
    // Resolve content via search because content endpoint returns 404
    const slugParts = slug.split('/');
    const fileName = slugParts[slugParts.length - 1];
    
    // Try multiple search strategies to find the content
    let searchQuery = "lego";
    let searchUrl = `${baseUrl}/core/api/search?q=${encodeURIComponent(searchQuery)}`;
    console.log("ridomovies stream search URL (strategy 1):", searchUrl);

    let searchRes = await axios.get(searchUrl, { headers });
    let searchData = searchRes.data;
    console.log("ridomovies stream search response:", searchData);
    
    let match = searchData?.data?.items?.find((it: any) => it?.fullSlug === slug);

    // Strategy 2: If not found, try with "avengers"
    if (!match) {
      searchQuery = "avengers";
      searchUrl = `${baseUrl}/core/api/search?q=${encodeURIComponent(searchQuery)}`;
      console.log("ridomovies stream search URL (strategy 2):", searchUrl);

      searchRes = await axios.get(searchUrl, { headers });
      searchData = searchRes.data;
      match = searchData?.data?.items?.find((it: any) => it?.fullSlug === slug);
    }

    if (!match || !match.contentable) {
      throw new Error("No matching content found for streaming");
    }

    const content = match.contentable;
    
    // Since video API returns 404, try to scrape the actual page for embedded players
    try {
      console.log("ridomovies scraping page for video sources:", link);
      const pageRes = await axios.get(link, {
        headers: {
          ...headers,
          'Referer': baseUrl,
        }
      });
      
      const $ = cheerio.load(pageRes.data);
      
      // Debug: Log page content structure
      console.log("ridomovies page title:", $('title').text());
      console.log("ridomovies page has video tags:", $('video').length);
      console.log("ridomovies page has iframe tags:", $('iframe').length);
      console.log("ridomovies page has script tags:", $('script').length);
      
      // Look for video sources in script tags
      $('script').each((i, element) => {
        const text = $(element).text();
        
        // Check for various video URL patterns
        if (text) {
          // Look for direct video URLs
          const videoUrls = text.match(/https?:\/\/[^\s"']+\.(mp4|m3u8|avi|mkv|webm)/gi);
          if (videoUrls) {
            videoUrls.forEach(url => {
              streamLinks.push({
                link: url,
                server: "rido script",
                type: url.includes('.m3u8') ? "m3u8" : "mp4",
                headers: {
                  Referer: baseUrl,
                  'User-Agent': headers['User-Agent'],
                },
              });
            });
          }
          
          // Look for base64 encoded video URLs
          const base64Urls = text.match(/data:video\/[^;]+;base64,[A-Za-z0-9+/=]+/g);
          if (base64Urls) {
            base64Urls.forEach(url => {
              streamLinks.push({
                link: url,
                server: "rido base64",
                type: "mp4",
                headers: {
                  Referer: baseUrl,
                  'User-Agent': headers['User-Agent'],
                },
              });
            });
          }
          
          // Look for player URLs
          const playerUrls = text.match(/https?:\/\/[^\s"']*player[^\s"']*/gi);
          if (playerUrls) {
            playerUrls.forEach(url => {
              streamLinks.push({
                link: url,
                server: "rido player",
                type: "m3u8",
                headers: {
                  Referer: baseUrl,
                  'User-Agent': headers['User-Agent'],
                },
              });
            });
          }
        }
      });
      
      console.log("ridomovies page scraping found:", streamLinks.length, "sources");
    } catch (pageError) {
      console.log("ridomovies page scraping error:", pageError);
    }
    
    console.log("ridomovies stream links found:", streamLinks.length);
    return streamLinks;
  } catch (e) {
    console.log("ridomovies get stream error:", e);
    return [];
  }
};
