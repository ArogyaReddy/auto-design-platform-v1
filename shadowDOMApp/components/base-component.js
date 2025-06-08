// Base Component Class for Shadow DOM Components
class BaseComponent extends HTMLElement {
    constructor() {
        super();
        this.shadowRoot = this.attachShadow({ mode: 'open' });
        this.state = {};
        this.eventListeners = new Map();
    }

    // Lifecycle methods
    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.onMount();
    }

    disconnectedCallback() {
        this.cleanup();
        this.onUnmount();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.onAttributeChange(name, oldValue, newValue);
        this.render();
    }

    // State management
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    getState() {
        return this.state;
    }

    // Event handling
    on(event, handler) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(handler);
    }

    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(handler => handler(data));
        }
        
        // Also dispatch custom event
        this.dispatchEvent(new CustomEvent(event, { 
            detail: data,
            bubbles: true,
            composed: true 
        }));
    }

    // Utility methods
    $(selector) {
        return this.shadowRoot.querySelector(selector);
    }

    $$(selector) {
        return this.shadowRoot.querySelectorAll(selector);
    }

    // Template creation
    createTemplate(html) {
        const template = document.createElement('template');
        template.innerHTML = html;
        return template.content.cloneNode(true);
    }

    // Style injection
    injectStyles(css) {
        const style = document.createElement('style');
        style.textContent = css;
        this.shadowRoot.appendChild(style);
    }

    // Load external styles
    loadExternalStyles(href) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = href;
        this.shadowRoot.appendChild(link);
    }

    // Animation utilities
    animate(element, keyframes, options = {}) {
        const defaultOptions = {
            duration: 300,
            easing: 'ease-in-out',
            fill: 'both'
        };
        return element.animate(keyframes, { ...defaultOptions, ...options });
    }

    // Debounce utility
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle utility
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ARIA utilities
    setAriaAttribute(element, attribute, value) {
        element.setAttribute(`aria-${attribute}`, value);
    }

    setAriaLabel(element, label) {
        this.setAriaAttribute(element, 'label', label);
    }

    setAriaDescribedBy(element, id) {
        this.setAriaAttribute(element, 'describedby', id);
    }

    // Focus management
    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        firstFocusable?.focus();
    }

    // Data validation
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^\+?[\d\s\-\(\)]{10,}$/;
        return re.test(phone);
    }

    validateRequired(value) {
        return value && value.toString().trim().length > 0;
    }

    // HTTP utilities
    async fetchData(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            throw error;
        }
    }

    // Local storage utilities
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
        } catch (error) {
            console.error('Storage save error:', error);
        }
    }

    loadFromStorage(key, defaultValue = null) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        } catch (error) {
            console.error('Storage load error:', error);
            return defaultValue;
        }
    }

    removeFromStorage(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Storage remove error:', error);
        }
    }

    // Abstract methods to be implemented by subclasses
    render() {
        throw new Error('render() method must be implemented by subclass');
    }

    setupEventListeners() {
        // Optional: override in subclass
    }

    onMount() {
        // Optional: override in subclass
    }

    onUnmount() {
        // Optional: override in subclass
    }

    onAttributeChange(name, oldValue, newValue) {
        // Optional: override in subclass
    }

    cleanup() {
        // Clean up event listeners and resources
        this.eventListeners.clear();
        
        // Remove all event listeners from shadow DOM
        const allElements = this.shadowRoot.querySelectorAll('*');
        allElements.forEach(element => {
            const newElement = element.cloneNode(true);
            element.parentNode?.replaceChild(newElement, element);
        });
    }

    // Performance monitoring
    measurePerformance(name, fn) {
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        console.log(`${name} took ${end - start} milliseconds`);
        return result;
    }

    // Error handling
    handleError(error, context = 'Unknown') {
        console.error(`Error in ${context}:`, error);
        this.emit('error', { error, context });
    }

    // Accessibility helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }
}

// Export for use in other components
window.BaseComponent = BaseComponent;
