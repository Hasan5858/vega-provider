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
  const { getBaseUrl } = providerContext;
  const baseUrl = await getBaseUrl("filmyfly");
  // Update to use new domain
  const newBaseUrl = baseUrl.replace('filmyfly.deals', 'filmyfly.observer');
  const url = `${newBaseUrl + filter}/${page}`;
  return posts({ url, signal, baseUrl: newBaseUrl, providerContext });
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
  providerContext: ProviderContext;
  signal: AbortSignal;
}): Promise<Post[]> {
  const { getBaseUrl } = providerContext;
  const baseUrl = await getBaseUrl("filmyfly");
  // Update to use new domain
  const newBaseUrl = baseUrl.replace('filmyfly.deals', 'filmyfly.observer');
  const url = `${newBaseUrl}/site-1.html?to-search=${searchQuery}`;
  if (page > 1) {
    return [];
  }
  return posts({ url, signal, baseUrl: newBaseUrl, providerContext });
};

async function posts({
  url,
  signal,
  baseUrl,
  providerContext,
}: {
  url: string;
  signal: AbortSignal;
  baseUrl: string;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  try {
    const { cheerio, commonHeaders: headers } = providerContext;
    const res = await fetch(url, { headers, signal });
    const data = await res.text();
    const $ = cheerio.load(data);
    const catalog: Post[] = [];
    
    // Updated selectors for new page structure
    $(".A10").each((i, element) => {
      const $el = $(element);
      const linkEl = $el.find("a").first();
      const titleEl = $el.find("div[style*='font-weight:bold']").first();
      
      const title = titleEl.text().trim();
      const link = linkEl.attr("href");
      const image = $el.find("img").attr("src");
      
      if (title && link && image) {
        catalog.push({
          title: title,
          link: baseUrl + link,
          image: image,
        });
      }
    });
    
    return catalog;
  } catch (err) {
    console.error("ff error ", err);
    return [];
  }
}
