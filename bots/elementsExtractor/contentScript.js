// Element AI Extractor - Content Script
// Handles element inspection, highlighting, and data extraction

// Enhanced loading protection - prevent duplicate script execution
if (window.aiExtractorLoaded) {
  console.log("Element AI Extractor: Content script already loaded, skipping initialization");
  // Script already loaded, exit early to prevent conflicts
  // The existing message listener is already active
  // Script already loaded, exit early to prevent conflicts
  // The existing message listener is already active
} else {
  window.aiExtractorLoaded = true;
  window.aiExtractorMessageListenerAdded = true; // Mark as added
  console.log("Element AI Extractor: Content script loading for the first time...");
  console.log("Element AI Extractor: Page URL:", window.location.href);
  console.log("Element AI Extractor: Frame type:", window === window.top ? 'main frame' : 'iframe');
  console.log("Element AI Extractor: User agent:", navigator.userAgent.substring(0, 100));
  
  // Comprehensive Chrome APIs check
  if (typeof chrome !== 'undefined' && chrome.runtime) {
    console.log("Element AI Extractor: Chrome runtime API available");
    console.log("Element AI Extractor: Extension ID:", chrome.runtime.id);
  } else {
    console.error("Element AI Extractor: Chrome runtime API not available!");
    console.error("Element AI Extractor: Chrome object:", typeof chrome);
  }

  // Global state for inspection mode
  let isInspecting = false;
  let currentHighlightedElement = null;
  let lastClickedElement = null;
  let storageCheckInterval = null;
  
  // Make inspection state globally accessible for duplicate script checking
  window.aiExtractorIsInspecting = false;

// Sync inspection state with storage periodically
function startStorageSync() {
  // Only run storage sync in the top-level frame
  if (window !== window.top) {
    return;
  }
  
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
      // console.warn("Element AI Extractor: Error during storage sync:", error);
      console.log('Element AI Extractor: Error during storage sync:', error);
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
    top: 20px !important;
    right: 20px !important;
    background: #ff6b35 !important;
    color: white !important;
    padding: 0 !important;
    border-radius: 12px !important;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
    font-size: 13px !important;
    font-weight: 600 !important;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
    z-index: 2147483647 !important;
    cursor: pointer !important;
    border: 2px solid #e55100 !important;
    user-select: none !important;
    max-width: 280px !important;
    animation: ai-extractor-pulse 2s infinite !important;
    overflow: hidden !important;
  }
  
  .ai-extractor-inspector-badge .badge-header {
    background: #ff6b35 !important;
    padding: 10px 12px !important;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    border-bottom: 1px solid #e55100 !important;
  }
  
  .ai-extractor-inspector-badge .badge-close {
    background: rgba(255, 255, 255, 0.2) !important;
    border-radius: 50% !important;
    width: 20px !important;
    height: 20px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    font-size: 12px !important;
    cursor: pointer !important;
    transition: background 0.2s !important;
  }
  
  .ai-extractor-inspector-badge .badge-close:hover {
    background: rgba(255, 255, 255, 0.3) !important;
  }
  
  .ai-extractor-inspector-badge .badge-status {
    padding: 8px 12px !important;
    background: #e55100 !important;
    font-size: 12px !important;
    text-align: center !important;
  }
  
  .ai-extractor-inspector-badge .badge-results {
    background: #2d3748 !important;
    color: #e2e8f0 !important;
    padding: 10px 12px !important;
    border-top: 1px solid #4a5568 !important;
    max-height: 200px !important;
    overflow-y: auto !important;
  }
  
  .ai-extractor-inspector-badge .badge-type {
    background: #38a169 !important;
    color: white !important;
    padding: 2px 6px !important;
    border-radius: 4px !important;
    font-size: 11px !important;
    display: inline-block !important;
    margin: 2px 0 !important;
  }
  
  .ai-extractor-inspector-badge .badge-locator {
    font-family: 'Monaco', 'Menlo', 'Consolas', monospace !important;
    font-size: 11px !important;
    color: #81e6d9 !important;
    display: block !important;
    margin: 2px 0 !important;
    word-break: break-all !important;
  }
  
  .ai-extractor-inspector-badge .badge-strength {
    color: #68d391 !important;
    font-size: 11px !important;
    font-weight: bold !important;
  }
  
  @keyframes ai-extractor-pulse {
    0% { opacity: 1; }
    50% { opacity: 0.9; }
    100% { opacity: 1; }
  }
  
  .ai-extractor-inspector-badge:hover {
    transform: scale(1.02) !important;
  }
`;

let inspectorBadge = null;

// Create floating inspector badge with enhanced functionality
function createInspectorBadge() {
  // Only create badge in the top-level frame to prevent duplicates
  if (window !== window.top) {
    return;
  }
  
  if (inspectorBadge) {
    return;
  }
  
  inspectorBadge = document.createElement('div');
  inspectorBadge.className = 'ai-extractor-inspector-badge';
  
  // Enhanced badge with expanded results section
  inspectorBadge.innerHTML = `
    <div class="badge-header">
      🔍 AI Inspector Active
      <div class="badge-close" title="Click to stop inspection">✕</div>
    </div>
    <div class="badge-status">Click elements to inspect</div>
    <div class="badge-content">
      <div class="badge-results" style="display: none;">
        <div class="badge-element-info">
          <div class="badge-element-name"></div>
          <div class="badge-element-type"></div>
        </div>
        <div class="badge-locators">
          <div class="badge-locator-item">
            <span class="badge-locator-label">Best:</span>
            <span class="badge-locator-value"></span>
          </div>
          <div class="badge-locator-item">
            <span class="badge-locator-label">Type:</span>
            <span class="badge-locator-type"></span>
          </div>
          <div class="badge-locator-item">
            <span class="badge-locator-label">Strength:</span>
            <span class="badge-locator-strength"></span>
          </div>
        </div>
        <div class="badge-actions">
          <button class="badge-copy-btn" title="Copy best locator">📋 Copy</button>
          <button class="badge-highlight-btn" title="Highlight element">👁️ Highlight</button>
        </div>
      </div>
    </div>
  `;
  
  inspectorBadge.title = 'AI Element Inspector is active. Click elements to inspect.';
  
  // Handle all badge clicks with single event listener using delegation
  inspectorBadge.addEventListener('click', (event) => {
    console.log("Element AI Extractor: Badge clicked, target:", event.target, "classList:", event.target.classList);
    event.preventDefault();
    event.stopPropagation();
    
    // Check target and closest elements for the classes
    const target = event.target;
    const closestClose = target.closest('.badge-close');
    const closestCopy = target.closest('.badge-copy-btn');
    const closestHighlight = target.closest('.badge-highlight-btn');
    
    // Handle close button click
    if (closestClose || target.classList.contains('badge-close')) {
      console.log("Element AI Extractor: Badge close clicked, stopping inspection");
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
      return;
    }
    
    // Handle copy button click
    if (closestCopy || target.classList.contains('badge-copy-btn')) {
      console.log("Element AI Extractor: Copy button clicked");
      const locatorValue = inspectorBadge.querySelector('.badge-locator-value');
      console.log("Element AI Extractor: Locator value element:", locatorValue);
      if (locatorValue && locatorValue.textContent && locatorValue.textContent !== 'N/A') {
        const textToCopy = locatorValue.title || locatorValue.textContent; // Use full text from title if available
        console.log("Element AI Extractor: Copying text:", textToCopy);
        copyToClipboard(textToCopy);
        const buttonElement = closestCopy || target;
        buttonElement.textContent = '✅ Copied';
        setTimeout(() => {
          buttonElement.textContent = '📋 Copy';
        }, 1500);
      } else {
        console.log("Element AI Extractor: No locator value to copy - locatorValue:", locatorValue, "textContent:", locatorValue?.textContent);
      }
      return;
    }
    
    // Handle highlight button click
    if (closestHighlight || target.classList.contains('badge-highlight-btn')) {
      console.log("Element AI Extractor: Highlight button clicked, lastClickedElement:", lastClickedElement);
      if (lastClickedElement) {
        // Highlight the last clicked element
        console.log("Element AI Extractor: Highlighting element:", lastClickedElement);
        highlightElement(lastClickedElement);
        const buttonElement = closestHighlight || target;
        buttonElement.textContent = '✨ Highlighted';
        setTimeout(() => {
          buttonElement.textContent = '👁️ Highlight';
        }, 1500);
      } else {
        console.log("Element AI Extractor: No element to highlight");
      }
      return;
    }
    
    console.log("Element AI Extractor: Click not handled - no matching class found");
  });
  
  // Add direct event listeners to buttons as backup
  setTimeout(() => {
    const copyBtn = inspectorBadge.querySelector('.badge-copy-btn');
    const highlightBtn = inspectorBadge.querySelector('.badge-highlight-btn');
    
    if (copyBtn) {
      copyBtn.addEventListener('click', (e) => {
        console.log("Element AI Extractor: Direct copy button click");
        e.stopPropagation();
        e.preventDefault();
        // Handle copy functionality directly instead of triggering recursion
        const locatorValue = inspectorBadge.querySelector('.badge-locator-value');
        if (locatorValue && locatorValue.textContent && locatorValue.textContent !== 'N/A') {
          const textToCopy = locatorValue.title || locatorValue.textContent;
          copyToClipboard(textToCopy);
          e.target.textContent = '✅ Copied';
          setTimeout(() => {
            e.target.textContent = '📋 Copy';
          }, 1500);
        }
      });
    }
    
    if (highlightBtn) {
      highlightBtn.addEventListener('click', (e) => {
        console.log("Element AI Extractor: Direct highlight button click");
        e.stopPropagation();
        e.preventDefault();
        // Handle highlight functionality directly instead of triggering recursion
        if (lastClickedElement) {
          highlightElement(lastClickedElement);
          e.target.textContent = '✨ Highlighted';
          setTimeout(() => {
            e.target.textContent = '👁️ Highlight';
          }, 1500);
        }
      });
    }
  }, 100);
  
  document.body.appendChild(inspectorBadge);
}

// Copy text to clipboard
function copyToClipboard(text) {
  console.log("Element AI Extractor: copyToClipboard called with text:", text);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        console.log("Element AI Extractor: Text copied to clipboard successfully");
      }).catch(err => {
        console.error("Element AI Extractor: Failed to copy text:", err);
        // Fallback method
        fallbackCopyTextToClipboard(text);
      });
    } else {
      console.log("Element AI Extractor: Clipboard API not available, using fallback");
      fallbackCopyTextToClipboard(text);
    }
  } catch (err) {
    console.error("Element AI Extractor: Clipboard API error:", err);
    fallbackCopyTextToClipboard(text);
  }
}

// Fallback copy method
function fallbackCopyTextToClipboard(text) {
  console.log("Element AI Extractor: Using fallback copy method for text:", text);
  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  textArea.style.top = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    const successful = document.execCommand('copy');
    console.log("Element AI Extractor: Fallback copy", successful ? "successful" : "failed");
  } catch (err) {
    console.error("Element AI Extractor: Fallback copy failed:", err);
  }
  
  document.body.removeChild(textArea);
}

// Update badge with inspection results
function updateBadgeWithResults(elementData) {
  console.log("Element AI Extractor: updateBadgeWithResults called with data:", elementData);
  if (!inspectorBadge) {
    console.log("Element AI Extractor: No inspector badge found");
    return;
  }
  
  const statusDiv = inspectorBadge.querySelector('.badge-status');
  const resultsDiv = inspectorBadge.querySelector('.badge-results');
  
  if (elementData) {
    // Update status
    statusDiv.textContent = '✅ Element Inspected! View details below';
    
    // Populate element info
    const nameDiv = inspectorBadge.querySelector('.badge-element-name');
    const typeDiv = inspectorBadge.querySelector('.badge-element-type');
    const locatorValue = inspectorBadge.querySelector('.badge-locator-value');
    const locatorType = inspectorBadge.querySelector('.badge-locator-type');
    const locatorStrength = inspectorBadge.querySelector('.badge-locator-strength');
    
    console.log("Element AI Extractor: Badge elements found:", {
      nameDiv, typeDiv, locatorValue, locatorType, locatorStrength
    });
    
    if (nameDiv) nameDiv.textContent = elementData['Element Name'] || 'Element';
    if (typeDiv) typeDiv.textContent = elementData['Element Type'] || 'N/A';
    if (locatorValue) {
      const bestLocator = elementData['Best Locator'] || 'N/A';
      locatorValue.textContent = bestLocator.length > 40 ? bestLocator.substring(0, 40) + '...' : bestLocator;
      locatorValue.title = bestLocator;
      console.log("Element AI Extractor: Set locator value:", locatorValue.textContent, "title:", locatorValue.title);
    }
    if (locatorType) locatorType.textContent = elementData['Locator Type'] || 'N/A';
    if (locatorStrength) locatorStrength.textContent = `${elementData['Strength'] || 'N/A'}%`;
    
    // Show results and keep them visible
    resultsDiv.style.display = 'block';
    
    // Store element data for actions
    inspectorBadge.elementData = elementData;
    console.log("Element AI Extractor: Stored element data on badge:", inspectorBadge.elementData);
    
  } else {
    statusDiv.textContent = 'Click elements to inspect';
    resultsDiv.style.display = 'none';
    console.log("Element AI Extractor: No element data provided, hiding results");
  }
}

// Remove floating inspector badge
function removeInspectorBadge() {
  if (inspectorBadge && inspectorBadge.parentNode) {
    inspectorBadge.parentNode.removeChild(inspectorBadge);
    inspectorBadge = null;
  }
}

// Inject styles into all shadow roots
function injectStylesIntoShadowRoots(rootNode = document) {
  // Find all elements with shadow roots
  const allElements = rootNode.querySelectorAll('*');
  
  allElements.forEach(element => {
    if (element.shadowRoot) {
      // Inject styles into this shadow root
      const existingShadowStyle = element.shadowRoot.getElementById('ai-extractor-shadow-styles');
      if (existingShadowStyle) {
        existingShadowStyle.remove();
      }
      
      const shadowStyleElement = document.createElement('style');
      shadowStyleElement.id = 'ai-extractor-shadow-styles';
      shadowStyleElement.textContent = HIGHLIGHT_STYLES;
      element.shadowRoot.appendChild(shadowStyleElement);
      
      // Recursively inject into nested shadow roots
      injectStylesIntoShadowRoots(element.shadowRoot);
    }
  });
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
  
  // Also inject styles into all shadow roots
  injectStylesIntoShadowRoots();
}

// Remove CSS styles from shadow roots
function removeStylesFromShadowRoots(rootNode = document) {
  const allElements = rootNode.querySelectorAll('*');
  
  allElements.forEach(element => {
    if (element.shadowRoot) {
      const shadowStyleElement = element.shadowRoot.getElementById('ai-extractor-shadow-styles');
      if (shadowStyleElement) {
        shadowStyleElement.remove();
      }
      
      // Recursively remove from nested shadow roots
      removeStylesFromShadowRoots(element.shadowRoot);
    }
  });
}

// Remove CSS styles
function removeStyles() {
  const styleElement = document.getElementById('ai-extractor-styles');
  if (styleElement) {
    styleElement.remove();
  }
  
  // Also remove styles from all shadow roots
  removeStylesFromShadowRoots();
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

// Remove all highlights from shadow roots
function removeAllHighlightsFromShadowRoots(rootNode = document) {
  const allElements = rootNode.querySelectorAll('*');
  
  allElements.forEach(element => {
    if (element.shadowRoot) {
      const shadowHighlightedElements = element.shadowRoot.querySelectorAll('.ai-extractor-highlight');
      shadowHighlightedElements.forEach(el => {
        el.classList.remove('ai-extractor-highlight');
      });
      
      // Recursively remove from nested shadow roots
      removeAllHighlightsFromShadowRoots(element.shadowRoot);
    }
  });
}

// Remove all highlights
function removeAllHighlights() {
  const highlightedElements = document.querySelectorAll('.ai-extractor-highlight');
  highlightedElements.forEach(el => {
    el.classList.remove('ai-extractor-highlight');
  });
  
  // Also remove highlights from all shadow roots
  removeAllHighlightsFromShadowRoots();
  
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
    'Host Element Path': getShadowHostPath(element),
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
  // Helper function to check if ID contains special CSS characters
  function hasSpecialCssChars(id) {
    return /[.()[\]{}+~>,:;#@$%^&*=!|\\/"'`\s]/.test(id);
  }
  
  const locators = {};
  
  // ID selector
  if (element.id) {
    // Use attribute selector for complex IDs with special characters
    if (hasSpecialCssChars(element.id)) {
      locators.id = `[id="${element.id}"]`;
    } else {
      locators.id = `#${element.id}`;
    }
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
  // Helper function to check if ID contains special CSS characters
  function hasSpecialCssChars(id) {
    return /[.()[\]{}+~>,:;#@$%^&*=!|\\/"'`\s]/.test(id);
  }
  
  if (element.id) {
    // Use attribute selector for complex IDs with special characters
    if (hasSpecialCssChars(element.id)) {
      return `[id="${element.id}"]`;
    }
    return `#${element.id}`;
  }
  
  const parts = [];
  let current = element;
  
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    
    if (current.id) {
      // Use attribute selector for complex IDs with special characters
      if (hasSpecialCssChars(current.id)) {
        selector = `[id="${current.id}"]`;
      } else {
        selector += `#${current.id}`;
      }
      parts.unshift(selector);
      break;
    }
    
    if (current.className && typeof current.className === 'string') {
      const classes = current.className.split(' ')
        .filter(c => c.trim() && !c.startsWith('ai-extractor-'));
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
  if (!element) return false;
  
  // Use getRootNode if available (modern approach)
  if (element.getRootNode) {
    const root = element.getRootNode();
    return root instanceof ShadowRoot;
  }
  
  // Fallback to parent traversal
  let parent = element.parentNode;
  while (parent) {
    if (parent.toString() === '[object ShadowRoot]') {
      return true;
    }
    parent = parent.parentNode;
  }
  return false;
}

// Get shadow DOM host path for an element
function getShadowHostPath(element) {
  if (!element || !isInShadowDOM(element)) {
    return '';
  }
  
  const hostPath = [];
  let current = element;
  
  while (current) {
    const root = current.getRootNode ? current.getRootNode() : null;
    
    if (root instanceof ShadowRoot && root.host) {
      // Found a shadow host, add its selector to the path
      const hostSelector = generateCSSSelector(root.host);
      hostPath.unshift(hostSelector);
      current = root.host;
    } else {
      break;
    }
  }
  
  return hostPath.join(' >> ');
}

// Start inspection mode
function startInspection() {
  // Only allow inspection to start in the top-level frame
  if (window !== window.top) {
    return { status: 'ignored_frame' };
  }
  
  if (isInspecting) {
    console.log("Element AI Extractor: Already in inspection mode");
    return { status: 'listening' };
  }
  
  console.log("Element AI Extractor: Starting inspection mode");
  isInspecting = true;
  window.aiExtractorIsInspecting = true; // Update global state
  
  // Start syncing with storage
  startStorageSync();
  
  // Inject styles (including into shadow roots)
  injectStyles();
  
  // Set up shadow DOM observer for dynamic content
  setupShadowDOMObserver();
  
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

// Set up observer for dynamically added shadow DOM content
function setupShadowDOMObserver() {
  if (window.aiExtractorShadowObserver) {
    window.aiExtractorShadowObserver.disconnect();
  }
  
  window.aiExtractorShadowObserver = new MutationObserver((mutations) => {
    let needsStyleRefresh = false;
    
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          // Check if the added node has shadow roots or is inside a shadow root
          if (node.shadowRoot) {
            needsStyleRefresh = true;
          }
          
          // Check if any child elements have shadow roots
          const shadowElements = node.querySelectorAll && node.querySelectorAll('*') || [];
          for (let element of shadowElements) {
            if (element.shadowRoot) {
              needsStyleRefresh = true;
              break;
            }
          }
        }
      });
    });
    
    if (needsStyleRefresh) {
      console.log("Element AI Extractor: Detected new shadow DOM content, refreshing styles");
      injectStylesIntoShadowRoots();
    }
  });
  
  window.aiExtractorShadowObserver.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Stop inspection mode
