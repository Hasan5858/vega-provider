import { AxiosStatic } from "axios";
import * as cheerio from "cheerio";

/**
 * Uptomega Extractor
 * 
 * Flow:
 * 1. GET https://uptomega.net/{fileId} → parse form
 * 2. POST with op=download1, id, fname, referer → get countdown page
 * 3. POST with op=download2, id, rand, referer → 302 redirect to direct download
 * 4. Extract location header: http://down1.uptodown1.com:8080/d/[hash]/[filename]
 */

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export async function uptomegaExtractor(
  url: string,
  axios: AxiosStatic,
  signal?: AbortSignal
): Promise<{ link: string; type?: string } | null> {
  try {
    console.log("[Uptomega] 🔍 Starting extraction from:", url);

    // Step 1: GET initial page and extract form data
    const step1Response = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://howblogs.xyz/",
      },
      maxRedirects: 5,
      timeout: 30000, // 30 second timeout for slow networks
    });

    const $initial = cheerio.load(step1Response.data);

    // Extract form data - form already has op=download1 in hidden input
    const formData: Record<string, string> = {};
    const form = $initial('form[method="POST"][action=""]').first();

    if (form.length === 0) {
      console.log("[Uptomega] ❌ Could not find form");
      return null;
    }

    // Extract all hidden form fields (includes op, usr_login, id, fname, referer)
    form.find('input[type="hidden"]').each((_, input) => {
      const name = $initial(input).attr("name");
      const value = $initial(input).attr("value") || "";
      if (name) {
        formData[name] = value;
      }
    });

    // Get the submit button value (method_free)
    const submitBtn = form.find('input[type="submit"][name="method_free"]');
    if (submitBtn.length) {
      formData.method_free = submitBtn.attr("value") || "Free Download >>";
    }

    // Ensure required fields are present
    if (!formData.id) {
      console.log("[Uptomega] ❌ Missing file ID in form");
      return null;
    }

    console.log("[Uptomega] 📝 File ID:", formData.id);

    // Step 2: POST with the form data (already has op=download1)

    const urlEncodedData = Object.entries(formData)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    const step2Response = await axios.post(url, urlEncodedData, {
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/x-www-form-urlencoded",
        Referer: url,
        Origin: "https://uptomega.net",
      },
      maxRedirects: 5,
      timeout: 30000, // Increased to 30 seconds for slow networks
      signal,
    });

    // Step 3: Parse countdown page and extract form data for final download
    const $countdown = cheerio.load(step2Response.data);
    const finalForm = $countdown('form[name="F1"]').first();

    if (finalForm.length === 0) {
      console.log("[Uptomega] ❌ Could not find final form (name=F1)");
      console.log("[Uptomega] Checking for any forms...");
      const anyForms = $countdown('form');
      console.log("[Uptomega] Found", anyForms.length, "forms on countdown page");
      return null;
    }

    const finalFormData: Record<string, string> = {};
    finalForm.find("input").each((_, input) => {
      const name = $countdown(input).attr("name");
      const value = $countdown(input).attr("value") || "";
      if (name && name !== "adblock_detected") {
        finalFormData[name] = value;
      }
    });

    console.log("[Uptomega] 📋 Final form data:", finalFormData);

    // Verify we have the required fields
    if (!finalFormData.id || !finalFormData.op) {
      console.log("[Uptomega] ❌ Missing required fields in final form");
      return null;
    }

    console.log("[Uptomega] 🔗 Submitting final download request");

    const finalData = Object.entries(finalFormData)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");

    // Step 4: POST final request and follow redirect
    // React Native axios doesn't handle maxRedirects: 0 properly - it throws "Network Error"
    // Solution: Let axios follow redirects, then extract the final URL from the response
    let directLink: string | undefined;
    
    try {
      console.log("[Uptomega] 📤 Posting final form...");
      
      // React Native axios: Follow redirects normally and extract final URL from response
      // This avoids the "Network Error" issue with maxRedirects: 0
      console.log("[Uptomega] 📨 Posting final form with redirect following...");
      
      const step3Response = await axios.post(url, finalData, {
        headers: {
          "User-Agent": USER_AGENT,
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: url,
          Origin: "https://uptomega.net",
          // Don't download the entire file - request just the first few bytes
          "Range": "bytes=0-1023",
        },
        maxRedirects: 5, // Follow redirects normally
        timeout: 30000,
        signal,
        // Accept partial content responses
        validateStatus: (status) => status >= 200 && status < 500,
      });

      console.log("[Uptomega] 📊 POST response status:", step3Response.status);
      
      // In Node.js axios, we need to check the request.res.responseUrl
      // In React Native, we check request.responseURL
      const responseUrl = step3Response.request?.res?.responseUrl || 
                         step3Response.request?.responseURL ||
                         step3Response.request?._response?.url;
      
      console.log("[Uptomega] 🔍 Original URL:", url.substring(0, 60));
      console.log("[Uptomega] 🔍 Response URL:", responseUrl?.substring(0, 100) || "not found");
      
      // 1. Check if we were redirected (responseURL different from original)
      if (responseUrl && responseUrl !== url && !responseUrl.includes('uptomega.net')) {
        directLink = responseUrl;
        console.log("[Uptomega] 🔀 Followed redirect to download server!");
      }
      
      // 2. Check location header
      if (!directLink && step3Response.headers.location) {
        directLink = step3Response.headers.location;
        console.log("[Uptomega] � Got location header:", directLink?.substring(0, 100) || directLink);
      }
      
      // 3. Check content-location header (sometimes used instead of location)
      if (!directLink && step3Response.headers['content-location']) {
        directLink = step3Response.headers['content-location'];
        console.log("[Uptomega] 📍 Got content-location header:", directLink?.substring(0, 100) || directLink);
      }
      
      // 3. Parse the HTML response for download link
      if (!directLink && step3Response.status === 200 && step3Response.data) {
        console.log("[Uptomega] ℹ️ Status 200 - checking page for download link");
        const $final = cheerio.load(step3Response.data);
        // Look for download link in the page
        const downloadBtn = $final('a.btn:contains("Download")').attr("href");
        const directLinkInPage = $final('a[href*="uptodown"]').attr("href");
        directLink = downloadBtn || directLinkInPage;
        
        if (directLink) {
          console.log("[Uptomega] 📄 Found link in page");
        }
      }

      if (directLink) {
        console.log("[Uptomega] ✅ Successfully extracted direct link");
        // Determine file type from URL
        const fileType = directLink.match(/\.(mkv|mp4|avi|webm)(\?|$)/i)?.[1] || "mkv";
        
        return {
          link: directLink,
          type: fileType.toLowerCase(),
        };
      }

      console.log("[Uptomega] ❌ Could not find download link in response");
      return null;
    } catch (innerError: any) {
      // Inner catch for the final POST request
      const errorMsg = innerError?.message || innerError?.code || "Unknown error";
      console.log("[Uptomega] ❌ Final request failed:", errorMsg);
      
      if (innerError?.config?.url) {
        console.log("[Uptomega] Failed URL:", innerError.config.url);
      }
      if (innerError?.response) {
        console.log("[Uptomega] Response status:", innerError.response.status);
        console.log("[Uptomega] Response headers:", JSON.stringify(innerError.response.headers));
      }
      
      return null;
    }
  } catch (error: any) {
    // Outer catch for the entire extraction process
    const errorMsg = error?.message || error?.code || "Unknown error";
    console.log("[Uptomega] ❌ Extraction failed:", errorMsg);
    
    if (error?.config?.url) {
      console.log("[Uptomega] Failed URL:", error.config.url);
    }
    if (error?.response) {
      console.log("[Uptomega] Response status:", error.response.status);
    }
    
    return null;
  }
}
