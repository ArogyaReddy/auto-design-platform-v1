#!/bin/bash

echo "🔍 Element AI Extractor - Connection Diagnosis"
echo "=============================================="

# Check if extension files exist
if [ ! -f "contentScript.js" ] || [ ! -f "popup.js" ] || [ ! -f "manifest.json" ]; then
    echo "❌ Extension files not found in current directory"
    exit 1
fi

echo "✅ Extension files found"

# Check manifest.json for content script configuration
echo ""
echo "📋 Checking manifest.json content script configuration..."
if grep -q "content_scripts" manifest.json; then
    echo "✅ Content scripts section found in manifest"
    grep -A 10 "content_scripts" manifest.json
else
    echo "❌ Content scripts section not found in manifest"
fi

# Check for common syntax issues
echo ""
echo "🧪 Running syntax checks..."

# Check JavaScript syntax
node -c popup.js 2>/dev/null && echo "✅ popup.js: Syntax valid" || echo "❌ popup.js: Syntax error"
node -c contentScript.js 2>/dev/null && echo "✅ contentScript.js: Syntax valid" || echo "❌ contentScript.js: Syntax error"
node -c background.js 2>/dev/null && echo "✅ background.js: Syntax valid" || echo "❌ background.js: Syntax error"

# Check for specific patterns that might cause connection issues
echo ""
echo "🔍 Checking for potential connection issues..."

# Check if content script has message listener
if grep -q "chrome.runtime.onMessage.addListener" contentScript.js; then
    echo "✅ Message listener found in content script"
else
    echo "❌ Message listener not found in content script"
fi

# Check if popup sends messages
if grep -q "chrome.tabs.sendMessage" popup.js; then
    echo "✅ Message sending found in popup"
else
    echo "❌ Message sending not found in popup"
fi

# Check for return true in message listeners
if grep -A 5 "chrome.runtime.onMessage.addListener" contentScript.js | grep -q "return true"; then
    echo "✅ Content script message listener returns true"
else
    echo "⚠️  Content script message listener might not return true"
fi

# Check for script loading protection
if grep -q "aiExtractorLoaded" contentScript.js; then
    echo "✅ Script loading protection found"
else
    echo "⚠️  No script loading protection found"
fi

echo ""
echo "📝 Diagnosis Summary:"
echo "===================="
echo ""
echo "Common causes of 'Could not establish connection' errors:"
echo "1. Content script not injected properly"
echo "2. Message listener not returning true for async responses"
echo "3. Script loading multiple times causing conflicts"
echo "4. Timing issues with script initialization"
echo ""
echo "💡 Recommended next steps:"
echo "1. Load extension in Chrome with Developer Mode"
echo "2. Go to chrome://extensions/"
echo "3. Check for any error messages"
echo "4. Open a test page and check DevTools Console"
echo "5. Look for content script loading messages"
echo "6. Test the ping functionality"
echo ""
echo "🌐 Opening test page for manual testing..."

# Open test page if available
if [ -f "test-connection.html" ]; then
    if command -v open >/dev/null 2>&1; then
        open "test-connection.html"
    elif command -v xdg-open >/dev/null 2>&1; then
        xdg-open "test-connection.html"
    else
        echo "📁 Manual: Open test-connection.html in your browser"
    fi
else
    echo "⚠️  test-connection.html not found"
fi

echo ""
echo "🎯 Connection diagnosis complete!"
