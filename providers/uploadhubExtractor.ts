import { AxiosStatic } from "axios";
import * as cheerio from "cheerio";

/**
 * Uploadhub Extractor
 * 
 * Flow:
 * 1. GET https://uploadhub.dad/{fileId} → 302 redirect to /f/{slug}
 * 2. Parse HTML → Find direct download link in <a> tag
 * 3. Direct link format: https://file*.kingfiles.club:8080/d/{hash}/{filename}
 */

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export async function uploadhubExtractor(
  url: string,
  axios: AxiosStatic
): Promise<{ link: string; type?: string } | null> {
  try {
    console.log("[Uploadhub] 🔍 Starting extraction from:", url);

    // Step 1: GET the page (follows 302 redirect automatically)
    const response = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://howblogs.xyz/",
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(response.data);

    // Step 2: Extract form data for POST request
    const form = $('form[name="F1"]').first();
    
    if (form.length === 0) {
      console.log("[Uploadhub] ❌ Could not find form F1");
      return null;
    }

    const formData: Record<string, string> = {};
    form.find('input[type="hidden"]').each((_, input) => {
      const name = $(input).attr("name");
      const value = $(input).attr("value") || "";
      if (name) {
        formData[name] = value;
      }
    });

    console.log("[Uploadhub] 📋 Form data:", formData);

    // Step 3: POST the form to get the direct download page
    const urlEncoded = Object.entries(formData)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    const postResponse = await axios.post(response.request.res.responseUrl || url, urlEncoded, {
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
        "Referer": response.request.res.responseUrl || url,
        "Origin": "https://uploadhub.dad",
      },
      maxRedirects: 5,
    });

    const $post = cheerio.load(postResponse.data);

    // Step 4: Find the direct download link
    // Pattern: <div id="direct_link"><a href="https://file*.kingfiles.club:8080/d/...">...</a></div>
    let directLink = "";

    // Try direct_link div first
    const directLinkDiv = $post('#direct_link a');
    if (directLinkDiv.length > 0) {
      const href = directLinkDiv.attr("href");
      if (href) {
        directLink = href;
      }
    }

    // Fallback: search all links for kingfiles.club
    if (!directLink) {
      $post('a').each((_, link) => {
        const href = $post(link).attr("href");
        
        if (href && href.includes("kingfiles.club") && href.includes("/d/")) {
          directLink = href;
          return false; // break
        }
        
        // Also check for download icon
        if (href && $post(link).find('i.fa-download, i.fas.fa-download').length > 0) {
          if (href.includes("kingfiles.club") || href.includes("/d/")) {
            directLink = href;
            return false; // break
          }
        }
      });
    }

    if (!directLink) {
      console.log("[Uploadhub] ❌ Could not find direct download link after POST");
      return null;
    }

    console.log("[Uploadhub] ✅ Successfully extracted direct link");

    // Determine file type from URL
    const fileTypeMatch = directLink.match(/\.(mkv|mp4|avi|webm)(\?|$)/i);
    const fileType = fileTypeMatch ? fileTypeMatch[1].toLowerCase() : "mkv";

    return {
      link: directLink,
      type: fileType,
    };
  } catch (error: any) {
    console.log("[Uploadhub] ❌ Extraction failed:", error?.message || error);
    return null;
  }
}
