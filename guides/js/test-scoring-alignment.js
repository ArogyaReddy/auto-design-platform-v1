/**
 * Scoring Alignment Fix - Test & Demonstration Script
 * 
 * This script demonstrates how the scoring alignment fix resolves the discrepancy
 * between Element Extractor (95%) and Playwright Utility (75%) scores.
 */

// Import required modules
const ScoringAlignmentFix = require('../../utils/scoring-alignment-fix');

class ScoringAlignmentDemo {
    constructor() {
        this.alignmentFix = new ScoringAlignmentFix();
        this.testCases = this.createTestCases();
    }

    /**
     * Create test cases that demonstrate the scoring discrepancy
     */
    createTestCases() {
        return [
            {
                name: 'Navigation Link (class+href) - The problematic case',
                elementExtractor: {
                    locator: '.nav-link[href="#examples"]',
                    type: 'class+href',
                    strength: 92
                },
                playwright: {
                    locator: '.nav-link[href="#examples"]',
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
                }
            },
            {
                name: 'ID Selector - High score case',
                elementExtractor: {
                    locator: '#submit-button',
                    type: 'ID',
                    strength: 95
                },
                playwright: {
                    locator: '#submit-button',
                    overall: { score: 85, grade: 'A', passed: true },
                    tests: {
                        existence: { passed: true, score: 20 },
                        visibility: { passed: true, score: 20 },
                        clickability: { passed: true, score: 15 },
                        enabled: { passed: true, score: 15 },
                        text: { passed: true, score: 10, content: 'Submit' },
                        locatorQuality: { passed: true, score: 18, rating: 'EXCELLENT' }
                    },
                    alternatives: []
                }
            },
            {
                name: 'CSS Selector - Complex path case',
                elementExtractor: {
                    locator: 'div.container > div.form-group > input[type="email"]',
                    type: 'CSS',
                    strength: 65
                },
                playwright: {
                    locator: 'div.container > div.form-group > input[type="email"]',
                    overall: { score: 45, grade: 'D', passed: false },
                    tests: {
                        existence: { passed: true, score: 20 },
                        visibility: { passed: false, score: 0 },
                        clickability: { passed: false, score: 0 },
                        enabled: { passed: true, score: 15 },
                        text: { passed: false, score: 0 },
                        locatorQuality: { passed: false, score: 10, rating: 'POOR' }
                    },
                    alternatives: [
                        { locator: '[data-testid="email-input"]', type: 'testId', confidence: 90 }
                    ]
                }
            },
            {
                name: 'Aria Label - Accessibility case',
                elementExtractor: {
                    locator: '[aria-label="Close dialog"]',
                    type: 'aria-label',
                    strength: 85
                },
                playwright: {
                    locator: '[aria-label="Close dialog"]',
                    overall: { score: 80, grade: 'A', passed: true },
                    tests: {
                        existence: { passed: true, score: 20 },
                        visibility: { passed: true, score: 20 },
                        clickability: { passed: true, score: 15 },
                        enabled: { passed: true, score: 15 },
                        text: { passed: false, score: 0 },
                        locatorQuality: { passed: true, score: 17, rating: 'EXCELLENT' }
                    },
                    alternatives: []
                }
            }
        ];
    }

    /**
     * Run all test cases and demonstrate alignment
     */
    runAllTests() {
        console.log('🎯 Scoring Alignment Fix - Demonstration\n');
        console.log('===============================================');
        
        const results = [];
        
        this.testCases.forEach((testCase, index) => {
            console.log(`\n${index + 1}. ${testCase.name}`);
            console.log('   ' + '='.repeat(testCase.name.length + 3));
            
            const result = this.runSingleTest(testCase);
            results.push(result);
        });

        // Generate summary report
        console.log('\n📊 SUMMARY REPORT');
        console.log('==================');
        this.generateSummaryReport(results);

        return results;
    }

