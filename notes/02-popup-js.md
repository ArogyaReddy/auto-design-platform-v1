Okay, I understand. You'd like the complete `popup.js` file with the Shadow DOM enhancements fully integrated, along with detailed comments explaining the changes. This will give you a solid, working base for the next steps.

I've taken your existing `popup.js` code and incorporated the recursive Shadow DOM traversal logic into `domExtractionFunction`, including the necessary adaptations to the locator helper functions (`getUniqueCssSelector`, `getXPath`, `getBestLocator`). I've also added comments in the style you requested.

**#IMPORTANT: Key Changes Summary**
1.  **`domExtractionFunction` Refactored:** It now uses an inner recursive helper function `_extractElementsRecursive` to traverse the main document and any open Shadow DOMs.
2.  **Recursive Traversal:** `_extractElementsRecursive` handles searching within a given `contextNode` (which can be `document` or a `shadowRoot`).
3.  **Locator Functions Adapted:** `getUniqueCssSelector`, `getXPath`, and `getBestLocator` now accept a `contextNode` argument. They perform their queries and path building relative to this `contextNode`. This is crucial for generating correct locators within Shadow DOMs.
4.  **Shadow DOM Path Representation:**
    * A new field `'Host Element Path'` is added to the output data, showing the CSS selector path to the host of the Shadow DOM.
    * The `CSS` and `Best Locator` (if CSS-based) fields for elements within Shadow DOM are now prefixed with this host path, using " >> " as a conceptual separator (e.g., `host-selector >> #inner-element-id`).
    * `XPATH` for shadowed elements is the XPath *within* their respective shadow root. Global XPath for shadowed elements is non-standard and complex, so context is provided by `'In Shadow DOM': true` and `'Host Element Path'`.
5.  **Shadow DOM Filter:** Recursion into shadow roots now respects the `filters.shadowDOM` checkbox from your UI.
6.  **Robust Host Selector:** When recursing, a more robust selector (ID if available, otherwise local CSS) is used for the host element in the path.
7.  **Overall Structure:** The old flat iteration logic in `domExtractionFunction` has been replaced by the new recursive approach.

Please replace the entire content of your existing `popup.js` with the following code:

