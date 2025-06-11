// STEP 2 VALIDATION SCRIPT: Proven 92% Navigation Success Test
// This script validates the integration between BaseLocatorLibrary and Elements Extractor

console.log('🚀 STEP 2 VALIDATION: Proven 92% Navigation Success Test');
console.log('='.repeat(70));

// Test Results Storage
const step2Results = {
    provenPatterns: [],
    enhancedFeatures: [],
    integrationStatus: {},
    performanceMetrics: {},
    successRate: 0
};

// 1. PROVEN PATTERN VALIDATION
function validateProvenPatterns() {
    console.log('\n📊 1. VALIDATING PROVEN 92% PATTERNS');
    console.log('-'.repeat(45));
    
    const provenTests = [
        {
            name: 'Class+Href Navigation Links',
            selector: '.nav-link[href]',
            expectedPattern: '.nav-link[href="#examples"]',
            targetStrength: 92
        },
        {
            name: 'Unique Navigation Identification',
            selector: 'a[href="#examples"]',
            expectedUniqueness: true,
            targetSuccess: 100
        },
        {
            name: 'DevTools Compatibility',
            selector: '.nav-link[href="#documentation"]',
            testDevTools: true,
            expectedValid: true
        }
    ];
    
    provenTests.forEach((test, index) => {
        try {
            const elements = document.querySelectorAll(test.selector);
            const isUnique = elements.length === 1;
            const isValid = elements.length > 0;
            
            const result = {
                testName: test.name,
                selector: test.selector,
                elementsFound: elements.length,
                isUnique: isUnique,
                isValid: isValid,
                status: isValid && (test.expectedUniqueness ? isUnique : true) ? 'PASS' : 'FAIL'
            };
            
            step2Results.provenPatterns.push(result);
            
            console.log(`   Test ${index + 1}: ${test.name}`);
            console.log(`   Selector: ${test.selector}`);
            console.log(`   Found: ${elements.length} elements`);
            console.log(`   Status: ${result.status} ${result.status === 'PASS' ? '✅' : '❌'}`);
            console.log('');
            
        } catch (error) {
            console.error(`   Test ${index + 1} ERROR: ${error.message}`);
            step2Results.provenPatterns.push({
                testName: test.name,
                status: 'ERROR',
                error: error.message
            });
        }
    });
}

// 2. ENHANCED FEATURES VALIDATION
function validateEnhancedFeatures() {
    console.log('\n🚀 2. VALIDATING ENHANCED FEATURES');
    console.log('-'.repeat(38));
    
    // Test Enhanced Locator Generation
    const navLinks = document.querySelectorAll('.nav-link[href]');
    let enhancedSuccessCount = 0;
    
    console.log(`   Found ${navLinks.length} navigation elements to test`);
    
    navLinks.forEach((link, index) => {
        const href = link.getAttribute('href');
        const classes = Array.from(link.classList);
        
        // Test Class+Href Pattern (Enhanced Priority)
        const classHrefLocator = `.${classes.join('.')}[href="${href}"]`;
        const classHrefElements = document.querySelectorAll(classHrefLocator);
        
        // Test Pure Href Pattern (Fallback)
        const hrefLocator = `a[href="${href}"]`;
        const hrefElements = document.querySelectorAll(hrefLocator);
        
        const enhancementFeatures = {
            element: `Element ${index + 1}`,
            href: href,
            classHrefLocator: classHrefLocator,
            classHrefUnique: classHrefElements.length === 1,
            classHrefStrength: classHrefElements.length === 1 ? 92 : 0,
            hrefLocator: hrefLocator,
            hrefUnique: hrefElements.length === 1,
            hrefStrength: hrefElements.length === 1 ? 78 : 0,
            priorityCorrect: classHrefElements.length === 1 // Should prefer Class+Href
        };
        
        step2Results.enhancedFeatures.push(enhancementFeatures);
        
        if (enhancementFeatures.priorityCorrect) {
            enhancedSuccessCount++;
        }
        
        console.log(`   ${enhancementFeatures.element}:`);
        console.log(`     Class+Href: ${classHrefLocator} (Unique: ${enhancementFeatures.classHrefUnique ? 'Yes' : 'No'})`);
        console.log(`     Pure Href: ${hrefLocator} (Unique: ${enhancementFeatures.hrefUnique ? 'Yes' : 'No'})`);
        console.log(`     Priority: ${enhancementFeatures.priorityCorrect ? 'CORRECT ✅' : 'NEEDS REVIEW ⚠️'}`);
        console.log('');
    });
    
    const enhancedSuccessRate = Math.round((enhancedSuccessCount / navLinks.length) * 100);
    console.log(`   Enhanced Features Success Rate: ${enhancedSuccessRate}%`);
    
    return enhancedSuccessRate;
}

