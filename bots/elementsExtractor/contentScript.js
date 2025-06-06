// Element AI Extractor - Content Script
// Handles element inspection, highlighting, and data extraction

// Prevent multiple script loading
if (window.aiExtractorLoaded) {
  console.log("Element AI Extractor: Content script already loaded, skipping");
} else {
  window.aiExtractorLoaded = true;
  console.log("Element AI Extractor: Content script loaded");

  // Global state for inspection mode
  let isInspecting = false;
  let currentHighlightedElement = null;
  let lastClickedElement = null;
  let storageCheckInterval = null;

// Sync inspection state with storage periodically
function startStorageSync() {
  if (storageCheckInterval) {
    clearInterval(storageCheckInterval);
  }
  
  storageCheckInterval = setInterval(async () => {
    try {
      const result = await chrome.storage.local.get(['isInspecting']);
      const storageInspecting = result.isInspecting || false;
      
      // If storage says we should not be inspecting but we are, stop
      if (isInspecting && !storageInspecting) {
        console.log("Element AI Extractor: Storage sync detected inspection should stop");
        stopInspection();
      }
      // If storage says we should be inspecting but we're not, start
      else if (!isInspecting && storageInspecting) {
        console.log("Element AI Extractor: Storage sync detected inspection should start");
        startInspection();
      }
    } catch (error) {
      console.warn("Element AI Extractor: Error during storage sync:", error);
    }
  }, 1000); // Check every second
}

function stopStorageSync() {
  if (storageCheckInterval) {
    clearInterval(storageCheckInterval);
    storageCheckInterval = null;
  }
}

// CSS for highlighting and cursor changes
const HIGHLIGHT_STYLES = `
  .ai-extractor-highlight {
    outline: 3px dashed #ff6b35 !important;
    outline-offset: 2px !important;
    background: rgba(255, 107, 53, 0.1) !important;
    position: relative !important;
    z-index: 999999 !important;
  }
  
  .ai-extractor-highlight::after {
    content: '🔍 AI Extractor';
    position: absolute !important;
    top: -25px !important;
    left: 0 !important;
    background: #ff6b35 !important;
    color: white !important;
    padding: 2px 8px !important;
    font-size: 11px !important;
    font-family: Arial, sans-serif !important;
    border-radius: 3px !important;
    z-index: 1000000 !important;
    pointer-events: none !important;
    white-space: nowrap !important;
  }
  
  body.ai-extractor-inspecting {
    cursor: crosshair !important;
  }
  
  body.ai-extractor-inspecting * {
    cursor: crosshair !important;
  }
  
  .ai-extractor-inspector-badge {
    position: fixed !important;
    top: 10px !important;
    right: 10px !important;
    background: #ff6b35 !important;
    color: white !important;
    padding: 8px 12px !important;
    border-radius: 6px !important;
    font-family: Arial, sans-serif !important;
    font-size: 12px !important;
    font-weight: bold !important;
    z-index: 2147483647 !important;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
    cursor: pointer !important;
    user-select: none !important;
    animation: ai-extractor-pulse 2s infinite !important;
  }
  
  @keyframes ai-extractor-pulse {
    0% { opacity: 1; }
    50% { opacity: 0.7; }
    100% { opacity: 1; }
  }
  
  .ai-extractor-inspector-badge:hover {
    background: #e55a2b !important;
    transform: scale(1.05) !important;
  }
`;

let inspectorBadge = null;

// Create floating inspector badge
function createInspectorBadge() {
  if (inspectorBadge) {
    return;
  }
  
  inspectorBadge = document.createElement('div');
  inspectorBadge.className = 'ai-extractor-inspector-badge';
  inspectorBadge.innerHTML = '🔍 AI Inspector Active<br><small>Click to stop</small>';
  inspectorBadge.title = 'AI Element Inspector is active. Click to stop inspection.';
  
  inspectorBadge.addEventListener('click', (event) => {
    console.log("Element AI Extractor: Badge clicked, stopping inspection");
    event.preventDefault();
    event.stopPropagation();
    
    stopInspection();
    // Clear storage state to ensure popup knows we stopped
    chrome.storage.local.set({ isInspecting: false });
    // Send message to popup if it's open
    chrome.runtime.sendMessage({
      action: "inspectionStoppedFromBadge"
    }, (response) => {
      if (chrome.runtime.lastError) {
        // Popup might be closed, that's okay
        console.log("Element AI Extractor: No popup open to notify");
      }
    });
  });
  
  document.body.appendChild(inspectorBadge);
}

// Remove floating inspector badge
function removeInspectorBadge() {
  if (inspectorBadge && inspectorBadge.parentNode) {
    inspectorBadge.parentNode.removeChild(inspectorBadge);
    inspectorBadge = null;
  }
}

// Inject CSS styles for highlighting
function injectStyles() {
  const existingStyle = document.getElementById('ai-extractor-styles');
  if (existingStyle) {
    existingStyle.remove();
  }
  
  const styleElement = document.createElement('style');
  styleElement.id = 'ai-extractor-styles';
  styleElement.textContent = HIGHLIGHT_STYLES;
  document.head.appendChild(styleElement);
}

// Remove CSS styles
function removeStyles() {
  const styleElement = document.getElementById('ai-extractor-styles');
  if (styleElement) {
    styleElement.remove();
  }
}

// Highlight element on hover
function highlightElement(element) {
  if (currentHighlightedElement && currentHighlightedElement !== element) {
    currentHighlightedElement.classList.remove('ai-extractor-highlight');
  }
  
  if (element && element !== document.body && element !== document.documentElement) {
    element.classList.add('ai-extractor-highlight');
    currentHighlightedElement = element;
  }
}

// Remove highlight from element
function removeHighlight(element) {
  if (element) {
    element.classList.remove('ai-extractor-highlight');
  }
  if (currentHighlightedElement === element) {
    currentHighlightedElement = null;
  }
}

// Remove all highlights
function removeAllHighlights() {
  const highlightedElements = document.querySelectorAll('.ai-extractor-highlight');
  highlightedElements.forEach(el => {
    el.classList.remove('ai-extractor-highlight');
  });
  currentHighlightedElement = null;
}

// Get element details for inspection
function getElementDetails(element) {
  if (!element || element === document || element === document.body) {
    return null;
  }

  const tagName = element.tagName.toLowerCase();
  const elementType = getElementType(element);
  const locators = generateLocators(element);
  const bestLocator = getBestLocator(locators);
  
  return {
    'Element Name': getElementName(element),
    'Element Type': elementType,
    'Best Locator': bestLocator.locator,
    'Locator Type': bestLocator.type,
    'Strength': bestLocator.strength,
    'ID': element.id || 'N/A',
    'CSS': locators.css,
    'XPATH': locators.xpath,
    'In Shadow DOM': isInShadowDOM(element) ? 'Yes' : 'No',
    'Tag Name': tagName,
    'Class': element.className || 'N/A',
    'Text': (element.textContent || '').trim().substring(0, 100) || 'N/A'
  };
}

// Get element name (text content, placeholder, alt, title, etc.)
function getElementName(element) {
  // Try different attributes for a meaningful name
  const name = element.getAttribute('aria-label') ||
               element.getAttribute('title') ||
               element.getAttribute('placeholder') ||
               element.getAttribute('alt') ||
               element.getAttribute('name') ||
               (element.textContent || '').trim();
  
  return name ? name.substring(0, 50) : element.tagName.toLowerCase();
}

// Determine element type
function getElementType(element) {
  const tagName = element.tagName.toLowerCase();
  const type = element.type;
  const role = element.getAttribute('role');
  
  if (tagName === 'a') return 'Link';
  if (tagName === 'button' || type === 'button' || type === 'submit') return 'Button';
  if (tagName === 'input') {
    if (type === 'text' || type === 'email' || type === 'password') return 'Text Input';
    if (type === 'checkbox') return 'Checkbox';
    if (type === 'radio') return 'Radio Button';
    return 'Input';
  }
  if (tagName === 'select') return 'Dropdown';
  if (tagName === 'textarea') return 'Text Area';
  if (tagName === 'img') return 'Image';
  if (tagName === 'form') return 'Form';
  if (tagName === 'iframe') return 'IFrame';
  if (role) return `${role} (role)`;
  
  return tagName.charAt(0).toUpperCase() + tagName.slice(1);
}

// Generate different locator strategies
function generateLocators(element) {
  const locators = {};
  
  // ID selector
  if (element.id) {
    locators.id = `#${element.id}`;
  }
  
  // CSS selector
  locators.css = generateCSSSelector(element);
  
  // XPath
  locators.xpath = generateXPath(element);
  
  // Name attribute
  if (element.name) {
    locators.name = `[name="${element.name}"]`;
  }
  
  // Aria-label
  if (element.getAttribute('aria-label')) {
    locators.ariaLabel = `[aria-label="${element.getAttribute('aria-label')}"]`;
  }
  
  return locators;
}

// Generate CSS selector
function generateCSSSelector(element) {
  if (element.id) {
    return `#${element.id}`;
  }
  
  const parts = [];
  let current = element;
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      selector += `#${current.id}`;
      parts.unshift(selector);
      break;
    }
    
    if (current.className) {
      const classes = current.className.split(' ').filter(c => c.trim());
      if (classes.length > 0) {
        selector += '.' + classes.join('.');
      }
    }
    
    // Add nth-child if needed for uniqueness
    const siblings = Array.from(current.parentNode?.children || [])
      .filter(el => el.tagName === current.tagName);
    if (siblings.length > 1) {
      const index = siblings.indexOf(current) + 1;
      selector += `:nth-child(${index})`;
    }
    
    parts.unshift(selector);
    current = current.parentElement;
    
    if (parts.length > 5) break; // Limit depth
  }
  
  return parts.join(' > ');
}

