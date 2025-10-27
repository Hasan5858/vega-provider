import { Post, ProviderContext } from "../types";

export const getPosts = async function ({
  filter,
  page,
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

  const baseUrl = await getBaseUrl("primewire");
  const url = `${baseUrl + filter}&page=${page}`;
  return posts({ baseUrl, url, signal, axios, cheerio });
};

export const getSearchPosts = async function ({
  searchQuery,
  page,
  signal,
  providerContext,
}: {
  searchQuery: string;
  page: number;
  providerValue: string;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { getBaseUrl, axios, cheerio, Aes } = providerContext;
  const getSHA256ofJSON = async function (input: any) {
    return await Aes.sha1(input);
  };
  const baseUrl = await getBaseUrl("primewire");
  const hash = await getSHA256ofJSON(searchQuery + "JyjId97F9PVqUPuMO0");
  const url = `${baseUrl}/filter?s=${searchQuery}&page=${page}&ds=${hash.slice(
    0,
    10
  )}`;
  return posts({ baseUrl, url, signal, axios, cheerio });
};

async function posts({
  baseUrl,
  url,
  signal,
  axios,
  cheerio,
}: {
  baseUrl: string;
  url: string;
  signal: AbortSignal;
  axios: ProviderContext["axios"];
  cheerio: ProviderContext["cheerio"];
}): Promise<Post[]> {
  try {
    const res = await axios.get(url, { signal });
    const data = res.data;
    const $ = cheerio.load(data);
    const catalog: Post[] = [];
    const seen = new Set<string>(); // Deduplication by link
    const seenTitles = new Set<string>(); // Additional deduplication by title
    
    // Try regular filter page selector first
    $(".index_item.index_item_ie").each((i, element) => {
      const title = $(element).find("a").attr("title");
      const link = $(element).find("a").attr("href");
      let image = $(element).find("img").attr("src") || "";
      
      // Convert relative image URLs to absolute URLs
      if (image && image.startsWith("/")) {
        image = baseUrl + image;
      }
      
      if (!title || !link) return;
      
      const fullLink = baseUrl + link;
      
      // Deduplication by link
      if (seen.has(fullLink)) return;
      
      // Deduplication by title
      if (seenTitles.has(title.toLowerCase())) return;
      
      seen.add(fullLink);
      seenTitles.add(title.toLowerCase());
      
      catalog.push({
        title: title,
        link: fullLink,
        image: image,
      });
    });

    // If no results, try playlist table row selector
    if (catalog.length === 0) {
      $("table tbody tr").each((i, element) => {
        // Skip info header rows (first row in playlists)
        if ($(element).find(".playlist_item_info").length > 0) return;
        
        // Find link in first td (may be inside a or standalone)
        const firstTd = $(element).find("td").first();
        const titleLink = firstTd.find("a").first();
        
        if (titleLink.length === 0) return;
        
        const title = titleLink.text().trim();
        const link = titleLink.attr("href");
        
        // Image is inside the playlist_thumb div, specifically in the img tag
        let image = firstTd.find(".playlist_thumb img").attr("src") || "";
        
        // Convert relative image URLs to absolute URLs
        if (image && image.startsWith("/")) {
          image = baseUrl + image;
        }
        
        if (!title || !link) return;
        
        const fullLink = baseUrl + link;
        
        // Deduplication by link
        if (seen.has(fullLink)) return;
        
        // Deduplication by title
        if (seenTitles.has(title.toLowerCase())) return;
        
        seen.add(fullLink);
        seenTitles.add(title.toLowerCase());
        
        catalog.push({
          title: title,
          link: fullLink,
          image: image,
        });
      });
    }

    // Limit results to 30 posts for faster homepage loading
    return catalog.slice(0, 30);
  } catch (err) {
    console.error("primewire error ", err);
    return [];
  }
}
