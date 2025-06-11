/**
 * Playwright Element Validator - The Ultimate Element Testing Utility
 * 
 * A comprehensive library for validating web elements with Playwright,
 * designed to integrate seamlessly with your Element Extractor project.
 * 
 * Features:
 * - Element validation (visibility, clickability, etc.)
 * - Locator testing and scoring
 * - Integration with Element Extractor
 * - Shadow DOM support
 * - Comprehensive element analysis
 * - Scoring alignment with Element Extractor
 */

const { chromium } = require('playwright');

// Import scoring alignment fix if available
let ScoringAlignmentFix;
try {
    ScoringAlignmentFix = require('./scoring-alignment-fix');
} catch (error) {
    // Scoring alignment not available, continue without it
    ScoringAlignmentFix = null;
}

class PlaywrightElementValidator {
    constructor(options = {}) {
        this.options = {
            browser: 'chromium',
            headless: false,
            timeout: 30000,
            waitForLoadState: 'domcontentloaded',
            viewport: { width: 1280, height: 720 },
            enableLogging: true,
            enableScoringAlignment: true, // New option for scoring alignment
            alignmentStrategy: 'hybrid', // 'element-extractor-priority', 'playwright-priority', 'hybrid'
            ...options
        };
        
        this.browser = null;
        this.context = null;
        this.page = null;
        this.stats = {
            totalTests: 0,
            passedTests: 0,
            failedTests: 0,
            elementsValidated: 0,
            locatorsGenerated: 0,
            startTime: Date.now()
        };
        
        // Initialize scoring alignment if available
        this.scoringAlignment = null;
        if (ScoringAlignmentFix && this.options.enableScoringAlignment) {
            this.scoringAlignment = new ScoringAlignmentFix();
            this.scoringAlignment.setAlignmentStrategy(this.options.alignmentStrategy);
            this.log('🎯 Scoring alignment enabled with strategy:', this.options.alignmentStrategy);
        }
        
        this.log('🎭 Playwright Element Validator initialized');
    }

    /**
     * Initialize Playwright browser and context
     */
    async initialize() {
        try {
            this.log('🚀 Initializing Playwright browser...');
            
            this.browser = await chromium.launch({
                headless: this.options.headless,
                devtools: !this.options.headless
            });
            
            this.context = await this.browser.newContext({
                viewport: this.options.viewport,
                ignoreHTTPSErrors: true
            });
            
            this.page = await this.context.newPage();
            
            // Set default timeout
            this.page.setDefaultTimeout(this.options.timeout);
            
            this.log('✅ Playwright initialized successfully');
            return true;
        } catch (error) {
            this.log('❌ Failed to initialize Playwright:', error.message);
            throw error;
        }
    }

    /**
     * Navigate to a URL for testing
     */
    async navigateToUrl(url) {
        if (!this.page) {
            await this.initialize();
        }
        
        try {
            this.log(`🌐 Navigating to: ${url}`);
            await this.page.goto(url, { 
                waitUntil: this.options.waitForLoadState,
                timeout: this.options.timeout 
            });
            
            // Wait a bit for dynamic content
            await this.page.waitForTimeout(1000);
            
            this.log('✅ Navigation completed');
            return true;
        } catch (error) {
            this.log('❌ Navigation failed:', error.message);
            throw error;
        }
    }

