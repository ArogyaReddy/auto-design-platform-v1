/**
 * Auto Form Filler Script
 * A comprehensive solution for automatically filling forms on any web page
 * 
 * Usage:
 * 1. Include this script in your page or extension
 * 2. Call AutoFormFiller.fillAllForms() to fill all forms with sample data
 * 3. Or use AutoFormFiller.fillForm(formElement, customData) for specific forms
 */

class AutoFormFiller {
    constructor() {
        this.sampleData = {
            // Text inputs
            firstName: ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Lisa'],
            lastName: ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'],
            name: ['John Smith', 'Jane Doe', 'Mike Johnson', 'Sarah Williams'],
            email: ['test@example.com', 'user@domain.com', 'sample@email.org'],
            phone: ['+1-555-123-4567', '(555) 987-6543', '555.234.5678'],
            address: ['123 Main St', '456 Oak Ave', '789 Pine Rd'],
            city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
            state: ['NY', 'CA', 'IL', 'TX', 'AZ'],
            zip: ['10001', '90210', '60601', '77001', '85001'],
            company: ['Tech Corp', 'Innovation Inc', 'Future Systems', 'Digital Solutions'],
            title: ['Software Engineer', 'Product Manager', 'Designer', 'Analyst'],
            message: 'This is a sample message for testing form auto-fill functionality.',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            comment: 'This is a test comment for form validation.',
            
            // Numbers
            age: [25, 30, 35, 28, 32],
            salary: [50000, 75000, 100000, 65000],
            quantity: [1, 2, 5, 10],
            
            // Dates
            date: ['2024-01-15', '2024-06-20', '2024-12-01'],
            
            // URLs
            website: ['https://example.com', 'https://test.org', 'https://sample.net'],
            
            // Passwords
            password: ['SecurePass123!', 'TestPassword456', 'Demo@Password789']
        };
        
        this.fieldPatterns = {
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
            quantity: /quantity|qty|amount/i,
            date: /date|birthday|dob/i,
            website: /website|url|homepage/i,
            password: /password|pass|pwd/i,
            message: /message|msg|note/i,
            description: /description|desc|details/i,
            comment: /comment|feedback|review/i
        };
    }

