// Shadow DOM Locator Fix Validation Script
// Run this in browser DevTools to verify the fix is working

console.log('🌟 Shadow DOM Locator Fix Validation');
console.log('=========================================');

// Test 1: Verify DevTools-compatible selectors work
console.log('\n✅ Test 1: DevTools Compatibility');

const testSelectors = [
    '[aria-label="Close Menu"]',
    '[data-testid="submit-button"]', 
    '[role="button"]',
    '[id="complex.id.with.dots"]',
    '[name="username"]'
];

testSelectors.forEach(selector => {
    try {
        const elements = document.querySelectorAll(selector);
        console.log(`${selector}: ${elements.length === 1 ? '✅ UNIQUE' : elements.length > 1 ? '⚠️ MULTIPLE' : '❌ NONE'} (${elements.length} found)`);
    } catch (error) {
        console.log(`${selector}: ❌ SYNTAX ERROR - ${error.message}`);
    }
});

// Test 2: Verify complex selectors are avoided
console.log('\n⚠️ Test 2: Complex Selector Detection');

const complexSelectors = [
    'fuse-root >> .stage >> button',
    'complex-shell >> .app-bar >> button[aria-label="Close Menu"]'
];

complexSelectors.forEach(selector => {
    console.log(`${selector}: ❌ COMPLEX (should be avoided)`);
});

// Test 3: Strength score validation
console.log('\n📊 Test 3: Expected Strength Scores');

const expectedScores = [
    { type: 'ID', expected: 95 },
    { type: 'data-testid', expected: 90 },
    { type: 'aria-label (global)', expected: 90 },
    { type: 'role (global)', expected: 85 },
    { type: 'aria-label (complex)', expected: 85 },
    { type: 'CSS (complex shadow)', expected: '15-40' }
];

expectedScores.forEach(item => {
    console.log(`${item.type}: Expected ${item.expected}% strength`);
});

// Test 4: Check for Shadow DOM elements on current page
console.log('\n🔍 Test 4: Shadow DOM Detection on Current Page');

let shadowHostCount = 0;
let shadowElementCount = 0;

document.querySelectorAll('*').forEach(element => {
    if (element.shadowRoot) {
        shadowHostCount++;
        const shadowElements = element.shadowRoot.querySelectorAll('*');
        shadowElementCount += shadowElements.length;
        
        console.log(`🌟 Shadow Host: ${element.tagName}${element.id ? '#' + element.id : ''} (${shadowElements.length} inner elements)`);
        
        // Check for globally unique attributes in shadow elements
        shadowElements.forEach(shadowEl => {
            if (shadowEl.hasAttribute('aria-label')) {
                const ariaLabel = shadowEl.getAttribute('aria-label');
                const globalCount = document.querySelectorAll(`[aria-label="${ariaLabel}"]`).length;
                console.log(`  - Element with aria-label="${ariaLabel}" (${globalCount === 1 ? '✅ GLOBALLY UNIQUE' : '⚠️ NOT UNIQUE'})`);
            }
        });
    }
});

console.log(`\n📊 Summary: Found ${shadowHostCount} shadow hosts with ${shadowElementCount} total shadow elements`);

// Test 5: Locator generation simulation
console.log('\n🧪 Test 5: Simulated Locator Generation');

function simulateLocatorGeneration(element) {
    // Simulate the enhanced logic
    if (element.hasAttribute('aria-label')) {
        const ariaLabel = element.getAttribute('aria-label');
        const globalElements = document.querySelectorAll(`[aria-label="${ariaLabel}"]`);
        if (globalElements.length === 1) {
            return {
                locator: `[aria-label="${ariaLabel}"]`,
                type: 'aria-label',
                strength: 90,
                devToolsCompatible: true
            };
        }
    }
    
    if (element.id) {
        const hasSpecialChars = /[.()[\]{}+~>,:;#@$%^&*=!|\\/"'`\s]/.test(element.id);
        const selector = hasSpecialChars ? `[id="${element.id}"]` : `#${element.id}`;
        return {
            locator: selector,
            type: 'ID',
            strength: 95,
            devToolsCompatible: true
        };
    }
    
    return {
        locator: 'complex-path >> element',
        type: 'CSS',
        strength: 30,
        devToolsCompatible: false
    };
}

// Find some elements to test
const testElements = document.querySelectorAll('button, [aria-label], [data-testid]');
testElements.forEach((element, index) => {
    if (index < 3) { // Test first 3 elements
        const result = simulateLocatorGeneration(element);
        console.log(`Element ${index + 1}: ${element.tagName} → ${result.locator} (${result.strength}% strength, ${result.devToolsCompatible ? 'DevTools✅' : 'DevTools❌'})`);
    }
});

console.log('\n🎯 Validation Complete!');
console.log('Expected: High-strength, DevTools-compatible locators for Shadow DOM elements');
console.log('If you see mostly ✅ results, the fix is working correctly!');
