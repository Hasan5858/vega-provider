# Vega Provider Development Guide

## Overview

This guide explains how providers are structured in vega-providers and how to create or modify providers for the Vega App. Each provider is responsible for fetching movies/shows and their streaming sources from a specific website.

---

## Provider Folder Structure

Each provider lives in its own folder under `providers/`:

```
providers/
  myProvider/
    catalog.ts       # Define categories/filters
    meta.ts          # Fetch metadata for items
    posts.ts         # Fetch lists of items and search
    stream.ts        # Fetch streaming links/sources
    episodes.ts      # (Optional) Handle episodes for series
```

---

## Core Files Explained

### 1. catalog.ts

**Purpose:** Define the categories and filters available for your provider.

**How it works:**
- The `title` property is shown as a heading on the home page (e.g., "Popular Movies")
- The `filter` property is passed to `getPosts` in `posts.ts`
- When a user selects a category, the app sends the `filter` value to `getPosts`, which uses it to fetch relevant items

**Example:**
```typescript
export const catalog = [
  { title: "Popular Movies", filter: "/category/popular-movies" },
  { title: "Latest Movies", filter: "/category/latest-movies" },
];

export const genres = [
  { title: "Action", filter: "/genre/action" },
  { title: "Drama", filter: "/genre/drama" },
  { title: "Comedy", filter: "/genre/comedy" },
];
```

**Exports:**
- `catalog`: Array of objects with `title` and `filter` fields
- `genres`: (Optional) Array of genre objects with `title` and `filter` fields

---

### 2. meta.ts

**Purpose:** Fetch metadata (title, synopsis, image, etc.) for a specific item.

**When it's called:** When a user clicks on a movie/show to view its details.

**Example:**
```typescript
import { Info, ProviderContext } from "../types";

export const getMeta = async function ({
  link,
  providerContext,
}: {
  link: string;
  providerContext: ProviderContext;
}): Promise<Info> {
  const { axios, cheerio } = providerContext;
  
  // Fetch the page
  const res = await axios.get(link);
  const $ = cheerio.load(res.data);
  
  // Parse metadata
  return {
    title: "Movie Title",
    synopsis: "Plot description...",
    image: "https://example.com/poster.jpg",
    imdbId: "tt1234567",
    type: "movie", // "movie" or "series"
    linkList: [], // For series with seasons
  };
};
```

**Return Type (Info):**
```typescript
{
  title: string;           // Movie/show name
  synopsis: string;        // Plot description
  image: string;          // Poster URL
  imdbId?: string;        // IMDB ID (optional)
  type: "movie" | "series";
  linkList?: LinkList[];   // Seasons (for series)
}
```

---

### 3. posts.ts

**Purpose:** Fetch lists of items (movies/shows) and handle search functionality.

**Two main functions:**

#### getPosts()
Called when user browses categories or pages.

```typescript
export const getPosts = async function ({
  filter,
  page,
  providerValue,
  signal,
  providerContext,
}: {
  filter: string;              // Filter from catalog.ts
  page: number;               // Page number (1, 2, 3, ...)
  providerValue: string;      // Provider identifier
  signal: AbortSignal;        // Cancel signal
  providerContext: ProviderContext;
}): Promise<Post[]> {
  const { axios, cheerio } = providerContext;
  
  // Build URL with filter and page
  const url = `${baseUrl}${filter}?page=${page}`;
  
  // Fetch and parse
  const res = await axios.get(url, { signal });
  const $ = cheerio.load(res.data);
  
  // Extract posts
  const posts: Post[] = [];
  $(".movie-item").each((_, element) => {
    posts.push({
      title: $(element).find(".title").text(),
      image: $(element).find("img").attr("src"),
      link: $(element).find("a").attr("href"),
    });
  });
  
  return posts;
};
```

#### getSearchPosts() (Optional)
Called when user searches for a movie/show.

