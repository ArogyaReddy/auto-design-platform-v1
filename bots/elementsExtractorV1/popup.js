// === Element AI Extractor - popup.js ===

// ---- AI Tip List ----
const aiTips = ['Did you know? [role] and [aria-label] improve accessibility and test stability.', 'AI Tip: Interactable (clickable) elements are best for automation.', 'Pro tip: Prefer visible elements for automation—hidden ones may change.', 'AI Tip: IDs are the most stable selectors—use them if available!', 'AI Tip: XPath lets you select by text, attribute, or position.', 'AI Tip: Use CSS selectors for faster automation scripts.', 'AI Tip: Filter by element type for faster locator selection.', 'Pro tip: Combine CSS classes for more unique selectors.'];

// ---- On Load: Setup UI, Restore Table ----
document.addEventListener('DOMContentLoaded', () => {
  // Show random tip at top
  document.getElementById('ai-tip').textContent = aiTips[Math.floor(Math.random() * aiTips.length)];

  // Make only "All Elements" checked initially; others unchecked
  document.getElementById('filterAll').checked = true;
  elementTypeList.forEach(type => (document.getElementById(type.id).checked = false));

  // Restore last data (if any) from storage for user
  chrome.storage.local.get(['lastExtractedData'], res => {
    if (res.lastExtractedData && Array.isArray(res.lastExtractedData)) {
      renderElementsTable(res.lastExtractedData);
      document.getElementById('status').textContent = 'Previous extraction loaded.';
    }
  });
});

// ---- Supported Element Types ----
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
  {id: 'filterCustom', label: 'Custom Elements', selector: '*'}
];

// ---- ALL ELEMENTS toggle logic ----
const filterAllBox = document.getElementById('filterAll');
filterAllBox.addEventListener('change', function () {
  elementTypeList.forEach(type => {
    document.getElementById(type.id).checked = this.checked;
  });
});
elementTypeList.forEach(type => {
  document.getElementById(type.id).addEventListener('change', function () {
    if (!this.checked) filterAllBox.checked = false;
    else filterAllBox.checked = elementTypeList.every(type => document.getElementById(type.id).checked);
  });
});

// ---- Visible/Hidden mutually exclusive logic ----
document.getElementById('filterVisible').addEventListener('change', function () {
  if (this.checked) document.getElementById('filterHidden').checked = false;
});
document.getElementById('filterHidden').addEventListener('change', function () {
  if (this.checked) document.getElementById('filterVisible').checked = false;
});

// ---- Utility: Get Filters State from UI ----
function getCurrentFilters() {
  return {
    selectedTypes: elementTypeList.filter(type => document.getElementById(type.id).checked).map(type => type.id),
    shadowDOM: document.getElementById('filterShadow').checked,
    visibleOnly: document.getElementById('filterVisible').checked,
    hiddenOnly: document.getElementById('filterHidden').checked
  };
}

// ---- Utility: Get current active tab info ----
async function getCurrentTabInfo() {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  try {
    const url = new URL(tab.url);
    return {hostname: url.hostname, tabId: tab.id};
  } catch (e) {
    return {hostname: 'site', tabId: tab.id};
  }
}

// ---- Utility: Case-insensitive match for search ----
function nameMatchesSearch(name, search) {
  if (!search) return true;
  return (name || '').toLowerCase().includes(search.toLowerCase());
}

// ---- Utility: Clipboard Copy ----
function copyLocatorToClipboard(text) {
  navigator.clipboard.writeText(text);
}