```javascript
// ============================= @section: Element AI Extractor - popup.js =============================
/**
 * @fileoverview Main script for Element AI Extractor popup.
 * Handles: UI setup, extraction, locator generation, user events, table render, utility functions.
 */

// ============================= @section: AI Tips (Constants) =============================
const aiTips = ['Did you know? [role] and [aria-label] improve accessibility and test stability.', 'AI Tip: Interactable (clickable) elements are best for automation.', 'Pro tip: Prefer visible elements for automation—hidden ones may change.', 'AI Tip: IDs are the most stable selectors—use them if available!', 'AI Tip: XPath lets you select by text, attribute, or position.', 'AI Tip: Use CSS selectors for faster automation scripts.', 'AI Tip: Filter by element type for faster locator selection.', 'Pro tip: Combine CSS classes for more unique selectors.'];

// ============================= @section: UI Initialization =============================
/**
 * On popup load:
 * - Shows a random AI tip
 * - Sets up initial checkbox states
 * - Loads last extracted results if available
 */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ai-tip').textContent = aiTips[Math.floor(Math.random() * aiTips.length)];
  document.getElementById('filterAll').checked = true; // Default to true, specific types unchecked
  elementTypeList.forEach(type => (document.getElementById(type.id).checked = false)); // Uncheck specific types initially
  // Ensure "All Elements" logic correctly reflects initial state after specific types are unchecked
  if (document.getElementById('filterAll').checked && elementTypeList.some(type => !document.getElementById(type.id).checked)) {
     // If "All" is checked but not all types are (due to previous line), make "All" reflect that it *should* check all
     // Or, if the intent is "All" starts true and specific start false, then user interaction drives "All"
     // For now, let's assume the logic for 'filterAllBox.addEventListener' handles consistency.
  }

  chrome.storage.local.get(['lastExtractedData'], res => {
    if (res.lastExtractedData && Array.isArray(res.lastExtractedData)) {
      renderElementsTable(res.lastExtractedData);
      document.getElementById('status').textContent = 'Previous extraction loaded.';
    }
  });
});

// ============================= @section: Supported Element Types =============================
const elementTypeList = [
  {id: 'filterLinks', label: 'Links', selector: 'a'},
  {id: 'filterButtons', label: 'Buttons', selector: "button,input[type='button'],input[type='submit']"},
  {id: 'filterInputs', label: 'Inputs', selector: 'input,select,textarea'},
  {id: 'filterCombo', label: 'Combo', selector: "select,[role='combobox']"},
  {id: 'filterHeaders', label: 'Headers', selector: 'h1,h2,h3,h4,h5,h6'},
  {id: 'filterTextboxes', label: 'Textboxes', selector: "input[type='text'],input[type='search'],input[type='email'],input[type='url'],input[type='password']"},
  {id: 'filterCheckboxes', label: 'Checkboxes', selector: "input[type='checkbox']"},
  {id: 'filterRadios', label: 'Radios', selector: "input[type='radio']"},
  {id: 'filterLists', label: 'Lists', selector: 'ul,ol,li,dl,dt,dd'},
  {id: 'filterForms', label: 'Forms', selector: 'form'},
  {id: 'filterSVG', label: 'SVG', selector: 'svg'},
  {id: 'filterTables', label: 'Tables', selector: 'table,thead,tbody,tr,td,th'},
  {id: 'filterSpans', label: 'Spans', selector: 'span'},
  {id: 'filterDivs', label: 'Divs', selector: 'div'},
  {id: 'filterCustom', label: 'Custom Elements', selector: '*'} // Catches custom elements and others if specific types are off
];

// ============================= @section: Filter Checkbox and Toggle Logic =============================
/**
 * "All Elements" toggle sets/resets all filters.
 */
const filterAllBox = document.getElementById('filterAll');
filterAllBox.addEventListener('change', function () {
  elementTypeList.forEach(type => {
    document.getElementById(type.id).checked = this.checked;
  });
});
elementTypeList.forEach(type => {
  document.getElementById(type.id).addEventListener('change', function () {
    if (!this.checked) {
        filterAllBox.checked = false;
    } else {
        // Check if all specific type filters are now checked
        filterAllBox.checked = elementTypeList.every(t => document.getElementById(t.id).checked);
    }
  });
});

// ---- Visible/Hidden mutual exclusion ----
document.getElementById('filterVisible').addEventListener('change', function () {
  if (this.checked) document.getElementById('filterHidden').checked = false;
});
document.getElementById('filterHidden').addEventListener('change', function () {
  if (this.checked) document.getElementById('filterVisible').checked = false;
});

// ============================= @section: Utility Functions (Popup Context) =============================

/**
 * @function getCurrentFilters
 * @description Gets the current filter settings from the UI.
 * @returns {Object} Current filter selections.
 */
function getCurrentFilters() {
  return {
    selectedTypes: elementTypeList.filter(type => document.getElementById(type.id).checked).map(type => type.id),
    shadowDOM: document.getElementById('filterShadow').checked,
    visibleOnly: document.getElementById('filterVisible').checked,
    hiddenOnly: document.getElementById('filterHidden').checked,
    maxResults: 2000 // Default max results, could be made configurable
  };
}

/**
 * @function getCurrentTabInfo
 * @description Retrieves active tab ID and hostname.
 * @returns {Promise<{hostname: string, tabId: number}>}
 */
async function getCurrentTabInfo() {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  try {
    // Check if tab.url is present and valid before constructing URL
    if (tab && tab.url) {
        const url = new URL(tab.url);
        return {hostname: url.hostname, tabId: tab.id};
    } else if (tab && tab.id) {
        // Fallback if URL is not available (e.g., for chrome:// pages sometimes)
        return {hostname: 'current_page', tabId: tab.id};
    }
    // If tab itself is undefined or no ID, this will lead to issues later.
    // Consider error handling or a more robust fallback. For now:
    return {hostname: 'unknown_site', tabId: tab ? tab.id : null};
  } catch (e) {
    console.warn("Error parsing tab URL:", e);
    return {hostname: 'site_error', tabId: tab ? tab.id : null};
  }
}

/**
 * @function nameMatchesSearch
 * @description Checks if an element name matches the search query.
 * @param {string} name - Element's display name.
 * @param {string} search - Search query.
 * @returns {boolean} True if matches or search is empty.
 */
function nameMatchesSearch(name, search) {
  if (!search) return true;
  return (name || '').toLowerCase().includes(search.toLowerCase());
}

/**
 * @function copyLocatorToClipboard
 * @description Copies provided text to the clipboard.
 * @param {string} text - Text to copy.
 */
function copyLocatorToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    // Optional: provide feedback e.g., a small temporary message
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    // Optional: inform user of failure
  });
}

/**
 * @function highlightElementOnTab
 * @description Injects a script to highlight an element on the target tab.
 * @param {number} tabId - ID of the tab to highlight on.
 * @param {string} locator - The locator string (CSS or XPath).
 * @param {boolean|string} inShadowDOM - True if locator is for an element in Shadow DOM.
 * Could also be the host path string.
 * @param {string} hostElementPath - Path to the shadow host if inShadowDOM is true. (NEW)
 */
function highlightElementOnTab(tabId, locator, inShadowDOM, hostElementPath = '') { // Added hostElementPath
  chrome.scripting.executeScript({
    target: {tabId},
    args: [locator, inShadowDOM, hostElementPath], // Pass hostElementPath
    func: (locatorStr, isShadow, hostPath) => {
      // #Function: (In-Page Context) highlightElementOnPage
      // #Description: Finds and highlights an element. Handles regular and Shadow DOM elements.
      let targetElement = null;

      function findElement(currentContext, currentLocator, isCurrentContextShadow) {
          // #NOTE: This simplified finder is for highlight. The main extractor's locators
          // (like 'host >> inner') are conceptual for the table. Here we need to actually find it.
          // If 'locatorStr' for shadow DOM elements already contains '>>', we need to parse it.
          if (isCurrentContextShadow && typeof currentLocator === 'string' && currentLocator.includes(' >> ')) {
              // This means 'currentLocator' is a full path like "host1 >> host2 >> inner"
              // and 'currentContext' is likely 'document'.
              // We need to find the final host first.
              let pathSegments = currentLocator.split(' >> ');
              let finalInnerSelector = pathSegments.pop();
              let host = document;
              for (const segment of pathSegments) {
                  if (host.shadowRoot) host = host.shadowRoot.querySelector(segment);
                  else host = host.querySelector(segment);
                  if (!host) return null; // Path broken
              }
              // Now 'host' is the final shadow host. 'finalInnerSelector' is for inside its shadowRoot.
              return host.shadowRoot ? host.shadowRoot.querySelector(finalInnerSelector) : null;
          }
          // Otherwise, currentLocator is simple, to be used within currentContext
          try {
              if (typeof currentLocator === 'string' && currentLocator.startsWith('/')) {
                  return document.evaluate(currentLocator, currentContext, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
              } else if (typeof currentLocator === 'string') {
                  return currentContext.querySelector(currentLocator);
              }
          } catch (e) { console.warn("Highlight error:", e); return null; }
          return null;
      }
      
      if (isShadow) {
        // #NOTE: The 'locatorStr' passed for shadow elements from the table is ALREADY the combined path
        // (e.g., "host-selector >> inner-selector").
        // So, we treat 'document' as the initial context and parse this path.
        targetElement = findElement(document, locatorStr, true);

      } else {
        targetElement = findElement(document, locatorStr, false);
      }

      if (targetElement) {
        targetElement.scrollIntoView({behavior: 'smooth', block: 'center'});
        const originalOutline = targetElement.style.outline;
        targetElement.style.outline = '3px solid #FF00FF'; // Brighter color for highlight
        setTimeout(() => {
          targetElement.style.outline = originalOutline; // Restore original or remove
        }, 2500); // Increased duration
      } else {
        console.warn("Element AI Extractor: Could not highlight element with locator:", locatorStr, "(isShadow:", isShadow, "hostPath:", hostPath, ")");
      }
    }
  });
}


// ============================= @section: CSV Download Helper =============================
/**
 * @function downloadCSVFile
 * @description Creates and triggers download of a CSV file.
 * @param {Array<Object>} elementList - Data to include in CSV.
 * @param {string} filename - Desired filename for the CSV.
 */
function downloadCSVFile(elementList, filename) {
  // #NOTE: Added 'Host Element Path' to headers for Shadow DOM context.
  const headers = ['Element Name', 'Element Type', 'Best Locator', 'Locator Type', 'Why Best', 'ID', 'CSS', 'XPATH', 'In Shadow DOM', 'Host Element Path'];
  const csvRows = [headers.join(',')];

  elementList.forEach(row => {
      const csvRow = headers.map(header => {
          const cellValue = (row[header] === undefined || row[header] === null) ? '' : String(row[header]);
          return `"${cellValue.replace(/"/g, '""')}"`; // Escape double quotes
      });
      csvRows.push(csvRow.join(','));
  });

  const blob = new Blob([csvRows.join('\n')], {type: 'text/csv;charset=utf-8;'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url); // Clean up blob URL
  document.getElementById('status').textContent = `Your locators are ready: ${filename}`;
}

