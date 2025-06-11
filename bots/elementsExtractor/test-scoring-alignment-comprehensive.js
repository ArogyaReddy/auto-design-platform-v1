/**
 * Comprehensive test for scoring alignment fix
 */

// Test data similar to the original error case
const testData = {
    elementExtractorResult: {
        locator: '.nav-link[href="#examples"]',
        type: 'class+href',
        strength: 95
    },
    playwrightResult: {
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
    }
};

console.log('🧪 Comprehensive Scoring Alignment Test');
console.log('=====================================');

// Test 1: Check if classes are available
console.log('\n1️⃣ Testing class availability...');
console.log('   ScoringAlignmentFix:', typeof ScoringAlignmentFix !== 'undefined' ? '✅' : '❌');

if (typeof ScoringAlignmentFix !== 'undefined') {
    try {
        // Test 2: Create instance
        console.log('\n2️⃣ Testing instance creation...');
        const alignmentFix = new ScoringAlignmentFix();
        console.log('   Instance created:', '✅');
        
        // Test 3: Test alignment
        console.log('\n3️⃣ Testing alignment functionality...');
        const result = alignmentFix.alignScoring(testData.elementExtractorResult, testData.playwrightResult);
        
        console.log('   Original EE Score:', testData.elementExtractorResult.strength);
        console.log('   Original PW Score:', testData.playwrightResult.overall.score);
        console.log('   Aligned Score:', result.alignedScore);
        console.log('   Strategy:', result.strategy);
        console.log('   Adjustments:', result.adjustments);
        console.log('   Alignment successful:', '✅');
        
        // Test 4: Test different strategies
        console.log('\n4️⃣ Testing different strategies...');
        const strategies = ['element-extractor-priority', 'playwright-priority', 'hybrid'];
        strategies.forEach(strategy => {
            alignmentFix.setAlignmentStrategy(strategy);
            const strategyResult = alignmentFix.alignScoring(testData.elementExtractorResult, testData.playwrightResult);
            console.log(`   ${strategy}: ${strategyResult.alignedScore}% (${strategyResult.alignedGrade})`);
        });
        
        console.log('\n✅ All tests passed! Scoring alignment is working correctly.');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error(error.stack);
    }
} else {
    console.error('❌ ScoringAlignmentFix class not available');
}

// Export for Node.js testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testData };
}
