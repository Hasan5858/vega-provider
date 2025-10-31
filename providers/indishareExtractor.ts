import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Indishare Extractor
 * 
 * Flow (based on browser analysis):
 * 1. dl6.indishare.info/xxx → 301 → indi-share.com/xxx → 302 → indi-down4.org/xxx
 * 2. Parse download button URL from indi-down4.org (links to random blog post)
 * 3. GET the blog post page (collects cookies including file_code)
 * 4. Extract form fields (op, id, referer, etc.) from the page
 * 5. POST form data to the form action URL
 * 6. Parse the response HTML - direct link is already there (countdown is client-side JS only)
 * 7. Extract link: https://uyh4ghd4gh4uy.indiworlds.com:183/d/[hash]/filename.mkv
 */

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

export async function indishareExtractor(
  url: string
): Promise<{ link: string; type?: string } | null> {
  try {
    console.log("[Indishare] 🔍 Starting extraction from:", url);

    // Step 1 & 2: Follow redirects to indi-down4.org
    const step1Response = await axios.get(url, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: "https://skymovieshd.mba/",
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 400,
    });

    const downPageUrl = step1Response.request.res.responseUrl || url;
    console.log("[Indishare] 📍 Redirected to:", downPageUrl);

    // Extract file code from the URL (e.g., https://indi-down4.org/rej4u838hxcl)
    const fileCodeMatch = downPageUrl.match(/\/([a-z0-9]+)$/i);
    const fileCode = fileCodeMatch ? fileCodeMatch[1] : "";
    
    if (!fileCode) {
      console.log("[Indishare] ❌ Could not extract file code from URL");
      return null;
    }

    console.log("[Indishare] 🔑 File code:", fileCode);

    // Manually set the file_code cookie and collect any server-sent cookies
    const serverCookies = step1Response.headers["set-cookie"] || [];
    let cookieString = serverCookies
      .map((cookie: string) => cookie.split(";")[0])
      .join("; ");
    
    // Add file_code cookie
    cookieString = cookieString
      ? `file_code=${fileCode}; ${cookieString}`
      : `file_code=${fileCode}`;

    console.log("[Indishare] 🍪 Cookies:", cookieString);

    // Step 3: Parse the download page for the button
    const $down = cheerio.load(step1Response.data);
    const downloadButton = $down('a.button[href*="indi-share.com"]').first();
    const blogUrl = downloadButton.attr("href");

    if (!blogUrl) {
      console.log("[Indishare] ❌ Could not find download button");
      return null;
    }

    console.log("[Indishare] 🔗 Found blog URL:", blogUrl);

    // Step 4: GET the blog post page (carry cookies from previous step)
    const step2Response = await axios.get(blogUrl, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: downPageUrl,
        Cookie: cookieString,
      },
      maxRedirects: 5,
    });

    // Update cookies with any new ones from this response
    const newCookies = step2Response.headers["set-cookie"] || [];
    if (newCookies.length > 0) {
      const additionalCookies = newCookies
        .map((cookie: string) => cookie.split(";")[0])
        .join("; ");
      cookieString = cookieString
        ? `${cookieString}; ${additionalCookies}`
        : additionalCookies;
    }

    console.log("[Indishare] 🍪 Total cookies:", cookieString);

    const $blog = cheerio.load(step2Response.data);

    // Step 5: Extract form data (find the form named "F1" or with method="POST")
    let form = $blog('form[name="F1"]').first();
    
    if (form.length === 0) {
      // Fallback: look for any form with POST method
      form = $blog('form[method="POST"]').first();
    }
    
    if (form.length === 0) {
      console.log("[Indishare] ❌ Could not find download form");
      return null;
    }

    const formData: Record<string, string> = {};

    const formAction = $blog(form).attr("action");
    if (!formAction) {
      console.log("[Indishare] ❌ Form has no action");
      return null;
    }

    // Build absolute URL for form action
    const formUrl = formAction.startsWith("http")
      ? formAction
      : `https://indi-share.com${formAction}`;

    // Extract all form fields
    $blog(form).find("input").each((_, input) => {
      const name = $blog(input).attr("name");
      const value = $blog(input).attr("value") || "";
      if (name) {
        formData[name] = value;
      }
    });

    console.log("[Indishare] 📝 Form action:", formUrl);
    console.log("[Indishare] 📝 Form data:", formData);

    // Step 6: Submit the form
    const step3Response = await axios.post(formUrl, formData, {
      headers: {
        "User-Agent": USER_AGENT,
        Referer: blogUrl,
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie: cookieString,
      },
      maxRedirects: 5,
    });

    // Step 7: Parse the response for the direct download link
    const $final = cheerio.load(step3Response.data);
    
    // The direct link is in an <a> tag with href containing "indiworlds.com"
    const directLink = $final('a[href*="indiworlds.com"]').attr("href");

    if (directLink) {
      console.log("[Indishare] ✅ Successfully extracted direct link");
      return {
        link: directLink,
        type: "mkv",
      };
    }

    console.log("[Indishare] ❌ Could not find direct download link in response");
    return null;
  } catch (error: any) {
    console.log("[Indishare] ❌ Extraction failed:", error?.message || error);
    return null;
  }
}
