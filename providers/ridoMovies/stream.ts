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
        
        // Also check video element data attributes for source
        $embed('video, [data-video], [data-src]').each((i, element) => {
          const dataSrc = $embed(element).attr('data-src') || $embed(element).attr('data-video') || $embed(element).attr('src');
          if (dataSrc && (dataSrc.includes('/hls/') || dataSrc.includes('master.txt'))) {
            streamLinks.push({
              link: dataSrc.startsWith('http') ? dataSrc : `https://${new URL(embedUrl).host}${dataSrc}`,
              server: "rido video element",
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
        
        // Also look for HLS URLs in script tags (including obfuscated JavaScript)
        $embed('script').each((i, element) => {
          const text = $embed(element).text();
          
          if (!text) return;
          
          // Look for HLS master playlist URLs (including .txt extensions and various patterns)
          const hlsPatterns = [
            // Exact CDN pattern from network request
            /https?:\/\/srv\d+\.cdnimages\d+\.sbs\/hls\/[^\s"'<>)]+\.mp4\/txt\/master\.txt/gi,
            // General cdnimages pattern
            /https?:\/\/[^\s"'<>)]+cdnimages\d+\.sbs\/hls\/[^\s"'<>)]+\.mp4\/txt\/master\.txt/gi,
            // playmix patterns
            /https?:\/\/[^\s"'<>)]+\.playmix\.uno\/hls\/[^\s"'<>)]+\/master\.txt/gi,
            // General patterns
            /https?:\/\/[^\s"']+\/(?:hls|master|playlist)[^\s"']*\.(m3u8|txt)/gi,
            /https?:\/\/[^\s"']+\.(playmix|cdnimages)[^\s"']*\/hls\/[^\s"']*(?:\.mp4)?\/?txt\/master\.txt/gi,
            /https?:\/\/[^\s"']+\.(playmix|cdnimages)[^\s"']*\/hls\/[^\s"']*\.(mp4|txt)/gi,
            /https?:\/\/[^\s"']*\/(?:txt\/)?master\.txt/gi,
            // Video.js src patterns
            /(?:src|source|url)\s*[:=]\s*["'](https?:\/\/[^"']+(?:\/txt\/)?master\.txt[^"']*)/gi,
            /contentUrl["']?\s*:\s*["'](https?:\/\/[^"']+(?:\/txt\/)?master\.txt[^"']*)/gi,
            // Base64 encoded URLs (decode them)
            /(?:atob|decodeURIComponent)\(['"]([A-Za-z0-9+/=]+)['"]\)/gi,
          ];
          
          hlsPatterns.forEach((pattern, patternIndex) => {
            const matches = text.match(pattern);
            if (matches) {
              matches.forEach(match => {
                let cleanUrl: string | null = null;
                
                // Handle base64 encoded URLs (pattern index 10)
                if (patternIndex === 10) {
                  try {
                    // Try to decode base64
                    const decoded = Buffer.from(match, 'base64').toString('utf-8');
                    // Check if decoded string contains HLS URL
                    const urlMatch = decoded.match(/https?:\/\/[^\s"']+\/(?:hls|txt|master)[^\s"']*master\.txt/gi);
                    if (urlMatch) {
                      cleanUrl = urlMatch[0];
                    }
                  } catch (e) {
                    // Base64 decode failed, skip
                  }
                } else {
                  // Extract URL from match (handle capture groups)
                  if (match.includes('http')) {
                    cleanUrl = match.replace(/["'\s()]/g, '').trim();
                  } else if (match.match(/^[A-Za-z0-9+/=]+$/)) {
                    // Might be base64, try decoding
                    try {
                      const decoded = Buffer.from(match, 'base64').toString('utf-8');
                      const urlMatch = decoded.match(/https?:\/\/[^\s"']+/gi);
                      if (urlMatch) {
                        cleanUrl = urlMatch[0];
                      }
                    } catch (e) {
                      // Not base64 or decode failed
                    }
                  }
                }
                
                if (cleanUrl && cleanUrl.includes('http') && (cleanUrl.includes('/hls/') || cleanUrl.includes('master.txt'))) {
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
        
        // Prioritize cdnimages*.sbs URLs over playmix.uno (cdnimages is the actual working CDN)
        streamLinks.sort((a, b) => {
          const aIsCdnImages = a.link.includes('cdnimages') && a.link.includes('.sbs');
          const bIsCdnImages = b.link.includes('cdnimages') && b.link.includes('.sbs');
          if (aIsCdnImages && !bIsCdnImages) return -1;
          if (!aIsCdnImages && bIsCdnImages) return 1;
          return 0;
        });
        
        console.log("ridomovies prioritized streams (cdnimages first):", streamLinks.map(s => s.link));
        
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