// ---- Utility: Highlight Element on Tab ----
function highlightElementOnTab(tabId, locator, inShadowDOM) {
  chrome.scripting.executeScript({
    target: {tabId},
    args: [locator, inShadowDOM],
    func: (locator, inShadowDOM) => {
      let el = null;
      if (inShadowDOM) {
        function searchShadowRoots(node, selector) {
          if (!node) return null;
          if (node.querySelector) {
            let found = node.querySelector(selector);
            if (found) return found;
          }
          let children = node.children || [];
          for (let child of children) {
            if (child.shadowRoot) {
              let found = searchShadowRoots(child.shadowRoot, selector);
              if (found) return found;
            }
          }
          return null;
        }
        el = searchShadowRoots(document, locator);
      } else {
        if (locator.startsWith('#')) {
          el = document.querySelector(locator);
        } else if (locator.startsWith('/')) {
          let r = document.evaluate(locator, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          el = r.singleNodeValue;
        } else {
          el = document.querySelector(locator);
        }
      }
      if (el) {
        el.scrollIntoView({behavior: 'smooth', block: 'center'});
        el.style.outline = '3px solid #48b5f3';
        setTimeout(() => {
          el.style.outline = '';
        }, 1500);
      }
    }
  });
}

// ---- CSV Download Helper ----
function downloadCSVFile(elementList, filename) {
  const headers = ['Element Name', 'Element Type', 'Best Locator', 'ID', 'CSS', 'XPATH', 'In Shadow DOM'];
  const csvRows = [headers.join(',')].concat(elementList.map(row => headers.map(h => `"${(row[h] + '').replace(/"/g, '""')}"`).join(',')));
  const blob = new Blob([csvRows.join('\n')], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  document.getElementById('status').textContent = `Your locators are ready: ${filename}`;
}

// ---- MAIN: Extraction Button Click Handler ----
document.getElementById('extract').onclick = async () => {
  let extractBtn = document.getElementById('extract');
  extractBtn.disabled = true;
  document.getElementById('status').innerHTML = '<span class="loading">Scanning elements...</span>';
  document.getElementById('preview').innerHTML = '';
  const filters = getCurrentFilters();
  const {hostname, tabId} = await getCurrentTabInfo();

  // --- Fail-safe timeout: never hang!
  let failTimeout = setTimeout(() => {
    document.getElementById('status').innerHTML = '❌ Could not extract elements. Try on a regular website.';
    extractBtn.disabled = false;
  }, 9000);

  // -- The DOM extraction runs inside the page context
  chrome.scripting.executeScript(
    {
      target: {tabId},
      args: [filters],
      func: domExtractionFunction
    },
    results => {
      clearTimeout(failTimeout);

      if (!results || !results[0] || !results[0].result) {
        document.getElementById('status').textContent = '❌ Injection or extraction failed!';
        extractBtn.disabled = false;
        return;
      }

      if (chrome.runtime.lastError) {
        document.getElementById('status').textContent = '❌ Script injection failed: ' + chrome.runtime.lastError.message;
        extractBtn.disabled = false;
        return;
      }
      if (!results || !Array.isArray(results) || !results[0] || !results[0].result) {
        document.getElementById('status').textContent = '❌ Extraction failed or blocked on this page.';
        extractBtn.disabled = false;
        return;
      }
      let elementDataList = results[0].result;
      // Save latest result for preview even if popup is closed
      chrome.storage.local.set({lastExtractedData: elementDataList});
      if (!elementDataList.length) {
        document.getElementById('status').textContent = 'No elements found.';
        document.getElementById('preview').innerHTML = '';
        extractBtn.disabled = false;
        return;
      }
      document.getElementById('status').textContent = 'Scanned elements!';
      renderElementsTable(elementDataList);
      // Compose filename (hostname + timestamp)
      let now = new Date();
      let timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}_${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}${now.getSeconds().toString().padStart(2, '0')}`;
      let filename = `${hostname}_elements_${timestamp}.csv`;
      downloadCSVFile(elementDataList, filename);
      setTimeout(() => (extractBtn.disabled = false), 1100);
    }
  );
};

/**
 * ---- DOM Extraction Logic (IN-PAGE CONTEXT) ----
 * Gathers and returns all elements per filters from the DOM.
 * Variable and function names are clear and consistent.
 * @param {Object} filters - from UI: {selectedTypes, shadowDOM, visibleOnly, hiddenOnly}
 * @returns {Array<Object>} array of element info
 */

// -- ADVANCED DOM EXTRACTION FUNCTION -- //
// (This function runs inside the page context)
function domExtractionFunction(filters) {
  // Map filters to selectors
  const typeToSelector = {
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

  function isVisible(el) {
    const style = window.getComputedStyle(el);
    return style && style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
  }

  // --- NEW: Get the best, most stable, human-friendly locator for the element ---
  function getBestLocator(el) {
    if (el.id && !el.id.match(/^[0-9]+$/)) return {type: 'ID', locator: `#${el.id}`};

    for (const attr of ['data-testid', 'data-qa', 'data-cy']) {
      if (el.hasAttribute(attr)) return {type: attr, locator: `[${attr}="${el.getAttribute(attr)}"]`};
    }

    if (el.hasAttribute('aria-label')) return {type: 'aria-label', locator: `[aria-label="${el.getAttribute('aria-label')}"]`};
    if (el.hasAttribute('aria-labelledby')) return {type: 'aria-labelledby', locator: `[aria-labelledby="${el.getAttribute('aria-labelledby')}"]`};

    if (el.hasAttribute('role')) {
      const sameRole = document.querySelectorAll(`[role="${el.getAttribute('role')}"]`);
      if (sameRole.length === 1) return {type: 'role', locator: `[role="${el.getAttribute('role')}"]`};
    }

    if (el.classList.length === 1) {
      const className = el.classList[0];
      const sameClass = document.querySelectorAll(`.${className}`);
      if (sameClass.length === 1) return {type: 'class', locator: `.${className}`};
    }

    if (el.innerText && el.innerText.trim().length < 32) {
      const tag = el.tagName;
      const text = el.innerText.trim();
      const allWithText = Array.from(document.querySelectorAll(tag))
        .filter(e => e.innerText.trim() === text);
      if (allWithText.length === 1) return {type: 'text', locator: `${tag}:contains("${text}")`};
    }

    // Fallback: Short CSS
    return {type: 'CSS', locator: getUniqueCssSelector(el)};
  }

  function getUniqueCssSelector(el) {
    if (el.id) return `#${el.id}`;
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE && el !== document.body) {
      let selector = el.nodeName.toLowerCase();
      if (el.className) selector += '.' + Array.from(el.classList).join('.');
      let parent = el.parentNode;
      if (parent) {
        const siblings = Array.from(parent.children).filter(c => c.nodeName === el.nodeName);
        if (siblings.length > 1)
          selector += `:nth-child(${Array.from(parent.children).indexOf(el) + 1})`;
      }
      path.unshift(selector);
      el = el.parentNode;
    }
    return path.join(' > ');
  }

  function getXPath(el) {
    if (el.id) return `//*[@id="${el.id}"]`;
    let path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      let idx = 1, sib = el.previousSibling;
      while (sib) {
        if (sib.nodeType === Node.ELEMENT_NODE && sib.nodeName === el.nodeName) idx++;
        sib = sib.previousSibling;
      }
      path.unshift(el.nodeName.toLowerCase() + `[${idx}]`);
      el = el.parentNode;
    }
    return '/' + path.join('/');
  }

  function getElementDisplayName(el) {
    return (
      el.getAttribute('aria-label') ||
      el.getAttribute('alt') ||
      el.getAttribute('placeholder') ||
      (el.innerText ? el.innerText.trim().replace(/\s+/g, ' ').slice(0, 40) : el.tagName.toLowerCase())
    );
  }

  function getElementTypeName(el) {
    if (el.matches('a')) return 'LINK';
    if (el.matches("button,input[type='button'],input[type='submit']")) return 'BTN';
    if (el.matches('input,select,textarea')) return 'INPUT';
    if (el.matches("select,[role='combobox']")) return 'COMBO';
    if (el.matches('h1,h2,h3,h4,h5,h6')) return 'HDR';
    if (el.matches("input[type='text'],input[type='search'],input[type='email'],input[type='url'],input[type='password']")) return 'TXT';
    if (el.matches("input[type='checkbox']")) return 'CHK';
    if (el.matches("input[type='radio']")) return 'RADIO';
    if (el.matches('ul,ol,li,dl,dt,dd')) return 'LIST';
    if (el.matches('form')) return 'FORM';
    if (el.matches('svg')) return 'SVG';
    if (el.matches('table,thead,tbody,tr,td,th')) return 'TABLE';
    if (el.matches('span')) return 'SPAN';
    if (el.matches('div')) return 'DIV';
    if (el.tagName && el.tagName.includes('-')) return 'CUSTOM';
    return el.tagName;
  }

  // --- Extraction logic ---
  let selectorsString = filters.selectedTypes.map(type => typeToSelector[type] || '*').join(',');
  let domElements = [];
  try {
    domElements = Array.from(document.querySelectorAll(selectorsString));
  } catch (e) {
    domElements = Array.from(document.querySelectorAll('*'));
  }
  domElements = domElements.slice(0, 2000);

  let data = [];
  for (let el of domElements) {
    if (filters.visibleOnly && !isVisible(el)) continue;
    if (filters.hiddenOnly && isVisible(el)) continue;

    // --- ADVANCED: Get best locator and type
    let best = getBestLocator(el);

    data.push({
      'Element Name': getElementDisplayName(el),
      'Element Type': getElementTypeName(el),
      'Best Locator': best.locator,
      'Locator Type': best.type,
      'ID': el.id || '',
      'CSS': getUniqueCssSelector(el),
      'XPATH': getXPath(el),
      'In Shadow DOM': el.getRootNode() instanceof ShadowRoot ? 'Yes' : ''
    });
  }
  return data;
}

