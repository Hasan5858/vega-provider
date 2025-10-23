import { Stream, ProviderContext } from "../types";

// Helper function to extract quality from quality text
function extractQualityFromText(qualityText: string): "360" | "480" | "720" | "1080" | "2160" | undefined {
  const text = qualityText.toLowerCase();
  if (text.includes('1080p') || text.includes('1080')) return '1080';
  if (text.includes('720p') || text.includes('720')) return '720';
  if (text.includes('480p') || text.includes('480')) return '480';
  if (text.includes('4k') || text.includes('2160p') || text.includes('2160')) return '2160';
  if (text.includes('360p') || text.includes('360')) return '360';
  return undefined;
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
  try {
    // Update URL to use new domain
    const url = link.replace('filmyfly.deals', 'filmyfly.observer');
    const res = await providerContext.axios.get(url, { signal });
    const data = res.data;
    const $ = providerContext.cheerio.load(data);
    const streams: Stream[] = [];
    
    // Check if it's a linkmake.in URL - follow it to get quality options
    if (url.includes('linkmake.in')) {
      try {
        // Follow the linkmake.in URL to get the quality selection page
        const linkmakeRes = await providerContext.axios.get(url, { signal });
        const linkmakeData = linkmakeRes.data;
        const linkmake$ = providerContext.cheerio.load(linkmakeData);
        
        // Look for download quality links (they are direct <a> tags)
        const qualityPromises: Promise<void>[] = [];
        
        linkmake$('a').each((i, element) => {
          const qualityText = linkmake$(element).text().trim();
          const qualityLink = linkmake$(element).attr('href');
          
          if (qualityText && qualityText.includes('Download') && qualityLink && qualityLink.includes('filesdl')) {
            const fullLink = qualityLink.startsWith('http') ? qualityLink : `https://linkmake.in${qualityLink}`;
            
            // Follow each quality link to get the server options
            const promise = (async () => {
              try {
                const serverRes = await providerContext.axios.get(fullLink, { signal });
                const serverData = serverRes.data;
                const server$ = providerContext.cheerio.load(serverData);
                
                // Look for server download buttons (like in the second screenshot)
                const serverPromises: Promise<void>[] = [];
                
                server$('a[href], button[onclick]').each((j, serverElement) => {
                  const serverText = server$(serverElement).text().trim();
                  const serverLink = server$(serverElement).attr('href') || server$(serverElement).attr('onclick');
                  
                  if (serverText && serverLink) {
                    const finalLink = serverLink.startsWith('http') ? serverLink : 
                                    serverLink.startsWith('/') ? `https://${new URL(fullLink).hostname}${serverLink}` : 
                                    fullLink;
                    
                    // Use appropriate extractor based on server type
                    const promise = (async () => {
                      try {
                        if (serverText.toLowerCase().includes('gofile') || finalLink.includes('gofile.io')) {
                          // Use gofile extractor - extract ID from URL
                          const gofileId = finalLink.includes('gofile.io/d/') 
                            ? finalLink.split('/d/')[1]?.split('?')[0] 
                            : finalLink.split('/').pop();
                          if (gofileId) {
                            try {
                              const gofileResult = await providerContext.extractors.gofileExtracter(gofileId);
                              if (gofileResult.link) {
                                const quality = extractQualityFromText(qualityText);
                                streams.push({
                                  server: "GoFile",
                                  link: gofileResult.link,
                                  type: "mkv",
                                  quality: quality,
                                });
                              }
                            } catch (gofileError) {
                              console.error('GoFile extraction failed:', gofileError);
                            }
                          }
                        } else if (serverText.toLowerCase().includes('gdflix') || finalLink.includes('gdflix')) {
                          // Use gdflix extractor
                          const gdflixStreams = await providerContext.extractors.gdFlixExtracter(finalLink, signal);
                          const quality = extractQualityFromText(qualityText);
                          gdflixStreams.forEach(stream => {
                            streams.push({
                              server: stream.server,
                              link: stream.link,
                              type: stream.type,
                              quality: quality,
                            });
                          });
                        } else if (serverText.toLowerCase().includes('hubcloud') || 
                                   serverText.toLowerCase().includes('ultra fastdl') || 
                                   serverText.toLowerCase().includes('fastdl') ||
                                   serverText.toLowerCase().includes('direct download') || 
                                   serverText.toLowerCase().includes('fast cloud-02')) {
                          // Use hubcloud extractor for hubcloud/fastdl links
                          const hubcloudStreams = await providerContext.extractors.hubcloudExtracter(finalLink, signal);
                          const quality = extractQualityFromText(qualityText);
                          hubcloudStreams.forEach(stream => {
                            streams.push({
                              server: stream.server,
                              link: stream.link,
                              type: stream.type,
                              quality: quality,
                            });
                          });
                        } else {
                          // For Fast Cloud AWS and other direct links, add them directly
                          // Let the player's auto-switch feature handle broken links
                          const quality = extractQualityFromText(qualityText);
                          streams.push({
                            server: serverText || "Direct",
                            link: finalLink,
                            type: "mkv",
                            quality: quality,
                          });
                        }
                      } catch (extractorError) {
                        console.error(`Error extracting from ${serverText}:`, extractorError);
                        // Add as fallback - let player handle errors
                        const quality = extractQualityFromText(qualityText);
                        streams.push({
                          server: serverText || "Fallback",
                          link: finalLink,
                          type: "mkv",
                          quality: quality,
                        });
                      }
                    })();
                    
                    serverPromises.push(promise);
                  }
                });
                
                // Wait for all server extractions to complete
                await Promise.all(serverPromises);
              } catch (serverError) {
                console.error(`Error following quality link ${fullLink}:`, serverError);
                // Fallback to quality link itself
                streams.push({
                  server: qualityText,
                  link: fullLink,
                  type: "mkv",
                });
              }
            })();
            
            qualityPromises.push(promise);
          }
        });
        
        // Wait for all quality links to be processed
        await Promise.all(qualityPromises);
        
        // If no quality buttons found, look for any download links
        if (streams.length === 0) {
          linkmake$('a').each((i, element) => {
            const linkText = linkmake$(element).text().trim();
            const linkHref = linkmake$(element).attr('href');
            
            if (linkText.toLowerCase().includes('download') && linkHref && !linkHref.includes('javascript:')) {
              streams.push({
                server: linkText,
                link: linkHref.startsWith('http') ? linkHref : `https://linkmake.in${linkHref}`,
                type: "mkv",
              });
            }
          });
        }
        
        return streams;
      } catch (linkmakeError) {
        console.error('Error following linkmake.in URL:', linkmakeError);
        // Fallback to direct link
        streams.push({
          server: "Direct Download",
          link: url,
          type: "mkv",
        });
        return streams;
      }
    }
    
    // Look for download buttons and links on regular pages
    const elements = $(".dlbtn a, .button2,.button1,.button3,.button4,.button").toArray();
    const promises = elements.map(async (element) => {
      const title = $(element).text();
      let link = $(element).attr("href");
      
      if (!link) return;
      
      // Use extractors for all links to ensure they resolve to direct file URLs
      if (title.includes("GDFLIX") && link) {
        const gdLinks = await providerContext.extractors.gdFlixExtracter(
          link,
          signal
        );
        streams.push(...gdLinks);
      } else if ((title.toLowerCase().includes("gofile") || link.includes("gofile.io")) && link) {
        // Extract GoFile ID from URL
        const gofileId = link.includes('gofile.io/d/') 
          ? link.split('/d/')[1]?.split('?')[0] 
          : link.split('/').pop();
        if (gofileId) {
          try {
            const gofileResult = await providerContext.extractors.gofileExtracter(gofileId);
            if (gofileResult.link) {
              streams.push({
                server: "GoFile",
                link: gofileResult.link,
                type: "mkv",
                quality: extractQualityFromText(title)
              });
            }
          } catch (gofileError) {
            console.error('GoFile extraction failed:', gofileError);
          }
        }
      } else if (link.includes("hubcloud") || link.includes("bbdownload") || title.includes("HubCloud")) {
        const hubcloudLinks = await providerContext.extractors.hubcloudExtracter(
          link,
          signal
        );
        streams.push(...hubcloudLinks);
      } else if (link && !title.includes("Watch") && !title.includes("Login")) {
        // For other links, try to extract direct URLs
        try {
          const response = await providerContext.axios.get(link, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            timeout: 10000
          });
          
          const $page = providerContext.cheerio.load(response.data);
          
          // Look for direct download links
          const directLinks = $page('a[href*=".mkv"], a[href*=".mp4"], a[href*=".avi"], a[href*=".mov"]').toArray();
          
          if (directLinks.length > 0) {
            const directLink = $page(directLinks[0]).attr('href');
            if (directLink && directLink.includes('.')) {
              const fullUrl = directLink.startsWith('http') ? directLink : `${link.split('/').slice(0, 3).join('/')}${directLink}`;
              streams.push({
                server: title,
                link: fullUrl,
                type: "mkv",
                quality: extractQualityFromText(title)
              });
            }
          }
        } catch (error) {
          console.log('Failed to extract direct URL from:', link);
        }
      }
    });
    
    await Promise.all(promises);
    return streams;
  } catch (err) {
    console.error(err);
    return [];
  }
};