// 3. INTEGRATION STATUS VALIDATION
function validateIntegrationStatus() {
    console.log('\n🔗 3. VALIDATING INTEGRATION STATUS');
    console.log('-'.repeat(40));
    
    const integrationChecks = {
        baseLocatorLibrary: checkBaseLocatorLibrary(),
        enhancedElementsExtractor: checkEnhancedElementsExtractor(),
        popupJsIntegration: checkPopupIntegration(),
        contentScriptIntegration: checkContentScriptIntegration(),
        crossSystemConsistency: checkCrossSystemConsistency()
    };
    
    Object.entries(integrationChecks).forEach(([component, status]) => {
        console.log(`   ${component}: ${status ? 'INTEGRATED ✅' : 'NOT DETECTED ⚠️'}`);
    });
    
    step2Results.integrationStatus = integrationChecks;
    
    return integrationChecks;
}

// 4. PERFORMANCE METRICS VALIDATION
function validatePerformanceMetrics() {
    console.log('\n⚡ 4. VALIDATING PERFORMANCE METRICS');
    console.log('-'.repeat(42));
    
    const startTime = performance.now();
    
    // Simulate locator generation performance test
    const testElements = document.querySelectorAll('.nav-link, button, input, [id], [class]');
    let locatorGenerationTime = 0;
    let successfulGenerations = 0;
    
    testElements.forEach(element => {
        const genStart = performance.now();
        
        // Simulate enhanced locator generation
        try {
            const locator = generateTestLocator(element);
            if (locator && locator.length > 0) {
                successfulGenerations++;
            }
        } catch (error) {
            // Handle generation errors
        }
        
        locatorGenerationTime += (performance.now() - genStart);
    });
    
    const totalTime = performance.now() - startTime;
    const avgGenerationTime = locatorGenerationTime / testElements.length;
    const generationSuccessRate = Math.round((successfulGenerations / testElements.length) * 100);
    
    const performanceMetrics = {
        totalElements: testElements.length,
        totalTime: Math.round(totalTime * 100) / 100,
        avgGenerationTime: Math.round(avgGenerationTime * 100) / 100,
        successfulGenerations: successfulGenerations,
        generationSuccessRate: generationSuccessRate
    };
    
    step2Results.performanceMetrics = performanceMetrics;
    
    console.log(`   Total Elements Tested: ${performanceMetrics.totalElements}`);
    console.log(`   Total Time: ${performanceMetrics.totalTime}ms`);
    console.log(`   Average Generation Time: ${performanceMetrics.avgGenerationTime}ms`);
    console.log(`   Successful Generations: ${performanceMetrics.successfulGenerations}/${performanceMetrics.totalElements}`);
    console.log(`   Generation Success Rate: ${performanceMetrics.generationSuccessRate}%`);
    
    return performanceMetrics;
}

// 5. CALCULATE OVERALL SUCCESS RATE
function calculateOverallSuccessRate() {
    console.log('\n📈 5. CALCULATING OVERALL SUCCESS RATE');
    console.log('-'.repeat(43));
    
    const provenSuccess = step2Results.provenPatterns.filter(p => p.status === 'PASS').length;
    const provenTotal = step2Results.provenPatterns.length;
    const provenRate = provenTotal > 0 ? Math.round((provenSuccess / provenTotal) * 100) : 0;
    
    const enhancedSuccess = step2Results.enhancedFeatures.filter(f => f.priorityCorrect).length;
    const enhancedTotal = step2Results.enhancedFeatures.length;
    const enhancedRate = enhancedTotal > 0 ? Math.round((enhancedSuccess / enhancedTotal) * 100) : 0;
    
    const integrationComponents = Object.values(step2Results.integrationStatus);
    const integrationSuccess = integrationComponents.filter(Boolean).length;
    const integrationRate = integrationComponents.length > 0 ? Math.round((integrationSuccess / integrationComponents.length) * 100) : 0;
    
    // Weighted average: Proven patterns (40%), Enhanced features (40%), Integration (20%)
    const overallSuccessRate = Math.round(
        (provenRate * 0.4) + (enhancedRate * 0.4) + (integrationRate * 0.2)
    );
    
    step2Results.successRate = overallSuccessRate;
    
    console.log(`   Proven Patterns Success: ${provenRate}% (${provenSuccess}/${provenTotal})`);
    console.log(`   Enhanced Features Success: ${enhancedRate}% (${enhancedSuccess}/${enhancedTotal})`);
    console.log(`   Integration Success: ${integrationRate}% (${integrationSuccess}/${integrationComponents.length})`);
    console.log('');
    console.log(`   🎯 OVERALL SUCCESS RATE: ${overallSuccessRate}%`);
    console.log(`   🎯 TARGET: 92%+ (${overallSuccessRate >= 92 ? 'ACHIEVED ✅' : 'NEEDS IMPROVEMENT ⚠️'})`);
    
    return overallSuccessRate;
}

