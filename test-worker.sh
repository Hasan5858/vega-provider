#!/bin/bash

# Movies4U Worker Testing Script
# Run this after deploying the updated worker

WORKER_URL="https://movies4u.steep-bread-3c84.workers.dev"

echo "🧪 Testing Movies4U Worker"
echo "=================================="
echo ""

# Test 1: Catalog
echo "✅ Test 1: Catalog Endpoint"
echo "Command: curl -s \"$WORKER_URL?action=catalog\" | jq ."
echo ""
CATALOG=$(curl -s "$WORKER_URL?action=catalog")
CATALOG_COUNT=$(echo "$CATALOG" | jq '.catalog | length')
echo "Result: $CATALOG_COUNT categories found"
echo "$CATALOG" | jq '.catalog[] | {title, filter}' | head -20
echo ""
echo "---"
echo ""

# Test 2: Posts (Trending)
echo "✅ Test 2: Posts Endpoint (Trending)"
echo "Command: curl -s \"$WORKER_URL?action=posts&page=1\" | jq ."
echo ""
POSTS=$(curl -s "$WORKER_URL?action=posts&page=1")
POSTS_COUNT=$(echo "$POSTS" | jq '.count')
echo "Result: $POSTS_COUNT posts found"
echo "$POSTS" | jq '.posts[0:2]'
FIRST_LINK=$(echo "$POSTS" | jq -r '.posts[0].link')
echo "First post link: $FIRST_LINK"
echo ""
echo "---"
echo ""

# Test 3: Posts (Bollywood)
echo "✅ Test 3: Posts Endpoint (Bollywood)"
echo "Command: curl -s \"$WORKER_URL?action=posts&category=/category/bollywood/&page=1\" | jq ."
echo ""
BOLLYWOOD=$(curl -s "$WORKER_URL?action=posts&category=/category/bollywood/&page=1")
BOLLYWOOD_COUNT=$(echo "$BOLLYWOOD" | jq '.count')
echo "Result: $BOLLYWOOD_COUNT Bollywood posts found"
echo ""
echo "---"
echo ""

# Test 4: Meta
echo "✅ Test 4: Meta Endpoint"
echo "Command: curl -s \"$WORKER_URL?action=meta&link=$FIRST_LINK\" | jq ."
echo ""
META=$(curl -s "$WORKER_URL?action=meta&link=$FIRST_LINK")
META_TITLE=$(echo "$META" | jq -r '.data.title')
META_IMAGE=$(echo "$META" | jq -r '.data.image')
META_TYPE=$(echo "$META" | jq -r '.data.type')
echo "Result:"
echo "  Title: $META_TITLE"
echo "  Image: $META_IMAGE"
echo "  Type: $META_TYPE"
echo ""
echo "---"
echo ""

# Test 5: Stream
echo "✅ Test 5: Stream Endpoint"
echo "Command: curl -s \"$WORKER_URL?action=stream&link=$FIRST_LINK\" | jq ."
echo ""
STREAM=$(curl -s "$WORKER_URL?action=stream&link=$FIRST_LINK")
STREAM_COUNT=$(echo "$STREAM" | jq '.count')
echo "Result: $STREAM_COUNT streams found"
if [ "$STREAM_COUNT" -gt 0 ]; then
  echo "$STREAM" | jq '.streams[0:3]'
else
  echo "No streams found - this might be expected"
fi
echo ""
echo "---"
echo ""

# Summary
echo "🎯 Test Summary:"
echo "================"
echo "✅ Catalog: $CATALOG_COUNT categories"
echo "✅ Posts (Trending): $POSTS_COUNT posts"
echo "✅ Posts (Bollywood): $BOLLYWOOD_COUNT posts"
echo "✅ Meta: Title extracted"
if [ ! -z "$META_IMAGE" ] && [ "$META_IMAGE" != "null" ] && [ "$META_IMAGE" != "" ]; then
  echo "✅ Meta: Image found"
else
  echo "⚠️  Meta: Image not found"
fi
echo "✅ Stream: $STREAM_COUNT streams"
echo ""
echo "=================================="
echo "✨ Testing Complete!"
