import { ProviderContext, Stream } from "../types";

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
  Cookie:
    "xla=s4t; _ga=GA1.1.1081149560.1756378968; _ga_BLZGKYN5PF=GS2.1.s1756378968$o1$g1$t1756378984$j44$l0$h0",
  "Upgrade-Insecure-Requests": "1",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
};

export async function getStream({
  link,
  type,
  signal,
  providerContext,
}: {
  link: string;
  type: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}) {
  const { axios, cheerio } = providerContext;
  
  try {
    const streamLinks: Stream[] = [];
    console.log("🔗 Processing stream link:", link);
    
          // Skip if it's not a valid download link
          if (!link || link.includes('how-to-download') || link.includes('movies4u.lt/') || link.includes('gdtot')) {
            console.log("❌ Skipping invalid link:", link);
            return [];
          }
    
    // Check if it's a direct file link
    if (link.includes('.mp4') || link.includes('.mkv') || link.includes('.avi')) {
      streamLinks.push({
        server: "direct",
        link: link,
        type: link.split('.').pop() || "mp4"
      });
      return streamLinks;
    }

    // Use dedicated extractors for specific server types
    try {
      if (link.includes('hubcloud')) {
        console.log("🔧 Using Hub-Cloud extractor");
        const { hubcloudExtracter } = require("../../dist/hubcloudExtractor.js");
        const extractedStreams = await hubcloudExtracter(link, signal);
        if (extractedStreams && extractedStreams.length > 0) {
          console.log(`✅ Hub-Cloud extractor found ${extractedStreams.length} streams`);
          return extractedStreams.map((stream: any) => ({
            server: stream.server,
            link: stream.link,
            type: stream.type,
            quality: undefined
          }));
        }
      } else if (link.includes('gdflix')) {
        console.log("🔧 Using GDFlix extractor");
        const { gdFlixExtracter } = require("../../dist/gdflixExtractor.js");
        const extractedStreams = await gdFlixExtracter(link, signal);
        if (extractedStreams && extractedStreams.length > 0) {
          console.log(`✅ GDFlix extractor found ${extractedStreams.length} streams`);
          return extractedStreams.map((stream: any) => ({
            server: stream.server,
            link: stream.link,
            type: stream.type,
            quality: undefined
          }));
        }
      } else if (link.includes('gdtot')) {
        console.log("⚠️ Skipping GDTot link - extractor not available");
        return [];
      }
    } catch (extractorError: any) {
      console.log("❌ Extractor error:", extractorError.message);
      // Fall back to manual extraction
    }
    
    // Process different download platforms
    try {
      const response = await axios.get(link, { 
        headers: {
          ...headers,
          Referer: "https://movies4u.lt/"
        },
        signal,
        timeout: 10000
      });
      
      const $ = cheerio.load(response.data);
      
      // Look for actual download links with better filtering
      const foundLinks = new Set();
      
      // First, look for direct file links
      $('a[href]').each((i, el) => {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        const textLower = text.toLowerCase();
        
        if (!href || foundLinks.has(href)) return;
        
        // Skip invalid/irrelevant links
        if (href.includes('javascript:') ||
            href.includes('#') ||
            href === link ||
            href.includes('how-to-download') ||
            href.includes('admin') ||
            href.includes('login') ||
            href.includes('register') ||
            href.includes('account') ||
            href.includes('report') ||
            href.includes('telegram') ||
            href.includes('twitter') ||
            href.includes('facebook') ||
            href.includes('instagram') ||
            href.includes('youtube') ||
            href.includes('tutorial') ||
            href.includes('help') ||
            href.includes('support') ||
            href.includes('contact') ||
            href.includes('privacy') ||
            href.includes('terms') ||
            href.includes('about') ||
            href.includes('home') ||
            href.includes('blog') ||
            href.includes('news') ||
            href.includes('tinyurl') ||
            href.includes('amp-project') ||
            href.includes('cdn.') ||
            href.includes('api/') ||
            href.includes('token=') ||
            href.includes('gamerxyt.com') ||
            href.includes('t.me/') ||
            textLower.includes('create') ||
            (textLower.includes('login') && !textLower.includes('no-login')) ||
            textLower.includes('register') ||
            textLower.includes('account') ||
            textLower.includes('report') ||
            textLower.includes('telegram') ||
            textLower.includes('tutorial') ||
            textLower.includes('help') ||
            textLower.includes('support') ||
            textLower.includes('contact') ||
            textLower.includes('privacy') ||
            textLower.includes('terms') ||
            textLower.includes('about') ||
            textLower.includes('home') ||
            textLower.includes('blog') ||
            textLower.includes('news')) {
          return;
        }
        
        // Only capture links that are likely to be actual downloads
        const isDownloadLink = 
          // Direct file links
          href.includes('.mp4') || href.includes('.mkv') || href.includes('.avi') || 
          href.includes('.mov') || href.includes('.wmv') || href.includes('.flv') ||
          // Download platform links (more flexible detection)
          href.includes('gdflix') ||
          href.includes('hubcloud') ||
          href.includes('mega') ||
          href.includes('dropbox') ||
          href.includes('mediafire') ||
          href.includes('zippyshare') ||
          href.includes('gofile') ||
          href.includes('filepress') ||
          href.includes('filebee') ||
          // Text indicates it's a download link
          textLower.includes('download') ||
          textLower.includes('download now') ||
          textLower.includes('download file') ||
          textLower.includes('get file') ||
          textLower.includes('stream') ||
          textLower.includes('watch') ||
          textLower.includes('play') ||
          textLower.includes('view') ||
          textLower.includes('hub-cloud') ||
          textLower.includes('g-drive') ||
          textLower.includes('no-login') ||
          textLower.includes('gdflix') ||
          textLower.includes('hubcloud') ||
          // Quality indicators
          textLower.includes('480p') || textLower.includes('720p') || 
          textLower.includes('1080p') || textLower.includes('4k') ||
          textLower.includes('hd') || textLower.includes('bluray') ||
          textLower.includes('web-dl') || textLower.includes('hdtc') ||
          textLower.includes('dvdrip') || textLower.includes('brrip');
        
        if (!isDownloadLink) return;
        
        // Determine server type
        let server = 'unknown';
        if (href.includes('gdflix')) server = 'gdflix';
        else if (href.includes('hubcloud') || href.includes('hubcloud.fit') || href.includes('hubcloud.fans')) server = 'hubcloud';
        else if (href.includes('nexdrive')) server = 'nexdrive';
        else if (href.includes('filepress') || href.includes('filebee')) server = 'filepress';
        else if (href.includes('mega')) server = 'mega';
        else if (href.includes('drive') && !href.includes('hubcloud')) server = 'gdrive';
        else if (href.includes('dropbox')) server = 'dropbox';
        else if (href.includes('mediafire')) server = 'mediafire';
        else if (href.includes('zippyshare')) server = 'zippyshare';
        else if (href.includes('gofile')) server = 'gofile';
        else if (href.includes('upload')) server = 'upload';
        else if (href.includes('.mp4') || href.includes('.mkv') || href.includes('.avi')) server = 'direct';
        
        // Determine file type
        let fileType = 'mp4';
        if (href.includes('.mkv')) fileType = 'mkv';
        else if (href.includes('.avi')) fileType = 'avi';
        else if (href.includes('.mov')) fileType = 'mov';
        else if (href.includes('.wmv')) fileType = 'wmv';
        else if (href.includes('.flv')) fileType = 'flv';
        else if (textLower.includes('mkv')) fileType = 'mkv';
        else if (textLower.includes('avi')) fileType = 'avi';
        
        // Determine quality
        let quality: "360" | "480" | "720" | "1080" | "2160" | undefined = undefined;
        if (textLower.includes('1080p') || href.includes('1080p')) quality = '1080';
        else if (textLower.includes('720p') || href.includes('720p')) quality = '720';
        else if (textLower.includes('480p') || href.includes('480p')) quality = '480';
        else if (textLower.includes('4k') || href.includes('4k') || textLower.includes('2160p') || href.includes('2160p')) quality = '2160';
        else if (textLower.includes('360p') || href.includes('360p')) quality = '360';
        
        streamLinks.push({
          server: server,
          link: href,
          type: fileType,
          quality: quality
        });
        
        foundLinks.add(href);
      });
      
      // Also check for video elements
      $('video source, video').each((i, el) => {
        const src = $(el).attr('src') || $(el).attr('data-src');
        if (src && !foundLinks.has(src)) {
          streamLinks.push({
            server: 'direct',
            link: src,
            type: src.split('.').pop() || 'mp4'
          });
          foundLinks.add(src);
        }
      });
      
      console.log(`✅ Found ${streamLinks.length} stream links`);
      
      // If no links found, try to extract from page content with better filtering
      if (streamLinks.length === 0) {
        const pageText = response.data;
        
        // Look for specific download patterns with better filtering
        const patterns = [
          // Direct video files
          /https?:\/\/[^\s"']+\.(mp4|mkv|avi|mov|wmv|flv)(?:\?[^\s"']*)?/gi,
          // Specific download platforms with file indicators
                /https?:\/\/[^\s"']*(?:gdflix|mega|dropbox|mediafire|zippyshare|gofile|filepress)[^\s"']*(?:\/file\/|\/download\/|\/d\/)[^\s"']*/gi,
          // Drive links that look like actual files
          /https?:\/\/[^\s"']*drive[^\s"']*(?:\/file\/|\/d\/)[^\s"']*/gi
        ];
        
        patterns.forEach(pattern => {
          const matches = pageText.match(pattern);
          if (matches) {
            matches.forEach((match: string) => {
              if (!foundLinks.has(match)) {
                // Additional filtering for extracted links
                if (!match.includes('.css') && 
                    !match.includes('.js') && 
                    !match.includes('.png') && 
                    !match.includes('.jpg') && 
                    !match.includes('.jpeg') && 
                    !match.includes('.gif') && 
                    !match.includes('.ico') && 
                    !match.includes('.svg') && 
                    !match.includes('wp-content') && 
                    !match.includes('wp-includes') && 
                    !match.includes('bootstrap') && 
                    !match.includes('jquery') && 
                    !match.includes('style.min') && 
                    !match.includes('bundle.') &&
                    !match.includes('admin') &&
                    !match.includes('login') &&
                    !match.includes('register') &&
                    !match.includes('account') &&
                    !match.includes('report') &&
                    !match.includes('telegram') &&
                    !match.includes('tutorial') &&
                    !match.includes('help') &&
                    !match.includes('support') &&
                    !match.includes('contact') &&
                    !match.includes('privacy') &&
                    !match.includes('terms') &&
                    !match.includes('about') &&
                    !match.includes('home') &&
                    !match.includes('blog') &&
                    !match.includes('news') &&
                    !match.includes('token=') &&
                    !match.includes('api/') &&
                    !match.includes('cdn.') &&
                    !match.includes('amp-project') &&
                    !match.includes('tinyurl') &&
                    !match.includes('t.me/') &&
                    !match.includes('gamerxyt.com') &&
                    !match.includes('hubcloud.fit') &&
                    !match.includes('hubcloud.fans')) {
                  
                  // Determine server type
                        let server = 'extracted';
                        if (match.includes('gdflix')) server = 'gdflix';
                        else if (match.includes('mega')) server = 'mega';
                  else if (match.includes('dropbox')) server = 'dropbox';
                  else if (match.includes('mediafire')) server = 'mediafire';
                  else if (match.includes('zippyshare')) server = 'zippyshare';
                  else if (match.includes('gofile')) server = 'gofile';
                  else if (match.includes('filepress')) server = 'filepress';
                  else if (match.includes('drive') && !match.includes('hubcloud')) server = 'gdrive';
                  else if (match.includes('.mp4') || match.includes('.mkv') || match.includes('.avi')) server = 'direct';
                  
                  // Determine file type
                  let fileType = 'mp4';
                  if (match.includes('.mkv')) fileType = 'mkv';
                  else if (match.includes('.avi')) fileType = 'avi';
                  else if (match.includes('.mov')) fileType = 'mov';
                  else if (match.includes('.wmv')) fileType = 'wmv';
                  else if (match.includes('.flv')) fileType = 'flv';
                  
                  streamLinks.push({
                    server: server,
                    link: match,
                    type: fileType
                  });
                  foundLinks.add(match);
                }
              }
            });
          }
        });
      }
      
    } catch (error: any) {
      console.log("❌ Error processing download link:", error.message);
    }
    
    return streamLinks;
    
  } catch (error: any) {
    console.log("❌ getStream error:", error.message);
    return [];
  }
}