Absolutely! Here’s your **complete, robust, refactored Chrome extension** for “Element AI Extractor”—with clear variable names, improved error handling, and never gets stuck on “Scanning elements…”!

---

# **1. manifest.json**

```json
{
  "manifest_version": 3,
  "name": "Element AI Extractor",
  "version": "1.0.0",
  "description": "Extract and export element locators from any web page—powered by AI-inspired logic.",
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  },
  "permissions": [
    "activeTab",
    "scripting",
    "storage"
  ],
  "host_permissions": ["<all_urls>"]
}
```

---

# **2. popup.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Element AI Extractor</title>
  <link rel="stylesheet" href="popup.css" />
</head>
<body>
  <div class="container">
    <h2>Element AI Extractor 🤖✨</h2>
    <div class="tip" id="ai-tip"></div>
    <input id="search" type="text" placeholder="🔍 Search elements..." />

    <div class="filters">
      <label><input type="checkbox" id="filterAll" checked>All Elements</label>
      <label><input type="checkbox" id="filterLinks">Links</label>
      <label><input type="checkbox" id="filterButtons">Buttons</label>
      <label><input type="checkbox" id="filterInputs">Inputs</label>
      <label><input type="checkbox" id="filterCombo">Combo</label>
      <label><input type="checkbox" id="filterHeaders">Headers</label>
      <label><input type="checkbox" id="filterTextboxes">Textboxes</label>
      <label><input type="checkbox" id="filterCheckboxes">Checkboxes</label>
      <label><input type="checkbox" id="filterRadios">Radios</label>
      <label><input type="checkbox" id="filterLists">Lists</label>
      <label><input type="checkbox" id="filterForms">Forms</label>
      <label><input type="checkbox" id="filterSVG">SVG</label>
      <label><input type="checkbox" id="filterTables">Tables</label>
      <label><input type="checkbox" id="filterSpans">Spans</label>
      <label><input type="checkbox" id="filterDivs">Divs</label>
      <label><input type="checkbox" id="filterCustom">Custom Elements</label>
      <label><input type="checkbox" id="filterShadow">Shadow DOM</label>
    </div>

    <div class="toggles">
      <label>Visible Only <input type="checkbox" id="filterVisible" checked></label>
      <label>Hidden Only <input type="checkbox" id="filterHidden"></label>
    </div>
    
    <button id="extract">Extract Elements (CSV)</button>
    <div id="status"></div>
    <div id="preview"></div>
    <footer>by AI Synergy Labs</footer>
  </div>
  <script src="popup.js"></script>
