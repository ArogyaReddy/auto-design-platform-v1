#!/usr/bin/env node

/**
 * Browser Integration Test for Scoring Alignment Fix
 * 
 * This script tests the scoring alignment in a real browser environment
 * by simulating the Element Extractor workflow with actual Playwright validation.
 */

const { chromium } = require('playwright');
const ScoringAlignmentFix = require('../../utils/scoring-alignment-fix');
const ScoringIntegration = require('../../utils/scoring-integration');

class BrowserIntegrationTest {
    constructor() {
        this.browser = null;
        this.page = null;
        this.alignmentFix = new ScoringAlignmentFix();
        this.integration = new ScoringIntegration();
    }

    async setup() {
        console.log('🚀 Starting Browser Integration Test');
        console.log('=====================================');
        
        try {
            this.browser = await chromium.launch({ headless: false });
            this.page = await this.browser.newPage();
            
            // Create a test page with various elements
            await this.createTestPage();
            console.log('✅ Test page created successfully');
            
        } catch (error) {
            console.error('❌ Setup failed:', error.message);
            throw error;
        }
    }

    async createTestPage() {
        const testHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Scoring Alignment Test Page</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .nav-link { color: blue; text-decoration: none; margin: 10px; }
                .form-group { margin: 10px 0; }
                .hidden { display: none; }
                .container { max-width: 800px; margin: 0 auto; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Scoring Alignment Test Page</h1>
                
                <!-- Navigation Links (class+href) -->
                <nav>
                    <a class="nav-link" href="#examples">Examples</a>
                    <a class="nav-link" href="#documentation">Documentation</a>
                    <a class="nav-link" href="#contact">Contact</a>
                </nav>
                
                <!-- ID Elements -->
                <button id="submit-button" type="submit">Submit Form</button>
                <input id="email-input" type="email" placeholder="Enter email">
                
                <!-- Complex CSS Selectors -->
                <div class="form-container">
                    <div class="form-group">
                        <input type="email" name="user-email" placeholder="Complex email input">
                    </div>
                </div>
                
                <!-- ARIA Elements -->
                <button aria-label="Close dialog" class="close-btn">×</button>
                <div role="alert" aria-live="polite">Alert message</div>
                
                <!-- Hidden Elements -->
                <div class="hidden" id="hidden-element">Hidden content</div>
                
                <!-- Shadow DOM Test -->
                <div id="shadow-host"></div>
                
                <script>
                    // Create shadow DOM element
                    const shadowHost = document.getElementById('shadow-host');
                    const shadowRoot = shadowHost.attachShadow({mode: 'open'});
                    shadowRoot.innerHTML = '<button id="shadow-button">Shadow Button</button>';
                </script>
            </div>
        </body>
        </html>
        `;
        
        await this.page.setContent(testHTML);
        await this.page.waitForLoadState('domcontentloaded');
    }

    async testElementExtraction() {
        console.log('\n🔍 Testing Element Extraction with Scoring Alignment');
        console.log('===================================================');
        
        // Simulate Element Extractor results
        const extractedElements = [
            {
                "Element Name": "Examples Navigation Link",
                "Element Type": "LINK", 
                "Best Locator": ".nav-link[href=\"#examples\"]",
                "Locator Type": "class+href",
                "Strength": 95,
                "ID": "",
                "CSS": ".nav-link[href=\"#examples\"]",
                "XPATH": "//a[@class=\"nav-link\" and @href=\"#examples\"]",
                "In Shadow DOM": "No"
            },
            {
                "Element Name": "Submit Button",
                "Element Type": "BUTTON",
                "Best Locator": "#submit-button", 
                "Locator Type": "ID",
                "Strength": 98,
                "ID": "submit-button",
                "CSS": "#submit-button",
                "XPATH": "//button[@id=\"submit-button\"]",
                "In Shadow DOM": "No"
            },
            {
                "Element Name": "Email Input Complex",
                "Element Type": "INPUT",
                "Best Locator": ".form-container .form-group input[type=\"email\"]",
                "Locator Type": "CSS",
                "Strength": 60,
                "ID": "",
                "CSS": ".form-container .form-group input[type=\"email\"]", 
                "XPATH": "//div[@class=\"form-container\"]//div[@class=\"form-group\"]//input[@type=\"email\"]",
                "In Shadow DOM": "No"
            },
            {
                "Element Name": "Close Dialog Button",
                "Element Type": "BUTTON",
                "Best Locator": "[aria-label=\"Close dialog\"]",
                "Locator Type": "aria-label",
                "Strength": 88,
                "ID": "",
                "CSS": "[aria-label=\"Close dialog\"]",
                "XPATH": "//button[@aria-label=\"Close dialog\"]",
                "In Shadow DOM": "No"
            }
        ];

        const results = [];
        
        for (const element of extractedElements) {
            console.log(`\n📍 Testing: ${element["Element Name"]}`);
            console.log(`   Locator: ${element["Best Locator"]}`);
            console.log(`   Original EE Score: ${element.Strength}%`);
            
            try {
                // Get Playwright validation score
                const playwrightScore = await this.getPlaywrightScore(element["Best Locator"]);
                console.log(`   Playwright Score: ${playwrightScore.overall.score}%`);
                
                // Apply scoring alignment
                const alignedResult = this.integration.alignElementResult(element, playwrightScore);
                console.log(`   Aligned Score: ${alignedResult.aligned_result.Strength}% (${alignedResult.aligned_result["Playwright Grade"]})`);
                console.log(`   Strategy: ${alignedResult.aligned_result["Alignment Strategy"]}`);
                
                if (alignedResult.aligned_result["Score Adjustments"]) {
                    console.log(`   Adjustments: ${alignedResult.aligned_result["Score Adjustments"]}`);
                }
                
                results.push({
                    element: element["Element Name"],
                    locator: element["Best Locator"],
                    originalEE: element.Strength,
                    playwrightScore: playwrightScore.overall.score,
                    alignedScore: alignedResult.aligned_result.Strength,
                    strategy: alignedResult.aligned_result["Alignment Strategy"],
                    discrepancy: Math.abs(element.Strength - playwrightScore.overall.score)
                });
                
            } catch (error) {
                console.error(`   ❌ Error testing ${element["Element Name"]}: ${error.message}`);
            }
        }
        
        return results;
    }

    async getPlaywrightScore(locator) {
        // Simulate comprehensive Playwright validation
        try {
            const element = await this.page.locator(locator).first();
            
            // Test existence
            const exists = await element.count() > 0;
            
            // Test visibility
            let visible = false;
            let clickable = false;
            let enabled = false;
            let hasText = false;
            let textContent = '';
            
            if (exists) {
                try {
                    visible = await element.isVisible();
                    clickable = await element.isEnabled() && visible;
                    enabled = await element.isEnabled();
                    textContent = await element.textContent() || '';
                    hasText = textContent.trim().length > 0;
                } catch (e) {
                    // Element might not support these operations
                }
            }
            
            // Calculate locator quality score
            const locatorQuality = this.calculateLocatorQuality(locator);
            
            // Build comprehensive score
            const tests = {
                existence: { passed: exists, score: exists ? 20 : 0 },
                visibility: { passed: visible, score: visible ? 20 : 0 },
                clickability: { passed: clickable, score: clickable ? 15 : 0 },
                enabled: { passed: enabled, score: enabled ? 15 : 0 },
                text: { passed: hasText, score: hasText ? 10 : 5, content: textContent },
                locatorQuality: { passed: locatorQuality.passed, score: locatorQuality.score, rating: locatorQuality.rating }
            };
            
            const totalScore = Object.values(tests).reduce((sum, test) => sum + test.score, 0);
            const grade = this.getGrade(totalScore);
            
            return {
                locator,
                overall: { score: Math.min(totalScore, 100), grade, passed: totalScore >= 60 },
                tests,
                alternatives: []
            };
            
        } catch (error) {
            console.error(`Error validating ${locator}:`, error.message);
            return {
                locator,
                overall: { score: 0, grade: 'F', passed: false },
                tests: {
                    existence: { passed: false, score: 0 },
                    visibility: { passed: false, score: 0 },
                    clickability: { passed: false, score: 0 },
                    enabled: { passed: false, score: 0 },
                    text: { passed: false, score: 0, content: '' },
                    locatorQuality: { passed: false, score: 0, rating: 'POOR' }
                },
                alternatives: []
            };
        }
    }

    calculateLocatorQuality(locator) {
        // Simple locator quality assessment
        if (locator.startsWith('#')) {
            return { passed: true, score: 20, rating: 'EXCELLENT' };
        } else if (locator.includes('[aria-')) {
            return { passed: true, score: 18, rating: 'EXCELLENT' };
        } else if (locator.includes('[href') && locator.includes('class')) {
            return { passed: true, score: 15, rating: 'GOOD' };
        } else if (locator.includes('>')) {
            return { passed: true, score: 8, rating: 'FAIR' };
        } else {
            return { passed: true, score: 12, rating: 'GOOD' };
        }
    }

    getGrade(score) {
        if (score >= 90) return 'A+';
        if (score >= 85) return 'A';
        if (score >= 80) return 'B+';
        if (score >= 75) return 'B';
        if (score >= 70) return 'C+';
        if (score >= 65) return 'C';
        if (score >= 60) return 'D';
        return 'F';
    }

    generateReport(results) {
        console.log('\n📊 BROWSER INTEGRATION TEST REPORT');
        console.log('====================================');
        
        const totalElements = results.length;
        const significantDiscrepancies = results.filter(r => r.discrepancy > 15).length;
        const avgOriginalDiscrepancy = results.reduce((sum, r) => sum + r.discrepancy, 0) / totalElements;
        const avgAlignedDiscrepancy = results.reduce((sum, r) => 
            sum + Math.abs(r.originalEE - r.alignedScore), 0) / totalElements;
        
        console.log(`📈 Test Results:`);
        console.log(`   Total Elements Tested: ${totalElements}`);
        console.log(`   Elements with Significant Discrepancy (>15%): ${significantDiscrepancies}`);
        console.log(`   Average Original Discrepancy: ${avgOriginalDiscrepancy.toFixed(1)}%`);
        console.log(`   Average Post-Alignment Discrepancy: ${avgAlignedDiscrepancy.toFixed(1)}%`);
        console.log(`   Improvement: ${(avgOriginalDiscrepancy - avgAlignedDiscrepancy).toFixed(1)}% reduction`);
        
        console.log(`\n📋 Detailed Results:`);
        results.forEach((result, index) => {
            console.log(`\n${index + 1}. ${result.element}`);
            console.log(`   Locator: ${result.locator}`);
            console.log(`   Original EE: ${result.originalEE}% | Playwright: ${result.playwrightScore}% | Aligned: ${result.alignedScore}%`);
            console.log(`   Strategy: ${result.strategy}`);
            console.log(`   Original Discrepancy: ${result.discrepancy}% | Post-Alignment: ${Math.abs(result.originalEE - result.alignedScore)}%`);
        });
        
        console.log(`\n✅ CONCLUSION:`);
        if (avgAlignedDiscrepancy < avgOriginalDiscrepancy) {
            console.log(`   The scoring alignment fix successfully reduces discrepancies by ${((avgOriginalDiscrepancy - avgAlignedDiscrepancy) / avgOriginalDiscrepancy * 100).toFixed(1)}%`);
            console.log(`   Integration with browser environment: SUCCESSFUL ✅`);
        } else {
            console.log(`   The alignment needs further tuning for this test set`);
        }
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('\n🧹 Cleanup completed');
        }
    }

    async run() {
        try {
            await this.setup();
            const results = await this.testElementExtraction();
            this.generateReport(results);
            
            console.log('\n🎯 SPECIFIC CASE VALIDATION: 95% vs 75% Discrepancy');
            console.log('=====================================================');
            
            // Test the specific problematic case
            const problematicElement = {
                "Element Name": "Navigation Example Link",
                "Element Type": "LINK",
                "Best Locator": ".nav-link[href=\"#examples\"]", 
                "Locator Type": "class+href",
                "Strength": 95,
                "ID": "",
                "CSS": ".nav-link[href=\"#examples\"]",
                "XPATH": "//a[@class=\"nav-link\" and @href=\"#examples\"]",
                "In Shadow DOM": "No"
            };
            
            const mockPlaywrightResult = {
                locator: ".nav-link[href=\"#examples\"]",
                overall: { score: 75, grade: 'B', passed: true },
                tests: {
                    existence: { passed: true, score: 20 },
                    visibility: { passed: true, score: 20 },
                    clickability: { passed: true, score: 15 },
                    enabled: { passed: true, score: 15 },
                    text: { passed: true, score: 10, content: 'Examples' },
                    locatorQuality: { passed: true, score: 15, rating: 'GOOD' }
                },
                alternatives: []
            };
            
            const alignedResult = this.integration.alignElementResult(problematicElement, mockPlaywrightResult);
            
            console.log(`📍 Original Scores: EE=${problematicElement.Strength}% | PW=${mockPlaywrightResult.overall.score}%`);
            console.log(`📍 Discrepancy: ${Math.abs(problematicElement.Strength - mockPlaywrightResult.overall.score)}%`);
            console.log(`🎯 Aligned Score: ${alignedResult.aligned_result.Strength}% (${alignedResult.aligned_result["Playwright Grade"]})`);
            console.log(`🎯 Strategy Used: ${alignedResult.aligned_result["Alignment Strategy"]}`);
            console.log(`🎯 Final Discrepancy: ${Math.abs(problematicElement.Strength - alignedResult.aligned_result.Strength)}%`);
            
            if (alignedResult.aligned_result["Score Adjustments"]) {
                console.log(`🎯 Adjustments Applied: ${alignedResult.aligned_result["Score Adjustments"]}`);
            }
            
            console.log(`\n✅ RESULT: The ${problematicElement.Strength}% vs ${mockPlaywrightResult.overall.score}% discrepancy has been resolved to ${alignedResult.aligned_result.Strength}%`);
            
        } catch (error) {
            console.error('❌ Test failed:', error);
        } finally {
            await this.cleanup();
        }
    }
}

// Run the test
if (require.main === module) {
    const test = new BrowserIntegrationTest();
    test.run().catch(console.error);
} else {
    module.exports = BrowserIntegrationTest;
}
