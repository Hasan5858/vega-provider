import { Stream, ProviderContext } from "../types";
import * as cheerio from "cheerio";

function getServerName(url: string): string {
  if (url.includes("hubcloud.ink")) return "HubCloud";
  if (url.includes("gd.kmhd.net")) return "GDFlix";
  if (url.includes("katdrive.eu")) return "KatDrive";
  if (url.includes("clicknupload.click")) return "ClicknUpload";
  if (url.includes("fuckingfast.net")) return "FuckingFast";
  if (url.includes("1fichier.com")) return "1fichier";
  if (url.includes("1xplayer.com")) return "1xPlayer";
  return "Unknown";
}

async function extractDirectFileUrl(
  url: string,
  providerContext: ProviderContext
): Promise<string | null> {
  const { axios, cheerio } = providerContext;
  try {
    console.log("Extracting direct file URL from:", url);
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 10000
    });
    
    const $ = cheerio.load(response.data);
    
    // Look for direct download links
    const downloadLinks = $('a[href*="download"], a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".wmv"], a[href*=".flv"], a[href*=".webm"]');
    
    if (downloadLinks.length > 0) {
      const directLink = downloadLinks.first().attr('href');
      if (directLink) {
        const fullUrl = directLink.startsWith('http') ? directLink : `${url.split('/').slice(0, 3).join('/')}${directLink}`;
        console.log("Found direct download link:", fullUrl);
        return fullUrl;
      }
    }
    
    // Look for JavaScript variables containing direct URLs
    const scriptContent = response.data;
    const urlPatterns = [
      /downloadUrl['":\s]*['"]([^'"]+)['"]/gi,
      /fileUrl['":\s]*['"]([^'"]+)['"]/gi,
      /directUrl['":\s]*['"]([^'"]+)['"]/gi,
      /url['":\s]*['"]([^'"]+\.(mp4|mkv|avi|mov|wmv|flv|webm))['"]/gi
    ];
    
    for (const pattern of urlPatterns) {
      const matches = scriptContent.match(pattern);
      if (matches && matches.length > 0) {
        const directUrl = matches[1];
        if (directUrl) {
          const fullUrl = directUrl.startsWith('http') ? directUrl : `${url.split('/').slice(0, 3).join('/')}${directUrl}`;
          console.log("Found direct URL in script:", fullUrl);
          return fullUrl;
        }
      }
    }
    
    // For some services, the URL might already be direct
    if (url.includes('.mp4') || url.includes('.mkv') || url.includes('.avi') || url.includes('.mov') || url.includes('.wmv') || url.includes('.flv') || url.includes('.webm')) {
      console.log("URL appears to be direct file link");
      return url;
    }
    
    console.log("No direct file URL found");
    return null;
    
  } catch (error) {
    console.error("Error extracting direct file URL:", error);
    return null;
  }
}

async function scrape1xplayerDirectUrl(
  url: string,
  providerContext: ProviderContext
): Promise<string | null> {
  const { axios, cheerio } = providerContext;
  try {
    console.log("Scraping 1xplayer URL:", url);
    const response = await axios.get(url, { 
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    const $ = cheerio.load(response.data);
    
    // Look for various patterns that might contain the direct URL
    let directUrl = null;
    
    // Pattern 1: Look for video source tags
    const videoSrc = $('video source').attr('src');
    if (videoSrc) {
      directUrl = videoSrc.startsWith('http') ? videoSrc : `${url.split('/').slice(0, 3).join('/')}${videoSrc}`;
      console.log("Found video source:", directUrl);
      return directUrl;
    }
    
    // Pattern 2: Look for iframe sources
    const iframeSrc = $('iframe').attr('src');
    if (iframeSrc && iframeSrc.includes('player')) {
      console.log("Found iframe source, following redirect:", iframeSrc);
      const iframeResponse = await axios.get(iframeSrc, { 
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      });
      const $iframe = cheerio.load(iframeResponse.data);
      const iframeVideoSrc = $iframe('video source').attr('src');
      if (iframeVideoSrc) {
        directUrl = iframeVideoSrc.startsWith('http') ? iframeVideoSrc : `${iframeSrc.split('/').slice(0, 3).join('/')}${iframeVideoSrc}`;
        console.log("Found iframe video source:", directUrl);
        return directUrl;
      }
    }
    
    // Pattern 3: Look for JavaScript variables containing URLs
    const scriptContent = response.data;
    const urlPatterns = [
      /file:\s*["']([^"']+\.(mp4|mkv|avi|mov|wmv|flv|webm))["']/i,
      /src:\s*["']([^"']+\.(mp4|mkv|avi|mov|wmv|flv|webm))["']/i,
      /url:\s*["']([^"']+\.(mp4|mkv|avi|mov|wmv|flv|webm))["']/i,
      /"url":\s*"([^"]+\.(mp4|mkv|avi|mov|wmv|flv|webm))"/i,
      /'url':\s*'([^']+\.(mp4|mkv|avi|mov|wmv|flv|webm))'/i,
      /videoUrl:\s*["']([^"']+)["']/i,
      /streamUrl:\s*["']([^"']+)["']/i,
      /playUrl:\s*["']([^"']+)["']/i
    ];
    
    for (const pattern of urlPatterns) {
      const match = scriptContent.match(pattern);
      if (match && match[1]) {
        directUrl = match[1].startsWith('http') ? match[1] : `${url.split('/').slice(0, 3).join('/')}${match[1]}`;
        console.log("Found URL in script:", directUrl);
        return directUrl;
      }
    }
    
    // Pattern 4: Look for data attributes
    const dataUrl = $('[data-url]').attr('data-url') || 
                   $('[data-src]').attr('data-src') || 
                   $('[data-file]').attr('data-file');
    if (dataUrl) {
      directUrl = dataUrl.startsWith('http') ? dataUrl : `${url.split('/').slice(0, 3).join('/')}${dataUrl}`;
      console.log("Found data URL:", directUrl);
      return directUrl;
    }
    
    // Pattern 5: Look for any link that might be a video file
    const videoLinks = $('a[href*=".mp4"], a[href*=".mkv"], a[href*=".avi"], a[href*=".mov"], a[href*=".wmv"], a[href*=".flv"], a[href*=".webm"]');
    if (videoLinks.length > 0) {
      const videoLink = videoLinks.first().attr('href');
      if (videoLink) {
        directUrl = videoLink.startsWith('http') ? videoLink : `${url.split('/').slice(0, 3).join('/')}${videoLink}`;
        console.log("Found video link:", directUrl);
        return directUrl;
      }
    }
    
    console.log("No direct playable URL found in 1xplayer page");
    return null;
    
  } catch (error) {
    console.error("Error scraping 1xplayer URL:", error);
    return null;
  }
}

