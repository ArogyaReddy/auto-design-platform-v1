    const colors = require('colors');
const _ = require('lodash');
const { BaseLocatorHelpers } = require('./base-locator-helpers');

/**
 * Enhanced Base Locator Library
 * Complete implementation with all helper methods integrated
 */
class BaseLocatorLibrary {
    constructor(options = {}) {
        this.options = {
            timeout: options.timeout || 30000,
            retryAttempts: options.retryAttempts || 3,
            retryDelay: options.retryDelay || 1000,
            enableShadowDOM: options.enableShadowDOM !== false,
            enableAccessibility: options.enableAccessibility !== false,
            enableCache: options.enableCache !== false,
            debugMode: options.debugMode || false,
            logLevel: options.logLevel || 'info',
            ...options
        };
        
        this.stats = this._initializeStats();
        this.locatorCache = new Map();
        this.elementCache = new WeakMap();
        
        this._log('info', '🚀 BaseLocatorLibrary Enhanced initialized');
    }

    /**
     * Generate intelligent locators with helper integration
     */
    generateLocators(element, options = {}) {
        const startTime = Date.now();
        const cacheKey = BaseLocatorHelpers.generateCacheKey(element, options);
        
        if (this.options.enableCache && this.locatorCache.has(cacheKey)) {
            this.stats.cacheHits++;
            return this.locatorCache.get(cacheKey);
        }

        try {
            const locators = this._analyzeElementAndGenerateLocators(element, options);
            
            if (this.options.enableCache) {
                this.locatorCache.set(cacheKey, locators);
            }
            
            this.stats.totalElements++;
            this.stats.averageGenerationTime = this._updateAverageTime(
                this.stats.averageGenerationTime,
                Date.now() - startTime,
                this.stats.totalElements
            );
            
            return locators;
            
        } catch (error) {
            this.stats.errors++;
            this._log('error', '❌ Failed to generate locators', error.message);
            throw error;
        }
    }

    /**
     * Safe interaction with enhanced error handling
     */
    async safeInteraction(locatorStrategies, action, options = {}) {
        const {
            retryAttempts = this.options.retryAttempts,
            retryDelay = this.options.retryDelay,
            throwOnFailure = true
        } = options;

        let lastError;
        const attemptResults = [];

        for (let attempt = 1; attempt <= retryAttempts; attempt++) {
            for (let i = 0; i < locatorStrategies.length; i++) {
                const strategy = locatorStrategies[i];
                const strategyId = `${strategy.type}-${i}`;
                
                try {
                    const result = await action(strategy);
                    
                    this.stats.successfulInteractions++;
                    this.stats.strategySuccess[strategyId] = 
                        (this.stats.strategySuccess[strategyId] || 0) + 1;
                    
                    this._log('info', `✅ Success: ${strategy.type} (attempt ${attempt})`);
                    return result;
                    
                } catch (error) {
                    lastError = error;
                    attemptResults.push({
                        strategy: strategyId,
                        attempt,
                        error: error.message
                    });
                    
                    this.stats.failedInteractions++;
                    this.stats.strategyFailures[strategyId] = 
                        (this.stats.strategyFailures[strategyId] || 0) + 1;
                }
            }
            
            if (attempt < retryAttempts) {
                await this._sleep(retryDelay);
            }
        }

        this.stats.totalFailures++;
        
        if (throwOnFailure) {
            throw new Error(`All strategies failed. Last error: ${lastError?.message}`);
        }
        
        return null;
    }

    /**
     * Enhanced element analysis with helper methods
     */
    _analyzeElementAndGenerateLocators(element) {
        if (!BaseLocatorHelpers.isValidElement(element)) {
            throw new Error('Invalid element provided');
        }

        const locators = {
            primary: [],
            secondary: [],
            accessibility: [],
            shadowDom: [],
            advanced: [],
            fallback: []
        };

        // Use helper methods for generation
        this._generatePrimaryLocators(element, locators.primary);
        this._generateSecondaryLocators(element, locators.secondary);
        
        if (this.options.enableAccessibility) {
            this._generateAccessibilityLocators(element, locators.accessibility);
        }
        
        if (this.options.enableShadowDOM) {
            this._generateShadowDOMLocators(element, locators.shadowDom);
        }
        
        this._generateAdvancedLocators(element, locators.advanced);
        this._generateFallbackLocators(element, locators.fallback);

        const allLocators = BaseLocatorHelpers.combineAndSortLocators(locators);

        return {
            element,
            locators: { ...locators, all: allLocators },
            metadata: {
                generatedAt: new Date().toISOString(),
                totalStrategies: allLocators.length,
                performance: this.getPerformanceStats()
            }
        };
    }

    // Locator generation methods using helpers
    _generatePrimaryLocators(element, locators) {
        const testIdAttributes = [
            'data-testid', 'data-test', 'data-cy', 'data-automation-id', 
            'data-qa', 'data-e2e', 'test-id', 'testid'
        ];

        testIdAttributes.forEach((attr, index) => {
            if (element.hasAttribute(attr)) {
                const value = element.getAttribute(attr);
                if (value?.trim()) {
                    locators.push({
                        type: 'testId',
                        attribute: attr,
                        value,
                        selector: `[${attr}="${BaseLocatorHelpers.escapeSelector(value)}"]`,
                        priority: index + 1,
                        reliability: 'highest'
                    });
                }
            }
        });

        if (element.id && BaseLocatorHelpers.isUniqueSelector(`#${element.id}`, element)) {
            locators.push({
                type: 'id',
                value: element.id,
                selector: `#${BaseLocatorHelpers.escapeSelector(element.id)}`,
                priority: 10,
                reliability: 'highest'
            });
        }
    }

