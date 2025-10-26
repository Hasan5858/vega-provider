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
    return catalog;
  } catch (err) {
    console.error("primewire error ", err);
    return [];
  }
}
