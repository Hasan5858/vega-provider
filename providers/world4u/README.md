# World4u Provider - DISABLED

## Status: DISABLED
This provider has been disabled from production due to codec compatibility issues with React Native player.

## Reason for Disabling
- Video and audio codecs returned by this provider are not supported by React Native player
- Provider returns valid streaming links but they cannot be played in the mobile app

## Backup Status
- Provider code is kept as backup for future use
- All functionality is preserved and working
- Can be re-enabled by setting `"disabled": false` in manifest.json

## Last Working State
- All streaming link extraction is working correctly
- Supports multiple qualities (1080p, 720p, 480p, HEVC)
- Handles w4links.skin redirects to fastilinks.online
- Prioritizes Photolinx links over Mediafire links
- Tested with "The Conjuring: Last Rites (2025)" - all links accessible

## To Re-enable
1. Set `"disabled": false` in manifest.json
2. Rebuild the project: `npm run build`
3. Deploy the updated manifest

## Technical Notes
- Provider uses Photolinx and Mediafire hosting
- Links are valid but codec format is incompatible with React Native
- Consider re-enabling if React Native player adds support for these codecs
