const _ = require('lodash');

/**
 * Base Locator Helpers - Utility functions for locator generation
 * Integrates proven logic from Elements Extractor project
 */
class BaseLocatorHelpers {
    /**
     * Generate cache key for element and options
     */
    static generateCacheKey(element, options = {}) {
        const elementKey = element.id || element.className || element.tagName || 'unknown';
        const optionsKey = JSON.stringify(options);
        return `${elementKey}_${optionsKey}`;
    }

    /**
     * Validate if element is a valid DOM element
     */
    static isValidElement(element) {
        return element && 
               element.nodeType === Node.ELEMENT_NODE && 
               typeof element.tagName === 'string';
    }

    /**
     * Combine and sort all locator strategies by priority
     */
    static combineAndSortLocators(locators) {
        const allLocators = [];
        
        // Add locators in priority order
        ['primary', 'secondary', 'accessibility', 'shadowDom', 'advanced', 'fallback'].forEach(category => {
            if (locators[category] && Array.isArray(locators[category])) {
                allLocators.push(...locators[category]);
            }
        });

        // Sort by priority (lower number = higher priority)
        return allLocators.sort((a, b) => (a.priority || 999) - (b.priority || 999));
    }

    /**
     * Escape CSS selector value for safe usage
     */
    static escapeSelector(value) {
        if (typeof value !== 'string') return '';
        
        // Use CSS.escape if available, otherwise manual escaping
        if (typeof CSS !== 'undefined' && CSS.escape) {
            return CSS.escape(value);
        }
        
        // Manual escaping for special CSS characters
        return value.replace(/[.()[\]{}+~>,:;#@$%^&*=!|\\/"'`\s]/g, '\\$&');
    }

    /**
     * Check if selector uniquely identifies the target element
     */
    static isUniqueSelector(selector, targetElement, contextNode = document) {
        try {
            const elements = contextNode.querySelectorAll(selector);
            return elements.length === 1 && elements[0] === targetElement;
        } catch (error) {
            return false;
        }
    }

    /**
     * Generate unique class selector combination
     */
    static generateUniqueClassSelector(element) {
        if (!element.className || typeof element.className !== 'string') {
            return null;
        }

        const classes = element.className.split(' ')
            .filter(c => c.trim() && !c.startsWith('ai-extractor-'))
            .map(c => this.escapeSelector(c));

        if (classes.length === 0) return null;

        const selector = `.${classes.join('.')}`;
        
        if (this.isUniqueSelector(selector, element)) {
            return selector;
        }

        return null;
    }

    /**
     * Check if element is inside Shadow DOM
     */
    static isInShadowDOM(element) {
        let parent = element.parentNode;
        while (parent) {
            if (parent.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                return true;
            }
            parent = parent.parentNode;
        }
        return false;
    }

    /**
     * Build Shadow DOM path for element
     */
    static buildShadowDOMPath(element) {
        if (!this.isInShadowDOM(element)) {
            return null;
        }

        const path = [];
        let current = element;
        
        while (current) {
            if (current.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
                // This is a shadow root
                path.unshift({
                    type: 'shadowRoot',
                    host: current.host ? this.generateCSSPath(current.host) : null
                });
                current = current.host;
            } else {
                path.unshift({
                    type: 'element',
                    selector: this.generateElementSelector(current)
                });
                current = current.parentNode;
            }
        }

        return path;
    }

    /**
     * Generate CSS path to element
     */
    static generateCSSPath(element) {
        const path = [];
        let current = element;

        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let selector = current.tagName.toLowerCase();
            
            if (current.id) {
                selector += `#${this.escapeSelector(current.id)}`;
                path.unshift(selector);
                break; // ID should be unique, stop here
            }
            
            if (current.className) {
                const classes = current.className.split(' ')
                    .filter(c => c.trim())
                    .map(c => this.escapeSelector(c));
                if (classes.length > 0) {
                    selector += `.${classes.join('.')}`;
                }
            }

            // Add nth-child if needed for uniqueness
            const siblings = Array.from(current.parentNode?.children || [])
                .filter(sibling => sibling.tagName === current.tagName);
            
            if (siblings.length > 1) {
                const index = siblings.indexOf(current) + 1;
                selector += `:nth-child(${index})`;
            }

            path.unshift(selector);
            current = current.parentNode;
        }

        return path.join(' > ');
    }

    /**
     * Generate XPath with attributes
     */
    static generateXPathWithAttributes(element) {
        const attributes = [];
        
        // Collect meaningful attributes
        ['id', 'class', 'name', 'type', 'value', 'aria-label', 'data-testid'].forEach(attr => {
            const value = element.getAttribute(attr);
            if (value) {
                attributes.push(`@${attr}="${value}"`);
            }
        });

        const tagName = element.tagName.toLowerCase();
        
        if (attributes.length > 0) {
            return `//${tagName}[${attributes.join(' and ')}]`;
        }

        return this.generateFullXPath(element);
    }

    /**
     * Generate nth-child selector
     */
    static generateNthChildSelector(element) {
        if (!element.parentNode) return null;

        const siblings = Array.from(element.parentNode.children);
        const index = siblings.indexOf(element) + 1;
        const tagName = element.tagName.toLowerCase();

        return `${tagName}:nth-child(${index})`;
    }

    /**
     * Generate simple element selector for internal use
     */
    static generateElementSelector(element) {
        if (element.id) {
            return `#${this.escapeSelector(element.id)}`;
        }
        
        if (element.className) {
            const classes = element.className.split(' ')
                .filter(c => c.trim())
                .map(c => this.escapeSelector(c));
            if (classes.length > 0) {
                return `.${classes.join('.')}`;
            }
        }

        return element.tagName.toLowerCase();
    }

    /**
     * Generate full XPath for element
     */
    static generateFullXPath(element) {
        const path = [];
        let current = element;

        while (current && current.nodeType === Node.ELEMENT_NODE) {
            const tagName = current.tagName.toLowerCase();
            
            if (current.id) {
                path.unshift(`//*[@id="${current.id}"]`);
                break;
            }

            const siblings = Array.from(current.parentNode?.children || [])
                .filter(sibling => sibling.tagName === current.tagName);
            
            if (siblings.length === 1) {
                path.unshift(tagName);
            } else {
                const index = siblings.indexOf(current) + 1;
                path.unshift(`${tagName}[${index}]`);
            }

            current = current.parentNode;
        }

        return path.length > 0 ? `/${path.join('/')}` : null;
    }

    /**
     * Validate locators against target element
     */
    static async validateLocators(locators, targetElement) {
        const results = [];

        for (const category in locators) {
            if (!Array.isArray(locators[category])) continue;

            for (const locator of locators[category]) {
                try {
                    const isValid = this.isUniqueSelector(locator.selector, targetElement);
                    results.push({
                        ...locator,
                        category,
                        isValid,
                        error: null
                    });
                } catch (error) {
                    results.push({
                        ...locator,
                        category,
                        isValid: false,
                        error: error.message
                    });
                }
            }
        }

        return {
            total: results.length,
            valid: results.filter(r => r.isValid).length,
            invalid: results.filter(r => !r.isValid).length,
            results: results
        };
    }

    /**
     * Check if ID has special CSS characters
     */
    static hasSpecialCssChars(id) {
        return /[.()[\]{}+~>,:;#@$%^&*=!|\\/"'`\s]/.test(id);
    }

    /**
     * Enhanced href-based locator generation (from your existing project)
     * This integrates your proven 92% strength class+href strategy
     */
    static generateHrefLocators(element) {
        const locators = [];

        if (element.tagName.toLowerCase() === 'a' && element.getAttribute('href')) {
            const href = element.getAttribute('href');
            
            // Strategy 1: Class + href combination (BEST for navigation - 92% strength)
            if (element.className && typeof element.className === 'string') {
                const classes = element.className.split(' ')
                    .filter(c => c.trim() && !c.startsWith('ai-extractor-'));
                if (classes.length > 0) {
                    const classHrefSelector = `.${classes.map(c => this.escapeSelector(c)).join('.')}[href="${href}"]`;
                    if (this.isUniqueSelector(classHrefSelector, element)) {
                        locators.push({
                            type: 'classHref',
                            selector: classHrefSelector,
                            priority: 15,
                            reliability: 'highest',
                            strength: 92
                        });
                    }
                }
            }

            // Strategy 2: Pure href
            const hrefSelector = `a[href="${href}"]`;
            if (this.isUniqueSelector(hrefSelector, element)) {
                locators.push({
                    type: 'href',
                    selector: hrefSelector,
                    priority: 25,
                    reliability: 'high',
                    strength: 78
                });
            }

            // Strategy 3: Role + href for accessibility
            const role = element.getAttribute('role');
            if (role) {
                const roleHrefSelector = `[role="${role}"][href="${href}"]`;
                if (this.isUniqueSelector(roleHrefSelector, element)) {
                    locators.push({
                        type: 'roleHref',
                        selector: roleHrefSelector,
                        priority: 35,
                        reliability: 'high',
                        strength: 88
                    });
                }
            }
        }

        return locators;
    }
}

module.exports = { BaseLocatorHelpers };
