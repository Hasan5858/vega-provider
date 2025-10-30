import { Post, ProviderContext } from "../types";

export const getPosts = async function ({
  filter,
  page,
  // providerValue,
  signal,
  providerContext,
}: {
  filter: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { getBaseUrl, axios, cheerio } = providerContext;
  const baseUrl = await getBaseUrl("showbox");
  // Build relative path correctly whether filter already has query params or not
  // Examples:
  // - "/movie" => "/movie?page=1"
  // - "/movie?genre=16" => "/movie?genre=16&page=1"
  // - "/movie?quality=4K&release_year=all&genre=all&rating=all" => same + &page=1
  const pageSep = filter.includes("?") ? "&" : "?";
  const relativePath = `${filter}${pageSep}page=${page}`;
  return posts({ url: relativePath, signal, baseUrl, axios, cheerio });
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
  // providerValue,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { getBaseUrl, axios, cheerio } = providerContext;
  const baseUrl = await getBaseUrl("showbox");
  // Worker expects relative path, e.g., /search?keyword=avengers&page=1
  const relativePath = `/search?keyword=${encodeURIComponent(searchQuery)}&page=${page}`;
  return posts({ url: relativePath, signal, baseUrl, axios, cheerio });
};

async function posts({
  url,
  signal,
  baseUrl,
  axios,
  cheerio,
}: {
  url: string;
  signal: AbortSignal;
  baseUrl: string;
  axios: ProviderContext["axios"];
  cheerio: ProviderContext["cheerio"];
}): Promise<Post[]> {
  try {
    // Add delay to prevent rate limiting (Cloudflare Worker may enforce rate limits)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // url is already a relative path (e.g., /movie?page=1/ or /search?keyword=...)
    // Call Cloudflare Worker proxy
    const workerUrl = `${baseUrl}/api?url=${encodeURIComponent(url)}`;
    
    // Retry logic for rate limiting (429 errors)
    let res;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        res = await axios.get(workerUrl, { 
          signal,
          timeout: 30000, // 30 second timeout
        });
        break; // Success, exit retry loop
      } catch (error: any) {
        // Check for rate limiting (429) or Cloudflare challenge
        if ((error?.response?.status === 429 || error?.response?.status === 403) && retryCount < maxRetries - 1) {
          const retryDelay = (retryCount + 1) * 2000; // Exponential backoff: 2s, 4s, 6s
          console.log(`Showbox worker rate limited (${error?.response?.status}), retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retryCount++;
        } else {
          throw error; // Re-throw if not rate limit or max retries reached
        }
      }
    }
    
    if (!res || !res.data) {
      console.error('Showbox worker: No data received', workerUrl);
      return [];
    }
    
    // Worker returns {html: "..."}
    const responseData = res.data;
    if (!responseData.html) {
      console.error('Showbox worker: Missing HTML in response', responseData);
      return [];
    }
    
    const data = responseData.html;
    const $ = cheerio.load(data);
    const catalog: Post[] = [];
    $(".movie-item,.flw-item").map((i, element) => {
      const title = $(element).find(".film-name").text().trim();
      const link = $(element).find("a").attr("href");
      const image = $(element).find("img").attr("src");
      if (title && link && image) {
        catalog.push({
          title: title,
          link: link,
          image: image,
        });
      }
    });
    return catalog;
  } catch (err) {
    console.error('Showbox posts error:', err);
    return [];
  }
}
