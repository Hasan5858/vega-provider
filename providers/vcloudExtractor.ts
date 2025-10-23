import axios from 'axios';
import * as cheerio from 'cheerio';
import { Stream } from './types';
import { headers } from './headers';

/**
 * VCloud Extractor
 * Extracts direct download links from VCloud pages
 * 
 * VCloud flow:
 * 1. Initial page contains a redirect URL in a script tag with token
 * 2. Follow redirect URL to get to the download page
 * 3. Download page contains direct links to HubCDN, workers.dev, and other file hosting services
 * 
 * @param link - VCloud URL (https://vcloud.zip/...)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise<Stream[]> - Array with extracted direct download streams
 */
export async function vcloudExtractor(
  link: string,
  signal: AbortSignal
): Promise<Stream[]> {
  try {
    console.log('[VCloud Extractor] Step 1: Fetching initial page:', link);

    // Step 1: Fetch the initial VCloud page
    const initialResponse = await axios.get(link, {
      headers,
      signal,
      timeout: 15000
    });

    const initialHtml = initialResponse.data;

    // Step 2: Extract redirect URL from script tag
    // Pattern: var url = 'https://vcloud.zip/...'
    const redirectMatch = initialHtml.match(/var\s+url\s*=\s*['"]([^'"]+)['"]/);
    
    if (!redirectMatch || !redirectMatch[1]) {
      console.log('[VCloud Extractor] No redirect URL found in initial page');
      return [];
    }

    const redirectUrl = redirectMatch[1];
    console.log('[VCloud Extractor] Step 2: Found redirect URL, following...');

    // Step 3: Follow the redirect URL to get the download page
    const redirectResponse = await axios.get(redirectUrl, {
      headers,
      signal,
      timeout: 15000
    });

    const downloadPageHtml = redirectResponse.data;
    const $ = cheerio.load(downloadPageHtml);
    const streams: Stream[] = [];
    const seenLinks = new Set<string>();

    // Step 4: Extract direct download links from the download page
    // Look for href attributes with common direct download service domains
    const allLinks = $('a[href]');

    console.log('[VCloud Extractor] Step 3: Parsing download page for direct links...');

    allLinks.each((_, element) => {
      const href = $(element).attr('href');

      if (!href || seenLinks.has(href)) return;

      // Skip internal navigation links
      if (href === '#' || href.startsWith('javascript:') || href.startsWith('http://one.one.one.one')) {
        return;
      }

      let server = 'Unknown';
      let quality = '720';

      // Identify server type from URL
      if (href.includes('gpdl') || href.includes('hubcdn')) {
        server = 'HubCDN';
      } else if (href.includes('workers.dev') || href.includes('cloudflare')) {
        server = 'Cloudflare Worker';
      } else if (href.includes('fsl.') || href.includes('anime4u')) {
        server = 'Direct Link';
      } else if (href.includes('binidek') || href.includes('holy-frost')) {
        server = 'Backup Server';
      } else if (href.includes('drive.google.com') || href.includes('gdtot')) {
        server = 'Google Drive';
      } else if (href.includes('fastdl')) {
        server = 'FastDL';
      } else if (href.includes('filebee') || href.includes('filepress')) {
        server = 'FileBee';
      } else if (href.includes('dropgalaxy')) {
        server = 'DropGalaxy';
      } else if (href.match(/\.(mp4|mkv|avi|mov|flv)$/i)) {
        // Direct file link
        server = 'Direct File';
      } else {
        // Skip unknown links
        return;
      }

      // Extract quality if available in filename
      if (href.includes('1080p')) quality = '1080';
      else if (href.includes('720p')) quality = '720';
      else if (href.includes('480p')) quality = '480';
      else if (href.includes('360p')) quality = '360';

      streams.push({
        server: server,
        link: href,
        type: 'mp4',
        quality: quality as '360' | '480' | '720' | '1080' | '2160'
      });

      seenLinks.add(href);
      console.log(`[VCloud Extractor] Added ${server}: ${href.substring(0, 50)}...`);
    });

    console.log('[VCloud Extractor] Step 4: Extracted', streams.length, 'download links');
    return streams;
  } catch (error: any) {
    console.error('[VCloud Extractor Error]', error.message);
    return [];
  }
}
