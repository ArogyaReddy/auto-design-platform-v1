/**
 * Complete Element Extractor + Playwright Integration Test
 * 
 * This script demonstrates how to use the Playwright Element Validator
 * as a utility/library with your Element Extractor project.
 */

const { ElementExtractorPlaywrightIntegration } = require('../../utils/element-extractor-playwright-integration');

async function runCompleteTest() {
    console.log('🎭 Starting Complete Element Extractor + Playwright Integration Test\n');
    
    // Initialize the integration
    const integration = new ElementExtractorPlaywrightIntegration({
        headless: false, // Set to true for headless mode
        enableLogging: true
    });

    try {
        // Test URL - using our test page
        const testUrl = 'file://' + __dirname + '/playwright-validator-test-page.html';
        console.log(`🌐 Testing with: ${testUrl}\n`);
        
        // Navigate to test page
        await integration.initialize();
        await integration.validator.navigateToUrl(testUrl);

        // ===========================================
        // 1. SIMULATE ELEMENT EXTRACTOR OUTPUT
        // ===========================================
        console.log('📊 Simulating Element Extractor output...\n');
        
        const mockElementExtractorOutput = [
            {
                'Element Name': 'Test Button',
                'Element Type': 'BUTTON',
                'Best Locator': 'button#testButton',
                'Locator Type': 'ID',
                'Strength': 85,
                'In Shadow DOM': 'No'
            },
            {
                'Element Name': 'Username Input',
                'Element Type': 'INPUT',
                'Best Locator': 'input[name="username"]',
                'Locator Type': 'name',
                'Strength': 70,
                'In Shadow DOM': 'No'
            },
            {
                'Element Name': 'About Navigation Link',
                'Element Type': 'LINK',
                'Best Locator': 'a.nav-link[href="#about"]',
                'Locator Type': 'class+href',
                'Strength': 92,
                'In Shadow DOM': 'No'
            },
            {
                'Element Name': 'Login Form',
                'Element Type': 'FORM',
                'Best Locator': '#loginForm',
                'Locator Type': 'ID',
                'Strength': 88,
                'In Shadow DOM': 'No'
            },
            {
                'Element Name': 'Generic Button',
                'Element Type': 'BUTTON',
                'Best Locator': 'body > div > div:nth-child(3) > button:nth-child(1)',
                'Locator Type': 'CSS',
                'Strength': 25,
                'In Shadow DOM': 'No'
            },
            {
                'Element Name': 'Disabled Button',
                'Element Type': 'BUTTON',
                'Best Locator': 'button:disabled',
                'Locator Type': 'CSS',
                'Strength': 40,
                'In Shadow DOM': 'No'
            }
        ];

        // ===========================================
        // 2. RUN COMPREHENSIVE VALIDATION
        // ===========================================
        console.log('🔄 Running comprehensive Element Extractor validation...\n');
        
        const validationResults = await integration.validateElementExtractorOutput(
            mockElementExtractorOutput,
            testUrl
        );

        // ===========================================
        // 3. GENERATE ENHANCED OUTPUT
        // ===========================================
        console.log('\n🚀 Generating enhanced output with Playwright insights...\n');
        
        const enhancedResults = await integration.generateEnhancedOutput(
            mockElementExtractorOutput,
            testUrl
        );

        // Display enhanced data
        console.log('📋 Enhanced Element Data:');
        enhancedResults.enhancedData.forEach((item, index) => {
            console.log(`\n   ${index + 1}. ${item['Element Name']}:`);
            console.log(`      Original: ${item['Original Locator']} (Strength: ${item['Original Strength']})`);
            console.log(`      Playwright: ${item['Best Locator']} (Score: ${item['Playwright Score']}%, Grade: ${item['Playwright Grade']})`);
            console.log(`      Quality: ${item['Locator Quality']}, Stability: ${item['Stability']}, Maintainability: ${item['Maintainability']}`);
            console.log(`      Enhanced: ${item['Enhanced']} ${item['Enhanced'] === 'Yes' ? '- ' + item['Enhancement Reason'] : ''}`);
        });

        // ===========================================
        // 4. EXPORT ENHANCED DATA
        // ===========================================
        console.log('\n📤 Exporting enhanced data to CSV...');
        integration.exportEnhancedToCsv(
            enhancedResults.enhancedData,
            'enhanced-element-extractor-output.csv'
        );

        // ===========================================
        // 5. DEMONSTRATE INDIVIDUAL ELEMENT TESTING
        // ===========================================
        console.log('\n🎯 Demonstrating individual element testing...\n');
        
        const individualTests = [
            'button[data-testid="main-test-button"]',
            'input[data-testid="username-input"]',
            'a[data-qa="about-link"]',
            '#nonExistentElement'
        ];

        for (const locator of individualTests) {
            console.log(`\n🔍 Testing: ${locator}`);
            const result = await integration.validateElementExtractorLocator(locator);
            
            console.log(`   Result: ${result.overall.grade} (${result.overall.score}%) - ${result.overall.message}`);
            console.log(`   Playwright Compatible: ${result.elementExtractorAnalysis.playwrightCompatible ? '✅' : '❌'}`);
            console.log(`   Stability: ${result.elementExtractorAnalysis.isStable}`);
            
            if (result.elementExtractorAnalysis.suggestedImprovement) {
                console.log(`   💡 Suggestion: ${result.elementExtractorAnalysis.suggestedImprovement.to}`);
            }
        }

        // ===========================================
        // 6. DEMONSTRATE INTERACTION TESTING
        // ===========================================
        console.log('\n🖱️ Demonstrating interaction testing...\n');
        
        try {
            const interactionResult = await integration.validator.testElementInteractions(
                'button[data-testid="main-test-button"]',
                {
                    click: true,
                    hover: true
                }
            );
            
            console.log('Interaction Test Results:');
            Object.entries(interactionResult.interactions).forEach(([action, result]) => {
                console.log(`   ${action}: ${result.success ? '✅' : '❌'} ${result.message}`);
            });
            
        } catch (error) {
            console.log(`⚠️ Interaction testing error: ${error.message}`);
        }

        // ===========================================
        // 7. FINAL RECOMMENDATIONS
        // ===========================================
        console.log('\n💡 System Recommendations for Element Extractor:\n');
        
        validationResults.report.recommendations.forEach((rec, index) => {
            console.log(`   ${index + 1}. [${rec.priority.toUpperCase()}] ${rec.title}`);
            console.log(`      ${rec.description}`);
            console.log(`      Impact: ${rec.impact}\n`);
        });

        console.log('✅ Complete integration test finished successfully!');
        
        return {
            validationResults,
            enhancedResults,
            stats: integration.stats
        };

    } catch (error) {
        console.error('❌ Integration test failed:', error);
        throw error;
    } finally {
        await integration.cleanup();
    }
}

