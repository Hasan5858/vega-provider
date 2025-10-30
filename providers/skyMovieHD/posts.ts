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
  return fetchPosts({ filter: "", page, query: searchQuery, signal, providerContext });
}

// --- Core fetch function ---
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
    const baseUrl = "https://skymovieshd.mba";
    let url: string;

    if (query && query.trim()) {
      // New site search endpoint
      const params = new URLSearchParams();
      params.append("search", query.trim());
      params.append("cat", "All");
      url = `${baseUrl}/search.php?${params.toString()}`;
    } else if (filter) {
      const normalized = filter.startsWith("/") ? filter.slice(1) : filter;
      url = `${baseUrl}/${normalized}`;
    } else {
      url = `${baseUrl}/`;
    }

    const { axios, cheerio } = providerContext;
    const res = await axios.get(url, { headers: defaultHeaders, signal });
    const $ = cheerio.load(res.data || "");

    const resolveUrl = (href: string) =>
      href?.startsWith("http") ? href : new URL(href, baseUrl).href;

    const seen = new Set<string>();
    const catalog: Post[] = [];

    // New site: links are simple anchors to /movie/*.html with text as title
    $("a[href]")
      .filter((_, a) => {
        const href = ($(a).attr("href") || "").trim();
        return /(^|\/)movie\/.+\.html$/i.test(href);
      })
      .each((_, a) => {
        const rawHref = ($(a).attr("href") || "").trim();
        const link = resolveUrl(rawHref);
        if (seen.has(link)) return;
        const title = ($(a).text() || "").trim();
        if (!title) return;
        seen.add(link);
        catalog.push({ title, link, image: "" });
      });

    return catalog.slice(0, 100);
  } catch (err) {
    console.error("fetchPosts error:", err instanceof Error ? err.message : String(err));
    return [];
  }
}