    /**
     * Generate secondary locators with enhanced href support
     */
    _generateSecondaryLocators(element, locators) {
        // Add href-based locators (your proven strategy)
        const hrefLocators = BaseLocatorHelpers.generateHrefLocators(element);
        locators.push(...hrefLocators);

        // Text content locators
        const textContent = element.textContent?.trim();
        if (textContent && textContent.length > 0 && textContent.length < 100) {
            const tagName = element.tagName.toLowerCase();
            
            if (['button', 'a', 'label', 'span'].includes(tagName)) {
                locators.push({
                    type: 'text',
                    value: textContent,
                    selector: `//*[normalize-space(text())="${textContent}"]`,
                    priority: 20,
                    reliability: 'high'
                });
            }
        }

        // Placeholder locators
        if (element.placeholder) {
            locators.push({
                type: 'placeholder',
                value: element.placeholder,
                selector: `[placeholder="${BaseLocatorHelpers.escapeSelector(element.placeholder)}"]`,
                priority: 30,
                reliability: 'medium'
            });
        }

        // Unique class selectors
        const uniqueClassSelector = BaseLocatorHelpers.generateUniqueClassSelector(element);
        if (uniqueClassSelector) {
            locators.push({
                type: 'uniqueClass',
                selector: uniqueClassSelector,
                priority: 40,
                reliability: 'medium'
            });
        }
    }

    _generateAccessibilityLocators(element, locators) {
        const ariaLabel = element.getAttribute('aria-label');
        if (ariaLabel) {
            locators.push({
                type: 'ariaLabel',
                value: ariaLabel,
                selector: `[aria-label="${BaseLocatorHelpers.escapeSelector(ariaLabel)}"]`,
                priority: 45,
                reliability: 'high'
            });
        }

        const role = element.getAttribute('role');
        if (role) {
            locators.push({
                type: 'role',
                value: role,
                selector: `[role="${BaseLocatorHelpers.escapeSelector(role)}"]`,
                priority: 50,
                reliability: 'medium'
            });
        }
    }

    _generateShadowDOMLocators(element, locators) {
        if (BaseLocatorHelpers.isInShadowDOM(element)) {
            const shadowPath = BaseLocatorHelpers.buildShadowDOMPath(element);
            if (shadowPath) {
                locators.push({
                    type: 'shadowDOM',
                    value: shadowPath,
                    selector: JSON.stringify(shadowPath),
                    priority: 65,
                    reliability: 'medium'
                });
            }
        }
    }

    _generateAdvancedLocators(element, locators) {
        const cssPath = BaseLocatorHelpers.generateCSSPath(element);
        locators.push({
            type: 'cssPath',
            selector: cssPath,
            priority: 70,
            reliability: 'low'
        });

        const xpathWithAttrs = BaseLocatorHelpers.generateXPathWithAttributes(element);
        if (xpathWithAttrs) {
            locators.push({
                type: 'xpathAttributes',
                selector: xpathWithAttrs,
                priority: 75,
                reliability: 'low'
            });
        }
    }

    _generateFallbackLocators(element, locators) {
        const nthChildSelector = BaseLocatorHelpers.generateNthChildSelector(element);
        if (nthChildSelector) {
            locators.push({
                type: 'nthChild',
                selector: nthChildSelector,
                priority: 90,
                reliability: 'very-low'
            });
        }
    }

    // Validation method
    async validateLocators(locators, targetElement) {
        return BaseLocatorHelpers.validateLocators(locators, targetElement);
    }

    // Performance and utility methods
    getPerformanceStats() {
        const uptime = Date.now() - this.stats.startTime;
        const successRate = this.stats.totalElements > 0 
            ? (this.stats.successfulInteractions / this.stats.totalElements * 100).toFixed(2)
            : 0;

        return {
            ...this.stats,
            uptime,
            successRate: `${successRate}%`,
            cacheSize: this.locatorCache.size,
            averageGenerationTime: `${this.stats.averageGenerationTime.toFixed(2)}ms`
        };
    }

    clearCache() {
        this.locatorCache.clear();
        this._log('info', '🧹 Cache cleared');
    }

    // Private utility methods
    _initializeStats() {
        return {
            totalElements: 0,
            successfulInteractions: 0,
            failedInteractions: 0,
            totalFailures: 0,
            cacheHits: 0,
            errors: 0,
            averageGenerationTime: 0,
            strategySuccess: {},
            strategyFailures: {},
            startTime: Date.now()
        };
    }

    _log(level, message, data = null) {
        if (!this.options.debugMode && level === 'debug') return;
        
        const colors_map = {
            debug: 'gray',
            info: 'blue', 
            warn: 'yellow',
            error: 'red'
        };
        
        const timestamp = new Date().toISOString();
        const coloredMessage = colors[colors_map[level] || 'white'](message);
        
        console.log(`[${timestamp}] ${coloredMessage}`);
        if (data) console.log(colors.gray(JSON.stringify(data, null, 2)));
    }

    _sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    _updateAverageTime(currentAverage, newTime, count) {
        return ((currentAverage * (count - 1)) + newTime) / count;
    }
}

module.exports = { BaseLocatorLibrary };