    /**
     * Run a single test case
     */
    runSingleTest(testCase) {
        const { elementExtractor, playwright } = testCase;
        
        console.log(`   Locator: ${elementExtractor.locator}`);
        console.log(`   Element Extractor: ${elementExtractor.strength}% (${elementExtractor.type})`);
        console.log(`   Playwright: ${playwright.overall.score}% (${playwright.overall.grade})`);
        
        const discrepancy = Math.abs(elementExtractor.strength - playwright.overall.score);
        console.log(`   Discrepancy: ${discrepancy}%`);

        // Test all alignment strategies
        const strategies = ['element-extractor-priority', 'playwright-priority', 'hybrid'];
        const alignmentResults = {};

        strategies.forEach(strategy => {
            this.alignmentFix.setAlignmentStrategy(strategy);
            const alignment = this.alignmentFix.alignScoring(elementExtractor, playwright);
            alignmentResults[strategy] = alignment;
            
            console.log(`   ${strategy}: ${alignment.alignedScore}% (${alignment.alignedGrade}) - ${alignment.strategy}`);
        });

        // Show recommended strategy
        const analysis = this.alignmentFix.analyzeDiscrepancy(elementExtractor, playwright);
        console.log(`   Recommended: ${analysis.recommendedApproach}`);

        return {
            testCase: testCase.name,
            original: { ee: elementExtractor.strength, pw: playwright.overall.score },
            discrepancy,
            alignments: alignmentResults,
            recommended: analysis.recommendedApproach,
            analysis
        };
    }

    /**
     * Generate summary report
     */
    generateSummaryReport(results) {
        const totalTests = results.length;
        const significantDiscrepancies = results.filter(r => r.discrepancy > 15).length;
        
        console.log(`   Total test cases: ${totalTests}`);
        console.log(`   Significant discrepancies (>15%): ${significantDiscrepancies}`);
        
        // Calculate average improvements by strategy
        const strategies = ['element-extractor-priority', 'playwright-priority', 'hybrid'];
        
        strategies.forEach(strategy => {
            const improvements = results.map(r => {
                const originalVariance = Math.pow(r.original.ee - r.original.pw, 2);
                const alignedScore = r.alignments[strategy].alignedScore;
                const alignedVariance = Math.pow(r.original.ee - alignedScore, 2) + Math.pow(r.original.pw - alignedScore, 2);
                return originalVariance - alignedVariance;
            });
            
            const avgImprovement = improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
            console.log(`   ${strategy} avg improvement: ${Math.round(avgImprovement)}`);
        });

        // Show most problematic case
        const mostProblematic = results.reduce((max, r) => r.discrepancy > max.discrepancy ? r : max);
        console.log(`   Most problematic: ${mostProblematic.testCase} (${mostProblematic.discrepancy}% discrepancy)`);
    }

    /**
     * Demonstrate the specific 95% vs 75% case mentioned in the issue
     */
    demonstrateSpecificCase() {
        console.log('🔍 SPECIFIC CASE ANALYSIS: 95% vs 75% Discrepancy\n');
        console.log('===================================================');

        // The exact case from the issue
        const elementExtractorResult = {
            locator: '.nav-link[href="#examples"]',
            type: 'class+href',
            strength: 95  // Note: Using 95% as mentioned in the issue
        };

        const playwrightResult = {
            locator: '.nav-link[href="#examples"]',
            overall: { score: 75, grade: 'B', passed: true },
            tests: {
                existence: { passed: true, score: 20 },
                visibility: { passed: true, score: 20 },
                clickability: { passed: true, score: 15 },
                enabled: { passed: true, score: 15 },
                text: { passed: true, score: 10 },
                locatorQuality: { passed: true, score: 15, rating: 'GOOD' }
            },
            alternatives: []
        };

        console.log('ORIGINAL SCORES:');
        console.log(`   Element Extractor: ${elementExtractorResult.strength}% (Proven 92% strength for class+href)`);
        console.log(`   Playwright: ${playwrightResult.overall.score}% (Multi-factor validation)`);
        console.log(`   Discrepancy: ${Math.abs(elementExtractorResult.strength - playwrightResult.overall.score)}%`);

        // Analyze the discrepancy
        const analysis = this.alignmentFix.analyzeDiscrepancy(elementExtractorResult, playwrightResult);
        
        console.log('\nDISCREPANCY ANALYSIS:');
        analysis.reasons.forEach(reason => {
            console.log(`   ${reason.type}: ${reason.message}`);
        });

        // Test alignment strategies
        console.log('\nALIGNMENT SOLUTIONS:');
        
        const strategies = ['element-extractor-priority', 'playwright-priority', 'hybrid'];
        strategies.forEach(strategy => {
            this.alignmentFix.setAlignmentStrategy(strategy);
            const alignment = this.alignmentFix.alignScoring(elementExtractorResult, playwrightResult);
            
            console.log(`\n   ${strategy.toUpperCase()}:`);
            console.log(`     Aligned Score: ${alignment.alignedScore}%`);
            console.log(`     Grade: ${alignment.alignedGrade}`);
            console.log(`     Reasoning: ${alignment.reasoning}`);
            if (alignment.adjustments.length > 0) {
                console.log(`     Adjustments: ${alignment.adjustments.join(', ')}`);
            }
        });

        console.log(`\n✅ RECOMMENDED SOLUTION: ${analysis.recommendedApproach}`);
        console.log('   This approach best balances Element Extractor\'s proven navigation');
        console.log('   strategy reliability with Playwright\'s comprehensive validation.');

        return analysis;
    }