    /**
     * Get a random value from an array
     */
    getRandomValue(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Determine field type based on input attributes and name patterns
     */
    getFieldType(element) {
        const name = (element.name || element.id || element.placeholder || '').toLowerCase();
        const type = element.type ? element.type.toLowerCase() : '';
        
        // Check for specific input types first
        if (type === 'email') return 'email';
        if (type === 'tel' || type === 'phone') return 'phone';
        if (type === 'url') return 'website';
        if (type === 'password') return 'password';
        if (type === 'date') return 'date';
        if (type === 'number') return 'quantity';
        
        // Check patterns
        for (const [fieldType, pattern] of Object.entries(this.fieldPatterns)) {
            if (pattern.test(name)) {
                return fieldType;
            }
        }
        
        // Default fallbacks
        if (element.tagName === 'TEXTAREA') return 'message';
        return 'name'; // Default text value
    }

    /**
     * Fill a text input or textarea
     */
    fillTextInput(element, customData = null) {
        if (element.readOnly || element.disabled) return false;
        
        let value = '';
        
        if (customData) {
            // Use custom data if provided
            const fieldName = element.name || element.id;
            value = customData[fieldName] || customData[this.getFieldType(element)] || '';
        } else {
            // Use sample data based on field type
            const fieldType = this.getFieldType(element);
            const sampleValues = this.sampleData[fieldType];
            
            if (sampleValues && Array.isArray(sampleValues)) {
                value = this.getRandomValue(sampleValues);
            } else if (typeof sampleValues === 'string') {
                value = sampleValues;
            } else {
                value = this.getRandomValue(this.sampleData.name);
            }
        }
        
        if (value) {
            element.focus();
            element.value = value;
            
            // Trigger events to ensure proper form validation
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.blur();
            
            return true;
        }
        
        return false;
    }

    /**
     * Fill a select dropdown
     */
    fillSelect(element, customData = null) {
        if (element.disabled) return false;
        
        const options = Array.from(element.options).filter(opt => opt.value && opt.value !== '');
        
        if (options.length === 0) return false;
        
        let selectedOption;
        
        if (customData) {
            const fieldName = element.name || element.id;
            const customValue = customData[fieldName];
            selectedOption = options.find(opt => 
                opt.value === customValue || opt.text === customValue
            );
        }
        
        if (!selectedOption) {
            selectedOption = this.getRandomValue(options);
        }
        
        if (selectedOption) {
            element.focus();
            element.value = selectedOption.value;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.blur();
            return true;
        }
        
        return false;
    }

    /**
     * Fill checkboxes (randomly check some)
     */
    fillCheckbox(element, customData = null) {
        if (element.disabled) return false;
        
        let shouldCheck = false;
        
        if (customData) {
            const fieldName = element.name || element.id || element.value;
            shouldCheck = customData[fieldName] === true || customData[fieldName] === 'true';
        } else {
            // Randomly check 50% of checkboxes
            shouldCheck = Math.random() > 0.5;
        }
        
        if (element.checked !== shouldCheck) {
            element.focus();
            element.checked = shouldCheck;
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.blur();
            return true;
        }
        
        return false;
    }

    /**
     * Fill radio buttons (select one from each group)
     */
    fillRadioGroup(radioButtons, customData = null) {
        if (radioButtons.length === 0) return false;
        
        // Filter out disabled radio buttons
        const enabledRadios = radioButtons.filter(radio => !radio.disabled);
        if (enabledRadios.length === 0) return false;
        
        let selectedRadio;
        
        if (customData) {
            const groupName = enabledRadios[0].name;
            const customValue = customData[groupName];
            selectedRadio = enabledRadios.find(radio => 
                radio.value === customValue || radio.id === customValue
            );
        }
        
        if (!selectedRadio) {
            selectedRadio = this.getRandomValue(enabledRadios);
        }
        
        if (selectedRadio) {
            selectedRadio.focus();
            selectedRadio.checked = true;
            selectedRadio.dispatchEvent(new Event('change', { bubbles: true }));
            selectedRadio.blur();
            return true;
        }
        
        return false;
    }

    /**
     * Fill a single form
     */
    fillForm(form, customData = null) {
        const results = {
            filled: 0,
            skipped: 0,
            errors: 0,
            details: []
        };

        try {
            // Get all form elements
            const formElements = form.querySelectorAll(
                'input:not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select'
            );

            // Group radio buttons by name
            const radioGroups = {};
            const processedRadios = new Set();

            formElements.forEach(element => {
                if (element.type === 'radio') {
                    if (!radioGroups[element.name]) {
                        radioGroups[element.name] = [];
                    }
                    radioGroups[element.name].push(element);
                }
            });

            // Process each form element
            formElements.forEach(element => {
                try {
                    const elementName = element.name || element.id || element.tagName;
                    
                    if (element.type === 'radio') {
                        if (!processedRadios.has(element.name)) {
                            const success = this.fillRadioGroup(radioGroups[element.name], customData);
                            processedRadios.add(element.name);
                            
                            if (success) {
                                results.filled++;
                                results.details.push(`✅ Radio group "${element.name}" filled`);
                            } else {
                                results.skipped++;
                                results.details.push(`⏭️  Radio group "${element.name}" skipped`);
                            }
                        }
                    } else if (element.type === 'checkbox') {
                        const success = this.fillCheckbox(element, customData);
                        if (success) {
                            results.filled++;
                            results.details.push(`✅ Checkbox "${elementName}" filled`);
                        } else {
                            results.skipped++;
                            results.details.push(`⏭️  Checkbox "${elementName}" skipped`);
                        }
                    } else if (element.tagName === 'SELECT') {
                        const success = this.fillSelect(element, customData);
                        if (success) {
                            results.filled++;
                            results.details.push(`✅ Select "${elementName}" filled`);
                        } else {
                            results.skipped++;
                            results.details.push(`⏭️  Select "${elementName}" skipped`);
                        }
                    } else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        const success = this.fillTextInput(element, customData);
                        if (success) {
                            results.filled++;
                            results.details.push(`✅ ${element.tagName} "${elementName}" filled`);
                        } else {
                            results.skipped++;
                            results.details.push(`⏭️  ${element.tagName} "${elementName}" skipped`);
                        }
                    }
                } catch (error) {
                    results.errors++;
                    results.details.push(`❌ Error filling "${elementName}": ${error.message}`);
                }
            });

        } catch (error) {
            results.errors++;
            results.details.push(`❌ Form processing error: ${error.message}`);
        }

        return results;
    }