/**
 * Quick utility function for testing a single locator
 */
async function quickValidateLocator(locator, url = null) {
    console.log(`🚀 Quick validating: ${locator}`);
    
    const integration = new ElementExtractorPlaywrightIntegration({ headless: false });
    
    try {
        await integration.initialize();
        
        if (url) {
            await integration.validator.navigateToUrl(url);
        }
        
        const result = await integration.validateElementExtractorLocator(locator);
        
        console.log('\n📊 Quick Validation Results:');
        console.log(`   Locator: ${locator}`);
        console.log(`   Grade: ${result.overall.grade} (${result.overall.score}%)`);
        console.log(`   Message: ${result.overall.message}`);
        console.log(`   Playwright Compatible: ${result.elementExtractorAnalysis.playwrightCompatible ? '✅' : '❌'}`);
        console.log(`   Stability: ${result.elementExtractorAnalysis.isStable}`);
        console.log(`   Maintainability: ${result.elementExtractorAnalysis.isMaintenanceFriendly}`);
        
        if (result.alternatives && result.alternatives.length > 0) {
            console.log('\n💡 Alternative Locators:');
            result.alternatives.slice(0, 3).forEach((alt, i) => {
                console.log(`   ${i + 1}. ${alt.locator} (${alt.confidence}% confidence)`);
            });
        }
        
        return result;
        
    } catch (error) {
        console.error('❌ Quick validation failed:', error);
        return null;
    } finally {
        await integration.cleanup();
    }
}

/**
 * Utility to test with your own Element Extractor data
 */
async function testWithYourData(extractedData, url) {
    console.log('🔗 Testing with your Element Extractor data...');
    
    const integration = new ElementExtractorPlaywrightIntegration({ headless: false });
    
    try {
        const results = await integration.validateElementExtractorOutput(extractedData, url);
        
        console.log('\n📊 Your Data Validation Summary:');
        console.log(`   Total elements: ${results.report.summary.total}`);
        console.log(`   Playwright compatible: ${results.report.summary.compatible} (${results.report.summary.compatibilityRate}%)`);
        console.log(`   Average score: ${results.report.summary.averageScore}%`);
        console.log(`   Improvements suggested: ${results.improvements.length}`);
        
        // Export enhanced version
        const enhanced = await integration.generateEnhancedOutput(extractedData, url);
        integration.exportEnhancedToCsv(enhanced.enhancedData, 'your-enhanced-data.csv');
        
        return results;
        
    } catch (error) {
        console.error('❌ Testing with your data failed:', error);
        return null;
    } finally {
        await integration.cleanup();
    }
}

// Export functions for use in other scripts
module.exports = {
    runCompleteTest,
    quickValidateLocator,
    testWithYourData,
    ElementExtractorPlaywrightIntegration
};

// Run the complete test if this script is executed directly
if (require.main === module) {
    runCompleteTest().then(() => {
        console.log('\n🎉 All tests completed! Check the generated CSV file for enhanced data.');
        process.exit(0);
    }).catch(error => {
        console.error('💥 Test suite failed:', error);
        process.exit(1);
    });
}

// Make functions available globally for easy console use
if (typeof global !== 'undefined') {
    global.quickValidateLocator = quickValidateLocator;
    global.testWithYourData = testWithYourData;
    global.runCompleteTest = runCompleteTest;
}
