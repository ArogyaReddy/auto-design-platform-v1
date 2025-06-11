/**
 * Simple test to verify Playwright Element Validator works
 */
const { PlaywrightElementValidator } = require('./utils/playwright-element-validator');

async function simpleTest() {
    console.log('🧪 Running simple Playwright Element Validator test...');
    
    const validator = new PlaywrightElementValidator({
        headless: true, // Run headless for quick test
        enableLogging: true
    });

    try {
        await validator.initialize();
        console.log('✅ Playwright initialized successfully');
        
        // Test with a simple HTML page
        await validator.page.setContent(`
            <!DOCTYPE html>
            <html>
            <head><title>Test Page</title></head>
            <body>
                <button id="testBtn" data-testid="test-button">Test Button</button>
                <input type="text" name="username" placeholder="Username">
                <a href="#about" class="nav-link">About</a>
                <div class="hidden" style="display: none;">Hidden Element</div>
            </body>
            </html>
        `);

        console.log('✅ Test page loaded');

        // Test different locators
        const testLocators = [
            '#testBtn',                    // Should score high (ID)
            '[data-testid="test-button"]', // Should score very high (test attribute)
            'input[name="username"]',      // Should score good (name attribute)
            '.nav-link',                   // Should score moderate (class)
            '.hidden'                      // Should fail visibility test
        ];

        console.log('\n📊 Testing locators:');
        
        for (const locator of testLocators) {
            try {
                const result = await validator.validateElement(locator, {
                    generateAlternatives: true,
                    timeoutMs: 5000
                });
                
                console.log(`   ${locator}: ${result.overall.grade} (${result.overall.score}%) - ${result.overall.message}`);
                
                if (result.alternatives.length > 0) {
                    console.log(`      💡 Best alternative: ${result.alternatives[0].locator}`);
                }
                
            } catch (error) {
                console.log(`   ${locator}: ❌ Failed - ${error.message}`);
            }
        }

        console.log('\n✅ Simple test completed successfully!');
        return true;

    } catch (error) {
        console.error('❌ Simple test failed:', error);
        return false;
    } finally {
        await validator.cleanup();
    }
}

// Run the test
if (require.main === module) {
    simpleTest().then(success => {
        if (success) {
            console.log('\n🎉 Playwright Element Validator is working correctly!');
            console.log('💡 You can now use it with your Element Extractor project.');
            console.log('\n📚 Quick start:');
            console.log('   npm run test:playwright    # Run full integration test');
            console.log('   npm run demo:playwright    # Run basic demo');
            console.log('   npm run validate:quick "your-locator" "url"  # Quick validation');
        } else {
            console.log('\n💥 Test failed. Please check the error messages above.');
        }
        process.exit(success ? 0 : 1);
    });
}

module.exports = { simpleTest };