// function domExtractionFunction(filters) {
//   // --- Map filters to selectors
//   const typeToSelector = {
//     filterLinks: 'a',
//     filterButtons: "button,input[type='button'],input[type='submit']",
//     filterInputs: 'input,select,textarea',
//     filterCombo: "select,[role='combobox']",
//     filterHeaders: 'h1,h2,h3,h4,h5,h6',
//     filterTextboxes: "input[type='text'],input[type='search'],input[type='email'],input[type='url'],input[type='password']",
//     filterCheckboxes: "input[type='checkbox']",
//     filterRadios: "input[type='radio']",
//     filterLists: 'ul,ol,li,dl,dt,dd',
//     filterForms: 'form',
//     filterSVG: 'svg',
//     filterTables: 'table,thead,tbody,tr,td,th',
//     filterSpans: 'span',
//     filterDivs: 'div',
//     filterCustom: '*'
//   };

//   /**
//    * Checks if an element is visible in the page.
//    * @param {HTMLElement} el
//    * @returns {boolean}
//    */
//   function isVisible(el) {
//     const style = window.getComputedStyle(el);
//     return style && style.display !== 'none' && style.visibility !== 'hidden' && el.offsetParent !== null;
//   }

//   /**
//    * Generates a unique CSS selector for the element.
//    * @param {HTMLElement} el
//    * @returns {string}
//    */
//   function getUniqueCssSelector(el) {
//     if (el.id) return `#${el.id}`;
//     let path = [],
//       parent;
//     while (el.nodeType === Node.ELEMENT_NODE) {
//       let selector = el.nodeName.toLowerCase();
//       if (el.className) selector += '.' + [...el.classList].join('.');
//       parent = el.parentNode;
//       let siblings = parent ? [...parent.children].filter(e => e.nodeName === el.nodeName) : [];
//       if (siblings.length > 1) selector += `:nth-child(${[...parent.children].indexOf(el) + 1})`;
//       path.unshift(selector);
//       el = parent;
//       if (!el || el === document.body) break;
//     }
//     return path.join(' > ');
//   }