</body>
</html>
```

---

# **3. popup.css**

```css
body {
  background: #21243c;
  color: #e7ecfa;
  font-family: 'Segoe UI', Arial, sans-serif;
  margin: 0;
  min-width: 420px;
}
.container {
  padding: 22px 18px 12px 18px;
  max-width: 480px;
}
h2 {
  margin-top: 0;
  color: #6fc3fb;
  letter-spacing: 1px;
}
.tip {
  background: #2b2f4a;
  color: #7ee0ff;
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 10px;
  font-style: italic;
  font-size: 1em;
}
input[type="text"] {
  width: 99%;
  padding: 7px 12px;
  margin-bottom: 9px;
  border-radius: 6px;
  border: none;
  outline: none;
  font-size: 1em;
  background: #23274b;
  color: #f1f7fe;
}
.filters,
.toggles {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-bottom: 11px;
}
.filters label,
.toggles label {
  font-size: 0.98em;
  user-select: none;
}
button#extract {
  background: #388bff;
  color: #fff;
  font-size: 1.11em;
  border: none;
  border-radius: 12px;
  padding: 13px 0;
  width: 100%;
  margin: 10px 0 5px 0;
  font-weight: bold;
  letter-spacing: 0.04em;
  box-shadow: 0 2px 12px #1a1b2c33;
  cursor: pointer;
  transition: background 0.13s;
}
button#extract:disabled {
  background: #273a5e;
  cursor: not-allowed;
}
#preview {
  margin-top: 10px;
  max-height: 340px;
  overflow-y: auto;
}
table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  font-size: 0.99em;
  background: #23244b;
  border-radius: 7px;
  overflow: hidden;
}
th, td {
  padding: 5px 6px;
  border-bottom: 1px solid #39446e;
  text-align: left;
}
th {
  background: #304070;
  color: #b1e5fe;
}
tr:last-child td {
  border-bottom: none;
}
.copy-btn, .hl-btn {
  background: none;
  border: none;
  font-size: 1.16em;
  cursor: pointer;
}
.el-badge {
  background: #388bff22;
  color: #63cdff;
  border-radius: 5px;
  padding: 2px 6px;
  font-size: 0.94em;
  margin-right: 2px;
}
.shadow-badge {
  background: #9c5dff;
  color: #fff;
  border-radius: 5px;
  padding: 2px 7px;
  font-size: 0.92em;
}
footer {
  margin: 20px 0 6px 0;
  text-align: center;
  font-size: 1em;
  color: #6a7694;
  letter-spacing: 1px;
}
#status {
  font-size: 1.02em;
  min-height: 1.2em;
  margin: 10px 0 0 0;
  color: #ffd12a;
}
.loading {
  color: #ffd12a;
}
```

---

# **4. popup.js** (with fail-safe, error checks, clear naming)

```javascript
// AI Tips!
const aiTips = [
  "AI Tip: IDs are the most stable selectors—use them if available!",
  "Did you know? XPath can find elements without IDs or classes.",
  "Pro tip: Prefer visible elements for automation—hidden ones may change.",
  "AI Tip: Use CSS selectors for faster automation scripts.",
  "Did you know? [role] and [aria-label] improve accessibility and test stability.",
  "AI Tip: Interactable (clickable) elements are best for automation.",
  "Pro tip: Combine CSS classes for more unique selectors.",
  "Did you know? XPath lets you select by text, attribute, or position.",
  "AI Tip: Filter by element type for faster locator selection."
];

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('ai-tip').textContent = aiTips[Math.floor(Math.random() * aiTips.length)];
  if(document.getElementById("filterAll").checked) {
    elementTypeDefs.forEach(def => document.getElementById(def.id).checked = true);
  }
  chrome.storage.local.get(['lastExtractedElements'], res => {
    if (res.lastExtractedElements && Array.isArray(res.lastExtractedElements)) {
      renderPreviewTable(res.lastExtractedElements);
      document.getElementById('status').textContent = 'Previous extraction loaded.';
    }
  });
});

const elementTypeDefs = [
  { id: 'filterLinks', label: 'Links', selector: 'a', badge: 'LINK' },
  { id: 'filterButtons', label: 'Buttons', selector: "button,input[type='button'],input[type='submit']", badge: 'BTN' },
  { id: 'filterInputs', label: 'Inputs', selector: 'input,select,textarea', badge: 'INPUT' },
  { id: 'filterCombo', label: 'Combo', selector: "select,[role='combobox']", badge: 'COMBO' },
  { id: 'filterHeaders', label: 'Headers', selector: 'h1,h2,h3,h4,h5,h6', badge: 'HDR' },
  { id: 'filterTextboxes', label: 'Textboxes', selector: "input[type='text'],input[type='search'],input[type='email'],input[type='url'],input[type='password']", badge: 'TXT' },
  { id: 'filterCheckboxes', label: 'Checkboxes', selector: "input[type='checkbox']", badge: 'CHK' },
  { id: 'filterRadios', label: 'Radios', selector: "input[type='radio']", badge: 'RADIO' },
  { id: 'filterLists', label: 'Lists', selector: 'ul,ol,li,dl,dt,dd', badge: 'LIST' },
  { id: 'filterForms', label: 'Forms', selector: 'form', badge: 'FORM' },
  { id: 'filterSVG', label: 'SVG', selector: 'svg', badge: 'SVG' },
  { id: 'filterTables', label: 'Tables', selector: 'table,thead,tbody,tr,td,th', badge: 'TABLE' },
  { id: 'filterSpans', label: 'Spans', selector: 'span', badge: 'SPAN' },
  { id: 'filterDivs', label: 'Divs', selector: 'div', badge: 'DIV' },
  { id: 'filterCustom', label: 'Custom Elements', selector: '*', badge: 'CUSTOM', custom: true }
];

const allElementsCheckbox = document.getElementById('filterAll');
allElementsCheckbox.addEventListener('change', function () {
  elementTypeDefs.forEach(def => document.getElementById(def.id).checked = this.checked);
});
elementTypeDefs.forEach(def => {
  document.getElementById(def.id).addEventListener('change', function () {
    if (!this.checked) allElementsCheckbox.checked = false;
    else allElementsCheckbox.checked = elementTypeDefs.every(def => document.getElementById(def.id).checked);
  });
});

document.getElementById('filterVisible').addEventListener('change', function () {
  if (this.checked) document.getElementById('filterHidden').checked = false;
});
document.getElementById('filterHidden').addEventListener('change', function () {
  if (this.checked) document.getElementById('filterVisible').checked = false;
});

