# Video Host Extractors

This directory contains modular video extractors for various hosting services. 

## ⚠️ Important Architecture Note

**The separate extractor files (`streamtapeExtractor.ts`, `mixdropExtractor.ts`, `doodExtractor.ts`) are kept for reference and potential future use in other contexts, but they CANNOT be imported into provider modules due to the app's module system limitations.**

The app's runtime environment does not support cross-module imports (like `import { extractMixdrop } from "../mixdropExtractor"`). Each provider module must be **self-contained**.

## Current Implementation

### For Provider Modules (e.g., `primewire/stream.ts`)
Extractors must be **embedded inline** within the provider's stream.ts file:

```typescript
// ✅ CORRECT: Inline extractor functions
const extractMixdrop: Extractor = async (url, axios) => {
  // extraction logic here
};

const extractDood: Extractor = async (url, axios) => {
  // extraction logic here
};

// Use them in HOST_EXTRACTORS array
const HOST_EXTRACTORS = [
  { match: (link, host) => host.includes("mixdrop"), extractor: extractMixdrop },
  { match: (link, host) => host.includes("dood"), extractor: extractDood },
];
```

```typescript
// ❌ INCORRECT: Importing from external modules
import { extractMixdrop } from "../mixdropExtractor";  // Won't work!
```

## Available Extractors (Reference)

### StreamTape Extractor (`streamtapeExtractor.ts`)
- **Hosts**: streamtape.com, streamta.pe
- **Method**: Extracts video links from `robotlink` element or JavaScript
- **Output**: Direct MP4 links
- **Notes**: Automatically adds `stream=1` parameter

### Mixdrop Extractor (`mixdropExtractor.ts`)
- **Hosts**: mixdrop.co, mixdrop.to
- **Method**: Unpacks obfuscated JavaScript to find video URL
- **Output**: Direct MP4 links
- **Notes**: Converts `/f/` URLs to `/e/` embed URLs automatically

### DoodStream Extractor (`doodExtractor.ts`)
- **Hosts**: dood.la, dood.ws, dood.cx, dsvplay.com
- **Method**: Tries multiple known hosts, extracts pass_md5 and token
- **Output**: Direct MP4 links with token and expiry parameters
- **Notes**: Automatically tries fallback hosts if primary host fails

## Usage

These extractor files serve as **reference implementations**. When you need an extractor:

1. **Copy the extractor function** from the reference file
2. **Paste it directly** into your provider's stream.ts file
3. **Customize** as needed for your provider

```typescript
// Example: Adding StreamTape support to a provider
// 1. Copy from streamtapeExtractor.ts
// 2. Paste into your provider/stream.ts

const extractStreamTape: Extractor = async (url, axios) => {
  // ... full implementation here ...
};

// 3. Add to your HOST_EXTRACTORS
const HOST_EXTRACTORS = [
  {
    match: (link, host) => host.includes("streamtape"),
    extractor: extractStreamTape
  }
];
```

## Extractor Interface

All extractors follow the same interface:

```typescript
type ExtractedStream = {
  link: string;                      // Direct video URL
  headers?: Record<string, string>;  // Required headers for playback
  type?: string;                     // Video type (usually "mp4")
};

type Extractor = (
  url: string,
  axios: ProviderContext["axios"]
) => Promise<ExtractedStream | null>;
```

## Maintenance Guide

### Updating an Extractor

If a host changes their structure:

1. Edit the specific extractor file (e.g., `mixdropExtractor.ts`)
2. Update the extraction logic
3. Run `npm run build` to recompile
4. Test the changes
5. Push to GitHub - the app will use the updated module

### Adding a New Extractor

1. Create a new file: `newHostExtractor.ts`
2. Follow the extractor interface shown above
3. Export your extraction function
4. Import it in the provider that needs it (e.g., `primewire/stream.ts`)
5. Add it to the `HOST_EXTRACTORS` array with appropriate host matching logic

### Removing an Extractor

If a host is no longer functional:

1. Remove the import from the provider
2. Remove it from the `HOST_EXTRACTORS` array
3. Optionally delete the extractor file
4. Rebuild and push

## Benefits of Modular Design

✅ **Easy Maintenance**: Update one extractor without affecting others
✅ **Reusability**: Use the same extractor across multiple providers
✅ **Quick Updates**: Push fixes to GitHub, app automatically uses new version
✅ **Clean Code**: Smaller, focused files are easier to understand and debug
✅ **Testing**: Test individual extractors in isolation

## Example: Primewire Provider

The Primewire provider (`primewire/stream.ts`) uses all three extractors:

```typescript
import { extractMixdrop } from "../mixdropExtractor";
import { extractDood } from "../doodExtractor";
import { extractStreamTape } from "../streamtapeExtractor";

const HOST_EXTRACTORS = [
  {
    match: (link, host) => 
      normalizeHost(host).includes("mixdrop") || link.includes("mixdrop"),
    extractor: extractMixdrop,
  },
  {
    match: (link, host) =>
      normalizeHost(host).includes("dood") || link.includes("dood"),
    extractor: extractDood,
  },
  {
    match: (link, host) =>
      normalizeHost(host).includes("streamtape") || link.includes("streamtape"),
    extractor: extractStreamTape,
  },
];
```

This makes it easy to add, remove, or modify extractors without touching the core provider logic.
