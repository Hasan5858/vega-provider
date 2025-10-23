/**
 * Movies4U Cloudflare Worker
 * 
 * This worker handles all scraping from movies4u.ps:
 * - getPosts: Get list of movies by category/search
 * - getCatalog: Get category list
 * - getMeta: Get movie metadata (title, image, synopsis, etc)
 * - getStream: Get streaming links
 * - getEpisodes: Get episodes (if series)
 * 
 * Endpoints:
 * - /posts?category=/category/bollywood&page=1
 * - /catalog
 * - /meta?link=https://movies4u.ps/movie-name
 * - /stream?link=https://movies4u.ps/movie-name
 * - /episodes?link=https://movies4u.ps/season-page
 */

const BASE_URL = 'https://movies4u.ps';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
  'Accept-Language': 'en-US,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
  'Sec-Fetch-Dest': 'document',
  'Sec-Fetch-Mode': 'navigate',
  'Sec-Fetch-Site': 'same-origin',
};

// Parse posts from HTML
function parsePosts(html) {
  const posts = [];
  const articleRegex = /<article[^>]*class="[^"]*entry-card[^"]*"[^>]*>[\s\S]*?<\/article>/g;
  let articleMatch;

  while ((articleMatch = articleRegex.exec(html)) !== null) {
    const article = articleMatch[0];

    // Extract title - it's inside <h2 class="entry-title"><a>Title</a></h2>
    let title = '';
    const titleMatch = article.match(/<h2[^>]*class="[^"]*entry-title[^"]*"[^>]*>.*?<a[^>]*>([^<]+)<\/a>.*?<\/h2>/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      // Fallback: try to get any h2 content
      const h2Match = article.match(/<h2[^>]*>.*?<a[^>]*>([^<]+)<\/a>.*?<\/h2>/);
      if (h2Match) title = h2Match[1].trim();
    }

    // Extract image
    let image = '';
    const imgMatch = article.match(/<img[^>]*(?:src|data-src)="([^"]+)"/);
    if (imgMatch) {
      image = imgMatch[1];
    }

    // Extract link - from the <a> tag in h2
    let link = '';
    const linkMatch = article.match(/<h2[^>]*class="[^"]*entry-title[^"]*"[^>]*>.*?<a[^>]*href="([^"]+)"/);
    if (linkMatch) {
      link = linkMatch[1];
      if (!link.startsWith('http')) {
        link = BASE_URL + (link.startsWith('/') ? '' : '/') + link;
      }
    }

    if (title && link) {
      posts.push({
        title: title.replace(/\[.*?\]/g, '').replace(/\(.+?\)/g, '').trim(),
        image: image || '',
        link: link
      });
    }
  }

  return posts;
}

// Get metadata for a single item
async function getMeta(link) {
  try {
    const res = await fetch(link, { headers: HEADERS });
    const html = await res.text();

    // Extract title from h1 or h2
    let title = '';
    let titleMatch = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    } else {
      titleMatch = html.match(/<h2[^>]*class="entry-title"[^>]*>.*?<a[^>]*>([^<]+)<\/a>/);
      if (titleMatch) title = titleMatch[1].trim();
    }

    // Extract image - look for post thumbnail or featured image
    let image = '';
    const posterMatch = html.match(/<img[^>]*class="[^"]*wp-post-image[^"]*"[^>]*src="([^"]+)"/);
    if (posterMatch) {
      image = posterMatch[1];
    } else {
      const imgMatch = html.match(/<img[^>]*src="([^"]*movies4u\.ps[^"]+\.(jpg|jpeg|png|webp))"[^>]*(?:alt|title)/i);
      if (imgMatch) image = imgMatch[1];
    }

    // Extract synopsis/description - look in paragraphs in entry-content
    let synopsis = '';
    const synopsisMatch = html.match(/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>[\s\S]*?<p[^>]*>([^<]+)<\/p>/);
    if (synopsisMatch) {
      synopsis = synopsisMatch[1].trim().substring(0, 500);
    }

    // Try to extract IMDb ID
    let imdbId = '';
    const imdbMatch = html.match(/tt\d+/);
    if (imdbMatch) imdbId = imdbMatch[0];

    // Detect if movie or series based on content
    let type = 'movie';
    const contentLower = html.toLowerCase();
    if (contentLower.includes('season') || contentLower.includes('episode') || contentLower.includes('series') || contentLower.includes('web-series')) {
      type = 'series';
    }

    // For movies, fetch streams and include them in linkList for immediate playback
    let linkList = [];
    if (type === 'movie') {
      try {
        const streams = await getStream(link);
        if (streams && streams.length > 0) {
          // Group streams by quality
          const streamsByQuality = {};
          streams.forEach(stream => {
            const quality = stream.quality || 'auto';
            if (!streamsByQuality[quality]) {
              streamsByQuality[quality] = [];
            }
            streamsByQuality[quality].push(stream);
          });

          // Create a single linkList entry with all direct links
          linkList = [{
            title: 'Play Movie',
            directLinks: streams.map((stream, idx) => ({
              link: stream.link,
              title: `${stream.server} - ${stream.quality || 'auto'}`,
              type: 'movie'
            }))
          }];
        }
      } catch (streamError) {
        console.error('Error fetching streams for meta:', streamError);
        // Continue with empty linkList if stream fetching fails
      }
    } else if (type === 'series') {
      // For series, try to fetch streams as well and present them similarly
      try {
        const streams = await getStream(link);
        if (streams && streams.length > 0) {
          // Create a single linkList entry with all direct links
          linkList = [{
            title: 'Watch Series',
            directLinks: streams.map((stream, idx) => ({
              link: stream.link,
              title: `${stream.server} - ${stream.quality || 'auto'}`,
              type: 'series'
            }))
          }];
        }
      } catch (streamError) {
        console.error('Error fetching streams for series meta:', streamError);
        // Continue with empty linkList if stream fetching fails
      }
    }

    return {
      title: title || 'Unknown',
      image: image || '',
      synopsis: synopsis || '',
      imdbId: imdbId || '',
      type: type,
      linkList: linkList
    };
  } catch (error) {
    console.error('Error in getMeta:', error);
    return {
      title: 'Error',
      image: '',
      synopsis: '',
      imdbId: '',
      type: 'movie',
      linkList: []
    };
  }
}

