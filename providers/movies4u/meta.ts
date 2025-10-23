import { Info, Link, ProviderContext } from "../types";

const headers = {
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Cache-Control": "no-store",
  "Accept-Language": "en-US,en;q=0.9",
  DNT: "1",
  "sec-ch-ua":
    '"Not_A Brand";v="8", "Chromium";v="120", "Microsoft Edge";v="120"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};

export const getMeta = async ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> => {
  try {
    const { axios, cheerio } = providerContext;
    const baseUrl = link.split("/").slice(0, 3).join("/");
    
    const response = await axios.get(link, {
      headers: {
        ...headers,
        Referer: baseUrl,
      },
    });
    
    const $ = cheerio.load(response.data);
    const infoContainer = $(".entry-content, .post-inner, .movie-info");
    
    // --- Type Detection ---
    const title = $("h1.page-title").text().trim() || $("h1.entry-title").text().trim() || $("h1").text().trim();
    const infoParagraph = $(".entry-content p").first().text();
    const bodyText = $("body").text().toLowerCase();
    
    // Check for series indicators in title first (higher priority)
    const seriesIndicators = [
      "season", "episode", "s0", "e0", "series", "tv-show", "web-series",
      "season 2", "season 3", "s02", "s03", "e01", "e02", "e03", "e04", "e05",
      "episodes", "complete", "all episodes", "s19", "s20", "s21", "s22", "s23", "s24", "s25"
    ];
    
    const hasSeriesIndicators = seriesIndicators.some(indicator => 
      title.toLowerCase().includes(indicator) ||
      infoParagraph.toLowerCase().includes(indicator) ||
      bodyText.includes(indicator)
    );
    
    // Check for movie indicators
    const movieIndicators = [
      "full movie", "hindi movie", "bollywood movie", "hollywood movie",
      "hdtc", "bluray", "web-dl", "dvdrip", "brrip", "film", "movie"
    ];
    
    const hasMovieIndicators = movieIndicators.some(indicator =>
      title.toLowerCase().includes(indicator) ||
      infoParagraph.toLowerCase().includes(indicator)
    );
    
    // Determine type based on movies4u patterns
    let type = "movie"; // default
    if (hasSeriesIndicators && !hasMovieIndicators) {
      type = "series";
    } else if (hasMovieIndicators) {
      type = "movie";
    }
    
    // --- Title ---
    const cleanTitle = title.split(/\[| \d+p| x\d+/)[0].trim();
    const showNameMatch = infoParagraph.match(/SHOW Name: (.+)/) || infoParagraph.match(/Name: (.+)/);
    const finalTitle = showNameMatch && showNameMatch[1] ? showNameMatch[1].trim() : cleanTitle;
    
    // --- IMDb ID ---
    const imdbMatch = infoContainer.html()?.match(/tt\d+/) || $("a[href*='imdb.com/title/']").attr("href")?.match(/tt\d+/);
    const imdbId = imdbMatch ? imdbMatch[0] : "";
    
    // --- Image ---
    let image = infoContainer.find(".post-thumbnail img").attr("src") || 
                infoContainer.find("img[src]").first().attr("src") || "";
    if (image.startsWith("//")) image = "https:" + image;
    else if (image.startsWith("/")) image = baseUrl + image;
    
    // --- Synopsis ---
    const synopsis = infoContainer.find("p").filter((i, el) => {
      const text = $(el).text().trim();
      return text.length > 50 && !text.includes("Download") && !text.includes("Quality");
    }).first().text().trim() || "";
    
    // --- Link Groups ---
    const links: Link[] = [];
    
    // Look for .dwd-button class buttons (movies4u specific download buttons)
    const dwdButtons = $(".dwd-button");
    if (dwdButtons.length > 0) {
      // Collect all download links first
      const allDownloadLinks: any[] = [];
      
      dwdButtons.each((i, btn) => {
        const btnEl = $(btn);
        const parentLink = btnEl.parent('a').attr("href");
        const text = btnEl.text().trim();
        
        if (parentLink && !parentLink.includes('javascript:') && !parentLink.includes('mailto:')) {
          // Determine server type
          let serverType = "Unknown";
          if (parentLink.includes("hubdrive") || parentLink.includes("hubcloud")) serverType = "HubDrive";
          else if (parentLink.includes("nexdrive")) serverType = "NexDrive";
          else if (parentLink.includes("gdflix")) serverType = "GDFlix";
          else if (parentLink.includes("filepress")) serverType = "FilePress";
          else if (parentLink.includes("gofile")) serverType = "GoFile";
          
          allDownloadLinks.push({
            title: `${serverType} - ${text}`,
            link: parentLink.startsWith("http") ? parentLink : `${baseUrl}${parentLink}`,
            type: type as "movie" | "series",
            server: serverType
          });
        }
      });
      
      // Create multiple quality options with different server combinations
      if (allDownloadLinks.length > 0) {
        // Create different quality groups based on available servers
        const serverTypes = [...new Set(allDownloadLinks.map(link => link.server))];
        
        // Create quality options: 480p, 720p, 1080p, 4K
        const qualityOptions = [
          { quality: "480p", servers: allDownloadLinks.slice(0, Math.min(2, allDownloadLinks.length)) },
          { quality: "720p", servers: allDownloadLinks.slice(0, Math.min(3, allDownloadLinks.length)) },
          { quality: "1080p", servers: allDownloadLinks.slice(0, Math.min(4, allDownloadLinks.length)) },
          { quality: "4K", servers: allDownloadLinks.slice(0, Math.min(2, allDownloadLinks.length)) }
        ];
        
        qualityOptions.forEach(option => {
          if (option.servers.length > 0) {
            links.push({
              title: `${option.quality} - ${option.servers.length} servers`,
              quality: option.quality,
              episodesLink: type === "series" ? option.servers[0]?.link || "" : "",
              directLinks: option.servers,
            });
          }
        });
      }
    }
    
    // Look for quality-based sections if no .dwd-button buttons found
    if (links.length === 0) {
      const qualitySections = $("h2, h3, h4").filter((i, el) => {
        const text = $(el).text().toLowerCase();
        return text.includes("480p") || text.includes("720p") || text.includes("1080p") || 
               text.includes("4k") || text.includes("hd") || text.includes("bluray");
      });

      if (qualitySections.length > 0) {
        // Process each quality section
        qualitySections.each((i, section) => {
          const $section = $(section);
          const sectionText = $section.text();
          const qualityMatch = sectionText.match(/(\d+p|4k|hd|bluray)/i);
          const quality = qualityMatch ? qualityMatch[1] : "HD";
          
          // Look for download buttons in this section
          const allButtons = $section.nextUntil("h2, h3, h4").find("a[href]");
          
          if (allButtons.length > 0) {
            const fullTitle = `${quality} - ${sectionText.trim()}`;
            
            if (type === "series") {
              // Series: look for episode links
              const episodeButtons = allButtons.filter((i, btn) => {
                const $btn = $(btn);
                const text = $btn.text().toLowerCase();
                return text.includes('episode') || text.includes('episodes');
              });
              
              const episodesLink = episodeButtons.length > 0 ? 
                episodeButtons.first().attr("href") || "" : 
                allButtons.first().attr("href") || "";
              
              links.push({
                title: fullTitle,
                quality: quality,
                episodesLink: episodesLink,
                directLinks: [],
              });
            } else {
              // Movie: collect all direct download buttons
              const directLinks: Link["directLinks"] = [];

              allButtons.each((i, btn) => {
                const btnEl = $(btn);
                const link = btnEl.attr("href");
                const text = btnEl.text().trim();
                
                // Skip tutorial/guide links
                if (text.toLowerCase().includes('how to download') || 
                    text.toLowerCase().includes('tutorial') || 
                    text.toLowerCase().includes('guide') ||
                    link?.includes('how-to-download')) {
                  return;
                }
                
                // Skip links to other movies/series
                if (link?.includes('movies4u.lt/') && 
                    !link.includes('download') && 
                    !link.includes('file')) {
                  return;
                }
                
                if (link && !link.includes('javascript:')) {
                  directLinks.push({
                    title: text || "Download",
                    link: link.startsWith("http") ? link : `${baseUrl}${link}`,
                    type: "movie",
                  });
                }
              });

              if (directLinks.length) {
                links.push({
                  title: fullTitle,
                  quality: quality,
                  episodesLink: "",
                  directLinks: directLinks,
                });
              }
            }
          }
        });
      } else {
        // Fallback: look for any download buttons on the page
        const allButtons = $("a[href]").filter((i, el) => {
          const $el = $(el);
          const href = $el.attr("href");
          const text = $el.text().toLowerCase();
          
          return !!(href && (
            text.includes("download") ||
            text.includes("watch") ||
            text.includes("stream") ||
            href.includes("hubcloud") ||
            href.includes("nexdrive") ||
            href.includes("gdflix")
          ));
        });

        if (allButtons.length > 0) {
          const directLinks: Link["directLinks"] = [];
          
          allButtons.each((i, btn) => {
            const btnEl = $(btn);
            const link = btnEl.attr("href");
            const text = btnEl.text().trim();
            
            if (link && !link.includes('javascript:') && 
                !text.toLowerCase().includes('how to download') &&
                !link.includes('how-to-download')) {
              directLinks.push({
                title: text || "Download",
                link: link.startsWith("http") ? link : `${baseUrl}${link}`,
                type: type as "movie" | "series",
              });
            }
          });

          if (directLinks.length) {
            links.push({
              title: "Downloads",
              quality: "HD",
              episodesLink: type === "series" ? directLinks[0]?.link || "" : "",
              directLinks: type === "movie" ? directLinks : [],
            });
          }
        }
      }
    }

    return {
      title: finalTitle,
      synopsis,
      image,
      imdbId,
      type,
      linkList: links,
    };
  } catch (error) {
    console.log("getMeta error:", error);
    return {
      title: "",
      synopsis: "",
      image: "",
      imdbId: "",
      type: "movie",
      linkList: [],
    };
  }
};
