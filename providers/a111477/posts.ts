import { Post, ProviderContext } from "../types";
import axios from "axios";

// Helper function to fetch movie poster from OMDB API
async function getMoviePoster(title: string): Promise<string> {
  // Clean the title for better matching
  const cleanTitle = title
    .replace(/[#\$]/g, '') // Remove special characters
    .replace(/\([^)]*\)/g, '') // Remove year in parentheses
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
  
  try {
    const searchUrl = `http://www.omdbapi.com/?apikey=trilogy&t=${encodeURIComponent(cleanTitle)}`;
    const response = await axios.get(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    
    if (response.data && response.data.Response === 'True' && response.data.Poster && response.data.Poster !== 'N/A') {
      return response.data.Poster;
    }
  } catch (error) {
    console.log(`Error fetching poster for "${title}":`, error instanceof Error ? error.message : error);
  }
  
  // Fallback to placeholder if API fails
  const imageTitle = cleanTitle.length > 30 ? cleanTitle.slice(0, 30) : cleanTitle;
  return `https://via.placeholder.com/200x300/2c2c2c/ffffff.png?text=${encodeURIComponent(imageTitle)}`;
}

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
  const { axios, cheerio } = providerContext;
  const baseUrl = "https://a.111477.xyz";
  if (page > 1) {
    return [];
  }
  const url = `${baseUrl}${filter}`;
  const result = await posts({ baseUrl, url, signal, axios, cheerio });
  return result.slice(0, 50); // Limit only for getPosts
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
  const { axios, cheerio } = providerContext;
  const baseUrl = "https://a.111477.xyz";
  if (page > 1) {
    return [];
  }

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
    // Add a small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const res = await axios.get(url, { 
      signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
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

        // Get real movie poster from OMDB API
        const image = await getMoviePoster(cleanTitle);

        catalog.push({
          title: cleanTitle,
          link: fullLink,
          image: image,
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
