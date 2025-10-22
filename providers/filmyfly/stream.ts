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
                        if (serverText.toLowerCase().includes('fast cloud') || serverText.toLowerCase().includes('aws')) {
                          // Direct AWS links - no extraction needed
                          streams.push({
                            server: `${qualityText} - ${serverText}`,
                            link: finalLink,
                            type: "mkv",
                          });
                        } else if (serverText.toLowerCase().includes('gofile')) {
                          // Use gofile extractor
                          const gofileId = finalLink.split('/').pop();
                          if (gofileId) {
                            const gofileResult = await providerContext.extractors.gofileExtracter(gofileId);
                            if (gofileResult.link) {
                              streams.push({
                                server: `${qualityText} - GoFile`,
                                link: gofileResult.link,
                                type: "mkv",
                              });
                            }
                          }
                        } else if (serverText.toLowerCase().includes('gdflix')) {
                          // Use gdflix extractor
                          const gdflixStreams = await providerContext.extractors.gdFlixExtracter(finalLink, signal);
                          gdflixStreams.forEach(stream => {
                            streams.push({
                              server: `${qualityText} - ${stream.server}`,
                              link: stream.link,
                              type: stream.type,
                            });
                          });
                        } else if (serverText.toLowerCase().includes('ultra fastdl') || 
                                   serverText.toLowerCase().includes('fastdl')) {
                          // Use hubcloud extractor for FastDL links
                          const hubcloudStreams = await providerContext.extractors.hubcloudExtracter(finalLink, signal);
                          hubcloudStreams.forEach(stream => {
                            streams.push({
                              server: `${qualityText} - ${stream.server}`,
                              link: stream.link,
                              type: stream.type,
                            });
                          });
                        } else if (serverText.toLowerCase().includes('direct download') || 
                                   serverText.toLowerCase().includes('fast cloud-02')) {
                          // Use hubcloud extractor for FilesDL links
                          const hubcloudStreams = await providerContext.extractors.hubcloudExtracter(finalLink, signal);
                          hubcloudStreams.forEach(stream => {
                            streams.push({
                              server: `${qualityText} - ${stream.server}`,
                              link: stream.link,
                              type: stream.type,
                            });
                          });
                        }
                      } catch (extractorError) {
                        console.error(`Error extracting from ${serverText}:`, extractorError);
                        // Fallback to direct link
                        streams.push({
                          server: `${qualityText} - ${serverText}`,
                          link: finalLink,
                          type: "mkv",
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
      
      if (title.includes("GDFLIX") && link) {
        const gdLinks = await providerContext.extractors.gdFlixExtracter(
          link,
          signal
        );
        streams.push(...gdLinks);
      }
      
      const alreadyAdded = streams.find((s) => s.link === link);
      if (
        title &&
        link &&
        !title.includes("Watch") &&
        !title.includes("Login") &&
        !title.includes("GoFile") &&
        !alreadyAdded
      ) {
        streams.push({
          server: title,
          link: link,
          type: "mkv",
        });
      }
    });
    
    await Promise.all(promises);
    return streams;
  } catch (err) {
    console.error(err);
    return [];
  }
};
