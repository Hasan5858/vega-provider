import { Info, Link, ProviderContext } from "../types";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  try {
    const { axios, cheerio, getBaseUrl } = providerContext;
    const baseUrlWorker = await getBaseUrl("showbox");
    
    // Add delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Call worker for the detail page (link is already relative, e.g., /movie/inception)
    const detailWorkerUrl = `${baseUrlWorker}/api?url=${encodeURIComponent(link)}`;
    
    // Retry logic for rate limiting
    let detailRes;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        detailRes = await axios.get(detailWorkerUrl, { timeout: 30000 });
        break;
      } catch (error: any) {
        if ((error?.response?.status === 429 || error?.response?.status === 403) && retryCount < maxRetries - 1) {
          const retryDelay = (retryCount + 1) * 2000;
          console.log(`Showbox meta rate limited (${error?.response?.status}), retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retryCount++;
        } else {
          throw error;
        }
      }
    }
    
    // Check if request succeeded
    if (!detailRes || !detailRes.data) {
      throw new Error('Failed to fetch detail page after retries');
    }
    
    // Worker returns {html: "..."}
    if (!detailRes.data.html) {
      throw new Error('Worker returned empty HTML');
    }
    const data = detailRes.data.html;
    const $ = cheerio.load(data);
    const type = link.includes("tv") ? "series" : "movie";
    const imdbId = "";
    const title = $(".heading-name").text();
    const rating =
      $(".btn-imdb")
        .text()
        ?.match(/\d+(\.\d+)?/g)?.[0] || "";
    const image =
      $(".cover_follow").attr("style")?.split("url(")[1]?.split(")")[0] || "";
    const synopsis = $(".description")
      .text()
      ?.replace(/[\n\t]/g, "")
      ?.trim();
    const febID = $(".heading-name").find("a").attr("href")?.split("/")?.pop();
    
    // Add delay before second API call
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Call worker for Showbox API endpoint (/index/share_link)
    const indexPath = `/index/share_link?id=${febID}&type=${type === "movie" ? "1" : "2"}`;
    const indexWorkerUrl = `${baseUrlWorker}/api?url=${encodeURIComponent(indexPath)}`;
    
    // Retry logic for rate limiting
    let indexRes;
    retryCount = 0;
    while (retryCount < maxRetries) {
      try {
        indexRes = await axios.get(indexWorkerUrl, { timeout: 30000 });
        break;
      } catch (error: any) {
        if ((error?.response?.status === 429 || error?.response?.status === 403) && retryCount < maxRetries - 1) {
          const retryDelay = (retryCount + 1) * 2000;
          console.log(`Showbox share_link rate limited (${error?.response?.status}), retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retryCount++;
        } else {
          throw error;
        }
      }
    }
    
    // Check if request succeeded
    if (!indexRes || !indexRes.data) {
      throw new Error('Failed to fetch share_link after retries');
    }
    
    // Worker may return {data: {...}} directly (JSON) or {html: "{JSON}"} (wrapped JSON string)
    let indexData;
    if (indexRes.data.data) {
      // Worker forwards JSON directly as {data: {...}}
      indexData = indexRes.data;
    } else if (indexRes.data.html) {
      // Worker wraps JSON in {html: "..."} - try to parse it
      try {
        const indexHtml = indexRes.data.html;
        indexData = typeof indexHtml === 'string' ? JSON.parse(indexHtml) : indexHtml;
      } catch {
        indexData = indexRes.data;
      }
    } else {
      indexData = indexRes.data;
    }
    const febKey = indexData.data.link.split("/").pop();
    const febLink = `https://www.febbox.com/file/file_share_list?share_key=${febKey}&is_html=0`;
    const febRes = await axios.get(febLink);
    const febData = febRes.data;
    const fileList = febData?.data?.file_list;
    const links: Link[] = [];
    if (fileList) {
      fileList.map((file: any) => {
        const fileName = `${file.file_name} (${file.file_size})`;
        const fileId = file.fid;
        links.push({
          title: fileName,
          episodesLink: file.is_dir ? `${febKey}&${fileId}` : `${febKey}&`,
        });
      });
    }
    return {
      title,
      rating,
      synopsis,
      image,
      imdbId,
      type,
      linkList: links,
    };
  } catch (err) {
    console.error("Error fetching metadata:", err);
    return {
      title: "",
      rating: "",
      synopsis: "",
      image: "",
      imdbId: "",
      type: "",
      linkList: [],
    };
  }
};
