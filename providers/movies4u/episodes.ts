import { EpisodeLink, ProviderContext } from "../types";

export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { axios, cheerio, commonHeaders: headers } = providerContext;
  console.log("getEpisodeLinks", url);
  try {
    const res = await axios.get(url, {
      headers: {
        ...headers,
        'Referer': 'https://movies4u.ps/'
      },
    });
    const $ = cheerio.load(res.data);
    
    const episodes: EpisodeLink[] = [];

    // Look for episode headings in H4 elements with pattern "-:Episodes: XX:-"
    $("h4").each((index, element) => {
      const el = $(element);
      const title = el.text().trim();
      
      // Check if this is an episode heading
      if (title.includes("Episodes:") && title.includes(":-")) {
        // Extract episode number and clean up title
        const episodeMatch = title.match(/-:Episodes:\s*(\d+):-/);
        if (episodeMatch) {
          const episodeNumber = episodeMatch[1];
          const cleanedTitle = `Episode ${episodeNumber}`;
          
          // Look for all server options for this episode
          const serverLinks: { title: string; link: string }[] = [];
          
          // Check next sibling elements for download links
          const nextElements = el.nextAll();
          for (let i = 0; i < nextElements.length && i < 10; i++) {
            const nextEl = $(nextElements[i]);
            
            // Stop if we hit the next episode heading
            if (nextEl.is('h4') && nextEl.text().includes('Episodes:')) {
              break;
            }
            
            // Look for server buttons in this element
            const links = nextEl.find('a[href]');
            links.each((j, linkEl) => {
              const $link = $(linkEl);
              const href = $link.attr('href');
              const text = $link.text().trim();
              
              // Look for specific server types
              if (href && text && (
                text.toLowerCase().includes('g-direct') ||
                text.toLowerCase().includes('v-cloud') ||
                text.toLowerCase().includes('filepress') ||
                text.toLowerCase().includes('instant') ||
                text.toLowerCase().includes('resumable') ||
                text.toLowerCase().includes('g-drive') ||
                href.includes('fastdl.zip') ||
                href.includes('vcloud.zip') ||
                href.includes('filebee.xyz')
              )) {
                // Determine server type
                let serverType = 'Unknown';
                if (text.toLowerCase().includes('g-direct') || href.includes('fastdl.zip')) {
                  serverType = 'G-Direct';
                } else if (text.toLowerCase().includes('v-cloud') || href.includes('vcloud.zip')) {
                  serverType = 'V-Cloud';
                } else if (text.toLowerCase().includes('filepress') || text.toLowerCase().includes('g-drive') || href.includes('filebee.xyz')) {
                  serverType = 'Filepress';
                }
                
                serverLinks.push({
                  title: `${serverType} - ${text}`,
                  link: href
                });
              }
            });
          }
          
          // If we found server links, create episodes for each server
          if (serverLinks.length > 0) {
            serverLinks.forEach((serverLink, serverIndex) => {
              episodes.push({
                title: `${cleanedTitle} - ${serverLink.title}`,
                link: serverLink.link,
              });
            });
          } else {
            // Fallback: use the base URL if no server links found
            episodes.push({
              title: cleanedTitle,
              link: url,
            });
          }
        }
      }
    });

    // If no H4 episodes found, try alternative selectors
    if (episodes.length === 0) {
      // Look for other episode patterns
      $("h3, h5").each((index, element) => {
        const el = $(element);
        const title = el.text().trim();
        
        if (title.toLowerCase().includes('episode') || 
            title.match(/\d+/)) {
          
          // Look for download links
          let downloadLink = "";
          const nextElements = el.nextAll();
          for (let i = 0; i < nextElements.length && i < 3; i++) {
            const nextEl = $(nextElements[i]);
            const links = nextEl.find('a[href]');
            
            links.each((j, linkEl) => {
              const $link = $(linkEl);
              const href = $link.attr('href');
              if (href && (href.includes('hubcloud') || href.includes('nexdrive'))) {
                downloadLink = href;
                return false;
              }
            });
            
            if (downloadLink) break;
          }
          
          if (!downloadLink) {
            downloadLink = url;
          }
          
          episodes.push({
            title: title.replace(/[-:]/g, "").trim(),
            link: downloadLink,
          });
        }
      });
    }

    console.log(`Found ${episodes.length} episodes`);
    return episodes;
  } catch (err: any) {
    console.log("getEpisodeLinks error:", err.message);
    return [];
  }
};