// Complex Form Widget with Deep Shadow DOM Nesting
class ComplexFormWidget extends BaseComponent {
    static get observedAttributes() {
        return ['data-form-type', 'theme'];
    }

    constructor() {
        super();
        this.state = {
            currentStep: 1,
            totalSteps: 4,
            formData: {},
            errors: {},
            isSubmitting: false,
            validationEnabled: false
        };
    }

    render() {
        const formType = this.getAttribute('data-form-type') || 'general';
        
        const template = this.createTemplate(`
            <style>
                :host {
                    display: block;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    overflow: hidden;
                    margin: 2rem 0;
                }

                .form-container {
                    padding: 2rem;
                }

                .form-header {
                    text-align: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #e9ecef;
                }

                .form-title {
                    font-size: 2rem;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 0.5rem;
                }

                .form-subtitle {
                    color: #6c757d;
                    font-size: 1.1rem;
                }

                .progress-bar {
                    width: 100%;
                    height: 8px;
                    background: #e9ecef;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 2rem;
                }

                .progress-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #007bff, #0056b3);
                    border-radius: 4px;
                    transition: width 0.3s ease;
                    width: ${(this.state.currentStep / this.state.totalSteps) * 100}%;
                }

                .step-indicators {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                }

                .step-indicator {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    flex: 1;
                    position: relative;
                }

                .step-number {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: #e9ecef;
                    color: #6c757d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                    transition: all 0.3s ease;
                }

                .step-indicator.active .step-number {
                    background: #007bff;
                    color: white;
                }

                .step-indicator.completed .step-number {
                    background: #28a745;
                    color: white;
                }

                .step-indicator.completed .step-number::after {
                    content: '✓';
                    font-size: 0.9rem;
                }

                .step-label {
                    font-size: 0.9rem;
                    color: #6c757d;
                    text-align: center;
                }

                .step-indicator.active .step-label {
                    color: #007bff;
                    font-weight: 600;
                }

                .form-step {
                    display: none;
                    animation: fadeIn 0.3s ease-in-out;
                }

                .form-step.active {
                    display: block;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }

                .form-section {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 8px;
                    border-left: 4px solid #007bff;
                }

                .section-title {
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .form-group {
                    margin-bottom: 1.5rem;
                }

                .form-label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .required::after {
                    content: ' *';
                    color: #dc3545;
                }

                .form-input {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 16px;
                    transition: all 0.3s ease;
                    background: white;
                }

                .form-input:focus {
                    outline: none;
                    border-color: #007bff;
                    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
                }

                .form-input.error {
                    border-color: #dc3545;
                    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
                }

                .form-select {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    background: white;
                    cursor: pointer;
                    font-size: 16px;
                }

                .form-textarea {
                    width: 100%;
                    padding: 12px 16px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 16px;
                    resize: vertical;
                    min-height: 120px;
                    font-family: inherit;
                }

                .checkbox-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .radio-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .radio-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .error-message {
                    color: #dc3545;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .form-actions {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 2rem;
                    border-top: 1px solid #e9ecef;
                    margin-top: 2rem;
                }

                .btn {
                    padding: 12px 24px;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-primary {
                    background: #007bff;
                    color: white;
                }

                .btn-primary:hover {
                    background: #0056b3;
                    transform: translateY(-2px);
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #545b62;
                }

                .btn-success {
                    background: #28a745;
                    color: white;
                }

                .btn-success:hover {
                    background: #1e7e34;
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                }

                .loading-spinner {
                    width: 20px;
                    height: 20px;
                    border: 2px solid transparent;
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .file-upload-area {
                    border: 2px dashed #007bff;
                    border-radius: 8px;
                    padding: 2rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: #f8f9ff;
                }

                .file-upload-area:hover {
                    background: #e6f2ff;
                    border-color: #0056b3;
                }

                .file-upload-area.dragover {
                    background: #cce7ff;
                    border-style: solid;
                }

                .uploaded-files {
                    margin-top: 1rem;
                }

                .file-item {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0.5rem;
                    background: #e9ecef;
                    border-radius: 4px;
                    margin-bottom: 0.5rem;
                }

                .remove-file {
                    background: #dc3545;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .summary-section {
                    background: #f8f9fa;
                    padding: 1.5rem;
                    border-radius: 8px;
                    margin-bottom: 1.5rem;
                }

                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 0.5rem;
                    padding: 0.25rem 0;
                    border-bottom: 1px solid #dee2e6;
                }

                .summary-item:last-child {
                    border-bottom: none;
                    font-weight: bold;
                    color: #007bff;
                }

                @media (max-width: 768px) {
                    .form-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .form-actions {
                        flex-direction: column;
                        gap: 1rem;
                    }
                    
                    .step-indicators {
                        flex-wrap: wrap;
                        gap: 1rem;
                    }
                }
            </style>

            <div class="form-container">
                <div class="form-header">
                    <h2 class="form-title">Multi-Step Registration Form</h2>
                    <p class="form-subtitle">Complete all steps to create your account</p>
                </div>

                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>

                <div class="step-indicators">
                    <div class="step-indicator ${this.state.currentStep >= 1 ? 'active' : ''} ${this.state.currentStep > 1 ? 'completed' : ''}">
                        <div class="step-number">1</div>
                        <div class="step-label">Personal Info</div>
                    </div>
                    <div class="step-indicator ${this.state.currentStep >= 2 ? 'active' : ''} ${this.state.currentStep > 2 ? 'completed' : ''}">
                        <div class="step-number">2</div>
                        <div class="step-label">Account Details</div>
                    </div>
                    <div class="step-indicator ${this.state.currentStep >= 3 ? 'active' : ''} ${this.state.currentStep > 3 ? 'completed' : ''}">
                        <div class="step-number">3</div>
                        <div class="step-label">Preferences</div>
                    </div>
                    <div class="step-indicator ${this.state.currentStep >= 4 ? 'active' : ''} ${this.state.currentStep > 4 ? 'completed' : ''}">
                        <div class="step-number">4</div>
                        <div class="step-label">Review</div>
                    </div>
                </div>

                <form id="multi-step-form">
                    <!-- Step 1: Personal Information -->
                    <div class="form-step ${this.state.currentStep === 1 ? 'active' : ''}" data-step="1">
                        <div class="form-grid">
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="fas fa-user"></i>
                                    Basic Information
                                </h3>
                                
                                <div class="form-group">
                                    <label for="firstName" class="form-label required">First Name</label>
                                    <input type="text" id="firstName" name="firstName" class="form-input" required data-testid="first-name">
                                    <div class="error-message" id="firstName-error"></div>
                                </div>

                                <div class="form-group">
                                    <label for="lastName" class="form-label required">Last Name</label>
                                    <input type="text" id="lastName" name="lastName" class="form-input" required data-testid="last-name">
                                    <div class="error-message" id="lastName-error"></div>
                                </div>

                                <div class="form-group">
                                    <label for="dateOfBirth" class="form-label required">Date of Birth</label>
                                    <input type="date" id="dateOfBirth" name="dateOfBirth" class="form-input" required data-testid="date-of-birth">
                                    <div class="error-message" id="dateOfBirth-error"></div>
                                </div>

                                <div class="form-group">
                                    <label for="gender" class="form-label">Gender</label>
                                    <select id="gender" name="gender" class="form-select" data-testid="gender">
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                        <option value="prefer-not-to-say">Prefer not to say</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="fas fa-address-card"></i>
                                    Contact Information
                                </h3>

                                <div class="form-group">
                                    <label for="email" class="form-label required">Email Address</label>
                                    <input type="email" id="email" name="email" class="form-input" required data-testid="email">
                                    <div class="error-message" id="email-error"></div>
                                </div>

                                <div class="form-group">
                                    <label for="phone" class="form-label required">Phone Number</label>
                                    <input type="tel" id="phone" name="phone" class="form-input" required data-testid="phone">
                                    <div class="error-message" id="phone-error"></div>
                                </div>

                                <div class="form-group">
                                    <label for="address" class="form-label required">Address</label>
                                    <textarea id="address" name="address" class="form-textarea" required data-testid="address" placeholder="Enter your full address"></textarea>
                                    <div class="error-message" id="address-error"></div>
                                </div>

                                <!-- Nested Address Widget -->
                                <address-input-widget id="address-widget" data-required="true"></address-input-widget>
                            </div>
                        </div>
                    </div>

                    <!-- Step 2: Account Details -->
                    <div class="form-step ${this.state.currentStep === 2 ? 'active' : ''}" data-step="2">
                        <div class="form-grid">
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="fas fa-lock"></i>
                                    Account Security
                                </h3>

                                <div class="form-group">
                                    <label for="username" class="form-label required">Username</label>
                                    <input type="text" id="username" name="username" class="form-input" required data-testid="username">
                                    <div class="error-message" id="username-error"></div>
                                </div>

                                <!-- Nested Password Widget -->
                                <password-strength-widget id="password-widget"></password-strength-widget>

                                <div class="form-group">
                                    <label for="securityQuestion" class="form-label required">Security Question</label>
                                    <select id="securityQuestion" name="securityQuestion" class="form-select" required data-testid="security-question">
                                        <option value="">Choose a question</option>
                                        <option value="pet">What was the name of your first pet?</option>
                                        <option value="school">What was the name of your elementary school?</option>
                                        <option value="city">In what city were you born?</option>
                                        <option value="mother">What is your mother's maiden name?</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="securityAnswer" class="form-label required">Security Answer</label>
                                    <input type="text" id="securityAnswer" name="securityAnswer" class="form-input" required data-testid="security-answer">
                                    <div class="error-message" id="securityAnswer-error"></div>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="fas fa-briefcase"></i>
                                    Professional Information
                                </h3>

                                <div class="form-group">
                                    <label for="company" class="form-label">Company</label>
                                    <input type="text" id="company" name="company" class="form-input" data-testid="company">
                                </div>

                                <div class="form-group">
                                    <label for="jobTitle" class="form-label">Job Title</label>
                                    <input type="text" id="jobTitle" name="jobTitle" class="form-input" data-testid="job-title">
                                </div>

                                <div class="form-group">
                                    <label for="industry" class="form-label">Industry</label>
                                    <select id="industry" name="industry" class="form-select" data-testid="industry">
                                        <option value="">Select Industry</option>
                                        <option value="technology">Technology</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="finance">Finance</option>
                                        <option value="education">Education</option>
                                        <option value="retail">Retail</option>
                                        <option value="manufacturing">Manufacturing</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="experience" class="form-label">Years of Experience</label>
                                    <div class="radio-group">
                                        <div class="radio-item">
                                            <input type="radio" id="exp1" name="experience" value="0-2" data-testid="exp-0-2">
                                            <label for="exp1">0-2 years</label>
                                        </div>
                                        <div class="radio-item">
                                            <input type="radio" id="exp2" name="experience" value="3-5" data-testid="exp-3-5">
                                            <label for="exp2">3-5 years</label>
                                        </div>
                                        <div class="radio-item">
                                            <input type="radio" id="exp3" name="experience" value="6-10" data-testid="exp-6-10">
                                            <label for="exp3">6-10 years</label>
                                        </div>
                                        <div class="radio-item">
                                            <input type="radio" id="exp4" name="experience" value="10+" data-testid="exp-10-plus">
                                            <label for="exp4">10+ years</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 3: Preferences -->
                    <div class="form-step ${this.state.currentStep === 3 ? 'active' : ''}" data-step="3">
                        <div class="form-grid">
                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="fas fa-cog"></i>
                                    Account Preferences
                                </h3>

                                <div class="form-group">
                                    <label class="form-label">Communication Preferences</label>
                                    <div class="checkbox-group">
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="emailNotifications" name="notifications" value="email" data-testid="email-notifications">
                                            <label for="emailNotifications">Email Notifications</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="smsNotifications" name="notifications" value="sms" data-testid="sms-notifications">
                                            <label for="smsNotifications">SMS Notifications</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="pushNotifications" name="notifications" value="push" data-testid="push-notifications">
                                            <label for="pushNotifications">Push Notifications</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="newsletter" name="notifications" value="newsletter" data-testid="newsletter">
                                            <label for="newsletter">Monthly Newsletter</label>
                                        </div>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="timezone" class="form-label">Timezone</label>
                                    <select id="timezone" name="timezone" class="form-select" data-testid="timezone">
                                        <option value="">Select Timezone</option>
                                        <option value="UTC-8">Pacific Time (UTC-8)</option>
                                        <option value="UTC-7">Mountain Time (UTC-7)</option>
                                        <option value="UTC-6">Central Time (UTC-6)</option>
                                        <option value="UTC-5">Eastern Time (UTC-5)</option>
                                        <option value="UTC+0">UTC</option>
                                        <option value="UTC+1">Central European Time (UTC+1)</option>
                                        <option value="UTC+8">China Standard Time (UTC+8)</option>
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label for="language" class="form-label">Preferred Language</label>
                                    <select id="language" name="language" class="form-select" data-testid="language">
                                        <option value="en">English</option>
                                        <option value="es">Spanish</option>
                                        <option value="fr">French</option>
                                        <option value="de">German</option>
                                        <option value="zh">Chinese</option>
                                        <option value="ja">Japanese</option>
                                    </select>
                                </div>
                            </div>

                            <div class="form-section">
                                <h3 class="section-title">
                                    <i class="fas fa-upload"></i>
                                    Document Upload
                                </h3>

                                <!-- Nested File Upload Widget -->
                                <file-upload-widget id="document-upload" data-accept=".pdf,.doc,.docx,.jpg,.png" data-max-size="5MB"></file-upload-widget>

                                <div class="form-group">
                                    <label for="bio" class="form-label">Bio/Description</label>
                                    <textarea id="bio" name="bio" class="form-textarea" data-testid="bio" placeholder="Tell us about yourself (optional)"></textarea>
                                </div>

                                <div class="form-group">
                                    <label class="form-label">Interests</label>
                                    <div class="checkbox-group">
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="interest1" name="interests" value="technology" data-testid="interest-technology">
                                            <label for="interest1">Technology</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="interest2" name="interests" value="design" data-testid="interest-design">
                                            <label for="interest2">Design</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="interest3" name="interests" value="business" data-testid="interest-business">
                                            <label for="interest3">Business</label>
                                        </div>
                                        <div class="checkbox-item">
                                            <input type="checkbox" id="interest4" name="interests" value="marketing" data-testid="interest-marketing">
                                            <label for="interest4">Marketing</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Step 4: Review -->
                    <div class="form-step ${this.state.currentStep === 4 ? 'active' : ''}" data-step="4">
                        <div class="summary-section">
                            <h3 class="section-title">
                                <i class="fas fa-clipboard-check"></i>
                                Review Your Information
                            </h3>
                            <div id="form-summary">
                                <!-- Summary will be populated dynamically -->
                            </div>
                        </div>

                        <div class="form-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="terms" name="terms" required data-testid="terms-agreement">
                                <label for="terms">I agree to the <a href="#" data-testid="terms-link">Terms of Service</a> and <a href="#" data-testid="privacy-link">Privacy Policy</a></label>
                            </div>
                            <div class="error-message" id="terms-error"></div>
                        </div>

                        <div class="form-group">
                            <div class="checkbox-item">
                                <input type="checkbox" id="marketing" name="marketing" data-testid="marketing-consent">
                                <label for="marketing">I would like to receive marketing communications</label>
                            </div>
                        </div>

                        <!-- Nested Captcha Widget -->
                        <captcha-widget id="captcha-verification" data-required="true"></captcha-widget>

                        <!-- Nested Payment Widget for Premium Features -->
                        <payment-selection-widget id="payment-widget" data-plan="basic"></payment-selection-widget>
                    </div>
                </form>

                <div class="form-actions">
                    <button type="button" id="prev-btn" class="btn btn-secondary" style="visibility: ${this.state.currentStep === 1 ? 'hidden' : 'visible'}">
                        <i class="fas fa-arrow-left"></i>
                        Previous
                    </button>

                    <div class="step-info">
                        Step ${this.state.currentStep} of ${this.state.totalSteps}
                    </div>

                    <button type="button" id="next-btn" class="btn ${this.state.currentStep === this.state.totalSteps ? 'btn-success' : 'btn-primary'}" ${this.state.isSubmitting ? 'disabled' : ''}>
                        ${this.state.isSubmitting ? '<div class="loading-spinner"></div>' : ''}
                        ${this.state.currentStep === this.state.totalSteps ? 
                            '<i class="fas fa-check"></i> Submit Application' : 
                            'Next <i class="fas fa-arrow-right"></i>'
                        }
                    </button>
                </div>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        const prevBtn = this.$('#prev-btn');
        const nextBtn = this.$('#next-btn');
        const form = this.$('#multi-step-form');

        // Navigation buttons
        prevBtn?.addEventListener('click', () => {
            if (this.state.currentStep > 1) {
                this.setState({ currentStep: this.state.currentStep - 1 });
            }
        });

        nextBtn?.addEventListener('click', () => {
            if (this.state.currentStep === this.state.totalSteps) {
                this.submitForm();
            } else {
                this.nextStep();
            }
        });

        // Form validation on input
        const inputs = this.$$('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });

        // Form submission
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitForm();
        });
    }

    nextStep() {
        if (this.validateCurrentStep()) {
            this.setState({ currentStep: this.state.currentStep + 1 });
            if (this.state.currentStep === this.state.totalSteps) {
                this.populateSummary();
            }
        }
    }

    validateCurrentStep() {
        const currentStepElement = this.$(`.form-step[data-step="${this.state.currentStep}"]`);
        const requiredFields = currentStepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(field) {
        const value = field.value?.trim();
        const fieldName = field.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (field.hasAttribute('required') && !value) {
            errorMessage = 'This field is required';
            isValid = false;
        }
        // Email validation
        else if (field.type === 'email' && value && !this.validateEmail(value)) {
            errorMessage = 'Please enter a valid email address';
            isValid = false;
        }
        // Phone validation
        else if (field.type === 'tel' && value && !this.validatePhone(value)) {
            errorMessage = 'Please enter a valid phone number';
            isValid = false;
        }
        // Date validation
        else if (field.type === 'date' && value) {
            const birthDate = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 13 || age > 120) {
                errorMessage = 'Please enter a valid date of birth';
                isValid = false;
            }
        }

        this.showFieldError(field, isValid ? '' : errorMessage);
        return isValid;
    }

    showFieldError(field, message) {
        const errorElement = this.$(`#${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = message ? 'flex' : 'none';
        }
        
        field.classList.toggle('error', !!message);
    }

