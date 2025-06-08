// Header Navigation Component with Deep Shadow DOM
class HeaderNav extends BaseComponent {
    static get observedAttributes() {
        return ['theme', 'user-name'];
    }

    constructor() {
        super();
        this.state = {
            isMenuOpen: false,
            currentUser: 'Guest',
            notifications: 3,
            theme: 'light'
        };
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    display: block;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                }

                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1rem 2rem;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .nav-container {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .logo {
                    font-size: 1.5rem;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .nav-menu {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    gap: 2rem;
                }

                .nav-item {
                    position: relative;
                }

                .nav-link {
                    color: white;
                    text-decoration: none;
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .nav-link:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }

                .dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    background: white;
                    color: #333;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    min-width: 200px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }

                .nav-item:hover .dropdown {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-item {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .dropdown-item:hover {
                    background: #f8f9fa;
                }

                .dropdown-item:last-child {
                    border-bottom: none;
                }

                .user-section {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .notification-badge {
                    position: relative;
                    cursor: pointer;
                    padding: 0.5rem;
                    border-radius: 50%;
                    transition: background 0.3s ease;
                }

                .notification-badge:hover {
                    background: rgba(255, 255, 255, 0.1);
                }

                .badge-count {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ff4757;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: bold;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .user-avatar:hover {
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(1.1);
                }

                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 0.5rem;
                }

                @media (max-width: 768px) {
                    .nav-menu {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: rgba(102, 126, 234, 0.95);
                        flex-direction: column;
                        padding: 1rem;
                        gap: 0;
                    }

                    .nav-menu.open {
                        display: flex;
                    }

                    .mobile-menu-btn {
                        display: block;
                    }

                    .dropdown {
                        position: static;
                        opacity: 1;
                        visibility: visible;
                        transform: none;
                        box-shadow: none;
                        background: rgba(255, 255, 255, 0.1);
                        margin-top: 0.5rem;
                    }
                }

                .search-container {
                    position: relative;
                }

                .search-input {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 20px;
                    outline: none;
                    transition: all 0.3s ease;
                    width: 200px;
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.7);
                }

                .search-input:focus {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                    width: 250px;
                }
            </style>

            <header class="header">
                <div class="nav-container">
                    <div class="logo">
                        <i class="fas fa-cube"></i>
                        <span>ShadowApp</span>
                    </div>

                    <nav class="navigation">
                        <ul class="nav-menu" id="nav-menu">
                            <li class="nav-item">
                                <a href="#" class="nav-link" data-testid="nav-home">
                                    <i class="fas fa-home"></i>
                                    Home
                                </a>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link" data-testid="nav-dashboard">
                                    <i class="fas fa-tachometer-alt"></i>
                                    Dashboard
                                </a>
                                <div class="dropdown">
                                    <div class="dropdown-item" data-action="analytics">Analytics</div>
                                    <div class="dropdown-item" data-action="reports">Reports</div>
                                    <div class="dropdown-item" data-action="settings">Settings</div>
                                </div>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link" data-testid="nav-projects">
                                    <i class="fas fa-folder"></i>
                                    Projects
                                </a>
                                <div class="dropdown">
                                    <div class="dropdown-item" data-action="my-projects">My Projects</div>
                                    <div class="dropdown-item" data-action="shared">Shared</div>
                                    <div class="dropdown-item" data-action="archived">Archived</div>
                                    <div class="dropdown-item" data-action="templates">Templates</div>
                                </div>
                            </li>
                            <li class="nav-item">
                                <a href="#" class="nav-link" data-testid="nav-team">
                                    <i class="fas fa-users"></i>
                                    Team
                                </a>
                            </li>
                        </ul>
                    </nav>

                    <div class="user-section">
                        <div class="search-container">
                            <input type="text" class="search-input" placeholder="Search..." id="global-search">
                        </div>

                        <div class="notification-badge" id="notifications" data-testid="notifications">
                            <i class="fas fa-bell"></i>
                            <span class="badge-count" id="notification-count">3</span>
                        </div>

                        <div class="user-avatar" id="user-avatar" data-testid="user-avatar">
                            <span id="user-initials">GU</span>
                        </div>

                        <button class="mobile-menu-btn" id="mobile-menu-btn">
                            <i class="fas fa-bars"></i>
                        </button>
                    </div>
                </div>

                <!-- Nested Shadow DOM for User Menu -->
                <user-menu-widget id="user-menu" data-user="${this.state.currentUser}"></user-menu-widget>
                
                <!-- Nested Shadow DOM for Search Results -->
                <search-results-widget id="search-results"></search-results-widget>
                
                <!-- Nested Shadow DOM for Notifications -->
                <notification-dropdown id="notification-dropdown"></notification-dropdown>
            </header>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        const mobileMenuBtn = this.$('#mobile-menu-btn');
        const navMenu = this.$('#nav-menu');
        const searchInput = this.$('#global-search');
        const notificationBadge = this.$('#notifications');
        const userAvatar = this.$('#user-avatar');

        // Mobile menu toggle
        mobileMenuBtn?.addEventListener('click', () => {
            this.setState({ isMenuOpen: !this.state.isMenuOpen });
            navMenu?.classList.toggle('open');
        });

        // Search functionality
        const debouncedSearch = this.debounce((query) => {
            this.emit('search', { query });
            this.performSearch(query);
        }, 300);

        searchInput?.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });

        // Notification click
        notificationBadge?.addEventListener('click', () => {
            this.toggleNotifications();
        });

        // User avatar click
        userAvatar?.addEventListener('click', () => {
            this.toggleUserMenu();
        });

        // Navigation item clicks
        this.$$('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.testid?.replace('nav-', '');
                this.emit('navigate', { section });
            });
        });

        // Dropdown item clicks
        this.$$('.dropdown-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                this.emit('dropdown-action', { action });
            });
        });
    }

    performSearch(query) {
        const searchResults = this.$('#search-results');
        if (query.length > 2) {
            searchResults.setAttribute('query', query);
            searchResults.setAttribute('active', 'true');
        } else {
            searchResults.setAttribute('active', 'false');
        }
    }

    toggleNotifications() {
        const notificationDropdown = this.$('#notification-dropdown');
        const isActive = notificationDropdown.getAttribute('active') === 'true';
        notificationDropdown.setAttribute('active', (!isActive).toString());
    }

    toggleUserMenu() {
        const userMenu = this.$('#user-menu');
        const isActive = userMenu.getAttribute('active') === 'true';
        userMenu.setAttribute('active', (!isActive).toString());
    }

    onAttributeChange(name, oldValue, newValue) {
        if (name === 'user-name') {
            this.setState({ currentUser: newValue });
            const initials = newValue ? newValue.split(' ').map(n => n[0]).join('').toUpperCase() : 'GU';
            const userInitials = this.$('#user-initials');
            if (userInitials) {
                userInitials.textContent = initials;
            }
        }
    }

    // Public methods
    updateNotificationCount(count) {
        this.setState({ notifications: count });
        const badge = this.$('#notification-count');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    setActiveNavItem(section) {
        this.$$('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = this.$(`[data-testid="nav-${section}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
}

// Nested User Menu Widget
class UserMenuWidget extends BaseComponent {
    static get observedAttributes() {
        return ['active', 'data-user'];
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    position: absolute;
                    top: 100%;
                    right: 2rem;
                    z-index: 1000;
                }

                .user-menu {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    min-width: 250px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }

                :host([active="true"]) .user-menu {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .user-info {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    text-align: center;
                }

                .user-name {
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 0.5rem;
                }

                .user-email {
                    color: #666;
                    font-size: 0.9rem;
                }

                .menu-item {
                    padding: 0.75rem 1rem;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #333;
                }

                .menu-item:hover {
                    background: #f8f9fa;
                }

                .menu-item:last-child {
                    border-bottom: none;
                    color: #dc3545;
                }

                .menu-item i {
                    width: 16px;
                }
            </style>

            <div class="user-menu">
                <div class="user-info">
                    <div class="user-name">${this.getAttribute('data-user') || 'Guest User'}</div>
                    <div class="user-email">user@example.com</div>
                </div>
                
                <div class="menu-item" data-action="profile">
                    <i class="fas fa-user"></i>
                    My Profile
                </div>
                
                <div class="menu-item" data-action="settings">
                    <i class="fas fa-cog"></i>
                    Settings
                </div>
                
                <div class="menu-item" data-action="billing">
                    <i class="fas fa-credit-card"></i>
                    Billing
                </div>
                
                <div class="menu-item" data-action="help">
                    <i class="fas fa-question-circle"></i>
                    Help & Support
                </div>
                
                <div class="menu-item" data-action="logout">
                    <i class="fas fa-sign-out-alt"></i>
                    Sign Out
                </div>

                <!-- Nested Settings Panel -->
                <settings-quick-panel id="settings-panel"></settings-quick-panel>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        this.$$('.menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = item.dataset.action;
                if (action === 'settings') {
                    this.toggleSettingsPanel();
                } else {
                    this.emit('user-action', { action });
                }
            });
        });
    }

    toggleSettingsPanel() {
        const panel = this.$('#settings-panel');
        const isActive = panel.getAttribute('active') === 'true';
        panel.setAttribute('active', (!isActive).toString());
    }
}

