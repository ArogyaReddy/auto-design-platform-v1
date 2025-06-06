#!/bin/bash
# Debug script to verify extension fixes

echo "🔍 Debug Script: Verifying Extension Fixes"
echo "=========================================="

echo "1. Checking if fixes are applied in popup.js files..."

# Check main popup.js
echo "   📁 Checking /bots/elementsExtractor/popup.js"
if grep -q "filter(cls => !cls.startsWith('ai-extractor-'))" /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor/popup.js; then
    echo "   ✅ Fix found in main popup.js"
else
    echo "   ❌ Fix NOT found in main popup.js"
fi

# Check V1 popup.js
echo "   📁 Checking /bots/elementsExtractorV1/popup.js"
if grep -q "filter(cls => !cls.startsWith('ai-extractor-'))" /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractorV1/popup.js; then
    echo "   ✅ Fix found in V1 popup.js"
else
    echo "   ❌ Fix NOT found in V1 popup.js"
fi

# Check contentScript.js
echo "   📁 Checking /bots/elementsExtractor/contentScript.js"
if grep -q "!c.startsWith('ai-extractor-')" /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor/contentScript.js; then
    echo "   ✅ Fix found in contentScript.js"
else
    echo "   ❌ Fix NOT found in contentScript.js"
fi

echo ""
echo "2. Extension version information:"
echo "   Main extension version: $(grep '"version"' /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor/manifest.json | head -1)"
echo "   V1 extension version: $(grep '"version"' /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractorV1/manifest.json | head -1)"

echo ""
echo "3. Next steps to verify the fix:"
echo "   🔄 Reload the Chrome extension in chrome://extensions/"
echo "   🌐 Navigate to the test page (e.g., Sauce Demo)"
echo "   🔍 Use the extension to highlight the 'Accepted usernames are:' element"
echo "   📊 Check browser console for debug logs showing class filtering"
echo "   ✅ Verify the generated CSS selector does NOT include '.ai-extractor-highlight'"

echo ""
echo "4. Manual test instructions:"
echo "   - Open Chrome Developer Tools (F12)"
echo "   - Go to Console tab"
echo "   - Use the extension to extract elements"
echo "   - Look for debug messages like:"
echo "     'DEBUG: Original classes: [\"some-class\", \"ai-extractor-highlight\"]'"
echo "     'DEBUG: Filtered classes: [\"some-class\"]'"

echo ""
echo "🎯 Expected behavior: CSS selectors should be 'div[id=\"login_credentials\"] h4'"
echo "    NOT 'div#login_credentials > h4.ai-extractor-highlight'"