// Get streaming links
async function getStream(link) {
  try {
    const res = await fetch(link, { headers: HEADERS });
    const html = await res.text();

    const streams = [];
    const seenLinks = new Set();

    // Look for download buttons and links
    // Pattern 1: <a href="URL"><button class="dwd-button">Download Now</button></a>
    // Extract all <a> tags containing dwd-button
    const dwdButtonRegex = /<a[^>]*href="([^"]+)"[^>]*>[\s\S]*?<button[^>]*class="dwd-button"[^>]*>([^<]*)<\/button>[\s\S]*?<\/a>/g;
    let match;
    
    while ((match = dwdButtonRegex.exec(html)) !== null) {
      const streamLink = match[1];
      const text = match[2] || 'Download';
      
      // Skip anchor links and javascript
      if (streamLink && !seenLinks.has(streamLink) && !streamLink.includes('javascript') && !streamLink.startsWith('#')) {
        let server = 'Unknown';
        if (streamLink.includes('hubcloud')) server = 'HubCloud';
        else if (streamLink.includes('gdflix')) server = 'GDFlix';
        else if (streamLink.includes('filepress')) server = 'FilePress';
        else if (streamLink.includes('gofile')) server = 'GoFile';
        else if (streamLink.includes('nexdrive')) server = 'NexDrive';
        else if (streamLink.includes('hubdrive')) server = 'HubDrive';
        else if (streamLink.includes('mega')) server = 'Mega';
        else if (streamLink.includes('dropbox')) server = 'Dropbox';
        else server = 'Direct'; // Unknown server
        
        // Try to extract quality from nearby text (look backwards in HTML for size info)
        let quality = 'auto';
        if (text.includes('1080')) quality = '1080p';
        else if (text.includes('720')) quality = '720p';
        else if (text.includes('480')) quality = '480p';
        
        streams.push({
          server: server,
          link: streamLink,
          type: 'mp4',
          quality: quality
        });
        seenLinks.add(streamLink);
      }
    }

    // Pattern 2: Fallback - Any direct link to known servers with quality info
    // <a href="URL">480p x264 [500MB]</a> or similar
    const linkRegex = /<a[^>]*href="([^"]*(?:hubcloud|gdflix|filepress|gofile|nexdrive|hubdrive|mega|dropbox)[^"]*)"[^>]*>([^<]*(?:480p|720p|1080p|4k)[^<]*)<\/a>/gi;
    
    while ((match = linkRegex.exec(html)) !== null) {
      const streamLink = match[1];
      const text = match[2];
      
      if (streamLink && !seenLinks.has(streamLink)) {
        let server = 'Unknown';
        if (streamLink.includes('hubcloud')) server = 'HubCloud';
        else if (streamLink.includes('gdflix')) server = 'GDFlix';
        else if (streamLink.includes('filepress')) server = 'FilePress';
        else if (streamLink.includes('gofile')) server = 'GoFile';
        else if (streamLink.includes('nexdrive')) server = 'NexDrive';
        else if (streamLink.includes('hubdrive')) server = 'HubDrive';
        else if (streamLink.includes('mega')) server = 'Mega';
        else if (streamLink.includes('dropbox')) server = 'Dropbox';
        
        let quality = 'auto';
        if (text.includes('1080')) quality = '1080p';
        else if (text.includes('720')) quality = '720p';
        else if (text.includes('480')) quality = '480p';
        
        streams.push({
          server: server,
          link: streamLink,
          type: 'mp4',
          quality: quality
        });
        seenLinks.add(streamLink);
      }
    }

    return streams;
  } catch (error) {
    console.error('Error in getStream:', error);
    return [];
  }
}

