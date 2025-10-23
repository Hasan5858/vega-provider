import { ProviderContext, Stream } from '../types';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

async function extractStream(
  url: string,
  extractors: any,
  signal: AbortSignal
): Promise<Stream[]> {
  if (!url) return [];

  // Check for direct file links
  if (url.includes('.mp4') || url.includes('.mkv') || url.includes('.avi')) {
    return [
      {
        server: 'Direct',
        link: url,
        type: 'mp4',
        quality: '720'
      }
    ];
  }

  // Route to appropriate extractor based on URL
  if (url.includes('hubcloud')) {
    console.log('[Movies4U Stream] Using HubCloud extractor');
    const extracted = await extractors.hubcloudExtracter(url, signal);
    return extracted || [];
  } else if (url.includes('gdflix')) {
    console.log('[Movies4U Stream] Using GDFlix extractor');
    const extracted = await extractors.gdFlixExtracter(url, signal);
    return extracted || [];
  } else if (url.includes('gofile')) {
    console.log('[Movies4U Stream] Using GoFile extractor');
    const extracted = await extractors.gofileExtracter(url);
    if (extracted && extracted.link) {
      return [
        {
          server: 'GoFile',
          link: extracted.link,
          type: 'mp4',
          quality: '720'
        }
      ];
    }
    return [];
  } else if (url.includes('fastdl')) {
    console.log('[Movies4U Stream] Using FastDL extractor');
    const extracted = await extractors.fastdlExtractor(url, signal);
    return extracted || [];
  } else if (url.includes('vcloud')) {
    console.log('[Movies4U Stream] Using VCloud extractor');
    const extracted = await extractors.vcloudExtractor(url, signal);
    return extracted || [];
  } else if (url.includes('filepress')) {
    console.log('[Movies4U Stream] Using FilePres extractor');
    const extracted = await extractors.filepresExtractor(url, signal);
    return extracted || [];
  } else if (url.includes('hubdrive')) {
    console.log('[Movies4U Stream] HubDrive link detected');
    return [
      {
        server: 'HubDrive',
        link: url,
        type: 'mp4',
        quality: '720'
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
          console.log('[Movies4U Stream] Using NexDrive extractor');
          const extracted = await extractors.nexdriveExtractor(url, signal);
          
          if (extracted && extracted.length > 0) {
            console.log('[Movies4U Stream] NexDrive extracted', extracted.length, 'service links');
            
            // For each service link returned by NexDrive, extract the final stream
            for (const serviceLink of extracted) {
              try {
                console.log('[Movies4U Stream] Processing service link:', serviceLink.server);
                const finalStreams = await extractStream(serviceLink.link, extractors, signal);
                
                if (finalStreams && finalStreams.length > 0) {
                  allStreams.push(...finalStreams);
                  console.log('[Movies4U Stream]', serviceLink.server, 'extracted', finalStreams.length, 'streams');
                } else {
                  // If no final streams, add the service link as-is
                  allStreams.push(serviceLink);
                  console.log('[Movies4U Stream] No extraction, keeping', serviceLink.server, 'link');
                }
              } catch (err) {
                console.error('[Movies4U Stream] Error extracting service link:', err);
                // Add the original link if extraction fails
                allStreams.push(serviceLink);
              }
            }
          }
        } else {
          // For non-NexDrive links, try to extract directly
          const extracted = await extractStream(url, extractors, signal);
          if (extracted && extracted.length > 0) {
            allStreams.push(...extracted);
            console.log('[Movies4U Stream] Extracted', extracted.length, 'streams');
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
