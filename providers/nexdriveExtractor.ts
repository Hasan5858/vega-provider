import axios from 'axios';
import * as cheerio from 'cheerio';
import { Stream } from './types';
import { headers } from './headers';

/**
 * NexDrive Extractor
 * Extracts streaming links from nexdrive.top
 * NexDrive pages contain links to various streaming services
 */
export async function nexdriveExtractor(
  link: string,
  signal: AbortSignal,
): Promise<Stream[]> {
  try {
    console.log('[NexDrive] Extracting from:', link);
    
    const res = await axios.get(link, { headers, signal, timeout: 15000 });
    const html = res.data;
    const $ = cheerio.load(html);
    
    const streams: Stream[] = [];
    const seenLinks = new Set<string>();
    
    // Find all download buttons/links on the page
    const links = $('a[href*="fastdl"], a[href*="vcloud"], a[href*="filebee"], a[href*="gdtot"], a[href*="dropgalaxy"], a[href*="dgdrive"]');
    
    console.log('[NexDrive] Found', links.length, 'streaming service links');
    
    links.each((_, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();
      
      if (!href || seenLinks.has(href)) return;
      
      let server = 'Unknown';
      let extractorName = '';
      
      if (href.includes('fastdl')) {
        server = 'FastDL';
        extractorName = 'FastDL (Direct)';
      } else if (href.includes('vcloud')) {
        server = 'VCloud';
        extractorName = 'VCloud (Resumable)';
      } else if (href.includes('filebee') || href.includes('filepress')) {
        server = 'FileBee';
        extractorName = 'FileBee (Google Drive)';
      } else if (href.includes('gdtot')) {
        server = 'GDTot';
        extractorName = 'GDTot (Google Drive)';
      } else if (href.includes('dropgalaxy') || href.includes('dgdrive')) {
        server = 'DropGalaxy';
        extractorName = 'DropGalaxy';
      }
      
      streams.push({
        server: server,
        link: href,
        type: 'mp4',
        quality: '720',
      });
      
      seenLinks.add(href);
      console.log(`[NexDrive] Added ${extractorName}: ${server}`);
    });
    
    console.log('[NexDrive] Extracted', streams.length, 'streams');
    return streams;
  } catch (error: any) {
    console.error('[NexDrive] Error:', error.message);
    return [];
  }
}
