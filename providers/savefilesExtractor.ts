/**
 * SaveFiles Extractor
 * Extracts video streams from savefiles.com using the download mechanism
 * 
 * Strategy:
 * 1. Convert embed URL (/e/{id}) to download URL (/d/{id}_n)
 * 2. Fetch the download page to extract form parameters (op, id, mode, hash)
 * 3. POST to the download URL with parameters to get the direct download link
 * 
 * The download page contains a hidden form with:
 * - op: "download_orig"
 * - id: {video_id}
 * - mode: "n" (normal quality)
 * - hash: {generated_hash}
 * 
 * POSTing this form returns the direct file URL
 */

import { AxiosStatic } from "axios";

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

/**
 * Extract stream from SaveFiles URL
 * @param url - SaveFiles embed or download URL (e.g., https://savefiles.com/e/k8zyey44415m)
 * @param axios - Axios instance
 * @param signal - AbortSignal for cancellation
 * @returns Stream info with link and headers
 */
export async function savefilesExtractor(
  url: string,
  axios: AxiosStatic,
  signal?: AbortSignal
): Promise<{ link: string; headers?: Record<string, string>; type?: string } | null> {
  try {
    console.log("SaveFiles: Starting extraction for:", url.substring(0, 80));

    // Extract video ID from URL (handles both /e/{id} and /d/{id})
    const idMatch = url.match(/\/(?:e|d)\/([A-Za-z0-9_-]+)/i);
    if (!idMatch) {
      console.error("SaveFiles: Could not extract video ID from URL");
      return null;
    }

    const videoId = idMatch[1];
    console.log("SaveFiles: Video ID:", videoId);

    // Construct download URL with quality suffix (_n = normal quality)
    const downloadUrl = `https://savefiles.com/d/${videoId}_n`;
    console.log("SaveFiles: Download URL:", downloadUrl);

    try {
      // Step 1: Fetch the download page to get form parameters
      console.log("SaveFiles: Fetching download page...");
      const pageResponse = await axios.get(downloadUrl, {
        headers: {
          "User-Agent": USER_AGENT,
          "Referer": url,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        },
        signal,
        timeout: 15000,
      });

      const html = typeof pageResponse.data === 'string' ? pageResponse.data : '';
      console.log("SaveFiles: Page fetched (" + html.length + " chars)");

      // Extract form parameters from hidden inputs
      // Pattern: <input type="hidden" name="hash" value="HASH_VALUE">
      const hashMatch = html.match(/name="hash"\s+value="([^"]+)"/i);
      if (!hashMatch) {
        console.error("SaveFiles: Could not extract hash from download page");
        return null;
      }

      const hash = hashMatch[1];
      console.log("SaveFiles: Hash extracted");

      // Step 2: POST the form to get the direct download link
      console.log("SaveFiles: Submitting download form...");
      
      const formData = new URLSearchParams();
      formData.append('op', 'download_orig');
      formData.append('id', videoId);
      formData.append('mode', 'n'); // normal quality
      formData.append('hash', hash);

      const downloadResponse = await axios.post(downloadUrl, formData, {
        headers: {
          "User-Agent": USER_AGENT,
          "Referer": downloadUrl,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        signal,
        timeout: 15000,
        maxRedirects: 10,
      });

      const contentType = downloadResponse.headers['content-type'] || '';
      console.log("SaveFiles: Response Content-Type:", contentType);

      // Check if we got a direct file or redirect
      if (contentType.includes('video') || contentType.includes('application/octet')) {
        console.log("SaveFiles: Got direct video file");
        const finalUrl = downloadResponse.config.url || downloadUrl;
        return {
          link: typeof finalUrl === 'string' ? finalUrl : downloadUrl,
          headers: {
            "User-Agent": USER_AGENT,
            "Referer": downloadUrl,
          },
          type: 'mp4',
        };
      }

      // If response is HTML, check if it contains a download link
      if (contentType.includes('text/html')) {
        const responseHtml = typeof downloadResponse.data === 'string' ? downloadResponse.data : '';
        
        // Look for direct download link in the response
        // Pattern: href="http://..." or location header redirects
        const directLinkMatch = responseHtml.match(/https?:\/\/[^\s"'<>]+(?:download|get_file|dl|storage)[^\s"'<>]*/i);
        
        if (directLinkMatch) {
          const directLink = directLinkMatch[0];
          console.log("SaveFiles: Found direct link in response");
          return {
            link: directLink,
            headers: {
              "User-Agent": USER_AGENT,
              "Referer": downloadUrl,
            },
            type: 'mp4',
          };
        }
      }

      // If form submission redirected to a file, use that URL
      console.log("SaveFiles: Using submission response URL");
      const finalUrl = downloadResponse.config.url || downloadUrl;
      return {
        link: typeof finalUrl === 'string' ? finalUrl : downloadUrl,
        headers: {
          "User-Agent": USER_AGENT,
          "Referer": downloadUrl,
        },
        type: 'mp4',
      };

    } catch (error: any) {
      if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
        console.log("SaveFiles: Request aborted");
        return null;
      }
      
      console.error("SaveFiles: Error during extraction:", error.message);
      return null;
    }

  } catch (error: any) {
    console.error("SaveFiles: Extraction error:", error.message);
    return null;
  }
}
