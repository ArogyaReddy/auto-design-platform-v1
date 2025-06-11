/**
 * Automation Locator Tester - Universal JavaScript Library
 * Tests locators compatibility across Playwright, Selenium, and Cypress
 * Author: Elements Extractor Team
 * Date: June 9, 2025
 */

class AutomationLocatorTester {
    constructor() {
        this.results = [];
         // No elements found
        if (elements.length === 0) {
            // Check if it's a syntax issue or just no matching elements
            const syntaxSupported = tests.browser.supported;
            
            if (!syntaxSupported) {
                testResult.recommendations.push('❌ Selector syntax not supported in browser');
                testResult.recommendations.push('💡 This selector won\'t work in DevTools console');
            } else {
                testResult.recommendations.push('⚠️ Selector syntax is VALID, but no matching elements exist on this page');
                testResult.recommendations.push('💡 "Supported: true" = CSS syntax is correct');
                testResult.recommendations.push('💡 "Elements found: 0" = No matching elements on current page');
                testResult.recommendations.push('💡 Try this selector on a page that has matching elements');
                testResult.recommendations.push('💡 For automation: selector will work if target page has the elements');
            }
            return;
        }ugMode = false;
    }

    /**
     * Enable debug mode for detailed logging
     */
    enableDebug() {
        this.debugMode = true;
        console.log('🔧 Debug mode enabled for Automation Locator Tester');
    }

    /**
     * Test a locator using multiple strategies (mimics automation tools)
     * @param {string} locator - The CSS selector or XPath to test
     * @param {string} expectedTag - Expected tag name (optional)
     * @param {Object} context - Context object with page info (optional)
     * @returns {Object} Test results with compatibility info
     */
    testLocator(locator, expectedTag = null, context = {}) {
        const testResult = {
            locator: locator,
            timestamp: new Date().toISOString(),
            context: context,
            tests: {
                browser: this._testBrowserCompatibility(locator),
                playwright: this._testPlaywrightCompatibility(locator),
                selenium: this._testSeleniumCompatibility(locator),
                cypress: this._testCypressCompatibility(locator)
            },
            elements: [],
            recommendations: [],
            overall: 'UNKNOWN'
        };

        // Find elements using the locator
        try {
            const elements = this._findElements(locator);
            testResult.elements = elements.map(el => ({
                tagName: el.tagName,
                id: el.id || '',
                className: el.className || '',
                textContent: (el.textContent || '').trim().substring(0, 50),
                isVisible: this._isElementVisible(el),
                boundingBox: el.getBoundingClientRect()
            }));

            // Validate expected tag if provided
            if (expectedTag && elements.length > 0) {
                const matchesExpected = elements[0].tagName.toLowerCase() === expectedTag.toLowerCase();
                if (!matchesExpected) {
                    testResult.recommendations.push(`⚠️ Expected ${expectedTag} but found ${elements[0].tagName}`);
                }
            }

        } catch (error) {
            testResult.error = error.message;
            if (this.debugMode) {
                console.error('Error finding elements:', error);
            }
        }

        // Generate recommendations
        this._generateRecommendations(testResult);
        
        // Calculate overall score
        testResult.overall = this._calculateOverallScore(testResult);

        this.results.push(testResult);
        
        if (this.debugMode) {
            console.log('🧪 Test Result:', testResult);
            console.log('📚 Key Understanding:');
            console.log(`   "Supported" = CSS syntax is valid (${testResult.tests.browser.supported})`);
            console.log(`   "Elements Found" = Matching elements exist on page (${testResult.elements.length})`);
            if (testResult.elements.length === 0 && testResult.tests.browser.supported) {
                console.log('   💡 This means: Valid selector, but no matching elements on this page');
            }
        }

        return testResult;
    }

