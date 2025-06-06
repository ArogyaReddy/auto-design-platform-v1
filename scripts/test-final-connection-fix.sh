#!/bin/bash

echo "🧪 Element AI Extractor - Final Connection Fix Test"
echo "=================================================="

# Check all JavaScript files for syntax errors
echo "1. Checking JavaScript syntax..."
echo "   - popup.js"
node -c popup.js
if [ $? -eq 0 ]; then
    echo "     ✅ popup.js syntax OK"
else
    echo "     ❌ popup.js syntax ERROR"
    exit 1
fi

echo "   - contentScript.js"
node -c contentScript.js
if [ $? -eq 0 ]; then
    echo "     ✅ contentScript.js syntax OK"
else
    echo "     ❌ contentScript.js syntax ERROR"
    exit 1
fi

echo "   - background.js"
node -c background.js
if [ $? -eq 0 ]; then
    echo "     ✅ background.js syntax OK"
else
    echo "     ❌ background.js syntax ERROR"
    exit 1
fi

# Validate manifest.json
echo "2. Checking manifest.json..."
python3 -m json.tool manifest.json > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "     ✅ manifest.json is valid JSON"
else
    echo "     ❌ manifest.json is invalid JSON"
    exit 1
fi

# Check for required permissions
echo "3. Checking required permissions in manifest..."
if grep -q "scripting" manifest.json && grep -q "storage" manifest.json && grep -q "activeTab" manifest.json; then
    echo "     ✅ All required permissions present"
else
    echo "     ❌ Missing required permissions"
    exit 1
fi

# Check for script protection in contentScript.js
echo "4. Checking script protection..."
if grep -q "window.aiExtractorLoaded" contentScript.js; then
    echo "     ✅ Script protection implemented"
else
    echo "     ❌ Script protection missing"
    exit 1
fi

# Check for storage-based communication
echo "5. Checking storage-based communication..."
if grep -q "chrome.storage.local" contentScript.js && grep -q "chrome.storage.local" popup.js; then
    echo "     ✅ Storage-based communication implemented"
else
    echo "     ❌ Storage-based communication missing"
    exit 1
fi

# Check for timeout mechanisms
echo "6. Checking timeout mechanisms..."
if grep -q "setTimeout.*ping" popup.js; then
    echo "     ✅ Ping timeout mechanisms implemented"
else
    echo "     ❌ Ping timeout mechanisms missing"
    exit 1
fi

# Check for retry logic
echo "7. Checking retry logic..."
if grep -q "injectContentScriptWithRetry" popup.js; then
    echo "     ✅ Injection retry logic implemented"
else
    echo "     ❌ Injection retry logic missing"
    exit 1
fi

echo ""
echo "🎉 All checks passed! The extension should now work without connection errors."
echo ""
echo "Manual testing steps:"
echo "1. Load the extension in Chrome (chrome://extensions/)"
echo "2. Navigate to any webpage (not chrome:// or extension pages)"
echo "3. Click the extension icon to open popup"
echo "4. Click 'Inspect Element' button"
echo "5. Verify inspection mode starts without connection errors"
echo "6. Click on page elements to test extraction"
echo "7. Click 'Stop Inspecting' to end inspection mode"
echo ""
echo "Expected behavior:"
echo "- No 'Could not establish connection' errors"
echo "- Inspection mode starts reliably"
echo "- Element data displays in popup"
echo "- Stop button works correctly"
