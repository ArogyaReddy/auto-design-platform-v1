// Auto-Fill Test Script for test-inspect-functionality.html
// Run this in the browser console when on the test page

(function() {
    console.log('🚀 Starting Auto-Fill Test on Inspector Test Page...');
    
    // Test data specifically for your form
    const testData = {
        'text-input': 'Auto-filled: John Doe',
        'email-input': 'john.doe@autofill.com',
        'password-input': 'SecureTest123!',
        'select-dropdown': 'option2',
        'textarea-input': 'This textarea was automatically filled! This demonstrates the auto-fill functionality working on your inspector test page.',
        'checkbox-1': true,
        'radio-1': true  // First radio button
    };
    
    const customTestData = {
        'text-input': 'CUSTOM: Alice Johnson',
        'email-input': 'alice.johnson@customdomain.org',
        'password-input': 'CustomPass456!',
        'select-dropdown': 'option3',
        'textarea-input': 'CUSTOM MESSAGE: This is a custom message that shows how you can provide your own data to fill forms automatically.',
        'checkbox-1': true,
        'radio-2': true  // Second radio button
    };
    
    function testBasicFill() {
        console.log('📝 Testing basic auto-fill...');
        let filled = 0;
        let details = [];
        
        Object.entries(testData).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = value;
                    details.push(`✅ ${fieldId}: checked = ${value}`);
                } else {
                    element.value = value;
                    details.push(`✅ ${fieldId}: "${value}"`);
                }
                
                // Add visual feedback
                element.style.backgroundColor = '#e8f5e8';
                element.style.borderColor = '#28a745';
                element.style.transition = 'all 0.3s ease';
                
                // Trigger events
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                
                filled++;
            } else {
                details.push(`❌ ${fieldId}: element not found`);
            }
        });
        
        const result = {
            type: 'Basic Auto-Fill',
            filled: filled,
            total: Object.keys(testData).length,
            details: details
        };
        
        console.log('🎯 Basic fill results:', result);
        return result;
    }
    
    function testCustomFill() {
        console.log('🎨 Testing custom data fill...');
        let filled = 0;
        let details = [];
        
        Object.entries(customTestData).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                if (element.type === 'checkbox' || element.type === 'radio') {
                    element.checked = value;
                    details.push(`✅ ${fieldId}: checked = ${value}`);
                } else {
                    element.value = value;
                    details.push(`✅ ${fieldId}: "${value}"`);
                }
                
                // Add different visual feedback for custom
                element.style.backgroundColor = '#fff3cd';
                element.style.borderColor = '#ffc107';
                element.style.transition = 'all 0.3s ease';
                
                // Trigger events
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
                
                filled++;
            } else {
                details.push(`❌ ${fieldId}: element not found`);
            }
        });
        
        const result = {
            type: 'Custom Data Fill',
            filled: filled,
            total: Object.keys(customTestData).length,
            details: details
        };
        
        console.log('🎨 Custom fill results:', result);
        return result;
    }
    
    function clearForms() {
        console.log('🧹 Clearing all forms...');
        const inputs = document.querySelectorAll('input, textarea, select');
        let cleared = 0;
        
        inputs.forEach(input => {
            if (input.type === 'checkbox' || input.type === 'radio') {
                if (input.checked) {
                    input.checked = false;
                    cleared++;
                }
            } else if (input.value) {
                input.value = '';
                cleared++;
            }
            
            // Reset visual styling
            input.style.backgroundColor = '';
            input.style.borderColor = '';
        });
        
        console.log(`🧹 Cleared ${cleared} fields`);
        return cleared;
    }
    
    function analyzeForm() {
        console.log('📊 Analyzing form structure...');
        
        const forms = document.querySelectorAll('form');
        const inputs = document.querySelectorAll('input, textarea, select');
        const buttons = document.querySelectorAll('button');
        
        const inputDetails = Array.from(inputs).map(input => ({
            id: input.id || 'no-id',
            name: input.name || 'no-name',
            type: input.type || input.tagName.toLowerCase(),
            placeholder: input.placeholder || '',
            value: input.value || '',
            checked: input.checked || false
        }));
        
        const analysis = {
            totalForms: forms.length,
            totalInputs: inputs.length,
            totalButtons: buttons.length,
            inputDetails: inputDetails,
            pageTitle: document.title,
            url: window.location.href
        };
        
        console.log('📊 Form analysis:', analysis);
        return analysis;
    }
    
    function runFullDemo() {
        console.log('🎬 Running full auto-fill demo...');
        
        const results = [];
        
        // Step 1: Analyze
        console.log('\n📊 Step 1: Analyzing form...');
        results.push(analyzeForm());
        
        // Step 2: Basic fill
        setTimeout(() => {
            console.log('\n🚀 Step 2: Basic auto-fill...');
            results.push(testBasicFill());
            
            // Step 3: Clear
            setTimeout(() => {
                console.log('\n🧹 Step 3: Clearing forms...');
                clearForms();
                
                // Step 4: Custom fill
                setTimeout(() => {
                    console.log('\n🎨 Step 4: Custom data fill...');
                    results.push(testCustomFill());
                    
                    console.log('\n✅ Demo complete! Results:', results);
                    
                    // Show summary
                    setTimeout(() => {
                        alert(`🎉 Auto-Fill Demo Complete!
                        
✅ Form analyzed: ${results[0].totalInputs} inputs found
✅ Basic fill: ${results[1].filled}/${results[1].total} fields filled
✅ Custom fill: ${results[2].filled}/${results[2].total} fields filled

Check the console for detailed results!`);
                    }, 1000);
                    
                }, 2000);
            }, 2000);
        }, 2000);
    }
    
    // Create floating control panel
    function createControlPanel() {
        const existingPanel = document.getElementById('auto-fill-test-panel');
        if (existingPanel) existingPanel.remove();
        
        const panel = document.createElement('div');
        panel.id = 'auto-fill-test-panel';
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
                min-width: 220px;
            ">
                <div style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                    font-weight: bold;
                    color: #333;
                ">
                    🧪 Auto-Fill Test Panel
                    <button id="close-test-panel" style="
                        background: none;
                        border: none;
                        font-size: 18px;
                        cursor: pointer;
                        color: #666;
                    ">×</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                    <button id="run-full-demo" style="
                        padding: 10px 12px;
                        background: #007cba;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        font-weight: bold;
                    ">🎬 Run Full Demo</button>
                    <button id="test-basic" style="
                        padding: 8px 12px;
                        background: #28a745;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🚀 Basic Fill</button>
                    <button id="test-custom" style="
                        padding: 8px 12px;
                        background: #ffc107;
                        color: black;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🎨 Custom Fill</button>
                    <button id="analyze-form" style="
                        padding: 8px 12px;
                        background: #17a2b8;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">📊 Analyze Form</button>
                    <button id="clear-all" style="
                        padding: 8px 12px;
                        background: #dc3545;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                    ">🧹 Clear All</button>
                </div>
                <div style="
                    margin-top: 10px;
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 4px;
                    font-size: 11px;
                    color: #666;
                ">
                    Open browser console (F12) to see detailed results
                </div>
            </div>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('close-test-panel').onclick = () => panel.remove();
        document.getElementById('run-full-demo').onclick = runFullDemo;
        document.getElementById('test-basic').onclick = testBasicFill;
        document.getElementById('test-custom').onclick = testCustomFill;
        document.getElementById('analyze-form').onclick = analyzeForm;
        document.getElementById('clear-all').onclick = clearForms;
    }
    
    // Initialize
    createControlPanel();
    
    // Make functions available globally
    window.testAutoFill = {
        basicFill: testBasicFill,
        customFill: testCustomFill,
        clearForms: clearForms,
        analyzeForm: analyzeForm,
        runFullDemo: runFullDemo
    };
    
    console.log(`
🎉 Auto-Fill Test Ready!

Available functions:
• testAutoFill.basicFill() - Fill with sample data
• testAutoFill.customFill() - Fill with custom data
• testAutoFill.clearForms() - Clear all forms
• testAutoFill.analyzeForm() - Analyze form structure
• testAutoFill.runFullDemo() - Complete demonstration

Control panel added to top-right corner.
    `);
    
    // Show initial analysis
    setTimeout(() => {
        console.log('\n🔍 Initial form analysis:');
        analyzeForm();
    }, 500);
})();