```typescript
export const getSearchPosts = async function ({
  searchQuery,
  page,
  providerValue,
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
  
  const url = `${baseUrl}/search?q=${encodeURIComponent(searchQuery)}&page=${page}`;
  const res = await axios.get(url, { signal });
  const $ = cheerio.load(res.data);
  
  // Parse and return search results
  // Same structure as getPosts
};
```

**Return Type (Post):**
```typescript
{
  title: string;        // Movie/show name
  image?: string;       // Thumbnail URL
  link: string;        // Link to pass to getMeta
}
```

---

### 4. stream.ts

**Purpose:** Fetch streaming links or sources for a given item.

**When it's called:** When user clicks play or selects a quality option.

**Example:**
```typescript
import { Stream, ProviderContext } from "../types";

export const getStream = async function ({
  link,
  type,
  signal,
  providerContext,
}: {
  link: string;              // Link from getMeta or posts
  type: string;             // "movie" or "series"
  signal: AbortSignal;      // Cancel signal
  providerContext: ProviderContext;
}): Promise<Stream[]> {
  const { axios, cheerio } = providerContext;
  
  // Fetch the page
  const res = await axios.get(link, { signal });
  const $ = cheerio.load(res.data);
  
  const streams: Stream[] = [];
  
  // Extract streaming links
  $(".stream-link").each((_, element) => {
    const quality = $(element).attr("data-quality") || "unknown";
    const streamLink = $(element).attr("href");
    
    streams.push({
      server: "StreamServer",
      link: streamLink,
      type: "mkv",        // "mkv", "mp4", "m3u8", etc.
      quality: quality,   // "720", "1080", "2160", etc.
    });
  });
  
  return streams;
};
```

**Return Type (Stream):**
```typescript
{
  server: string;       // Server/source name
  link: string;        // Streaming URL
  type: string;        // File type: "mkv", "mp4", "m3u8", "hls"
  quality?: string;    // Optional: "720", "1080", "2160"
  headers?: object;    // Optional: Custom HTTP headers
}
```

---

### 5. episodes.ts (Optional)

**Purpose:** Fetch episode lists for a specific season (used for series with many episodes).

**When to use:**
- If your `getMeta` already returns all episodes in `linkList`, you don't need this file
- If you need to make an extra request per season, use this file

**Example:**
```typescript
import { EpisodeLink, ProviderContext } from "../types";

export const getEpisodes = async function ({
  url,
  providerContext,
}: {
  url: string;                  // episodesLink from meta.ts
  providerContext: ProviderContext;
}): Promise<EpisodeLink[]> {
  const { axios, cheerio } = providerContext;
  
  // Fetch season page
  const res = await axios.get(url);
  const $ = cheerio.load(res.data);
  
  const episodes: EpisodeLink[] = [];
  
  $(".episode").each((_, element) => {
    episodes.push({
      title: `Episode ${$(element).attr("data-ep")}`,
      link: $(element).find("a").attr("href"),
    });
  });
  
  return episodes;
};
```

**Return Type (EpisodeLink):**
```typescript
{
  title: string;   // Episode title
  link: string;    // Episode link (passed to getStream)
}
```

---

## linkList in meta.ts (For Series)

The `linkList` property describes seasons or episode groups for a series.

**Structure:**
```typescript
linkList: [
  {
    title: "Season 1",                    // Shown in dropdown
    episodesLink: "/season-1",           // Optional: URL for getEpisodes
    directLinks: [                       // Optional: Direct episode links
      {
        link: "https://example.com/ep1",
        title: "Episode 1",
        type: "movie",                  // or "series"
      },
    ],
    quality: "1080",                     // Optional: Quality indicator
  },
]
```

**Two approaches:**

1. **With episodesLink (Requires extra request):**
   - Return `episodesLink` value
   - App calls `getEpisodes` when user selects the season
   - Use this when the website requires a separate page per season

2. **With directLinks (No extra request):**
   - Return full episode links directly
   - App sends episode link directly to `getStream`
   - Use this when you can fetch all episodes at once