    /**
     * Main element validation function
     * Tests an element with multiple validation checks
     */
    async validateElement(locator, options = {}) {
        if (!this.page) {
            throw new Error('Playwright not initialized. Call initialize() first.');
        }

        const validationOptions = {
            checkVisibility: true,
            checkClickability: true,
            checkEnabled: true,
            checkText: true,
            checkLocatorQuality: true,
            generateAlternatives: true,
            timeoutMs: 10000,
            ...options
        };

        this.stats.elementsValidated++;
        this.stats.totalTests++;

        const startTime = Date.now();
        const results = {
            locator: locator,
            timestamp: new Date().toISOString(),
            duration: 0,
            element: null,
            tests: {
                existence: { passed: false, message: '', score: 0 },
                visibility: { passed: false, message: '', score: 0 },
                clickability: { passed: false, message: '', score: 0 },
                enabled: { passed: false, message: '', score: 0 },
                text: { passed: false, message: '', content: '', score: 0 },
                locatorQuality: { passed: false, message: '', score: 0, rating: 'POOR' }
            },
            alternatives: [],
            recommendations: [],
            overall: {
                passed: false,
                score: 0,
                grade: 'F',
                message: ''
            }
        };

        try {
            this.log(`🔍 Validating element: ${locator}`);

            // Test 1: Element Existence
            try {
                const element = this.page.locator(locator);
                await element.waitFor({ timeout: validationOptions.timeoutMs });
                
                results.element = element;
                results.tests.existence = {
                    passed: true,
                    message: 'Element found successfully',
                    score: 20
                };
                
                this.log('✅ Element exists');
            } catch (error) {
                results.tests.existence = {
                    passed: false,
                    message: `Element not found: ${error.message}`,
                    score: 0
                };
                this.log('❌ Element not found');
                
                // If element doesn't exist, return early
                results.overall = this.calculateOverallScore(results);
                results.duration = Date.now() - startTime;
                return results;
            }

            // Test 2: Visibility
            if (validationOptions.checkVisibility) {
                try {
                    const isVisible = await results.element.isVisible();
                    results.tests.visibility = {
                        passed: isVisible,
                        message: isVisible ? 'Element is visible' : 'Element is not visible',
                        score: isVisible ? 20 : 0
                    };
                    
                    this.log(isVisible ? '✅ Element is visible' : '⚠️ Element is not visible');
                } catch (error) {
                    results.tests.visibility = {
                        passed: false,
                        message: `Visibility check failed: ${error.message}`,
                        score: 0
                    };
                }
            }

            // Test 3: Clickability
            if (validationOptions.checkClickability) {
                try {
                    const isClickable = await this.isElementClickable(results.element);
                    results.tests.clickability = {
                        passed: isClickable,
                        message: isClickable ? 'Element is clickable' : 'Element is not clickable',
                        score: isClickable ? 15 : 0
                    };
                    
                    this.log(isClickable ? '✅ Element is clickable' : '⚠️ Element is not clickable');
                } catch (error) {
                    results.tests.clickability = {
                        passed: false,
                        message: `Clickability check failed: ${error.message}`,
                        score: 0
                    };
                }
            }

            // Test 4: Enabled State
            if (validationOptions.checkEnabled) {
                try {
                    const isEnabled = await results.element.isEnabled();
                    results.tests.enabled = {
                        passed: isEnabled,
                        message: isEnabled ? 'Element is enabled' : 'Element is disabled',
                        score: isEnabled ? 15 : 5 // Still give some points if disabled but found
                    };
                    
                    this.log(isEnabled ? '✅ Element is enabled' : '⚠️ Element is disabled');
                } catch (error) {
                    results.tests.enabled = {
                        passed: false,
                        message: `Enabled check failed: ${error.message}`,
                        score: 0
                    };
                }
            }

            // Test 5: Text Content
            if (validationOptions.checkText) {
                try {
                    const textContent = await results.element.textContent({ timeout: 5000 });
                    const hasText = textContent && textContent.trim().length > 0;
                    
                    results.tests.text = {
                        passed: hasText,
                        message: hasText ? `Element has text content` : 'Element has no text content',
                        content: textContent || '',
                        score: hasText ? 10 : 5 // Some elements don't need text
                    };
                    
                    this.log(hasText ? `✅ Element text: "${textContent.substring(0, 50)}..."` : '⚠️ Element has no text');
                } catch (error) {
                    results.tests.text = {
                        passed: false,
                        message: `Text check failed: ${error.message}`,
                        content: '',
                        score: 0
                    };
                }
            }

            // Test 6: Locator Quality Assessment
            if (validationOptions.checkLocatorQuality) {
                const qualityAssessment = this.assessLocatorQuality(locator);
                // Fix: Improve scoring weight for locator quality - DOM elements need fair assessment
                const qualityScore = Math.round(qualityAssessment.score * 0.25); // Max 25 points instead of 20
                results.tests.locatorQuality = {
                    passed: qualityAssessment.score >= 50, // Lower threshold for DOM elements
                    message: qualityAssessment.message,
                    score: qualityScore,
                    rating: qualityAssessment.rating,
                    details: qualityAssessment.details
                };
                
                this.log(`📊 Locator quality: ${qualityAssessment.rating} (${qualityAssessment.score}%) → ${qualityScore} points`);
            }

            // Generate alternative locators if requested
            if (validationOptions.generateAlternatives) {
                try {
                    results.alternatives = await this.generateAlternativeLocators(results.element);
                    this.log(`💡 Generated ${results.alternatives.length} alternative locators`);
                } catch (error) {
                    this.log(`⚠️ Could not generate alternatives: ${error.message}`);
                }
            }

            // Generate recommendations
            results.recommendations = this.generateRecommendations(results);

        } catch (error) {
            this.log(`❌ Validation failed: ${error.message}`);
            results.tests.existence.message = `Validation error: ${error.message}`;
        }

        // Calculate overall score and grade
        results.overall = this.calculateOverallScore(results);
        results.duration = Date.now() - startTime;

        if (results.overall.passed) {
            this.stats.passedTests++;
            this.log(`✅ Element validation PASSED (${results.overall.score}%)`);
        } else {
            this.stats.failedTests++;
            this.log(`❌ Element validation FAILED (${results.overall.score}%)`);
        }

        return results;
    }