    clearFieldError(field) {
        this.showFieldError(field, '');
    }

    populateSummary() {
        const summaryContainer = this.$('#form-summary');
        const formData = new FormData(this.$('#multi-step-form'));
        let summaryHTML = '';

        // Collect form data
        for (let [key, value] of formData.entries()) {
            if (value) {
                const label = this.getFieldLabel(key);
                summaryHTML += `
                    <div class="summary-item">
                        <span>${label}:</span>
                        <span>${value}</span>
                    </div>
                `;
            }
        }

        if (summaryContainer) {
            summaryContainer.innerHTML = summaryHTML;
        }
    }

    getFieldLabel(fieldName) {
        const field = this.$(`[name="${fieldName}"]`);
        const label = this.$(`label[for="${field?.id}"]`);
        return label?.textContent?.replace(' *', '') || fieldName;
    }

    async submitForm() {
        if (!this.validateCurrentStep()) {
            return;
        }

        this.setState({ isSubmitting: true });

        try {
            const formData = new FormData(this.$('#multi-step-form'));
            const data = Object.fromEntries(formData.entries());
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.emit('form-submitted', { data });
            this.showSuccessMessage();
        } catch (error) {
            this.handleError(error, 'Form submission');
            this.showErrorMessage();
        } finally {
            this.setState({ isSubmitting: false });
        }
    }

    showSuccessMessage() {
        const successModal = document.createElement('success-modal');
        successModal.setAttribute('message', 'Your registration has been submitted successfully!');
        document.body.appendChild(successModal);
    }

    showErrorMessage() {
        const errorModal = document.createElement('error-modal');
        errorModal.setAttribute('message', 'There was an error submitting your form. Please try again.');
        document.body.appendChild(errorModal);
    }
}

// Register the component
customElements.define('complex-form-widget', ComplexFormWidget);