function stopInspection() {
  if (!isInspecting) {
    console.log("Element AI Extractor: Not in inspection mode");
    return { status: 'stopped' };
  }
  
  console.log("Element AI Extractor: Stopping inspection mode");
  isInspecting = false;
  window.aiExtractorIsInspecting = false; // Update global state
  
  // Clear storage state IMMEDIATELY to prevent sync conflicts
  try {
    chrome.storage.local.set({ isInspecting: false });
  } catch (error) {
    console.warn("Element AI Extractor: Error clearing storage state:", error);
  }
  
  // Stop syncing with storage
  stopStorageSync();
  
  // Disconnect shadow DOM observer
  if (window.aiExtractorShadowObserver) {
    window.aiExtractorShadowObserver.disconnect();
    window.aiExtractorShadowObserver = null;
  }
  
  // Remove floating badge
  removeInspectorBadge();
  
  // Remove event listeners
  document.removeEventListener('mouseover', handleMouseOver, true);
  document.removeEventListener('mouseout', handleMouseOut, true);
  document.removeEventListener('click', handleClick, true);
  
  // Remove highlights and styles (including from shadow roots)
  removeAllHighlights();
  document.body.classList.remove('ai-extractor-inspecting');
  removeStyles();
  
  return { status: 'stopped' };
}

