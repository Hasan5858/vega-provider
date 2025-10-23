import { Stream } from './types';

/**
 * Extracts direct download links from FastDL embed URLs
 * FastDL uses 302 redirects to provide direct Google Drive download links
 * 
 * @param link - FastDL embed URL (https://fastdl.zip/embed?download=...)
 * @param signal - AbortSignal for request cancellation
 * @returns Promise<Stream[]> - Array with extracted stream
 */
export async function fastdlExtractor(
  link: string,
  signal: AbortSignal
): Promise<Stream[]> {
  try {
    // FastDL redirects with 302, we need to follow the redirect
    const response = await fetch(link, {
      method: 'GET',
      redirect: 'follow', // Follow the redirect
      signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Get the final URL after redirects
    const finalUrl = response.url;

    // If the response has content, try to extract from body (fallback)
    if (!finalUrl || finalUrl === link) {
      // Try parsing HTML if available
      const html = await response.text();
      
      // Look for download button or direct link patterns
      const linkMatch = html.match(/href=["']([^"']*(?:drive\.google\.com|cdnjs|cdn)[^"']*)["']/);
      
      if (linkMatch && linkMatch[1]) {
        return [
          {
            server: 'FastDL',
            link: linkMatch[1],
            type: 'mp4',
            quality: '720'
          }
        ];
      }
    }

    // Return the final URL from redirect
    if (finalUrl && finalUrl !== link) {
      return [
        {
          server: 'FastDL',
          link: finalUrl,
          type: 'mp4',
          quality: '720'
        }
      ];
    }

    return [];
  } catch (error) {
    console.error('[FastDL Extractor Error]', error instanceof Error ? error.message : error);
    return [];
  }
}