//   /**
//    * Generates XPath for the element.
//    * @param {HTMLElement} el
//    * @returns {string}
//    */
//   function getXPath(el) {
//     if (el.id) return `//*[@id="${el.id}"]`;
//     let path = [];
//     while (el && el.nodeType === Node.ELEMENT_NODE) {
//       let idx = 1,
//         sib = el.previousSibling;
//       while (sib) {
//         if (sib.nodeType === Node.ELEMENT_NODE && sib.nodeName === el.nodeName) idx++;
//         sib = sib.previousSibling;
//       }
//       path.unshift(el.nodeName.toLowerCase() + '[' + idx + ']');
//       el = el.parentNode;
//     }
//     return '/' + path.join('/');
//   }

//   /**
//    * Picks best locator: ID > name > CSS > XPath
//    * @param {HTMLElement} el
//    * @returns {{type: string, locator: string}}
//    */
//   function getBestLocatorStrategy(el) {
//     if (el.id) return {type: 'ID', locator: `#${el.id}`};
//     if (el.getAttribute('name')) return {type: 'Name', locator: `[name="${el.getAttribute('name')}"]`};
//     if (el.className) return {type: 'CSS', locator: getUniqueCssSelector(el)};
//     return {type: 'XPath', locator: getXPath(el)};
//   }