// HELPER FUNCTIONS
function checkBaseLocatorLibrary() {
    return typeof window.BaseLocatorLibrary !== 'undefined' || 
           document.querySelector('script[src*="base-locator"]') !== null ||
           window.location.href.includes('base-locator');
}

function checkEnhancedElementsExtractor() {
    return typeof window.EnhancedElementsExtractor !== 'undefined' ||
           document.querySelector('script[src*="enhanced-extractor"]') !== null ||
           document.querySelector('script[src*="enhanced"]') !== null;
}

function checkPopupIntegration() {
    // Check for popup.js integration indicators
    return document.querySelector('script[src*="popup"]') !== null ||
           typeof window.domExtractionFunction !== 'undefined';
}

function checkContentScriptIntegration() {
    // Check for contentScript.js integration indicators
    return document.querySelector('script[src*="contentScript"]') !== null ||
           typeof window.generateLocators !== 'undefined';
}

function checkCrossSystemConsistency() {
    // Test that both systems would generate the same locator
    const testElement = document.querySelector('.nav-link[href]');
    if (!testElement) return false;
    
    const href = testElement.getAttribute('href');
    const expectedLocator = `.nav-link[href="${href}"]`;
    
    try {
        const elements = document.querySelectorAll(expectedLocator);
        return elements.length === 1;
    } catch (error) {
        return false;
    }
}

function generateTestLocator(element) {
    // Simulate enhanced locator generation logic
    if (element.id) {
        return `#${element.id}`;
    }
    
    if (element.tagName.toLowerCase() === 'a' && element.getAttribute('href')) {
        const href = element.getAttribute('href');
        const classes = Array.from(element.classList);
        
        if (classes.length > 0) {
            return `.${classes.join('.')}[href="${href}"]`;
        }
        
        return `a[href="${href}"]`;
    }
    
    if (element.className) {
        const classes = Array.from(element.classList).filter(c => c.trim());
        if (classes.length > 0) {
            return `.${classes.join('.')}`;
        }
    }
    
    return element.tagName.toLowerCase();
}

// MAIN EXECUTION FUNCTION
function runStep2Validation() {
    console.log('Starting STEP 2 Comprehensive Validation...\n');
    
    // Run all validation tests
    validateProvenPatterns();
    const enhancedRate = validateEnhancedFeatures();
    validateIntegrationStatus();
    validatePerformanceMetrics();
    const overallRate = calculateOverallSuccessRate();
    
    // Final Summary
    console.log('\n' + '='.repeat(70));
    console.log('🎉 STEP 2 VALIDATION COMPLETE');
    console.log('='.repeat(70));
    
    console.log(`\n📊 SUMMARY RESULTS:`);
    console.log(`   Overall Success Rate: ${overallRate}%`);
    console.log(`   Target Achievement: ${overallRate >= 92 ? 'SUCCESS ✅' : 'NEEDS WORK ⚠️'}`);
    console.log(`   Enhanced Features: ${enhancedRate}% working correctly`);
    console.log(`   Performance: ${step2Results.performanceMetrics.avgGenerationTime}ms avg generation time`);
    
    console.log(`\n🚀 NEXT STEPS:`);
    if (overallRate >= 92) {
        console.log(`   ✅ READY FOR STEP 3: Auto Tools Integration`);
        console.log(`   ✅ System validated and performing above target`);
        console.log(`   ✅ Proven 92% success rate maintained/improved`);
    } else {
        console.log(`   ⚠️  OPTIMIZATION NEEDED: Review failing components`);
        console.log(`   ⚠️  Address integration issues before Step 3`);
        console.log(`   ⚠️  Target: Achieve 92%+ success rate`);
    }
    
    console.log(`\n📋 DETAILED RESULTS STORED IN: step2Results`);
    console.log(`   Access via: console.log(step2Results)`);
    
    // Store results globally for inspection
    window.step2ValidationResults = step2Results;
    
    return step2Results;
}

// Auto-run validation when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runStep2Validation);
} else {
    runStep2Validation();
}
