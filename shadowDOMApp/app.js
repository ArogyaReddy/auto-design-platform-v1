// Main Application JavaScript
// This file initializes all Shadow DOM components and demonstrates their interactions

class ShadowDOMApp {
    constructor() {
        this.components = new Map();
        this.demoMode = true;
        this.init();
    }

    init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        console.log('🚀 Initializing Shadow DOM Test Application...');
        
        // Initialize component registry
        this.registerComponents();
        
        // Setup global event listeners
        this.setupGlobalEventListeners();
        
        // Start demo interactions
        if (this.demoMode) {
            this.startDemoSequence();
        }
        
        // Setup testing utilities
        this.setupTestingUtilities();
        
        console.log('✅ Shadow DOM Application initialized successfully');
        console.log('📊 Components loaded:', Array.from(this.components.keys()));
    }

    registerComponents() {
        // Get all custom elements from the DOM
        const customElements = document.querySelectorAll([
            'header-nav',
            'complex-form-widget',
            'dashboard-widget',
            'user-profile-card',
            'modal-container',
            'data-table-widget',
            'chat-widget',
            'notification-system',
            'media-gallery',
            'shopping-cart'
        ].join(','));

        customElements.forEach(element => {
            const componentName = element.tagName.toLowerCase();
            this.components.set(componentName, element);
            console.log(`📦 Registered component: ${componentName}`);
        });
    }

    setupGlobalEventListeners() {
        // Listen for component interactions
        document.addEventListener('component-interaction', (e) => {
            console.log('🔄 Component interaction:', e.detail);
            this.handleComponentInteraction(e.detail);
        });

        // Listen for form submissions
        document.addEventListener('form-submit', (e) => {
            console.log('📝 Form submitted:', e.detail);
            this.handleFormSubmission(e.detail);
        });

        // Listen for navigation events
        document.addEventListener('navigate', (e) => {
            console.log('🧭 Navigation event:', e.detail);
            this.handleNavigation(e.detail);
        });

        // Listen for modal events
        document.addEventListener('modal-action', (e) => {
            console.log('🗔 Modal action:', e.detail);
            this.handleModalAction(e.detail);
        });

        // Setup keyboard shortcuts for testing
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    handleComponentInteraction(detail) {
        const { component, action, data } = detail;
        
        switch (component) {
            case 'header-nav':
                this.handleNavigationInteraction(action, data);
                break;
            case 'dashboard-widget':
                this.handleDashboardInteraction(action, data);
                break;
            case 'chat-widget':
                this.handleChatInteraction(action, data);
                break;
            default:
                console.log(`Unhandled interaction for ${component}:`, action, data);
        }
    }

    handleNavigationInteraction(action, data) {
        switch (action) {
            case 'search':
                this.performGlobalSearch(data.query);
                break;
            case 'user-menu':
                this.showUserMenu(data);
                break;
            case 'notifications':
                this.showNotifications();
                break;
        }
    }

    handleDashboardInteraction(action, data) {
        const notificationSystem = this.components.get('notification-system');
        
        switch (action) {
            case 'metric-click':
                if (notificationSystem) {
                    notificationSystem.showNotification({
                        type: 'info',
                        title: 'Analytics',
                        message: `Viewing details for ${data.metric}: ${data.value}`,
                        duration: 3000
                    });
                }
                break;
            case 'export-data':
                this.exportDashboardData(data);
                break;
        }
    }

    handleChatInteraction(action, data) {
        const notificationSystem = this.components.get('notification-system');
        
        switch (action) {
            case 'new-message':
                if (notificationSystem) {
                    notificationSystem.showNotification({
                        type: 'info',
                        title: 'New Message',
                        message: `Message from ${data.sender}: ${data.preview}`,
                        duration: 4000
                    });
                }
                break;
            case 'video-call':
                this.initiateVideoCall(data);
                break;
        }
    }

    handleFormSubmission(detail) {
        const { formType, data, isValid } = detail;
        const notificationSystem = this.components.get('notification-system');
        
        if (isValid) {
            if (notificationSystem) {
                notificationSystem.showNotification({
                    type: 'success',
                    title: 'Form Submitted',
                    message: `${formType} form submitted successfully!`,
                    duration: 4000
                });
            }
            
            // Simulate form processing
            setTimeout(() => {
                if (notificationSystem) {
                    notificationSystem.showNotification({
                        type: 'info',
                        title: 'Processing Complete',
                        message: `Your ${formType} has been processed.`,
                        duration: 3000
                    });
                }
            }, 2000);
        } else {
            if (notificationSystem) {
                notificationSystem.showNotification({
                    type: 'error',
                    title: 'Form Error',
                    message: 'Please check your form and try again.',
                    duration: 4000
                });
            }
        }
    }

    handleModalAction(detail) {
        const { modalType, action, data } = detail;
        console.log(`Modal ${modalType} - Action: ${action}`, data);
        
        const notificationSystem = this.components.get('notification-system');
        
        if (action === 'login-success' && notificationSystem) {
            notificationSystem.showNotification({
                type: 'success',
                title: 'Login Successful',
                message: `Welcome back, ${data.username}!`,
                duration: 4000
            });
        }
    }

    handleKeyboardShortcuts(e) {
        // Only handle shortcuts when no input is focused
        if (document.activeElement.tagName === 'INPUT' || 
            document.activeElement.tagName === 'TEXTAREA') {
            return;
        }

        const key = e.key.toLowerCase();
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;

        if (ctrl) {
            switch (key) {
                case 'k': // Ctrl+K - Open search
                    e.preventDefault();
                    this.focusGlobalSearch();
                    break;
                case 'm': // Ctrl+M - Open modals
                    e.preventDefault();
                    this.openTestModal();
                    break;
                case 'n': // Ctrl+N - Show notifications
                    e.preventDefault();
                    this.showTestNotification();
                    break;
                case 'c': // Ctrl+C - Open chat
                    e.preventDefault();
                    this.openChat();
                    break;
                case 's': // Ctrl+S - Add to cart
                    e.preventDefault();
                    this.addTestItemToCart();
                    break;
            }
        }

        // ESC key to close all modals and panels
        if (key === 'escape') {
            this.closeAllPanels();
        }
    }

    // Demo sequence to showcase component interactions
    startDemoSequence() {
        console.log('🎬 Starting demo sequence...');
        
        // Show welcome notification after 1 second
        setTimeout(() => {
            this.showWelcomeNotification();
        }, 1000);

        // Simulate user interactions
        setTimeout(() => {
            this.simulateUserActivity();
        }, 3000);

        // Add items to cart periodically
        setTimeout(() => {
            this.simulateShoppingActivity();
        }, 5000);

        // Show dashboard updates
        setTimeout(() => {
            this.simulateDashboardUpdates();
        }, 7000);
    }

    showWelcomeNotification() {
        const notificationSystem = this.components.get('notification-system');
        if (notificationSystem) {
            notificationSystem.showNotification({
                type: 'info',
                title: 'Welcome to Shadow DOM Test App',
                message: 'This application demonstrates deep Shadow DOM nesting for testing the Element AI Extractor.',
                duration: 6000,
                actions: [
                    { 
                        id: 'tour', 
                        label: 'Take Tour', 
                        callback: () => this.startGuidedTour() 
                    },
                    { 
                        id: 'dismiss', 
                        label: 'Dismiss', 
                        callback: () => console.log('Welcome dismissed') 
                    }
                ]
            });
        }
    }

    simulateUserActivity() {
        const chatWidget = this.components.get('chat-widget');
        if (chatWidget) {
            // Simulate incoming messages
            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('component-interaction', {
                    detail: {
                        component: 'chat-widget',
                        action: 'new-message',
                        data: {
                            sender: 'Alice Johnson',
                            preview: 'Hey! How are you doing today?',
                            timestamp: new Date()
                        }
                    }
                }));
            }, 2000);

            setTimeout(() => {
                document.dispatchEvent(new CustomEvent('component-interaction', {
                    detail: {
                        component: 'chat-widget',
                        action: 'new-message',
                        data: {
                            sender: 'Bob Smith',
                            preview: 'The meeting has been rescheduled to 3 PM',
                            timestamp: new Date()
                        }
                    }
                }));
            }, 4000);
        }
    }

    simulateShoppingActivity() {
        const shoppingCart = this.components.get('shopping-cart');
        if (shoppingCart) {
            // Add sample products to cart
            const sampleProducts = [
                {
                    id: 3,
                    name: 'Wireless Keyboard',
                    description: 'Mechanical wireless keyboard with RGB lighting',
                    price: 129.99,
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23f093fb"/><text x="30" y="35" text-anchor="middle" fill="white" font-size="10">⌨️</text></svg>',
                    quantity: 1
                },
                {
                    id: 4,
                    name: 'USB-C Hub',
                    description: '7-in-1 USB-C hub with 4K HDMI support',
                    price: 79.99,
                    image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%234facfe"/><text x="30" y="35" text-anchor="middle" fill="white" font-size="10">🔌</text></svg>',
                    quantity: 2
                }
            ];

            sampleProducts.forEach((product, index) => {
                setTimeout(() => {
                    document.dispatchEvent(new CustomEvent('add-to-cart', {
                        detail: product
                    }));
                }, index * 3000);
            });
        }
    }

    simulateDashboardUpdates() {
        const dashboard = this.components.get('dashboard-widget');
        if (dashboard) {
            // Simulate metric updates
            setInterval(() => {
                document.dispatchEvent(new CustomEvent('component-interaction', {
                    detail: {
                        component: 'dashboard-widget',
                        action: 'metric-click',
                        data: {
                            metric: 'Active Users',
                            value: Math.floor(Math.random() * 1000) + 500
                        }
                    }
                }));
            }, 10000);
        }
    }

    // Testing utilities
    setupTestingUtilities() {
        // Make components globally accessible for testing
        window.shadowDOMApp = this;
        window.testComponents = this.components;
        
        // Add testing methods to window
        window.testShadowDOM = {
            getAllShadowRoots: () => this.getAllShadowRoots(),
            findElementInShadowDOM: (selector) => this.findElementInShadowDOM(selector),
            getComponentStates: () => this.getComponentStates(),
            simulateInteraction: (component, action, data) => this.simulateInteraction(component, action, data),
            extractAllElements: () => this.extractAllElements(),
            runAccessibilityCheck: () => this.runAccessibilityCheck()
        };

        console.log('🧪 Testing utilities are available via window.testShadowDOM');
    }

    getAllShadowRoots() {
        const shadowRoots = [];
        
        const findShadowRoots = (element) => {
            if (element.shadowRoot) {
                shadowRoots.push({
                    host: element,
                    shadowRoot: element.shadowRoot,
                    hostTag: element.tagName.toLowerCase()
                });
                
                // Recursively find nested shadow roots
                const shadowElements = element.shadowRoot.querySelectorAll('*');
                shadowElements.forEach(findShadowRoots);
            }
            
            // Check child elements
            element.children && Array.from(element.children).forEach(findShadowRoots);
        };

        findShadowRoots(document.body);
        return shadowRoots;
    }

    findElementInShadowDOM(selector) {
        const results = [];
        const shadowRoots = this.getAllShadowRoots();
        
        shadowRoots.forEach(({ shadowRoot, hostTag }) => {
            const elements = shadowRoot.querySelectorAll(selector);
            elements.forEach(element => {
                results.push({
                    element,
                    hostComponent: hostTag,
                    shadowRoot
                });
            });
        });
        
        return results;
    }

    getComponentStates() {
        const states = {};
        
        this.components.forEach((component, name) => {
            states[name] = {
                isConnected: component.isConnected,
                hasShadowRoot: !!component.shadowRoot,
                attributes: Array.from(component.attributes).map(attr => ({
                    name: attr.name,
                    value: attr.value
                })),
                shadowRootMode: component.shadowRoot?.mode,
                childElementCount: component.shadowRoot?.children?.length || 0
            };
        });
        
        return states;
    }

    simulateInteraction(componentName, action, data) {
        document.dispatchEvent(new CustomEvent('component-interaction', {
            detail: {
                component: componentName,
                action: action,
                data: data
            }
        }));
    }

    extractAllElements() {
        const allElements = [];
        
        // Extract regular DOM elements
        const regularElements = document.querySelectorAll('*');
        regularElements.forEach(element => {
            allElements.push({
                type: 'regular',
                tag: element.tagName.toLowerCase(),
                id: element.id,
                classes: Array.from(element.classList),
                attributes: Array.from(element.attributes).map(attr => ({
                    name: attr.name,
                    value: attr.value
                })),
                textContent: element.textContent?.trim().substring(0, 100),
                hasEventListeners: this.hasEventListeners(element)
            });
        });

        // Extract Shadow DOM elements
        const shadowRoots = this.getAllShadowRoots();
        shadowRoots.forEach(({ shadowRoot, hostTag }) => {
            const shadowElements = shadowRoot.querySelectorAll('*');
            shadowElements.forEach(element => {
                allElements.push({
                    type: 'shadow',
                    hostComponent: hostTag,
                    tag: element.tagName.toLowerCase(),
                    id: element.id,
                    classes: Array.from(element.classList),
                    attributes: Array.from(element.attributes).map(attr => ({
                        name: attr.name,
                        value: attr.value
                    })),
                    textContent: element.textContent?.trim().substring(0, 100),
                    hasEventListeners: this.hasEventListeners(element),
                    testId: element.getAttribute('data-testid')
                });
            });
        });

        return allElements;
    }

    hasEventListeners(element) {
        // This is a simplified check - in real scenarios you might need more sophisticated detection
        const eventProps = Object.getOwnPropertyNames(element).filter(prop => 
            prop.startsWith('on') && typeof element[prop] === 'function'
        );
        return eventProps.length > 0;
    }

    runAccessibilityCheck() {
        const issues = [];
        const allElements = this.extractAllElements();
        
        allElements.forEach(element => {
            // Check for missing alt text on images
            if (element.tag === 'img' && !element.attributes.some(attr => attr.name === 'alt')) {
                issues.push({
                    type: 'missing-alt',
                    element: element,
                    severity: 'error',
                    message: 'Image missing alt attribute'
                });
            }
            
            // Check for missing labels on form inputs
            if (['input', 'select', 'textarea'].includes(element.tag)) {
                const hasLabel = element.attributes.some(attr => 
                    ['aria-label', 'aria-labelledby', 'title'].includes(attr.name)
                );
                if (!hasLabel) {
                    issues.push({
                        type: 'missing-label',
                        element: element,
                        severity: 'warning',
                        message: 'Form element missing accessible label'
                    });
                }
            }
            
            // Check for interactive elements without proper ARIA
            if (element.attributes.some(attr => attr.name === 'onclick') || 
                ['button', 'a', 'input'].includes(element.tag)) {
                const hasRole = element.attributes.some(attr => attr.name === 'role');
                const hasAriaLabel = element.attributes.some(attr => 
                    attr.name.startsWith('aria-')
                );
                
                if (!hasRole && !hasAriaLabel && element.tag === 'div') {
                    issues.push({
                        type: 'interactive-no-role',
                        element: element,
                        severity: 'warning',
                        message: 'Interactive element missing role or ARIA attributes'
                    });
                }
            }
        });
        
        return issues;
    }

    // Utility methods for keyboard shortcuts
    focusGlobalSearch() {
        const searchElements = this.findElementInShadowDOM('input[type="search"], .search-input');
        if (searchElements.length > 0) {
            searchElements[0].element.focus();
        }
    }

    openTestModal() {
        const modalContainer = this.components.get('modal-container');
        if (modalContainer) {
            modalContainer.openModal('login');
        }
    }

    showTestNotification() {
        const notificationSystem = this.components.get('notification-system');
        if (notificationSystem) {
            notificationSystem.showNotification({
                type: 'info',
                title: 'Test Notification',
                message: 'This is a test notification triggered by keyboard shortcut (Ctrl+N).',
                duration: 4000
            });
        }
    }

    openChat() {
        const chatWidget = this.components.get('chat-widget');
        if (chatWidget && chatWidget.toggleChat) {
            chatWidget.toggleChat();
        }
    }

    addTestItemToCart() {
        document.dispatchEvent(new CustomEvent('add-to-cart', {
            detail: {
                id: Date.now(),
                name: 'Test Product',
                description: 'Added via keyboard shortcut',
                price: 19.99,
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23667eea"/><text x="30" y="35" text-anchor="middle" fill="white" font-size="10">🎁</text></svg>',
                quantity: 1
            }
        }));
    }

    closeAllPanels() {
        // Close chat
        const chatWidget = this.components.get('chat-widget');
        if (chatWidget && chatWidget.closeChat) {
            chatWidget.closeChat();
        }
        
        // Close shopping cart
        const shoppingCart = this.components.get('shopping-cart');
        if (shoppingCart && shoppingCart.closeCart) {
            shoppingCart.closeCart();
        }
        
        // Close any open modals
        const modalContainer = this.components.get('modal-container');
        if (modalContainer && modalContainer.closeModal) {
            modalContainer.closeModal();
        }
    }

    startGuidedTour() {
        console.log('🎯 Starting guided tour...');
        
        const notificationSystem = this.components.get('notification-system');
        if (!notificationSystem) return;

        const tourSteps = [
            {
                title: 'Navigation System',
                message: 'This header contains 4 levels of nested Shadow DOM with search, user menu, and notifications.',
                duration: 5000
            },
            {
                title: 'Form Components',
                message: 'The registration form features multi-step wizards with nested Shadow DOM validation.',
                duration: 5000
            },
            {
                title: 'Dashboard Analytics',
                message: 'Complex data visualization with 3 levels of nested Shadow DOM components.',
                duration: 5000
            },
            {
                title: 'Modal System',
                message: 'Advanced modal container with nested forms, galleries, and video players.',
                duration: 5000
            },
            {
                title: 'Shopping Experience',
                message: 'E-commerce cart with checkout flow - try adding items and viewing the cart!',
                duration: 5000
            },
            {
                title: 'Testing Ready',
                message: 'All components include comprehensive data-testid attributes for easy extraction.',
                duration: 6000
            }
        ];

        tourSteps.forEach((step, index) => {
            setTimeout(() => {
                notificationSystem.showNotification({
                    type: 'info',
                    title: `Tour Step ${index + 1}: ${step.title}`,
                    message: step.message,
                    duration: step.duration
                });
            }, index * 3000);
        });
    }

    // Performance monitoring
    getPerformanceMetrics() {
        const metrics = {
            componentCount: this.components.size,
            shadowRootCount: this.getAllShadowRoots().length,
            totalElements: this.extractAllElements().length,
            memoryUsage: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024),
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024),
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024)
            } : 'Not available',
            renderTime: performance.now()
        };
        
        return metrics;
    }
}

// Initialize the application
new ShadowDOMApp();

// Console welcome message
console.log(`
🌟 Shadow DOM Test Application Loaded Successfully!

🔍 Available Testing Commands:
• window.testShadowDOM.getAllShadowRoots() - Get all Shadow DOM roots
• window.testShadowDOM.findElementInShadowDOM(selector) - Find elements in Shadow DOM
• window.testShadowDOM.getComponentStates() - Get component states
• window.testShadowDOM.extractAllElements() - Extract all elements for testing
• window.testShadowDOM.runAccessibilityCheck() - Run accessibility audit

⌨️  Keyboard Shortcuts:
• Ctrl+K - Focus search
• Ctrl+M - Open modal
• Ctrl+N - Show notification
• Ctrl+C - Open chat
• Ctrl+S - Add item to cart
• ESC - Close all panels

🎬 This app demonstrates:
• Deep Shadow DOM nesting (up to 4 levels)
• Complex component interactions
• Real-time data updates
• Advanced form handling
• E-commerce functionality
• Media management
• Chat systems
• Notification management

Perfect for testing the Element AI Extractor VS Code extension! 🚀
`);