// Track currently highlighted element
let currentlyHighlightedElement = null;

// Get the actual element under the mouse, including shadow DOM elements
function getElementFromPoint(x, y) {
  let element = document.elementFromPoint(x, y);
  
  // Traverse into shadow DOM if the element has shadow root
  while (element && element.shadowRoot) {
    const shadowElement = element.shadowRoot.elementFromPoint(x, y);
    if (shadowElement && shadowElement !== element) {
      element = shadowElement;
    } else {
      break;
    }
  }
  
  return element;
}

// Get the deepest element under mouse coordinates, traversing shadow DOM
function getDeepElementFromPoint(x, y) {
  let element = document.elementFromPoint(x, y);
  
  // Keep going deeper into shadow DOMs
  while (element) {
    if (element.shadowRoot) {
      const shadowElement = element.shadowRoot.elementFromPoint(x, y);
      if (shadowElement && shadowElement !== element) {
        element = shadowElement;
        continue;
      }
    }
    break;
  }
  
  return element;
}

// Handle mouse over events
function handleMouseOver(event) {
  if (!isInspecting) return;
  
  event.stopPropagation();
  
  // Get the actual element under the mouse, including shadow DOM elements
  const actualElement = getDeepElementFromPoint(event.clientX, event.clientY);
  const element = actualElement || event.target;
  
  console.log("Element AI Extractor: Mouse over", {
    originalTarget: event.target,
    actualElement: actualElement,
    finalElement: element,
    inShadowDOM: isInShadowDOM(element)
  });
  
  // Don't highlight body or html
  if (element === document.body || element === document.documentElement) {
    return;
  }
  
  // Only update highlight if this is a different element
  if (element !== currentlyHighlightedElement) {
    // Remove highlight from previous element
    if (currentlyHighlightedElement) {
      removeHighlight(currentlyHighlightedElement);
    }
    
    // Highlight new element
    highlightElement(element);
    currentlyHighlightedElement = element;
  }
}