---

## providerContext Object

Shared utilities passed to all functions. Provides common tools and dependencies:

```typescript
{
  axios: AxiosInstance;           // For HTTP requests
  cheerio: CheerioAPI;            // For HTML parsing
  getBaseUrl: (providerValue) => string;  // Get base URL
  commonHeaders: object;          // Standard HTTP headers
  extractors: {                   // Shared extractor functions
    gofileExtracter: (id) => Promise<...>;
    gdFlixExtracter: (url, signal) => Promise<...>;
    hubcloudExtracter: (url, signal) => Promise<...>;
    superVideoExtractor: (code) => Promise<...>;
  };
  Aes?: AES;                     // For encryption (if needed)
}
```

**Base URLs:** Stored in `/data/modflix.json`

---

## Reference Types

All functions use TypeScript interfaces from `providers/types.ts`:

```typescript
interface Post {
  title: string;
  image?: string;
  link: string;
}

interface Info {
  title: string;
  synopsis: string;
  image: string;
  imdbId?: string;
  type: "movie" | "series";
  linkList?: LinkList[];
}

interface Stream {
  server: string;
  link: string;
  type: string;
  quality?: string;
  headers?: Record<string, string>;
}

interface LinkList {
  title: string;
  episodesLink?: string;
  directLinks?: {
    link: string;
    title: string;
    type: string;
  }[];
  quality?: string;
}

interface EpisodeLink {
  title: string;
  link: string;
}

interface ProviderContext {
  axios: AxiosInstance;
  cheerio: CheerioAPI;
  getBaseUrl: (providerValue: string) => string;
  commonHeaders: Record<string, string>;
  extractors: Extractors;
  Aes?: AES;
}
```

---

## How to Test Your Provider Locally

### Step 1: Start the Dev Server

```bash
npm run auto
```

This will start the development server and print a "Mobile test url" (e.g., `http://192.168.1.100:3001`).

### Step 2: Configure Vega App for Testing

1. Open your Vega App project
2. Go to `src/lib/services/ExtensionManager.ts`
3. Set test mode variables:

```typescript
private testMode = true;
private baseUrlTestMode = "http://192.168.1.100:3001"; // Your local IP + port
```

### Step 3: Network Setup

- Both your dev machine (running the dev server) and mobile device (running Vega app) must be on the **same network**

### Step 4: Test in the App

- The app will now use your local provider code
- Test browsing, searching, and playing videos

---

## Common Patterns & Tips

### 1. Error Handling

Always wrap async operations in try-catch:

```typescript
try {
  const res = await axios.get(url, { signal });
  // Process response
} catch (error) {
  console.error("Error:", error);
  return [];  // Return empty array on error
}
```

### 2. Using AbortSignal

Cancel requests if user navigates away:

```typescript
const res = await axios.get(url, { signal });
```

### 3. Extracting with Cheerio

```typescript
const $ = cheerio.load(html);
$(".selector").each((_, element) => {
  const text = $(element).text().trim();
  const href = $(element).attr("href");
});
```

### 4. Handling Multiple Streams Per Quality

For providers with multiple server options per quality:

```typescript
const streams: Stream[] = [];

// For each quality option
$(".quality").each((_, qualityElement) => {
  const quality = $(qualityElement).attr("data-quality");
  
  // Extract all servers for this quality
  $(qualityElement).find(".server").each((_, serverElement) => {
    streams.push({
      server: $(serverElement).text(),
      link: $(serverElement).attr("href"),
      type: "mkv",
      quality: quality,
    });
  });
});

return streams;
```

### 5. Custom Headers

Some providers require specific headers:

```typescript
const res = await axios.get(url, {
  headers: {
    Referer: "https://example.com",
    "User-Agent": "Mozilla/5.0...",
  },
  signal,
});
```

---

## Build & Deployment

### Build Providers

```bash
npm run build
```