// Get episodes for a season
async function getEpisodes(link) {
  try {
    const res = await fetch(link, { headers: HEADERS });
    const html = await res.text();

    const episodes = [];
    const seenLinks = new Set();

    // Look for episode links in the HTML
    // Pattern: Episode headers with following download links
    const episodeRegex = /<h[2-4][^>]*>.*?(?:Episode|S\d+E\d+).*?<\/h[2-4]>[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>/gi;
    let episodeMatch;

    while ((episodeMatch = episodeRegex.exec(html)) !== null) {
      const episodeLink = episodeMatch[1];
      const episodeTitle = episodeMatch[2].trim();
      
      if (episodeLink && !seenLinks.has(episodeLink) && !episodeLink.includes('javascript')) {
        episodes.push({
          title: episodeTitle || 'Episode',
          link: episodeLink.startsWith('http') ? episodeLink : BASE_URL + episodeLink
        });
        seenLinks.add(episodeLink);
      }
    }

    // Fallback: Look for any numbered links that might be episodes
    if (episodes.length === 0) {
      const fallbackRegex = /<a[^>]*href="([^"]*(?:episode|ep-|s\d+e\d+)[^"]*)"[^>]*>([^<]*(?:Episode|Ep|S\d+E\d+)[^<]*)<\/a>/gi;
      
      while ((episodeMatch = fallbackRegex.exec(html)) !== null) {
        const episodeLink = episodeMatch[1];
        const episodeTitle = episodeMatch[2].trim();
        
        if (episodeLink && !seenLinks.has(episodeLink)) {
          episodes.push({
            title: episodeTitle || 'Episode',
            link: episodeLink.startsWith('http') ? episodeLink : BASE_URL + episodeLink
          });
          seenLinks.add(episodeLink);
        }
      }
    }

    return episodes;
  } catch (error) {
    console.error('Error in getEpisodes:', error);
    return [];
  }
}

// Get catalog (categories)
async function getCatalog() {
  try {
    const res = await fetch(BASE_URL, { headers: HEADERS });
    const html = await res.text();

    const catalog = [];

    // Extract categories from navigation or menu
    // This is a basic example - adjust based on actual HTML
    const categories = [
      { title: 'Trending', filter: '' },
      { title: 'Bollywood', filter: '/category/bollywood/' },
      { title: 'Hollywood', filter: '/category/hollywood/' },
      { title: 'Web Series', filter: '/category/web-series/' },
      { title: 'Anime', filter: '/category/anime/' }
    ];

    return categories;
  } catch (error) {
    console.error('Error in getCatalog:', error);
    return [];
  }
}

// Main request handler
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const action = url.searchParams.get('action') || url.pathname.replace('/', '');
    const category = url.searchParams.get('category') || '';
    const page = url.searchParams.get('page') || '1';
    const link = url.searchParams.get('link') || '';
    const search = url.searchParams.get('search') || '';

    try {
      let result = {};

      if (action === 'posts' || action === '') {
        // Get posts by category or search
        let targetUrl = BASE_URL;

        if (search) {
          targetUrl = `${BASE_URL}/search/${encodeURIComponent(search)}/`;
        } else if (category) {
          targetUrl = `${BASE_URL}${category}`;
        }

        if (page > 1) {
          targetUrl += `${targetUrl.includes('?') ? '&' : '?'}page=${page}`;
        }

        const res = await fetch(targetUrl, { headers: HEADERS });
        const html = await res.text();
        const posts = parsePosts(html);

        result = {
          success: true,
          action: 'posts',
          count: posts.length,
          posts: posts,
          category: category,
          page: parseInt(page)
        };
      } else if (action === 'catalog') {
        // Get categories
        const catalog = await getCatalog();
        result = {
          success: true,
          action: 'catalog',
          catalog: catalog
        };
      } else if (action === 'meta') {
        // Get metadata for specific item
        if (!link) {
          return new Response(JSON.stringify({ success: false, error: 'link parameter required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const meta = await getMeta(link);
        result = {
          success: true,
          action: 'meta',
          data: meta
        };
      } else if (action === 'stream') {
        // Get streaming links
        if (!link) {
          return new Response(JSON.stringify({ success: false, error: 'link parameter required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const streams = await getStream(link);
        result = {
          success: true,
          action: 'stream',
          streams: streams,
          count: streams.length
        };
      } else if (action === 'episodes') {
        // Get episodes for season
        if (!link) {
          return new Response(JSON.stringify({ success: false, error: 'link parameter required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        const episodes = await getEpisodes(link);
        result = {
          success: true,
          action: 'episodes',
          episodes: episodes,
          count: episodes.length
        };
      } else {
        result = {
          success: false,
          error: 'Unknown action',
          available_actions: ['posts', 'catalog', 'meta', 'stream', 'episodes']
        };
      }

      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({
        success: false,
        error: error.message,
        action: action
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }
  }
};