function getCurrentFilters() {
  return {
    types: elementTypeDefs.filter(def => document.getElementById(def.id).checked).map(def => def.id),
    shadow: document.getElementById('filterShadow').checked,
    visible: document.getElementById('filterVisible').checked,
    hidden: document.getElementById('filterHidden').checked
  };
}
async function getCurrentTabInfo() {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  try {
    const url = new URL(tab.url);
    return {hostname: url.hostname, tabId: tab.id};
  } catch (e) {
    return {hostname: 'site', tabId: tab.id};
  }
}
function elementNameMatchesSearch(elementName, search) {
  if (!search) return true;
  return (elementName || '').toLowerCase().includes(search.toLowerCase());
}
function copyToClipboard(text) {
  navigator.clipboard.writeText(text);
}
function highlightElement(tabId, locator, isInShadowDom) {
  chrome.scripting.executeScript({
    target: {tabId},
    args: [locator, isInShadowDom],
    func: (locator, isInShadowDom) => {
      let element = null;
      if (isInShadowDom) {
        function searchAllShadowRoots(node, selector) {
          if (!node) return null;
          if (node.querySelector) {
            let found = node.querySelector(selector);
            if (found) return found;
          }
          let children = node.children || [];
          for (let child of children) {
            if (child.shadowRoot) {
              let found = searchAllShadowRoots(child.shadowRoot, selector);
              if (found) return found;
            }
          }
          return null;
        }
        element = searchAllShadowRoots(document, locator);
      } else {
        if (locator.startsWith('#')) {
          element = document.querySelector(locator);
        } else if (locator.startsWith('/')) {
          let r = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          element = r.singleNodeValue;
        } else {
          element = document.querySelector(locator);
        }
      }
      if (element) {
        element.scrollIntoView({behavior: 'smooth', block: 'center'});
        element.style.outline = '3px solid #48b5f3';
        setTimeout(() => { element.style.outline = ''; }, 1600);
      }
    }
  });
}
async function downloadAsCSV(extractedElements, filename) {
  const keys = ['Element Name', 'Element Type', 'Best Locator', 'ID', 'CSS', 'XPATH', 'In Shadow DOM'];
  const csv = [keys.join(',')]
    .concat(extractedElements.map(row => keys.map(k => `"${(row[k] + '').replace(/"/g, '""')}"`).join(',')))
    .join('\n');
  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  document.getElementById('status').textContent = `Your locators are ready: ${filename}`;
}

