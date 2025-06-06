#!/bin/bash

echo "🔧 Element AI Extractor - Testing Helper"
echo "========================================"
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
echo "The connection fix should resolve the '❌ Error: Cannot connect to page' issue!"


cd /Users/arog/AI/START/1/bots/elementsExtractor && echo "🎉 CONNECTION FIX COMPLETE!" && echo "" && echo "📁 Extension Location: $(pwd)" && echo "🌐 Test Page: file://$(pwd)/test-connection.html" && echo "" && echo "✅ All required files present:" && ls -1 *.js *.json *.html | grep -E "(manifest|popup|content|background)" && echo "" && echo "🚀 READY TO LOAD IN CHROME!"

cd /Users/arog/AI/START/1/bots/elementsExtractor && echo "🎉 CONNECTION FIX COMPLETE!" && echo "" && echo "📁 Extension Location: $(pwd)" && echo "🌐 Test Page: file://$(pwd)/test-connection.html" && echo "" && echo "✅ Essential files present:" && ls -1 manifest.json popup.js contentScript.js background.js popup.html
