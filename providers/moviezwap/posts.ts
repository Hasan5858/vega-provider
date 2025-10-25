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
  const { getBaseUrl, cheerio } = providerContext;
  const baseUrl = await getBaseUrl("moviezwap");
  const url = `${baseUrl}${filter}`;
  return posts({ url, signal, cheerio });
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
  const { getBaseUrl, cheerio } = providerContext;
  const baseUrl = await getBaseUrl("moviezwap");
  const url = `${baseUrl}/search.php?q=${encodeURIComponent(searchQuery)}`;
  return posts({ url, signal, cheerio });
};

async function posts({
  url,
  signal,
  cheerio,
}: {
  url: string;
  signal: AbortSignal;
  cheerio: ProviderContext["cheerio"];
}): Promise<Post[]> {
  try {
    console.log("moviezwap posts function called with URL:", url);
    const res = await fetch(url, { signal });
    const data = await res.text();
    console.log("moviezwap fetched data length:", data.length);
    const $ = cheerio.load(data);
    const catalog: Post[] = [];
    
    // Extract base URL from the URL parameter using string manipulation
    const urlMatch = url.match(/^(https?:\/\/[^\/]+)/);
    const baseUrl = urlMatch ? urlMatch[1] : "https://www.moviezwap.haus";
    
    // Look for movie links in the category page structure
    const movieLinks = $('a[href*="/movie/"]');
    console.log("moviezwap found movie links:", movieLinks.length);
    
    movieLinks.each((i, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr("href");
      
      // Generate thumbnail URL based on movie link pattern
      let image = "";
      if (link && link.includes('/movie/')) {
        // Extract movie name from link (e.g., /movie/Tunnel-(2025)-Telugu-Original.html)
        const movieName = link.replace(/.*\/movie\//, '').replace('.html', '');
        // Convert to lowercase and replace special characters for poster naming convention
        let posterName = movieName.toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
      // MoviezWap uses different naming patterns for posters
      // Remove "-original" and "-dubbed" suffixes as they're not in poster URLs
      posterName = posterName.replace('-original', '').replace('-dubbed', '');
      
      // Add "-movie" suffix if not already present
      if (!posterName.includes('-movie')) {
        posterName += '-movie';
      }
        
        // Generate poster URL based on MoviezWap's naming pattern
        image = `${baseUrl}/poster/${posterName}.jpg`;
      }
      
      if (title && link && link.includes('/movie/')) {
        catalog.push({
          title: title,
          link: link,
          image: image,
        });
      }
    });
    
    console.log("moviezwap returning posts:", catalog.length);
    return catalog;
  } catch (err) {
    console.error("moviezwapGetPosts error ", err);
    return [];
  }
}
