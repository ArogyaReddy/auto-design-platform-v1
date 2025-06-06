// Element AI Extractor - Connection Test Script
// Run this in the browser console to test extension connectivity

console.log("🔍 Element AI Extractor - Connection Test Starting...");

// Test 1: Check if content script is loaded
if (window.aiExtractorLoaded) {
  console.log("✅ Content script loaded flag found");
} else {
  console.log("❌ Content script loaded flag not found");
}

// Test 2: Check for chrome extension APIs
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log("✅ Chrome runtime API available");
  
  // Test 3: Try to send a message to the extension
  if (chrome.runtime.sendMessage) {
    console.log("✅ Chrome sendMessage API available");
    
    // Try sending a test message
    try {
      chrome.runtime.sendMessage({
        action: "ping",
        test: true
      }, (response) => {
        if (chrome.runtime.lastError) {
          console.log("❌ Message error:", chrome.runtime.lastError.message);
        } else {
          console.log("✅ Message response:", response);
        }
      });
    } catch (error) {
      console.log("❌ Error sending message:", error);
    }
  } else {
    console.log("❌ Chrome sendMessage API not available");
  }
} else {
  console.log("❌ Chrome runtime API not available");
}

// Test 4: Check for AI Extractor specific elements
const badge = document.querySelector('.ai-extractor-inspector-badge');
if (badge) {
  console.log("✅ AI Extractor inspector badge found");
} else {
  console.log("ℹ️ AI Extractor inspector badge not found (normal if not inspecting)");
}

// Test 5: Check for styles
const styles = document.querySelector('style[data-ai-extractor]');
if (styles) {
  console.log("✅ AI Extractor styles injected");
} else {
  console.log("ℹ️ AI Extractor styles not injected (normal if not inspecting)");
}

console.log("🔍 Element AI Extractor - Connection Test Complete");
console.log("Copy and paste the results above to help diagnose connection issues");
