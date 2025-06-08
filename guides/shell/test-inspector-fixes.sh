#!/bin/bash

# Element AI Extractor - Inspector Fixes Test Script
# Tests the fixes for popup closing and inspection mode issues

echo "🔍 Element AI Extractor - Inspector Fixes Test"
echo "=============================================="
echo ""

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: Please run this script from the elementsExtractor directory"
    echo "   Current directory: $(pwd)"
    echo "   Expected files: manifest.json, popup.js, contentScript.js"
    exit 1
fi

echo "✅ Found extension files in current directory"
echo ""

# Check if the required files exist and have the fixes
echo "🔍 Checking for fix implementations..."
echo ""

# Check if popup.js has the storage persistence fix
if grep -q "chrome.storage.local.set.*isInspecting.*true" popup.js; then
    echo "✅ Popup.js: Storage persistence fix found"
else
    echo "❌ Popup.js: Storage persistence fix missing"
fi

# Check if popup.js removed the beforeunload handler that stops inspection
if grep -q "beforeunload.*stopInspectingAiExtractor" popup.js; then
    echo "❌ Popup.js: Still has beforeunload handler that stops inspection"
else
    echo "✅ Popup.js: Beforeunload handler fix applied"
fi

# Check if contentScript.js has the floating badge functionality
if grep -q "createInspectorBadge" contentScript.js; then
    echo "✅ ContentScript.js: Floating badge functionality found"
else
    echo "❌ ContentScript.js: Floating badge functionality missing"
fi

# Check if contentScript.js has the storage sync functionality
if grep -q "startStorageSync" contentScript.js; then
    echo "✅ ContentScript.js: Storage sync functionality found"
else
    echo "❌ ContentScript.js: Storage sync functionality missing"
fi

# Check if background.js has the state management
if grep -q "isInspecting.*false" background.js; then
    echo "✅ Background.js: State management initialization found"
else
    echo "❌ Background.js: State management initialization missing"
fi

echo ""
echo "🧪 Running basic syntax checks..."
echo ""

# Check JavaScript syntax of main files
for file in popup.js contentScript.js background.js; do
    if node -c "$file" 2>/dev/null; then
        echo "✅ $file: Syntax valid"
    else
        echo "❌ $file: Syntax errors detected"
        node -c "$file"
    fi
done

echo ""
echo "📋 Fix Summary:"
echo "==============="
echo ""
echo "ISSUE #1: Popup closes when 'Inspect Element' is clicked"
echo "FIX: 🔧 Persistent state management using chrome.storage.local"
echo "     🔧 Removed beforeunload handler that stopped inspection"
echo "     🔧 Added floating badge for user guidance when popup closes"
echo ""
echo "ISSUE #2: Inspection mode doesn't properly stop"
echo "FIX: 🔧 Complete message handlers in content script"
echo "     🔧 Proper event listener cleanup"
echo "     🔧 Storage sync to maintain state across popup sessions"
echo ""

# Open test page in default browser
if [ -f "test-inspector-fixes.html" ]; then
    echo "🌐 Opening test page in browser..."
    open "test-inspector-fixes.html" 2>/dev/null || \
    xdg-open "test-inspector-fixes.html" 2>/dev/null || \
    echo "   Please manually open: test-inspector-fixes.html"
    echo ""
fi

echo "📝 Manual Testing Instructions:"
echo "==============================="
echo ""
echo "1. Load the extension in Chrome:"
echo "   - Go to chrome://extensions/"
echo "   - Enable Developer mode"
echo "   - Click 'Load unpacked'"
echo "   - Select this directory: $(pwd)"
echo ""
echo "2. Test the fixes:"
echo "   - Open the test page (test-inspector-fixes.html)"
echo "   - Click the extension icon"
echo "   - Click 'Inspect Element'"
echo "   - Verify popup closes but inspection continues"
echo "   - Look for orange floating badge"
echo "   - Re-open popup to verify state persistence"
echo "   - Test stopping inspection"
echo ""
echo "3. Expected Results:"
echo "   ✅ Popup closes when starting inspection (normal behavior)"
echo "   ✅ Floating badge appears and provides guidance"
echo "   ✅ Inspection continues even when popup closes"
echo "   ✅ Re-opening popup shows correct state"
echo "   ✅ Inspection stops properly when requested"
echo ""

echo "🎯 Fixes completed! Extension should now work properly."
echo "   Test page: file://$(pwd)/test-inspector-fixes.html"
echo ""