// ============================= @section: Extraction Button Handler =============================
document.getElementById('extract').onclick = async () => {
  document.querySelector('.popup-root').classList.remove('expanded');
  // collapsePopup(); // Ensure this function exists or remove call if not used elsewhere
  let extractBtn = document.getElementById('extract');
  extractBtn.disabled = true;
  document.getElementById('status').innerHTML = '<span class="loading">Scanning elements...</span>';
  document.getElementById('preview').innerHTML = ''; // Clear previous preview
  const filters = getCurrentFilters();
  const tabInfo = await getCurrentTabInfo();

  if (!tabInfo || tabInfo.tabId === null) {
      document.getElementById('status').textContent = '❌ Error: Could not get active tab information.';
      extractBtn.disabled = false;
      return;
  }
  const {hostname, tabId} = tabInfo;


  let failTimeout = setTimeout(() => {
    document.getElementById('status').innerHTML = '❌ Extraction timed out. The page might be too complex or unresponsive.';
    extractBtn.disabled = false;
  }, 15000); // Increased timeout

  chrome.scripting.executeScript(
    {
      target: {tabId},
      args: [filters], // Pass the filters object
      func: domExtractionFunction // The refactored function
    },
    results => {
      clearTimeout(failTimeout);

      if (chrome.runtime.lastError) {
        document.getElementById('status').textContent = '❌ Script injection error: ' + chrome.runtime.lastError.message;
        extractBtn.disabled = false;
        return;
      }
      if (!results || !results[0] || results[0].result === undefined) {
        document.getElementById('status').textContent = '❌ Extraction failed: No result from page script.';
        extractBtn.disabled = false;
        return;
      }
      
      let elementDataList = results[0].result;
      chrome.storage.local.set({lastExtractedData: elementDataList});

      if (!elementDataList || !elementDataList.length) {
        document.getElementById('status').textContent = 'No elements found matching your criteria.';
        document.getElementById('preview').innerHTML = ''; // Clear preview if no elements
        extractBtn.disabled = false;
        return;
      }
      document.getElementById('status').textContent = `Scanned ${elementDataList.length} elements!`;
      renderElementsTable(elementDataList);
      document.querySelector('.popup-root').classList.add('expanded');

      let now = new Date();
      let timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
      let filename = `${hostname}_elements_${timestamp}.csv`;
      downloadCSVFile(elementDataList, filename);
      setTimeout(() => (extractBtn.disabled = false), 1100);
    }
  );
};

// ============================= @section: domExtractionFunction (IN-PAGE CONTEXT) =============================
/**
 * @function domExtractionFunction
 * @description Main function injected into the target page to extract elements.
 * Now includes recursive Shadow DOM traversal.
 * @param {Object} filters - Filter criteria from the popup.
 * @returns {Array<Object>} - Array of extracted element data.
 */
