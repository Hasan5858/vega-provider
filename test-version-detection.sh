#!/bin/bash

# Script to test provider version detection
# Run this after bumping a provider version

echo "🔍 Vega Provider Version Detection Diagnostic"
echo "=============================================="
echo ""

# Check manifest.json
echo "📋 Current manifest.json (vega-providers):"
cat /Users/hasansarkar/Documents/My\ Project/vega-providers/manifest.json | grep -A 2 '"primewire"' | head -5
echo ""

# Check if changes are staged
echo "📦 Git status (vega-providers):"
cd /Users/hasansarkar/Documents/My\ Project/vega-providers
git status --short | head -5
echo ""

# Check if built
echo "🔨 Checking if dist/ files exist:"
if [ -f "dist/primewire/stream.js" ]; then
    echo "  ✅ dist/primewire/stream.js exists"
    echo "  Size: $(stat -f%z dist/primewire/stream.js) bytes"
else
    echo "  ❌ dist/primewire/stream.js NOT FOUND - need to run 'npm run build'"
fi
echo ""

# Check git log
echo "📝 Recent commits:"
git log --oneline -5
echo ""

echo "✅ Diagnostic complete!"
echo ""
echo "NEXT STEPS:"
echo "1. If dist/ files don't exist: run 'npm run build' in vega-providers"
echo "2. Verify manifest.json version is bumped"
echo "3. Commit: git add -A && git commit -m 'bump version'"
echo "4. Push: git push"
echo "5. In vega-app, either:"
echo "   a) Wait for app startup to fetch fresh manifest, OR"
echo "   b) Call: ExtensionManager.getInstance().forceFullCacheRefresh()"
echo "   c) Or in debug: call ExtensionManager.getInstance().forceClearManifestCache()"
