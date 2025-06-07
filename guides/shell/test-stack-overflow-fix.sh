#!/bin/bash

# Test script to verify the stack overflow fix
echo "🔧 Testing Element AI Extractor Stack Overflow Fix"
echo "================================================="

# Check if the fix is applied in the code
echo "✅ Checking if the fix is applied..."

# Search for the problematic dispatchEvent code
if grep -q "e.target.dispatchEvent(event)" /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor/contentScript.js; then
    echo "❌ ERROR: Still found problematic dispatchEvent code!"
    echo "   The recursive event dispatching code is still present."
else
    echo "✅ SUCCESS: No problematic dispatchEvent code found"
fi

# Check if the direct function calls are present
if grep -q "copyToClipboard(textToCopy)" /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor/contentScript.js; then
    echo "✅ SUCCESS: Direct copy function call found"
else
    echo "❌ WARNING: Direct copy function call not found"
fi

if grep -q "highlightElement(lastClickedElement)" /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor/contentScript.js; then
    echo "✅ SUCCESS: Direct highlight function call found"
else
    echo "❌ WARNING: Direct highlight function call not found"
fi

echo ""
echo "🧪 Test Instructions:"
echo "1. Reload the extension in chrome://extensions"
echo "2. Open test-stack-overflow-fix.html"
echo "3. Start inspection and click elements"
echo "4. Click Copy/Highlight buttons - should work without errors"
echo ""
echo "If no stack overflow errors appear in console, the fix is successful! ✅"