//   /**
//    * Returns user-friendly display name for the element.
//    * @param {HTMLElement} el
//    * @returns {string}
//    */
//   function getElementDisplayName(el) {
//     return el.getAttribute('aria-label') || el.getAttribute('alt') || el.getAttribute('placeholder') || (el.innerText ? el.innerText.trim().replace(/\s+/g, ' ').slice(0, 40) : el.tagName.toLowerCase());
//   }

//   /**
//    * Human-readable element type for badges.
//    * @param {HTMLElement} el
//    * @returns {string}
//    */
//   function getElementTypeName(el) {
//     if (el.matches('a')) return 'LINK';
//     if (el.matches("button,input[type='button'],input[type='submit']")) return 'BTN';
//     if (el.matches('input,select,textarea')) return 'INPUT';
//     if (el.matches("select,[role='combobox']")) return 'COMBO';
//     if (el.matches('h1,h2,h3,h4,h5,h6')) return 'HDR';
//     if (el.matches("input[type='text'],input[type='search'],input[type='email'],input[type='url'],input[type='password']")) return 'TXT';
//     if (el.matches("input[type='checkbox']")) return 'CHK';
//     if (el.matches("input[type='radio']")) return 'RADIO';
//     if (el.matches('ul,ol,li,dl,dt,dd')) return 'LIST';
//     if (el.matches('form')) return 'FORM';
//     if (el.matches('svg')) return 'SVG';
//     if (el.matches('table,thead,tbody,tr,td,th')) return 'TABLE';
//     if (el.matches('span')) return 'SPAN';
//     if (el.matches('div')) return 'DIV';
//     if (el.tagName && el.tagName.includes('-')) return 'CUSTOM';
//     return el.tagName;
//   }

//   // ---- Main extraction ----
//   // Compose selectors string for all selected types
//   let selectorsString = filters.selectedTypes.map(type => typeToSelector[type] || '*').join(',');
//   let domElements = [];
//   try {
//     domElements = Array.from(document.querySelectorAll(selectorsString));
//   } catch (e) {
//     domElements = Array.from(document.querySelectorAll('*'));
//   }
//   domElements = domElements.slice(0, 2000); // Performance safety

