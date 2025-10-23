import { ProviderContext, Stream } from '../types';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

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
  const { hubcloudExtracter, gdFlixExtracter, gofileExtracter } = extractors;

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

        if (
          url.includes('.mp4') ||
          url.includes('.mkv') ||
          url.includes('.avi')
        ) {
          allStreams.push({
            server: 'Direct',
            link: url,
            type: streamLink.type || 'mp4',
            quality: streamLink.quality,
          });
          continue;
        }

        if (url.includes('hubcloud')) {
          console.log('[Movies4U Stream] Using HubCloud extractor');
          const extracted = await hubcloudExtracter(url, signal);
          if (extracted && extracted.length > 0) {
            allStreams.push(...extracted);
            console.log('[Movies4U Stream] HubCloud extracted', extracted.length, 'streams');
          }
        } else if (url.includes('gdflix')) {
          console.log('[Movies4U Stream] Using GDFlix extractor');
          const extracted = await gdFlixExtracter(url, signal);
          if (extracted && extracted.length > 0) {
            allStreams.push(...extracted);
            console.log('[Movies4U Stream] GDFlix extracted', extracted.length, 'streams');
          }
        } else if (url.includes('gofile')) {
          console.log('[Movies4U Stream] Using GoFile extractor');
          const extracted = await gofileExtracter(url);
          if (extracted && extracted.link) {
            allStreams.push({
              server: 'GoFile',
              link: extracted.link,
              type: 'mp4',
            });
            console.log('[Movies4U Stream] GoFile extracted 1 stream');
          }
        } else if (url.includes('nexdrive') || url.includes('hubdrive')) {
          // NexDrive and HubDrive require extraction but we'll pass them through
          // The player or user can handle these if available
          console.log('[Movies4U Stream] NexDrive/HubDrive link - passing through');
          allStreams.push({
            server: streamLink.server || 'Unknown',
            link: url,
            type: streamLink.type || 'mp4',
            quality: streamLink.quality,
          });
        } else {
          allStreams.push({
            server: streamLink.server || 'Unknown',
            link: url,
            type: streamLink.type || 'mp4',
            quality: streamLink.quality,
          });
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
