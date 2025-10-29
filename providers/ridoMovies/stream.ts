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
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          withCredentials: true,
        });
        
        // Extract cookies from response for subsequent requests
        const setCookieHeaders = embedRes.headers['set-cookie'] || [];
        const cookies = setCookieHeaders.join('; ');
        
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
                  Referer: 'https://closeload.top/',
                  Origin: 'https://closeload.top',
                  'User-Agent': headers['User-Agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                  'Accept': '*/*',
                  'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
                  'Accept-Encoding': 'gzip, deflate, br, zstd',
                  ...(cookies && { Cookie: cookies }),
                },
              });
            }
          } catch (parseError) {
            console.log("ridomovies JSON-LD parse error:", parseError);
          }
        });
        
        // Also look for HLS URLs in script tags (including obfuscated JavaScript)
        $embed('script').each((i, element) => {
          const text = $embed(element).text();
          
          if (!text) return;
          
          // Look for HLS master playlist URLs (including .txt extensions and various patterns)
          const hlsPatterns = [
            /https?:\/\/[^\s"']+\/(?:hls|master|playlist)[^\s"']*\.(m3u8|txt)/gi,
            /https?:\/\/[^\s"']+\.(playmix|cdnimages)[^\s"']*\/hls\/[^\s"']*(?:\.mp4)?\/?txt\/master\.txt/gi, // /txt/master.txt format
            /https?:\/\/[^\s"']+\.(playmix|cdnimages)[^\s"']*\/hls\/[^\s"']*\.(mp4|txt)/gi,
            /https?:\/\/[^\s"']*\/(?:txt\/)?master\.txt/gi,
            /contentUrl["']?\s*:\s*["'](https?:\/\/[^"']+(?:\/txt\/)?master\.txt[^"']*)/gi,
            /src["']?\s*:\s*["'](https?:\/\/[^"']+(?:\/txt\/)?master\.txt[^"']*)/gi,
            /https?:\/\/srv\d+\.cdnimages\d+\.sbs\/hls\/[^\s"']+\.mp4\/txt\/master\.txt/gi, // Exact pattern from the network request
          ];
          
          hlsPatterns.forEach(pattern => {
            const matches = text.match(pattern);
            if (matches) {
              matches.forEach(url => {
                // Clean up the URL (remove quotes, whitespace)
                const cleanUrl = url.replace(/["'\s]/g, '').trim();
                if (cleanUrl && cleanUrl.includes('http')) {
                  streamLinks.push({
                    link: cleanUrl,
                    server: "rido hls",
                    type: "m3u8",
                    headers: {
                      Referer: 'https://closeload.top/',
                      Origin: 'https://closeload.top',
                      'User-Agent': headers['User-Agent'] || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36',
                      'Accept': '*/*',
                      'Accept-Language': 'en-US,en;q=0.9,bn;q=0.8',
                      'Accept-Encoding': 'gzip, deflate, br, zstd',
                      ...(cookies && { Cookie: cookies }),
                    },
                  });
                }
              });
            }
          });
        });
        
        // Remove duplicates based on link
        const uniqueStreams = streamLinks.filter((stream, index, self) => 
          index === self.findIndex(s => s.link === stream.link)
        );
        streamLinks.length = 0;
        streamLinks.push(...uniqueStreams);
        
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