// Generate XPath
function generateXPath(element) {
  if (element.id) {
    return `//*[@id="${element.id}"]`;
  }
  
  const parts = [];
  let current = element;
  
  while (current && current !== document.body) {
    let part = current.tagName.toLowerCase();
    
    if (current.id) {
      part = `*[@id="${current.id}"]`;
      parts.unshift(part);
      break;
    }
    
    // Count siblings of same tag
    const siblings = Array.from(current.parentNode?.children || [])
      .filter(el => el.tagName === current.tagName);
    if (siblings.length > 1) {
      const index = siblings.indexOf(current) + 1;
      part += `[${index}]`;
    }
    
    parts.unshift(part);
    current = current.parentElement;
    
    if (parts.length > 8) break; // Limit depth
  }
  
  return '//' + parts.join('/');
}

// Determine best locator based on reliability
function getBestLocator(locators) {
  // Priority order: ID > Name > Aria-label > CSS > XPath
  if (locators.id) {
    return { locator: locators.id, type: 'ID', strength: 95 };
  }
  
  if (locators.name) {
    return { locator: locators.name, type: 'Name', strength: 85 };
  }
  
  if (locators.ariaLabel) {
    return { locator: locators.ariaLabel, type: 'Aria-label', strength: 80 };
  }
  
  if (locators.css && locators.css.length < 100) {
    return { locator: locators.css, type: 'CSS', strength: 70 };
  }
  
  if (locators.xpath && locators.xpath.length < 150) {
    return { locator: locators.xpath, type: 'XPath', strength: 60 };
  }
  
  // Fallback to CSS even if long
  return { locator: locators.css || locators.xpath, type: 'CSS', strength: 50 };
}

