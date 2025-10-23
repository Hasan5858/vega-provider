import { Info, ProviderContext } from '../types';
import * as cheerio from 'cheerio';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

export const getMeta = async ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> => {
  const { axios } = providerContext;

  try {
    console.log('[Movies4U Meta] Fetching metadata for:', link);

    // Fetch directly instead of using Worker (Worker is blocked by the site)
    const response = await axios.get(link, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Extract title from h1 or h2
    let title = $('h1').first().text().trim();
    if (!title) {
      title = $('h2.entry-title a').text().trim();
    }

    // Extract image - look for wp-post-image class
    let image = $('img.wp-post-image').attr('src');
    if (!image) {
      image = $('img.wp-post-image').attr('data-src');
    }

    // Extract synopsis from entry-content
    let synopsis = $('.entry-content p').first().text().trim().substring(0, 500);

    // Try to extract IMDb ID
    let imdbId = '';
    const imdbMatch = html.match(/tt\d+/);
    if (imdbMatch) {
      imdbId = imdbMatch[0];
    }

    // Detect if movie or series based on content
    let type = 'movie';
    const contentLower = html.toLowerCase();
    if (contentLower.includes('season') || contentLower.includes('episode') || contentLower.includes('series') || contentLower.includes('web-series')) {
      type = 'series';
    }

    console.log('[Movies4U Meta] Received metadata:', {
      title: title,
      type: type,
    });

    return {
      title: title || '',
      synopsis: synopsis || '',
      image: image || '',
      imdbId: imdbId || '',
      type: type || 'movie',
      linkList: [],
    };
  } catch (error) {
    console.error('[Movies4U Meta] Error:', error);
    return {
      title: '',
      synopsis: '',
      image: '',
      imdbId: '',
      type: 'movie',
      linkList: [],
    };
  }
};