This:
- Compiles TypeScript to JavaScript
- Minifies code
- Removes console logs
- Copies data files

### Deploy to GitHub

```bash
git add -A
git commit -m "Provider update: [description]"
git push origin main
```

The app automatically fetches updated providers from GitHub.

---

## Debugging Tips

### 1. Check Console Logs

Console logs are removed during minification, so add strategic logs during development:

```typescript
console.log("Extracted posts:", posts);
```

### 2. Test URLs Directly

Use the interactive test script:

```bash
node interactive-test.js
```

### 3. Check Network Requests

Use browser DevTools or network debugging to verify:
- URLs are correct
- Responses are valid
- No CORS or Cloudflare issues

### 4. Provider-Specific Issues

- **Cloudflare blocking:** Some sites use Cloudflare which blocks axios. Consider using extractors or alternative sources.
- **Dynamic content:** If content is loaded via JavaScript, you may need to use a headless browser or find a direct API.
- **Rate limiting:** Add delays between requests if needed.

---

## FilmyFly Provider Example (v2.5)

**Current Status:** Working with 28-42 playable streams per movie

**Server Breakdown:**
- **Fast Cloud:** 1 direct link × 7 qualities = 7 streams
- **GoFile:** 1 direct link × 7 qualities = 7 streams
- **GDFLIX:** 1-3 direct links × 7 qualities = 7-21 streams
- **Ultra FastDL:** 1 direct link (via VLC fallback) × 7 qualities = 7 streams

**Removed Servers:**
- Direct Download (Cloudflare 403 Forbidden)
- Fast Cloud-02 (Cloudflare 403 Forbidden)

**Key Implementation Details:**
1. Extracts quality options from linkmake.in (7 qualities)
2. Fetches filesdl.site for each quality (8 servers per quality)
3. Uses extractors for GoFile and GDFLIX
4. Handles direct AWS links for Fast Cloud
5. Keeps Ultra FastDL (VLC fallback handles codec issues)

---

## Quick Reference: Function Signatures

### catalog.ts
```typescript
export const catalog: { title: string; filter: string }[]
export const genres?: { title: string; filter: string }[]
```

### posts.ts
```typescript
export const getPosts = async ({ filter, page, providerValue, signal, providerContext }) => Promise<Post[]>
export const getSearchPosts? = async ({ searchQuery, page, providerValue, signal, providerContext }) => Promise<Post[]>
```

### meta.ts
```typescript
export const getMeta = async ({ link, providerContext }) => Promise<Info>
```

### stream.ts
```typescript
export const getStream = async ({ link, type, signal, providerContext }) => Promise<Stream[]>
```

### episodes.ts (Optional)
```typescript
export const getEpisodes = async ({ url, providerContext }) => Promise<EpisodeLink[]>
```

---

## File Organization Checklist

When creating a new provider:

- [ ] Create folder under `providers/`
- [ ] Create `catalog.ts` with categories
- [ ] Create `posts.ts` with `getPosts` (and optionally `getSearchPosts`)
- [ ] Create `meta.ts` with `getMeta`
- [ ] Create `stream.ts` with `getStream`
- [ ] Create `episodes.ts` only if needed for series
- [ ] Add base URL to `data/modflix.json`
- [ ] Test locally using `npm run auto`
- [ ] Build with `npm run build`
- [ ] Commit and push to GitHub

---

## Useful Resources

- **Types:** `providers/types.ts` - All TypeScript interfaces
- **Base URLs:** `data/modflix.json` - Provider base URLs
- **Extractors:** 
  - `providers/gofileExtracter.ts` - Extract GoFile links
  - `providers/gdflixExtractor.ts` - Extract GDFLIX links
  - `providers/hubcloudExtractor.ts` - Extract HubCloud links
  - `providers/superVideoExtractor.ts` - Extract obfuscated video links

---

**Last Updated:** October 23, 2025  
**FilmyFly Provider Version:** 2.5  
**Status:** Production Ready
