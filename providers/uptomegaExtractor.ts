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

    // Step 1: GET initial page to parse form
    const step1Response = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://howblogs.xyz/",
      },
      maxRedirects: 5,
      timeout: 10000,
      signal,
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
      timeout: 10000,
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

    // Step 4: POST final request with aggressive timeout
    // Use Promise.race to ensure we timeout even if axios doesn't respect it
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Request timeout after 10 seconds")), 10000);
    });

    // React Native doesn't handle maxRedirects: 0 well, so we intercept the redirect
    let finalResponse;
    try {
      const response = await axios.post(url, finalData, {
        headers: {
          "User-Agent": USER_AGENT,
          "Content-Type": "application/x-www-form-urlencoded",
          Referer: url,
          Origin: "https://uptomega.net",
        },
        maxRedirects: 0, // Don't follow redirect
        validateStatus: (status) => status >= 200 && status < 400,
        timeout: 10000,
        signal,
      });
      finalResponse = response;
    } catch (error: any) {
      // React Native axios throws on 302/301 even with validateStatus
      console.log("[Uptomega] ⚠️ Request threw error, checking for redirect...");
      if (error?.response) {
        console.log("[Uptomega] 📊 Error response status:", error.response.status);
        if (error.response.status === 302 || error.response.status === 301) {
          console.log("[Uptomega] 📍 Caught redirect in error handler");
          finalResponse = error.response;
        } else {
          throw error;
        }
      } else {
        // Network error without response
        console.log("[Uptomega] ❌ Network error without response");
        throw error;
      }
    }

    const requestPromise = Promise.resolve(finalResponse);

    const step3Response = await Promise.race([requestPromise, timeoutPromise]);

    console.log("[Uptomega] 📊 Final response status:", step3Response.status);
    
    // Extract the direct download link from Location header
    let directLink = step3Response.headers.location;

    // If no redirect, check for link in page (status 200)
    if (!directLink && step3Response.status === 200) {
      console.log("[Uptomega] ℹ️ Status 200 - checking page for download link");
      const $final = cheerio.load(step3Response.data);
      // Look for download link in the page
      const downloadBtn = $final('a.btn:contains("Download")').attr("href");
      const directLinkInPage = $final('a[href*="uptodown"]').attr("href");
      directLink = downloadBtn || directLinkInPage;
      
      if (directLink) {
        console.log("[Uptomega] 📄 Found link in page");
      }
    } else if (directLink) {
      console.log("[Uptomega] 🔀 Got redirect to:", directLink.slice(0, 100));
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

    console.log("[Uptomega] ❌ Could not find download link in response (status:", step3Response.status, ")");
    return null;
  } catch (error: any) {
    const errorMsg = error?.message || error?.code || "Unknown error";
    console.log("[Uptomega] ❌ Extraction failed:", errorMsg);
    
    // Log more details for debugging
    if (error?.config?.url) {
      console.log("[Uptomega] Failed URL:", error.config.url);
    }
    if (error?.response) {
      console.log("[Uptomega] Response status:", error.response.status);
    }
    
    return null;
  }
}
