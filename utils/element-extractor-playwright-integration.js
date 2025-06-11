/**
 * Element Extractor + Playwright Validator Integration
 * 
 * This script integrates the Playwright Element Validator directly with your
 * Element Extractor project to provide enhanced element validation.
 */

const { PlaywrightElementValidator } = require('./utils/playwright-element-validator');

class ElementExtractorPlaywrightIntegration {
    constructor(options = {}) {
        this.validator = new PlaywrightElementValidator({
            headless: false,
            enableLogging: true,
            ...options
        });
        
        this.isInitialized = false;
        this.stats = {
            totalValidations: 0,
            improvedLocators: 0,
            excellentLocators: 0,
            poorLocators: 0
        };
    }

    /**
     * Initialize the integration
     */
    async initialize() {
        if (!this.isInitialized) {
            await this.validator.initialize();
            this.isInitialized = true;
        }
    }

    /**
     * Enhanced validation function specifically for Element Extractor
     */
    async validateElementExtractorLocator(locator, context = {}) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        this.stats.totalValidations++;

        try {
            const result = await this.validator.validateElement(locator, {
                checkVisibility: true,
                checkClickability: true,
                checkEnabled: true,
                checkText: true,
                checkLocatorQuality: true,
                generateAlternatives: true
            });

            // Add Element Extractor specific analysis
            result.elementExtractorAnalysis = this.analyzeForElementExtractor(result, locator, context);
            
            // Track statistics
            if (result.overall.score >= 80) {
                this.stats.excellentLocators++;
            } else if (result.overall.score < 40) {
                this.stats.poorLocators++;
            }

            if (result.elementExtractorAnalysis.suggestedImprovement) {
                this.stats.improvedLocators++;
            }

            return result;

        } catch (error) {
            console.error(`❌ Validation failed for locator: ${locator}`, error);
            return {
                locator,
                error: error.message,
                overall: { passed: false, score: 0, grade: 'F', message: 'Validation failed' },
                elementExtractorAnalysis: {
                    compatible: false,
                    recommendation: 'Fix validation errors first'
                }
            };
        }
    }

    /**
     * Analyze validation results specifically for Element Extractor context
     */
    analyzeForElementExtractor(result, originalLocator, context) {
        const analysis = {
            originalLocator,
            playwrightCompatible: result.overall.passed,
            playwrightScore: result.overall.score,
            locatorQuality: result.tests.locatorQuality.rating,
            isStable: this.assessStability(result),
            isMaintenanceFriendly: this.assessMaintainability(result),
            suggestedImprovement: null,
            elementExtractorRecommendations: []
        };

        // Generate improvement suggestions
        if (result.alternatives.length > 0 && result.overall.score < 70) {
            const bestAlternative = result.alternatives[0];
            
            analysis.suggestedImprovement = {
                from: originalLocator,
                to: bestAlternative.locator,
                reason: bestAlternative.description,
                expectedImprovement: bestAlternative.confidence - result.overall.score,
                newType: bestAlternative.type
            };
        }

        // Element Extractor specific recommendations
        if (result.tests.locatorQuality.rating === 'POOR') {
            analysis.elementExtractorRecommendations.push({
                type: 'locator_strategy',
                priority: 'high',
                message: 'Consider updating Element Extractor to generate test-id attributes first'
            });
        }

        if (!result.tests.visibility.passed) {
            analysis.elementExtractorRecommendations.push({
                type: 'element_detection',
                priority: 'medium',
                message: 'Element may need dynamic loading detection in Element Extractor'
            });
        }

        if (originalLocator.includes(':nth-child') || originalLocator.includes(' > ')) {
            analysis.elementExtractorRecommendations.push({
                type: 'locator_strategy',
                priority: 'high',
                message: 'Path-based locators are fragile. Enhance Element Extractor to prefer attributes.'
            });
        }

        // Context-based analysis
        if (context.elementType === 'LINK' && !originalLocator.includes('[href')) {
            analysis.elementExtractorRecommendations.push({
                type: 'element_specific',
                priority: 'medium',
                message: 'For links, consider including href attributes in locator generation'
            });
        }

        return analysis;
    }

    /**
     * Assess locator stability
     */
    assessStability(result) {
        let score = 0;
        
        // Stable indicators
        if (result.tests.locatorQuality.rating === 'EXCELLENT') score += 3;
        else if (result.tests.locatorQuality.rating === 'GOOD') score += 2;
        
        if (result.locator.includes('data-testid') || result.locator.includes('data-test')) score += 3;
        if (result.locator.includes('#') && !result.locator.includes(' ')) score += 2;
        
        // Unstable indicators
        if (result.locator.includes(':nth-child') || result.locator.includes(' > ')) score -= 2;
        if (result.locator.includes('text=')) score -= 1;
        
        return score >= 3 ? 'high' : score >= 1 ? 'medium' : 'low';
    }

    /**
     * Assess maintainability
     */
    assessMaintainability(result) {
        const locator = result.locator;
        
        // High maintainability indicators
        if (locator.includes('data-testid') || locator.includes('data-test')) return 'high';
        if (locator.match(/^#[a-zA-Z][\w-]*$/)) return 'high';
        if (locator.includes('[aria-label=')) return 'high';
        
        // Medium maintainability
        if (locator.includes('.') && !locator.includes(' > ')) return 'medium';
        if (locator.includes('[name=') || locator.includes('[role=')) return 'medium';
        
        // Low maintainability
        if (locator.includes(' > ') || locator.includes(':nth-child')) return 'low';
        if (locator.split(' ').length > 3) return 'low';
        
        return 'medium';
    }

    /**
     * Batch validate Element Extractor output
     */
    async validateElementExtractorOutput(extractedData, url = null) {
        console.log(`🔄 Starting Element Extractor output validation...`);
        
        if (url) {
            await this.validator.navigateToUrl(url);
        }

        const results = [];
        const improvements = [];
        
        for (let i = 0; i < extractedData.length; i++) {
            const item = extractedData[i];
            const locator = item['Best Locator'] || item.locator;
            
            if (!locator) continue;
            
            console.log(`\n📍 Validating ${i + 1}/${extractedData.length}: ${item['Element Name']} (${locator})`);
            
            const context = {
                elementName: item['Element Name'],
                elementType: item['Element Type'],
                originalStrength: item['Strength'] || 0,
                locatorType: item['Locator Type']
            };
            
            const result = await this.validateElementExtractorLocator(locator, context);
            
            // Add Element Extractor context to result
            result.elementExtractorContext = context;
            
            results.push(result);
            
            // Collect improvements
            if (result.elementExtractorAnalysis.suggestedImprovement) {
                improvements.push({
                    elementName: context.elementName,
                    original: result.elementExtractorAnalysis.suggestedImprovement.from,
                    improved: result.elementExtractorAnalysis.suggestedImprovement.to,
                    reason: result.elementExtractorAnalysis.suggestedImprovement.reason,
                    improvement: result.elementExtractorAnalysis.suggestedImprovement.expectedImprovement
                });
            }
            
            // Brief wait between validations
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Generate comprehensive report
        const report = this.generateValidationReport(results, improvements);
        
        console.log('\n📊 Element Extractor Validation Report:');
        console.log(`   Total elements validated: ${report.summary.total}`);
        console.log(`   Playwright compatible: ${report.summary.compatible} (${report.summary.compatibilityRate}%)`);
        console.log(`   Excellent locators: ${report.summary.excellent}`);
        console.log(`   Good locators: ${report.summary.good}`);
        console.log(`   Poor locators: ${report.summary.poor}`);
        console.log(`   Improvements suggested: ${report.improvements.length}`);
        
        if (report.improvements.length > 0) {
            console.log('\n💡 Top 5 Improvement Recommendations:');
            report.improvements.slice(0, 5).forEach((imp, i) => {
                console.log(`   ${i + 1}. ${imp.elementName}:`);
                console.log(`      From: ${imp.original}`);
                console.log(`      To: ${imp.improved}`);
                console.log(`      Expected improvement: +${imp.improvement}%`);
            });
        }
        
        return {
            results,
            report,
            improvements
        };
    }

    /**
     * Generate comprehensive validation report
     */
    generateValidationReport(results, improvements) {
        const total = results.length;
        const compatible = results.filter(r => r.overall.passed).length;
        const excellent = results.filter(r => r.overall.score >= 80).length;
        const good = results.filter(r => r.overall.score >= 60 && r.overall.score < 80).length;
        const fair = results.filter(r => r.overall.score >= 40 && r.overall.score < 60).length;
        const poor = results.filter(r => r.overall.score < 40).length;
        
        const averageScore = total > 0 ? 
            Math.round(results.reduce((sum, r) => sum + r.overall.score, 0) / total) : 0;
        
        // Analyze locator types
        const locatorTypes = {};
        results.forEach(r => {
            const type = r.elementExtractorContext?.locatorType || 'unknown';
            locatorTypes[type] = (locatorTypes[type] || 0) + 1;
        });
        
        // Analyze element types
        const elementTypes = {};
        results.forEach(r => {
            const type = r.elementExtractorContext?.elementType || 'unknown';
            elementTypes[type] = (elementTypes[type] || 0) + 1;
        });
        
        return {
            summary: {
                total,
                compatible,
                compatibilityRate: total > 0 ? Math.round((compatible / total) * 100) : 0,
                excellent,
                good,
                fair,
                poor,
                averageScore,
                averagePlaywrightScore: averageScore
            },
            distribution: {
                locatorTypes,
                elementTypes,
                grades: {
                    'A+/A': excellent,
                    'B': good,
                    'C': fair,
                    'D/F': poor
                }
            },
            improvements: improvements.sort((a, b) => b.improvement - a.improvement),
            recommendations: this.generateSystemRecommendations(results)
        };
    }

    /**
     * Generate system-level recommendations for Element Extractor
     */
    generateSystemRecommendations(results) {
        const recommendations = [];
        
        // Analyze patterns in poor performing locators
        const poorResults = results.filter(r => r.overall.score < 40);
        const pathBasedCount = results.filter(r => 
            r.locator.includes(' > ') || r.locator.includes(':nth-child')
        ).length;
        
        if (pathBasedCount > results.length * 0.3) {
            recommendations.push({
                type: 'system',
                priority: 'high',
                title: 'Reduce Path-Based Locators',
                description: `${pathBasedCount} elements use fragile path-based locators. Consider enhancing Element Extractor to prioritize attribute-based strategies.`,
                impact: 'High - Affects test stability'
            });
        }
        
        const testIdCount = results.filter(r => 
            r.locator.includes('data-testid') || r.locator.includes('data-test')
        ).length;
        
        if (testIdCount < results.length * 0.2) {
            recommendations.push({
                type: 'system',
                priority: 'high',
                title: 'Implement Test ID Strategy',
                description: `Only ${testIdCount} elements use test-specific attributes. Consider adding data-testid generation to Element Extractor.`,
                impact: 'High - Would significantly improve automation reliability'
            });
        }
        
        const shadowDOMCount = results.filter(r => 
            r.elementExtractorContext?.shadowDOM
        ).length;
        
        if (shadowDOMCount > 0) {
            recommendations.push({
                type: 'system',
                priority: 'medium',
                title: 'Enhance Shadow DOM Support',
                description: `${shadowDOMCount} elements are in Shadow DOM. Ensure Element Extractor handles these properly.`,
                impact: 'Medium - Affects modern web applications'
            });
        }
        
        return recommendations;
    }

    /**
     * Generate enhanced Element Extractor output
     */
    async generateEnhancedOutput(extractedData, url = null) {
        console.log('🚀 Generating enhanced Element Extractor output...');
        
        const validationResults = await this.validateElementExtractorOutput(extractedData, url);
        
        // Create enhanced data with Playwright insights
        const enhancedData = extractedData.map((item, index) => {
            const validation = validationResults.results[index];
            
            if (!validation) return item;
            
            return {
                ...item,
                
                // Original Element Extractor data preserved
                'Original Locator': item['Best Locator'],
                'Original Strength': item['Strength'],
                
                // Enhanced with Playwright data
                'Best Locator': validation.elementExtractorAnalysis.suggestedImprovement?.to || item['Best Locator'],
                'Locator Type': validation.elementExtractorAnalysis.suggestedImprovement?.newType || item['Locator Type'],
                'Strength': Math.max(item['Strength'] || 0, validation.overall.score),
                
                // New Playwright-specific fields
                'Playwright Score': validation.overall.score,
                'Playwright Grade': validation.overall.grade,
                'Playwright Compatible': validation.overall.passed ? 'Yes' : 'No',
                'Locator Quality': validation.tests.locatorQuality.rating,
                'Stability': validation.elementExtractorAnalysis.isStable,
                'Maintainability': validation.elementExtractorAnalysis.isMaintenanceFriendly,
                
                // Visibility and interaction data
                'Is Visible': validation.tests.visibility.passed ? 'Yes' : 'No',
                'Is Clickable': validation.tests.clickability.passed ? 'Yes' : 'No',
                'Is Enabled': validation.tests.enabled.passed ? 'Yes' : 'No',
                'Has Text': validation.tests.text.passed ? 'Yes' : 'No',
                'Text Content': validation.tests.text.content || '',
                
                // Alternative suggestions
                'Alternative Locators': validation.alternatives.slice(0, 3).map(alt => alt.locator).join(' | '),
                
                // Enhancement metadata
                'Enhanced': validation.elementExtractorAnalysis.suggestedImprovement ? 'Yes' : 'No',
                'Enhancement Reason': validation.elementExtractorAnalysis.suggestedImprovement?.reason || 'N/A'
            };
        });
        
        return {
            enhancedData,
            validationResults,
            stats: this.stats
        };
    }

    /**
     * Export enhanced data to CSV
     */
    exportEnhancedToCsv(enhancedData, filename = 'enhanced-element-extractor-output.csv') {
        if (enhancedData.length === 0) return;
        
        const keys = Object.keys(enhancedData[0]);
        const csv = [keys.join(',')]
            .concat(enhancedData.map(row => 
                keys.map(k => `"${(row[k] + '').replace(/"/g, '""')}"`).join(',')
            ))
            .join('\n');
            
        const fs = require('fs');
        fs.writeFileSync(filename, csv);
        
        console.log(`📊 Enhanced data exported to: ${filename}`);
    }

    /**
     * Cleanup
     */
    async cleanup() {
        await this.validator.cleanup();
        
        console.log('\n📈 Integration Statistics:');
        console.log(`   Total validations: ${this.stats.totalValidations}`);
        console.log(`   Improved locators: ${this.stats.improvedLocators}`);
        console.log(`   Excellent locators: ${this.stats.excellentLocators}`);
        console.log(`   Poor locators: ${this.stats.poorLocators}`);
    }
}

module.exports = { ElementExtractorPlaywrightIntegration };