document.getElementById('extract').onclick = async () => {
  let extractBtn = document.getElementById('extract');
  extractBtn.disabled = true;
  document.getElementById('status').innerHTML = '<span class="loading">Scanning elements...</span>';
  document.getElementById('preview').innerHTML = '';
  const filters = getCurrentFilters();
  const {hostname, tabId} = await getCurrentTabInfo();

  // ----------- FAIL-SAFE TIMEOUT -----------
  let extractionTimeout = setTimeout(() => {
    document.getElementById('status').textContent = "Extraction failed or blocked on this page.";
    extractBtn.disabled = false;
  }, 8000);

  chrome.scripting.executeScript(
    {
      target: {tabId},
      args: [filters],
      func: extractionFilters => {
        const filterTypeToSelector = {
          filterLinks: 'a',
          filterButtons: "button,input[type='button'],input[type='submit']",
          filterInputs: 'input,select,textarea',
          filterCombo: "select,[role='combobox']",
          filterHeaders: 'h1,h2,h3,h4,h5,h6',
          filterTextboxes: "input[type='text'],input[type='search'],input[type='email'],input[type='url'],input[type='password']",
          filterCheckboxes: "input[type='checkbox']",
          filterRadios: "input[type='radio']",
          filterLists: 'ul,ol,li,dl,dt,dd',
          filterForms: 'form',
          filterSVG: 'svg',
          filterTables: 'table,thead,tbody,tr,td,th',
          filterSpans: 'span',
          filterDivs: 'div',
          filterCustom: '*'
        };
        function getAllElementsWithShadowDom(rootNode, isInsideShadowDom = false) {
          let collectedElements = [];
          let traversalQueue = [{root: rootNode, shadow: isInsideShadowDom}];
          while (traversalQueue.length) {
            let {root, shadow} = traversalQueue.shift();
            let elements = Array.from(root.querySelectorAll('*'));
            for (let element of elements) {
              collectedElements.push({element, shadow});
              if (element.shadowRoot) {
                traversalQueue.push({root: element.shadowRoot, shadow: true});
              }
            }
          }
          return collectedElements;
        }
        function isElementVisible(element) {
          const computedStyle = window.getComputedStyle(element);
          return computedStyle && computedStyle.display !== 'none' && computedStyle.visibility !== 'hidden' && element.offsetParent !== null;
        }
        function getUniqueCssSelector(element) {
          if (element.id) return `#${element.id}`;
          let path = [], parent;
          while (element.nodeType === Node.ELEMENT_NODE) {
            let selector = element.nodeName.toLowerCase();
            if (element.className) selector += '.' + [...element.classList].join('.');
            parent = element.parentNode;
            let siblings = parent ? [...parent.children].filter(e => e.nodeName === element.nodeName) : [];
            if (siblings.length > 1) selector += `:nth-child(${[...parent.children].indexOf(element) + 1})`;
            path.unshift(selector);
            element = parent;
            if (!element || element === document.body) break;
          }
          return path.join(' > ');
        }
        function getXPathSelector(element) {
          if (element.id) return `//*[@id="${element.id}"]`;
          let path = [];
          while (element && element.nodeType === Node.ELEMENT_NODE) {
            let idx = 1, sib = element.previousSibling;
            while (sib) {
              if (sib.nodeType === Node.ELEMENT_NODE && sib.nodeName === element.nodeName) idx++;
              sib = sib.previousSibling;
            }
            path.unshift(element.nodeName.toLowerCase() + '[' + idx + ']');
            element = element.parent
```


Node;
}
return '/' + path.join('/');
}
function getElementDisplayName(element) {
if (element.getAttribute('aria-label')) return element.getAttribute('aria-label');
if (element.getAttribute('alt')) return element.getAttribute('alt');
if (element.getAttribute('placeholder')) return element.getAttribute('placeholder');
if (element.innerText) return element.innerText.trim().replace(/\s+/g, ' ').substring(0, 40);
return element.tagName.toLowerCase();
}
function getBestLocator(element) {
if (element.id) return {type: 'ID', locator: `#${element.id}`};
if (element.getAttribute('name')) return {type: 'Name', locator: `[name="${element.getAttribute('name')}"]`};
if (element.className) return {type: 'CSS', locator: getUniqueCssSelector(element)};
return {type: 'XPath', locator: getXPathSelector(element)};
}
function getElementType(element) {
if (element.matches('a')) return 'LINK';
if (element.matches("button,input\[type='button'],input\[type='submit']")) return 'BTN';
if (element.matches('input,select,textarea')) return 'INPUT';
if (element.matches("select,\[role='combobox']")) return 'COMBO';
if (element.matches('h1,h2,h3,h4,h5,h6')) return 'HDR';
if (element.matches("input\[type='text'],input\[type='search'],input\[type='email'],input\[type='url'],input\[type='password']")) return 'TXT';
if (element.matches("input\[type='checkbox']")) return 'CHK';
if (element.matches("input\[type='radio']")) return 'RADIO';
if (element.matches('ul,ol,li,dl,dt,dd')) return 'LIST';
if (element.matches('form')) return 'FORM';
if (element.matches('svg')) return 'SVG';
if (element.matches('table,thead,tbody,tr,td,th')) return 'TABLE';
if (element.matches('span')) return 'SPAN';
if (element.matches('div')) return 'DIV';
if (element.tagName && element.tagName.includes('-')) return 'CUSTOM';
return element.tagName;
}
let extractedElements = \[];
let allElementsWithShadowInfo = getAllElementsWithShadowDom(document, false);
for (let {element, shadow: isInShadowDom} of allElementsWithShadowInfo) {
if (extractionFilters.types.length && extractionFilters.types.every(type => !element.matches(filterTypeToSelector\[type] || '\*'))) continue;
if (extractionFilters.shadow && !isInShadowDom) continue;
if (!extractionFilters.shadow && isInShadowDom) continue;
if (extractionFilters.visible && !isElementVisible(element)) continue;
if (extractionFilters.hidden && isElementVisible(element)) continue;
let elementName = getElementDisplayName(element);
let elementId = element.id || '';
let cssSelector = getUniqueCssSelector(element);
let xpathSelector = getXPathSelector(element);
let bestSelector = getBestLocator(element);
let elementType = getElementType(element);
extractedElements.push({
'Element Name': elementName,
'Element Type': elementType,
'Best Locator': bestSelector.locator,
'ID': elementId,
'CSS': cssSelector,
'XPATH': xpathSelector,
'In Shadow DOM': isInShadowDom ? 'Yes' : ''
});
}
return extractedElements;
}
},
results => {
clearTimeout(extractionTimeout);

```
  if (!results || !Array.isArray(results) || !results[0] || !results[0].result) {
    document.getElementById('status').textContent = 'No results returned. The site may block content scripts, or there was an error.';
    extractBtn.disabled = false;
    return;
  }

  let extractedElements = results[0].result;
  chrome.storage.local.set({lastExtractedElements: extractedElements});
  if (!extractedElements.length) {
    document.getElementById('status').textContent = 'No elements found.';
    document.getElementById('preview').innerHTML = '';
    extractBtn.disabled = false;
    return;
  }
  document.getElementById('status').textContent = 'Scanned elements!';
  renderPreviewTable(extractedElements);

  let now = new Date();
  let timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
  let filename = `${hostname}_elements_${timestamp}.csv`;
  downloadAsCSV(extractedElements, filename);
  setTimeout(() => (extractBtn.disabled = false), 1200);
}
```

);
};

function renderPreviewTable(extractedElements) {
const search = document.getElementById('search').value;
let filtered = extractedElements.filter(row => elementNameMatchesSearch(row\['Element Name'], search));
let maxRows = 12;
let preview = `<b>Preview (first ${Math.min(maxRows, filtered.length)}):</b>     <table><tr>     <th>Name</th>     <th>Type</th>     <th>Best</th>     <th>ID</th>     <th>CSS</th>     <th>XPATH</th>     <th>Shadow</th>     <th>Copy</th>     <th>Highlight</th></tr>`;
for (let i = 0; i < Math.min(filtered.length, maxRows); ++i) {
let r = filtered\[i];
preview += `<tr>       <td title="${r['Element Name']}">${r['Element Name']}</td>       <td><span class="el-badge">${r['Element Type']}</span></td>       <td title="${r['Best Locator']}">${r['Best Locator']}</td>       <td title="${r['ID']}">${r['ID']}</td>       <td title="${r['CSS']}">${r['CSS']}</td>       <td title="${r['XPATH']}">${r['XPATH']}</td>       <td>${r['In Shadow DOM'] ? `<span class="shadow-badge">Shadow</span>` : ''}</td>       <td><button class="copy-btn" data-copy="${r['Best Locator']}" title="Copy to clipboard">📋</button></td>       <td><button class="hl-btn" data-hl="${r['Best Locator']}" data-shadow="${r['In Shadow DOM'] ? '1' : '0'}" title="Highlight element">👁️</button></td>     </tr>`;
}
preview += '</table>';
document.getElementById('preview').innerHTML = preview;
setTimeout(() => bindPreviewTableButtons(), 200);
}
function bindPreviewTableButtons() {
document.querySelectorAll('.copy-btn').forEach(
btn => (btn.onclick = e => {
let text = e.target.getAttribute('data-copy');
copyToClipboard(text);
btn.textContent = '✅';
setTimeout(() => (btn.textContent = '📋'), 700);
})
);
document.querySelectorAll('.hl-btn').forEach(
btn => (btn.onclick = async e => {
let locator = e.target.getAttribute('data-hl');
let isInShadowDom = e.target.getAttribute('data-shadow') === '1';
const {tabId} = await getCurrentTabInfo();
highlightElement(tabId, locator, isInShadowDom);
btn.textContent = '✨';
setTimeout(() => (btn.textContent = '👁️'), 700);
})
);
}
document.getElementById('search').oninput = function () {
let tableRows = document.querySelectorAll('#preview table tr');
if (!tableRows.length) return;
let text = this.value.trim().toLowerCase();
tableRows.forEach((row, idx) => {
if (idx === 0) return; // header
let name = row\.cells\[0].textContent.toLowerCase();
row\.style.display = !text || name.includes(text) ? '' : 'none';
});
};

```

---

# **5. icon.png**
- Use any AI/robot/automation PNG icon as `icon.png` in your extension folder.

---

## **How to use:**

1. Save these files in a folder (with an icon.png).
2. Go to `chrome://extensions` > Enable “Developer mode”.
3. Click “Load unpacked” and select your folder.
4. Pin and launch the extension!

---

### **Done!**
- Beautiful, reliable UI.
- Robust extraction—never gets stuck.
- CSV export, copy/highlight, persistent preview.

Let me know if you want a **ready-to-go ZIP** or want to add more “AI” features! 🚀
```
