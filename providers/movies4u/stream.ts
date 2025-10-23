import { ProviderContext, Stream } from '../types';
import * as cheerio from 'cheerio';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

function parseQuality(qualityStr: string): "360" | "480" | "720" | "1080" | "2160" | undefined {
  // Parse quality from string like "480p", "720p", "1080p", etc.
  if (!qualityStr) return '720';
  
  if (qualityStr.includes('1080') || qualityStr.includes('4k') || qualityStr.includes('4K')) {
    return '1080';
  } else if (qualityStr.includes('2160')) {
    return '2160';
  } else if (qualityStr.includes('720')) {
    return '720';
  } else if (qualityStr.includes('480')) {
    return '480';
  } else if (qualityStr.includes('360')) {
    return '360';
  }
  
  return '720'; // Default
}

async function extractStream(
  url: string,
  extractors: any,
  signal: AbortSignal,
  quality?: string
): Promise<Stream[]> {
  if (!url) return [];

  // Parse quality from the passed parameter
  const parsedQuality = parseQuality(quality || '');

  // Check for direct file links
  if (url.includes('.mp4') || url.includes('.mkv') || url.includes('.avi')) {
    return [
      {
        server: 'Direct',
        link: url,
        type: 'mp4',
        quality: parsedQuality
      }
    ];
  }

  // Route to appropriate extractor based on URL
  if (url.includes('hubcloud')) {
    console.log('[Movies4U Stream] Using HubCloud extractor for quality:', quality);
    const extracted = await extractors.hubcloudExtracter(url, signal);
    return extracted?.map((s: any) => ({
      ...s,
      server: s.server || 'HubCloud',
      quality: parsedQuality || s.quality
    })) || [];
  } else if (url.includes('gdflix')) {
    console.log('[Movies4U Stream] Using GDFlix extractor for quality:', quality);
    const extracted = await extractors.gdFlixExtracter(url, signal);
    return extracted?.map((s: any) => ({
      ...s,
      server: s.server || 'GDFlix',
      quality: parsedQuality || s.quality
    })) || [];
  } else if (url.includes('gofile')) {
    console.log('[Movies4U Stream] Using GoFile extractor for quality:', quality);
    const extracted = await extractors.gofileExtracter(url);
    if (extracted && extracted.link) {
      return [
        {
          server: 'GoFile',
          link: extracted.link,
          type: 'mp4',
          quality: parsedQuality
        }
      ];
    }
    return [];
  } else if (url.includes('fastdl')) {
    console.log('[Movies4U Stream] Using FastDL extractor for quality:', quality);
    const extracted = await extractors.fastdlExtractor(url, signal);
    return extracted?.map((s: any) => ({
      ...s,
      server: s.server || 'FastDL',
      quality: parsedQuality || s.quality
    })) || [];
  } else if (url.includes('vcloud')) {
    console.log('[Movies4U Stream] Using VCloud extractor for quality:', quality);
    const extracted = await extractors.vcloudExtractor(url, signal);
    return extracted?.map((s: any) => ({
      ...s,
      server: s.server || 'VCloud',
      quality: parsedQuality || s.quality
    })) || [];
  } else if (url.includes('filepress')) {
    console.log('[Movies4U Stream] Using FilePres extractor for quality:', quality);
    const extracted = await extractors.filepresExtractor(url, signal);
    return extracted?.map((s: any) => ({
      ...s,
      server: s.server || 'FilePres',
      quality: parsedQuality || s.quality
    })) || [];
  } else if (url.includes('hubdrive')) {
    console.log('[Movies4U Stream] HubDrive link detected for quality:', quality);
    return [
      {
        server: 'HubDrive',
        link: url,
        type: 'mp4',
        quality: parsedQuality
      }
    ];
  }

  return [];
}

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
}): Promise<Stream[]> {
  const { axios, extractors } = providerContext;

  try {
    console.log('[Movies4U Stream] Fetching streams for:', link);

    // Fetch directly instead of using Worker (Worker is blocked by the site)
    const response = await axios.get(link, {
      signal,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const streamLinks: any[] = [];

    // Look for download buttons with quality info and links
    // Pattern: <a href="URL"><button class="dwd-button">480p</button></a>
    $('a[href]').each((_, elem) => {
      const $link = $(elem);
      const href = $link.attr('href');
      const text = $link.text().trim();
      
      // Check if this link has a download button or quality info
      const hasDownloadBtn = $link.find('button.dwd-button').length > 0;
      const hasQuality = /\d+p/.test(text);
      
      if (href && (hasDownloadBtn || hasQuality)) {
        // Skip social media links, javascript, anchors
        if (!href.includes('javascript') && !href.startsWith('#') && !href.includes('facebook') && !href.includes('twitter')) {
          // Extract quality from button text or link text
          let quality = '720p';
          if (text.includes('1080')) quality = '1080p';
          else if (text.includes('720')) quality = '720p';
          else if (text.includes('480')) quality = '480p';
          else if (text.includes('360')) quality = '360p';
          
          // Determine server
          let server = 'Unknown';
          if (href.includes('hubcloud')) server = 'HubCloud';
          else if (href.includes('gdflix')) server = 'GDFlix';
          else if (href.includes('filepress')) server = 'FilePress';
          else if (href.includes('gofile')) server = 'GoFile';
          else if (href.includes('nexdrive')) server = 'NexDrive';
          else if (href.includes('hubdrive')) server = 'HubDrive';
          else if (href.includes('mega')) server = 'Mega';
          else if (href.includes('dropbox')) server = 'Dropbox';
          else if (href.includes('fastdl')) server = 'FastDL';
          else if (href.includes('vcloud')) server = 'VCloud';
          
          streamLinks.push({
            link: href,
            server,
            quality
          });
        }
      }
    });

    console.log('[Movies4U Stream] Found', streamLinks.length, 'download links');

    const allStreams: Stream[] = [];

    for (const streamLink of streamLinks) {
      try {
        const url = streamLink.link;
        const serverName = streamLink.server || 'Unknown';
        const qualityFromPage = streamLink.quality || '720p';

        if (
          !url ||
          url.includes('how-to-download') ||
          url.includes('tutorial') ||
          url.includes('gdtot')
        ) {
          continue;
        }

        // For NexDrive links, extract to get FastDL, VCloud, FilePres, etc.
        if (url.includes('nexdrive')) {
          console.log('[Movies4U Stream] Using NexDrive extractor for quality:', qualityFromPage);
          const extracted = await extractors.nexdriveExtractor(url, signal);
          
          if (extracted && extracted.length > 0) {
            console.log('[Movies4U Stream] NexDrive extracted', extracted.length, 'service links');
            
            // For each service link returned by NexDrive, extract the final stream
            for (const serviceLink of extracted) {
              try {
                const linkServerName = serviceLink.server || 'Service';
                console.log('[Movies4U Stream] Processing service link:', linkServerName, 'for quality:', qualityFromPage);
                const finalStreams = await extractStream(serviceLink.link, extractors, signal, qualityFromPage);
                
                if (finalStreams && finalStreams.length > 0) {
                  allStreams.push(...finalStreams);
                  console.log('[Movies4U Stream]', linkServerName, 'extracted', finalStreams.length, 'streams for quality', qualityFromPage);
                } else {
                  // If no final streams, add the service link as-is with preserved quality
                  allStreams.push({
                    ...serviceLink,
                    quality: parseQuality(qualityFromPage)
                  });
                  console.log('[Movies4U Stream] No extraction, keeping', linkServerName, 'link for quality', qualityFromPage);
                }
              } catch (err) {
                console.error('[Movies4U Stream] Error extracting service link:', err);
                // Add the original link if extraction fails
                allStreams.push({
                  ...serviceLink,
                  quality: parseQuality(qualityFromPage)
                });
              }
            }
          }
        } else {
          // For non-NexDrive links, try to extract directly while preserving quality
          const extracted = await extractStream(url, extractors, signal, qualityFromPage);
          if (extracted && extracted.length > 0) {
            allStreams.push(...extracted);
            console.log('[Movies4U Stream]', serverName, 'extracted', extracted.length, 'streams for quality', qualityFromPage);
          }
        }
      } catch (extractorError) {
        console.error('[Movies4U Stream] Extractor error:', extractorError);
      }
    }

    console.log('[Movies4U Stream] Total streams extracted:', allStreams.length);

    return allStreams;
  } catch (error) {
    console.error('[Movies4U Stream] Error:', error);
    return [];
  }
}