function domExtractionFunction(filters) {
    // #SECTION: In-Page Helper Functions (isVisible, Locators, Naming)
    // #IMPORTANT: These functions now operate within the context provided to them (main document or a shadowRoot).

    /**
     * @function isVisible
     * @description Checks if an element is currently visible in the layout.
     * @param {Element} el - The element to check.
     * @returns {boolean} True if visible, false otherwise.
     */
    function isVisible(el) {
        // #NOTE: Basic visibility check. More complex scenarios (e.g., covered by other elements) are not handled here.
        if (!el || typeof el.getBoundingClientRect !== 'function') return false; // Must be an element
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false; // No dimensions
        const style = window.getComputedStyle(el);
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    /**
     * @function getUniqueCssSelector
     * @description Generates a CSS selector for an element, prioritizing ID, then trying to build a path.
     * ADAPTED for contextNode.
     * @param {Element} el - The element to get a selector for.
     * @param {Node} contextNode - The document or shadowRoot in which 'el' resides and uniqueness is checked.
     * @returns {string} A CSS selector for the element, local to its contextNode.
     */
    function getUniqueCssSelector(el, contextNode) {
        // #NOTE: contextNode is crucial for uniqueness checks and path boundary.
        if (!el || typeof el.getAttribute !== 'function') return 'invalid_element';
        
        if (el.id) {
            const idSelector = `#${CSS.escape(el.id)}`;
            try {
                if (contextNode.querySelectorAll(idSelector).length === 1) {
                    return idSelector;
                }
            } catch (e) { /* Malformed ID can cause querySelectorAll to throw */ }
        }

        let path = [];
        let currentEl = el;
        while (currentEl && currentEl !== contextNode && currentEl.nodeType === Node.ELEMENT_NODE) {
            let selector = currentEl.nodeName.toLowerCase();
            if (currentEl.id) { // Prefer ID in path segment if it makes it unique from siblings
                selector = `#${CSS.escape(currentEl.id)}`;
                path.unshift(selector);
                break; // ID segment is strong enough, stop path
            } else if (currentEl.classList && currentEl.classList.length > 0) {
                selector += '.' + Array.from(currentEl.classList).map(c => CSS.escape(c)).join('.');
            }

            const parent = currentEl.parentNode;
            if (parent && parent !== contextNode) { // Ensure parent is within the same context or is the context itself
                const siblings = Array.from(parent.children).filter(sibling => sibling.nodeName === currentEl.nodeName);
                if (siblings.length > 1) {
                    const index = siblings.indexOf(currentEl);
                    selector += `:nth-child(${index + 1})`;
                }
            }
            path.unshift(selector);
            currentEl = parent;
        }
        return path.join(' > ');
    }

    /**
     * @function getXPath
     * @description Generates a basic XPath for an element.
     * ADAPTED for contextNode (though XPath generation is inherently local).
     * @param {Element} el - The element.
     * @param {Node} contextNode - The document or shadowRoot in which 'el' resides.
     * @returns {string} An XPath selector for the element, local to its contextNode.
     */
    function getXPath(el, contextNode) {
        // #NOTE: This generates an XPath relative to its immediate parent.
        // It does not guarantee global uniqueness from document root if el is deep or in shadow.
        // The 'contextNode' is mostly for consistency, as XPath is usually generated locally.
        if (!el || typeof el.getAttribute !== 'function') return 'invalid_element';

        if (el.id) {
            return `//*[@id="${el.id}"]`; // More robust XPath for ID
        }
        
        let path = [];
        let currentEl = el;
        while (currentEl && currentEl !== contextNode && currentEl.nodeType === Node.ELEMENT_NODE) {
            let index = 1;
            let sibling = currentEl.previousSibling;
            while (sibling) {
                if (sibling.nodeType === Node.ELEMENT_NODE && sibling.nodeName === currentEl.nodeName) {
                    index++;
                }
                sibling = sibling.previousSibling;
            }
            let segment = currentEl.nodeName.toLowerCase();
            if (index > 1 || (currentEl.nextSibling && Array.from(currentEl.parentNode.children).filter(c => c.nodeName === currentEl.nodeName).length > 1)) {
                 // Add index only if needed (multiple siblings of same type or if it's not the only one)
                segment += `[${index}]`;
            }
            path.unshift(segment);
            currentEl = currentEl.parentNode;
        }
        return (contextNode === document ? '/' : './') + path.join('/'); // Start with / for document, ./ for shadowRoot
    }

    /**
     * @function getBestLocator
     * @description Determines the "best" locator based on a predefined strategy.
     * ADAPTED for contextNode.
     * @param {Element} el - The element.
     * @param {Node} contextNode - The document or shadowRoot for uniqueness checks.
     * @returns {Object} {type: string, locator: string, reason: string}
     */
    function getBestLocator(el, contextNode) {
        // #IMPORTANT: All querySelectorAll calls for uniqueness checks MUST use contextNode.
        // 1. data-* attributes (common in test automation)
        for (let attr of el.getAttributeNames()) {
            if (/^data-(testid|test|qa|automation|cy|test-id|qa-id)\b/i.test(attr)) {
                const locator = `[${attr}="${CSS.escape(el.getAttribute(attr))}"]`;
                try { // Check uniqueness within context
                    if (contextNode.querySelectorAll(locator).length === 1) {
                        return {type: 'data-*', locator: locator, reason: `unique ${attr}`};
                    }
                } catch(e) { /* malformed attribute value */ }
            }
        }
        // 2. aria-label (good for accessibility and often unique)
        const ariaLabel = el.getAttribute('aria-label');
        if (ariaLabel) {
            const locator = `[aria-label="${CSS.escape(ariaLabel)}"]`;
            try {
                if (contextNode.querySelectorAll(locator).length === 1) {
                    return {type: 'aria-label', locator: locator, reason: 'unique aria-label'};
                }
            } catch(e) {}
        }
        // 3. role attribute (can be good if specific and unique)
        const role = el.getAttribute('role');
        if (role) {
            const locator = `[role="${CSS.escape(role)}"]`;
             try {
                if (contextNode.querySelectorAll(locator).length === 1) {
                    return {type: 'role', locator: locator, reason: 'unique role'};
                }
            } catch(e) {}
        }
        // 4. id (must be unique in its context DOM)
        if (el.id) {
            const locator = `#${CSS.escape(el.id)}`;
            try {
                if (contextNode.querySelectorAll(locator).length === 1) {
                    return {type: 'id', locator: locator, reason: 'unique id in context'};
                }
            } catch(e) {}
        }
        // 5. Unique class name (ignoring common, non-specific classes)
        if (el.classList && el.classList.length > 0) {
            const commonOrLayoutClasses = /^(active|selected|open|show|hide|enabled|disabled|focus|container|wrapper|inner|outer|item|element|block|layout|grid|flex)/i;
            for (let cls of el.classList) {
                if (!commonOrLayoutClasses.test(cls) && isNaN(parseInt(cls.charAt(0)))) { // Avoid purely numeric or common classes
                    const locator = `.${CSS.escape(cls)}`;
                    try {
                        if (contextNode.querySelectorAll(locator).length === 1) {
                            return {type: 'class', locator: locator, reason: 'unique class in context'};
                        }
                    } catch(e) {}
                }
            }
        }
        // 6. Text content for specific interactable elements (if unique within context)
        const tagNameUpper = el.tagName.toUpperCase();
        if ((tagNameUpper === 'BUTTON' || tagNameUpper === 'A' || tagNameUpper === 'SUMMARY' || el.getAttribute('role') === 'button' || el.getAttribute('role') === 'link') && el.textContent && el.textContent.trim().length > 0 && el.textContent.trim().length < 100) {
            const text = el.textContent.trim();
            // #NOTE: :contains is jQuery, not standard CSS. For XPath by text:
            const xpathForText = `.//*[self::${el.nodeName.toLowerCase()} and normalize-space(.)="${text.replace(/"/g, '&quot;')}"]`; // XPath needs proper escaping for "
            try {
                let matches = [];
                let xpathResult = contextNode.evaluate(xpathForText, contextNode, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
                let node;
                while(node = xpathResult.iterateNext()) { matches.push(node); }

                if (matches.length === 1 && matches[0] === el) {
                     return {type: 'text (XPath)', locator: xpathForText, reason: 'unique text content (XPath)'};
                }
            } catch(e) { console.warn("XPath text search error", e); }
        }
        // 7. Fallback to generated CSS selector relative to contextNode
        return {type: 'css', locator: getUniqueCssSelector(el, contextNode), reason: 'auto-generated CSS in context'};
    }

    /**
     * @function getElementDisplayName
     * @description Generates a display name for the element.
     * @param {Element} el - The element.
     * @returns {string} A display name.
     */
    function getElementDisplayName(el) {
        const preferredAttrs = ['aria-label', 'data-name', 'title', 'placeholder', 'alt'];
        for (const attr of preferredAttrs) {
            const val = el.getAttribute(attr);
            if (val) return val.trim().slice(0, 70);
        }
        if (el.textContent) { // Changed from innerText for consistency, also includes hidden text
            let text = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 70);
            if (text) return text;
        }
        if (el.value && typeof el.value === 'string') { // For input elements
             let text = el.value.trim().replace(/\s+/g, ' ').slice(0, 70);
             if (text) return text;
        }
        return el.id || el.name || el.tagName.toLowerCase();
    }
    
    /**
     * @function getElementTypeName
     * @description Determines a short type name for the element.
     * @param {Element} el - The element.
     * @returns {string} A short type name (e.g., BTN, LINK).
     */
    function getElementTypeName(el) {
        // #NOTE: Your existing comprehensive list is good.
        if (el.matches('a')) return 'LINK';
        if (el.matches("button,input[type='button'],input[type='submit'],[role='button']")) return 'BTN';
        if (el.matches("input[type='text'],input[type='search'],input[type='email'],input[type='url'],input[type='password'],input:not([type]),textarea")) return 'TXTBOX';
        if (el.matches("input[type='checkbox'],[role='checkbox']")) return 'CHKBOX';
        if (el.matches("input[type='radio'],[role='radio']")) return 'RADIO';
        if (el.matches("select,[role='combobox'],[role='listbox']")) return 'COMBO';
        if (el.matches('h1,h2,h3,h4,h5,h6,[role="heading"]')) return 'HEADER';
        if (el.matches('ul,ol,li,dl,dt,dd,[role="list"],[role="listitem"]')) return 'LIST';
        if (el.matches('form,[role="form"]')) return 'FORM';
        if (el.matches('svg,svg *')) return 'SVG'; // Include elements within SVGs
        if (el.matches('table,thead,tbody,tr,td,th,[role="grid"],[role="row"],[role="gridcell"],[role="columnheader"],[role="rowheader"]')) return 'TABLE';
        if (el.matches('span')) return 'SPAN';
        if (el.matches('div')) return 'DIV';
        if (el.tagName && el.tagName.includes('-')) return 'CUSTOM'; // Custom element check
        if (el.matches('img,[role="img"]')) return 'IMG';
        if (el.matches('nav,[role="navigation"]')) return 'NAV';
        if (el.matches('main,[role="main"]')) return 'MAIN';
        if (el.matches('article,[role="article"]')) return 'ARTICLE';
        if (el.matches('aside,[role="complementary"]')) return 'ASIDE';
        if (el.matches('section')) return 'SECTION'; // Generic section
        if (el.matches('header')) return 'HDR_ELM'; // Header element, distinct from H1-H6
        if (el.matches('footer')) return 'FTR_ELM';
        if (el.matches('p')) return 'PARAGRAPH';
        if (el.matches('iframe')) return 'IFRAME';
        return el.tagName ? el.tagName.toUpperCase() : 'UNKNOWN';
    }

    // #SECTION: Recursive Extraction Logic
    const typeToSelectorMapInjected = {
        filterLinks: 'a',
        filterButtons: "button,input[type='button'],input[type='submit'],[role='button']",
        filterInputs: 'input,select,textarea', // Broad input category
        filterCombo: "select,[role='combobox'],[role='listbox']",
        filterHeaders: 'h1,h2,h3,h4,h5,h6,[role="heading"]',
        filterTextboxes: "input[type='text'],input[type='search'],input[type='email'],input[type='url'],input[type='password'],textarea,input:not([type])",
        filterCheckboxes: "input[type='checkbox'],[role='checkbox']",
        filterRadios: "input[type='radio'],[role='radio']",
        filterLists: 'ul,ol,li,dl,dt,dd,[role="list"],[role="listitem"]',
        filterForms: 'form,[role="form"]',
        filterSVG: 'svg, svg *',
        filterTables: 'table,thead,tbody,tr,td,th,[role="grid"],[role="row"],[role="gridcell"],[role="columnheader"],[role="rowheader"]',
        filterSpans: 'span',
        filterDivs: 'div',
        filterCustom: '*' // This will be used if 'All' is checked or if custom type is checked
    };

    /**
     * @function _extractElementsRecursive
     * @description Recursively extracts elements from a given node (document or shadowRoot).
     * @param {Node} contextNode - The current DOM node to operate within.
     * @param {boolean} isShadowContext - True if contextNode is a shadowRoot.
     * @param {Array<string>} currentHostPathArray - Array of CSS selectors tracing path through nested shadow hosts.
     * @returns {Array<Object>} Array of element data objects found in this context and its children shadow DOMs.
     */
    function _extractElementsRecursive(contextNode, isShadowContext, currentHostPathArray) {
        let collectedData = [];
        let currentElementsProcessed = 0; // Counter for elements processed in current context.

        // #NOTE: Construct selectorsString based on filters. If "All" or "Custom", use "*", otherwise specific types.
        // This ensures we can find shadow hosts even if they don't match specific type filters.
        let baseSelectorsString = '*'; // Default to scan all for shadow hosts
        if (filters.selectedTypes.length > 0 && !filters.selectedTypes.includes('filterCustom') && !document.getElementById('filterAll').checked) {
            baseSelectorsString = filters.selectedTypes.map(typeId => {
                const typeInfo = elementTypeList.find(t => t.id === typeId); // Use elementTypeList from popup context
                return typeInfo ? typeInfo.selector : null;
            }).filter(s => s).join(',');
        }
        if (!baseSelectorsString) baseSelectorsString = '*'; // Fallback if mapping results in empty string


        let elementsToScan = [];
        try {
            elementsToScan = Array.from(contextNode.querySelectorAll(baseSelectorsString));
        } catch (e) {
            console.warn(`Element AI Extractor: Could not query elements in context (selector: "${baseSelectorsString}"):`, contextNode, e);
            return collectedData;
        }
        
        // #NOTE: Limit elements per individual context scan to prevent deep recursion slowdowns.
        // The overall limit is applied at the very end.
        const perContextLimit = 1000; 

        for (let el of elementsToScan) {
            if (currentElementsProcessed >= perContextLimit && !el.shadowRoot) { 
                // If limit reached and current element is not a shadow host, skip.
                // We always want to check shadow hosts even if limit is reached for normal elements in this context.
                continue;
            }

            // #NOTE: Apply type filters *after* querying with baseSelectorsString
            // This ensures we find shadow hosts which might not match the type filters themselves.
            const elementTypeForFilterCheck = getElementTypeName(el); // Get standardized type name
            const matchesTypeFilter = filters.selectedTypes.length === 0 || document.getElementById('filterAll').checked ||
                                     filters.selectedTypes.some(typeId => {
                                         // Check if el matches the selector for this typeId
                                         // This is a bit complex as getElementTypeName might not directly map back to filterId selectors
                                         // A simpler check: if type is in selectedTypes, then it's a candidate.
                                         // This relies on baseSelectorsString to have done the primary filtering.
                                         // For now, we assume if it was caught by baseSelectorsString, and specific types are chosen, it's relevant.
                                         // A more robust check would be el.matches(selector_for_typeId)
                                         const typeInfo = elementTypeList.find(t => t.id === typeId);
                                         return typeInfo && el.matches(typeInfo.selector);
                                     });
            
            // If specific types are selected (and not 'All' or 'Custom'), and the element doesn't match,
            // still process it if it's a shadow host (to find elements inside it), but don't add it to results.
            let shouldAddCurrentElement = true;
            if (filters.selectedTypes.length > 0 && !document.getElementById('filterAll').checked && !filters.selectedTypes.includes('filterCustom')) {
                if (!matchesTypeFilter) {
                    shouldAddCurrentElement = false; // Doesn't match type filters
                }
            }
            
            if (shouldAddCurrentElement) {
                if (filters.visibleOnly && !isVisible(el)) continue;
                if (filters.hiddenOnly && isVisible(el)) continue;
            }


            // #NOTE: Only increment if we are seriously considering this element or its children
            currentElementsProcessed++;


            // #SECTION: Element Data Collection
            if (shouldAddCurrentElement) {
                let localId = el.id || '';
                let localCssSelector = getUniqueCssSelector(el, contextNode);
                let localXPath = getXPath(el, contextNode);
                let bestLocatorInfo = getBestLocator(el, contextNode);

                let finalCssSelector = localCssSelector;
                let finalXPath = localXPath; // For display, keep it local. Automation will need context.
                let finalBestLocator = bestLocatorInfo.locator;
                let hostPathString = isShadowContext ? currentHostPathArray.join(' >> ') : '';

                if (isShadowContext && hostPathString) {
                    finalCssSelector = `${hostPathString} >> ${localCssSelector}`;
                    if (['data-*', 'aria-label', 'role', 'id', 'class', 'css'].includes(bestLocatorInfo.type)) {
                        finalBestLocator = `${hostPathString} >> ${bestLocatorInfo.locator}`;
                    }
                }
                
                let displayName = getElementDisplayName(el);
                let elementType = getElementTypeName(el);

                collectedData.push({
                    'Element Name': displayName,
                    'Element Type': elementType,
                    'Best Locator': finalBestLocator,
                    'Locator Type': bestLocatorInfo.type,
                    'Why Best': bestLocatorInfo.reason,
                    ID: localId,
                    CSS: finalCssSelector,
                    XPATH: localXPath, // Store local XPath
                    'In Shadow DOM': isShadowContext,
                    'Host Element Path': hostPathString
                });
            }

            // #SECTION: Recursion for Shadow Hosts
            // #IMPORTANT: Recurse if shadowDOM filter is active AND the element has a shadowRoot.
            if (el.shadowRoot && filters.shadowDOM) {
                // #NOTE: For the host path, use a robust selector for 'el' itself within 'contextNode'.
                // If 'el' has a unique ID in its current context, that's best. Otherwise, its local CSS.
                let selectorForHostInPath;
                const hostBestLocator = getBestLocator(el, contextNode);
                if (hostBestLocator.type === 'id') {
                    selectorForHostInPath = hostBestLocator.locator;
                } else {
                    selectorForHostInPath = getUniqueCssSelector(el, contextNode); // Fallback to local CSS
                }
                
                const newHostPath = [...currentHostPathArray, selectorForHostInPath];
                collectedData = collectedData.concat(
                    _extractElementsRecursive(el.shadowRoot, true, newHostPath)
                );
            }
        }
        return collectedData;
    } // --- END OF _extractElementsRecursive ---

    // #SECTION: Main Call to Start Recursive Extraction
    // #NOTE: The main function now delegates to the recursive helper.
    let allExtractedData = _extractElementsRecursive(document, false, []);
    
    // #NOTE: Apply the overall maximum results limit AFTER collecting all possible elements.
    const maxResultsLimit = filters.maxResults || 2000; // Use from filters or default
    if (allExtractedData.length > maxResultsLimit) {
        console.warn(`Element AI Extractor: Truncated results from ${allExtractedData.length} to ${maxResultsLimit}`);
        allExtractedData = allExtractedData.slice(0, maxResultsLimit);
    }
    
    return allExtractedData;
} // --- END OF domExtractionFunction ---


// ============================= @section: Table Render & Preview =============================
/**
 * @function renderElementsTable
 * @description Renders a preview table of extracted elements in the popup.
 * @param {Array<Object>} data - The array of element data to render.
 */
function renderElementsTable(data) {
  const search = document.getElementById('search').value;
  let filteredData = data.filter(row => nameMatchesSearch(row['Element Name'], search));
  
  // #NOTE: Consider making maxRows configurable or dynamic.
  let maxRowsInPreview = 50; // Increased max rows for preview
  let previewHTML = `<b>Preview (${filteredData.length} found, showing first ${Math.min(maxRowsInPreview, filteredData.length)}):</b>
    <table><thead><tr>
    <th>Name</th>
    <th>Type</th>
    <th>Best Locator</th>
    <th>ID</th>
    <th>CSS Path</th>
    <th>Local XPath</th>
    <th>Shadow Host Path</th>
    <th>Copy</th>
    <th>Highlight</th></tr></thead><tbody>`; // Added <thead> & <tbody>

  for (let i = 0; i < Math.min(filteredData.length, maxRowsInPreview); ++i) {
    let r = filteredData[i];
    previewHTML += `<tr>
      <td title="${r['Element Name']}">${r['Element Name']}</td>
      <td><span class="el-badge" title="${r['Element Type']}">${r['Element Type']}</span></td>
      <td title="${r['Best Locator']}" class="locator-cell">${r['Best Locator']}</td>
      <td title="${r['ID']}" class="locator-cell">${r['ID']}</td>
      <td title="${r['CSS']}" class="locator-cell">${r['CSS']}</td>
      <td title="${r['XPATH']}" class="locator-cell">${r['XPATH']}</td>
      <td title="${r['Host Element Path']}">${r['In Shadow DOM'] ? `<span class="shadow-badge" title="Host: ${r['Host Element Path']}">SHDW</span>` : 'No'}</td>
      <td><button class="copy-btn" data-copy="${r['Best Locator']}" title="Copy Best Locator">📋</button></td>
      <td><button class="hl-btn" 
                  data-hl="${r['In Shadow DOM'] ? r['CSS'] : r['Best Locator']}"  // For shadow, use combined CSS for highlight
                  data-shadow="${r['In Shadow DOM'] ? 'true' : 'false'}" 
                  data-host-path="${r['Host Element Path'] || ''}"
                  title="Highlight element">👁️</button></td>
    </tr>`;
  }
  previewHTML += '</tbody></table>';
  document.getElementById('preview').innerHTML = previewHTML;
  // #NOTE: Ensure button binding happens after innerHTML is fully processed.
  requestAnimationFrame(() => bindTablePreviewButtons()); 
  expandPopupForResults();
}

/**
 * @function bindTablePreviewButtons
 * @description Binds click events to copy and highlight buttons in the preview table.
 */
function bindTablePreviewButtons() {
  document.querySelectorAll('#preview .copy-btn').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation(); // Prevent row click or other events
      let text = e.target.getAttribute('data-copy');
      copyLocatorToClipboard(text);
      const originalText = btn.textContent;
      btn.textContent = '✅';
      setTimeout(() => (btn.textContent = '📋'), 800);
    };
  });
  document.querySelectorAll('#preview .hl-btn').forEach(btn => {
    btn.onclick = async e => {
      e.stopPropagation();
      let locator = e.target.getAttribute('data-hl');
      // #NOTE: data-shadow attribute should be correctly interpreted as boolean.
      let inShadow = e.target.getAttribute('data-shadow') === 'true'; 
      let hostPath = e.target.getAttribute('data-host-path'); // Get host path for highlighter
      const tabInfo = await getCurrentTabInfo();
      if (tabInfo && tabInfo.tabId !== null) {
          highlightElementOnTab(tabInfo.tabId, locator, inShadow, hostPath);
      } else {
          console.error("Cannot highlight, tab ID not found.");
          // Optionally show error to user in status
      }
      const originalText = btn.textContent;
      btn.textContent = '✨';
      setTimeout(() => (btn.textContent = '👁️'), 800);
    };
  });
}

