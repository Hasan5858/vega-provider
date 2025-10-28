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
    
    // Get stream data from API
    const apiUrl = `${baseUrl}/core/api/content/${slug}`;
    console.log("ridomovies stream API URL:", apiUrl);
    
    const res = await axios.get(apiUrl, { 
      headers: {
        ...headers,
        'Referer': baseUrl,
      }
    });
    
    const data = res.data;
    console.log("ridomovies stream API response:", data);
    
    if (!data?.data?.contentable) {
      throw new Error("No contentable data found for streaming");
    }
    
    const content = data.data.contentable;
    
    // Try to get video sources
    const videoUrl = `${baseUrl}/core/api/content/${slug}/videos`;
    console.log("ridomovies video URL:", videoUrl);
    
    try {
      const videoRes = await axios.get(videoUrl, {
        headers: {
          ...headers,
          'Referer': baseUrl,
        }
      });
      
      const videoData = videoRes.data;
      console.log("ridomovies video response:", videoData);
      
      if (videoData?.data?.videos) {
        videoData.data.videos.forEach((video: any) => {
          if (video?.url) {
            streamLinks.push({
              link: video.url,
              server: `rido ${video.quality || 'unknown'}`,
              type: video.type || "mp4",
              headers: {
                Referer: baseUrl,
                'User-Agent': headers['User-Agent'],
              },
            });
          }
        });
      }
    } catch (videoError) {
      console.log("ridomovies video API error:", videoError);
    }
    
    // If no videos found, try alternative method
    if (streamLinks.length === 0) {
      try {
        // Try to scrape the actual page for embedded players
        const pageRes = await axios.get(link, {
          headers: {
            ...headers,
            'Referer': baseUrl,
          }
        });
        
        const $ = cheerio.load(pageRes.data);
        
        // Look for video sources in the page
        $('video source, iframe').each((i, element) => {
          const src = $(element).attr('src');
          if (src && (src.includes('.mp4') || src.includes('.m3u8') || src.includes('player'))) {
            streamLinks.push({
              link: src.startsWith('http') ? src : `${baseUrl}${src}`,
              server: "rido embedded",
              type: src.includes('.m3u8') ? "m3u8" : "mp4",
              headers: {
                Referer: baseUrl,
                'User-Agent': headers['User-Agent'],
              },
            });
          }
        });
      } catch (pageError) {
        console.log("ridomovies page scraping error:", pageError);
      }
    }
    
    console.log("ridomovies stream links found:", streamLinks.length);
    return streamLinks;
  } catch (e) {
    console.log("ridomovies get stream error:", e);
    return [];
  }
};
