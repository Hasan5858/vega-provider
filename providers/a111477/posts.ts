import { Post, ProviderContext } from "../types";
import axios from "axios";

// Helper function to fetch movie poster from OMDB API
// DISABLED: This was causing massive performance issues (100+ minutes load time)
// async function getMoviePoster(title: string): Promise<string> {
//   // Clean the title for better matching
//   const cleanTitle = title
//     .replace(/[#\$]/g, '') // Remove special characters
//     .replace(/\([^)]*\)/g, '') // Remove year in parentheses
//     .replace(/\s+/g, ' ') // Normalize spaces
//     .trim();
//   
//   try {
//     const searchUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${encodeURIComponent(cleanTitle)}`;
//     const response = await axios.get(searchUrl, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
//       }
//     });
//     
//     if (response.data && response.data.Response === 'True' && response.data.Poster && response.data.Poster !== 'N/A') {
//       return response.data.Poster;
//     }
//   } catch (error) {
//     console.log(`Error fetching poster for "${title}":`, error instanceof Error ? error.message : error);
//   }
//   
//   // Fallback to placeholder if API fails
//   const imageTitle = cleanTitle.length > 30 ? cleanTitle.slice(0, 30) : cleanTitle;
//   return `https://via.placeholder.com/200x300/2c2c2c/ffffff.png?text=${encodeURIComponent(imageTitle)}`;
// }

export const getPosts = async function ({
  filter,
  page,
  signal,
  providerContext,
}: {
  filter: string;
  page: number;
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { axios, cheerio, getBaseUrl } = providerContext;
  const baseUrl = await getBaseUrl("a111477");
  if (page > 1) {
    return [];
  }
  try {
    const url = `${baseUrl}${filter}`;
    const result = await posts({ baseUrl, url, signal, axios, cheerio });
    return result.slice(0, 50); // Limit only for getPosts
  } catch (error) {
    console.error("Error in getPosts:", error);
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
  signal: AbortSignal;
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { axios, cheerio, getBaseUrl } = providerContext;
  const baseUrl = await getBaseUrl("a111477");
  if (page > 1) {
    return [];
  }

  try {
    // Search through both movies and TV shows directories
    const moviesPosts = await posts({
      baseUrl,
      url: `${baseUrl}/movies/`,
      signal,
      axios,
      cheerio,
    });
    const tvsPosts = await posts({
      baseUrl,
      url: `${baseUrl}/tvs/`,
      signal,
      axios,
      cheerio,
    });

    // Combine all posts
    const allPosts = [...moviesPosts, ...tvsPosts];

  // Filter posts based on search query with improved matching
  const filteredPosts = allPosts.filter((post) => {
    const title = post.title.toLowerCase();
    const query = searchQuery.toLowerCase();

    // Direct substring match
    if (title.includes(query)) {
      return true;
    }

    // Word boundary matching
    const queryWords = query.split(/\s+/).filter((word) => word.length > 0);
    const titleWords = title
      .split(/[\s\-\.\(\)\[\]]+/)
      .filter((word) => word.length > 0);

    // Check if all query words are found in title words
    const allWordsMatch = queryWords.every((queryWord) =>
      titleWords.some((titleWord) => titleWord.includes(queryWord))
    );

    if (allWordsMatch) {
      return true;
    }

    // Fuzzy matching for single word queries
    if (queryWords.length === 1) {
      const queryWord = queryWords[0];
      if (queryWord.length >= 3) {
        // Check if any title word starts with the query
        const startsWithMatch = titleWords.some((titleWord) =>
          titleWord.startsWith(queryWord)
        );

        if (startsWithMatch) {
          return true;
        }

        // Levenshtein distance for close matches
        const hasCloseMatch = titleWords.some((titleWord) => {
          if (Math.abs(titleWord.length - queryWord.length) > 2) return false;
          const distance = levenshteinDistance(titleWord, queryWord);
          return distance <= Math.max(1, Math.floor(queryWord.length * 0.2));
        });

        if (hasCloseMatch) {
          return true;
        }
      }
    }

    return false;
  });

  return filteredPosts;
  } catch (error) {
    console.error("Error in getSearchPosts:", error);
    return [];
  }
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
    // Add a longer delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retry logic for rate limiting
    let res;
    let retryCount = 0;
    const maxRetries = 3;
    
    while (retryCount < maxRetries) {
      try {
        res = await axios.get(url, { 
          signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        break; // Success, exit retry loop
      } catch (error: any) {
        if (error?.response?.status === 429 && retryCount < maxRetries - 1) {
          console.log(`Rate limited, retrying in ${(retryCount + 1) * 1000}ms...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 1000));
          retryCount++;
        } else {
          throw error; // Re-throw if not rate limit or max retries reached
        }
      }
    }
    
    if (!res || !res.data) {
      console.log('No data received from', url);
      return [];
    }
    
    const data = res.data;
    const $ = cheerio.load(data);
    const catalog: Post[] = [];

    // Parse the directory listing
    const rows = $("table tbody tr");
    for (let i = 0; i < rows.length; i++) {
      const $row = $(rows[i]);
      const linkElement = $row.find("td:first-child a");
      const title = linkElement.text().trim();
      const link = linkElement.attr("href");

      // Skip parent directory and files, only get folders
      if (
        title &&
        link &&
        title !== "../" &&
        title !== "Parent Directory" &&
        title.endsWith("/")
      ) {
        const cleanTitle = title.replace(/\/$/, ""); // Remove trailing slash
        const fullLink = url.endsWith('/') ? url + link : url + '/' + link;

        // ✅ Return immediately with placeholder image, add OMDB URL for lazy-loading
        const placeholderImage = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(cleanTitle.substring(0, 30))}`;
        const omdbUrl = `https://www.omdbapi.com/?apikey=trilogy&t=${encodeURIComponent(cleanTitle)}&type=movie`;
        
        const image = placeholderImage;

        catalog.push({
          title: cleanTitle,
          link: fullLink,
          image: image,
          poster_url: omdbUrl, // For lazy-loading real posters
        });
      }
    }

    // Only limit for regular getPosts, not for search
    return catalog;
  } catch (err) {
    console.error("111477 directory listing error:", err);
    return [];
  }
}

// Levenshtein distance function for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1)
    .fill(null)
    .map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}