    /**
     * Test if element is truly clickable (not just visible and enabled)
     */
    async isElementClickable(element) {
        try {
            // Check if element is visible and enabled
            const isVisible = await element.isVisible();
            const isEnabled = await element.isEnabled();
            
            if (!isVisible || !isEnabled) {
                return false;
            }

            // Check if element has click handlers or is naturally clickable
            const tagName = await element.evaluate(el => el.tagName.toLowerCase());
            const clickableElements = ['button', 'a', 'input', 'select', 'textarea'];
            
            if (clickableElements.includes(tagName)) {
                return true;
            }

            // Check for click event listeners
            const hasClickHandler = await element.evaluate(el => {
                // Check for onclick attribute
                if (el.onclick || el.getAttribute('onclick')) {
                    return true;
                }
                
                // Check for cursor pointer style
                const style = window.getComputedStyle(el);
                if (style.cursor === 'pointer') {
                    return true;
                }
                
                // Check for role that implies clickability
                const role = el.getAttribute('role');
                if (['button', 'link', 'tab', 'option'].includes(role)) {
                    return true;
                }
                
                return false;
            });

            return hasClickHandler;

        } catch (error) {
            return false;
        }
    }

    /**
     * Assess the quality of a locator for Playwright usage
     */
    assessLocatorQuality(locator) {
        let score = 0;
        let details = [];
        let message = '';

        // Test ID attributes (highest score)
        if (locator.includes('[data-testid=') || locator.includes('[data-test=') || 
            locator.includes('[data-cy=') || locator.includes('[data-qa=')) {
            score += 40;
            details.push('✅ Uses test-specific attributes');
        }

        // ID selectors (high score)
        if (locator.match(/^#[a-zA-Z][\w-]*$/)) {
            score += 35;
            details.push('✅ Uses clean ID selector');
        } else if (locator.includes('#')) {
            score += 25;
            details.push('✅ Uses ID selector');
        }

        // ARIA attributes (good for accessibility)
        if (locator.includes('[aria-label=') || locator.includes('[role=')) {
            score += 25;
            details.push('✅ Uses ARIA attributes');
        }

        // Class selectors (moderate score) - Improved scoring for DOM navigation
        if (locator.includes('.') && !locator.includes(' > ')) {
            score += 20;
            details.push('✅ Uses class selectors');
        }

        // Special bonus for class+href navigation patterns (commonly high-performing)
        if (locator.includes('.') && locator.includes('[href') && !locator.includes(' > ')) {
            score += 15; // Extra bonus for navigation elements
            details.push('🚀 Navigation element (class+href)');
        }

        // Attribute selectors (decent)
        if (locator.includes('[') && locator.includes('=')) {
            score += 15;
            details.push('✅ Uses attribute selectors');
        }

        // Text content (can be fragile)
        if (locator.includes('text=') || locator.includes(':has-text(')) {
            score += 10;
            details.push('⚠️ Uses text content');
        }

        // Penalties for bad practices
        if (locator.includes(' >> ') || locator.includes(' > ')) {
            score -= 10;
            details.push('⚠️ Uses complex selectors');
        }

        if (locator.includes(':nth-child(') || locator.includes(':nth-of-type(')) {
            score -= 15;
            details.push('❌ Uses position-based selectors');
        }

        if (locator.split(' ').length > 3) {
            score -= 10;
            details.push('❌ Selector is too complex');
        }

        // XPath detection (less preferred)
        if (locator.startsWith('//') || locator.startsWith('xpath=')) {
            score -= 5;
            details.push('⚠️ Uses XPath');
        }

        // Normalize score
        score = Math.max(0, Math.min(100, score));

        // Determine rating
        let rating;
        if (score >= 80) rating = 'EXCELLENT';
        else if (score >= 60) rating = 'GOOD';
        else if (score >= 40) rating = 'FAIR';
        else rating = 'POOR';

        message = `Locator quality: ${rating} (${score}%)`;

        return {
            score,
            rating,
            message,
            details
        };
    }

    /**
     * Generate alternative locators for an element
     */
    async generateAlternativeLocators(element) {
        const alternatives = [];

        try {
            // Get element attributes and properties
            const elementInfo = await element.evaluate(el => ({
                tagName: el.tagName.toLowerCase(),
                id: el.id,
                className: el.className,
                textContent: el.textContent?.trim(),
                attributes: Array.from(el.attributes).map(attr => ({
                    name: attr.name,
                    value: attr.value
                })),
                role: el.getAttribute('role'),
                ariaLabel: el.getAttribute('aria-label'),
                name: el.name,
                type: el.type,
                href: el.href,
                placeholder: el.placeholder
            }));

            // Generate test ID alternatives
            const testIdAttrs = elementInfo.attributes.filter(attr => 
                ['data-testid', 'data-test', 'data-cy', 'data-qa', 'data-automation-id'].includes(attr.name)
            );
            
            testIdAttrs.forEach(attr => {
                alternatives.push({
                    locator: `[${attr.name}="${attr.value}"]`,
                    type: 'testId',
                    confidence: 95,
                    description: `Test ID attribute: ${attr.name}`
                });
            });

            // ID selector
            if (elementInfo.id) {
                alternatives.push({
                    locator: `#${elementInfo.id}`,
                    type: 'id',
                    confidence: 90,
                    description: 'ID selector'
                });
            }

            // ARIA label
            if (elementInfo.ariaLabel) {
                alternatives.push({
                    locator: `[aria-label="${elementInfo.ariaLabel}"]`,
                    type: 'ariaLabel',
                    confidence: 85,
                    description: 'ARIA label'
                });
            }

            // Role selector
            if (elementInfo.role) {
                alternatives.push({
                    locator: `[role="${elementInfo.role}"]`,
                    type: 'role',
                    confidence: 75,
                    description: 'Role attribute'
                });
            }

            // Name attribute (for form elements)
            if (elementInfo.name) {
                alternatives.push({
                    locator: `[name="${elementInfo.name}"]`,
                    type: 'name',
                    confidence: 80,
                    description: 'Name attribute'
                });
            }

            // Placeholder text
            if (elementInfo.placeholder) {
                alternatives.push({
                    locator: `[placeholder="${elementInfo.placeholder}"]`,
                    type: 'placeholder',
                    confidence: 70,
                    description: 'Placeholder text'
                });
            }

            // Text content (for clickable elements)
            if (elementInfo.textContent && elementInfo.textContent.length < 100 && 
                ['button', 'a', 'span', 'div'].includes(elementInfo.tagName)) {
                alternatives.push({
                    locator: `text="${elementInfo.textContent}"`,
                    type: 'text',
                    confidence: 60,
                    description: 'Visible text'
                });
            }

            // Class selector (if unique)
            if (elementInfo.className) {
                const classes = elementInfo.className.split(' ').filter(c => c.trim());
                if (classes.length > 0) {
                    const classSelector = `.${classes.join('.')}`;
                    alternatives.push({
                        locator: classSelector,
                        type: 'class',
                        confidence: 50,
                        description: 'Class selector'
                    });
                }
            }

            // Sort by confidence
            alternatives.sort((a, b) => b.confidence - a.confidence);

            this.stats.locatorsGenerated += alternatives.length;
            return alternatives;

        } catch (error) {
            this.log(`Error generating alternatives: ${error.message}`);
            return [];
        }
    }

    /**
     * Generate recommendations based on validation results
     */
    generateRecommendations(results) {
        const recommendations = [];

        // Locator quality recommendations
        if (results.tests.locatorQuality.score < 60) {
            if (results.alternatives.length > 0) {
                const bestAlt = results.alternatives[0];
                recommendations.push({
                    type: 'locator',
                    priority: 'high',
                    message: `Consider using: ${bestAlt.locator} (${bestAlt.description})`
                });
            }
            
            recommendations.push({
                type: 'locator',
                priority: 'medium',
                message: 'Use data-testid attributes for more reliable automation'
            });
        }

        // Visibility recommendations
        if (!results.tests.visibility.passed) {
            recommendations.push({
                type: 'visibility',
                priority: 'high',
                message: 'Element is not visible. Check if it needs user interaction or waiting.'
            });
        }

        // Clickability recommendations
        if (!results.tests.clickability.passed && results.tests.visibility.passed) {
            recommendations.push({
                type: 'interaction',
                priority: 'medium',
                message: 'Element is visible but not clickable. Verify it should be interactive.'
            });
        }

        // Text content recommendations
        if (results.tests.text.content === '' && results.tests.existence.passed) {
            recommendations.push({
                type: 'content',
                priority: 'low',
                message: 'Element has no text content. Consider if text assertion is needed.'
            });
        }

        return recommendations;
    }

    /**
     * Calculate overall validation score and grade
     */
    calculateOverallScore(results) {
        let totalScore = 0;
        let maxScore = 0;

        // Define proper maximum scores for each test type
        const testMaxScores = {
            existence: 20,
            visibility: 20, 
            clickability: 15,
            enabled: 15,
            text: 10,
            locatorQuality: 25 // Updated to match the new scoring
        };

        Object.entries(results.tests).forEach(([testName, test]) => {
            if (test.score !== undefined) {
                totalScore += test.score;
                maxScore += testMaxScores[testName] || 20;
            }
        });

        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        
        let grade, message, passed;
        
        if (percentage >= 90) {
            grade = 'A+';
            message = 'Excellent - Element is perfect for automation';
            passed = true;
        } else if (percentage >= 80) {
            grade = 'A';
            message = 'Very Good - Element is reliable for automation';
            passed = true;
        } else if (percentage >= 70) {
            grade = 'B';
            message = 'Good - Element should work well for automation';
            passed = true;
        } else if (percentage >= 60) {
            grade = 'C';
            message = 'Fair - Element may need some improvements';
            passed = false;
        } else if (percentage >= 40) {
            grade = 'D';
            message = 'Poor - Element has several issues';
            passed = false;
        } else {
            grade = 'F';
            message = 'Failed - Element is not suitable for automation';
            passed = false;
        }

        return {
            passed,
            score: percentage,
            grade,
            message
        };
    }

    /**
     * Batch validate multiple elements
     */
    async validateElements(locators, options = {}) {
        const results = [];
        
        this.log(`🔄 Starting batch validation of ${locators.length} elements...`);
        
        for (let i = 0; i < locators.length; i++) {
            const locator = locators[i];
            this.log(`\n📍 Validating ${i + 1}/${locators.length}: ${locator}`);
            
            try {
                const result = await this.validateElement(locator, options);
                results.push(result);
            } catch (error) {
                this.log(`❌ Failed to validate ${locator}: ${error.message}`);
                results.push({
                    locator,
                    error: error.message,
                    overall: { passed: false, score: 0, grade: 'F', message: 'Validation failed' }
                });
            }
            
            // Small delay between validations
            await this.page.waitForTimeout(100);
        }
        
        // Generate batch summary
        const summary = this.generateBatchSummary(results);
        
        this.log(`\n📊 Batch validation completed:`);
        this.log(`   Total: ${summary.total}`);
        this.log(`   Passed: ${summary.passed} (${summary.passRate}%)`);
        this.log(`   Failed: ${summary.failed} (${summary.failRate}%)`);
        this.log(`   Average Score: ${summary.averageScore}%`);
        
        return {
            results,
            summary
        };
    }

    /**
     * Generate summary for batch validation
     */
    generateBatchSummary(results) {
        const total = results.length;
        const passed = results.filter(r => r.overall?.passed).length;
        const failed = total - passed;
        const totalScore = results.reduce((sum, r) => sum + (r.overall?.score || 0), 0);
        const averageScore = total > 0 ? Math.round(totalScore / total) : 0;

        return {
            total,
            passed,
            failed,
            passRate: total > 0 ? Math.round((passed / total) * 100) : 0,
            failRate: total > 0 ? Math.round((failed / total) * 100) : 0,
            averageScore,
            grades: {
                'A+': results.filter(r => r.overall?.grade === 'A+').length,
                'A': results.filter(r => r.overall?.grade === 'A').length,
                'B': results.filter(r => r.overall?.grade === 'B').length,
                'C': results.filter(r => r.overall?.grade === 'C').length,
                'D': results.filter(r => r.overall?.grade === 'D').length,
                'F': results.filter(r => r.overall?.grade === 'F').length
            }
        };
    }

    /**
     * Test element interactions (click, fill, etc.)
     */
    async testElementInteractions(locator, interactions = {}) {
        if (!this.page) {
            throw new Error('Playwright not initialized');
        }

        const results = {
            locator,
            interactions: {},
            overall: { success: true, errors: [] }
        };

        const element = this.page.locator(locator);

        // Test click
        if (interactions.click !== false) {
            try {
                this.log('🖱️ Testing click interaction...');
                await element.click({ timeout: 5000 });
                results.interactions.click = { success: true, message: 'Click successful' };
                this.log('✅ Click test passed');
            } catch (error) {
                results.interactions.click = { success: false, message: error.message };
                results.overall.success = false;
                results.overall.errors.push(`Click failed: ${error.message}`);
                this.log('❌ Click test failed');
            }
        }

        // Test fill (for input elements)
        if (interactions.fill) {
            try {
                this.log('⌨️ Testing fill interaction...');
                await element.fill(interactions.fill, { timeout: 5000 });
                results.interactions.fill = { success: true, message: 'Fill successful', value: interactions.fill };
                this.log('✅ Fill test passed');
            } catch (error) {
                results.interactions.fill = { success: false, message: error.message };
                results.overall.success = false;
                results.overall.errors.push(`Fill failed: ${error.message}`);
                this.log('❌ Fill test failed');
            }
        }

        // Test hover
        if (interactions.hover !== false) {
            try {
                this.log('🎯 Testing hover interaction...');
                await element.hover({ timeout: 5000 });
                results.interactions.hover = { success: true, message: 'Hover successful' };
                this.log('✅ Hover test passed');
            } catch (error) {
                results.interactions.hover = { success: false, message: error.message };
                results.overall.success = false;
                results.overall.errors.push(`Hover failed: ${error.message}`);
                this.log('❌ Hover test failed');
            }
        }

        return results;
    }

    /**
     * Integration with Element Extractor - validate extracted elements
     */
    async validateExtractedElements(extractedData, options = {}) {
        this.log('🔗 Integrating with Element Extractor data...');
        
        const validationResults = [];
        
        for (const item of extractedData) {
            const locator = item['Best Locator'] || item.locator;
            
            if (!locator) {
                continue;
            }
            
            try {
                const validation = await this.validateElement(locator, {
                    ...options,
                    generateAlternatives: true
                });
                
                // Enhance with Element Extractor context
                validation.elementExtractor = {
                    elementName: item['Element Name'] || 'Unknown',
                    elementType: item['Element Type'] || 'Unknown',
                    originalStrength: item['Strength'] || 0,
                    wasInShadowDOM: item['In Shadow DOM'] === 'Yes',
                    css: item['CSS'] || '',
                    xpath: item['XPATH'] || ''
                };
                
                // Calculate improvement recommendations
                if (validation.alternatives.length > 0 && validation.overall.score < 70) {
                    validation.elementExtractor.suggestedImprovement = {
                        from: locator,
                        to: validation.alternatives[0].locator,
                        expectedImprovement: validation.alternatives[0].confidence - validation.overall.score
                    };
                }
                
                validationResults.push(validation);
                
            } catch (error) {
                this.log(`⚠️ Failed to validate ${locator}: ${error.message}`);
            }
        }
        
        // Generate integration summary
        const integrationSummary = this.generateIntegrationSummary(validationResults);
        
        this.log(`\n🎯 Element Extractor Integration Summary:`);
        this.log(`   Validated: ${integrationSummary.validated} elements`);
        this.log(`   Improvements suggested: ${integrationSummary.improvementsSuggested}`);
        this.log(`   Average Playwright score: ${integrationSummary.averagePlaywrightScore}%`);
        
        return {
            results: validationResults,
            summary: integrationSummary
        };
    }

    /**
     * Generate integration summary for Element Extractor
     */
    generateIntegrationSummary(results) {
        const validated = results.length;
        const improvementsSuggested = results.filter(r => r.elementExtractor?.suggestedImprovement).length;
        const totalScore = results.reduce((sum, r) => sum + r.overall.score, 0);
        const averagePlaywrightScore = validated > 0 ? Math.round(totalScore / validated) : 0;
        
        const strengthComparison = results.map(r => ({
            original: r.elementExtractor?.originalStrength || 0,
            playwright: r.overall.score,
            improvement: r.overall.score - (r.elementExtractor?.originalStrength || 0)
        }));
        
        return {
            validated,
            improvementsSuggested,
            averagePlaywrightScore,
            strengthComparison,
            elementTypes: this.groupBy(results, r => r.elementExtractor?.elementType || 'Unknown'),
            shadowDOMElements: results.filter(r => r.elementExtractor?.wasInShadowDOM).length
        };
    }

    /**
     * Cleanup and close browser
     */
    async cleanup() {
        try {
            if (this.context) {
                await this.context.close();
            }
            if (this.browser) {
                await this.browser.close();
            }
            
            this.log('🧹 Cleanup completed');
            
            // Print final stats
            this.printStats();
            
        } catch (error) {
            this.log('⚠️ Cleanup error:', error.message);
        }
    }

    /**
     * Print performance statistics
     */
    printStats() {
        const duration = Date.now() - this.stats.startTime;
        const minutes = Math.floor(duration / 60000);
        const seconds = Math.floor((duration % 60000) / 1000);
        
        this.log('\n📊 Playwright Element Validator Statistics:');
        this.log(`   Total runtime: ${minutes}m ${seconds}s`);
        this.log(`   Total tests: ${this.stats.totalTests}`);
        this.log(`   Passed tests: ${this.stats.passedTests}`);
        this.log(`   Failed tests: ${this.stats.failedTests}`);
        this.log(`   Elements validated: ${this.stats.elementsValidated}`);
        this.log(`   Locators generated: ${this.stats.locatorsGenerated}`);
        
        if (this.stats.totalTests > 0) {
            const successRate = Math.round((this.stats.passedTests / this.stats.totalTests) * 100);
            this.log(`   Success rate: ${successRate}%`);
        }
    }

    /**
     * Utility logging function
     */
    log(...args) {
        if (this.options.enableLogging) {
            console.log('[PlaywrightValidator]', ...args);
        }
    }

    /**
     * Utility function to group array by key
     */
    groupBy(array, keyFn) {
        return array.reduce((groups, item) => {
            const key = keyFn(item);
            groups[key] = (groups[key] || 0) + 1;
            return groups;
        }, {});
    }
}

module.exports = { PlaywrightElementValidator };
