# Video Extractors

This directory contains shared video extractors that can be used across multiple providers.

## Available Extractors

### StreamTape Extractor (`streamtapeExtractor.ts`)
- **Hosts**: streamtape.com, streamta.site, streamta.pe
- **Features**: Handles JavaScript obfuscation and robotlink manipulation
- **Status**: ✅ Working (v3.1 - Fixed JavaScript parsing)
- **Verified**: Returns 1.39GB MP4 videos

### DoodStream Extractor (`doodExtractor.ts`)
- **Hosts**: dood.watch, dood.la, dood.ws, dood.cx, dsvplay.com
- **Features**: Multi-host fallback, pass_md5 token extraction
- **Status**: ✅ Working
- **Verified**: Returns 1.21GB MP4 videos

### Mixdrop Extractor (`mixdropExtractor.ts`)
- **Hosts**: mixdrop.ag, mixdrop.co, mixdrop.to
- **Features**: Unpacks eval() obfuscated JavaScript, extracts MDCore.wurl
- **Status**: ✅ Working

## Usage in Providers

All extractors are registered in `providerContext.ts`:

```typescript
const extractors = {
  streamtapeExtractor,
  doodExtractor,
  mixdropExtractor,
  // ... other extractors
};
```

### Access via Provider Context

```typescript
export const getStream = async ({link, providerContext}) => {
  const result = await providerContext.extractors.streamtapeExtractor(url, axios);
  if (result) {
    return [{
      server: "StreamTape",
      link: result.link,
      type: result.type || "mp4",
      headers: result.headers
    }];
  }
};
```

## Architecture

### Build Process
1. TypeScript compiles all `.ts` files in `/providers/`
2. Build system bundles imports into provider's `stream.js`
3. Result: Single self-contained JavaScript file per provider
4. App downloads and executes compiled `stream.js`

### Why Separate Files?
- **Maintainability**: Each extractor is focused (~150 lines vs 700+ in one file)
- **Reusability**: Multiple providers can use same extractors
- **Testing**: Each extractor tested independently
- **Updates**: Change one file when host updates format
- **Scalability**: Add new extractors without touching existing code

### Current Architecture (Primewire v3.2)
```
providers/
├── streamtapeExtractor.ts       ← Standalone, registered in context
├── doodExtractor.ts             ← Standalone, registered in context
├── mixdropExtractor.ts          ← Standalone, registered in context
├── providerContext.ts           ← Central registry
└── primewire/
    └── stream.ts                ← Uses inline extractors (for now)
                                    Can migrate to context extractors in Phase 2
```

## Adding New Extractors

### Step 1: Create Extractor
```typescript
// providers/voeExtractor.ts
import axios from "axios";

export async function voeExtractor(
  url: string,
  axiosInstance: any = axios,
  signal?: AbortSignal
): Promise<{
  link: string;
  headers?: Record<string, string>;
  type?: string;
} | null> {
  try {
    // Extraction logic
    return {
      link: videoUrl,
      headers: { "User-Agent": "...", "Referer": url },
      type: "mp4"
    };
  } catch (error) {
    console.error("VOE extractor failed", error);
    return null;
  }
}
```

### Step 2: Register in Context
```typescript
// providers/providerContext.ts
import { voeExtractor } from "./voeExtractor";

const extractors = {
  // existing...
  voeExtractor,  // ← Add here
};
```

### Step 3: Use in Provider
```typescript
const result = await providerContext.extractors.voeExtractor(url, axios);
```

## Testing

Run extractor tests:
```bash
node test-extractors.js
```

Example test output:
```
✅ StreamTape: WORKING - Returns 1.39GB MP4
✅ DoodStream: WORKING - Returns 1.21GB MP4
```

## Version History

- **v3.2** (2025-10-27): Extractors available in providerContext
- **v3.1** (2025-10-27): Fixed StreamTape JavaScript parsing  
- **v3.0** (2025-10-27): Initial extractor separation

## Future Extractors Needed

- [ ] VOE (voe.sx)
- [ ] FileMoon (filemoon.sx)
- [ ] FileLions (filelions.to)
- [ ] StreamWish (streamwish.to)
- [ ] BigWarp (bigwarp.cc)
- [ ] SaveFiles (savefiles.com)
- [ ] LuluVdoo (luluvdoo.com)
- [ ] StreamPlay (streamplay.to)
- [ ] VidMoly (vidmoly.me)

---

**Pattern**: This follows the established architecture used by hubcloudExtractor, gofileExtracter, gdflixExtractor, etc.
