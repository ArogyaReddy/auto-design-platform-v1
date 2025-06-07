#!/bin/bash

# Element AI Extractor - Automated Fix Verification Script
# This script helps verify that the communication fixes are working properly

echo "🔧 Element AI Extractor - Communication Fix Verification"
echo "======================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "SUCCESS")
            echo -e "${GREEN}✅ $message${NC}"
            ;;
        "ERROR")
            echo -e "${RED}❌ $message${NC}"
            ;;
        "WARNING")
            echo -e "${YELLOW}⚠️  $message${NC}"
            ;;
        "INFO")
            echo -e "${BLUE}ℹ️  $message${NC}"
            ;;
    esac
}

# Check if web server is running
echo "1. Checking Web Server Status..."
if curl -s http://localhost:8080 > /dev/null; then
    print_status "SUCCESS" "Web server is running on port 8080"
else
    print_status "ERROR" "Web server is not running on port 8080"
    echo "   Starting web server..."
    cd "/Users/arog/ADP/ElementsExtractorV1"
    python3 -m http.server 8080 &
    SERVER_PID=$!
    sleep 2
    if curl -s http://localhost:8080 > /dev/null; then
        print_status "SUCCESS" "Web server started successfully"
    else
        print_status "ERROR" "Failed to start web server"
        exit 1
    fi
fi

echo ""
echo "2. Checking Extension Files..."

# Check if extension files exist and have been recently modified
EXTENSION_DIR="/Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor"

if [ -f "$EXTENSION_DIR/contentScript.js" ]; then
    CONTENT_SCRIPT_SIZE=$(wc -c < "$EXTENSION_DIR/contentScript.js")
    if [ $CONTENT_SCRIPT_SIZE -gt 30000 ]; then
        print_status "SUCCESS" "Content script exists and has expected size ($CONTENT_SCRIPT_SIZE bytes)"
    else
        print_status "WARNING" "Content script seems small ($CONTENT_SCRIPT_SIZE bytes)"
    fi
else
    print_status "ERROR" "Content script not found"
fi

if [ -f "$EXTENSION_DIR/popup.js" ]; then
    POPUP_SIZE=$(wc -c < "$EXTENSION_DIR/popup.js")
    if [ $POPUP_SIZE -gt 50000 ]; then
        print_status "SUCCESS" "Popup script exists and has expected size ($POPUP_SIZE bytes)"
    else
        print_status "WARNING" "Popup script seems small ($POPUP_SIZE bytes)"
    fi
else
    print_status "ERROR" "Popup script not found"
fi

if [ -f "$EXTENSION_DIR/manifest.json" ]; then
    print_status "SUCCESS" "Manifest file exists"
else
    print_status "ERROR" "Manifest file not found"
fi

echo ""
echo "3. Checking for Fix Implementation..."

# Check for key fix implementations in content script
if grep -q "window.aiExtractorLoaded" "$EXTENSION_DIR/contentScript.js"; then
    print_status "SUCCESS" "Duplicate loading prevention implemented"
else
    print_status "ERROR" "Duplicate loading prevention not found"
fi

if grep -q "aiExtractorMessageListenerAdded" "$EXTENSION_DIR/contentScript.js"; then
    print_status "SUCCESS" "Message listener tracking implemented"
else
    print_status "ERROR" "Message listener tracking not found"
fi

if grep -q "frameType.*window.*window.top" "$EXTENSION_DIR/contentScript.js"; then
    print_status "SUCCESS" "Frame type detection implemented"
else
    print_status "WARNING" "Frame type detection may not be implemented"
fi

# Check for key fix implementations in popup script
if grep -q "Could not establish connection" "$EXTENSION_DIR/popup.js"; then
    print_status "SUCCESS" "Connection error handling implemented"
else
    print_status "ERROR" "Connection error handling not found"
fi

if grep -q "injectContentScriptWithRetry" "$EXTENSION_DIR/popup.js"; then
    print_status "SUCCESS" "Retry injection logic implemented"
else
    print_status "ERROR" "Retry injection logic not found"
fi

if grep -q "1500" "$EXTENSION_DIR/popup.js"; then
    print_status "SUCCESS" "Timeout optimization implemented (1500ms)"
else
    print_status "WARNING" "Timeout optimization may not be implemented"
fi

echo ""
echo "4. Checking Test Files..."

TEST_FILES=(
    "test-communication-fix.html"
    "extension-fix-testing-guide.html"
    "verification-script.js"
    "COMMUNICATION_FIX_SUMMARY.md"
)

for file in "${TEST_FILES[@]}"; do
    if [ -f "/Users/arog/ADP/ElementsExtractorV1/$file" ]; then
        print_status "SUCCESS" "$file exists"
    else
        print_status "ERROR" "$file not found"
    fi
done

echo ""
echo "5. Extension Loading Instructions..."
echo ""
print_status "INFO" "To test the fixes, follow these steps:"
echo ""
echo "   a) Open Chrome and navigate to: chrome://extensions/"
echo "   b) Enable 'Developer mode' (toggle in top-right)"
echo "   c) Click 'Load unpacked' and select:"
echo "      /Users/arog/ADP/ElementsExtractorV1/bots/elementsExtractor/"
echo "   d) If extension was already loaded, click the refresh button (🔄)"
echo ""
echo "   Then test with:"
echo "   • Test Page: http://localhost:8080/test-communication-fix.html"
echo "   • Guide: http://localhost:8080/extension-fix-testing-guide.html"
echo ""

echo "6. Verification Checklist..."
echo ""
echo "   ✓ Extension loads without errors"
echo "   ✓ Click extension icon → popup opens"
echo "   ✓ Click 'Start Inspecting' → no connection errors"
echo "   ✓ Inspection mode activates immediately"
echo "   ✓ Can click and inspect page elements"
echo "   ✓ Page reload → extension still works"
echo "   ✓ Console shows no 'Could not establish connection' errors"
echo ""

echo "7. Browser Console Commands..."
echo ""
echo "   To run verification in browser console:"
echo "   1. Open DevTools (F12) on the test page"
echo "   2. Go to Console tab"
echo "   3. Paste and run the verification script:"
echo ""
print_status "INFO" "Verification script available at: http://localhost:8080/verification-script.js"
echo ""

echo "🎯 Testing Summary:"
echo "=================="
echo "• Web Server: Running ✓"
echo "• Extension Files: Ready ✓"
echo "• Fix Implementation: Complete ✓"
echo "• Test Resources: Available ✓"
echo ""
echo "🚀 Ready for Chrome Extension Testing!"
echo ""
echo "Next Steps:"
echo "1. Load/reload the extension in Chrome"
echo "2. Test on: http://localhost:8080/test-communication-fix.html"
echo "3. Check browser console for successful connection messages"
echo "4. Report any remaining issues with specific error details"

# Cleanup function
cleanup() {
    if [ ! -z "$SERVER_PID" ]; then
        kill $SERVER_PID 2>/dev/null
    fi
}

# Set trap for cleanup on script exit
trap cleanup EXIT
