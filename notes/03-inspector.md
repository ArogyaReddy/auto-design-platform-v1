Okay, let's get started on the "Inspect Element" feature! This will be a great addition, allowing you to pick a single element on the page and get its detailed locator information.

We'll build this step-by-step:

1.  **UI Additions:** Add an "Inspect" button to `popup.html` and a place to display the inspected element's details.
2.  **Popup Logic (`popup.js`):** Handle the Inspect button click, toggle an inspect mode, and communicate this to the content script. It will also listen for data back from the content script.
3.  **Content Script Logic (`contentScript.js`):** Listen for inspect mode commands, then handle mouseovers for highlighting and clicks for selecting and analyzing the target element.

Let's start with the UI and the basic communication.

**Step 1: Update `popup.html`**

Add an "Inspect Element" button (e.g., before the "Extract Elements" button) and a new `div` to display the details of the inspected element.

```html
<button class="inspect-btn" id="inspectElement" title="Inspect a single element on the page">🔬 Inspect Element</button>
<div id="inspector-status" class="status-row"></div>
<div id="inspected-element-details" class="preview-table" style="display: none;">
    </div>

```

**Step 2: Add Styles to `popup.css` (Optional, for the new button/section)**

You can style the `.inspect-btn` similarly to `.extract-btn` or give it its own look. The `#inspected-element-details` can reuse `.preview-table` styles.

```css
/* ... (add to your existing popup.css) ... */

/* =========================== @section: Inspect Button =========================== */
.inspect-btn {
    width: 100%;
    padding: 10px 0; /* Slightly smaller padding than extract */
    margin-bottom: 10px;
    font-size: 1.05em; /* Slightly smaller font */
    font-weight: bold;
    border: none;
    border-radius: 9px;
    background: linear-gradient(90deg, var(--ai-cyan) 40%, var(--brand-yellow) 130%); /* Different gradient */
    color: var(--ai-dark);
    cursor: pointer;
    letter-spacing: 0.03em;
    box-shadow: 0 2px 12px #38b6ff55;
    outline: none;
    transition: background 0.18s, box-shadow 0.18s, transform 0.13s;
}

.inspect-btn:hover,
.inspect-btn:focus {
    background: linear-gradient(90deg, var(--brand-yellow) 10%, var(--ai-cyan) 100%);
    box-shadow: 0 4px 18px #ffe06677;
    transform: scale(1.02);
}

.inspect-btn.inspecting { /* Style when inspect mode is active */
    background: linear-gradient(90deg, #ff6b6b, #ffb56b); /* Reddish gradient */
    color: #fff;
    box-shadow: 0 2px 12px #ff6b6b88;
}

#inspected-element-details {
    margin-top: 10px; /* Some space above it */
}
```

**Step 3: Update `popup.js` for Inspect Mode Toggling and Communication**

We'll add a new state variable, an event listener for the inspect button, and a message handler for results from the content script.

