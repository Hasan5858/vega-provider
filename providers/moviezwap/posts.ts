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
    const res = await fetch(url, { signal });
    const data = await res.text();
    const $ = cheerio.load(data);
    const catalog: Post[] = [];
    
    // Extract base URL from the URL parameter
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`;
    
    $('a[href^="/movie/"]').each((i, el) => {
      const title = $(el).text().trim();
      const link = $(el).attr("href");
      
      // Generate thumbnail URL based on movie link pattern
      let image = "";
      if (link) {
        // Extract movie name from link (e.g., /movie/Tunnel-(2025)-Telugu-Original.html)
        const movieName = link.replace('/movie/', '').replace('.html', '');
        // Convert to lowercase and replace special characters for poster naming convention
        let posterName = movieName.toLowerCase()
          .replace(/[^a-z0-9-]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        
        // MoviezWap seems to use "dubbed" in poster names even for original movies
        // Replace "original" with "dubbed" in poster names
        posterName = posterName.replace('-original', '-dubbed');
        
        // Some movies need "-movie" suffix (like tunnel-2025-telugu-dubbed-movie.jpg)
        // Add "-movie" if the name doesn't already contain "org" or "movie"
        if (!posterName.includes('-org') && !posterName.includes('-movie')) {
          posterName += '-movie';
        }
        
        // Generate poster URL based on MoviezWap's naming pattern
        image = `${baseUrl}/poster/${posterName}.jpg`;
      }
      
      if (title && link) {
        catalog.push({
          title: title,
          link: link,
          image: image,
        });
      }
    });
    return catalog;
  } catch (err) {
    console.error("moviezwapGetPosts error ", err);
    return [];
  }
}
