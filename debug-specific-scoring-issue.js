/**
 * Debug Specific Scoring Issue - 95% vs 40% Discrepancy
 * 
 * This script specifically analyzes the current issue with element [id="signin.securepopTextBtnId"]
 * where Element Extractor shows 95% but Playwright validation shows only 40%.
 */

// Import required modules
const ScoringAlignmentFix = require('./utils/scoring-alignment-fix');

class SpecificScoringDebugger {
    constructor() {
        this.alignmentFix = new ScoringAlignmentFix();
        this.alignmentFix.setDebugMode(true);
    }

    /**
     * Debug the specific 95% vs 40% case
     */
    debugCurrentIssue() {
        console.log('🐛 DEBUGGING SPECIFIC SCORING ISSUE');
        console.log('====================================');
        console.log('Element: [id="signin.securepopTextBtnId"]');
        console.log('Issue: Element Extractor 95% vs Playwright 40% (55% discrepancy)');
        console.log('');

        // Recreate the problematic scenario
        const elementExtractorResult = {
            locator: '[id="signin.securepopTextBtnId"]',
            type: 'ID',
            strength: 95
        };

        // Based on a 40% Playwright score, this likely indicates serious issues
        const playwrightResult = {
            locator: '[id="signin.securepopTextBtnId"]',
            overall: { 
                score: 40, 
                grade: 'D', 
                passed: false 
            },
            tests: {
                existence: { passed: true, score: 20 },
                visibility: { passed: false, score: 0 },      // Likely issue
                clickability: { passed: false, score: 0 },   // Likely issue
                enabled: { passed: true, score: 15 },
                text: { passed: false, score: 0 },           // Likely issue
                locatorQuality: { passed: true, score: 5, rating: 'FAIR' }
            },
            alternatives: []
        };

        console.log('RECONSTRUCTED SCENARIO:');
        console.log('  Element Extractor:', elementExtractorResult.strength + '%');
        console.log('  Playwright:', playwrightResult.overall.score + '%');
        console.log('  Discrepancy:', Math.abs(elementExtractorResult.strength - playwrightResult.overall.score) + '%');
        console.log('');

        // Analyze what's happening
        const analysis = this.alignmentFix.analyzeDiscrepancy(elementExtractorResult, playwrightResult);
        
        console.log('DISCREPANCY ANALYSIS:');
        console.log('  Recommended Approach:', analysis.recommendedApproach);
        console.log('  Reasons for discrepancy:');
        analysis.reasons.forEach(reason => {
            console.log(`    - ${reason.message} (${reason.impact} impact)`);
        });
        console.log('');

        // Test all alignment strategies
        console.log('ALIGNMENT STRATEGY TESTING:');
        const strategies = ['element-extractor-priority', 'playwright-priority', 'hybrid'];
        
        strategies.forEach(strategy => {
            this.alignmentFix.setAlignmentStrategy(strategy);
            const alignment = this.alignmentFix.alignScoring(elementExtractorResult, playwrightResult);
            
            console.log(`\n  ${strategy.toUpperCase()}:`);
            console.log(`    Aligned Score: ${alignment.alignedScore}%`);
            console.log(`    Grade: ${alignment.alignedGrade}`);
            console.log(`    Reasoning: ${alignment.reasoning}`);
            if (alignment.adjustments.length > 0) {
                console.log(`    Adjustments: ${alignment.adjustments.join(', ')}`);
            }
            
            const newDiscrepancy = Math.abs(alignment.alignedScore - playwrightResult.overall.score);
            console.log(`    Reduced Discrepancy: ${55 - newDiscrepancy}% improvement`);
        });
    }

    /**
     * Identify why Playwright is scoring so low (40%)
     */
    analyzePlaywrightIssues() {
        console.log('\n🔍 PLAYWRIGHT LOW SCORE ANALYSIS');
        console.log('================================');
        
        console.log('Possible reasons for 40% Playwright score:');
        console.log('  1. ❌ Element not visible (visibility test failed)');
        console.log('  2. ❌ Element not clickable (clickability test failed)');
        console.log('  3. ❌ Element has no text content (text test failed)');
        console.log('  4. ⚠️  Element might be in shadow DOM or iframe');
        console.log('  5. ⚠️  Element might be dynamically loaded');
        console.log('  6. ⚠️  Element might be covered by another element');
        console.log('  7. ⚠️  Element might be disabled or readonly');
        console.log('');
        
        console.log('Recommendations:');
        console.log('  ✅ Check if element exists in DOM');
        console.log('  ✅ Verify element visibility (display, opacity, etc.)');
        console.log('  ✅ Test element clickability (pointer-events, z-index)');
        console.log('  ✅ Confirm element is enabled/interactive');
        console.log('  ✅ Validate locator accuracy');
    }

