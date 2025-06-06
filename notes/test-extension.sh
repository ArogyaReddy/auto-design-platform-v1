#!/bin/bash

# Element AI Extractor - Test Script
# This script helps with testing the extension after fixes

echo "🔧 Element AI Extractor - Testing Helper"
echo "========================================"

# Check if Chrome is running
if pgrep -x "Google Chrome" > /dev/null; then
    echo "✅ Chrome is running"
else
    echo "❌ Chrome is not running. Please start Chrome first."
    exit 1
fi

echo ""
echo "📋 TESTING CHECKLIST:"
echo "---------------------"
echo "1. Load extension in Chrome:"
echo "   - Go to chrome://extensions/"
echo "   - Enable Developer mode"
echo "   - Click 'Load unpacked'"
echo "   - Select: $(pwd)"
echo ""
echo "2. Test on the connection page:"
echo "   - Open: file://$(pwd)/test-connection.html"
echo "   - Click extension icon"
echo "   - Click 'Inspect Element' button"
echo "   - Should see: '🔬 Inspect Mode: Click an element on the page.'"
echo ""
echo "3. Test element inspection:"
echo "   - Click on various elements on the test page"
echo "   - Verify element details appear in popup"
echo ""
echo "4. Test on restricted pages:"
echo "   - Try on chrome://extensions/"
echo "   - Should see restriction error message"
echo ""

# Check if test page exists
if [ -f "test-connection.html" ]; then
    echo "✅ Test page exists: test-connection.html"
else
    echo "❌ Test page not found: test-connection.html"
fi

# Check if all required files exist
files=("manifest.json" "popup.js" "contentScript.js" "background.js" "popup.html" "popup.css")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing!"
    fi
done

echo ""
echo "🚀 Extension directory: $(pwd)"
echo "🌐 Test page: file://$(pwd)/test-connection.html"
echo ""
echo "Happy testing! 🎉"
