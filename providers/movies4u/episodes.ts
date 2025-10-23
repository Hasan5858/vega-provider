import { EpisodeLink, ProviderContext } from '../types';
import * as cheerio from 'cheerio';

const WORKER_URL = 'https://movies4u.steep-bread-3c84.workers.dev';

export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { axios } = providerContext;

  try {
    console.log('[Movies4U Episodes] Fetching episodes for:', url);

    // Fetch directly instead of using Worker (Worker is blocked by the site)
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const episodes: EpisodeLink[] = [];
    const seenLinks = new Set();

    // Look for episode links - typically they have "Episode" or "S01E01" pattern
    $('a[href*="episode"], a[href*="ep-"], a[href*="s01e"]').each((_, elem) => {
      const $link = $(elem);
      const href = $link.attr('href');
      const text = $link.text().trim();

      if (href && !seenLinks.has(href) && text && !href.includes('javascript')) {
        episodes.push({
          title: text || 'Episode',
          link: href.startsWith('http') ? href : url.split('/').slice(0, 3).join('/') + href
        });
        seenLinks.add(href);
      }
    });

    // Fallback: Look for h2/h3 with episode info followed by download links
    if (episodes.length === 0) {
      $('h2, h3').each((_, elem) => {
        const $heading = $(elem);
        const headingText = $heading.text().trim();
        
        if (/episode|ep|season|s\d+e\d+/i.test(headingText)) {
          // Look for the next link after this heading
          const $nextLink = $heading.nextAll('a[href]').first();
          if ($nextLink.length > 0) {
            const href = $nextLink.attr('href');
            const linkText = $nextLink.text().trim();
            
            if (href && !seenLinks.has(href)) {
              episodes.push({
                title: linkText || headingText,
                link: href.startsWith('http') ? href : url.split('/').slice(0, 3).join('/') + href
              });
              seenLinks.add(href);
            }
          }
        }
      });
    }

    console.log('[Movies4U Episodes] Received', episodes.length, 'episodes');

    return episodes;
  } catch (error) {
    console.error('[Movies4U Episodes] Error:', error);
    return [];
  }
};