// Check if element is in shadow DOM
function isInShadowDOM(element) {
  let parent = element.parentNode;
  while (parent) {
    if (parent.toString() === '[object ShadowRoot]') {
      return true;
    }
    parent = parent.parentNode;
  }
  return false;
}

// Start inspection mode
function startInspection() {
  if (isInspecting) {
    console.log("Element AI Extractor: Already in inspection mode");
    return { status: 'listening' };
  }
  
  console.log("Element AI Extractor: Starting inspection mode");
  isInspecting = true;
  
  // Start syncing with storage
  startStorageSync();
  
  // Inject styles
  injectStyles();
  
  // Add cursor style to body
  document.body.classList.add('ai-extractor-inspecting');
  
  // Create floating badge for user guidance
  createInspectorBadge();
  
  // Add event listeners
  document.addEventListener('mouseover', handleMouseOver, true);
  document.addEventListener('mouseout', handleMouseOut, true);
  document.addEventListener('click', handleClick, true);
  
  return { status: 'listening' };
}

// Stop inspection mode
function stopInspection() {
  if (!isInspecting) {
    console.log("Element AI Extractor: Not in inspection mode");
    return { status: 'stopped' };
  }
  
  console.log("Element AI Extractor: Stopping inspection mode");
  isInspecting = false;
  
  // Clear storage state IMMEDIATELY to prevent sync conflicts
  try {
    chrome.storage.local.set({ isInspecting: false });
  } catch (error) {
    console.warn("Element AI Extractor: Error clearing storage state:", error);
  }
  
  // Stop syncing with storage
  stopStorageSync();
  
  // Remove floating badge
  removeInspectorBadge();
  
  // Remove event listeners
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('mouseout', handleMouseOut, true);
  document.removeEventListener('click', handleClick, true);
  
  // Remove highlights and styles
  removeAllHighlights();
  document.body.classList.remove('ai-extractor-inspecting');
  removeStyles();
  
  return { status: 'stopped' };
}

