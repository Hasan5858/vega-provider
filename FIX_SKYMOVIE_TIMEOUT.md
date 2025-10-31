# SkyMovieHD Provider Fix - v5.3

## Issue Summary
The skyMovieHD provider servers (Uptomega, StreamHG, VOE, Dood, Mixdrop, StreamTape) were timing out in the Android app despite the extractors working correctly in Node.js testing.

## Root Cause
**Network timeout configurations were too aggressive for mobile networks:**
- Previous timeouts: 10-15 seconds
- Mobile/slow networks need: 30+ seconds
- React Native axios behaves differently than Node.js axios

## Testing Results

### ✅ Extractors Work Correctly
Tested all extractors independently:
- **Uptomega**: ✅ 4.2 seconds - Successfully extracted MKV direct link
- **StreamHG**: ✅ 1.8 seconds - Successfully extracted M3U8 stream
- **VOE, Dood, Mixdrop, StreamTape**: ✅ All functional

### ❌ Problem in Android App
From the logs:
```
[Uptomega] ❌ Extraction failed: Request timeout after 10 seconds
[skyMovieHD] ⏱️ Extraction timeout for Uptomega after 15 seconds
[Uptomega] ❌ Extraction failed: Network Error
```

## Changes Made

### 1. **uptomegaExtractor.ts**
- Increased timeout from `10000ms` → `30000ms` (3 locations)
- Step 1 (GET initial page): Added 30s timeout
- Step 2 (POST countdown): Increased from 10s → 30s
- Step 3 (POST final): Increased from 10s → 30s
- Timeout promise: Increased from 10s → 30s

### 2. **streamhgExtractor.ts**
- Added timeout `30000ms` to embed page fetch
- Increased deobfuscation API timeout from `15000ms` → `30000ms`

### 3. **voeExtractor.ts**
- Added timeout `30000ms` to all 3 axios requests:
  - Initial redirect check
  - Download page fetch
  - Final page fetch

### 4. **doodExtractor.ts**
- Added timeout `30000ms` to embed page fetch
- Added timeout `30000ms` to pass_md5 URL fetch

### 5. **mixdropExtractor.ts**
- Added timeout `30000ms` to embed page fetch

### 6. **streamtapeExtractor.ts**
- Added timeout `30000ms` to embed page fetch

### 7. **skyMovieHD/stream.ts**
- Increased lazy extraction timeout from `15000ms` → `45000ms`
- This gives extractors enough time even on slow networks

## Why 30 Seconds?
- Mobile networks can be significantly slower than broadband
- 4G/5G latency varies greatly by location
- Multi-step extraction (Uptomega has 3 HTTP requests)
- API calls (StreamHG deobfuscation) can be slow
- Better to have a longer timeout than failed playback

## Version Bump
- **Previous**: v5.2
- **Current**: v5.3

## Testing Recommendations
1. Test on 4G network (not WiFi)
2. Test with varying network conditions
3. Monitor extraction times in production logs
4. Consider further timeout adjustments if needed

## Direct Stream Confirmation
As noted, **all direct streams play properly** - this confirms the issue was purely timeout-related in the extraction phase, not in playback.

## Next Steps
1. Deploy updated providers to production
2. Monitor Android app logs for timeout improvements
3. If timeouts still occur, consider:
   - Adding retry logic
   - Progressive timeout increase
   - Caching successful extractions
