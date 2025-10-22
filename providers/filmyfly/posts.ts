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
  
  let url;
  if (filter === '') {
    // Homepage
    url = page === 1 ? newBaseUrl : `${newBaseUrl}?to-page=${page}`;
  } else {
    // Category pages - use the correct pagination format
    const categoryId = filter.match(/\/page-cat\/(\d+)\//)?.[1];
    const categoryName = filter.match(/\/page-cat\/\d+\/([^\/]+)\.html/)?.[1];
    if (categoryId && categoryName) {
      // Always use the paginated format for categories
      url = `${newBaseUrl}/page-3/${categoryId}/${categoryName}/${page}`;
    } else {
      url = `${newBaseUrl}${filter}`;
    }
  }
  
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
    console.log('Fetching URL:', url);
    const { cheerio, commonHeaders: headers } = providerContext;
    const res = await fetch(url, { headers, signal });
    const data = await res.text();
    const $ = cheerio.load(data);
    const catalog: Post[] = [];
    
    console.log('Page loaded, checking for content...');
    
    // Handle homepage structure (.A10 divs)
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
    
    // Handle category pages structure (.fl divs)
    $(".fl").each((i, element) => {
      const $el = $(element);
      const linkEl = $el.find("a").first();
      
      // Try different selectors for title
      let title = linkEl.find("b").text().trim();
      if (!title) {
        title = linkEl.text().trim();
      }
      if (!title) {
        title = $el.find("b").text().trim();
      }
      
      const link = linkEl.attr("href");
      const image = $el.find("img").attr("src");
      
      // Only add if we have all three components and title is not empty
      if (title && link && image && title.length > 0) {
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
