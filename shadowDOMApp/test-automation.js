// Shadow DOM Test Automation Script
// This script provides comprehensive testing utilities for the Element AI Extractor extension

class ShadowDOMTestAutomation {
    constructor() {
        this.testResults = [];
        this.extractedElements = new Map();
        this.performanceMetrics = [];
        this.errorLog = [];
        
        this.init();
    }
    
    init() {
        console.log('🧪 Shadow DOM Test Automation initialized');
        
        // Inject test utilities into global scope
        window.shadowDOMTestUtils = this;
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Setup error tracking
        this.setupErrorTracking();
        
        // Setup mutation observer for dynamic content
        this.setupMutationObserver();
        
        // Expose testing methods
        this.exposeTestingMethods();
    }
    
    setupPerformanceMonitoring() {
        // Monitor performance metrics
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                this.performanceMetrics.push({
                    timestamp: Date.now(),
                    type: entry.entryType,
                    name: entry.name,
                    duration: entry.duration,
                    startTime: entry.startTime
                });
            }
        });
        
        observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
    }
    
    setupErrorTracking() {
        window.addEventListener('error', (event) => {
            this.errorLog.push({
                timestamp: Date.now(),
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error?.toString()
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.errorLog.push({
                timestamp: Date.now(),
                message: 'Unhandled Promise Rejection',
                reason: event.reason?.toString()
            });
        });
    }
    
    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            this.analyzeNewElement(node);
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeOldValue: true
        });
    }
    
    analyzeNewElement(element) {
        // Check if it's a custom element with shadow root
        if (element.tagName && element.tagName.includes('-')) {
            setTimeout(() => {
                if (element.shadowRoot) {
                    console.log(`🔍 New shadow root detected: ${element.tagName}`);
                    this.analyzeShadowRoot(element.shadowRoot, element.tagName);
                }
            }, 100);
        }
    }
    
    exposeTestingMethods() {
        // Expose methods for external testing tools
        window.extractAllShadowDOMElements = () => this.extractAllShadowDOMElements();
        window.generateTestSelectors = () => this.generateTestSelectors();
        window.validateAccessibility = () => this.validateAccessibility();
        window.runInteractionTests = () => this.runInteractionTests();
        window.exportTestResults = () => this.exportTestResults();
        window.simulateUserInteractions = () => this.simulateUserInteractions();
    }
    
    // Main extraction method for all Shadow DOM elements
    extractAllShadowDOMElements() {
        console.log('🔍 Starting comprehensive Shadow DOM element extraction...');
        
        const startTime = performance.now();
        const results = {
            timestamp: new Date().toISOString(),
            shadowRoots: [],
            interactiveElements: [],
            formElements: [],
            customElements: [],
            nestedStructures: [],
            testableElements: [],
            performanceMetrics: {
                extractionTime: 0,
                elementsProcessed: 0,
                shadowRootsFound: 0,
                maxNestingLevel: 0
            }
        };
        
        // Find all custom elements (potential shadow hosts)
        const customElements = document.querySelectorAll('*');
        let elementsProcessed = 0;
        
        customElements.forEach((element) => {
            elementsProcessed++;
            
            // Check for shadow root
            if (element.shadowRoot) {
                const shadowAnalysis = this.analyzeShadowRoot(element.shadowRoot, element.tagName);
                results.shadowRoots.push({
                    hostElement: element.tagName,
                    hostId: element.id || 'no-id',
                    hostClasses: Array.from(element.classList),
                    nestingLevel: shadowAnalysis.nestingLevel,
                    elements: shadowAnalysis.elements,
                    interactiveElements: shadowAnalysis.interactiveElements,
                    formElements: shadowAnalysis.formElements
                });
                
                results.performanceMetrics.maxNestingLevel = Math.max(
                    results.performanceMetrics.maxNestingLevel,
                    shadowAnalysis.nestingLevel
                );
            }
            
            // Check if it's a custom element
            if (element.tagName.includes('-')) {
                results.customElements.push({
                    tagName: element.tagName,
                    id: element.id || 'no-id',
                    classes: Array.from(element.classList),
                    attributes: this.getElementAttributes(element),
                    hasShadowRoot: !!element.shadowRoot
                });
            }
            
            // Check if it's interactive
            if (this.isInteractiveElement(element)) {
                results.interactiveElements.push(this.createElementDescriptor(element));
            }
            
            // Check if it's a form element
            if (this.isFormElement(element)) {
                results.formElements.push(this.createFormElementDescriptor(element));
            }
            
            // Check if it has test identifiers
            if (this.hasTestIdentifiers(element)) {
                results.testableElements.push(this.createTestableElementDescriptor(element));
            }
        });
        
        const endTime = performance.now();
        results.performanceMetrics.extractionTime = endTime - startTime;
        results.performanceMetrics.elementsProcessed = elementsProcessed;
        results.performanceMetrics.shadowRootsFound = results.shadowRoots.length;
        
        console.log('✅ Shadow DOM extraction completed:', results.performanceMetrics);
        this.testResults.push(results);
        
        return results;
    }
    
    analyzeShadowRoot(shadowRoot, hostTagName, nestingLevel = 1) {
        const analysis = {
            hostTagName,
            nestingLevel,
            elements: [],
            interactiveElements: [],
            formElements: [],
            nestedShadowRoots: []
        };
        
        const elements = shadowRoot.querySelectorAll('*');
        
        elements.forEach((element) => {
            const elementData = this.createElementDescriptor(element);
            analysis.elements.push(elementData);
            
            // Check for nested shadow roots
            if (element.shadowRoot) {
                const nestedAnalysis = this.analyzeShadowRoot(
                    element.shadowRoot,
                    element.tagName,
                    nestingLevel + 1
                );
                analysis.nestedShadowRoots.push(nestedAnalysis);
                analysis.nestingLevel = Math.max(analysis.nestingLevel, nestedAnalysis.nestingLevel);
            }
            
            // Categorize elements
            if (this.isInteractiveElement(element)) {
                analysis.interactiveElements.push(elementData);
            }
            
            if (this.isFormElement(element)) {
                analysis.formElements.push(this.createFormElementDescriptor(element));
            }
        });
        
        return analysis;
    }
    
    createElementDescriptor(element) {
        return {
            tagName: element.tagName,
            id: element.id || null,
            classes: Array.from(element.classList),
            attributes: this.getElementAttributes(element),
            textContent: element.textContent?.trim()?.substring(0, 100) || '',
            xpath: this.generateXPath(element),
            cssSelector: this.generateCSSSelector(element),
            testId: this.getTestId(element),
            isVisible: this.isElementVisible(element),
            boundingRect: element.getBoundingClientRect(),
            computedStyle: this.getRelevantComputedStyles(element)
        };
    }
    
    createFormElementDescriptor(element) {
        const baseDescriptor = this.createElementDescriptor(element);
        return {
            ...baseDescriptor,
            type: element.type || element.tagName.toLowerCase(),
            name: element.name || null,
            value: element.value || null,
            placeholder: element.placeholder || null,
            required: element.required || false,
            disabled: element.disabled || false,
            readonly: element.readOnly || false,
            form: element.form?.id || null,
            labels: this.getAssociatedLabels(element)
        };
    }
    
    createTestableElementDescriptor(element) {
        const baseDescriptor = this.createElementDescriptor(element);
        return {
            ...baseDescriptor,
            testIdentifiers: {
                testId: element.getAttribute('data-testid') || element.getAttribute('test-id'),
                id: element.id,
                name: element.name,
                role: element.getAttribute('role'),
                ariaLabel: element.getAttribute('aria-label'),
                title: element.title
            },
            automationAttributes: {
                automationId: element.getAttribute('data-automation-id'),
                qaId: element.getAttribute('data-qa'),
                testName: element.getAttribute('data-test-name')
            }
        };
    }
    
    // Helper methods
    isInteractiveElement(element) {
        const interactiveTags = ['button', 'a', 'input', 'select', 'textarea', 'details', 'summary'];
        const interactiveRoles = ['button', 'link', 'tab', 'menuitem', 'option'];
        
        return interactiveTags.includes(element.tagName.toLowerCase()) ||
               interactiveRoles.includes(element.getAttribute('role')) ||
               element.hasAttribute('onclick') ||
               element.hasAttribute('tabindex') ||
               element.style.cursor === 'pointer';
    }
    
    isFormElement(element) {
        const formTags = ['input', 'select', 'textarea', 'button', 'form', 'fieldset', 'legend', 'label'];
        return formTags.includes(element.tagName.toLowerCase());
    }
    
    hasTestIdentifiers(element) {
        return element.id ||
               element.name ||
               element.hasAttribute('data-testid') ||
               element.hasAttribute('test-id') ||
               element.hasAttribute('data-automation-id') ||
               element.hasAttribute('data-qa') ||
               element.hasAttribute('data-test-name') ||
               element.getAttribute('role');
    }
    
    getElementAttributes(element) {
        const attributes = {};
        for (let attr of element.attributes) {
            attributes[attr.name] = attr.value;
        }
        return attributes;
    }
    
    getTestId(element) {
        return element.getAttribute('data-testid') ||
               element.getAttribute('test-id') ||
               element.id ||
               element.name ||
               null;
    }
    
    isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0' &&
               element.offsetWidth > 0 &&
               element.offsetHeight > 0;
    }
    
    getRelevantComputedStyles(element) {
        const style = window.getComputedStyle(element);
        return {
            display: style.display,
            visibility: style.visibility,
            opacity: style.opacity,
            position: style.position,
            zIndex: style.zIndex
        };
    }
    
    getAssociatedLabels(element) {
        const labels = [];
        
        // Find labels by 'for' attribute
        if (element.id) {
            const labelElements = document.querySelectorAll(`label[for="${element.id}"]`);
            labelElements.forEach(label => {
                labels.push(label.textContent?.trim());
            });
        }
        
        // Find parent label
        const parentLabel = element.closest('label');
        if (parentLabel) {
            labels.push(parentLabel.textContent?.trim());
        }
        
        return labels.filter(label => label && label.length > 0);
    }
    
    generateXPath(element) {
        if (element.id) {
            return `//*[@id='${element.id}']`;
        }
        
        const parts = [];
        let current = element;
        
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let index = 1;
            let sibling = current.previousElementSibling;
            
            while (sibling) {
                if (sibling.tagName === current.tagName) {
                    index++;
                }
                sibling = sibling.previousElementSibling;
            }
            
            const tagName = current.tagName.toLowerCase();
            const part = index > 1 ? `${tagName}[${index}]` : tagName;
            parts.unshift(part);
            
            current = current.parentElement;
        }
        
        return parts.length ? '/' + parts.join('/') : '';
    }
    
    generateCSSSelector(element) {
        if (element.id) {
            return `#${element.id}`;
        }
        
        const parts = [];
        let current = element;
        
        while (current && current.nodeType === Node.ELEMENT_NODE) {
            let selector = current.tagName.toLowerCase();
            
            if (current.classList.length > 0) {
                selector += '.' + Array.from(current.classList).join('.');
            }
            
            parts.unshift(selector);
            current = current.parentElement;
            
            // Stop if we reach a unique parent
            if (current && current.id) {
                parts.unshift(`#${current.id}`);
                break;
            }
        }
        
        return parts.join(' > ');
    }
    
    // Advanced testing methods
    generateTestSelectors() {
        console.log('🎯 Generating optimized test selectors...');
        
        const elements = this.extractAllShadowDOMElements();
        const selectors = [];
        
        // Generate selectors for all testable elements
        elements.testableElements.forEach(element => {
            const selectorOptions = [];
            
            // Priority 1: Test ID attributes
            if (element.testIdentifiers.testId) {
                selectorOptions.push({
                    type: 'data-testid',
                    selector: `[data-testid="${element.testIdentifiers.testId}"]`,
                    priority: 1,
                    reliability: 'high'
                });
            }
            
            // Priority 2: ID attribute
            if (element.id) {
                selectorOptions.push({
                    type: 'id',
                    selector: `#${element.id}`,
                    priority: 2,
                    reliability: 'high'
                });
            }
            
            // Priority 3: Name attribute
            if (element.testIdentifiers.name) {
                selectorOptions.push({
                    type: 'name',
                    selector: `[name="${element.testIdentifiers.name}"]`,
                    priority: 3,
                    reliability: 'medium'
                });
            }
            
            // Priority 4: Role-based selector
            if (element.testIdentifiers.role) {
                selectorOptions.push({
                    type: 'role',
                    selector: `[role="${element.testIdentifiers.role}"]`,
                    priority: 4,
                    reliability: 'medium'
                });
            }
            
            // Priority 5: CSS selector
            selectorOptions.push({
                type: 'css',
                selector: element.cssSelector,
                priority: 5,
                reliability: 'low'
            });
            
            // Priority 6: XPath
            selectorOptions.push({
                type: 'xpath',
                selector: element.xpath,
                priority: 6,
                reliability: 'low'
            });
            
            selectors.push({
                element: {
                    tagName: element.tagName,
                    id: element.id,
                    classes: element.classes,
                    text: element.textContent
                },
                selectors: selectorOptions.sort((a, b) => a.priority - b.priority)
            });
        });
        
        console.log(`✅ Generated ${selectors.length} test selectors`);
        return selectors;
    }
    
    async validateAccessibility() {
        console.log('♿ Running accessibility validation...');
        
        const issues = [];
        const elements = document.querySelectorAll('*');
        
        elements.forEach(element => {
            // Check for missing alt text on images
            if (element.tagName === 'IMG' && !element.alt) {
                issues.push({
                    type: 'missing-alt-text',
                    element: this.createElementDescriptor(element),
                    severity: 'error',
                    message: 'Image missing alt attribute'
                });
            }
            
            // Check for interactive elements without accessible names
            if (this.isInteractiveElement(element)) {
                const accessibleName = this.getAccessibleName(element);
                if (!accessibleName) {
                    issues.push({
                        type: 'missing-accessible-name',
                        element: this.createElementDescriptor(element),
                        severity: 'error',
                        message: 'Interactive element missing accessible name'
                    });
                }
            }
            
            // Check for form inputs without labels
            if (element.tagName === 'INPUT' && element.type !== 'hidden') {
                const labels = this.getAssociatedLabels(element);
                if (labels.length === 0 && !element.getAttribute('aria-label')) {
                    issues.push({
                        type: 'missing-label',
                        element: this.createElementDescriptor(element),
                        severity: 'error',
                        message: 'Form input missing label'
                    });
                }
            }
            
            // Check for proper heading hierarchy
            if (element.tagName.match(/^H[1-6]$/)) {
                // This would require more complex logic to track heading hierarchy
            }
        });
        
        console.log(`♿ Accessibility validation completed. Found ${issues.length} issues`);
        return {
            timestamp: new Date().toISOString(),
            totalElements: elements.length,
            issues: issues,
            summary: {
                errors: issues.filter(i => i.severity === 'error').length,
                warnings: issues.filter(i => i.severity === 'warning').length
            }
        };
    }
    
    getAccessibleName(element) {
        return element.getAttribute('aria-label') ||
               element.getAttribute('aria-labelledby') ||
               element.title ||
               element.textContent?.trim() ||
               (element.tagName === 'INPUT' && element.placeholder) ||
               null;
    }
    
    async simulateUserInteractions() {
        console.log('🤖 Starting user interaction simulation...');
        
        const interactions = [];
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], [onclick]');
        
        for (let element of interactiveElements) {
            try {
                if (!this.isElementVisible(element)) continue;
                
                const interaction = {
                    element: this.createElementDescriptor(element),
                    interactions: []
                };
                
                // Simulate hover
                element.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
                interaction.interactions.push({ type: 'hover', success: true });
                
                // Simulate focus for focusable elements
                if (element.tabIndex >= 0 || ['input', 'button', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase())) {
                    element.focus();
                    interaction.interactions.push({ type: 'focus', success: true });
                }
                
                // Simulate click for clickable elements
                if (element.tagName === 'BUTTON' || element.hasAttribute('onclick') || element.getAttribute('role') === 'button') {
                    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                    interaction.interactions.push({ type: 'click', success: true });
                }
                
                // Simulate input for form elements
                if (element.tagName === 'INPUT') {
                    const inputType = element.type.toLowerCase();
                    if (['text', 'email', 'password', 'search'].includes(inputType)) {
                        element.value = 'test-input';
                        element.dispatchEvent(new Event('input', { bubbles: true }));
                        interaction.interactions.push({ type: 'input', success: true, value: 'test-input' });
                    }
                }
                
                interactions.push(interaction);
                
                // Small delay between interactions
                await new Promise(resolve => setTimeout(resolve, 50));
                
            } catch (error) {
                interactions.push({
                    element: this.createElementDescriptor(element),
                    error: error.message
                });
            }
        }
        
        console.log(`🤖 Simulated interactions with ${interactions.length} elements`);
        return {
            timestamp: new Date().toISOString(),
            totalInteractions: interactions.length,
            successfulInteractions: interactions.filter(i => !i.error).length,
            interactions: interactions
        };
    }
    
    exportTestResults() {
        const fullResults = {
            timestamp: new Date().toISOString(),
            testResults: this.testResults,
            performanceMetrics: this.performanceMetrics,
            errorLog: this.errorLog,
            extractedElements: Object.fromEntries(this.extractedElements),
            userAgent: navigator.userAgent,
            url: window.location.href,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            }
        };
        
        // Create downloadable file
        const blob = new Blob([JSON.stringify(fullResults, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `shadow-dom-test-results-${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📊 Test results exported successfully');
        return fullResults;
    }
    
    // Continuous monitoring methods
    startContinuousMonitoring() {
        console.log('📊 Starting continuous monitoring...');
        
        // Monitor every 5 seconds
        this.monitoringInterval = setInterval(() => {
            this.performQuickAnalysis();
        }, 5000);
    }
    
    stopContinuousMonitoring() {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            console.log('⏹️ Continuous monitoring stopped');
        }
    }
    
    performQuickAnalysis() {
        const customElements = document.querySelectorAll('*');
        let shadowRootCount = 0;
        
        customElements.forEach(element => {
            if (element.shadowRoot) {
                shadowRootCount++;
            }
        });
        
        console.log(`📊 Quick analysis - Shadow roots: ${shadowRootCount}, Total elements: ${customElements.length}`);
    }
}

// Initialize the test automation system
document.addEventListener('DOMContentLoaded', () => {
    window.shadowDOMTestAutomation = new ShadowDOMTestAutomation();
    console.log('🚀 Shadow DOM Test Automation System Ready');
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM still loading
} else {
    window.shadowDOMTestAutomation = new ShadowDOMTestAutomation();
    console.log('🚀 Shadow DOM Test Automation System Ready');
}