    /**
     * Fill all forms on the page
     */
    fillAllForms(customData = null) {
        const forms = document.querySelectorAll('form');
        const totalResults = {
            formsProcessed: 0,
            totalFilled: 0,
            totalSkipped: 0,
            totalErrors: 0,
            formResults: []
        };

        if (forms.length === 0) {
            console.warn('No forms found on the page');
            return totalResults;
        }

        forms.forEach((form, index) => {
            const formId = form.id || form.name || `form-${index + 1}`;
            console.log(`🔄 Processing form: ${formId}`);
            
            const results = this.fillForm(form, customData);
            results.formId = formId;
            
            totalResults.formResults.push(results);
            totalResults.formsProcessed++;
            totalResults.totalFilled += results.filled;
            totalResults.totalSkipped += results.skipped;
            totalResults.totalErrors += results.errors;
            
            console.log(`📊 Form "${formId}" results:`, results);
        });

        console.log('🎉 Total results:', totalResults);
        return totalResults;
    }

    /**
     * Smart form filler - tries to detect and fill forms even without form tags
     */
    fillPageInputs(customData = null) {
        // First try to fill forms normally
        const formResults = this.fillAllForms(customData);
        
        // Then find standalone inputs not in forms
        const allInputs = document.querySelectorAll(
            'input:not([type="submit"]):not([type="button"]):not([type="reset"]), textarea, select'
        );
        
        const standaloneInputs = Array.from(allInputs).filter(input => {
            return !input.closest('form');
        });
        
        if (standaloneInputs.length > 0) {
            console.log(`🔄 Found ${standaloneInputs.length} standalone inputs to fill`);
            
            // Create a fake form element to use existing logic
            const fakeForm = document.createElement('div');
            standaloneInputs.forEach(input => fakeForm.appendChild(input.cloneNode(true)));
            
            // Fill standalone inputs using the same logic
            standaloneInputs.forEach(input => {
                try {
                    const elementName = input.name || input.id || input.tagName;
                    
                    if (input.type === 'checkbox') {
                        this.fillCheckbox(input, customData);
                    } else if (input.tagName === 'SELECT') {
                        this.fillSelect(input, customData);
                    } else if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA') {
                        this.fillTextInput(input, customData);
                    }
                    
                    console.log(`✅ Filled standalone input: ${elementName}`);
                } catch (error) {
                    console.error(`❌ Error filling standalone input:`, error);
                }
            });
        }
        
        return formResults;
    }
}

// Create global instance
window.AutoFormFiller = new AutoFormFiller();

// Convenience functions for easy use
window.fillAllForms = (customData) => window.AutoFormFiller.fillAllForms(customData);
window.fillPageInputs = (customData) => window.AutoFormFiller.fillPageInputs(customData);

// Example usage functions
window.autoFillDemo = () => {
    console.log('🚀 Starting auto-fill demo...');
    return window.AutoFormFiller.fillPageInputs();
};

window.autoFillWithCustomData = (customData) => {
    console.log('🚀 Starting auto-fill with custom data...');
    return window.AutoFormFiller.fillPageInputs(customData);
};

// Log available functions
console.log(`
🤖 Auto Form Filler Script Loaded!

Available functions:
• fillAllForms() - Fill all forms with sample data
• fillPageInputs() - Fill all inputs (including standalone)
• autoFillDemo() - Quick demo function
• autoFillWithCustomData({field: 'value'}) - Fill with custom data

Example custom data format:
{
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    company: 'Tech Corp',
    message: 'Custom message here'
}
`);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoFormFiller;
}
