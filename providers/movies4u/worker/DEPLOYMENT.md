# Movies4U Worker Deployment & Testing

## ⚠️ IMPORTANT: Worker Code Updated!

The worker code has been updated to fix the title extraction issue. You need to redeploy it to Cloudflare.

## Deployment Steps

1. **Go to Cloudflare Workers Dashboard**
   - URL: https://dash.cloudflare.com/
   - Navigate to Workers & Pages

2. **Edit your worker** (movies4u.steep-bread-3c84)
   - Click on the worker
   - Click "Quick Edit" or "Edit Code"

3. **Replace ALL code**
   - Copy entire content from `index.js` in this folder
   - Paste into Cloudflare editor
   - Click "Save and Deploy"

## What Was Fixed

**Issue:** Worker was returning 0 posts
**Cause:** Title extraction regex was looking for text directly in `<h2>` tag, but actual HTML has:
```html
<h2 class="entry-title"><a href="...">Title Here</a></h2>
```

**Fix:** Updated regex to extract title from `<a>` tag inside `<h2>`

## Testing After Deployment

### 1. Test Catalog Endpoint
```bash
curl "https://movies4u.steep-bread-3c84.workers.dev?action=catalog"
```
**Expected:** JSON with categories array

### 2. Test Posts - Trending (Homepage)
```bash
curl "https://movies4u.steep-bread-3c84.workers.dev?action=posts&page=1"
```
**Expected:** JSON with posts array containing 20+ movies

### 3. Test Posts - Bollywood Category
```bash
curl "https://movies4u.steep-bread-3c84.workers.dev?action=posts&category=/category/bollywood/&page=1"
```
**Expected:** JSON with Bollywood movies

### 4. Test Posts - Search
```bash
curl "https://movies4u.steep-bread-3c84.workers.dev?action=posts&search=avengers&page=1"
```
**Expected:** JSON with search results

### 5. Test Meta (Get a link from posts first)
```bash
curl "https://movies4u.steep-bread-3c84.workers.dev?action=meta&link=https://movies4u.ps/thamma-2025-hindi-hq-hdtc/"
```
**Expected:** JSON with movie metadata (title, image, synopsis, linkList)

### 6. Test Stream (Use link from meta linkList)
```bash
curl "https://movies4u.steep-bread-3c84.workers.dev?action=stream&link=https://movies4u.ps/thamma-2025-hindi-hq-hdtc/"
```
**Expected:** JSON with stream links

### 7. Test Episodes (For series only)
```bash
curl "https://movies4u.steep-bread-3c84.workers.dev?action=episodes&link=https://movies4u.ps/some-series-link/"
```
**Expected:** JSON with episodes array

## Success Criteria

✅ **Catalog:** Returns 10 categories
✅ **Posts (Trending):** Returns 20+ posts with title, image, link
✅ **Posts (Category):** Returns category-specific posts
✅ **Posts (Search):** Returns search results
✅ **Meta:** Returns movie info with linkList array
✅ **Stream:** Returns stream links array
✅ **Episodes:** Returns episodes for series

## Provider Testing (After Worker Deployment)

Once worker is deployed and tested, the provider files in vega-app will:

1. **posts.ts** - Fetch from `?action=posts`
2. **catalog.ts** - Use hardcoded categories
3. **meta.ts** - Fetch from `?action=meta`
4. **stream.ts** - Fetch from `?action=stream` then use extractors
5. **episodes.ts** - Fetch from `?action=episodes`

All provider files are already updated and compiled (v2.5).

## Next Steps

1. ✅ Deploy updated worker code to Cloudflare
2. ✅ Test all endpoints (use commands above)
3. ✅ If all tests pass, push provider code to GitHub
4. ✅ Test in vega-app

## Notes

- Worker handles HTML decompression automatically (Brotli/gzip)
- Provider just consumes clean JSON API
- Console logs preserved in provider build (KEEP_CONSOLE=true)
- Version bumped to 2.5 in manifest.json
