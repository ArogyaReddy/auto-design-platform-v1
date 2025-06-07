// Extension Communication Fix Verification Script
// Run this in the browser console on any page to test the fixes

console.log("🔧 Element AI Extractor - Communication Fix Verification");
console.log("================================================");

// Check if content script is loaded
function checkContentScript() {
    console.log("\n1. Checking Content Script Loading:");
    
    if (typeof window.aiExtractorLoaded !== 'undefined') {
        console.log("✅ Content script flag detected:", window.aiExtractorLoaded);
    } else {
        console.log("❌ Content script not detected");
        return false;
    }
    
    if (typeof window.aiExtractorMessageListenerAdded !== 'undefined') {
        console.log("✅ Message listener flag detected:", window.aiExtractorMessageListenerAdded);
    } else {
        console.log("⚠️ Message listener flag not found");
    }
    
    if (typeof window.aiExtractorIsInspecting !== 'undefined') {
        console.log("✅ Inspection state flag detected:", window.aiExtractorIsInspecting);
    } else {
        console.log("⚠️ Inspection state flag not found");
    }
    
    return true;
}

// Test message communication
async function testMessageCommunication() {
    console.log("\n2. Testing Message Communication:");
    
    if (typeof chrome === 'undefined' || !chrome.runtime) {
        console.log("❌ Chrome runtime API not available");
        return false;
    }
    
    try {
        const response = await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('Message timeout'));
            }, 2000);
            
            chrome.runtime.sendMessage({
                action: 'ping'
            }, (response) => {
                clearTimeout(timeout);
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });
        
        console.log("✅ Message communication successful:", response);
        return true;
        
    } catch (error) {
        console.log("❌ Message communication failed:", error.message);
        return false;
    }
}

// Check for common error patterns
function checkForErrors() {
    console.log("\n3. Checking for Common Error Patterns:");
    
    // Monitor console for errors
    const originalError = console.error;
    const originalWarn = console.warn;
    
    let errorCount = 0;
    let connectionErrors = 0;
    
    console.error = function(...args) {
        const message = args.join(' ');
        if (message.includes('Could not establish connection') || 
            message.includes('Receiving end does not exist')) {
            connectionErrors++;
            console.log(`❌ Connection error detected: ${message}`);
        }
        errorCount++;
        originalError.apply(console, args);
    };
    
    console.warn = function(...args) {
        const message = args.join(' ');
        if (message.includes('Could not establish connection') || 
            message.includes('Receiving end does not exist')) {
            connectionErrors++;
            console.log(`⚠️ Connection warning detected: ${message}`);
        }
        originalWarn.apply(console, args);
    };
    
    setTimeout(() => {
        console.log(`\n📊 Error Summary (last 5 seconds):`);
        console.log(`Total errors: ${errorCount}`);
        console.log(`Connection errors: ${connectionErrors}`);
        
        if (connectionErrors === 0) {
            console.log("✅ No connection errors detected!");
        } else {
            console.log(`❌ ${connectionErrors} connection errors found`);
        }
        
        // Restore original console methods
        console.error = originalError;
        console.warn = originalWarn;
    }, 5000);
}

// Performance test
function performanceTest() {
    console.log("\n4. Performance Test:");
    
    const startTime = performance.now();
    
    // Test multiple rapid pings
    const promises = [];
    for (let i = 0; i < 5; i++) {
        const promise = new Promise((resolve) => {
            chrome.runtime.sendMessage({
                action: 'ping'
            }, (response) => {
                const endTime = performance.now();
                resolve({
                    attempt: i + 1,
                    responseTime: endTime - startTime,
                    success: !chrome.runtime.lastError,
                    response: response
                });
            });
        });
        promises.push(promise);
    }
    
    Promise.all(promises).then(results => {
        console.log("📈 Performance Results:");
        results.forEach(result => {
            console.log(`Attempt ${result.attempt}: ${result.responseTime.toFixed(2)}ms - ${result.success ? '✅' : '❌'}`);
        });
        
        const successfulAttempts = results.filter(r => r.success).length;
        console.log(`Success Rate: ${successfulAttempts}/5 (${(successfulAttempts/5*100).toFixed(1)}%)`);
    });
}

// Main verification function
async function runVerification() {
    console.log("Starting verification in 2 seconds...");
    
    setTimeout(async () => {
        try {
            // Step 1: Check content script
            const contentScriptOk = checkContentScript();
            
            // Step 2: Test communication (only if content script is loaded)
            if (contentScriptOk) {
                await testMessageCommunication();
                
                // Step 3: Check for errors
                checkForErrors();
                
                // Step 4: Performance test
                performanceTest();
            }
            
            console.log("\n🏁 Verification Complete!");
            console.log("Check the results above to verify the fixes are working.");
            
        } catch (error) {
            console.error("❌ Verification failed:", error);
        }
    }, 2000);
}

// Auto-run verification
runVerification();

// Export functions for manual testing
window.extensionVerification = {
    checkContentScript,
    testMessageCommunication,
    checkForErrors,
    performanceTest,
    runVerification
};

console.log("\n💡 Available Commands:");
console.log("- extensionVerification.runVerification() - Run full test");
console.log("- extensionVerification.checkContentScript() - Check script loading");
console.log("- extensionVerification.testMessageCommunication() - Test messaging");
console.log("- extensionVerification.performanceTest() - Test performance");