```javascript
// Add this near the top of popup.js, perhaps after elementTypeList
let isInspectingGlobal = false; // Tracks if inspect mode is active

// Add this inside your DOMContentLoaded listener, or as a top-level event listener setup
document.addEventListener('DOMContentLoaded', () => {
    // ... (your existing DOMContentLoaded code) ...

    const inspectElementBtn = document.getElementById('inspectElement');
    const inspectedElementDetailsDiv = document.getElementById('inspected-element-details');
    const inspectorStatusDiv = document.getElementById('inspector-status');

    inspectElementBtn.addEventListener('click', async () => {
        const tabInfo = await getCurrentTabInfo();
        if (!tabInfo || tabInfo.tabId === null) {
            inspectorStatusDiv.textContent = '❌ Error: No active tab found.';
            return;
        }

        isInspectingGlobal = !isInspectingGlobal; // Toggle inspect mode

        if (isInspectingGlobal) {
            inspectorStatusDiv.textContent = '🔬 Inspect Mode: Click an element on the page.';
            inspectElementBtn.classList.add('inspecting');
            inspectElementBtn.textContent = '🔴 Stop Inspecting';
            inspectedElementDetailsDiv.style.display = 'none'; // Hide previous details
            inspectedElementDetailsDiv.innerHTML = ''; // Clear previous details

            // Send message to content script to start inspecting
            chrome.tabs.sendMessage(tabInfo.tabId, {
                action: "startInspectingAiExtractor"
            }, (response) => {
                if (chrome.runtime.lastError) {
                    console.warn("Element AI Extractor: Could not establish connection with content script. Ensure it's injected and manifest permissions are correct. Error:", chrome.runtime.lastError.message);
                    inspectorStatusDiv.textContent = '❌ Error: Cannot connect to page. Try reloading the page/extension.';
                    isInspectingGlobal = false; // Reset state
                    inspectElementBtn.classList.remove('inspecting');
                    inspectElementBtn.textContent = '🔬 Inspect Element';
                } else if (response && response.status === 'error') {
                    console.warn("Element AI Extractor: Content script reported an error starting inspection:", response.message);
                    inspectorStatusDiv.textContent = `❌ Error: ${response.message}`;
                    isInspectingGlobal = false; // Reset state
                    inspectElementBtn.classList.remove('inspecting');
                    inspectElementBtn.textContent = '🔬 Inspect Element';
                } else if (response && response.status === 'listening') {
                    console.log("Element AI Extractor: Content script is now listening for inspection.");
                    // Optionally, you could close the popup here: window.close();
                    // Or provide feedback that it's active.
                }
            });
        } else {
            inspectorStatusDiv.textContent = 'Inspection stopped.';
            inspectElementBtn.classList.remove('inspecting');
            inspectElementBtn.textContent = '🔬 Inspect Element';
            // Send message to content script to stop inspecting
            chrome.tabs.sendMessage(tabInfo.tabId, {
                action: "stopInspectingAiExtractor"
            }, (response) => {
                 if (chrome.runtime.lastError) {
                    console.warn("Element AI Extractor: Error sending stopInspecting message or content script already inactive.", chrome.runtime.lastError.message);
                }
            });
        }
    });
}); // End of DOMContentLoaded

// Add this new message listener (or integrate into an existing one if you have one)
// This listens for data sent back from contentScript.js after an element is inspected.
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "inspectedElementDataAiExtractor") {
        console.log("Popup received inspected element data:", message.data);
        const inspectedElementDetailsDiv = document.getElementById('inspected-element-details');
        const inspectorStatusDiv = document.getElementById('inspector-status');
        const inspectElementBtn = document.getElementById('inspectElement');

        if (message.data) {
            // Re-use renderElementsTable or create a specific display function
            // For simplicity, let's adapt renderElementsTable to show a single element.
            // Or, create a new simpler display:
            inspectedElementDetailsDiv.innerHTML = `<b>Inspected Element:</b>
                <table>
                    <tr><th>Property</th><th>Value</th></tr>
                    <tr><td>Name</td><td>${message.data['Element Name']}</td></tr>
                    <tr><td>Type</td><td><span class="el-badge">${message.data['Element Type']}</span></td></tr>
                    <tr><td>Best Locator</td><td class="locator-cell">${message.data['Best Locator']}</td></tr>
                    <tr><td>Locator Type</td><td>${message.data['Locator Type']}</td></tr>
                    <tr><td>ID</td><td class="locator-cell">${message.data['ID']}</td></tr>
                    <tr><td>CSS</td><td class="locator-cell">${message.data['CSS']}</td></tr>
                    <tr><td>XPath</td><td class="locator-cell">${message.data['XPATH']}</td></tr>
                    <tr><td>Shadow Host</td><td>${message.data['In Shadow DOM'] ? `<span class="shadow-badge" title="Host: ${message.data['Host Element Path']}">${message.data['Host Element Path'] || 'Yes'}</span>` : 'No'}</td></tr>
                </table>`;
            // Add copy/highlight buttons for the single inspected element
            const bestLocator = message.data['Best Locator'];
            const cssPathForHighlight = message.data['Host Element Path'] ? message.data['CSS'] : bestLocator; // Use combined CSS path for shadow
            const isInShadow = message.data['In Shadow DOM'] || (message.data['Host Element Path'] && message.data['Host Element Path'].length > 0);

            inspectedElementDetailsDiv.innerHTML += `
                <div style="margin-top: 5px; text-align:center;">
                    <button class="copy-btn" data-copy="${bestLocator}" title="Copy Best Locator">📋 Copy Best</button>
                    <button class="hl-btn" 
                            data-hl="${cssPathForHighlight}"
                            data-shadow="${isInShadow ? 'true' : 'false'}"
                            title="Highlight element">👁️ Highlight</button>
                </div>`;
            
            inspectedElementDetailsDiv.style.display = 'block';
            requestAnimationFrame(() => bindTablePreviewButtons()); // Re-bind for these new buttons
            inspectorStatusDiv.textContent = 'Element Inspected!';
        } else {
            inspectorStatusDiv.textContent = 'Inspection did not return element data.';
        }

        // Reset inspect mode in popup
        isInspectingGlobal = false;
        if(inspectElementBtn) {
            inspectElementBtn.classList.remove('inspecting');
            inspectElementBtn.textContent = '🔬 Inspect Element';
        }
        sendResponse({status: "popupReceivedData"}); // Acknowledge receipt
    }
    // Keep the listener open for other messages if this is not the only one
    // return true; // Only if you need to send an async response from this listener
});
```