    /**
     * Test browser DevTools compatibility
     */
    _testBrowserCompatibility(locator) {
        try {
            if (locator.startsWith('/') || locator.startsWith('//')) {
                // XPath - not supported in querySelector
                return {
                    supported: false,
                    reason: 'XPath not supported in browser querySelector',
                    score: 0
                };
            }

            const elements = document.querySelectorAll(locator);
            const isValid = elements.length > 0;
            
            return {
                supported: true,
                valid: isValid,
                elementCount: elements.length,
                score: isValid ? 100 : 50,
                reason: isValid ? `Works in browser - found ${elements.length} element(s)` : 'Selector valid but no elements found on this page',
                clarification: elements.length === 0 ? 'CSS syntax is correct, but no matching elements exist' : `Found ${elements.length} matching element(s)`
            };
        } catch (error) {
            return {
                supported: false,
                error: error.message,
                score: 0,
                reason: 'Invalid CSS selector syntax'
            };
        }
    }

    /**
     * Test Playwright compatibility
     */
    _testPlaywrightCompatibility(locator) {
        const result = {
            supported: true,
            score: 90,
            features: []
        };

        // Playwright supports most CSS selectors and XPath
        if (locator.startsWith('/') || locator.startsWith('//')) {
            result.features.push('XPath support');
            result.score = 95;
        }

        // Special Playwright selectors
        if (locator.includes('>>')) {
            result.features.push('Shadow DOM piercing');
            result.score = 100;
        }

        if (locator.includes(':has(')) {
            result.features.push('CSS :has() pseudo-class');
            result.score = 95;
        }

        if (locator.includes('text=') || locator.includes('role=')) {
            result.features.push('Playwright native selectors');
            result.score = 100;
        }

        return result;
    }

    /**
     * Test Selenium compatibility
     */
    _testSeleniumCompatibility(locator) {
        const result = {
            supported: true,
            score: 85,
            features: [],
            strategy: 'css'
        };

        if (locator.startsWith('/') || locator.startsWith('//')) {
            result.strategy = 'xpath';
            result.features.push('XPath support');
            result.score = 90;
        }

        // Selenium doesn't support some modern CSS
        if (locator.includes(':has(')) {
            result.supported = false;
            result.score = 0;
            result.reason = 'CSS :has() not supported in most browsers for Selenium';
        }

        if (locator.includes('>>')) {
            result.supported = false;
            result.score = 0;
            result.reason = 'Shadow DOM piercing syntax not supported';
        }

        return result;
    }

    /**
     * Test Cypress compatibility
     */
    _testCypressCompatibility(locator) {
        const result = {
            supported: true,
            score: 80,
            features: []
        };

        // Cypress has some limitations
        if (locator.startsWith('/') || locator.startsWith('//')) {
            result.supported = false;
            result.score = 0;
            result.reason = 'XPath not natively supported (requires plugin)';
        }

        if (locator.includes('>>')) {
            result.supported = false;
            result.score = 0;
            result.reason = 'Shadow DOM piercing syntax not supported';
        }

        if (locator.includes(':has(')) {
            result.score = 60;
            result.reason = 'CSS :has() support depends on browser version';
        }

        return result;
    }

    /**
     * Find elements using various strategies
     */
    _findElements(locator) {
        const elements = [];

        try {
            if (locator.startsWith('/') || locator.startsWith('//')) {
                // XPath
                const result = document.evaluate(
                    locator,
                    document,
                    null,
                    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                    null
                );
                for (let i = 0; i < result.snapshotLength; i++) {
                    elements.push(result.snapshotItem(i));
                }
            } else {
                // CSS Selector
                const nodeList = document.querySelectorAll(locator);
                elements.push(...nodeList);
            }
        } catch (error) {
            if (this.debugMode) {
                console.warn('Error finding elements:', error);
            }
        }

        return elements;
    }

