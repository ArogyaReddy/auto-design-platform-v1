// DevTools Compatibility Verification Script
// Run this in the browser console to test locator generation

console.log('🔧 Element AI Extractor - Locator Generation Test');
console.log('=====================================================');

// Test elements with problematic IDs
const testElements = [
    'input#simple-input',
    'input#complex-id\\.with\\.dots',
    'button#add-to-cart-test\\.allthethings\\(\\)-t-shirt-\\(red\\)',
    'a.nav-link[href="#examples"]',
    'div[data-testid="checkout-form"]'
];

console.log('\n✅ Testing selector compatibility...\n');

testElements.forEach(selector => {
    try {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`✅ PASS: ${selector} → Found element`);
        } else {
            console.log(`❌ FAIL: ${selector} → No element found`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${selector} → ${error.message}`);
    }
});

// Test the attribute selector approach for complex IDs
console.log('\n🔍 Testing attribute selector approach...\n');

const attributeSelectors = [
    '[id="simple-input"]',
    '[id="complex-id.with.dots"]',
    '[id="add-to-cart-test.allthethings()-t-shirt-(red)"]'
];

attributeSelectors.forEach(selector => {
    try {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`✅ PASS: ${selector} → Found element`);
        } else {
            console.log(`❌ FAIL: ${selector} → No element found`);
        }
    } catch (error) {
        console.log(`❌ ERROR: ${selector} → ${error.message}`);
    }
});

console.log('\n🎯 EXPECTED RESULTS:');
console.log('✅ All attribute selectors should PASS');
console.log('✅ Complex ID selectors with escaped characters should work');
console.log('✅ No syntax errors should occur');

console.log('\n💡 Next Steps:');
console.log('1. Install the Element AI Extractor extension');
console.log('2. Use "Extract Elements" to scan this page');
console.log('3. Verify generated locators match the PASS results above');
console.log('4. Test copying locators and pasting them back in this console');
