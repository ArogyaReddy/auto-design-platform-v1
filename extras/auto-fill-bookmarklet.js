/**
 * AUTO FORM FILLER BOOKMARKLET
 * 
 * Copy this entire script and save as a bookmark with the following URL:
 * javascript:(function(){[PASTE_ENTIRE_SCRIPT_HERE]})();
 * 
 * Or include this script in any page to add auto-fill functionality.
 */

(function() {
    'use strict';
    
    // Check if already loaded
    if (window.AutoFormFillerBookmarklet) {
        console.log('Auto Form Filler already loaded');
        return;
    }
    
    window.AutoFormFillerBookmarklet = true;
    
    // Sample data for auto-filling
    const sampleData = {
        firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa', 'Chris', 'Emma'],
        lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis'],
        name: ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams', 'David Brown'],
        email: ['test@example.com', 'user@domain.com', 'sample@email.org', 'demo@test.net'],
        phone: ['+1-555-123-4567', '(555) 987-6543', '555.234.5678', '+1-555-999-0000'],
        address: ['123 Main St', '456 Oak Ave', '789 Pine Rd', '321 Elm Street', '654 Maple Dr'],
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia'],
        state: ['NY', 'CA', 'IL', 'TX', 'AZ', 'PA', 'FL', 'WA'],
        zip: ['10001', '90210', '60601', '77001', '85001', '19101', '33101', '98101'],
        company: ['Tech Corp', 'Innovation Inc', 'Future Systems', 'Digital Solutions', 'Alpha Tech'],
        title: ['Software Engineer', 'Product Manager', 'Designer', 'Analyst', 'Developer'],
        message: 'This is a sample message for testing form auto-fill functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        comment: 'This is a test comment for form validation and auto-fill testing purposes.',
        age: [25, 30, 35, 28, 32, 29, 31, 27],
        salary: [50000, 75000, 100000, 65000, 85000, 120000],
        website: ['https://example.com', 'https://test.org', 'https://sample.net', 'https://demo.com'],
        password: ['SecurePass123!', 'TestPassword456', 'Demo@Password789', 'Sample#Pass012']
    };
    
    // Field detection patterns
    const fieldPatterns = {
        firstName: /first.*name|fname|given.*name/i,
        lastName: /last.*name|lname|family.*name|surname/i,
        name: /^name$|full.*name|display.*name/i,
        email: /email|e-mail/i,
        phone: /phone|tel|mobile|contact/i,
        address: /address|street|addr/i,
        city: /city|town/i,
        state: /state|province|region/i,
        zip: /zip|postal|postcode/i,
        company: /company|organization|employer/i,
        title: /title|position|job/i,
        age: /age/i,
        salary: /salary|wage|income/i,
        website: /website|url|homepage/i,
        password: /password|pass|pwd/i,
        message: /message|msg|note/i,
        description: /description|desc|details/i,
        comment: /comment|feedback|review/i
    };
    
    // Utility functions
    function getRandomValue(array) {
        return array[Math.floor(Math.random() * array.length)];
    }
    
    function getFieldType(element) {
        const name = (element.name || element.id || element.placeholder || '').toLowerCase();
        const type = element.type ? element.type.toLowerCase() : '';
        
        if (type === 'email') return 'email';
        if (type === 'tel' || type === 'phone') return 'phone';
        if (type === 'url') return 'website';
        if (type === 'password') return 'password';
        
        for (const [fieldType, pattern] of Object.entries(fieldPatterns)) {
            if (pattern.test(name)) {
                return fieldType;
            }
        }
        
        if (element.tagName === 'TEXTAREA') return 'message';
        return 'name';
    }
    
    function fillTextInput(element) {
        if (element.readOnly || element.disabled) return false;
        
        const fieldType = getFieldType(element);
        const values = sampleData[fieldType];
        
        if (!values) return false;
        
        const value = Array.isArray(values) ? getRandomValue(values) : values;
        
        element.focus();
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        
        return true;
    }
    
    function fillSelect(element) {
        if (element.disabled) return false;
        
        const options = Array.from(element.options).filter(opt => opt.value && opt.value !== '');
        if (options.length === 0) return false;
        
        const selectedOption = getRandomValue(options);
        element.focus();
        element.value = selectedOption.value;
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.blur();
        
        return true;
    }
    
    function fillCheckbox(element) {
        if (element.disabled) return false;
        
        const shouldCheck = Math.random() > 0.5;
        if (element.checked !== shouldCheck) {
            element.focus();
            element.checked = shouldCheck;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.blur();
            return true;
        }
        return false;
    }
    
    function fillRadioGroup(radioButtons) {
        const enabledRadios = radioButtons.filter(radio => !radio.disabled);
        if (enabledRadios.length === 0) return false;
        
        const selectedRadio = getRandomValue(enabledRadios);
        selectedRadio.focus();
        selectedRadio.checked = true;
        selectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
        selectedRadio.blur();
        
        return true;
    }
    
    function autoFillPage() {
        let filled = 0;
        let skipped = 0;
        
        // Get all form elements
        const allInputs = document.querySelectorAll('input:not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select');
        
        // Group radio buttons
        const radioGroups = {};
        const processedRadios = new Set();
        
        allInputs.forEach(input => {
            if (input.type === 'radio') {
                if (!radioGroups[input.name]) {
                    radioGroups[input.name] = [];
                }
                radioGroups[input.name].push(input);
            }
        });
        
        // Process each element
        allInputs.forEach(element => {
            try {
                if (element.type === 'radio') {
                    if (!processedRadios.has(element.name)) {
                        if (fillRadioGroup(radioGroups[element.name])) {
                            filled++;
                        } else {
                            skipped++;
                        }
                        processedRadios.add(element.name);
                    }
                } else if (element.type === 'checkbox') {
                    if (fillCheckbox(element)) {
                        filled++;
                    } else {
                        skipped++;
                    }
                } else if (element.tagName === 'SELECT') {
                    if (fillSelect(element)) {
                        filled++;
                    } else {
                        skipped++;
                    }
                } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    if (fillTextInput(element)) {
                        filled++;
                    } else {
                        skipped++;
                    }
                }
            } catch (error) {
                console.error('Error filling element:', error);
                skipped++;
            }
        });
        
        return { filled, skipped, total: allInputs.length };
    }
    
    function clearAllForms() {
        const allInputs = document.querySelectorAll('input, textarea, select');
        let cleared = 0;
        
        allInputs.forEach(input => {
            try {
                if (!input.disabled && !input.readOnly) {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        if (input.checked) {
                            input.checked = false;
                            cleared++;
                        }
                    } else if (input.value) {
                        input.value = '';
                        cleared++;
                    }
                }
            } catch (error) {
                console.error('Error clearing element:', error);
            }
        });
        
        return cleared;
    }
    
    function showFormInfo() {
        const forms = document.querySelectorAll('form');
        const allInputs = document.querySelectorAll('input, textarea, select');
        const standaloneInputs = Array.from(allInputs).filter(input => !input.closest('form'));
        
        return {
            forms: forms.length,
            totalInputs: allInputs.length,
            standaloneInputs: standaloneInputs.length,
            url: window.location.href,
            title: document.title
        };
    }
    
    // Create floating control panel
    function createControlPanel() {
        // Remove existing panel if any
        const existing = document.getElementById('auto-fill-control-panel');
        if (existing) {
            existing.remove();
        }
        
        const panel = document.createElement('div');
        panel.id = 'auto-fill-control-panel';
        panel.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 999999;
                background: white;
                border: 2px solid #007cba;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                font-family: Arial, sans-serif;
                font-size: 14px;
                min-width: 200px;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-weight: bold;
                    color: #333;
                ">
                    🤖 Auto Form Filler
                    <button id="close-panel" style="
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button id="fill-forms" style="
                        padding: 8px 12px;
                        background: #007cba;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🚀 Fill Forms</button>
                    <button id="clear-forms" style="
                        padding: 8px 12px;
                        background: #ffc107;
                        color: black;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🧹 Clear Forms</button>
                    <button id="show-info" style="
                        padding: 8px 12px;
                        background: #17a2b8;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">📊 Form Info</button>
                </div>
                <div id="status" style="
                    margin-top: 10px;
                    padding: 5px;
                    font-size: 11px;
                    text-align: center;
                    display: none;
                "></div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('close-panel').onclick = () => panel.remove();
        
        document.getElementById('fill-forms').onclick = () => {
            const result = autoFillPage();
            showStatus(`✅ Filled ${result.filled} fields, skipped ${result.skipped}`, 'success');
        };
        
        document.getElementById('clear-forms').onclick = () => {
            const cleared = clearAllForms();
            showStatus(`🧹 Cleared ${cleared} fields`, 'success');
        };
        
        document.getElementById('show-info').onclick = () => {
            const info = showFormInfo();
            showStatus(`📊 ${info.forms} forms, ${info.totalInputs} inputs`, 'info');
        };
        
        function showStatus(message, type) {
            const status = document.getElementById('status');
            status.textContent = message;
            status.style.display = 'block';
            status.style.backgroundColor = type === 'success' ? '#d4edda' : '#d1ecf1';
            status.style.color = type === 'success' ? '#155724' : '#0c5460';
            status.style.border = `1px solid ${type === 'success' ? '#c3e6cb' : '#bee5eb'}`;
            status.style.borderRadius = '4px';
            
            setTimeout(() => {
                status.style.display = 'none';
            }, 3000);
        }
    }
    
    // Initialize
    createControlPanel();
    
    // Also add to window for direct access
    window.autoFillForms = autoFillPage;
    window.clearAllForms = clearAllForms;
    window.showFormInfo = showFormInfo;
    
    console.log(`
🤖 Auto Form Filler Loaded!

Available functions:
• autoFillForms() - Fill all forms with sample data
• clearAllForms() - Clear all form fields
• showFormInfo() - Show form information

Control panel added to top-right corner of the page.
    `);
    
})();
