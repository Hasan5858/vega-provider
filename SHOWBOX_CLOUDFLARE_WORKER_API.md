# Showbox Cloudflare Worker API Specification

## Overview

The Cloudflare Worker will act as a proxy that:
1. Bypasses Cloudflare protection on showbox.media
2. Scrapes the HTML using proper cookies and headers
3. Returns clean JSON data that matches the provider's expected format

The worker should handle all Cloudflare challenges automatically (using Puppeteer or similar headless browser if needed).

---

## Base URL

```
https://your-worker.workers.dev/showbox
```

Or use environment variable for flexibility:
```
WORKER_URL=https://your-worker.workers.dev
```

---

## API Endpoints

### 1. GET `/showbox/posts` - Fetch Catalog Items

**Purpose:** Get list of movies/TV shows for a given filter and page (catalog listing)

**Request:**
```http
GET /showbox/posts?filter={filter}&page={page}
```

**Query Parameters:**
- `filter` (string, required): Catalog filter
  - `""` (empty) = Home page
  - `"/movie"` = Movies page
  - `"/tv"` = TV Shows page
- `page` (number, required): Page number (1, 2, 3, ...)

**Example Request:**
```http
GET /showbox/posts?filter=/movie&page=1
GET /showbox/posts?filter=/tv&page=2
GET /showbox/posts?filter=&page=1  // Home page
```

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Movie Title 1",
      "link": "/movie/movie-slug-1",
      "image": "https://www.showbox.media/poster/movie1.jpg"
    },
    {
      "title": "Movie Title 2",
      "link": "/movie/movie-slug-2",
      "image": "https://www.showbox.media/poster/movie2.jpg"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch catalog",
  "data": []
}
```

**Expected Selectors (on showbox.media):**
- Container: `.movie-item,.flw-item`
- Title: `.film-name`
- Link: `a[href]` (relative path)
- Image: `img[src]`

---

### 2. GET `/showbox/posts/search` - Search Results

**Purpose:** Get search results for a query

**Request:**
```http
GET /showbox/posts/search?query={searchQuery}&page={page}
```

**Query Parameters:**
- `query` (string, required): Search query (URL encoded)
- `page` (number, required): Page number (1, 2, 3, ...)

**Example Request:**
```http
GET /showbox/posts/search?query=avengers&page=1
```

**Response Format:** (Same as `/posts`)
```json
{
  "success": true,
  "data": [
    {
      "title": "Avengers: Endgame",
      "link": "/movie/avengers-endgame",
      "image": "https://www.showbox.media/poster/avengers.jpg"
    }
  ]
}
```

---

### 3. GET `/showbox/meta` - Get Movie/Show Metadata

**Purpose:** Get detailed metadata for a movie/show including title, image, synopsis, rating, and file list (via febbox)

**Request:**
```http
GET /showbox/meta?link={link}
```

**Query Parameters:**
- `link` (string, required): Relative path to the movie/show (e.g., `/movie/movie-slug` or `/tv/show-slug`)

**Example Request:**
```http
GET /showbox/meta?link=/movie/inception
GET /showbox/meta?link=/tv/game-of-thrones
```

**Worker Processing Steps:**
1. Fetch the detail page: `https://www.showbox.media{link}`
2. Parse HTML to extract:
   - Title: `.heading-name`
   - Rating: `.btn-imdb` (extract numeric rating)
   - Image: `.cover_follow` style attribute (extract URL from `url(...)`)
   - Synopsis: `.description` text
   - Type: Detect from URL (`/tv/` = "series", `/movie/` = "movie")
   - Febbox ID: `.heading-name > a[href]` → extract ID from href
3. Call Showbox API: `GET /index/share_link?id={febID}&type={1|2}`
   - `type=1` for movie, `type=2` for series
4. Extract febbox share key from response: `data.link` → get last segment
5. Call febbox API: `GET https://www.febbox.com/file/file_share_list?share_key={febKey}&is_html=0`
6. Parse file list from febbox response
7. Return combined data

