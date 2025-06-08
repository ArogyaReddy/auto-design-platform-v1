// Modal Container System with Full-Screen Capabilities
class ModalContainer extends BaseComponent {
    constructor() {
        super();
        this.isOpen = false;
        this.isFullscreen = false;
        this.modalContent = '';
        this.modalType = 'default';
        this.backdropClickClose = true;
        this.escapeKeyClose = true;
    }

    static get observedAttributes() {
        return ['modal-type', 'fullscreen', 'backdrop-close', 'escape-close'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'modal-type') {
            this.modalType = newValue || 'default';
        } else if (name === 'fullscreen') {
            this.isFullscreen = newValue !== null;
        } else if (name === 'backdrop-close') {
            this.backdropClickClose = newValue !== 'false';
        } else if (name === 'escape-close') {
            this.escapeKeyClose = newValue !== 'false';
        }
        
        if (this.shadowRoot) {
            this.render();
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
        this.initializeModal();
    }

    disconnectedCallback() {
        this.removeEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 9999;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                :host(.open) {
                    pointer-events: all;
                    opacity: 1;
                }

                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(4px);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .modal-container {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    box-sizing: border-box;
                }

                .modal-content {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow: hidden;
                    transform: scale(0.9) translateY(50px);
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    cursor: default;
                    position: relative;
                }

                :host(.open) .modal-content {
                    transform: scale(1) translateY(0);
                }

                /* Modal Types */
                .modal-content.small {
                    width: 400px;
                    min-height: 300px;
                }

                .modal-content.medium {
                    width: 600px;
                    min-height: 400px;
                }

                .modal-content.large {
                    width: 800px;
                    min-height: 500px;
                }

                .modal-content.extra-large {
                    width: 1000px;
                    min-height: 600px;
                }

                .modal-content.fullscreen {
                    width: 100vw;
                    height: 100vh;
                    max-width: 100vw;
                    max-height: 100vh;
                    border-radius: 0;
                    transform: scale(1.1);
                }

                :host(.open) .modal-content.fullscreen {
                    transform: scale(1);
                }

                .modal-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    background: #f9fafb;
                    border-radius: 12px 12px 0 0;
                }

                .modal-content.fullscreen .modal-header {
                    border-radius: 0;
                }

                .modal-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin: 0;
                }

                .modal-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .control-button {
                    width: 32px;
                    height: 32px;
                    border: none;
                    border-radius: 6px;
                    background: transparent;
                    color: #6b7280;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .control-button:hover {
                    background: #e5e7eb;
                    color: #374151;
                }

                .control-button.fullscreen-toggle {
                    background: #f3f4f6;
                }

                .control-button.fullscreen-toggle:hover {
                    background: #e5e7eb;
                }

                .control-button.close {
                    color: #ef4444;
                }

                .control-button.close:hover {
                    background: #fef2f2;
                    color: #dc2626;
                }

                .modal-body {
                    padding: 2rem;
                    overflow-y: auto;
                    flex: 1;
                }

                .modal-content.fullscreen .modal-body {
                    height: calc(100vh - 80px);
                }

                .modal-footer {
                    padding: 1.5rem 2rem;
                    border-top: 1px solid #e5e7eb;
                    background: #f9fafb;
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    border-radius: 0 0 12px 12px;
                }

                .modal-content.fullscreen .modal-footer {
                    border-radius: 0;
                }

                .default-content {
                    text-align: center;
                    padding: 2rem;
                }

                .content-placeholder {
                    color: #6b7280;
                    font-size: 1rem;
                    margin-bottom: 1rem;
                }

                .loading-spinner {
                    display: inline-block;
                    width: 32px;
                    height: 32px;
                    border: 3px solid #f3f4f6;
                    border-top: 3px solid #6366f1;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 1rem auto;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .modal-container {
                        padding: 1rem;
                    }

                    .modal-content.small,
                    .modal-content.medium,
                    .modal-content.large,
                    .modal-content.extra-large {
                        width: 100%;
                        margin: 0;
                    }

