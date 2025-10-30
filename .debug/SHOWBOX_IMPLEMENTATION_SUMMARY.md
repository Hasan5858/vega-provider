# Showbox Provider Cloudflare Bypass Implementation

## Current Status

### ✅ Completed:
1. **Created `cfConfig.ts`**: Shared Cloudflare bypass headers configuration
2. **Updated `posts.ts`**: Added CF headers to catalog fetching
3. **Updated `meta.ts`**: Added CF headers to metadata fetching
4. **Headers include**: All required Chrome fingerprint headers (sec-ch-ua*, sec-fetch-*, etc.)

### ⚠️ Required for Full Functionality:
1. **Cookies needed**: `cf_clearance` cookie is required (expires periodically)
2. **Cookie injection**: Need mechanism to inject/update cookies dynamically
3. **Parsing verification**: Need to test with working cookie to verify selectors

## Implementation Details

### Selectors Used:
- **Posts/Catalog**: `.movie-item,.flw-item` → `.film-name`, `a[href]`, `img[src]`
- **Meta**: `.heading-name`, `.btn-imdb`, `.cover_follow`, `.description`
- **Episodes**: Uses febbox API (no CF protection)
- **Stream**: Uses febbox API (no CF protection)

### How It Currently Works:
1. **Catalog** (`posts.ts`):
   - Gets base URL from modflixData
   - Fetches `${baseUrl}${filter}?page=${page}/` with CF headers
   - Parses `.movie-item,.flw-item` elements
   - Extracts title, link, image

2. **Meta** (`meta.ts`):
   - Fetches movie/show detail page with CF headers
   - Extracts title, rating, image, synopsis
   - Calls `/index/share_link` endpoint for febbox key
   - Gets file list from febbox API

3. **Stream** (`stream.ts`):
   - Uses febbox API (separate domain, no CF)
   - No headers needed

## Next Steps:
1. Test with valid cookie to verify parsing works
2. Consider cookie storage/refresh mechanism
3. Update selectors if site structure changed