**Response Format:**
```json
{
  "success": true,
  "data": {
    "title": "Inception",
    "image": "https://www.showbox.media/poster/inception.jpg",
    "synopsis": "A skilled thief enters people's dreams to steal secrets from their subconscious.",
    "rating": "8.8",
    "imdbId": "",
    "type": "movie",
    "linkList": [
      {
        "title": "inception_1080p.mkv (4.2 GB)",
        "episodesLink": null,
        "directLinks": null
      },
      {
        "title": "inception_720p.mkv (2.1 GB)",
        "episodesLink": null,
        "directLinks": null
      },
      {
        "title": "Season 1",
        "episodesLink": "{febKey}&{folderId}",
        "directLinks": null
      }
    ]
  }
}
```

**For Series (with seasons/folders):**
```json
{
  "success": true,
  "data": {
    "title": "Game of Thrones",
    "image": "https://www.showbox.media/poster/got.jpg",
    "synopsis": "Nine noble families fight for control of Westeros.",
    "rating": "9.3",
    "imdbId": "",
    "type": "series",
    "linkList": [
      {
        "title": "Season 1 (folder)",
        "episodesLink": "abc123def456&folder789",
        "directLinks": null
      },
      {
        "title": "Season 2 (folder)",
        "episodesLink": "abc123def456&folder790",
        "directLinks": null
      }
    ]
  }
}
```

**LinkList Structure:**
- **For movies**: Each file is a direct link (no episodesLink)
- **For series**: Folders use `episodesLink` format: `{febKey}&{folderId}`
- Empty string `episodesLink: ""` or `episodesLink: "{febKey}&"` means it's a file (not a folder)

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch metadata",
  "data": {
    "title": "",
    "image": "",
    "synopsis": "",
    "rating": "",
    "imdbId": "",
    "type": "movie",
    "linkList": []
  }
}
```

---

### 4. GET `/showbox/episodes` - Get Episode List

**Purpose:** Get list of episodes for a series season (folder)

**Request:**
```http
GET /showbox/episodes?shareKey={shareKey}&parentId={parentId}
```

**Query Parameters:**
- `shareKey` (string, required): Febbox share key (first part before `&`)
- `parentId` (string, optional): Folder ID (second part after `&`). If not provided, fetch root folder.

**Example Request:**
```http
GET /showbox/episodes?shareKey=abc123def456&parentId=folder789
GET /showbox/episodes?shareKey=abc123def456  // Root folder
```

**Worker Processing Steps:**
1. Call febbox API:
   - With parentId: `GET https://www.febbox.com/file/file_share_list?share_key={shareKey}&pwd=&parent_id={parentId}&is_html=0`
   - Without parentId: `GET https://www.febbox.com/file/file_share_list?share_key={shareKey}&pwd=&is_html=0`
2. Parse response: `data.file_list`
3. Filter files where `is_dir === false` (only episodes, not subfolders)
4. Format episode names: Convert "S01E01" to "Season01 Episode01"
5. Return episode list

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "title": "Season01 Episode01",
      "link": "abc123def456&episode123"
    },
    {
      "title": "Season01 Episode02",
      "link": "abc123def456&episode124"
    },
    {
      "title": "Season02 Episode01",
      "link": "abc123def456&episode125"
    }
  ]
}
```

**Episode Name Formatting Rules:**
- Input: `"S01E01 - Pilot.mp4"` or `"s1e2 - episode title.mkv"`
- Regex: `/[sS](\d+)\s*[eE](\d+)/`
- Output: `"Season01 Episode01"`
- If no match: Return original filename (e.g., `"pilot.mp4"`)

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch episodes",
  "data": []
}
```

---

### 5. GET `/showbox/stream` - Get Stream URLs

**Purpose:** Get available stream quality options for an episode/file

**Request:**
```http
GET /showbox/stream?epId={epId}
```

**Query Parameters:**
- `epId` (string, required): Episode/file ID (second part after `&` from episodes link)

**Example Request:**
```http
GET /showbox/stream?epId=episode123
```

