import { Post, ProviderContext } from '../types';
import * as cheerio from 'cheerio';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';
const BASE_URL = 'https://movies4u.ps';

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
  return fetchPosts({ filter, page, query: '', signal, providerContext });
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
  return fetchPosts({
    filter: '',
    page,
    query: searchQuery,
    signal,
    providerContext,
  });
}

// --- Core function ---
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
  const { axios } = providerContext;

  try {
    let targetUrl = BASE_URL;

    // Determine if it's a search or category
    if (query && query.trim()) {
      targetUrl = `${BASE_URL}/search/${encodeURIComponent(query)}/`;
      console.log('[Movies4U Posts] Search query:', query, 'Page:', page);
    } else if (filter) {
      targetUrl = `${BASE_URL}${filter}`;
      console.log('[Movies4U Posts] Category:', filter, 'Page:', page);
    } else {
      console.log('[Movies4U Posts] Trending, Page:', page);
    }

    if (page > 1) {
      targetUrl += `${targetUrl.includes('?') ? '&' : '?'}page=${page}`;
    }

    // Fetch directly instead of using Worker (Worker is blocked by the site)
    const response = await axios.get(targetUrl, {
      signal,
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const html = response.data;
    const posts: Post[] = [];

    // Parse HTML using cheerio
    const $ = cheerio.load(html);

    $('article.entry-card').each((_, elem) => {
      const $article = $(elem);
      
      // Extract title from h2 > a
      const title = $article.find('h2.entry-title a').text().trim();
      
      // Extract link from h2 > a href
      const link = $article.find('h2.entry-title a').attr('href');
      
      // Extract image from img src or data-src
      let image = $article.find('img.wp-post-image').attr('src');
      if (!image) {
        image = $article.find('img.wp-post-image').attr('data-src');
      }

      if (title && link) {
        // Clean title by removing quality and extra info
        const cleanTitle = title
          .replace(/\[.*?\]/g, '')
          .replace(/\(.*?\)/g, '')
          .trim();

        posts.push({
          title: cleanTitle,
          image: image || '',
          link: link,
        });
      }
    });

    console.log('[Movies4U Posts] Received', posts.length, 'posts');

    return posts;
  } catch (error) {
    console.error('[Movies4U Posts] Error:', error);
    return [];
  }
}
