#!/bin/bash

# Shadow DOM Application Validation Script
# This script validates the complete Shadow DOM test application

echo "🧪 Shadow DOM Application Validation Script"
echo "==========================================="

# Check if all required files exist
echo "📁 Checking file structure..."

required_files=(
    "index.html"
    "styles.css"
    "app.js"
    "test-runner.html"
    "test-automation.js"
    "browser-test.html"
    "README.md"
    "components/base-component.js"
    "components/header-nav.js"
    "components/complex-form-widget.js"
    "components/dashboard-widget.js"
    "components/user-profile-card.js"
    "components/modal-container.js"
    "components/data-table-widget.js"
    "components/chat-widget.js"
    "components/notification-system.js"
    "components/media-gallery.js"
    "components/shopping-cart.js"
)

missing_files=()
for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        missing_files+=("$file")
    fi
done

if [[ ${#missing_files[@]} -eq 0 ]]; then
    echo "✅ All required files are present"
else
    echo "❌ Missing files:"
    for file in "${missing_files[@]}"; do
        echo "   - $file"
    done
fi

# Check for JavaScript syntax errors
echo ""
echo "🔍 Checking JavaScript syntax..."

js_files=(
    "app.js"
    "test-automation.js"
    "components/base-component.js"
    "components/header-nav.js"
    "components/complex-form-widget.js"
    "components/dashboard-widget.js"
    "components/user-profile-card.js"
    "components/modal-container.js"
    "components/data-table-widget.js"
    "components/chat-widget.js"
    "components/notification-system.js"
    "components/media-gallery.js"
    "components/shopping-cart.js"
)

syntax_errors=()
for file in "${js_files[@]}"; do
    if [[ -f "$file" ]]; then
        # Check for basic syntax issues
        if node -c "$file" 2>/dev/null; then
            echo "✅ $file - Syntax OK"
        else
            echo "❌ $file - Syntax Error"
            syntax_errors+=("$file")
        fi
    fi
done

# Check HTML structure
echo ""
echo "📄 Checking HTML structure..."

html_files=(
    "index.html"
    "test-runner.html"
    "browser-test.html"
)

for file in "${html_files[@]}"; do
    if [[ -f "$file" ]]; then
        # Check for basic HTML structure
        if grep -q "<!DOCTYPE html>" "$file" && grep -q "<html" "$file" && grep -q "</html>" "$file"; then
            echo "✅ $file - HTML structure OK"
        else
            echo "❌ $file - HTML structure issues"
        fi
    fi
done

# Check for CSS
echo ""
echo "🎨 Checking CSS..."

if [[ -f "styles.css" ]]; then
    css_lines=$(wc -l < "styles.css")
    echo "✅ styles.css - $css_lines lines of CSS"
else
    echo "❌ styles.css not found"
fi

# Component analysis
echo ""
echo "🧩 Component Analysis..."

component_count=$(ls components/*.js 2>/dev/null | wc -l)
echo "📊 Total components: $component_count"

if [[ $component_count -ge 10 ]]; then
    echo "✅ Sufficient components for comprehensive testing"
else
    echo "⚠️  Consider adding more components for thorough testing"
fi

# Check for Shadow DOM usage
echo ""
echo "🌑 Shadow DOM Usage Analysis..."

shadow_dom_files=()
for file in components/*.js; do
    if [[ -f "$file" ]] && grep -q "attachShadow\|createShadowRoot" "$file"; then
        shadow_dom_files+=("$file")
    fi
done

echo "📊 Files using Shadow DOM: ${#shadow_dom_files[@]}"
for file in "${shadow_dom_files[@]}"; do
    echo "   - $file"
done

# Check for test identifiers
echo ""
echo "🎯 Test Identifier Analysis..."

test_id_patterns=(
    "data-testid"
    "test-id"
    "data-automation-id"
    "data-qa"
    "data-test-name"
)

for pattern in "${test_id_patterns[@]}"; do
    count=$(grep -r "$pattern" components/ 2>/dev/null | wc -l)
    echo "📊 $pattern usage: $count occurrences"
done

# Performance considerations
echo ""
echo "⚡ Performance Considerations..."

total_js_size=$(find . -name "*.js" -exec wc -c {} + | tail -1 | awk '{print $1}')
total_css_size=$(find . -name "*.css" -exec wc -c {} + | tail -1 | awk '{print $1}')
total_html_size=$(find . -name "*.html" -exec wc -c {} + | tail -1 | awk '{print $1}')

echo "📊 Total JavaScript size: $total_js_size bytes"
echo "📊 Total CSS size: $total_css_size bytes"
echo "📊 Total HTML size: $total_html_size bytes"

# Accessibility checks
echo ""
echo "♿ Accessibility Analysis..."

accessibility_attributes=(
    "aria-label"
    "aria-labelledby"
    "aria-describedby"
    "role"
    "alt"
    "title"
)

for attr in "${accessibility_attributes[@]}"; do
    count=$(grep -r "$attr" . 2>/dev/null | wc -l)
    echo "📊 $attr usage: $count occurrences"
done

# Final summary
echo ""
echo "📋 Validation Summary"
echo "===================="

if [[ ${#missing_files[@]} -eq 0 && ${#syntax_errors[@]} -eq 0 ]]; then
    echo "✅ All validations passed successfully!"
    echo "🚀 The Shadow DOM application is ready for testing with the Element AI Extractor extension."
else
    echo "⚠️  Some issues were found:"
    if [[ ${#missing_files[@]} -gt 0 ]]; then
        echo "   - Missing files: ${#missing_files[@]}"
    fi
    if [[ ${#syntax_errors[@]} -gt 0 ]]; then
        echo "   - JavaScript syntax errors: ${#syntax_errors[@]}"
    fi
fi

echo ""
echo "🔧 Testing Instructions:"
echo "1. Open browser-test.html in your browser"
echo "2. Click 'Load Main App' to test the main application"
echo "3. Click 'Load Test Runner' to access testing utilities"
echo "4. Use the Element AI Extractor extension to test extraction"
echo "5. Export results using the 'Export Results' button"

echo ""
echo "🌐 Available Test URLs:"
echo "   - Main App: file://$(pwd)/index.html"
echo "   - Test Runner: file://$(pwd)/test-runner.html"
echo "   - Browser Test: file://$(pwd)/browser-test.html"

echo ""
echo "🎯 Key Testing Scenarios:"
echo "   - Deep Shadow DOM nesting (up to 4 levels)"
echo "   - Complex form interactions"
echo "   - Modal and popup handling"
echo "   - Dynamic content updates"
echo "   - E-commerce workflows"
echo "   - Chat and messaging features"
echo "   - Media gallery interactions"
echo "   - Notification system"

echo ""
echo "Validation completed at $(date)"
