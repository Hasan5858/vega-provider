# Movies4U Cloudflare Worker

This folder contains the Cloudflare Worker code that handles all HTML scraping from movies4u.ps.

## Setup Instructions

### 1. Create Cloudflare Worker

1. Go to [Cloudflare Workers Dashboard](https://dash.cloudflare.com/?to=/:account/workers)
2. Click **"Create a Service"** or **"Create Worker"**
3. Name it: `movies4u-scraper` (or any name you prefer)
4. Click **"Create service"**

### 2. Deploy Code

1. Copy the entire content from `index.js`
2. Paste it into the Cloudflare Worker editor
3. Click **"Deploy"**
4. You'll get a URL like: `https://movies4u-scraper.YOUR_ACCOUNT.workers.dev`

### 3. Update Provider

Update the `WORKER_URL` in your provider files:
- `posts.ts`
- `meta.ts`
- `stream.ts`
- `episodes.ts`
- `catalog.ts`

Replace:
```typescript
const WORKER_URL = "https://your-worker-name.workers.dev";
```

With your actual Cloudflare Worker URL.

## API Endpoints

### Get Posts (Category Browse / Search)

```
GET https://your-worker.workers.dev?action=posts&category=/category/bollywood&page=1
GET https://your-worker.workers.dev?action=posts&search=avengers&page=1
```

**Response:**
```json
{
  "success": true,
  "action": "posts",
  "count": 20,
  "posts": [
    {
      "title": "Movie Name",
      "image": "https://...",
      "link": "https://movies4u.ps/movie-name"
    }
  ],
  "category": "/category/bollywood",
  "page": 1
}
```

### Get Catalog (Categories)

```
GET https://your-worker.workers.dev?action=catalog
```

**Response:**
```json
{
  "success": true,
  "action": "catalog",
  "catalog": [
    { "title": "Trending", "filter": "" },
    { "title": "Bollywood", "filter": "/category/bollywood/" }
  ]
}
```

### Get Metadata

```
GET https://your-worker.workers.dev?action=meta&link=https://movies4u.ps/movie-name
```

**Response:**
```json
{
  "success": true,
  "action": "meta",
  "data": {
    "title": "Movie Title",
    "image": "https://...",
    "synopsis": "Plot description...",
    "imdbId": "tt1234567",
    "type": "movie",
    "linkList": []
  }
}
```

### Get Streams

```
GET https://your-worker.workers.dev?action=stream&link=https://movies4u.ps/movie-name
```

**Response:**
```json
{
  "success": true,
  "action": "stream",
  "count": 5,
  "streams": [
    {
      "server": "Movies4U",
      "link": "https://...",
      "type": "mp4",
      "quality": "720p"
    }
  ]
}
```

### Get Episodes

```
GET https://your-worker.workers.dev?action=episodes&link=https://movies4u.ps/season-1
```

**Response:**
```json
{
  "success": true,
  "action": "episodes",
  "count": 10,
  "episodes": [
    {
      "title": "Episode 1",
      "link": "https://movies4u.ps/season-1/episode-1"
    }
  ]
}
```

## Advantages

✅ **No compression issues** - Cloudflare handles decompression  
✅ **No Node.js dependencies** - Plain JavaScript, works everywhere  
✅ **CORS enabled** - Can be called from anywhere  
✅ **Modular API** - Separate endpoints for different data  
✅ **Easy debugging** - See real responses from worker logs  
✅ **Fast** - Cloudflare global network  
✅ **Free tier** - 100,000 requests/day free  

## Testing

Test worker responses directly:

```bash
# Get posts
curl "https://your-worker.workers.dev?action=posts&category=/category/bollywood&page=1"

# Get catalog
curl "https://your-worker.workers.dev?action=catalog"

# Get meta
curl "https://your-worker.workers.dev?action=meta&link=https://movies4u.ps/movie-name"

# Get streams
curl "https://your-worker.workers.dev?action=stream&link=https://movies4u.ps/movie-name"
```

## Customization

Edit `index.js` to:

- Add more selectors for better data extraction
- Handle different page structures
- Add custom filtering/processing
- Support pagination variations
- Add authentication headers if needed

Deploy changes:
1. Update `index.js` 
2. Copy and paste into Cloudflare Worker editor
3. Click **Deploy**

Changes are live immediately!

## Architecture

```
Provider Files → Cloudflare Worker → movies4u.ps
     ↓               ↓                    ↓
posts.ts      Scrapes HTML        Returns HTML
meta.ts       Parses data         (uncompressed)
stream.ts     Returns JSON
episodes.ts   
catalog.ts    
```

Provider just calls worker endpoints and gets clean JSON responses.

## Notes

- Worker cost: Free tier (100k req/day), then $0.50 per 1M requests
- No authentication needed for public sites
- Cloudflare automatically handles all compression (gzip, brotli, etc)
- CORS headers included for cross-origin requests