async function extractKmhdLink(
  katlink: string,
  providerContext: ProviderContext
) {
  const { axios } = providerContext;
  try {
    // Step 1: Get the initial links page
    console.log("Getting initial links page:", katlink);
    const initialResponse = await axios.get(katlink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://katmoviehd.observer/'
      }
    });

    // Check if we need to unlock
    if (initialResponse.request.res.responseUrl?.includes('/locked')) {
      console.log("Links are locked, attempting to unlock...");
      
      // Step 2: Extract unlock form data
      const $locked = cheerio.load(initialResponse.data);
      const form = $locked('form');
      const action = form.attr('action');
      
      if (!action) {
        console.error("No unlock form found");
        return null;
      }
      
      // Step 3: Submit unlock form
      const unlockUrl = `https://links.kmhd.net${action}`;
      console.log("Submitting unlock form:", unlockUrl);
      
      const unlockResponse = await axios.post(unlockUrl, {}, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': initialResponse.request.res.responseUrl,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Origin': 'https://links.kmhd.net'
        },
        maxRedirects: 5
      });
      
      // Step 4: Get the unlocked page
      console.log("Getting unlocked page...");
      const unlockedResponse = await axios.get(katlink, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': unlockResponse.request.res.responseUrl || katlink,
          'Cookie': unlockResponse.headers['set-cookie'] ? unlockResponse.headers['set-cookie'].join('; ') : ''
        }
      });
      
      // Step 5: Extract server data from unlocked page
      const unlockedData = unlockedResponse.data;
      
      // Extract upload_links using simple regex
      const uploadLinksMatch = unlockedData.match(/upload_links:\{([^}]+)\}/);
      if (uploadLinksMatch) {
        console.log("Found upload_links!");
        const uploadLinksStr = uploadLinksMatch[1];
        
        // Parse upload links manually
        const uploadLinks: { [key: string]: string } = {};
        const linkPairs = uploadLinksStr.split(',');
        linkPairs.forEach((pair: string) => {
          const [key, value] = pair.split(':');
          if (key && value) {
            uploadLinks[key.trim()] = value.trim().replace(/"/g, '');
          }
        });
        
        // Extract server links using simple regex patterns
        const serverLinks: { [key: string]: { mx: number; link: string } } = {};
        
        // HubDrive
        const hubdriveMatch = unlockedData.match(/hubdrive_res:\{mx:(\d+),link:"([^"]+)"/);
        if (hubdriveMatch) {
          serverLinks.hubdrive_res = {
            mx: parseInt(hubdriveMatch[1]),
            link: hubdriveMatch[2]
          };
        }
        
        // GDFlix
        const gdflixMatch = unlockedData.match(/gdflix_res:\{mx:(\d+),link:"([^"]+)"/);
        if (gdflixMatch) {
          serverLinks.gdflix_res = {
            mx: parseInt(gdflixMatch[1]),
            link: gdflixMatch[2]
          };
        }
        
        // KatDrive
        const katdriveMatch = unlockedData.match(/katdrive_res:\{mx:(\d+),link:"([^"]+)"/);
        if (katdriveMatch) {
          serverLinks.katdrive_res = {
            mx: parseInt(katdriveMatch[1]),
            link: katdriveMatch[2]
          };
        }
        
        // ClicknUpload
        const clicknuploadMatch = unlockedData.match(/clicknupload_res:\{mx:(\d+),link:"([^"]+)"/);
        if (clicknuploadMatch) {
          serverLinks.clicknupload_res = {
            mx: parseInt(clicknuploadMatch[1]),
            link: clicknuploadMatch[2]
          };
        }
        
        // FuckingFast
        const ffastMatch = unlockedData.match(/ffast_res:\{mx:(\d+),link:"([^"]+)"/);
        if (ffastMatch) {
          serverLinks.ffast_res = {
            mx: parseInt(ffastMatch[1]),
            link: ffastMatch[2]
          };
        }
        
        // 1fichier
        const fichierMatch = unlockedData.match(/fichier_res:\{mx:(\d+),link:"([^"]+)"/);
        if (fichierMatch) {
          serverLinks.fichier_res = {
            mx: parseInt(fichierMatch[1]),
            link: fichierMatch[2]
          };
        }
        
        // Try different servers in order of preference
        const serverOrder = ['hubdrive_res', 'gdflix_res', 'katdrive_res', 'clicknupload_res', 'ffast_res', 'fichier_res'];
        
        for (const serverKey of serverOrder) {
          if (uploadLinks[serverKey] && uploadLinks[serverKey] !== 'None' && serverLinks[serverKey]) {
            const serverUrl = serverLinks[serverKey].link + uploadLinks[serverKey];
            console.log(`Found ${serverKey} link:`, serverUrl);
            return serverUrl;
          }
        }
      }
      
      // Fallback: Look for 1xplayer pattern
      const chibiPathMatch = unlockedData.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
      if (chibiPathMatch && chibiPathMatch[1]) {
        const baseUrl = chibiPathMatch[1];
        const fileIdMatch = katlink.match(/\/file\/([^\/]+)$/);
        if (fileIdMatch && fileIdMatch[1]) {
          const finalLink = `${baseUrl}/${fileIdMatch[1]}`;
          console.log("Fallback 1xplayer link:", finalLink);
          return finalLink;
        }
      }
    } else {
      // Direct access - look for 1xplayer pattern
      const data = initialResponse.data;
      const chibiPathMatch = data.match(/"PUBLIC_CHIBI_PATH":"([^"]+)"/);
      if (chibiPathMatch && chibiPathMatch[1]) {
        const baseUrl = chibiPathMatch[1];
        const fileIdMatch = katlink.match(/\/file\/([^\/]+)$/);
        if (fileIdMatch && fileIdMatch[1]) {
          const finalLink = `${baseUrl}/${fileIdMatch[1]}`;
          console.log("Direct 1xplayer link:", finalLink);
          return finalLink;
        }
      }
    }
    
    console.error("No valid streaming link found");
    return null;
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
      
      // Check the type of server and handle accordingly
      if (hubcloudLink.includes("1xplayer.com")) {
        console.log("1xplayer URL detected, scraping for direct playable URL");
        try {
          const directUrl = await scrape1xplayerDirectUrl(hubcloudLink, providerContext);
          if (directUrl) {
            console.log("Found direct playable URL:", directUrl);
            return [{
              server: "1xPlayer",
              link: directUrl,
              type: "mkv",
              quality: "1080"
            }];
          } else {
            console.log("No direct playable URL found, returning original");
            return [{
              server: "1xPlayer",
              link: hubcloudLink,
              type: "mkv",
              quality: "1080"
            }];
          }
        } catch (error) {
          console.log("Error scraping 1xplayer URL:", error);
          return [{
            server: "1xPlayer",
            link: hubcloudLink,
            type: "mkv",
            quality: "1080"
          }];
        }
      } else if (hubcloudLink.includes("hubcloud.ink")) {
        // Use hubcloudExtractor for HubCloud links
        console.log("HubCloud URL detected, using hubcloudExtractor");
        return await hubcloudExtracter(hubcloudLink, signal);
      } else if (hubcloudLink.includes("gd.kmhd.net") || hubcloudLink.includes("katdrive.eu") || hubcloudLink.includes("clicknupload.click") || hubcloudLink.includes("fuckingfast.net") || hubcloudLink.includes("1fichier.com")) {
        // These are direct file hosting services, try to extract direct links
        console.log("File hosting service detected:", hubcloudLink);
        try {
          const directUrl = await extractDirectFileUrl(hubcloudLink, providerContext);
          if (directUrl) {
            console.log("Found direct file URL:", directUrl);
            return [{
              server: getServerName(hubcloudLink),
              link: directUrl,
              type: "mkv",
              quality: "1080"
            }];
          } else {
            console.log("No direct file URL found, returning original");
            return [{
              server: getServerName(hubcloudLink),
              link: hubcloudLink,
              type: "mkv",
              quality: "1080"
            }];
          }
        } catch (error) {
          console.log("Error extracting direct file URL:", error);
          return [{
            server: getServerName(hubcloudLink),
            link: hubcloudLink,
            type: "mkv",
            quality: "1080"
          }];
        }
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
