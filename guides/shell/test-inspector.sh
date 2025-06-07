#!/bin/bash

# Script to test the Element AI Extractor Inspector functionality

echo "🔄 Reloading Extension..."

# Kill any existing Chrome processes (optional)
# pkill -f "Google Chrome"

echo "🚀 Opening test page with extension..."

# Open Chrome with the extension loaded
open -na "Google Chrome" --args \
  --load-extension="/Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor" \
  --new-window \
  "file:///Users/arog/ADP/ElementsExtractorV1/test-inspector-functionality.html"

echo "✅ Extension loaded! Follow these steps:"
echo ""
echo "1. 🔧 Open Chrome DevTools (F12) and go to Console tab"
echo "2. 🎯 Click the Element AI Extractor extension icon"
echo "3. ▶️  Click 'Start Inspecting'"
echo "4. 🖱️  Click on any test element on the page"
echo "5. 📋 Try the Copy button in the AI Inspector Active window"
echo "6. 👁️  Try the Highlight button in the AI Inspector Active window"
echo "7. 📊 Watch the console for debugging information"
echo ""
echo "🐛 If buttons don't work, check console for error messages!"