                    .modal-header,
                    .modal-body,
                    .modal-footer {
                        padding: 1rem;
                    }
                }

                /* Animation for different modal types */
                .modal-content.slide-up {
                    transform: translateY(100%);
                }

                :host(.open) .modal-content.slide-up {
                    transform: translateY(0);
                }

                .modal-content.slide-down {
                    transform: translateY(-100%);
                }

                :host(.open) .modal-content.slide-down {
                    transform: translateY(0);
                }

                .modal-content.slide-left {
                    transform: translateX(100%);
                }

                :host(.open) .modal-content.slide-left {
                    transform: translateX(0);
                }

                .modal-content.fade {
                    opacity: 0;
                    transform: scale(1);
                }

                :host(.open) .modal-content.fade {
                    opacity: 1;
                }
            </style>

            <div class="modal-backdrop" data-testid="modal-backdrop"></div>
            <div class="modal-container" data-testid="modal-container">
                <div class="modal-content ${this.getModalClasses()}" data-testid="modal-content">
                    <div class="modal-header" data-testid="modal-header">
                        <h2 class="modal-title" data-testid="modal-title">Modal Title</h2>
                        <div class="modal-controls">
                            ${!this.isFullscreen ? `
                                <button class="control-button fullscreen-toggle" data-testid="fullscreen-toggle" title="Fullscreen">
                                    <i class="fas fa-expand"></i>
                                </button>
                            ` : `
                                <button class="control-button fullscreen-toggle" data-testid="exit-fullscreen" title="Exit Fullscreen">
                                    <i class="fas fa-compress"></i>
                                </button>
                            `}
                            <button class="control-button close" data-testid="modal-close" title="Close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <div class="modal-body" data-testid="modal-body">
                        <div class="default-content">
                            <div class="content-placeholder">Modal content will be loaded here</div>
                            <div class="loading-spinner"></div>
                        </div>
                        
                        <!-- Nested Modal Content Components -->
                        <modal-login-form data-testid="login-form" style="display: none;"></modal-login-form>
                        <modal-contact-form data-testid="contact-form" style="display: none;"></modal-contact-form>
                        <modal-image-gallery data-testid="image-gallery" style="display: none;"></modal-image-gallery>
                        <modal-video-player data-testid="video-player" style="display: none;"></modal-video-player>
                    </div>

                    <div class="modal-footer" data-testid="modal-footer">
                        <button class="btn btn-secondary" data-testid="modal-cancel" data-action="cancel">Cancel</button>
                        <button class="btn btn-primary" data-testid="modal-confirm" data-action="confirm">Confirm</button>
                    </div>
                </div>
            </div>
        `;

        this.createNestedComponents();
    }

    getModalClasses() {
        let classes = [this.modalType];
        if (this.isFullscreen) {
            classes.push('fullscreen');
        }
        return classes.join(' ');
    }

    createNestedComponents() {
        this.createModalLoginForm();
        this.createModalContactForm();
        this.createModalImageGallery();
        this.createModalVideoPlayer();
    }

    createModalLoginForm() {
        if (!customElements.get('modal-login-form')) {
            class ModalLoginForm extends BaseComponent {
                constructor() {
                    super();
                    this.formData = {
                        email: '',
                        password: '',
                        rememberMe: false
                    };
                }

                connectedCallback() {
                    super.connectedCallback();
                    this.render();
                }

                render() {
                    this.shadowRoot.innerHTML = `
                        <style>
                            :host {
                                display: block;
                                width: 100%;
                            }

                            .login-form {
                                max-width: 400px;
                                margin: 0 auto;
                            }

                            .form-header {
                                text-align: center;
                                margin-bottom: 2rem;
                            }

                            .form-title {
                                font-size: 1.5rem;
                                font-weight: 600;
                                color: #1f2937;
                                margin-bottom: 0.5rem;
                            }

                            .form-subtitle {
                                color: #6b7280;
                                font-size: 0.875rem;
                            }

                            .form-group {
                                margin-bottom: 1.5rem;
                            }

                            .form-label {
                                display: block;
                                font-weight: 500;
                                color: #374151;
                                margin-bottom: 0.5rem;
                                font-size: 0.875rem;
                            }

                            .form-input {
                                width: 100%;
                                padding: 0.75rem 1rem;
                                border: 1px solid #d1d5db;
                                border-radius: 8px;
                                font-size: 1rem;
                                transition: all 0.2s ease;
                                box-sizing: border-box;
                            }

                            .form-input:focus {
                                outline: none;
                                border-color: #6366f1;
                                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                            }

                            .checkbox-group {
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                                margin: 1rem 0;
                            }

                            .checkbox-input {
                                width: auto;
                            }

                            .checkbox-label {
                                font-size: 0.875rem;
                                color: #374151;
                                margin-bottom: 0;
                            }

                            .form-actions {
                                display: flex;
                                flex-direction: column;
                                gap: 1rem;
                            }

                            .btn {
                                padding: 0.75rem 1.5rem;
                                border: none;
                                border-radius: 8px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                text-align: center;
                                font-size: 1rem;
                            }

                            .btn-primary {
                                background: linear-gradient(135deg, #667eea, #764ba2);
                                color: white;
                            }

                            .btn-primary:hover {
                                transform: translateY(-1px);
                                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                            }

                            .btn-google {
                                background: white;
                                color: #374151;
                                border: 1px solid #d1d5db;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                gap: 0.5rem;
                            }

                            .btn-google:hover {
                                background: #f9fafb;
                            }

                            .divider {
                                text-align: center;
                                margin: 1.5rem 0;
                                position: relative;
                                color: #6b7280;
                                font-size: 0.875rem;
                            }

                            .divider::before,
                            .divider::after {
                                content: '';
                                position: absolute;
                                top: 50%;
                                width: 45%;
                                height: 1px;
                                background: #e5e7eb;
                            }

                            .divider::before {
                                left: 0;
                            }

                            .divider::after {
                                right: 0;
                            }

                            .forgot-password {
                                text-align: center;
                                margin-top: 1rem;
                            }

                            .forgot-link {
                                color: #6366f1;
                                text-decoration: none;
                                font-size: 0.875rem;
                            }

                            .forgot-link:hover {
                                text-decoration: underline;
                            }
                        </style>

                        <form class="login-form" data-testid="login-form">
                            <div class="form-header">
                                <h3 class="form-title">Sign In</h3>
                                <p class="form-subtitle">Access your account</p>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="login-email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="login-email" 
                                    class="form-input" 
                                    data-testid="login-email"
                                    placeholder="Enter your email"
                                    required
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="login-password">Password</label>
                                <input 
                                    type="password" 
                                    id="login-password" 
                                    class="form-input" 
                                    data-testid="login-password"
                                    placeholder="Enter your password"
                                    required
                                >
                            </div>

                            <div class="checkbox-group">
                                <input 
                                    type="checkbox" 
                                    id="remember-me" 
                                    class="checkbox-input" 
                                    data-testid="remember-me"
                                >
                                <label class="checkbox-label" for="remember-me">Remember me</label>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary" data-testid="login-submit">
                                    Sign In
                                </button>

                                <div class="divider">or</div>

                                <button type="button" class="btn btn-google" data-testid="google-signin">
                                    <i class="fab fa-google"></i>
                                    Continue with Google
                                </button>
                            </div>

                            <div class="forgot-password">
                                <a href="#" class="forgot-link" data-testid="forgot-password">
                                    Forgot your password?
                                </a>
                            </div>
                        </form>
                    `;

                    this.setupFormHandlers();
                }

                setupFormHandlers() {
                    const form = this.shadowRoot.querySelector('.login-form');
                    const emailInput = this.shadowRoot.querySelector('#login-email');
                    const passwordInput = this.shadowRoot.querySelector('#login-password');
                    const rememberCheckbox = this.shadowRoot.querySelector('#remember-me');

                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const formData = {
                            email: emailInput.value,
                            password: passwordInput.value,
                            rememberMe: rememberCheckbox.checked
                        };
                        
                        this.dispatchEvent(new CustomEvent('login-submit', {
                            detail: formData,
                            bubbles: true
                        }));
                    });

                    this.shadowRoot.querySelector('[data-testid="google-signin"]').addEventListener('click', () => {
                        this.dispatchEvent(new CustomEvent('google-signin', { bubbles: true }));
                    });

                    this.shadowRoot.querySelector('[data-testid="forgot-password"]').addEventListener('click', (e) => {
                        e.preventDefault();
                        this.dispatchEvent(new CustomEvent('forgot-password', { bubbles: true }));
                    });
                }
            }

            customElements.define('modal-login-form', ModalLoginForm);
        }
    }

    createModalContactForm() {
        if (!customElements.get('modal-contact-form')) {
            class ModalContactForm extends BaseComponent {
                connectedCallback() {
                    super.connectedCallback();
                    this.render();
                }

                render() {
                    this.shadowRoot.innerHTML = `
                        <style>
                            :host {
                                display: block;
                                width: 100%;
                            }

                            .contact-form {
                                max-width: 500px;
                                margin: 0 auto;
                            }

                            .form-header {
                                text-align: center;
                                margin-bottom: 2rem;
                            }

                            .form-title {
                                font-size: 1.5rem;
                                font-weight: 600;
                                color: #1f2937;
                                margin-bottom: 0.5rem;
                            }

                            .form-group {
                                margin-bottom: 1.5rem;
                            }

                            .form-row {
                                display: grid;
                                grid-template-columns: 1fr 1fr;
                                gap: 1rem;
                            }

                            .form-label {
                                display: block;
                                font-weight: 500;
                                color: #374151;
                                margin-bottom: 0.5rem;
                                font-size: 0.875rem;
                            }

                            .form-input,
                            .form-select,
                            .form-textarea {
                                width: 100%;
                                padding: 0.75rem 1rem;
                                border: 1px solid #d1d5db;
                                border-radius: 8px;
                                font-size: 1rem;
                                transition: all 0.2s ease;
                                box-sizing: border-box;
                            }

                            .form-textarea {
                                resize: vertical;
                                min-height: 120px;
                            }

                            .form-input:focus,
                            .form-select:focus,
                            .form-textarea:focus {
                                outline: none;
                                border-color: #6366f1;
                                box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                            }

                            .btn {
                                padding: 0.75rem 2rem;
                                border: none;
                                border-radius: 8px;
                                font-weight: 600;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                font-size: 1rem;
                            }

                            .btn-primary {
                                background: linear-gradient(135deg, #667eea, #764ba2);
                                color: white;
                            }

                            .btn-primary:hover {
                                transform: translateY(-1px);
                                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                            }

                            .form-actions {
                                text-align: center;
                                margin-top: 2rem;
                            }

                            @media (max-width: 768px) {
                                .form-row {
                                    grid-template-columns: 1fr;
                                }
                            }
                        </style>

                        <form class="contact-form" data-testid="contact-form">
                            <div class="form-header">
                                <h3 class="form-title">Contact Us</h3>
                                <p class="form-subtitle">We'd love to hear from you</p>
                            </div>

                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label" for="contact-first-name">First Name</label>
                                    <input 
                                        type="text" 
                                        id="contact-first-name" 
                                        class="form-input" 
                                        data-testid="contact-first-name"
                                        required
                                    >
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="contact-last-name">Last Name</label>
                                    <input 
                                        type="text" 
                                        id="contact-last-name" 
                                        class="form-input" 
                                        data-testid="contact-last-name"
                                        required
                                    >
                                </div>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="contact-email">Email Address</label>
                                <input 
                                    type="email" 
                                    id="contact-email" 
                                    class="form-input" 
                                    data-testid="contact-email"
                                    required
                                >
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="contact-subject">Subject</label>
                                <select id="contact-subject" class="form-select" data-testid="contact-subject" required>
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="feature">Feature Request</option>
                                    <option value="bug">Bug Report</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label class="form-label" for="contact-message">Message</label>
                                <textarea 
                                    id="contact-message" 
                                    class="form-textarea" 
                                    data-testid="contact-message"
                                    placeholder="Please describe your inquiry in detail..."
                                    required
                                ></textarea>
                            </div>

                            <div class="form-actions">
                                <button type="submit" class="btn btn-primary" data-testid="contact-submit">
                                    Send Message
                                </button>
                            </div>
                        </form>
                    `;

                    this.setupFormHandlers();
                }

                setupFormHandlers() {
                    const form = this.shadowRoot.querySelector('.contact-form');
                    
                    form.addEventListener('submit', (e) => {
                        e.preventDefault();
                        const formData = new FormData(form);
                        const data = Object.fromEntries(formData.entries());
                        
                        this.dispatchEvent(new CustomEvent('contact-submit', {
                            detail: data,
                            bubbles: true
                        }));
                    });
                }
            }

            customElements.define('modal-contact-form', ModalContactForm);
        }
    }

    createModalImageGallery() {
        if (!customElements.get('modal-image-gallery')) {
            class ModalImageGallery extends BaseComponent {
                constructor() {
                    super();
                    this.currentIndex = 0;
                    this.images = [
                        { src: 'https://via.placeholder.com/800x600/667eea/ffffff?text=Image+1', alt: 'Gallery Image 1' },
                        { src: 'https://via.placeholder.com/800x600/764ba2/ffffff?text=Image+2', alt: 'Gallery Image 2' },
                        { src: 'https://via.placeholder.com/800x600/f093fb/ffffff?text=Image+3', alt: 'Gallery Image 3' },
                        { src: 'https://via.placeholder.com/800x600/4ade80/ffffff?text=Image+4', alt: 'Gallery Image 4' },
                        { src: 'https://via.placeholder.com/800x600/fb7185/ffffff?text=Image+5', alt: 'Gallery Image 5' }
                    ];
                }

                connectedCallback() {
                    super.connectedCallback();
                    this.render();
                }

                render() {
                    this.shadowRoot.innerHTML = `
                        <style>
                            :host {
                                display: block;
                                width: 100%;
                                height: 100%;
                            }

                            .gallery-container {
                                display: flex;
                                flex-direction: column;
                                height: 100%;
                            }

                            .gallery-main {
                                flex: 1;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                position: relative;
                                background: #000;
                                border-radius: 8px;
                                overflow: hidden;
                            }

                            .gallery-image {
                                max-width: 100%;
                                max-height: 100%;
                                object-fit: contain;
                                transition: all 0.3s ease;
                            }

                            .gallery-nav {
                                position: absolute;
                                top: 50%;
                                transform: translateY(-50%);
                                background: rgba(0, 0, 0, 0.5);
                                color: white;
                                border: none;
                                width: 50px;
                                height: 50px;
                                border-radius: 50%;
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.2s ease;
                            }

                            .gallery-nav:hover {
                                background: rgba(0, 0, 0, 0.7);
                                transform: translateY(-50%) scale(1.1);
                            }

                            .gallery-prev {
                                left: 20px;
                            }

                            .gallery-next {
                                right: 20px;
                            }

                            .gallery-counter {
                                position: absolute;
                                bottom: 20px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: rgba(0, 0, 0, 0.7);
                                color: white;
                                padding: 0.5rem 1rem;
                                border-radius: 20px;
                                font-size: 0.875rem;
                            }

                            .gallery-thumbnails {
                                display: flex;
                                gap: 0.5rem;
                                padding: 1rem;
                                overflow-x: auto;
                                background: #f9fafb;
                                border-radius: 0 0 8px 8px;
                            }

                            .thumbnail {
                                width: 80px;
                                height: 60px;
                                object-fit: cover;
                                border-radius: 4px;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                border: 2px solid transparent;
                            }

                            .thumbnail:hover {
                                transform: scale(1.05);
                            }

                            .thumbnail.active {
                                border-color: #6366f1;
                                transform: scale(1.1);
                            }
                        </style>

                        <div class="gallery-container">
                            <div class="gallery-main" data-testid="gallery-main">
                                <img 
                                    class="gallery-image" 
                                    data-testid="gallery-current-image"
                                    src="${this.images[this.currentIndex].src}"
                                    alt="${this.images[this.currentIndex].alt}"
                                >
                                
                                <button class="gallery-nav gallery-prev" data-testid="gallery-prev">
                                    <i class="fas fa-chevron-left"></i>
                                </button>
                                
                                <button class="gallery-nav gallery-next" data-testid="gallery-next">
                                    <i class="fas fa-chevron-right"></i>
                                </button>
                                
                                <div class="gallery-counter" data-testid="gallery-counter">
                                    ${this.currentIndex + 1} / ${this.images.length}
                                </div>
                            </div>

                            <div class="gallery-thumbnails" data-testid="gallery-thumbnails">
                                ${this.images.map((image, index) => `
                                    <img 
                                        class="thumbnail ${index === this.currentIndex ? 'active' : ''}" 
                                        src="${image.src}"
                                        alt="${image.alt}"
                                        data-testid="thumbnail-${index}"
                                        data-index="${index}"
                                    >
                                `).join('')}
                            </div>
                        </div>
                    `;

                    this.setupGalleryHandlers();
                }

                setupGalleryHandlers() {
                    const prevBtn = this.shadowRoot.querySelector('.gallery-prev');
                    const nextBtn = this.shadowRoot.querySelector('.gallery-next');
                    const thumbnails = this.shadowRoot.querySelectorAll('.thumbnail');

                    prevBtn.addEventListener('click', () => this.previousImage());
                    nextBtn.addEventListener('click', () => this.nextImage());

                    thumbnails.forEach(thumb => {
                        thumb.addEventListener('click', () => {
                            this.currentIndex = parseInt(thumb.dataset.index);
                            this.updateGallery();
                        });
                    });

                    // Keyboard navigation
                    document.addEventListener('keydown', (e) => {
                        if (e.key === 'ArrowLeft') this.previousImage();
                        if (e.key === 'ArrowRight') this.nextImage();
                    });
                }

                previousImage() {
                    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.images.length - 1;
                    this.updateGallery();
                }

                nextImage() {
                    this.currentIndex = this.currentIndex < this.images.length - 1 ? this.currentIndex + 1 : 0;
                    this.updateGallery();
                }

                updateGallery() {
                    const image = this.shadowRoot.querySelector('.gallery-image');
                    const counter = this.shadowRoot.querySelector('.gallery-counter');
                    const thumbnails = this.shadowRoot.querySelectorAll('.thumbnail');

                    image.src = this.images[this.currentIndex].src;
                    image.alt = this.images[this.currentIndex].alt;
                    counter.textContent = `${this.currentIndex + 1} / ${this.images.length}`;

                    thumbnails.forEach((thumb, index) => {
                        thumb.classList.toggle('active', index === this.currentIndex);
                    });
                }
            }

            customElements.define('modal-image-gallery', ModalImageGallery);
        }
    }

    createModalVideoPlayer() {
        if (!customElements.get('modal-video-player')) {
            class ModalVideoPlayer extends BaseComponent {
                constructor() {
                    super();
                    this.videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
                    this.isPlaying = false;
                    this.currentTime = 0;
                    this.duration = 0;
                }

                connectedCallback() {
                    super.connectedCallback();
                    this.render();
                }

                render() {
                    this.shadowRoot.innerHTML = `
                        <style>
                            :host {
                                display: block;
                                width: 100%;
                                height: 100%;
                            }

                            .video-container {
                                width: 100%;
                                height: 100%;
                                background: #000;
                                border-radius: 8px;
                                overflow: hidden;
                                position: relative;
                            }

                            .video-player {
                                width: 100%;
                                height: 100%;
                                object-fit: contain;
                            }

                            .video-controls {
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                right: 0;
                                background: linear-gradient(transparent, rgba(0,0,0,0.8));
                                padding: 2rem 1rem 1rem;
                                transform: translateY(100%);
                                transition: transform 0.3s ease;
                            }

                            .video-container:hover .video-controls {
                                transform: translateY(0);
                            }

                            .progress-bar {
                                width: 100%;
                                height: 4px;
                                background: rgba(255,255,255,0.3);
                                border-radius: 2px;
                                margin-bottom: 1rem;
                                cursor: pointer;
                                position: relative;
                            }

                            .progress-fill {
                                height: 100%;
                                background: #6366f1;
                                border-radius: 2px;
                                width: 0%;
                                transition: width 0.1s ease;
                            }

                            .control-row {
                                display: flex;
                                align-items: center;
                                justify-content: space-between;
                                color: white;
                            }

                            .control-group {
                                display: flex;
                                align-items: center;
                                gap: 1rem;
                            }

                            .control-button {
                                background: none;
                                border: none;
                                color: white;
                                cursor: pointer;
                                padding: 0.5rem;
                                border-radius: 4px;
                                transition: background-color 0.2s ease;
                            }

                            .control-button:hover {
                                background: rgba(255,255,255,0.1);
                            }

                            .play-button {
                                font-size: 1.5rem;
                            }

                            .time-display {
                                font-size: 0.875rem;
                                font-family: monospace;
                            }

                            .volume-container {
                                display: flex;
                                align-items: center;
                                gap: 0.5rem;
                            }

                            .volume-slider {
                                width: 80px;
                                height: 4px;
                                background: rgba(255,255,255,0.3);
                                border-radius: 2px;
                                cursor: pointer;
                                position: relative;
                            }

                            .volume-fill {
                                height: 100%;
                                background: white;
                                border-radius: 2px;
                                width: 100%;
                            }
                        </style>

                        <div class="video-container" data-testid="video-container">
                            <video 
                                class="video-player" 
                                data-testid="video-player"
                                src="${this.videoSrc}"
                                preload="metadata"
                            ></video>

                            <div class="video-controls" data-testid="video-controls">
                                <div class="progress-bar" data-testid="progress-bar">
                                    <div class="progress-fill" data-testid="progress-fill"></div>
                                </div>

                                <div class="control-row">
                                    <div class="control-group">
                                        <button class="control-button play-button" data-testid="play-pause-btn">
                                            <i class="fas fa-play"></i>
                                        </button>
                                        <div class="time-display" data-testid="time-display">
                                            00:00 / 00:00
                                        </div>
                                    </div>

                                    <div class="control-group">
                                        <div class="volume-container">
                                            <button class="control-button" data-testid="volume-btn">
                                                <i class="fas fa-volume-up"></i>
                                            </button>
                                            <div class="volume-slider" data-testid="volume-slider">
                                                <div class="volume-fill"></div>
                                            </div>
                                        </div>

                                        <button class="control-button" data-testid="fullscreen-btn">
                                            <i class="fas fa-expand"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;

                    this.setupVideoHandlers();
                }

                setupVideoHandlers() {
                    const video = this.shadowRoot.querySelector('.video-player');
                    const playBtn = this.shadowRoot.querySelector('.play-button');
                    const progressBar = this.shadowRoot.querySelector('.progress-bar');
                    const progressFill = this.shadowRoot.querySelector('.progress-fill');
                    const timeDisplay = this.shadowRoot.querySelector('.time-display');

                    playBtn.addEventListener('click', () => {
                        if (video.paused) {
                            video.play();
                            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                        } else {
                            video.pause();
                            playBtn.innerHTML = '<i class="fas fa-play"></i>';
                        }
                    });

                    video.addEventListener('timeupdate', () => {
                        const progress = (video.currentTime / video.duration) * 100;
                        progressFill.style.width = `${progress}%`;
                        
                        const currentTime = this.formatTime(video.currentTime);
                        const duration = this.formatTime(video.duration);
                        timeDisplay.textContent = `${currentTime} / ${duration}`;
                    });

                    progressBar.addEventListener('click', (e) => {
                        const rect = progressBar.getBoundingClientRect();
                        const pos = (e.clientX - rect.left) / rect.width;
                        video.currentTime = pos * video.duration;
                    });
                }

                formatTime(seconds) {
                    const mins = Math.floor(seconds / 60);
                    const secs = Math.floor(seconds % 60);
                    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
                }
            }

            customElements.define('modal-video-player', ModalVideoPlayer);
        }
    }

    initializeModal() {
        const backdrop = this.shadowRoot.querySelector('.modal-backdrop');
        const closeBtn = this.shadowRoot.querySelector('[data-testid="modal-close"]');
        const fullscreenToggle = this.shadowRoot.querySelector('[data-testid="fullscreen-toggle"], [data-testid="exit-fullscreen"]');
        const cancelBtn = this.shadowRoot.querySelector('[data-testid="modal-cancel"]');
        const confirmBtn = this.shadowRoot.querySelector('[data-testid="modal-confirm"]');

        // Backdrop click
        if (this.backdropClickClose) {
            backdrop.addEventListener('click', () => this.close());
        }

        // Close button
        closeBtn.addEventListener('click', () => this.close());

        // Fullscreen toggle
        fullscreenToggle.addEventListener('click', () => this.toggleFullscreen());

        // Action buttons
        cancelBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('modal-cancel', { bubbles: true }));
            this.close();
        });

        confirmBtn.addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('modal-confirm', { bubbles: true }));
        });

        // Escape key
        if (this.escapeKeyClose) {
            this.handleEscapeKey = (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            };
            document.addEventListener('keydown', this.handleEscapeKey);
        }
    }

    open(content = '', title = 'Modal', type = 'medium') {
        this.isOpen = true;
        this.modalType = type;
        this.classList.add('open');
        
        // Update title
        const titleElement = this.shadowRoot.querySelector('.modal-title');
        titleElement.textContent = title;

        // Show appropriate content
        this.showContent(content);

        // Disable body scroll
        document.body.style.overflow = 'hidden';

        this.dispatchEvent(new CustomEvent('modal-opened', { bubbles: true }));
    }

    close() {
        this.isOpen = false;
        this.classList.remove('open');
        
        // Re-enable body scroll
        document.body.style.overflow = '';

        this.dispatchEvent(new CustomEvent('modal-closed', { bubbles: true }));
    }

    toggleFullscreen() {
        this.isFullscreen = !this.isFullscreen;
        this.render();
        this.initializeModal();
    }

    showContent(contentType) {
        // Hide all content components
        const contentComponents = this.shadowRoot.querySelectorAll('[data-testid="login-form"], [data-testid="contact-form"], [data-testid="image-gallery"], [data-testid="video-player"]');
        contentComponents.forEach(component => {
            component.style.display = 'none';
        });

        const defaultContent = this.shadowRoot.querySelector('.default-content');
        
        // Show specific content
        switch (contentType) {
            case 'login':
                this.shadowRoot.querySelector('[data-testid="login-form"]').style.display = 'block';
                defaultContent.style.display = 'none';
                break;
            case 'contact':
                this.shadowRoot.querySelector('[data-testid="contact-form"]').style.display = 'block';
                defaultContent.style.display = 'none';
                break;
            case 'gallery':
                this.shadowRoot.querySelector('[data-testid="image-gallery"]').style.display = 'block';
                defaultContent.style.display = 'none';
                break;
            case 'video':
                this.shadowRoot.querySelector('[data-testid="video-player"]').style.display = 'block';
                defaultContent.style.display = 'none';
                break;
            default:
                defaultContent.style.display = 'block';
        }
    }

    removeEventListeners() {
        if (this.handleEscapeKey) {
            document.removeEventListener('keydown', this.handleEscapeKey);
        }
    }
}

// Register the component
customElements.define('modal-container', ModalContainer);
