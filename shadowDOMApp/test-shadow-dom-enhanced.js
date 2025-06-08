// Test Script for Enhanced Shadow DOM Implementation
// This script validates the Shadow DOM enhancement in Element AI Extractor

console.log('🧪 Starting Enhanced Shadow DOM Test Suite');

// Test 1: Check if enhanced Shadow DOM functions exist
function testShadowDOMFunctions() {
    console.log('\n📋 Test 1: Checking Shadow DOM Function Availability');
    
    // Check if contentScript functions are available
    if (typeof isInShadowDOM === 'function') {
        console.log('✅ isInShadowDOM function is available');
    } else {
        console.log('❌ isInShadowDOM function is NOT available');
    }
    
    if (typeof getShadowHostPath === 'function') {
        console.log('✅ getShadowHostPath function is available');
    } else {
        console.log('❌ getShadowHostPath function is NOT available');
    }
}

// Test 2: Find Shadow DOM elements in the current page
function testShadowDOMDetection() {
    console.log('\n🔍 Test 2: Shadow DOM Element Detection');
    
    // Look for shadow hosts
    const shadowHosts = [];
    const allElements = document.querySelectorAll('*');
    
    allElements.forEach(el => {
        if (el.shadowRoot) {
            shadowHosts.push({
                element: el,
                id: el.id || 'no-id',
                tagName: el.tagName,
                shadowMode: el.shadowRoot.mode
            });
        }
    });
    
    console.log(`📊 Found ${shadowHosts.length} shadow hosts:`);
    shadowHosts.forEach((host, index) => {
        console.log(`  ${index + 1}. ${host.tagName}#${host.id} (${host.shadowMode} mode)`);
        
        // Check for nested shadow DOMs
        const shadowElements = host.element.shadowRoot.querySelectorAll('*');
        const nestedShadowHosts = [];
        
        shadowElements.forEach(el => {
            if (el.shadowRoot) {
                nestedShadowHosts.push(el);
            }
        });
        
        if (nestedShadowHosts.length > 0) {
            console.log(`    └─ Contains ${nestedShadowHosts.length} nested shadow host(s)`);
        }
    });
    
    return shadowHosts;
}

// Test 3: Test shadow DOM element extraction
function testShadowDOMExtraction() {
    console.log('\n⚡ Test 3: Shadow DOM Element Extraction');
    
    let shadowElementsFound = 0;
    
    // Recursive function to traverse shadow DOMs
    function traverseShadowDOM(root, level = 0) {
        const indent = '  '.repeat(level);
        const elements = root.querySelectorAll('*');
        
        elements.forEach(el => {
            shadowElementsFound++;
            console.log(`${indent}└─ ${el.tagName}${el.id ? '#' + el.id : ''}${el.className ? '.' + el.className.split(' ').join('.') : ''}`);
            
            // Check for nested shadow roots
            if (el.shadowRoot) {
                console.log(`${indent}   ├─ [Shadow Root - ${el.shadowRoot.mode}]`);
                traverseShadowDOM(el.shadowRoot, level + 1);
            }
        });
    }
    
    // Find all shadow hosts and traverse their shadow DOMs
    const allElements = document.querySelectorAll('*');
    allElements.forEach(el => {
        if (el.shadowRoot) {
            console.log(`🌳 Shadow DOM Tree from ${el.tagName}#${el.id}:`);
            traverseShadowDOM(el.shadowRoot, 1);
        }
    });
    
    console.log(`📊 Total shadow DOM elements found: ${shadowElementsFound}`);
    return shadowElementsFound;
}

// Test 4: Test enhanced locator generation with shadow context
function testShadowDOMLocators() {
    console.log('\n🎯 Test 4: Shadow DOM Locator Generation');
    
    function testElementInShadow(element, hostPath) {
        if (!element) return;
        
        const elementInfo = {
            tagName: element.tagName,
            id: element.id || 'no-id',
            className: element.className || 'no-class',
            textContent: (element.textContent || '').trim().substring(0, 30),
            hostPath: hostPath
        };
        
        console.log(`🔹 Element: ${elementInfo.tagName}#${elementInfo.id}`);
        console.log(`   Text: "${elementInfo.textContent}"`);
        console.log(`   Host Path: ${elementInfo.hostPath || 'Not in shadow'}`);
        
        // Test CSS selector generation
        try {
            const cssPath = generateCSSSelector ? generateCSSSelector(element) : 'CSS function not available';
            console.log(`   CSS: ${cssPath}`);
        } catch (e) {
            console.log(`   CSS: Error - ${e.message}`);
        }
        
        // Test XPath generation
        try {
            const xpathValue = generateXPath ? generateXPath(element) : 'XPath function not available';
            console.log(`   XPath: ${xpathValue}`);
        } catch (e) {
            console.log(`   XPath: Error - ${e.message}`);
        }
        
        console.log(''); // Empty line for readability
    }
    
    // Test elements in different shadow DOM levels
    const shadowHost = document.getElementById('shadow-host');
    if (shadowHost && shadowHost.shadowRoot) {
        console.log('🎯 Testing L0 Shadow DOM elements:');
        const l0Elements = shadowHost.shadowRoot.querySelectorAll('input, button, select');
        l0Elements.forEach(el => testElementInShadow(el, '#shadow-host'));
        
        // Look for nested shadow DOM (L1)
        const nestedHost = shadowHost.shadowRoot.querySelector('[id*="nested-shadow-host"]');
        if (nestedHost && nestedHost.shadowRoot) {
            console.log('🎯 Testing L1 Shadow DOM elements:');
            const l1Elements = nestedHost.shadowRoot.querySelectorAll('input, button');
            l1Elements.forEach(el => testElementInShadow(el, '#shadow-host >> #nested-shadow-host-L1-actual'));
        }
    }
}

