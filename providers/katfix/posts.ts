import { Post, ProviderContext } from "../types";

const defaultHeaders = {
  Referer: "https://www.google.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
    "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
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
  try {
    const baseUrl = await providerContext.getBaseUrl("katfix");
    
    // Debug logging that survives minification
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Base URL received:", baseUrl);
      window.console.log("🔍 DEBUG - Base URL type:", typeof baseUrl);
      window.console.log("🔍 DEBUG - Base URL length:", baseUrl ? baseUrl.length : 'undefined');
    }
    
    // Fallback for Node.js environment
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Base URL: ${baseUrl}\n`);
      process.stdout.write(`🔍 DEBUG - Type: ${typeof baseUrl}\n`);
      process.stdout.write(`🔍 DEBUG - Length: ${baseUrl ? baseUrl.length : 'undefined'}\n`);
    }
    let url: string;

    // --- Build URL for category filter or search query
    if (query && query.trim()) {
      url = `${baseUrl}/?s=${encodeURIComponent(query)}${
        page > 1 ? `&paged=${page}` : ""
      }`;
    } else if (filter) {
      url = filter.startsWith("/")
        ? `${baseUrl}${filter.replace(/\/$/, "")}${
            page > 1 ? `/page/${page}` : ""
          }`
        : `${baseUrl}/${filter}${page > 1 ? `/page/${page}` : ""}`;
    } else {
      url = `${baseUrl}${page > 1 ? `/page/${page}` : ""}`;
    }

    const { axios, cheerio } = providerContext;
    
    // Debug the constructed URL
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Constructed URL:", url);
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Constructed URL: ${url}\n`);
    }
    
    const res = await axios.get(url, { headers: defaultHeaders, signal });
    
    // Debug the response
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Response status:", res.status);
      window.console.log("🔍 DEBUG - Response data length:", res.data ? res.data.length : 'no data');
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Response status: ${res.status}\n`);
      process.stdout.write(`🔍 DEBUG - Response data length: ${res.data ? res.data.length : 'no data'}\n`);
    }
    
    const $ = cheerio.load(res.data || "");

    const resolveUrl = (href: string) =>
      href?.startsWith("http")
        ? href
        : `${baseUrl}${href.startsWith("/") ? "" : "/"}${href}`;

    const seen = new Set<string>();
    const catalog: Post[] = [];

    // --- HDMovie2 selectors
    const POST_SELECTORS = [
      ".pstr_box",
      "article",
      ".result-item",
      ".post",
      ".item",
      ".thumbnail",
      ".latest-movies",
      ".movie-item",
    ].join(",");

    // Debug: Check how many elements each selector finds
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Testing selectors:");
      POST_SELECTORS.split(',').forEach(selector => {
        const count = $(selector).length;
        window.console.log(`  ${selector}: ${count} elements`);
      });
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write("🔍 DEBUG - Testing selectors:\n");
      POST_SELECTORS.split(',').forEach(selector => {
        const count = $(selector).length;
        process.stdout.write(`  ${selector}: ${count} elements\n`);
      });
    }

    $(POST_SELECTORS).each((_, el) => {
      const card = $(el);
      let link = card.find("a[href]").first().attr("href") || "";
      if (!link) return;
      link = resolveUrl(link);
      if (seen.has(link)) return;

      let title =
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

    // Debug: Show final results
    if (typeof window !== 'undefined' && window.console) {
      window.console.log("🔍 DEBUG - Final catalog length:", catalog.length);
      window.console.log("🔍 DEBUG - Sample posts:", catalog.slice(0, 3).map(p => p.title));
    }
    if (typeof process !== 'undefined' && process.stdout) {
      process.stdout.write(`🔍 DEBUG - Final catalog length: ${catalog.length}\n`);
      process.stdout.write(`🔍 DEBUG - Sample posts: ${catalog.slice(0, 3).map(p => p.title).join(', ')}\n`);
    }

    return catalog.slice(0, 100);
  } catch (err) {
    console.error(
      "HDMovie2 fetchPosts error:",
      err instanceof Error ? err.message : String(err)
    );
    return [];
  }
}