**Step 4: Update `contentScript.js` to Handle Inspect Mode**

Your current `contentScript.js` is very basic. We'll expand it significantly.

```javascript
// contentScript.js

// Ensure this script doesn't run multiple times causing stacked listeners
if (!window.aiExtractorContentScriptLoaded) {
  window.aiExtractorContentScriptLoaded = true;

  let inspectModeActive = false;
  let highlightedElement = null;
  const highlightOutline = '2px dashed #f05d22'; // Bright orange for inspection highlight

  // Listener for messages from the popup
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "startInspectingAiExtractor") {
      startInspecting();
      sendResponse({status: "listening"}); // Let popup know it's active
      return true; // Indicate async response potentially, or that it's handled.
    } else if (message.action === "stopInspectingAiExtractor") {
      stopInspecting();
      sendResponse({status: "stopped"});
      return true;
    }
    // return true; // Important if you have other async paths in this listener
  });

  function startInspecting() {
    if (inspectModeActive) return;
    inspectModeActive = true;
    console.log("Element AI Extractor: Inspect mode STARTED.");
    document.addEventListener('mouseover', handleMouseOver, true);
    document.addEventListener('mouseout', handleMouseOut, true);
    document.addEventListener('click', handleClick, true); // Use capturing phase
  }

  function stopInspecting() {
    if (!inspectModeActive) return;
    inspectModeActive = false;
    console.log("Element AI Extractor: Inspect mode STOPPED.");
    document.removeEventListener('mouseover', handleMouseOver, true);
    document.removeEventListener('mouseout', handleMouseOut, true);
    document.removeEventListener('click', handleClick, true);
    clearHighlight();
  }

  function handleMouseOver(event) {
    if (!inspectModeActive) return;
    clearHighlight(); // Clear previous highlight
    highlightedElement = event.target;
    if (highlightedElement) {
      highlightedElement.style.outline = highlightOutline;
      highlightedElement.style.outlineOffset = "2px"; // Make it more visible
    }
  }

  function handleMouseOut(event) {
    if (!inspectModeActive) return;
    clearHighlight();
  }

  function clearHighlight() {
    if (highlightedElement) {
      highlightedElement.style.outline = '';
      highlightedElement.style.outlineOffset = '';
      highlightedElement = null;
    }
  }

  async function handleClick(event) {
    if (!inspectModeActive) return;
    
    event.preventDefault();
    event.stopPropagation(); // Stop event from bubbling further or triggering default actions

    const clickedElement = event.target;
    console.log("Element AI Extractor: Element clicked for inspection:", clickedElement);
    clearHighlight(); // Clear highlight from mouseover

    // #IMPORTANT: Here you need to call a function similar to `domExtractionFunction`
    // but modified to process ONLY the `clickedElement`.
    // This function needs access to isVisible, getUniqueCssSelector, getXPath, 
    // getBestLocator, getElementDisplayName, getElementTypeName, and the shadow/iframe logic.
    // For simplicity, we'll send a request to the background to execute this logic
    // in the target tab's context, using the `domExtractionFunction` itself,
    // but with a special filter to target only the clicked element.
    // This is complex. A more direct approach is to duplicate/adapt the core logic here.

    // Let's try to adapt and call the core logic directly within content script
    // We need to pass a 'targetElement' to a modified domExtractionFunction
    // or have a dedicated 'extractSingleElementDetails' function.

    // For now, let's assume you have a way to get the 'filters' object or relevant parts.
    // A simple approach:
    const elementDetails = extractSingleElementDetails(clickedElement, {
        // Pass any relevant global filter states if needed for locator generation,
        // e.g., for getBestLocator if it depends on global uniqueness rather than just context.
        // For a single element, many filters like selectedTypes are less relevant.
        // shadowDOM filter is still relevant for pathing.
        shadowDOM: true // Assume we always want to resolve shadow path for inspector
    });


    // Send the data back to the popup
    chrome.runtime.sendMessage({
      action: "inspectedElementDataAiExtractor",
      data: elementDetails
    });

    stopInspecting(); // Stop inspect mode after click
    return false; // Further stop propagation
  }

  // #SECTION: Single Element Extraction Logic (Adapted from domExtractionFunction parts)
  // This needs to be self-contained or have its helpers available in this scope.
  // This is a simplified version and NEEDS the helper functions (isVisible, getUniqueCssSelector etc.)
  // to be defined in this contentScript.js scope OR be passed from popup via executeScript.
  // For a robust solution, you'd likely re-inject a script with all necessary functions
  // targeted at this specific element.
  //
  // Current approach: define simplified versions or make them available.
  // For this example, I'll assume the core helper functions are defined below or available.

  function extractSingleElementDetails(targetElement, globalFilters) {
    if (!targetElement) return null;

    // --- Define or ensure availability of helper functions ---
    // These would be copies/adaptations of those in popup.js's domExtractionFunction
    // For brevity, I'll just list them. They need to be implemented here.
    // function isVisible(el) { ... }
    // function getUniqueCssSelector(el, contextNode) { ... }
    // function getXPath(el, contextNode) { ... }
    // function getBestLocator(el, contextNode) { ... }
    // function getElementDisplayName(el) { ... }
    // function getElementTypeName(el) { ... }
    // function _findPathToShadowHost(el) { ... } // New helper to find host path

    // Dummy implementations for now - YOU MUST REPLACE THESE WITH ACTUAL LOGIC
    // COPIED/ADAPTED FROM YOUR popup.js domExtractionFunction's helpers
    const isVisible = (el) => {
        if (!el || typeof el.getBoundingClientRect !== 'function') return false;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0) return false;
        const style = window.getComputedStyle(el);
        return style && style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    };
    const getUniqueCssSelector = (el, contextNode = document) => el.id ? `#${CSS.escape(el.id)}` : el.tagName.toLowerCase(); // VERY SIMPLIFIED
    const getXPath = (el, contextNode = document) => el.id ? `//*[@id="${el.id}"]` : `//${el.tagName.toLowerCase()}`; // VERY SIMPLIFIED
    const getBestLocator = (el, contextNode = document) => ({ type: 'id_or_tag', locator: getUniqueCssSelector(el, contextNode), reason: 'simplified' }); // VERY SIMPLIFIED
    const getElementDisplayName = (el) => el.textContent.trim().slice(0,30) || el.tagName; // VERY SIMPLIFIED
    const getElementTypeName = (el) => el.tagName; // VERY SIMPLIFIED


    // --- Logic to determine context, host path for the targetElement ---
    let contextNode = document;
    let isShadowContext = false;
    let hostPathArray = [];

    let current = targetElement;
    let pathSegmentsToElement = []; // Path from its direct shadow host or document

    // Traverse up to find if it's in a shadow root and build path to host(s)
    // This is complex and needs robust implementation.
    // The _extractElementsRecursive already has logic for currentHostPathArray.
    // We need a function to determine this for a single clicked element.
    
    // Placeholder for determining context and host path
    // Ideally, you'd have a function: getElementContextAndPath(targetElement)
    // which returns { finalContextNode, isFinalContextShadow, hostPathArrayToFinalContext, localElementPath }

    // For now, let's assume targetElement is in the main document for simplicity of this example part
    // A full implementation needs to replicate the pathing logic from _extractElementsRecursive
    // or call a specialized version of it.

    // --- Simplified data collection for the targetElement ---
    if (globalFilters.visibleOnly && !isVisible(targetElement)) return null;
    // No hiddenOnly check for single inspect, user clicked it so it was likely visible.

    let localId = targetElement.id || '';
    // For single element inspection, contextNode for locator functions should be its immediate root (document or shadowRoot)
    let elementRootNode = targetElement.getRootNode ? targetElement.getRootNode() : document;
    if (elementRootNode.nodeType !== Node.DOCUMENT_NODE && elementRootNode.nodeType !== Node.DOCUMENT_FRAGMENT_NODE) {
        elementRootNode = document; // Fallback if getRootNode is unusual
    }

    let localCssSelector = getUniqueCssSelector(targetElement, elementRootNode);
    let localXPath = getXPath(targetElement, elementRootNode);
    let bestLocatorInfo = getBestLocator(targetElement, elementRootNode);

    // Determine full path if inside shadow DOM (needs robust implementation)
    // This is a placeholder - you need a robust function here.
    // Let's assume 'hostPathArray' would be populated by a call to something like:
    // hostPathArray = determineHostPathForElement(targetElement);
    // isShadowContext = hostPathArray.length > 0;


    // For this PoC, we'll skip the complex host path reconstruction for the single element
    // and assume locators are relative to the main document or its direct shadow root.
    // A full solution needs to properly build the host path for the clicked element.
    isShadowContext = (targetElement.getRootNode() instanceof ShadowRoot);
    let hostPathStringForDisplay = ""; // Placeholder
    let finalCssSelector = localCssSelector;
    let finalBestLocator = bestLocatorInfo.locator;

    if(isShadowContext){
        // Need to get path to host, then combine. This is the hard part for single element.
        // For now, let's assume the local selector is what we display and note it's shadow.
        // A proper solution would involve traversing up from targetElement.getRootNode().host
        // using getUniqueCssSelector(host, host.getRootNode()) recursively.
        hostPathStringForDisplay = "[Path to Host Needed]"; // Placeholder
        finalCssSelector = `${hostPathStringForDisplay} >> ${localCssSelector}`;
        finalBestLocator = `${hostPathStringForDisplay} >> ${bestLocatorInfo.locator}`;
    }


    return {
      'Element Name': getElementDisplayName(targetElement),
      'Element Type': getElementTypeName(targetElement),
      'Best Locator': finalBestLocator,
      'Locator Type': bestLocatorInfo.type,
      'Why Best': bestLocatorInfo.reason,
      ID: localId,
      CSS: finalCssSelector, // Will be prefixed if in shadow
      XPATH: localXPath,     // Local XPath
      'In Shadow DOM': isShadowContext,
      'Host Element Path': hostPathStringForDisplay
    };
  }


  // --- End of AI Extractor Content Script Initialisation ---
  console.log("Element AI Extractor: Content script loaded and inspect listeners ready to be activated.");

} else {
  // console.log("Element AI Extractor: Content script already loaded.");
}
```

**Explanation of `contentScript.js` Changes:**

* **`aiExtractorContentScriptLoaded` flag:** Prevents multiple listener attachments if the script is injected multiple times.
* **`inspectModeActive` flag:** Tracks state.
* **Message Listener:** Listens for `"startInspectingAiExtractor"` and `"stopInspectingAiExtractor"`.
* **`startInspecting()` / `stopInspecting()`:** Add/remove global event listeners for mouse actions.
* **`handleMouseOver()` / `handleMouseOut()` / `clearHighlight()`:** Provide visual feedback by outlining the element under the cursor.
* **`handleClick()`:**
    * Prevents default click behavior.
    * This is where the **CORE LOGIC** for inspecting the single `event.target` needs to go.
    * **#IMPORTANT SIMPLIFICATION:** The `extractSingleElementDetails` function above is a placeholder. You need to **copy and adapt the actual helper functions** (`isVisible`, `getUniqueCssSelector`, `getXPath`, `getBestLocator`, `getElementDisplayName`, `getElementTypeName`) from your `popup.js` `domExtractionFunction` into this `contentScript.js` so they are available here. You also need a robust way to determine the `hostPathArray` for the clicked element if it's in a shadow DOM. This is non-trivial for a single element without the full recursive context.
    * Sends the collected data back to the popup.
    * Stops inspect mode.

**Next Steps for You:**

1.  **Update `popup.html` and `popup.css`** with the new button and styles.
2.  **Update `popup.js`** with the `isInspectingGlobal` variable, the event listener for the inspect button, and the `chrome.runtime.onMessage.addListener` for `"inspectedElementDataAiExtractor"`.
3.  **Replace your `contentScript.js`** with the new version.
4.  **Crucially, implement the helper functions inside `contentScript.js`'s `extractSingleElementDetails` function.** Copy the logic from `domExtractionFunction`'s helpers (`isVisible`, `getUniqueCssSelector`, `getXPath`, `getBestLocator`, `getElementDisplayName`, `getElementTypeName`) and adapt them to work within the content script's scope.
    * The most complex part will be correctly determining the `hostPathArray` and `isShadowContext` for the single `clickedElement`. You might need a new helper function like `_getElementContextInfo(element)` that walks up `element.getRootNode().host` and builds the path.
5.  **Test the inspect mode toggle:**
    * Click "Inspect Element." Does the button change? Do you see logs from `contentScript.js` saying "Inspect mode STARTED"?
    * Move your mouse over elements on the page. Do they get highlighted?
    * Click "Stop Inspecting." Does it stop?
6.  **Test the click-to-inspect (after implementing helpers in `contentScript.js`):**
    * Click an element. Do you see its (simplified for now) details appear in the popup?

This "Inspect" feature is a significant addition. The most challenging part will be accurately replicating the context-aware locator generation logic from `domExtractionFunction` for a single, arbitrarily clicked element within `contentScript.js`.

Let's start by getting the mode toggling and mouseover highlighting working. Then we can focus on the `extractSingleElementDetails` logic.