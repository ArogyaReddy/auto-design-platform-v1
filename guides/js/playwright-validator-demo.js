/**
 * Playwright Element Validator Demo/Test Script
 * 
 * This script demonstrates how to use the PlaywrightElementValidator
 * with your Element Extractor project.
 */

const { PlaywrightElementValidator } = require('../../utils/playwright-element-validator');

async function main() {
    const validator = new PlaywrightElementValidator({
        headless: false, // Set to true for headless mode
        enableLogging: true
    });

    try {
        console.log('🎭 Starting Playwright Element Validator Demo...\n');

        // Initialize Playwright
        await validator.initialize();

        // Test with a sample webpage (you can change this to any URL)
        const testUrl = 'file://' + __dirname + '/apps/test-extension.html';
        console.log(`🌐 Testing with: ${testUrl}`);
        
        await validator.navigateToUrl(testUrl);

        // Demo 1: Test individual elements
        console.log('\n=== DEMO 1: Individual Element Validation ===');
        
        const testLocators = [
            'button#testButton',
            'input[name="username"]',
            '#loginForm',
            '.nav-link',
            'a[href="#about"]'
        ];

        for (const locator of testLocators) {
            console.log(`\n🔍 Testing locator: ${locator}`);
            try {
                const result = await validator.validateElement(locator, {
                    checkVisibility: true,
                    checkClickability: true,
                    checkEnabled: true,
                    checkText: true,
                    checkLocatorQuality: true,
                    generateAlternatives: true
                });

                console.log(`   Result: ${result.overall.grade} (${result.overall.score}%) - ${result.overall.message}`);
                
                if (result.alternatives.length > 0) {
                    console.log(`   💡 Best alternative: ${result.alternatives[0].locator} (${result.alternatives[0].confidence}% confidence)`);
                }

                if (result.recommendations.length > 0) {
                    console.log(`   📋 Recommendations:`);
                    result.recommendations.forEach(rec => {
                        console.log(`      - ${rec.message}`);
                    });
                }

            } catch (error) {
                console.log(`   ❌ Error: ${error.message}`);
            }
        }

        // Demo 2: Batch validation
        console.log('\n\n=== DEMO 2: Batch Validation ===');
        
        const batchLocators = [
            'button',
            'input[type="text"]',
            'a',
            '.button',
            '#nonExistentElement'
        ];

        const batchResults = await validator.validateElements(batchLocators);
        
        console.log('\n📊 Batch Results Summary:');
        console.log(`   Total elements: ${batchResults.summary.total}`);
        console.log(`   Passed: ${batchResults.summary.passed} (${batchResults.summary.passRate}%)`);
        console.log(`   Failed: ${batchResults.summary.failed} (${batchResults.summary.failRate}%)`);
        console.log(`   Average score: ${batchResults.summary.averageScore}%`);
        console.log('   Grade distribution:', batchResults.summary.grades);

        // Demo 3: Element Extractor Integration
        console.log('\n\n=== DEMO 3: Element Extractor Integration ===');
        
        // Simulate Element Extractor data
        const mockExtractedData = [
            {
                'Element Name': 'Login Button',
                'Element Type': 'BUTTON',
                'Best Locator': 'button#loginBtn',
                'Locator Type': 'ID',
                'Strength': 85,
                'In Shadow DOM': 'No'
            },
            {
                'Element Name': 'Username Field',
                'Element Type': 'INPUT',
                'Best Locator': 'input[name="username"]',
                'Locator Type': 'name',
                'Strength': 70,
                'In Shadow DOM': 'No'
            },
            {
                'Element Name': 'Navigation Link',
                'Element Type': 'LINK',
                'Best Locator': 'a.nav-link[href="#about"]',
                'Locator Type': 'class+href',
                'Strength': 92,
                'In Shadow DOM': 'No'
            }
        ];

        const integrationResults = await validator.validateExtractedElements(mockExtractedData);
        
        console.log('\n🎯 Integration Results:');
        console.log(`   Elements validated: ${integrationResults.summary.validated}`);
        console.log(`   Improvements suggested: ${integrationResults.summary.improvementsSuggested}`);
        console.log(`   Average Playwright score: ${integrationResults.summary.averagePlaywrightScore}%`);

        // Show detailed results for elements with improvements
        integrationResults.results.forEach(result => {
            if (result.elementExtractor?.suggestedImprovement) {
                console.log(`\n💡 Improvement suggested for "${result.elementExtractor.elementName}":`);
                console.log(`   From: ${result.elementExtractor.suggestedImprovement.from}`);
                console.log(`   To: ${result.elementExtractor.suggestedImprovement.to}`);
                console.log(`   Expected improvement: +${result.elementExtractor.suggestedImprovement.expectedImprovement}%`);
            }
        });

        // Demo 4: Interaction Testing
        console.log('\n\n=== DEMO 4: Interaction Testing ===');
        
        // Test interactions with clickable elements
        try {
            const interactionResults = await validator.testElementInteractions('button', {
                click: true,
                hover: true
            });
            
            console.log('🖱️ Interaction test results:');
            Object.entries(interactionResults.interactions).forEach(([action, result]) => {
                console.log(`   ${action}: ${result.success ? '✅' : '❌'} ${result.message}`);
            });
            
        } catch (error) {
            console.log(`⚠️ Interaction testing failed: ${error.message}`);
        }

    } catch (error) {
        console.error('❌ Demo failed:', error);
    } finally {
        // Cleanup
        await validator.cleanup();
    }
}

