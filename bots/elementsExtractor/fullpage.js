// Full Page Mode JavaScript
// This file handles the full page mode functionality

// Initialize full page mode
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('fullpage-mode')) {
        initializeFullPageMode();
    }
});

function initializeFullPageMode() {
    // Load data from storage when in full page mode
    loadDataFromStorage();
    
    // Setup close tab button
    const closeTabBtn = document.getElementById('closeTabBtn');
    if (closeTabBtn) {
        closeTabBtn.addEventListener('click', () => {
            window.close();
        });
    }
    
    // Adjust table display for full page
    adjustTableForFullPage();
    
    // Setup data synchronization
    setupDataSync();
}

function loadDataFromStorage() {
    chrome.storage.local.get(['lastExtractedData', 'fullPageData'], (result) => {
        let dataToLoad = result.fullPageData || result.lastExtractedData;
        
        if (dataToLoad && Array.isArray(dataToLoad)) {
            // Store the data globally for other functions to access
            if (typeof window !== 'undefined') {
                window.allOriginalData = dataToLoad;
                window.currentFilteredData = dataToLoad;
            }
            
            // Use the existing renderElementsTable function
            if (typeof renderElementsTable === 'function') {
                renderElementsTable(dataToLoad);
                document.getElementById('status').textContent = `Loaded ${dataToLoad.length} elements in full page view.`;
            } else {
                // Fallback rendering if renderElementsTable is not available
                renderTableFallback(dataToLoad);
            }
        } else {
            document.getElementById('status').textContent = 'No data available. Please extract elements first.';
        }
    });
}

// Fallback table rendering function
function renderTableFallback(data) {
    const preview = document.getElementById('preview');
    if (!preview || !data || data.length === 0) return;
    
    let html = `
        <table style="width: 100%; border-collapse: collapse; color: #e0e7ff;">
            <thead>
                <tr style="background: rgba(255, 255, 255, 0.1);">
                    <th style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Element</th>
                    <th style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Type</th>
                    <th style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Locators</th>
                    <th style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Text</th>
                    <th style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.2);">Attributes</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    data.forEach((element, index) => {
        html += `
            <tr style="border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                <td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">${element.tag || 'N/A'}</td>
                <td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.1);">${element.type || 'N/A'}</td>
                <td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.1); font-family: monospace; font-size: 0.9em;">
                    ${element.css ? `CSS: ${element.css}<br>` : ''}
                    ${element.xpath ? `XPath: ${element.xpath}<br>` : ''}
                    ${element.id ? `ID: #${element.id}<br>` : ''}
                </td>
                <td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.1); max-width: 200px; word-wrap: break-word;">${element.text || 'N/A'}</td>
                <td style="padding: 12px; border: 1px solid rgba(255, 255, 255, 0.1); max-width: 200px; word-wrap: break-word;">${JSON.stringify(element.attributes || {})}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    preview.innerHTML = html;
    
    // Update stats
    const elementCount = document.getElementById('elementCount');
    if (elementCount) {
        elementCount.textContent = `${data.length} elements found`;
    }
}

function adjustTableForFullPage() {
    // Remove pagination for full page view - show all data
    const paginationControls = document.getElementById('paginationControls');
    if (paginationControls) {
        paginationControls.style.display = 'none';
    }
    
    // Adjust table width and styling
    const preview = document.getElementById('preview');
    if (preview) {
        preview.classList.add('fullpage-table');
    }
}

function setupDataSync() {
    // Listen for storage changes to sync data
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && (changes.lastExtractedData || changes.fullPageData)) {
            loadDataFromStorage();
        }
    });
}

// Export function to be called from popup
function openInNewTab(data) {
    // Store the data to be accessed by the full page
    chrome.storage.local.set({ 
        fullPageData: data,
        fullPageTimestamp: Date.now()
    }, () => {
        // Open the full page in a new tab
        chrome.tabs.create({
            url: chrome.runtime.getURL('fullpage.html'),
            active: true
        });
    });
}

// Make function available globally if in extension context
if (typeof chrome !== 'undefined' && chrome.runtime) {
    window.openInNewTab = openInNewTab;
}