    /**
     * Check if element is visible
     */
    _isElementVisible(element) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        
        return rect.width > 0 && 
               rect.height > 0 && 
               style.display !== 'none' && 
               style.visibility !== 'hidden' &&
               style.opacity !== '0';
    }

    /**
     * Generate recommendations for improving locators
     */
    _generateRecommendations(testResult) {
        const { locator, elements, tests } = testResult;

        // No elements found - but distinguish between syntax support and element availability
        if (elements.length === 0) {
            // Check if it's a syntax issue or just no matching elements
            const syntaxSupported = tests.browser.supported;
            
            if (!syntaxSupported) {
                testResult.recommendations.push('❌ Selector syntax not supported in browser');
                testResult.recommendations.push('💡 This selector won\'t work in DevTools console');
            } else {
                testResult.recommendations.push('⚠️ No elements found on current page (but syntax is valid)');
                testResult.recommendations.push('💡 Selector syntax works - try on a page with matching elements');
                testResult.recommendations.push('💡 For automation: this selector is technically valid for tools that support it');
            }
            return;
        }

        // Multiple elements found
        if (elements.length > 1) {
            testResult.recommendations.push(`⚠️ Multiple elements found (${elements.length})`);
            testResult.recommendations.push('💡 Consider adding more specific attributes');
        }

        // Browser compatibility issues
        if (!tests.browser.supported || !tests.browser.valid) {
            testResult.recommendations.push('❌ Does not work in browser DevTools');
            testResult.recommendations.push('💡 Consider using a different selector strategy');
        }

        // Automation tool specific recommendations
        if (!tests.selenium.supported) {
            testResult.recommendations.push('❌ Not compatible with Selenium');
            testResult.recommendations.push('💡 Use basic CSS selectors or XPath for Selenium');
        }

        if (!tests.cypress.supported) {
            testResult.recommendations.push('❌ Not compatible with Cypress');
            testResult.recommendations.push('💡 Use CSS selectors only for Cypress');
        }

        // Suggest alternatives
        if (locator.includes(':nth-of-type') || locator.includes(':nth-child')) {
            testResult.recommendations.push('⚠️ Position-based selectors are fragile');
            testResult.recommendations.push('💡 Try using data-testid, aria-label, or unique classes');
        }
    }

    /**
     * Calculate overall compatibility score
     */
    _calculateOverallScore(testResult) {
        const { tests } = testResult;
        let totalScore = 0;
        let validTests = 0;

        // Weight different tools based on preference
        const weights = {
            playwright: 0.4,  // Highest preference
            selenium: 0.3,    // Second preference  
            cypress: 0.2,     // Third preference
            browser: 0.1      // DevTools compatibility
        };

        Object.keys(weights).forEach(tool => {
            if (tests[tool].supported !== false) {
                totalScore += tests[tool].score * weights[tool];
                validTests++;
            }
        });

        const avgScore = validTests > 0 ? totalScore : 0;

        if (avgScore >= 90) return 'EXCELLENT';
        if (avgScore >= 75) return 'GOOD';
        if (avgScore >= 50) return 'FAIR';
        return 'POOR';
    }

    /**
     * Generate alternative locators for problematic ones
     */
    generateAlternatives(element) {
        if (!element) return [];

        const alternatives = [];

        // ID-based
        if (element.id) {
            alternatives.push(`#${element.id}`);
        }

        // Data attributes
        for (const attr of element.attributes) {
            if (attr.name.startsWith('data-')) {
                alternatives.push(`[${attr.name}="${attr.value}"]`);
            }
        }

        // Aria attributes
        if (element.getAttribute('aria-label')) {
            alternatives.push(`[aria-label="${element.getAttribute('aria-label')}"]`);
        }

        // Class-based (single and multiple)
        if (element.className) {
            const classes = element.className.split(' ').filter(c => c.trim());
            if (classes.length === 1) {
                alternatives.push(`.${classes[0]}`);
            } else if (classes.length > 1) {
                alternatives.push(`.${classes.join('.')}`);
            }
        }

        // Role-based
        if (element.getAttribute('role')) {
            alternatives.push(`[role="${element.getAttribute('role')}"]`);
        }

        // Text-based (for links and buttons)
        if (['A', 'BUTTON'].includes(element.tagName)) {
            const text = element.textContent.trim();
            if (text.length > 0 && text.length < 50) {
                alternatives.push(`${element.tagName.toLowerCase()}:contains("${text}")`);
            }
        }

        return alternatives;
    }

    /**
     * Run comprehensive test suite
     */
    runTestSuite(locators = []) {
        console.log('🚀 Running Automation Locator Test Suite...');
        console.log('=' .repeat(60));

        const suiteResults = {
            timestamp: new Date().toISOString(),
            totalTests: locators.length,
            results: [],
            summary: {
                excellent: 0,
                good: 0,
                fair: 0,
                poor: 0
            }
        };

        locators.forEach((locator, index) => {
            console.log(`\n🧪 Test ${index + 1}/${locators.length}: ${locator}`);
            console.log('-'.repeat(40));
            
            const result = this.testLocator(locator);
            suiteResults.results.push(result);
            suiteResults.summary[result.overall.toLowerCase()]++;

            // Display results
            console.log(`Elements found: ${result.elements.length}`);
            console.log(`Overall rating: ${result.overall}`);
            console.log(`Browser compatible: ${result.tests.browser.supported ? '✅' : '❌'}`);
            console.log(`Playwright score: ${result.tests.playwright.score}%`);
            console.log(`Selenium score: ${result.tests.selenium.score}%`);
            console.log(`Cypress score: ${result.tests.cypress.score}%`);

            if (result.recommendations.length > 0) {
                console.log('\n📋 Recommendations:');
                result.recommendations.forEach(rec => console.log(`   ${rec}`));
            }
        });

        console.log('\n📊 Test Suite Summary:');
        console.log('=' .repeat(60));
        console.log(`Total tests: ${suiteResults.totalTests}`);
        console.log(`Excellent: ${suiteResults.summary.excellent}`);
        console.log(`Good: ${suiteResults.summary.good}`);
        console.log(`Fair: ${suiteResults.summary.fair}`);
        console.log(`Poor: ${suiteResults.summary.poor}`);

        return suiteResults;
    }

    /**
     * Export results to different formats
     */
    exportResults(format = 'json') {
        switch (format.toLowerCase()) {
            case 'json':
                return JSON.stringify(this.results, null, 2);
            case 'csv':
                return this._exportToCsv();
            case 'html':
                return this._exportToHtml();
            default:
                return this.results;
        }
    }

    _exportToCsv() {
        if (this.results.length === 0) return '';
        
        const headers = ['Locator', 'Overall', 'Elements Found', 'Browser Score', 'Playwright Score', 'Selenium Score', 'Cypress Score', 'Recommendations'];
        const rows = this.results.map(result => [
            result.locator,
            result.overall,
            result.elements.length,
            result.tests.browser.score || 0,
            result.tests.playwright.score || 0,
            result.tests.selenium.score || 0,
            result.tests.cypress.score || 0,
            result.recommendations.join('; ')
        ]);

        return [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    }

    _exportToHtml() {
        // HTML export implementation would go here
        return '<html><!-- HTML report implementation --></html>';
    }
}

// Static utility functions for quick testing
window.AutomationLocatorTester = AutomationLocatorTester;

// Quick test function for immediate use
window.testLocator = function(locator, debug = false) {
    const tester = new AutomationLocatorTester();
    if (debug) tester.enableDebug();
    return tester.testLocator(locator);
};

// Quick test for multiple locators
window.testLocators = function(locators, debug = false) {
    const tester = new AutomationLocatorTester();
    if (debug) tester.enableDebug();
    return tester.runTestSuite(locators);
};

console.log('✅ Automation Locator Tester loaded successfully!');
console.log('Usage: testLocator("your-selector-here") or testLocators(["sel1", "sel2"])');