//   let data = [];
//   for (let el of domElements) {
//     if (filters.visibleOnly && !isVisible(el)) continue;
//     if (filters.hiddenOnly && isVisible(el)) continue;
//     let displayName = getElementDisplayName(el);
//     let id = el.id || '';
//     let cssSelector = getUniqueCssSelector(el);
//     let xpath = getXPath(el);
//     let bestLocator = getBestLocatorStrategy(el);
//     let elementType = getElementTypeName(el);
//     data.push({
//       'Element Name': displayName,
//       'Element Type': elementType,
//       'Best Locator': bestLocator.locator,
//       ID: id,
//       CSS: cssSelector,
//       XPATH: xpath,
//       'In Shadow DOM': '' // Shadow DOM feature could be added here later
//     });
//   }
//   return data;
// }



// ---- RENDER: Table of elements (Preview) ----


//TODO: ---
function renderElementsTable(data) {
  const search = document.getElementById('search').value;
  let filteredData = data.filter(row => nameMatchesSearch(row['Element Name'], search));
  let maxRows = 12;
  let previewHTML = `<b>Preview (first ${Math.min(maxRows, filteredData.length)}):</b>
    <table><tr>
    <th>Name</th>
    <th>Type</th>
    <th>Best</th>
    <th>ID</th>
    <th>CSS</th>
    <th>XPATH</th>
    <th>Shadow</th>
    <th>Copy</th>
    <th>Highlight</th></tr>`;
  for (let i = 0; i < Math.min(filteredData.length, maxRows); ++i) {
    let r = filteredData[i];
    previewHTML += `<tr>
      <td title="${r['Element Name']}">${r['Element Name']}</td>
      <td><span class="el-badge">${r['Element Type']}</span></td>
      <td title="${r['Best Locator']}">${r['Best Locator']}</td>
      <td title="${r['ID']}">${r['ID']}</td>
      <td title="${r['CSS']}">${r['CSS']}</td>
      <td title="${r['XPATH']}">${r['XPATH']}</td>
      <td>${r['In Shadow DOM'] ? `<span class="shadow-badge">Shadow</span>` : ''}</td>
      <td><button class="copy-btn" data-copy="${r['Best Locator']}" title="Copy to clipboard">📋</button></td>
      <td><button class="hl-btn" data-hl="${r['Best Locator']}" data-shadow="${r['In Shadow DOM'] ? '1' : '0'}" title="Highlight element">👁️</button></td>
    </tr>`;
  }
  previewHTML += '</table>';
  document.getElementById('preview').innerHTML = previewHTML;
  setTimeout(() => bindTablePreviewButtons(), 100);
}

// ---- BIND: Copy/Highlight buttons in preview ----
function bindTablePreviewButtons() {
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.onclick = e => {
      let text = e.target.getAttribute('data-copy');
      copyLocatorToClipboard(text);
      btn.textContent = '✅';
      setTimeout(() => (btn.textContent = '📋'), 600);
    };
  });
  document.querySelectorAll('.hl-btn').forEach(btn => {
    btn.onclick = async e => {
      let locator = e.target.getAttribute('data-hl');
      let inShadow = e.target.getAttribute('data-shadow') === '1';
      const {tabId} = await getCurrentTabInfo();
      highlightElementOnTab(tabId, locator, inShadow);
      btn.textContent = '✨';
      setTimeout(() => (btn.textContent = '👁️'), 600);
    };
  });
}

// ---- SEARCH Filter ----
document.getElementById('search').oninput = function () {
  let tableRows = document.querySelectorAll('#preview table tr');
  if (!tableRows.length) return;
  let text = this.value.trim().toLowerCase();
  tableRows.forEach((row, idx) => {
    if (idx == 0) return; // header
    let name = row.cells[0].textContent.toLowerCase();
    row.style.display = !text || name.includes(text) ? '' : 'none';
  });
};

// ---- On load: auto-check all types if "All Elements" is checked ----
if (document.getElementById('filterAll').checked) {
  elementTypeList.forEach(type => {
    document.getElementById(type.id).checked = true;
  });
}
