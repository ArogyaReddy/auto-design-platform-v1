// Advanced Data Table Component with Sorting, Filtering, and Pagination
class DataTableWidget extends BaseComponent {
    constructor() {
        super();
        this.data = this.generateMockData();
        this.filteredData = [...this.data];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        this.sortColumn = null;
        this.sortDirection = 'asc';
        this.filters = {};
        this.selectedRows = new Set();
        this.searchQuery = '';
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
        this.initializeTable();
    }

    generateMockData() {
        const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations'];
        const positions = ['Manager', 'Senior', 'Junior', 'Lead', 'Director', 'Specialist'];
        const statuses = ['Active', 'Inactive', 'Pending', 'On Leave'];
        
        return Array.from({ length: 100 }, (_, i) => ({
            id: i + 1,
            name: `Employee ${i + 1}`,
            email: `employee${i + 1}@company.com`,
            department: departments[Math.floor(Math.random() * departments.length)],
            position: positions[Math.floor(Math.random() * positions.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            salary: Math.floor(Math.random() * 100000) + 30000,
            hireDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            performance: Math.floor(Math.random() * 5) + 1
        }));
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                .table-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }

                .table-header {
                    padding: 1.5rem 2rem;
                    border-bottom: 1px solid #e5e7eb;
                    background: #f9fafb;
                }

                .table-title {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: #1f2937;
                    margin-bottom: 1rem;
                }

                .table-controls {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .search-controls {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    flex: 1;
                }

                .search-input {
                    flex: 1;
                    max-width: 300px;
                    padding: 0.5rem 1rem 0.5rem 2.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    position: relative;
                }

                .search-container {
                    position: relative;
                    flex: 1;
                    max-width: 300px;
                }

                .search-icon {
                    position: absolute;
                    left: 0.75rem;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #9ca3af;
                    pointer-events: none;
                }

                .filter-dropdown {
                    position: relative;
                }

                .filter-button {
                    padding: 0.5rem 1rem;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    background: white;
                    color: #374151;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                }

                .filter-button:hover {
                    background: #f3f4f6;
                }

                .filter-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
                    min-width: 200px;
                    z-index: 1000;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }

                .filter-menu.open {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .filter-section {
                    padding: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                }

                .filter-section:last-child {
                    border-bottom: none;
                }

                .filter-section-title {
                    font-weight: 500;
                    color: #374151;
                    margin-bottom: 0.5rem;
                    font-size: 0.875rem;
                }

                .filter-options {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .filter-option {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.25rem 0;
                    cursor: pointer;
                }

                .filter-checkbox {
                    width: 16px;
                    height: 16px;
                }

                .filter-label {
                    font-size: 0.875rem;
                    color: #4b5563;
                }

                .table-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                .btn {
                    padding: 0.5rem 1rem;
                    border: none;
                    border-radius: 6px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                }

                .table-wrapper {
                    flex: 1;
                    overflow-x: auto;
                    overflow-y: auto;
                    max-height: 600px;
                }

                .data-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.875rem;
                }

                .table-head {
                    background: #f9fafb;
                    position: sticky;
                    top: 0;
                    z-index: 10;
                }

                .table-header-cell {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    font-weight: 600;
                    color: #374151;
                    border-bottom: 1px solid #e5e7eb;
                    cursor: pointer;
                    user-select: none;
                    position: relative;
                    white-space: nowrap;
                }

                .table-header-cell:hover {
                    background: #f3f4f6;
                }

                .table-header-cell.sortable::after {
                    content: '';
                    position: absolute;
                    right: 0.5rem;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 0;
                    height: 0;
                    border-left: 4px solid transparent;
                    border-right: 4px solid transparent;
                    border-bottom: 4px solid #9ca3af;
                    opacity: 0.3;
                }

                .table-header-cell.sorted-asc::after {
                    border-bottom: 4px solid #6366f1;
                    opacity: 1;
                }

                .table-header-cell.sorted-desc::after {
                    border-bottom: none;
                    border-top: 4px solid #6366f1;
                    opacity: 1;
                }

                .table-body {
                    background: white;
                }

                .table-row {
                    transition: background-color 0.2s ease;
                    cursor: pointer;
                }

                .table-row:hover {
                    background: #f9fafb;
                }

                .table-row.selected {
                    background: #eff6ff;
                }

                .table-cell {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #f3f4f6;
                    color: #4b5563;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    max-width: 200px;
                }

                .table-cell.checkbox-cell {
                    width: 40px;
                    text-align: center;
                }

                .row-checkbox {
                    width: 16px;
                    height: 16px;
                    cursor: pointer;
                }

                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .status-active {
                    background: #dcfce7;
                    color: #166534;
                }

                .status-inactive {
                    background: #fee2e2;
                    color: #991b1b;
                }

                .status-pending {
                    background: #fef3c7;
                    color: #92400e;
                }

                .status-on-leave {
                    background: #e0e7ff;
                    color: #3730a3;
                }

                .performance-stars {
                    display: flex;
                    align-items: center;
                    gap: 0.125rem;
                }

                .star {
                    color: #fbbf24;
                }

                .star.empty {
                    color: #e5e7eb;
                }

                .table-footer {
                    padding: 1rem 2rem;
                    border-top: 1px solid #e5e7eb;
                    background: #f9fafb;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1rem;
                }

                .table-info {
                    color: #6b7280;
                    font-size: 0.875rem;
                }

                .pagination {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .pagination-button {
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: white;
                    color: #374151;
                    cursor: pointer;
                    font-size: 0.875rem;
                    transition: all 0.2s ease;
                    min-width: 36px;
                    text-align: center;
                }

                .pagination-button:hover:not(:disabled) {
                    background: #f3f4f6;
                }

                .pagination-button:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .pagination-button.active {
                    background: #6366f1;
                    color: white;
                    border-color: #6366f1;
                }

                .page-size-selector {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .page-size-select {
                    padding: 0.25rem 0.5rem;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    font-size: 0.875rem;
                }

                @media (max-width: 768px) {
                    .table-controls {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .search-controls {
                        flex-direction: column;
                    }

                    .search-container {
                        max-width: none;
                    }

                    .table-wrapper {
                        max-height: 400px;
                    }

                    .table-footer {
                        flex-direction: column;
                        align-items: stretch;
                        text-align: center;
                    }

                    .pagination {
                        justify-content: center;
                    }
                }
            </style>

            <div class="table-container" data-testid="table-container">
                <div class="table-header">
                    <h2 class="table-title" data-testid="table-title">Employee Data Table</h2>
                    
                    <div class="table-controls">
                        <div class="search-controls">
                            <div class="search-container">
                                <i class="fas fa-search search-icon"></i>
                                <input 
                                    type="text" 
                                    class="search-input" 
                                    placeholder="Search employees..." 
                                    data-testid="search-input"
                                >
                            </div>

                            <div class="filter-dropdown">
                                <button class="filter-button" data-testid="filter-button">
                                    <i class="fas fa-filter"></i>
                                    Filters
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                                
                                <div class="filter-menu" data-testid="filter-menu">
                                    <div class="filter-section">
                                        <div class="filter-section-title">Department</div>
                                        <div class="filter-options" data-filter="department">
                                            ${[...new Set(this.data.map(item => item.department))].map(dept => `
                                                <label class="filter-option">
                                                    <input type="checkbox" class="filter-checkbox" value="${dept}" data-testid="filter-dept-${dept.toLowerCase()}">
                                                    <span class="filter-label">${dept}</span>
                                                </label>
                                            `).join('')}
                                        </div>
                                    </div>

                                    <div class="filter-section">
                                        <div class="filter-section-title">Status</div>
                                        <div class="filter-options" data-filter="status">
                                            ${[...new Set(this.data.map(item => item.status))].map(status => `
                                                <label class="filter-option">
                                                    <input type="checkbox" class="filter-checkbox" value="${status}" data-testid="filter-status-${status.toLowerCase().replace(' ', '-')}">
                                                    <span class="filter-label">${status}</span>
                                                </label>
                                            `).join('')}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="table-actions">
                            <button class="btn btn-primary" data-testid="add-employee" data-action="add">
                                <i class="fas fa-plus"></i>
                                Add Employee
                            </button>
                            <button class="btn btn-secondary" data-testid="export-data" data-action="export">
                                <i class="fas fa-download"></i>
                                Export
                            </button>
                            <button class="btn btn-secondary" data-testid="bulk-actions" data-action="bulk" disabled>
                                <i class="fas fa-cog"></i>
                                Bulk Actions
                            </button>
                        </div>
                    </div>
                </div>

                <div class="table-wrapper" data-testid="table-wrapper">
                    <table class="data-table" data-testid="data-table">
                        <thead class="table-head">
                            <tr>
                                <th class="table-header-cell checkbox-cell">
                                    <input type="checkbox" class="row-checkbox" data-testid="select-all-checkbox">
                                </th>
                                <th class="table-header-cell sortable" data-column="id" data-testid="header-id">
                                    ID
                                </th>
                                <th class="table-header-cell sortable" data-column="name" data-testid="header-name">
                                    Name
                                </th>
                                <th class="table-header-cell sortable" data-column="email" data-testid="header-email">
                                    Email
                                </th>
                                <th class="table-header-cell sortable" data-column="department" data-testid="header-department">
                                    Department
                                </th>
                                <th class="table-header-cell sortable" data-column="position" data-testid="header-position">
                                    Position
                                </th>
                                <th class="table-header-cell sortable" data-column="status" data-testid="header-status">
                                    Status
                                </th>
                                <th class="table-header-cell sortable" data-column="salary" data-testid="header-salary">
                                    Salary
                                </th>
                                <th class="table-header-cell sortable" data-column="hireDate" data-testid="header-hire-date">
                                    Hire Date
                                </th>
                                <th class="table-header-cell sortable" data-column="performance" data-testid="header-performance">
                                    Performance
                                </th>
                            </tr>
                        </thead>
                        <tbody class="table-body" data-testid="table-body">
                            <!-- Rows will be populated by JavaScript -->
                        </tbody>
                    </table>
                </div>

                <div class="table-footer">
                    <div class="table-info" data-testid="table-info">
                        Showing <span data-testid="showing-start">1</span>-<span data-testid="showing-end">10</span> 
                        of <span data-testid="total-records">100</span> records
                        <span data-testid="selected-count" style="display: none;">
                            (<span data-testid="selected-number">0</span> selected)
                        </span>  
                    </div>

                    <div class="page-size-selector">
                        <label for="page-size">Show:</label>
                        <select class="page-size-select" data-testid="page-size-select">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    <div class="pagination" data-testid="pagination">
                        <button class="pagination-button" data-testid="prev-page" disabled>
                            <i class="fas fa-chevron-left"></i>
                        </button>
                        <!-- Page numbers will be populated by JavaScript -->
                        <button class="pagination-button" data-testid="next-page">
                            <i class="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    initializeTable() {
        this.setupEventListeners();
        this.updateTable();
        this.updatePagination();
    }

    setupEventListeners() {
        // Search functionality
        const searchInput = this.shadowRoot.querySelector('[data-testid="search-input"]');
        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.toLowerCase();
            this.applyFilters();
        });

        // Filter dropdown
        const filterButton = this.shadowRoot.querySelector('[data-testid="filter-button"]');
        const filterMenu = this.shadowRoot.querySelector('[data-testid="filter-menu"]');
        
        filterButton.addEventListener('click', (e) => {
            e.stopPropagation();
            filterMenu.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            filterMenu.classList.remove('open');
        });

        // Filter checkboxes
        const filterCheckboxes = this.shadowRoot.querySelectorAll('.filter-checkbox');
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateFilters();
                this.applyFilters();
            });
        });

        // Column sorting
        const sortableHeaders = this.shadowRoot.querySelectorAll('.sortable');
        sortableHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.dataset.column;
                this.sortTable(column);
            });
        });

        // Select all checkbox
        const selectAllCheckbox = this.shadowRoot.querySelector('[data-testid="select-all-checkbox"]');
        selectAllCheckbox.addEventListener('change', (e) => {
            this.toggleSelectAll(e.target.checked);
        });

        // Page size selector
        const pageSizeSelect = this.shadowRoot.querySelector('[data-testid="page-size-select"]');
        pageSizeSelect.addEventListener('change', (e) => {
            this.pageSize = parseInt(e.target.value);
            this.currentPage = 1;
            this.updateTable();
            this.updatePagination();
        });

        // Action buttons
        const actionButtons = this.shadowRoot.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                this.handleAction(action);
            });
        });
    }

    updateFilters() {
        this.filters = {};
        const filterSections = this.shadowRoot.querySelectorAll('[data-filter]');
        
        filterSections.forEach(section => {
            const filterType = section.dataset.filter;
            const checkedBoxes = section.querySelectorAll('.filter-checkbox:checked');
            
            if (checkedBoxes.length > 0) {
                this.filters[filterType] = Array.from(checkedBoxes).map(cb => cb.value);
            }
        });
    }

    applyFilters() {
        this.filteredData = this.data.filter(item => {
            // Search filter
            if (this.searchQuery) {
                const searchableFields = ['name', 'email', 'department', 'position'];
                const matchesSearch = searchableFields.some(field => 
                    item[field].toLowerCase().includes(this.searchQuery)
                );
                if (!matchesSearch) return false;
            }

            // Column filters
            for (const [filterType, filterValues] of Object.entries(this.filters)) {
                if (filterValues.length > 0 && !filterValues.includes(item[filterType])) {
                    return false;
                }
            }

            return true;
        });

        this.currentPage = 1;
        this.totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        this.updateTable();
        this.updatePagination();
    }

    sortTable(column) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.filteredData.sort((a, b) => {
            let aVal = a[column];
            let bVal = b[column];

            // Handle different data types
            if (column === 'salary') {
                aVal = parseFloat(aVal);
                bVal = parseFloat(bVal);
            } else if (column === 'hireDate') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            } else if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        this.updateSortHeaders();
        this.updateTable();
    }

    updateSortHeaders() {
        const headers = this.shadowRoot.querySelectorAll('.sortable');
        headers.forEach(header => {
            header.classList.remove('sorted-asc', 'sorted-desc');
            if (header.dataset.column === this.sortColumn) {
                header.classList.add(`sorted-${this.sortDirection}`);
            }
        });
    }

    updateTable() {
        const tbody = this.shadowRoot.querySelector('[data-testid="table-body"]');
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        tbody.innerHTML = pageData.map(item => `
            <tr class="table-row ${this.selectedRows.has(item.id) ? 'selected' : ''}" data-testid="table-row-${item.id}" data-row-id="${item.id}">
                <td class="table-cell checkbox-cell">
                    <input type="checkbox" class="row-checkbox" data-testid="row-checkbox-${item.id}" data-row-id="${item.id}" ${this.selectedRows.has(item.id) ? 'checked' : ''}>
                </td>
                <td class="table-cell" data-testid="cell-id-${item.id}">${item.id}</td>
                <td class="table-cell" data-testid="cell-name-${item.id}">${item.name}</td>
                <td class="table-cell" data-testid="cell-email-${item.id}">${item.email}</td>
                <td class="table-cell" data-testid="cell-department-${item.id}">${item.department}</td>
                <td class="table-cell" data-testid="cell-position-${item.id}">${item.position}</td>
                <td class="table-cell" data-testid="cell-status-${item.id}">
                    <span class="status-badge status-${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span>
                </td>
                <td class="table-cell" data-testid="cell-salary-${item.id}">$${item.salary.toLocaleString()}</td>
                <td class="table-cell" data-testid="cell-hire-date-${item.id}">${item.hireDate.toLocaleDateString()}</td>
                <td class="table-cell" data-testid="cell-performance-${item.id}">
                    <div class="performance-stars">
                        ${Array.from({ length: 5 }, (_, i) => `
                            <i class="fas fa-star star ${i < item.performance ? '' : 'empty'}"></i>
                        `).join('')}
                    </div>
                </td>
            </tr>
        `).join('');

        // Add event listeners for new rows
        this.setupRowEventListeners();
        this.updateTableInfo();
        this.updateBulkActionsButton();
    }

    setupRowEventListeners() {
        // Row selection checkboxes
        const rowCheckboxes = this.shadowRoot.querySelectorAll('.row-checkbox');
        rowCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const rowId = parseInt(e.target.dataset.rowId);
                if (e.target.checked) {
                    this.selectedRows.add(rowId);
                } else {
                    this.selectedRows.delete(rowId);
                }
                this.updateRowSelection();
                this.updateBulkActionsButton();
            });
        });

        // Row click selection
        const tableRows = this.shadowRoot.querySelectorAll('.table-row');
        tableRows.forEach(row => {
            row.addEventListener('click', (e) => {
                if (e.target.type !== 'checkbox') {
                    const rowId = parseInt(row.dataset.rowId);
                    const checkbox = row.querySelector('.row-checkbox');
                    
                    if (this.selectedRows.has(rowId)) {
                        this.selectedRows.delete(rowId);
                        checkbox.checked = false;
                    } else {
                        this.selectedRows.add(rowId);
                        checkbox.checked = true;
                    }
                    
                    this.updateRowSelection();
                    this.updateBulkActionsButton();

                    // Dispatch row click event
                    this.dispatchEvent(new CustomEvent('row-clicked', {
                        detail: { rowId, data: this.data.find(item => item.id === rowId) },
                        bubbles: true
                    }));
                }
            });
        });
    }

    toggleSelectAll(checked) {
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredData.slice(startIndex, endIndex);

        if (checked) {
            pageData.forEach(item => this.selectedRows.add(item.id));
        } else {
            pageData.forEach(item => this.selectedRows.delete(item.id));
        }

        this.updateTable();
    }

    updateRowSelection() {
        const tableRows = this.shadowRoot.querySelectorAll('.table-row');
        tableRows.forEach(row => {
            const rowId = parseInt(row.dataset.rowId);
            row.classList.toggle('selected', this.selectedRows.has(rowId));
        });

        // Update select all checkbox
        const selectAllCheckbox = this.shadowRoot.querySelector('[data-testid="select-all-checkbox"]');
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        const pageData = this.filteredData.slice(startIndex, endIndex);
        const allPageRowsSelected = pageData.every(item => this.selectedRows.has(item.id));
        const somePageRowsSelected = pageData.some(item => this.selectedRows.has(item.id));

        selectAllCheckbox.checked = allPageRowsSelected;
        selectAllCheckbox.indeterminate = somePageRowsSelected && !allPageRowsSelected;
    }

    updateBulkActionsButton() {
        const bulkActionsBtn = this.shadowRoot.querySelector('[data-testid="bulk-actions"]');
        const selectedCount = this.shadowRoot.querySelector('[data-testid="selected-count"]');
        const selectedNumber = this.shadowRoot.querySelector('[data-testid="selected-number"]');

        if (this.selectedRows.size > 0) {
            bulkActionsBtn.disabled = false;
            selectedCount.style.display = 'inline';
            selectedNumber.textContent = this.selectedRows.size;
        } else {
            bulkActionsBtn.disabled = true;
            selectedCount.style.display = 'none';
        }
    }

    updateTableInfo() {
        const showingStart = this.shadowRoot.querySelector('[data-testid="showing-start"]');
        const showingEnd = this.shadowRoot.querySelector('[data-testid="showing-end"]');
        const totalRecords = this.shadowRoot.querySelector('[data-testid="total-records"]');

        const startIndex = (this.currentPage - 1) * this.pageSize + 1;
        const endIndex = Math.min(this.currentPage * this.pageSize, this.filteredData.length);

        showingStart.textContent = this.filteredData.length > 0 ? startIndex : 0;
        showingEnd.textContent = endIndex;
        totalRecords.textContent = this.filteredData.length;
    }

    updatePagination() {
        const pagination = this.shadowRoot.querySelector('[data-testid="pagination"]');
        const prevBtn = this.shadowRoot.querySelector('[data-testid="prev-page"]');
        const nextBtn = this.shadowRoot.querySelector('[data-testid="next-page"]');

        // Update prev/next buttons
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= this.totalPages;

        // Remove existing page buttons
        const existingPageBtns = pagination.querySelectorAll('.pagination-button:not([data-testid])');
        existingPageBtns.forEach(btn => btn.remove());

        // Add page number buttons
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = `pagination-button ${i === this.currentPage ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.dataset.testid = `page-${i}`;
            pageBtn.addEventListener('click', () => {
                this.currentPage = i;
                this.updateTable();
                this.updatePagination();
            });

            pagination.insertBefore(pageBtn, nextBtn);
        }

        // Update prev/next button event listeners
        prevBtn.onclick = () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.updateTable();
                this.updatePagination();
            }
        };

        nextBtn.onclick = () => {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.updateTable();
                this.updatePagination();
            }
        };
    }

    handleAction(action) {
        switch (action) {
            case 'add':
                this.dispatchEvent(new CustomEvent('add-employee', { bubbles: true }));
                break;
            case 'export':
                this.exportData();
                break;
            case 'bulk':
                this.dispatchEvent(new CustomEvent('bulk-actions', {
                    detail: { selectedRows: Array.from(this.selectedRows) },
                    bubbles: true
                }));
                break;
        }
    }

    exportData() {
        const csvContent = this.generateCSV();
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employee-data.csv';
        a.click();
        window.URL.revokeObjectURL(url);

        this.dispatchEvent(new CustomEvent('data-exported', { bubbles: true }));
    }

    generateCSV() {
        const headers = ['ID', 'Name', 'Email', 'Department', 'Position', 'Status', 'Salary', 'Hire Date', 'Performance'];
        const csvRows = [headers.join(',')];

        this.filteredData.forEach(item => {
            const row = [
                item.id,
                `"${item.name}"`,
                `"${item.email}"`,
                `"${item.department}"`,
                `"${item.position}"`,
                `"${item.status}"`,
                item.salary,
                item.hireDate.toISOString().split('T')[0],
                item.performance
            ];
            csvRows.push(row.join(','));
        });

        return csvRows.join('\n');
    }
}

// Register the component
customElements.define('data-table-widget', DataTableWidget);