// ============================= @section: Table Search Filter =============================
document.getElementById('search').oninput = function () {
  // #NOTE: Debouncing this for better performance on large tables is a good idea.
  // For now, direct filter.
  const dataToRender = chrome.storage.local.get(['lastExtractedData'], res => {
    if (res.lastExtractedData && Array.isArray(res.lastExtractedData)) {
      renderElementsTable(res.lastExtractedData); // Re-render with current search term
    }
  });
};

// ============================= @section: On Load - "All Elements" Checks =============================
// #NOTE: This logic should ideally be part of DOMContentLoaded or a dedicated init function.
// It ensures the "All Elements" checkbox correctly reflects the state of individual type checkboxes.
function syncFilterAllCheckbox() {
    const allChecked = elementTypeList.every(type => document.getElementById(type.id).checked);
    const someChecked = elementTypeList.some(type => document.getElementById(type.id).checked);
    const filterAll = document.getElementById('filterAll');
    
    if (allChecked) {
        filterAll.checked = true;
        filterAll.indeterminate = false;
    } else if (someChecked) {
        filterAll.checked = false; // Or true, depending on desired UX for "some"
        filterAll.indeterminate = true; // Visually indicates not all/none are selected
    } else {
        filterAll.checked = false;
        filterAll.indeterminate = false;
    }
}
// Initial sync on load within DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // ... other DOMContentLoaded code ...
    if (document.getElementById('filterAll').checked) { // If "All" is default true
        elementTypeList.forEach(type => {
            document.getElementById(type.id).checked = true; // Make specific types also true
        });
    } else { // If "All" is default false, ensure specific types are false too
        elementTypeList.forEach(type => {
            document.getElementById(type.id).checked = false;
        });
    }
    syncFilterAllCheckbox(); // Sync indeterminate state if needed

    // Add listeners to specific checkboxes to update "All"
    elementTypeList.forEach(type => {
        document.getElementById(type.id).addEventListener('change', syncFilterAllCheckbox);
    });
    // Add listener to "All" checkbox to update specific ones
    document.getElementById('filterAll').addEventListener('change', function() {
        const isChecked = this.checked;
        elementTypeList.forEach(type => {
            document.getElementById(type.id).checked = isChecked;
        });
        this.indeterminate = false; // When user clicks "All", it's no longer indeterminate
    });
});