// Function to create a quick test with your own locator
async function quickTest(locator, url = null) {
    console.log(`🚀 Quick testing locator: ${locator}`);
    
    const validator = new PlaywrightElementValidator({
        headless: false,
        enableLogging: true
    });

    try {
        await validator.initialize();
        
        if (url) {
            await validator.navigateToUrl(url);
        }

        const result = await validator.validateElement(locator, {
            checkVisibility: true,
            checkClickability: true,
            checkEnabled: true,
            checkText: true,
            checkLocatorQuality: true,
            generateAlternatives: true
        });

        console.log('\n📊 Results:');
        console.log(`   Overall: ${result.overall.grade} (${result.overall.score}%)`);
        console.log(`   Exists: ${result.tests.existence.passed ? '✅' : '❌'}`);
        console.log(`   Visible: ${result.tests.visibility.passed ? '✅' : '❌'}`);
        console.log(`   Clickable: ${result.tests.clickability.passed ? '✅' : '❌'}`);
        console.log(`   Enabled: ${result.tests.enabled.passed ? '✅' : '❌'}`);
        console.log(`   Has Text: ${result.tests.text.passed ? '✅' : '❌'} "${result.tests.text.content}"`);
        console.log(`   Locator Quality: ${result.tests.locatorQuality.rating} (${result.tests.locatorQuality.score}/20)`);

        if (result.alternatives.length > 0) {
            console.log('\n💡 Alternative locators:');
            result.alternatives.slice(0, 3).forEach((alt, i) => {
                console.log(`   ${i + 1}. ${alt.locator} (${alt.confidence}% confidence) - ${alt.description}`);
            });
        }

        if (result.recommendations.length > 0) {
            console.log('\n📋 Recommendations:');
            result.recommendations.forEach(rec => {
                console.log(`   - [${rec.priority.toUpperCase()}] ${rec.message}`);
            });
        }

        return result;

    } catch (error) {
        console.error('❌ Quick test failed:', error);
        return null;
    } finally {
        await validator.cleanup();
    }
}

// Export functions for use in other scripts
module.exports = {
    main,
    quickTest,
    PlaywrightElementValidator
};

// Run demo if this script is executed directly
if (require.main === module) {
    main().catch(console.error);
}

// Make quickTest available globally for easy console use
if (typeof global !== 'undefined') {
    global.quickTest = quickTest;
}
