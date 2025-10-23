import { Post, ProviderContext } from "../types";

const defaultHeaders = {
  Referer: "https://movies4u.ps/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  "Pragma": "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "same-origin",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

// --- Normal catalog posts ---
export async function getPosts({
  filter,
  page = 1,
  signal,
  providerContext,
}: {
  filter?: string;
  page?: number;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  return fetchPosts({ filter, page, query: "", signal, providerContext });
}

// --- Search posts ---
export async function getSearchPosts({
  searchQuery,
  page = 1,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page?: number;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  return fetchPosts({
    filter: "",
    page,
    query: searchQuery,
    signal,
    providerContext,
  });
}

// --- Core function ---
async function fetchPosts({
  filter,
  query,
  page = 1,
  signal,
  providerContext,
}: {
  filter?: string;
  query?: string;
  page?: number;
  signal?: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  console.log("🚀 Movies4U fetchPosts called");
  console.log(`Filter: "${filter}", Query: "${query}", Page: ${page}`);
  try {
    const baseUrl = await providerContext.getBaseUrl("movies4u");
    let url: string;

    // --- Build URL for category filter or search query
    if (query && query.trim()) {
      url = `${baseUrl}/search/${encodeURIComponent(query)}/${
        page > 1 ? `page/${page}/` : ""
      }`;
    } else if (filter) {
      url = filter.startsWith("/")
        ? `${baseUrl}${filter.replace(/\/$/, "")}${
            page > 1 ? `/page/${page}` : ""
          }`
        : `${baseUrl}/${filter}${page > 1 ? `/page/${page}` : ""}`;
    } else {
      // Homepage - ensure we have the correct URL
      url = `${baseUrl}${page > 1 ? `/page/${page}/` : ""}`;
    }
    
    // Fix double slashes
    url = url.replace(/([^:]\/)\/+/g, '$1');

    console.log(`🔗 Constructed URL: ${url}`);
    const { axios, cheerio } = providerContext;
    
    // Add retry logic for search requests
    let res: any;
    let retries = 0;
    const maxRetries = 2;
    
    while (retries <= maxRetries) {
      try {
        res = await axios.get(url, { 
          headers: defaultHeaders, 
          signal,
          timeout: 10000,
          maxRedirects: 5,
          decompress: true,
          responseType: 'text'
        });
        break;
      } catch (error: any) {
        if (error.response?.status === 403 && retries < maxRetries) {
          console.log(`Search request blocked (403), retrying... (${retries + 1}/${maxRetries})`);
          retries++;
          // Wait a bit before retry
          await new Promise(resolve => setTimeout(resolve, 1000));
          continue;
        }
        throw error;
      }
    }
    
    if (!res) {
      throw new Error("Failed to fetch data after retries");
    }
    
    // axios with transformResponse can auto-decompress, but ensure we have string data
    let htmlData = res.data;
    console.log(`Content-Encoding: ${res.headers['content-encoding']}`);
    console.log(`Response data type: ${typeof htmlData}`);
    console.log(`Response data is string: ${typeof htmlData === 'string'}`);
    
    // If data is not a string, convert it
    if (typeof htmlData !== 'string') {
      // Try to convert ArrayBuffer or other types to string
      if (htmlData && typeof htmlData === 'object') {
        try {
          htmlData = String(htmlData);
        } catch (e) {
          console.error("Failed to convert response data to string");
          htmlData = "";
        }
      }
    }
    
    const $ = cheerio.load(htmlData || "");
    
    console.log("🔍 Movies4U Debug Info:");
    console.log(`URL: ${url}`);
    console.log(`Response length: ${htmlData?.length || 0}`);
    console.log(`Cheerio loaded: Yes`);
    console.log(`Response status: ${res.status}`);

    // Debug: Check what's actually in the HTML
    const htmlStr = htmlData?.toString() || '';
    console.log(`HTML starts with: ${htmlStr.substring(0, 100)}`);
    console.log(`Contains 'entry-card': ${htmlStr.includes('entry-card')}`);
    console.log(`Contains 'article': ${htmlStr.includes('<article')}`);
    console.log(`Contains 'entries': ${htmlStr.includes('entries')}`);
    
    // Check if body exists
    console.log(`Body found: ${$('body').length > 0}`);
    console.log(`Total divs: ${$('div').length}`);
    console.log(`Total articles: ${$('article').length}`);
    console.log(`Divs with class 'entries': ${$('div.entries').length}`);

    const resolveUrl = (href: string) =>
      href?.startsWith("http") ? href : new URL(href, url).href;

    const seen = new Set<string>();
    const catalog: Post[] = [];

    // --- Movies4u selectors - First try direct article selection
    let elements = $('article.entry-card');
    console.log(`🔍 Using article.entry-card selector: ${elements.length} found`);
    
    // If no results, try broader selectors
    if (elements.length === 0) {
      elements = $('article');
      console.log(`🔍 Fallback to article: ${elements.length} found`);
    }
    
    if (elements.length === 0) {
      elements = $('.entry-card');
      console.log(`🔍 Fallback to .entry-card: ${elements.length} found`);
    }
    
    console.log(`🔍 Total elements to process: ${elements.length}`);
    
    elements.each((_, el) => {
      const card = $(el);
      let link = card.find("a[href]").first().attr("href") || "";
      if (!link) return;
      link = resolveUrl(link);
      if (seen.has(link)) return;

      let title =
        card.find("h2.entry-title").first().text().trim() ||
        card.find("h2").first().text().trim() ||
        card.find("a[title]").first().attr("title")?.trim() ||
        card.text().trim();
      title = title
        .replace(/\[.*?\]/g, "")
        .replace(/\(.+?\)/g, "")
        .replace(/\s{2,}/g, " ")
        .trim();
      if (!title) return;

      const img =
        card.find("img").first().attr("src") ||
        card.find("img").first().attr("data-src") ||
        card.find("img").first().attr("data-original") ||
        "";
      const image = img ? resolveUrl(img) : "";

      seen.add(link);
      catalog.push({ title, link, image });
    });
    
    console.log(`🔍 Final catalog length: ${catalog.length}`);
    console.log(`🔍 Sample posts: ${catalog.slice(0, 3).map(p => p.title).join(', ')}`);

    return catalog.slice(0, 100);
  } catch (err) {
    console.error("❌ Movies4U fetchPosts error:");
    console.error("Error message:", err instanceof Error ? err.message : String(err));
    console.error("Error stack:", err instanceof Error ? err.stack : 'No stack');
    return [];
  }
}
