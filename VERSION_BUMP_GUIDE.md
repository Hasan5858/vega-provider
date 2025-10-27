# Version Bump Checklist - Vega Providers

## Complete Workflow for Bumping Provider Versions

### Step 1: Verify Changes
```bash
# In vega-providers
git status
ls dist/primewire/stream.js  # Should exist after `npm run build`
```

### Step 2: Update manifest.json
Edit `/vega-providers/manifest.json`:
```json
{
  "value": "primewire",
  "version": "4.2",  // ← Change this
  ...
}
```

### Step 3: Build New Version
```bash
cd vega-providers
npm run build    # Creates/updates dist/ files

# Verify the build
ls -lah dist/primewire/
```

### Step 4: Commit & Push to GitHub
```bash
git add manifest.json dist/
git commit -m "bump: Primewire v4.1 → v4.2

- Fixed SaveFiles CDN link extraction (s4.savefiles.com pattern)
- Improved error handling for redirect URLs"

git push
```

### Step 5: Verify on GitHub
- Go to https://github.com/Hasan5858/vega-provider
- Check recent commits pushed
- Check manifest.json shows new version
- Check dist/ files updated

### Step 6: Force App to Detect Update

**Option A: Wait for next app restart** (automatic)
- App calls `ExtensionManager.initialize()` on startup
- Fetches fresh manifest with `force=true`
- Detects version mismatch
- Auto-downloads new modules

**Option B: Manual force refresh** (for testing)
```typescript
// In debug console / settings screen / or anywhere you can call:
import {ExtensionManager} from '@/lib/services/ExtensionManager';

// Full cache clear (most aggressive)
await ExtensionManager.getInstance().forceFullCacheRefresh();

// Or just manifest refresh
await ExtensionManager.getInstance().forceClearManifestCache();
```

### Step 7: Verify Update in App

Check logs during/after update detection:
```
🔄 Fetching latest manifest on app startup...
📡 Fetching manifest from: https://raw.githubusercontent.com/Hasan5858/vega-provider/main/manifest.json
Version check for primewire:
  Available: 4.2
  Installed: 4.1
  Cached modules version: 4.1
⚠️ Provider primewire has update: 4.1 → 4.2. Downloading new version...
✅ Successfully updated provider primewire in background
```

## Troubleshooting

### App Still Shows Old Version

**Problem**: Version bump pushed, but app still showing v4.1

**Solutions**:
1. **Force clear all caches**:
   ```typescript
   ExtensionManager.getInstance().forceFullCacheRefresh()
   ```

2. **Manually clear app cache** (Android):
   - Settings → Apps → Vega → Storage → Clear Cache
   - Restart app

3. **Check if dist/ was actually built**:
   ```bash
   npm run build
   ls -lah dist/primewire/
   ```

4. **Verify manifest.json has correct version**:
   ```bash
   grep -A 2 '"primewire"' manifest.json
   ```

### Version Stuck at "Checking for Updates"

**Problem**: App seems stuck checking for updates

**Solution**: Network issue during download
1. Restart app
2. Check network connectivity
3. Check if GitHub is accessible:
   ```bash
   curl https://raw.githubusercontent.com/Hasan5858/vega-provider/main/manifest.json
   ```

### New Extractor Not Working After Version Bump

**Problem**: Bumped version, but extractor still undefined

**Checklist**:
- ✅ Extractor file created: `providers/{name}Extractor.ts`
- ✅ Imported in `providers/providerContext.ts`
- ✅ Added to `extractors` object in `providerContext.ts`
- ✅ Type definition added to `providers/types.ts`
- ✅ Routing added in `providers/primewire/stream.ts`
- ✅ Build succeeded: `npm run build`
- ✅ dist/ files generated: `ls dist/primewire/stream.js`
- ✅ Commit & push
- ✅ Sync to vega-app local files (if not remote-loading)

## Version History Format

Keep track in manifest.json:

```
v4.2 - Fixed SaveFiles CDN link extraction
v4.1 - Added StreamWish extractor with yuguaab.com working domain
v4.0 - Lazy-loading optimization (first server immediate, rest on-demand)
v3.9 - Added FileMoon extractor
v3.8 - Added VOE extractor
```

## Script: Auto-Check Version Status

```bash
# Quick diagnostic
bash test-version-detection.sh
```

Checks:
- manifest.json version
- dist/ files exist and size
- Recent git commits
- Ready for next steps