// Test 5: Test the full extraction workflow
function testFullExtractionWorkflow() {
    console.log('\n🚀 Test 5: Full Extraction Workflow Test');
    
    // Create a test extraction similar to what the extension would do
    const testFilters = {
        selectedTypes: ['filterAll'],
        shadowDOM: true,
        limit: 50
    };
    
    console.log('📋 Simulating element extraction with filters:', testFilters);
    
    // Count elements in main DOM
    const mainElements = document.querySelectorAll('*').length;
    console.log(`📊 Main DOM elements: ${mainElements}`);
    
    // Count elements in shadow DOMs
    let shadowElements = 0;
    const allElements = document.querySelectorAll('*');
    
    function countShadowElements(root) {
        const elements = root.querySelectorAll('*');
        shadowElements += elements.length;
        
        elements.forEach(el => {
            if (el.shadowRoot) {
                countShadowElements(el.shadowRoot);
            }
        });
    }
    
    allElements.forEach(el => {
        if (el.shadowRoot) {
            countShadowElements(el.shadowRoot);
        }
    });
    
    console.log(`📊 Shadow DOM elements: ${shadowElements}`);
    console.log(`📊 Total elements available: ${mainElements + shadowElements}`);
    
    // Test element details extraction
    console.log('\n🔍 Testing getElementDetails for shadow elements:');
    const shadowHost = document.getElementById('shadow-host');
    if (shadowHost && shadowHost.shadowRoot) {
        const shadowInput = shadowHost.shadowRoot.getElementById('shadow-input-L0');
        if (shadowInput) {
            console.log('📝 Testing element details extraction:');
            if (typeof getElementDetails === 'function') {
                try {
                    const details = getElementDetails(shadowInput);
                    console.log('✅ Element details extracted successfully:');
                    Object.entries(details || {}).forEach(([key, value]) => {
                        console.log(`   ${key}: ${value}`);
                    });
                } catch (e) {
                    console.log('❌ Error extracting element details:', e.message);
                }
            } else {
                console.log('❌ getElementDetails function not available');
            }
        }
    }
}

// Test 6: Test inspector functionality with shadow elements
function testInspectorWithShadowDOM() {
    console.log('\n🔬 Test 6: Inspector Functionality with Shadow DOM');
    
    // Test if we can simulate inspection of shadow elements
    const shadowHost = document.getElementById('shadow-host');
    if (shadowHost && shadowHost.shadowRoot) {
        const shadowElements = shadowHost.shadowRoot.querySelectorAll('input, button, select');
        
        console.log(`🎯 Found ${shadowElements.length} inspectable shadow elements:`);
        
        shadowElements.forEach((el, index) => {
            console.log(`\n${index + 1}. Inspecting: ${el.tagName}#${el.id || 'no-id'}`);
            
            // Test shadow DOM detection
            if (typeof isInShadowDOM === 'function') {
                const inShadow = isInShadowDOM(el);
                console.log(`   In Shadow DOM: ${inShadow ? 'Yes' : 'No'}`);
            }
            
            // Test host path generation
            if (typeof getShadowHostPath === 'function') {
                const hostPath = getShadowHostPath(el);
                console.log(`   Host Path: ${hostPath || 'None'}`);
            }
            
            // Test element type detection
            if (typeof getElementType === 'function') {
                const elementType = getElementType(el);
                console.log(`   Element Type: ${elementType}`);
            }
        });
    }
}

// Run all tests
function runAllTests() {
    console.log('🎬 Enhanced Shadow DOM Test Suite Started');
    console.log('═'.repeat(60));
    
    try {
        testShadowDOMFunctions();
        testShadowDOMDetection();
        testShadowDOMExtraction();
        testShadowDOMLocators();
        testFullExtractionWorkflow();
        testInspectorWithShadowDOM();
        
        console.log('\n═'.repeat(60));
        console.log('✅ Enhanced Shadow DOM Test Suite Completed');
        console.log('📊 Check the results above for any issues or improvements needed');
        
    } catch (error) {
        console.error('❌ Test suite failed:', error);
    }
}

// Auto-run tests when script is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAllTests);
} else {
    runAllTests();
}

// Export for manual testing
window.shadowDOMTestSuite = {
    runAllTests,
    testShadowDOMFunctions,
    testShadowDOMDetection,
    testShadowDOMExtraction,
    testShadowDOMLocators,
    testFullExtractionWorkflow,
    testInspectorWithShadowDOM
};

console.log('🧪 Shadow DOM Test Suite loaded. Run window.shadowDOMTestSuite.runAllTests() to test manually.');