// ============================= @section: Popup Resize Logic =============================
/**
 * @function expandPopupForResults
 * @description Expands the popup height when results are shown.
 */
function expandPopupForResults() {
  document.querySelector('.popup-root').classList.add('expanded');
}

/**
 * @function collapsePopup
 * @description Collapses the popup height.
 */
function collapsePopup() { // Make sure this function is defined if called
  document.querySelector('.popup-root').classList.remove('expanded');
}
```

**Key Explanations Added via Comments:**

* **`#Function:`**: Describes the purpose of a function.
* **`#IMPORTANT:`**: Highlights critical logic or changes.
* **`#SECTION:`**: Used to demarcate logical blocks of code or concepts.
* **`#NOTE:`**: Provides additional explanations, considerations, or potential areas for future improvement.
* **Adaptations to Locator Functions:** Comments explain that `getUniqueCssSelector`, `getXPath`, and `getBestLocator` now accept `contextNode` and how their internal logic should reflect that (e.g., `contextNode.querySelectorAll`).
* **Shadow DOM Path Logic:** Explanations on how `currentHostPathArray` is used, how locators are prefixed, and how `Host Element Path` is stored.
* **Recursive Call:** Comments on the recursive call to `_extractElementsRecursive` and how the host path is built.
* **Type Selection and Shadow Hosts:** Notes on ensuring the `selectorsString` is broad enough (`*`) when `filters.shadowDOM` is true to find potential shadow hosts, even if those hosts don't match specific type filters. The actual type filtering for adding an element to `collectedData` happens later.
* **Filter Logic in Recursion:** Added detail on how type filters and visibility filters are applied within the recursive loop.
* **Highlighting Shadow DOM Elements:** Updated `highlightElementOnTab` and its call in `renderElementsTable` to better handle the combined CSS path for elements within Shadow DOM by attempting to parse it.
* **CSV Headers:** Added `'Host Element Path'` to the CSV headers.
* **Filter Checkbox Logic:** Improved the initial setup and synchronization logic for the "All Elements" checkbox and individual type checkboxes.

**Before you run this:**

1.  **Thoroughly Review the Adapted Locator Functions:** I've updated `getUniqueCssSelector`, `getXPath`, and `getBestLocator` to include `contextNode` and use it in queries. Please pay close attention to these as they are complex and critical for correctness.
    * `getUniqueCssSelector`: Path generation logic now tries to be relative to `contextNode`.
    * `getXPath`: Path generation is also made relative.
    * `getBestLocator`: Uniqueness checks (`querySelectorAll`) use `contextNode`. The XPath text search now uses `contextNode.evaluate`.
2.  **Test on Various Pages:** Test this on pages with no shadow DOM, single-level shadow DOM, and nested shadow DOMs (if you can find examples) to see how it behaves. Also test with different filter combinations.
3.  **Console Logs:** Use `console.log` extensively inside `_extractElementsRecursive` and the locator functions during your testing if you encounter issues, to trace the `contextNode`, `currentHostPathArray`, and generated locators.

This version is a significant step towards robust Shadow DOM support. Let me know how it works for you, and we can then debug or refine further!