// Handle mouse out events
function handleMouseOut(event) {
  if (!isInspecting) return;
  
  event.stopPropagation();
  // Keep highlight until hovering over a different element
  // This creates the persistence behavior requested
}

// Handle click events
function handleClick(event) {
  if (!isInspecting) return;
  
  // Get the actual element under the mouse, including shadow DOM elements
  const actualElement = getDeepElementFromPoint(event.clientX, event.clientY);
  const element = actualElement || event.target;
  
  console.log("Element AI Extractor: Element clicked", {
    originalTarget: event.target,
    actualElement: actualElement,
    finalElement: element,
    inShadowDOM: isInShadowDOM(element)
  });
  
  // Don't process body or html clicks
  if (element === document.body || element === document.documentElement) {
    return;
  }
  
  // Don't process clicks on our own inspector badge - but allow button clicks to pass through
  if (element.classList.contains('ai-extractor-inspector-badge') || 
      element.closest('.ai-extractor-inspector-badge')) {
    console.log("Element AI Extractor: Badge click detected");
    
    // If it's a button click inside the badge, don't prevent it
    if (element.classList.contains('badge-copy-btn') || 
        element.classList.contains('badge-highlight-btn') ||
        element.classList.contains('badge-close')) {
      console.log("Element AI Extractor: Badge button click, allowing it to proceed");
      return; // Let the button click proceed normally
    }
    
    // For other badge clicks, prevent element processing
    console.log("Element AI Extractor: Non-button badge click, skipping element processing");
    event.preventDefault();
    event.stopPropagation();
    return;
  }
  
  // For all other clicks during inspection, prevent default behavior
  event.preventDefault();
  event.stopPropagation();
  
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
    
    // Update badge with results
    updateBadgeWithResults(elementData);
    
    // Keep inspection mode active - don't stop automatically
    // User needs to manually click "Stop Inspecting"
    lastClickedElement = element;
  }
}

