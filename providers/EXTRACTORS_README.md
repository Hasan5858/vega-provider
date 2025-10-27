# Video Host Extractors

This directory contains modular video extractors for various hosting services. Each extractor is a standalone module that can be easily maintained, updated, or removed independently.

## Available Extractors

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

Each extractor exports a single async function that takes a URL and axios instance:

```typescript
import { extractStreamTape } from "./streamtapeExtractor";
import { extractMixdrop } from "./mixdropExtractor";
import { extractDood } from "./doodExtractor";

// Example usage
const result = await extractStreamTape(url, axios);
if (result) {
  console.log("Video URL:", result.link);
  console.log("Headers:", result.headers);
  console.log("Type:", result.type);
}
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
