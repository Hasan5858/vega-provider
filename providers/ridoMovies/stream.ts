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
    
    // Extract slug from the movie link to call API
    // Link format: https://ridomovies.tv/movies/frankenstein-2025
    // Need to extract: frankenstein-2025
    const slugParts = slug.split('/');
    const movieSlug = slugParts[slugParts.length - 1]; // Get last part (e.g., "frankenstein-2025")
    
    console.log("ridomovies movie slug:", movieSlug);
    
    // Get embed link from API
    let embedUrl: string | null = null;
    try {
      const apiUrl = `${baseUrl}/api/movies/${movieSlug}`;
      console.log("ridomovies API URL for embed:", apiUrl);
      
      const apiRes = await axios.get(apiUrl, {
        headers: {
          ...headers,
          'Referer': link,
          'Accept': '*/*',
        }
      });
      
      const apiData = apiRes.data;
      console.log("ridomovies API response:", JSON.stringify(apiData, null, 2));
      
      if (apiData?.code === 200 && apiData?.data && Array.isArray(apiData.data) && apiData.data.length > 0) {
        // Get the first available stream
        const streamData = apiData.data[0];
        const embedLink = streamData.link;
        
        if (embedLink) {
          // Construct embed URL: https://closeload.top/video/embed/{link}/
          embedUrl = `https://closeload.top/video/embed/${embedLink}/`;
          console.log("ridomovies embed URL constructed:", embedUrl);
        } else {
          console.log("ridomovies warning: No link field in API response");
        }
      } else {
        console.log("ridomovies warning: Invalid API response structure");
      }
    } catch (apiError: any) {
      console.log("ridomovies API error:", apiError.message);
      if (apiError.response) {
        console.log("ridomovies API error response:", apiError.response.status, apiError.response.data);
      }
    }
    
    // Fetch the embed page to extract HLS stream URL
    if (embedUrl) {
      try {
        console.log("ridomovies fetching embed page:", embedUrl);
        const embedRes = await axios.get(embedUrl, {
          headers: {
            ...headers,
            'Referer': link,
          }
        });
        
        const $embed = cheerio.load(embedRes.data);
        
        // Extract contentUrl from JSON-LD structured data
        $embed('script[type="application/ld+json"]').each((i, element) => {
          try {
            const jsonText = $embed(element).text();
            const jsonData = JSON.parse(jsonText);
            
            if (jsonData['@type'] === 'VideoObject' && jsonData.contentUrl) {
              const contentUrl = jsonData.contentUrl;
              console.log("ridomovies contentUrl found:", contentUrl);
              
              // Determine stream type based on URL
              // Priority: Check for HLS indicators first (even if URL has .mp4, if it's in /hls/ path, it's HLS)
              let streamType = "m3u8";
              if (contentUrl.includes('/hls/') || contentUrl.includes('master.txt') || contentUrl.includes('.m3u8')) {
                streamType = "m3u8"; // HLS stream
              } else if (contentUrl.includes('.mp4') && !contentUrl.includes('/hls/')) {
                streamType = "mp4"; // Direct MP4 stream
              }
              
              streamLinks.push({
                link: contentUrl,
                server: "rido closeload",
                type: streamType,
                headers: {
                  Referer: embedUrl,
                  'User-Agent': headers['User-Agent'],
                },
              });
            }
          } catch (parseError) {
            console.log("ridomovies JSON-LD parse error:", parseError);
          }
        });
        
        // Fallback: Look for HLS URLs in script tags if JSON-LD didn't work
        if (streamLinks.length === 0) {
          $embed('script').each((i, element) => {
            const text = $embed(element).text();
            
            // Look for HLS master playlist URLs (including .txt extensions)
            const hlsMatch = text.match(/https?:\/\/[^\s"']+\/(?:hls|master|playlist)[^\s"']*\.(m3u8|txt)/gi);
            if (hlsMatch) {
              hlsMatch.forEach(url => {
                streamLinks.push({
                  link: url,
                  server: "rido hls",
                  type: "m3u8",
                  headers: {
                    Referer: embedUrl,
                    'User-Agent': headers['User-Agent'],
                  },
                });
              });
            }
          });
        }
        
        console.log("ridomovies stream extraction found:", streamLinks.length, "sources");
      } catch (embedError) {
        console.log("ridomovies embed page error:", embedError);
      }
    } else {
      console.log("ridomovies error: Could not get embed URL from API");
    }
    
    console.log("ridomovies stream links found:", streamLinks.length);
    return streamLinks;
  } catch (e) {
    console.log("ridomovies get stream error:", e);
    return [];
  }
};