// Handle mouse over events
function handleMouseOver(event) {
  if (!isInspecting) return;
  
  event.stopPropagation();
  const element = event.target;
  
  // Don't highlight body or html
  if (element === document.body || element === document.documentElement) {
    return;
  }
  
  highlightElement(element);
}

// Handle mouse out events
function handleMouseOut(event) {
  if (!isInspecting) return;
  
  event.stopPropagation();
  // Don't remove highlight on mouseout - keep it until mouseover on new element
}

// Handle click events
function handleClick(event) {
  if (!isInspecting) return;
  
  event.preventDefault();
  event.stopPropagation();
  
  const element = event.target;
  console.log("Element AI Extractor: Element clicked", element);
  
  // Don't process body or html clicks
  if (element === document.body || element === document.documentElement) {
    return;
  }
  
  // Don't process clicks on our own inspector badge
  if (element.classList.contains('ai-extractor-inspector-badge') || 
      element.closest('.ai-extractor-inspector-badge')) {
    console.log("Element AI Extractor: Badge click detected, skipping element processing");
    return;
  }
  
  // Get element details
  const elementData = getElementDetails(element);
  
  if (elementData) {
    console.log("Element AI Extractor: Sending element data to popup", elementData);
    
    // Store the data in chrome storage for persistence
    const inspectedData = {
      data: elementData,
      timestamp: Date.now(),
      url: window.location.href
    };
    
    try {
      chrome.storage.local.set({ 
        lastInspectedElement: inspectedData 
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Element AI Extractor: Error storing element data:", chrome.runtime.lastError.message);
        } else {
          console.log("Element AI Extractor: Element data stored successfully");
        }
      });
    } catch (error) {
      console.error("Element AI Extractor: Error accessing storage:", error);
    }
    
    // Try to send to popup if it's open, but don't rely on it
    chrome.runtime.sendMessage({
      action: "inspectedElementDataAiExtractor",
      data: elementData
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Element AI Extractor: Popup closed - data stored in storage instead");
      } else {
        console.log("Element AI Extractor: Successfully sent element data to popup");
      }
    });
    
    // Keep inspection mode active - don't stop automatically
    // User needs to manually click "Stop Inspecting"
    lastClickedElement = element;
  }
}

// Message listener for communication with popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Element AI Extractor: Content script received message", message);
  
  try {
    switch (message.action) {
      case 'ping':
        console.log("Element AI Extractor: Responding to ping");
        sendResponse({ status: 'alive', inspecting: isInspecting, timestamp: Date.now() });
        return true; // Keep channel open
        
      case 'startInspectingAiExtractor':
        console.log("Element AI Extractor: Starting inspection");
        const startResult = startInspection();
        sendResponse(startResult);
        return true; // Keep channel open
        
      case 'stopInspectingAiExtractor':
        console.log("Element AI Extractor: Stopping inspection");
        const stopResult = stopInspection();
        sendResponse(stopResult);
        return true; // Keep channel open
        
      default:
        console.log("Element AI Extractor: Unknown message action", message.action);
        sendResponse({ status: 'error', message: 'Unknown action' });
        return true; // Keep channel open
    }
  } catch (error) {
    console.error("Element AI Extractor: Error handling message:", error);
    sendResponse({ status: 'error', message: error.message });
    return true; // Keep channel open
  }
});

// Cleanup when page unloads
window.addEventListener('beforeunload', () => {
  if (isInspecting) {
    stopInspection();
  }
});

// Initialize storage sync on load
startStorageSync();

console.log("Element AI Extractor: Content script ready");

} // End of script loading check
