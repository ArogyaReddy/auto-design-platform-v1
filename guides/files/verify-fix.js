// Quick verification script to ensure our extension fixes are working correctly

console.log('=== Locator Generation Fix Verification ===');

// Test the exact scenario from the original problem
const testElement = document.querySelector('.nav-link[href="#architecture"]');

if (testElement) {
    console.log('✅ Manual locator .nav-link[href="#architecture"] works');
    console.log('Element found:', testElement);
    console.log('Element text:', testElement.textContent);
    console.log('Element href:', testElement.getAttribute('href'));
    console.log('Element classes:', testElement.className);
} else {
    console.log('❌ Manual locator .nav-link[href="#architecture"] failed');
}

// Test the problematic old locator
const oldLocator = 'div.container:nth-child(1) > nav.sidebar > a.nav-link:nth-child(1)';
const oldElement = document.querySelector(oldLocator);

console.log('\nOld locator test:');
if (oldElement) {
    console.log('⚠️  Old complex locator still works, but it\'s fragile');
    console.log('Old locator found:', oldElement.textContent);
} else {
    console.log('❌ Old complex locator failed (expected in our test page)');
}

// Verify the locator generation logic priorities
console.log('\n=== Locator Generation Priority Test ===');

function testLocatorPriority() {
    const link = document.querySelector('.nav-link[href="#architecture"]');
    if (!link) return;

    console.log('Testing element:', link.tagName, link.className, link.getAttribute('href'));
    
    // Test conditions in order of priority
    
    // 1. ID test (should not apply - no ID)
    console.log('1. ID test:', link.id ? `#${link.id}` : 'N/A - no ID');
    
    // 2. Name test (should not apply - no name)
    console.log('2. Name test:', link.name ? `[name="${link.name}"]` : 'N/A - no name');
    
    // 3. Href test (should apply and be unique)
    if (link.tagName.toLowerCase() === 'a' && link.hasAttribute('href')) {
        const href = link.getAttribute('href');
        const hrefElements = document.querySelectorAll(`a[href="${href}"]`);
        console.log(`3. Href test: a[href="${href}"] - Found ${hrefElements.length} elements`);
        
        if (hrefElements.length === 1) {
            console.log('   ✅ Unique href - should be used as locator');
        } else {
            // Test class+href combination
            if (link.className) {
                const classes = link.className.split(' ').filter(c => c.trim());
                if (classes.length > 0) {
                    const combinedLocator = `.${classes.join('.')}[href="${href}"]`;
                    const combinedElements = document.querySelectorAll(combinedLocator);
                    console.log(`   Class+Href test: ${combinedLocator} - Found ${combinedElements.length} elements`);
                    if (combinedElements.length === 1) {
                        console.log('   ✅ Unique class+href - should be used as locator');
                    }
                }
            }
        }
    }
    
    // 4. Class test (lower priority)
    if (link.className) {
        const classes = link.className.split(' ').filter(c => c.trim());
        const classSelector = `.${classes.join('.')}`;
        const classElements = document.querySelectorAll(classSelector);
        console.log(`4. Class test: ${classSelector} - Found ${classElements.length} elements`);
    }
}

testLocatorPriority();

console.log('\n=== Test Complete ===');
console.log('Expected outcome: Href-based locator (.nav-link[href="#architecture"]) should be generated instead of complex path-based selector');
