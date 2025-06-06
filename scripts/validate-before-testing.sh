#!/bin/bash

echo "🔍 Pre-Testing Validation for Inspect Element Functionality"
echo "=========================================================="

cd /Users/arog/AI/START/1/bots/elementsExtractor

# 1. Check all required files exist
echo "1. Checking required files..."
required_files=("manifest.json" "popup.html" "popup.js" "popup.css" "contentScript.js" "background.js")
all_files_exist=true

for file in "${required_files[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ $file MISSING"
        all_files_exist=false
    fi
done

if [ "$all_files_exist" = false ]; then
    echo "❌ Missing required files. Cannot proceed with testing."
    exit 1
fi

# 2. Validate JavaScript syntax
echo ""
echo "2. Validating JavaScript syntax..."
js_files=("popup.js" "contentScript.js" "background.js")
syntax_valid=true

for file in "${js_files[@]}"; do
    if node -c "$file" 2>/dev/null; then
        echo "   ✅ $file syntax OK"
    else
        echo "   ❌ $file syntax ERROR"
        syntax_valid=false
    fi
done

if [ "$syntax_valid" = false ]; then
    echo "❌ JavaScript syntax errors found. Fix before testing."
    exit 1
fi

# 3. Check for key Inspect Element functionality
echo ""
echo "3. Checking Inspect Element implementation..."

# Check for inspect button in popup.html
if grep -q "inspectElement" popup.html; then
    echo "   ✅ Inspect Element button found in popup.html"
else
    echo "   ❌ Inspect Element button NOT found in popup.html"
fi

# Check for inspection functionality in popup.js
if grep -q "startInspectingAiExtractor" popup.js; then
    echo "   ✅ Inspection start functionality found in popup.js"
else
    echo "   ❌ Inspection start functionality NOT found in popup.js"
fi

# Check for message handling in contentScript.js
if grep -q "startInspectingAiExtractor" contentScript.js; then
    echo "   ✅ Inspection message handling found in contentScript.js"
else
    echo "   ❌ Inspection message handling NOT found in contentScript.js"
fi

# Check for script protection
if grep -q "aiExtractorLoaded" contentScript.js; then
    echo "   ✅ Script protection implemented"
else
    echo "   ❌ Script protection NOT implemented"
fi

# Check for storage communication
if grep -q "chrome.storage.local" popup.js && grep -q "chrome.storage.local" contentScript.js; then
    echo "   ✅ Storage-based communication implemented"
else
    echo "   ❌ Storage-based communication NOT implemented"
fi

# 4. Check permissions in manifest
echo ""
echo "4. Checking required permissions..."
required_permissions=("scripting" "storage" "activeTab")
permissions_ok=true

for permission in "${required_permissions[@]}"; do
    if grep -q "\"$permission\"" manifest.json; then
        echo "   ✅ $permission permission found"
    else
        echo "   ❌ $permission permission MISSING"
        permissions_ok=false
    fi
done

# 5. Check test page exists
echo ""
echo "5. Checking test page..."
if [ -f "test-inspect-functionality.html" ]; then
    echo "   ✅ Test page exists: test-inspect-functionality.html"
else
    echo "   ⚠️  Test page not found (optional)"
fi

# 6. Final summary
echo ""
echo "=========================================================="
if [ "$all_files_exist" = true ] && [ "$syntax_valid" = true ] && [ "$permissions_ok" = true ]; then
    echo "🎉 PRE-TESTING VALIDATION PASSED!"
    echo ""
    echo "Next steps:"
    echo "1. Load extension in Chrome (chrome://extensions/)"
    echo "2. Open test page: file://$(pwd)/test-inspect-functionality.html"
    echo "3. Follow testing guide: TESTING_GUIDE_INSPECT_ELEMENT.md"
    echo ""
    echo "Key testing points:"
    echo "• Click extension icon → Click 'Inspect Element'"
    echo "• Status should show inspection mode active"
    echo "• Click page elements → Data should appear in popup"
    echo "• Click 'Stop Inspecting' → Should end inspection mode"
    echo "• Test data persistence by closing/reopening popup"
else
    echo "❌ PRE-TESTING VALIDATION FAILED!"
    echo "Fix the issues above before proceeding with testing."
    exit 1
fi