// Message listener for communication with popup
console.log("Element AI Extractor: Setting up message listener");

// Test the message listener setup
setTimeout(() => {
  console.log("Element AI Extractor: Message listener should be active now");
  console.log("Element AI Extractor: chrome.runtime available:", !!chrome.runtime);
  console.log("Element AI Extractor: chrome.runtime.onMessage available:", !!chrome.runtime?.onMessage);
}, 100);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Element AI Extractor: Content script received message", message);
    console.log("Element AI Extractor: Sender:", sender);
    console.log("Element AI Extractor: Will send response via sendResponse function");
    
    try {
      // Validate message structure
      if (!message || typeof message !== 'object') {
        console.warn("Element AI Extractor: Invalid message received", message);
        sendResponse({ status: 'error', message: 'Invalid message format' });
        return true;      }

      switch (message.action) {
        case 'ping':
          console.log("Element AI Extractor: Responding to ping with alive status");
          const response = { 
            status: 'alive', 
            inspecting: window.aiExtractorIsInspecting || false, 
            timestamp: Date.now(),
            frameType: window === window.top ? 'main' : 'iframe',
            url: window.location.href,
            readyState: document.readyState,
            scriptLoaded: window.aiExtractorLoaded || false,
            contentScriptVersion: '1.0.1'
          };
          console.log("Element AI Extractor: Ping response:", response);
          // Ensure immediate response
          try {
            sendResponse(response);
          } catch (responseError) {
            console.error("Element AI Extractor: Error sending ping response:", responseError);
          }
          return true; // Keep channel open
        
      case 'startInspectingAiExtractor':
        console.log("Element AI Extractor: Starting inspection");
        try {
          const startResult = startInspection();
          sendResponse(startResult);
        } catch (error) {
          console.error("Element AI Extractor: Error starting inspection:", error);
          sendResponse({ status: 'error', message: 'Failed to start inspection: ' + error.message });
        }
        return true; // Keep channel open
        
      case 'stopInspectingAiExtractor':
        console.log("Element AI Extractor: Stopping inspection");
        try {
          const stopResult = stopInspection();
          sendResponse(stopResult);
        } catch (error) {
          console.error("Element AI Extractor: Error stopping inspection:", error);
          sendResponse({ status: 'error', message: 'Failed to stop inspection: ' + error.message });
        }
        return true; // Keep channel open
        
      default:
        console.log("Element AI Extractor: Unknown message action", message.action);
        sendResponse({ status: 'error', message: 'Unknown action: ' + (message.action || 'undefined') });
        return true; // Keep channel open
    }
  } catch (error) {
    console.error("Element AI Extractor: Error in message listener:", error);
    try {
      sendResponse({ status: 'error', message: 'Message handler error: ' + error.message });
    } catch (responseError) {
      console.error("Element AI Extractor: Could not send error response:", responseError);
    }
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

// Send a signal to indicate the script has loaded successfully
try {
  chrome.runtime.sendMessage({ action: 'contentScriptLoaded', url: window.location.href }, (response) => {
    if (chrome.runtime.lastError) {
      console.log("Element AI Extractor: Could not notify popup of script load (expected if popup closed)");
    } else {
      console.log("Element AI Extractor: Successfully notified popup of script load");
    }
  });
} catch (error) {
  console.log("Element AI Extractor: Error sending load notification:", error);
}

} // End of else block (script loading check)