    /**
     * Test different ID-based scenarios
     */
    testIdBasedScenarios() {
        console.log('\n🧪 ID-BASED ELEMENT TESTING');
        console.log('===========================');

        const scenarios = [
            {
                name: 'Perfect ID Element',
                ee: 95,
                pw: { score: 95, visibility: true, clickability: true, text: true }
            },
            {
                name: 'ID Element - Not Visible',
                ee: 95,
                pw: { score: 55, visibility: false, clickability: false, text: true }
            },
            {
                name: 'ID Element - Not Clickable',
                ee: 95,
                pw: { score: 65, visibility: true, clickability: false, text: true }
            },
            {
                name: 'Current Issue - Multiple Failures',
                ee: 95,
                pw: { score: 40, visibility: false, clickability: false, text: false }
            }
        ];

        scenarios.forEach(scenario => {
            console.log(`\n  ${scenario.name}:`);
            
            const eeResult = {
                locator: '[id="signin.securepopTextBtnId"]',
                type: 'ID',
                strength: scenario.ee
            };

            const pwResult = {
                locator: '[id="signin.securepopTextBtnId"]',
                overall: { score: scenario.pw.score, grade: 'varies', passed: scenario.pw.score > 60 },
                tests: {
                    existence: { passed: true, score: 20 },
                    visibility: { passed: scenario.pw.visibility, score: scenario.pw.visibility ? 20 : 0 },
                    clickability: { passed: scenario.pw.clickability, score: scenario.pw.clickability ? 15 : 0 },
                    enabled: { passed: true, score: 15 },
                    text: { passed: scenario.pw.text, score: scenario.pw.text ? 10 : 0 },
                    locatorQuality: { passed: true, score: 15, rating: 'EXCELLENT' }
                }
            };

            this.alignmentFix.setAlignmentStrategy('hybrid');
            const alignment = this.alignmentFix.alignScoring(eeResult, pwResult);
            
            console.log(`    Original: EE ${scenario.ee}% vs PW ${scenario.pw.score}%`);
            console.log(`    Aligned: ${alignment.alignedScore}% (${alignment.strategy})`);
            console.log(`    Improvement: ${Math.abs(scenario.ee - scenario.pw.score) - Math.abs(alignment.alignedScore - scenario.pw.score)}% reduction`);
        });
    }

    /**
     * Simulate alignment working correctly
     */
    simulateCorrectAlignment() {
        console.log('\n✅ EXPECTED ALIGNMENT BEHAVIOR');
        console.log('===============================');
        
        const elementExtractorResult = {
            locator: '[id="signin.securepopTextBtnId"]',
            type: 'ID',
            strength: 95
        };

        const playwrightResult = {
            locator: '[id="signin.securepopTextBtnId"]',
            overall: { score: 40, grade: 'D', passed: false },
            tests: {
                existence: { passed: true, score: 20 },
                visibility: { passed: false, score: 0 },
                clickability: { passed: false, score: 0 },
                enabled: { passed: true, score: 15 },
                text: { passed: false, score: 0 },
                locatorQuality: { passed: true, score: 5, rating: 'FAIR' }
            }
        };

        this.alignmentFix.setAlignmentStrategy('hybrid');
        const alignment = this.alignmentFix.alignScoring(elementExtractorResult, playwrightResult);
        
        console.log('Expected alignment behavior:');
        console.log(`  Input: EE 95% vs PW 40% (55% discrepancy)`);
        console.log(`  Output: ${alignment.alignedScore}% (${alignment.strategy})`);
        console.log(`  New Discrepancy: ${Math.abs(alignment.alignedScore - playwrightResult.overall.score)}%`);
        console.log(`  Improvement: ${55 - Math.abs(alignment.alignedScore - playwrightResult.overall.score)}% reduction`);
        console.log(`  Reasoning: ${alignment.reasoning}`);
        console.log(`  Adjustments: ${alignment.adjustments.join(', ')}`);
        
        console.log('\nKey points:');
        console.log('  ✅ Alignment should prioritize Playwright for serious interaction failures');
        console.log('  ✅ ID selector bonus should be limited when element has critical issues');
        console.log('  ✅ Final score should reflect real usability concerns');
        console.log('  ✅ Should prevent misleading high scores for broken elements');
    }
}

// Run the debug analysis
if (require.main === module) {
    const scorer = new SpecificScoringDebugger();
    
    scorer.debugCurrentIssue();
    scorer.analyzePlaywrightIssues();
    scorer.testIdBasedScenarios();
    scorer.simulateCorrectAlignment();
    
    console.log('\n🔧 NEXT STEPS:');
    console.log('1. Verify scoring alignment is actually being called in the popup');
    console.log('2. Check browser console logs for alignment messages');
    console.log('3. Test with the actual element to see real Playwright test results');
    console.log('4. Ensure scoring integration is properly initialized');
}

module.exports = SpecificScoringDebugger;
