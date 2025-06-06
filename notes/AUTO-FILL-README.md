# 🤖 Auto Form Filler - Complete Solution

A comprehensive solution for automatically filling forms on any web page with sample or custom data. This project provides multiple ways to auto-fill forms including standalone scripts, Chrome extension, and bookmarklet.

## 📋 Files Overview

1. **`auto-fill-forms.js`** - Main auto-fill library
2. **`auto-fill-demo.html`** - Interactive demo page
3. **`auto-fill-bookmarklet.js`** - Bookmarklet version
4. **`auto-fill-popup.html`** - Chrome extension popup
5. **`auto-fill-manifest.json`** - Chrome extension manifest

## 🚀 Quick Start

### Method 1: Include Script in Your Page

```html
<!DOCTYPE html>
<html>
<head>
    <title>Your Page</title>
</head>
<body>
    <!-- Your forms here -->
    
    <script src="auto-fill-forms.js"></script>
    <script>
        // Fill all forms with sample data
        fillAllForms();
        
        // Or fill with custom data
        fillAllForms({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com'
        });
    </script>
</body>
</html>
```

### Method 2: Bookmarklet

1. Copy the entire content of `auto-fill-bookmarklet.js`
2. Create a new bookmark in your browser
3. Set the URL to: `javascript:(function(){PASTE_SCRIPT_HERE})();`
4. Click the bookmark on any page to activate the auto-filler

### Method 3: Chrome Extension

1. Copy these files to a folder:
   - `auto-fill-forms.js`
   - `auto-fill-popup.html`
   - `auto-fill-manifest.json` (rename to `manifest.json`)
2. Open Chrome → Extensions → Developer mode
3. Click "Load unpacked" and select the folder
4. Use the extension on any website

### Method 4: Browser Console

1. Open browser console (F12)
2. Copy and paste the content of `auto-fill-bookmarklet.js`
3. Press Enter to execute

## 🎯 Features

### Supported Form Elements
- ✅ Text inputs (text, email, tel, url, password, number, date)
- ✅ Textareas
- ✅ Select dropdowns
- ✅ Checkboxes (randomly checked)
- ✅ Radio buttons (one selected per group)
- ✅ Forms with proper form tags
- ✅ Standalone inputs (not in forms)

### Smart Field Detection
The script automatically detects field types based on:
- Input type attributes
- Field names
- IDs
- Placeholder text
- Common naming patterns

### Sample Data Categories
- **Personal Info**: firstName, lastName, name, email, phone, age
- **Address**: address, city, state, zip
- **Professional**: company, title, salary
- **Contact**: website, message, description, comment
- **Security**: password
- **Dates**: birthdate, date fields

## 🛠️ Usage Examples

### Basic Usage

```javascript
// Fill all forms with sample data
const results = fillAllForms();
console.log(`Filled ${results.totalFilled} fields`);

// Fill only page inputs (including standalone)
fillPageInputs();

// Quick demo
autoFillDemo();
```

### Custom Data Usage

```javascript
// Define custom data
const customData = {
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice@company.com',
    phone: '+1-555-ALICE',
    company: 'Tech Corp',
    title: 'Senior Developer',
    message: 'Custom message here',
    // Checkbox values
    newsletter: true,
    terms: true,
    // Radio button value
    contactMethod: 'email',
    // Select dropdown value
    country: 'US'
};

// Fill with custom data
fillAllForms(customData);
```

### Individual Form Filling

```javascript
// Get specific form
const form = document.getElementById('myForm');

// Fill specific form
const results = window.AutoFormFiller.fillForm(form, customData);
console.log('Form results:', results);
```

## 🔧 Advanced Configuration

### Field Pattern Customization

```javascript
// Access the AutoFormFiller instance
const filler = window.AutoFormFiller;

// Add custom field patterns
filler.fieldPatterns.customField = /custom.*field|special.*input/i;
filler.sampleData.customField = ['Custom Value 1', 'Custom Value 2'];
```

### Custom Sample Data

```javascript
// Override sample data
window.AutoFormFiller.sampleData.email = ['custom@email.com', 'test@domain.org'];
window.AutoFormFiller.sampleData.company = ['My Company', 'Custom Corp'];
```

## 📊 Result Object Structure

```javascript
{
    formsProcessed: 2,
    totalFilled: 15,
    totalSkipped: 3,
    totalErrors: 0,
    formResults: [
        {
            formId: 'form1',
            filled: 8,
            skipped: 1,
            errors: 0,
            details: [
                '✅ INPUT "firstName" filled',
                '✅ SELECT "country" filled',
                '⏭️ INPUT "readonly-field" skipped'
            ]
        }
    ]
}
```

## 🎨 Demo Page

Open `auto-fill-demo.html` in your browser to:
- Test all form types
- Try different filling methods
- See real-time results
- Experiment with custom data

## 🧪 Testing

### Test with the Reference Page

Use the test page at `/apps/test-inspect-functionality.html`:

```javascript
// Open the test page and run:
fillAllForms();

// Or with custom data:
fillAllForms({
    'text-input': 'Custom Text',
    'email-input': 'test@custom.com',
    'select-dropdown': 'option2',
    'textarea-input': 'Custom message here',
    'checkbox-1': true,
    'radioGroup': 'radio1'
});
```

## 🔍 Debugging

### Enable Detailed Logging

```javascript
// See what fields are being processed
window.AutoFormFiller.fillAllForms().formResults.forEach(result => {
    console.log(`Form: ${result.formId}`);
    result.details.forEach(detail => console.log(detail));
});
```

### Check Form Information

```javascript
// Get page form info
const info = window.showFormInfo();
console.log(info);
```

## 🛡️ Security Considerations

- Script only fills visible, enabled, non-readonly fields
- No data is sent to external servers
- All processing happens locally in the browser
- Password fields use secure sample passwords
- Custom data is processed client-side only

## 🔄 Browser Compatibility

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+

## 📝 Custom Data Format

### Field Name Matching
The script matches custom data fields by:
1. Exact field name match
2. Field ID match
3. Field type pattern match

### Example Custom Data

```javascript
{
    // Direct field name matches
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    
    // Field ID matches
    'user-phone': '+1-555-123-4567',
    'contact-message': 'Hello there!',
    
    // Field type matches
    address: '123 Main St',
    city: 'New York',
    
    // Checkbox values (true/false)
    newsletter: true,
    terms: false,
    
    // Radio button values (value of option to select)
    gender: 'male',
    contactMethod: 'email',
    
    // Select dropdown values
    country: 'USA',
    language: 'en'
}
```

## 🎯 Use Cases

### Web Development & Testing
- Quickly fill forms during development
- Test form validation
- Simulate user input for testing

### Quality Assurance
- Automate form testing workflows
- Generate test data
- Validate form behavior

### Demo & Training
- Quickly populate demo forms
- Create realistic form scenarios
- Training environments

### Personal Use
- Speed up form filling on websites
- Consistent test data entry
- Form field validation testing

## 🤝 Contributing

Feel free to extend the script by:
1. Adding new field patterns
2. Expanding sample data
3. Supporting new input types
4. Improving field detection logic

## 📄 License

Free to use and modify for any purpose.

---

**Happy Form Filling! 🤖✨**
