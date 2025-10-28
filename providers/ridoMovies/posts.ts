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
  try {
    const { axios, getBaseUrl, commonHeaders: headers } = providerContext;
    const baseUrl = await getBaseUrl("ridomovies");
    const catalog: Post[] = [];
    
    // Use search API with popular terms since movies API requires auth
    const searchTerms = [
      "avengers", "batman", "superman", "spider", "iron man", "thor", 
      "captain america", "wonder woman", "black widow", "hulk",
      "fast", "furious", "mission impossible", "james bond", "john wick",
      "transformers", "terminator", "predator", "alien", "matrix"
    ];
    
    // Get random search terms for variety
    const randomTerms = searchTerms.slice(0, 3);
    
    for (const term of randomTerms) {
      try {
        const searchUrl = `${baseUrl}/core/api/search?q=${encodeURIComponent(term)}`;
        console.log("ridomovies search URL:", searchUrl);
        
        const res = await axios.get(searchUrl, {
          headers,
          signal,
        });
        
        const data = res.data;
        console.log("ridomovies search response:", data);
        
        if (data?.data?.items) {
          data.data.items.forEach((item: any) => {
            if (item?.contentable && item.contentable.type === 'movie') {
              const movie = item.contentable;
              catalog.push({
                title: movie.originalTitle || item.title,
                link: `${baseUrl}/${item.fullSlug}`,
                image: movie.apiPosterPath || `${baseUrl}${movie.posterPath}`,
              });
            }
          });
        }
      } catch (searchError) {
        console.log(`ridomovies search error for ${term}:`, (searchError as Error).message);
      }
    }
    
    // Remove duplicates based on link
    const uniqueCatalog = catalog.filter((item, index, self) => 
      index === self.findIndex(t => t.link === item.link)
    );
    
    console.log("ridomovies catalog length:", uniqueCatalog.length);
    return uniqueCatalog.slice(0, 30); // Limit to 30 items
  } catch (err) {
    console.error("ridomovies posts error:", err);
    return [];
  }
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
  try {
    const { axios, getBaseUrl, commonHeaders: headers } = providerContext;
    const baseUrl = await getBaseUrl("ridomovies");
    
    if (page > 1) {
      return [];
    }
    
    const catalog: Post[] = [];
    const searchUrl = `${baseUrl}/core/api/search?q=${encodeURIComponent(searchQuery)}`;
    
    console.log("ridomovies search URL:", searchUrl);
    
    const res = await axios.get(searchUrl, {
      headers,
      signal,
    });
    
    const data = res.data;
    console.log("ridomovies search response:", data);
    
    if (data?.data?.items) {
      data.data.items.forEach((item: any) => {
        if (item?.contentable) {
          const movie = item.contentable;
          catalog.push({
            title: movie.originalTitle || item.title,
            link: `${baseUrl}/${item.fullSlug}`,
            image: movie.apiPosterPath || `${baseUrl}${movie.posterPath}`,
          });
        }
      });
    }
    
    console.log("ridomovies search results:", catalog.length);
    return catalog;
  } catch (err) {
    console.error("ridomovies search error:", err);
    return [];
  }
};
