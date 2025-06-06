#!/bin/bash

# Test Element AI Extractor Inspector Functionality
echo "🔧 Testing Element AI Extractor Inspector..."

# Check if all required files exist
echo "📁 Checking required files..."

FILES=(
    "manifest.json"
    "popup.js"
    "popup.html"
    "popup.css"
    "contentScript.js"
    "background.js"
)

for file in "${FILES[@]}"; do
    if [ -f "/Users/arog/AI/START/1/bots/elementsExtractor/$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "🔍 Checking for syntax errors..."

# Check JavaScript files for syntax errors using node
echo "Testing popup.js..."
node -c "/Users/arog/AI/START/1/bots/elementsExtractor/popup.js" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ popup.js syntax OK"
else
    echo "❌ popup.js has syntax errors"
fi

echo "Testing contentScript.js..."
node -c "/Users/arog/AI/START/1/bots/elementsExtractor/contentScript.js" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ contentScript.js syntax OK"
else
    echo "❌ contentScript.js has syntax errors"
fi

echo "Testing background.js..."
node -c "/Users/arog/AI/START/1/bots/elementsExtractor/background.js" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✅ background.js syntax OK"
else
    echo "❌ background.js has syntax errors"
fi

echo ""
echo "📋 Checking manifest.json..."
python3 -m json.tool "/Users/arog/AI/START/1/bots/elementsExtractor/manifest.json" > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ manifest.json is valid JSON"
else
    echo "❌ manifest.json has JSON errors"
fi

echo ""
echo "🎯 Test Files Available:"
echo "   - test-connection.html (Basic HTML elements)"
echo "   - test-inspector.html (Complex elements)"
echo ""
echo "🚀 Extension Ready for Testing!"
echo ""
echo "📖 Testing Instructions:"
echo "1. Load the extension in Chrome (chrome://extensions/)"
echo "2. Enable Developer mode"
echo "3. Click 'Load unpacked' and select the elementsExtractor folder"
echo "4. Navigate to file:///Users/arog/AI/START/1/bots/elementsExtractor/test-connection.html"
echo "5. Click the extension icon and test the Inspector"
echo ""
echo "✨ Expected Behavior:"
echo "   - Inspector button should start inspection mode"
echo "   - Hovering over elements should highlight them"
echo "   - Clicking elements should extract and display details"
echo "   - Inspection mode should continue until manually stopped"
echo "   - No connection errors should appear"