// Settings Quick Panel (Level 3 Shadow DOM)
class SettingsQuickPanel extends BaseComponent {
    static get observedAttributes() {
        return ['active'];
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    position: absolute;
                    top: 0;
                    left: 100%;
                    margin-left: 0.5rem;
                }

                .settings-panel {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    width: 200px;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateX(-10px);
                    transition: all 0.3s ease;
                }

                :host([active="true"]) .settings-panel {
                    opacity: 1;
                    visibility: visible;
                    transform: translateX(0);
                }

                .panel-header {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    font-weight: bold;
                    color: #333;
                }

                .setting-item {
                    padding: 0.75rem 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                }

                .setting-item:last-child {
                    border-bottom: none;
                }

                .toggle-switch {
                    position: relative;
                    width: 40px;
                    height: 20px;
                    background: #ccc;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                }

                .toggle-switch.active {
                    background: #4CAF50;
                }

                .toggle-switch::after {
                    content: '';
                    position: absolute;
                    top: 2px;
                    left: 2px;
                    width: 16px;
                    height: 16px;
                    background: white;
                    border-radius: 50%;
                    transition: transform 0.3s ease;
                }

                .toggle-switch.active::after {
                    transform: translateX(20px);
                }
            </style>

            <div class="settings-panel">
                <div class="panel-header">Quick Settings</div>
                
                <div class="setting-item">
                    <span>Dark Mode</span>
                    <div class="toggle-switch" data-setting="dark-mode"></div>
                </div>
                
                <div class="setting-item">
                    <span>Notifications</span>
                    <div class="toggle-switch active" data-setting="notifications"></div>
                </div>
                
                <div class="setting-item">
                    <span>Auto-save</span>
                    <div class="toggle-switch active" data-setting="auto-save"></div>
                </div>
                
                <div class="setting-item">
                    <span>Analytics</span>
                    <div class="toggle-switch" data-setting="analytics"></div>
                </div>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        this.$$('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
                const setting = toggle.dataset.setting;
                const isActive = toggle.classList.contains('active');
                this.emit('setting-change', { setting, value: isActive });
            });
        });
    }
}

