// Test script to verify Element AI Extractor functions are accessible
// This script can be run in the browser console to test the extension

console.log('=== Element AI Extractor Function Test ===');

// Test if the functions are defined globally
try {
    console.log('Testing startInspectionDirectly function...');
    if (typeof startInspectionDirectly === 'function') {
        console.log('✅ startInspectionDirectly is defined and accessible');
    } else {
        console.error('❌ startInspectionDirectly is not defined');
    }
} catch (error) {
    console.error('❌ Error accessing startInspectionDirectly:', error);
}

try {
    console.log('Testing resetInspectionState function...');
    if (typeof resetInspectionState === 'function') {
        console.log('✅ resetInspectionState is defined and accessible');
    } else {
        console.error('❌ resetInspectionState is not defined');
    }
} catch (error) {
    console.error('❌ Error accessing resetInspectionState:', error);
}

try {
    console.log('Testing bulletproofStartInspection function...');
    if (typeof bulletproofStartInspection === 'function') {
        console.log('✅ bulletproofStartInspection is defined and accessible');
    } else {
        console.error('❌ bulletproofStartInspection is not defined');
    }
} catch (error) {
    console.error('❌ Error accessing bulletproofStartInspection:', error);
}

// Test the actual functionality (note: this will only work in the extension popup context)
console.log('=== Function Accessibility Test Complete ===');
console.log('To test the actual inspection functionality:');
console.log('1. Open the Element AI Extractor popup');
console.log('2. Click the Inspect Element button');
console.log('3. Check for any ReferenceError messages in the console');
console.log('4. Verify that inspection works on the test page');
