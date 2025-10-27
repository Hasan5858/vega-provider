import { Stream } from './types';
import axios from 'axios';

/**
 * VOE.sx Video Extractor
 * 
 * Extracts direct download links from voe.sx using the download page.
 * Flow:
 * 1. voe.sx/e/{id} redirects to lukesitturn.com/{id}
 * 2. Append /download to get lukesitturn.com/{id}/download
 * 3. Follow redirect to final download page (e.g., jilliandescribecompany.com/{id}/download)
 * 4. Extract direct download link from the download button
 */

export async function voeExtractor(
  url: string
): Promise<Stream[]> {
  try {
    console.log(`VOE: Starting extraction from ${url}`);
    
    // Step 1: Follow redirect from voe.sx/e/{id} to lukesitturn.com/e/{id}
    const redirectResponse = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': url,
      },
      maxRedirects: 5,
    });

    // Check for JavaScript redirect in HTML
    let initialHtml = redirectResponse.data;
    const locationMatch = initialHtml.match(/location\.href\s*=\s*["']([^"']+)["']/);
    const windowLocationMatch = initialHtml.match(/window\.location\s*=\s*["']([^"']+)["']/);
    
    // React Native axios doesn't have request.res.responseUrl, use config.url or parse from response
    let redirectedUrl = redirectResponse.config?.url || url;
    
    if (locationMatch || windowLocationMatch) {
      redirectedUrl = (locationMatch || windowLocationMatch)[1];
      console.log(`VOE: Found JS redirect to ${redirectedUrl}`);
    } else {
      console.log(`VOE: Redirected to ${redirectedUrl}`);
    }

    // Step 2: Construct download URL (remove /e/ if present)
    const baseUrl = redirectedUrl.replace(/\/e\//, '/').split('?')[0].replace(/\/$/, '');
    const downloadUrl = `${baseUrl}/download`;
    console.log(`VOE: Constructed download URL: ${downloadUrl}`);

    // Step 3: Follow redirect to intermediate download page
    const downloadPageResponse = await axios.get(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': redirectedUrl,
      },
      maxRedirects: 0, // Don't follow HTTP redirects, handle JS redirects
      validateStatus: (status) => status < 400, // Accept all non-error responses
    });

    let downloadPageHtml = downloadPageResponse.data;
    
    // Check for another JS redirect to final download page (e.g., jilliandescribecompany.com)
    const finalLocationMatch = downloadPageHtml.match(/window\.location\.href\s*=\s*["']([^"']+)["']/);
    
    let finalDownloadUrl = downloadPageResponse.config?.url || downloadUrl;
    
    if (finalLocationMatch) {
      finalDownloadUrl = finalLocationMatch[1];
      console.log(`VOE: Found final JS redirect to ${finalDownloadUrl}`);
      
      // Fetch the actual final download page
      const finalPageResponse = await axios.get(finalDownloadUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': downloadUrl,
        },
        maxRedirects: 5,
      });
      
      downloadPageHtml = finalPageResponse.data;
      finalDownloadUrl = finalPageResponse.config?.url || finalDownloadUrl;
    }

    console.log(`VOE: Final download page: ${finalDownloadUrl}`);

    // Step 4: Extract download link from the page
    // Look for the download button with direct download link
    const patterns = [
      // Specific CDN pattern (edgeon-bandwidth, etc.)
      /href=["']([^"']*(?:edgeon-bandwidth|cdn)[^"']*\.mp4[^"']*)[^"']*["']/i,
      // Direct download link with quality text
      /<a[^>]*href=["'](https?:\/\/[^"']+\.(?:mp4|mkv)(?:\?[^"']*)?)[^"']*["'][^>]*>[\s\S]*?Quality\s+(\d+)p[\s\S]*?<\/a>/i,
      // More specific pattern for VOE download button
      /<a[^>]*href=["']([^"']+)["'][^>]*>[\s\S]*?Quality[\s\S]*?Direct\s+Download\s+Link[\s\S]*?<\/a>/i,
      // Download button with download attribute
      /<a[^>]*href=["']([^"']+)["'][^>]*download[^>]*>/i,
    ];

    for (const pattern of patterns) {
      const match = downloadPageHtml.match(pattern);
      if (match && match[1]) {
        let videoUrl = match[1];
        
        // Decode HTML entities (&amp; -> &)
        videoUrl = videoUrl.replace(/&amp;/g, '&');
        
        // Skip non-video URLs
        if (!videoUrl.includes('://') || (!videoUrl.includes('.mp4') && !videoUrl.includes('.mkv'))) {
          continue;
        }
        
        const quality = match[2] || '720'; // Extract quality if available

        // Make sure URL is absolute
        if (videoUrl.startsWith('/')) {
          const urlObj = new URL(finalDownloadUrl);
          videoUrl = `${urlObj.protocol}//${urlObj.host}${videoUrl}`;
        }

        console.log(`VOE: Found download link: ${videoUrl}`);

        return [
          {
            server: 'VOE',
            quality: quality,
            link: videoUrl,
            type: 'mkv',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
              'Referer': finalDownloadUrl,
            },
          },
        ];
      }
    }

    console.log('VOE: No download link found on page');
    return [];
  } catch (error: any) {
    console.error(`VOE: Extraction failed - ${error.message}`);
    return [];
  }
}
