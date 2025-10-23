import { Post, ProviderContext } from '../types';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

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
    const params: any = { action: 'posts', page };

    // Determine if it's a search or category
    if (query && query.trim()) {
      params.search = query;
      console.log('[Movies4U Posts] Search query:', query, 'Page:', page);
    } else if (filter) {
      params.category = filter;
      console.log('[Movies4U Posts] Category:', filter, 'Page:', page);
    } else {
      console.log('[Movies4U Posts] Trending, Page:', page);
    }

    const { data } = await axios.get(WORKER_URL, {
      params,
      signal,
      timeout: 30000,
    });

    if (!data.success || !Array.isArray(data.posts)) {
      console.error('[Movies4U Posts] Invalid worker response:', data);
      return [];
    }

    console.log('[Movies4U Posts] Received', data.posts.length, 'posts');

    return data.posts;
  } catch (error) {
    console.error('[Movies4U Posts] Error:', error);
    return [];
  }
}
