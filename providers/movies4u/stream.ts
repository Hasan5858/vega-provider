import { ProviderContext, Stream } from '../types';

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

    const { data } = await axios.get(WORKER_URL, {
      params: {
        action: 'stream',
        link: link,
      },
      signal,
      timeout: 30000,
    });

    if (!data.success || !Array.isArray(data.streams)) {
      console.error('[Movies4U Stream] Invalid worker response:', data);
      return [];
    }

    console.log('[Movies4U Stream] Worker returned', data.streams.length, 'links');

    const allStreams: Stream[] = [];

    for (const streamLink of data.streams) {
      try {
        const url = streamLink.link;
        const serverName = streamLink.server || 'Unknown';
        const qualityFromWorker = streamLink.quality || '720p'; // Quality from Worker (480p, 720p, 1080p, etc.)

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
          console.log('[Movies4U Stream] Using NexDrive extractor for quality:', qualityFromWorker);
          const extracted = await extractors.nexdriveExtractor(url, signal);
          
          if (extracted && extracted.length > 0) {
            console.log('[Movies4U Stream] NexDrive extracted', extracted.length, 'service links');
            
            // For each service link returned by NexDrive, extract the final stream
            for (const serviceLink of extracted) {
              try {
                const linkServerName = serviceLink.server || 'Service';
                console.log('[Movies4U Stream] Processing service link:', linkServerName, 'for quality:', qualityFromWorker);
                const finalStreams = await extractStream(serviceLink.link, extractors, signal, qualityFromWorker);
                
                if (finalStreams && finalStreams.length > 0) {
                  allStreams.push(...finalStreams);
                  console.log('[Movies4U Stream]', linkServerName, 'extracted', finalStreams.length, 'streams for quality', qualityFromWorker);
                } else {
                  // If no final streams, add the service link as-is with preserved quality
                  allStreams.push({
                    ...serviceLink,
                    quality: parseQuality(qualityFromWorker)
                  });
                  console.log('[Movies4U Stream] No extraction, keeping', linkServerName, 'link for quality', qualityFromWorker);
                }
              } catch (err) {
                console.error('[Movies4U Stream] Error extracting service link:', err);
                // Add the original link if extraction fails
                allStreams.push({
                  ...serviceLink,
                  quality: parseQuality(qualityFromWorker)
                });
              }
            }
          }
        } else {
          // For non-NexDrive links, try to extract directly while preserving quality
          const extracted = await extractStream(url, extractors, signal, qualityFromWorker);
          if (extracted && extracted.length > 0) {
            allStreams.push(...extracted);
            console.log('[Movies4U Stream]', serverName, 'extracted', extracted.length, 'streams for quality', qualityFromWorker);
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
