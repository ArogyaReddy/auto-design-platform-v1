#!/bin/bash

# Element AI Extractor - Connection Fix Verification Script
# This script helps verify that the connection issue has been resolved

echo "🔍 Element AI Extractor - Connection Fix Verification"
echo "===================================================="
echo ""

# Change to the extension directory
cd /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor

echo "📁 Working directory: $(pwd)"
echo ""

echo "🔧 Checking file syntax..."
echo "----------------------------"

# Check JavaScript syntax
echo "Checking contentScript.js syntax:"
if node -c contentScript.js 2>/dev/null; then
    echo "✅ contentScript.js: Syntax valid"
else
    echo "❌ contentScript.js: Syntax error"
fi

echo "Checking popup.js syntax:"
if node -c popup.js 2>/dev/null; then
    echo "✅ popup.js: Syntax valid"
else
    echo "❌ popup.js: Syntax error"
fi

echo "Checking background.js syntax:"
if node -c background.js 2>/dev/null; then
    echo "✅ background.js: Syntax valid"
else
    echo "❌ background.js: Syntax error"
fi

echo ""
echo "🔍 Checking for potential connection issues..."
echo "----------------------------------------------"

# Check for critical patterns in content script
echo "Content Script Analysis:"

if grep -q "chrome.runtime.onMessage.addListener" contentScript.js; then
    count=$(grep -c "chrome.runtime.onMessage.addListener" contentScript.js)
    if [ $count -eq 1 ]; then
        echo "✅ Single message listener found (good)"
    else
        echo "⚠️  Multiple message listeners found: $count (potential conflict)"
    fi
else
    echo "❌ No message listener found"
fi

if grep -A 10 "chrome.runtime.onMessage.addListener" contentScript.js | grep -q "return true"; then
    echo "✅ Message listener returns true (keeps channel open)"
else
    echo "⚠️  Message listener might not return true"
fi

if grep -q "window.aiExtractorLoaded" contentScript.js; then
    echo "✅ Duplicate loading protection found"
else
    echo "⚠️  No duplicate loading protection"
fi

echo ""
echo "Popup Script Analysis:"

if grep -q "chrome.tabs.sendMessage" popup.js; then
    echo "✅ Message sending found in popup"
else
    echo "❌ No message sending found in popup"
fi

if grep -q "injectContentScriptWithRetry" popup.js; then
    echo "✅ Retry injection mechanism found"
else
    echo "⚠️  No retry injection mechanism"
fi

if grep -q "ping" popup.js; then
    echo "✅ Ping mechanism found"
else
    echo "⚠️  No ping mechanism found"
fi

echo ""
echo "📊 File Statistics:"
echo "-------------------"
echo "contentScript.js: $(wc -l < contentScript.js) lines"
echo "popup.js: $(wc -l < popup.js) lines"
echo "background.js: $(wc -l < background.js) lines"

echo ""
echo "🧪 Testing Recommendations:"
echo "----------------------------"
echo "1. Load the extension in Chrome (chrome://extensions/)"
echo "2. Open test-connection-fix.html"
echo "3. Check console for any errors"
echo "4. Test the Element AI Extractor popup"
echo "5. Try inspection mode on test elements"

echo ""
echo "🚀 Connection Fix Summary:"
echo "--------------------------"
echo "✅ Removed duplicate message listeners"
echo "✅ Simplified content script initialization"
echo "✅ Enhanced ping response mechanism"
echo "✅ Improved error handling and logging"
echo "✅ Maintained retry injection logic"

echo ""
echo "If you still see connection errors:"
echo "1. Check Chrome Developer Tools console"
echo "2. Verify extension is loaded and active"
echo "3. Ensure you're testing on non-restricted pages"
echo "4. Check that the extension has proper permissions"

echo ""
echo "🎉 Verification complete!"