**Worker Processing Steps:**
1. Call febbox Vercel API: `GET https://febbox.vercel.app/api/video-quality?fid={epId}`
2. Parse HTML response: `data.html`
3. Extract from each `.file_quality` element:
   - Server name: `p.name` text
   - File size: `p.size` text
   - Speed: `p.speed` text
   - Stream URL: `data-url` attribute
4. Combine: `server = "{name} - {size} - {speed}"`

**Response Format:**
```json
{
  "success": true,
  "data": [
    {
      "server": "Server 1 - 1.2 GB - High",
      "link": "https://febbox.com/stream/...",
      "type": "mkv"
    },
    {
      "server": "Server 2 - 800 MB - Medium",
      "link": "https://febbox.com/stream/...",
      "type": "mkv"
    }
  ]
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Failed to fetch stream",
  "data": []
}
```

---

## Error Handling

All endpoints should follow this error response structure:

```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "data": [] // or {} depending on endpoint
}
```

**Common Error Scenarios:**
1. **Cloudflare Challenge**: Worker should automatically handle and retry
2. **Invalid Link**: Return empty data with success=false
3. **Network Timeout**: Return timeout error
4. **HTML Structure Changed**: Log error, return empty data

---

## Implementation Notes

### Cloudflare Bypass Strategy

The worker should:
1. Use real browser user agent and headers (from `cfConfig.ts`)
2. Maintain session cookies (store `cf_clearance` cookie)
3. Use headless browser (Puppeteer/Puppeteer-core) if JavaScript challenge is detected
4. Cache cookies for multiple requests (avoid solving challenge repeatedly)

### Cookie Management

- Worker should maintain a cookie jar/storage
- Update `cf_clearance` cookie when it expires
- Use same cookies for all requests in a session

### Rate Limiting

- Worker should implement reasonable rate limiting
- Consider caching responses (e.g., catalog pages for 5-10 minutes)
- Return appropriate HTTP status codes (429 Too Many Requests if needed)

### Response Headers

Worker should set:
```http
Content-Type: application/json
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
```

---

## Provider Code Changes

After implementing the worker, update provider files:

### `posts.ts`
- Change `axios.get(url)` to `axios.get(workerUrl + '/showbox/posts?filter=...&page=...')`
- Remove HTML parsing logic
- Parse JSON response instead

### `meta.ts`
- Change to `axios.get(workerUrl + '/showbox/meta?link=...')`
- Remove all HTML scraping and febbox API calls
- Parse JSON response

### `episodes.ts`
- Change to `axios.get(workerUrl + '/showbox/episodes?shareKey=...&parentId=...')`
- Remove febbox API call
- Parse JSON response
- Keep episode name formatting (or let worker handle it)

### `stream.ts`
- Change to `axios.get(workerUrl + '/showbox/stream?epId=...')`
- Remove HTML parsing
- Parse JSON response

### `catalog.ts`
- No changes needed (static data)

---

## Testing Checklist

- [ ] `/showbox/posts?filter=/movie&page=1` returns valid catalog items
- [ ] `/showbox/posts?filter=/tv&page=1` returns valid TV shows
- [ ] `/showbox/posts/search?query=test&page=1` returns search results
- [ ] `/showbox/meta?link=/movie/...` returns full metadata with file list
- [ ] `/showbox/meta?link=/tv/...` returns series metadata with season folders
- [ ] `/showbox/episodes?shareKey=...&parentId=...` returns episode list
- [ ] `/showbox/stream?epId=...` returns stream URLs with quality options
- [ ] All endpoints handle Cloudflare challenges automatically
- [ ] Error responses are properly formatted
- [ ] CORS headers are set correctly

---

## Example Worker URL Configuration

In `data/modflix.json` or provider config:
```json
{
  "showbox": {
    "url": "https://www.showbox.media",
    "workerUrl": "https://your-worker.workers.dev/showbox"
  }
}
```

Or use environment variable:
```javascript
const WORKER_URL = env.WORKER_URL || 'https://your-worker.workers.dev';
```