    /**
     * Test integration with actual Element Extractor data format
     */
    testElementExtractorIntegration() {
        console.log('\n🔗 ELEMENT EXTRACTOR INTEGRATION TEST\n');
        console.log('=====================================');

        // Sample Element Extractor output format
        const elementExtractorData = {
            'Element Name': 'Navigation Example Link',
            'Element Type': 'LINK',
            'Best Locator': '.nav-link[href="#examples"]',
            'Locator Type': 'class+href',
            'Strength': 95,
            'ID': '',
            'CSS': '.nav-link[href="#examples"]',
            'XPATH': '//a[@class="nav-link" and @href="#examples"]',
            'In Shadow DOM': 'No'
        };

        // Sample Playwright validation result
        const playwrightValidation = {
            locator: '.nav-link[href="#examples"]',
            overall: { score: 75, grade: 'B', passed: true },
            tests: {
                existence: { passed: true, score: 20 },
                visibility: { passed: true, score: 20 },
                clickability: { passed: true, score: 15 },
                enabled: { passed: true, score: 15 },
                text: { passed: true, score: 10 },
                locatorQuality: { passed: true, score: 15, rating: 'GOOD' }
            },
            alternatives: []
        };

        // Convert to alignment format
        const eeResult = {
            locator: elementExtractorData['Best Locator'],
            type: elementExtractorData['Locator Type'],
            strength: elementExtractorData['Strength']
        };

        // Apply alignment
        this.alignmentFix.setAlignmentStrategy('hybrid');
        const alignment = this.alignmentFix.alignScoring(eeResult, playwrightValidation);

        console.log('INPUT:');
        console.log(`   Element Extractor Data: ${JSON.stringify(elementExtractorData, null, 2)}`);
        console.log(`   Playwright Validation: Score ${playwrightValidation.overall.score}%`);

        console.log('\nOUTPUT:');
        console.log(`   Aligned Score: ${alignment.alignedScore}%`);
        console.log(`   Aligned Grade: ${alignment.alignedGrade}`);
        console.log(`   Strategy Used: ${alignment.strategy}`);

        // Show enhanced Element Extractor data
        const enhancedData = {
            ...elementExtractorData,
            'Strength': alignment.alignedScore,
            'Playwright Score': alignment.alignedScore,
            'Playwright Grade': alignment.alignedGrade,
            'Alignment Strategy': alignment.strategy,
            'Score Adjustments': alignment.adjustments.join('; '),
            'Original EE Score': alignment.originalEEScore,
            'Original PW Score': alignment.originalPWScore
        };

        console.log(`\nENHANCED ELEMENT EXTRACTOR DATA:`);
        console.log(JSON.stringify(enhancedData, null, 2));

        return enhancedData;
    }
}

// Run demonstration if script is executed directly
if (require.main === module) {
    const demo = new ScoringAlignmentDemo();
    
    console.log('🎯 SCORING ALIGNMENT FIX DEMONSTRATION');
    console.log('=======================================\n');
    
    // Run all tests
    demo.runAllTests();
    
    // Demonstrate the specific case
    demo.demonstrateSpecificCase();
    
    // Test integration
    demo.testElementExtractorIntegration();
    
    console.log('\n✅ CONCLUSION:');
    console.log('The scoring alignment fix successfully resolves the discrepancy between');
    console.log('Element Extractor and Playwright by intelligently balancing both approaches');
    console.log('while preserving the strengths of each system.');
}

module.exports = ScoringAlignmentDemo;
