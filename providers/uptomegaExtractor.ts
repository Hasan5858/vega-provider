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

    // Step 4: POST final request
    // React Native axios doesn't handle maxRedirects: 0 properly for 302 responses
    // We need to intercept the redirect manually
    let directLink: string | undefined;
    
    try {
      // Use a custom axios config to handle redirects manually
      const step3Response = await axios.post(url, finalData, {
        headers: {
          "User-Agent": USER_AGENT,
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: url,
          Origin: "https://uptomega.net",
        },
        maxRedirects: 0, // Don't follow redirects
        validateStatus: (status) => status >= 200 && status < 400, // Accept 3xx as success
        timeout: 30000,
        signal,
      }).catch((error) => {
        // Axios throws error for 3xx when maxRedirects: 0
        // But we can access the response from the error
        if (error.response && (error.response.status === 301 || error.response.status === 302)) {
          return error.response;
        }
        throw error;
      });

      console.log("[Uptomega] 📊 Final response status:", step3Response.status);
      
      // Check for redirect location header (should be present for 301/302)
      if (step3Response.headers.location) {
        directLink = step3Response.headers.location;
        console.log("[Uptomega] 🔀 Got redirect to:", directLink?.substring(0, 100) || directLink);
      }
      
      // Also check responseURL as backup
      if (!directLink && step3Response.request?.responseURL && step3Response.request.responseURL !== url) {
        directLink = step3Response.request.responseURL;
        console.log("[Uptomega] 📍 Got URL from request:", directLink?.substring(0, 100) || directLink);
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