// Search Results Widget
class SearchResultsWidget extends BaseComponent {
    static get observedAttributes() {
        return ['active', 'query'];
    }

    render() {
        const query = this.getAttribute('query') || '';
        const results = this.getSearchResults(query);

        const template = this.createTemplate(`
            <style>
                :host {
                    position: absolute;
                    top: 100%;
                    right: 2rem;
                    left: 2rem;
                    z-index: 999;
                }

                .search-results {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    max-height: 400px;
                    overflow-y: auto;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }

                :host([active="true"]) .search-results {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .result-item {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background 0.2s ease;
                }

                .result-item:hover {
                    background: #f8f9fa;
                }

                .result-item:last-child {
                    border-bottom: none;
                }

                .result-title {
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 0.5rem;
                }

                .result-description {
                    color: #666;
                    font-size: 0.9rem;
                }

                .no-results {
                    padding: 2rem;
                    text-align: center;
                    color: #666;
                }
            </style>

            <div class="search-results">
                ${results.length > 0 ? 
                    results.map(result => `
                        <div class="result-item" data-id="${result.id}">
                            <div class="result-title">${result.title}</div>
                            <div class="result-description">${result.description}</div>
                        </div>
                    `).join('') :
                    '<div class="no-results">No results found for "' + query + '"</div>'
                }
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    getSearchResults(query) {
        // Mock search results
        const allResults = [
            { id: 1, title: 'Dashboard', description: 'View your analytics and reports' },
            { id: 2, title: 'User Profile', description: 'Manage your account settings' },
            { id: 3, title: 'Projects', description: 'Browse your projects and files' },
            { id: 4, title: 'Team Members', description: 'Collaborate with your team' },
            { id: 5, title: 'Settings', description: 'Configure application preferences' }
        ];

        if (!query || query.length < 2) return [];
        
        return allResults.filter(result => 
            result.title.toLowerCase().includes(query.toLowerCase()) ||
            result.description.toLowerCase().includes(query.toLowerCase())
        );
    }

    setupEventListeners() {
        this.$$('.result-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                this.emit('search-select', { id });
                this.setAttribute('active', 'false');
            });
        });
    }
}

// Notification Dropdown Widget
class NotificationDropdown extends BaseComponent {
    static get observedAttributes() {
        return ['active'];
    }

    render() {
        const notifications = this.getNotifications();

        const template = this.createTemplate(`
            <style>
                :host {
                    position: absolute;
                    top: 100%;
                    right: 6rem;
                    z-index: 1000;
                }

                .notification-dropdown {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                    width: 350px;
                    max-height: 400px;
                    overflow-y: auto;
                    opacity: 0;
                    visibility: hidden;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }

                :host([active="true"]) .notification-dropdown {
                    opacity: 1;
                    visibility: visible;
                    transform: translateY(0);
                }

                .dropdown-header {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .dropdown-title {
                    font-weight: bold;
                    color: #333;
                }

                .mark-all-read {
                    color: #007bff;
                    cursor: pointer;
                    font-size: 0.9rem;
                }

                .notification-item {
                    padding: 1rem;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    position: relative;
                }

                .notification-item:hover {
                    background: #f8f9fa;
                }

                .notification-item.unread {
                    background: #e3f2fd;
                }

                .notification-item.unread::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 4px;
                    background: #007bff;
                }

                .notification-content {
                    display: flex;
                    gap: 0.75rem;
                }

                .notification-icon {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .notification-icon.info {
                    background: #e3f2fd;
                    color: #1976d2;
                }

                .notification-icon.success {
                    background: #e8f5e8;
                    color: #388e3c;
                }

                .notification-icon.warning {
                    background: #fff3e0;
                    color: #f57c00;
                }

                .notification-text {
                    flex: 1;
                }

                .notification-title {
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 0.25rem;
                }

                .notification-message {
                    color: #666;
                    font-size: 0.9rem;
                    margin-bottom: 0.25rem;
                }

                .notification-time {
                    color: #999;
                    font-size: 0.8rem;
                }
            </style>

            <div class="notification-dropdown">
                <div class="dropdown-header">
                    <span class="dropdown-title">Notifications</span>
                    <span class="mark-all-read" id="mark-all-read">Mark all as read</span>
                </div>
                
                ${notifications.map(notification => `
                    <div class="notification-item ${notification.unread ? 'unread' : ''}" data-id="${notification.id}">
                        <div class="notification-content">
                            <div class="notification-icon ${notification.type}">
                                <i class="fas fa-${notification.icon}"></i>
                            </div>
                            <div class="notification-text">
                                <div class="notification-title">${notification.title}</div>
                                <div class="notification-message">${notification.message}</div>
                                <div class="notification-time">${notification.time}</div>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    getNotifications() {
        return [
            {
                id: 1,
                title: 'New Project Created',
                message: 'Your project "Website Redesign" has been created successfully.',
                time: '2 minutes ago',
                type: 'success',
                icon: 'check-circle',
                unread: true
            },
            {
                id: 2,
                title: 'Team Member Added',
                message: 'John Doe has been added to your team.',
                time: '1 hour ago',
                type: 'info',
                icon: 'user-plus',
                unread: true
            },
            {
                id: 3,
                title: 'Storage Warning',
                message: 'You are running low on storage space (85% used).',
                time: '3 hours ago',
                type: 'warning',
                icon: 'exclamation-triangle',
                unread: false
            }
        ];
    }

    setupEventListeners() {
        const markAllRead = this.$('#mark-all-read');
        markAllRead?.addEventListener('click', () => {
            this.$$('.notification-item').forEach(item => {
                item.classList.remove('unread');
            });
            this.emit('notifications-read');
        });

        this.$$('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.id;
                item.classList.remove('unread');
                this.emit('notification-click', { id });
            });
        });
    }
}

// Register all components
customElements.define('header-nav', HeaderNav);
customElements.define('user-menu-widget', UserMenuWidget);
customElements.define('settings-quick-panel', SettingsQuickPanel);
customElements.define('search-results-widget', SearchResultsWidget);
customElements.define('notification-dropdown', NotificationDropdown);
