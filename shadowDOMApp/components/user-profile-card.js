// User Profile Card Component with nested Shadow DOM
class UserProfileCard extends BaseComponent {
    constructor() {
        super();
        this.userData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            avatar: 'https://via.placeholder.com/120x120/4f46e5/ffffff?text=JD',
            role: 'Senior Developer',
            department: 'Engineering',
            location: 'San Francisco, CA',
            joinDate: '2020-03-15',
            skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS'],
            stats: {
                projects: 24,
                commits: 1847,
                reviews: 156,
                contributions: 89
            },
            social: {
                linkedin: 'https://linkedin.com/in/johndoe',
                github: 'https://github.com/johndoe',
                twitter: 'https://twitter.com/johndoe'
            }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
        this.initializeInteractions();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 16px;
                    padding: 1px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    transition: all 0.3s ease;
                }

                :host(:hover) {
                    transform: translateY(-4px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
                }

                .profile-card {
                    background: white;
                    border-radius: 15px;
                    padding: 2rem;
                    position: relative;
                    overflow: hidden;
                }

                .profile-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .avatar-container {
                    position: relative;
                    display: inline-block;
                    margin-bottom: 1rem;
                }

                .avatar {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    border: 4px solid #fff;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.1);
                    object-fit: cover;
                }

                .status-indicator {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    width: 24px;
                    height: 24px;
                    background: #10b981;
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .profile-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    margin-bottom: 0.5rem;
                }

                .profile-role {
                    color: #6b7280;
                    font-size: 1rem;
                    margin-bottom: 0.25rem;
                }

                .profile-department {
                    color: #9ca3af;
                    font-size: 0.875rem;
                }

                .profile-sections {
                    display: grid;
                    gap: 1.5rem;
                }

                .section {
                    border-top: 1px solid #f3f4f6;
                    padding-top: 1rem;
                }

                .section:first-child {
                    border-top: none;
                    padding-top: 0;
                }

                .section-title {
                    font-weight: 600;
                    color: #374151;
                    margin-bottom: 0.75rem;
                    font-size: 0.875rem;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.75rem;
                }

                .info-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .info-icon {
                    width: 16px;
                    height: 16px;
                    color: #6b7280;
                }

                .info-text {
                    font-size: 0.875rem;
                    color: #4b5563;
                }

                .skills-container {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                }

                .skill-tag {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: 9999px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .skill-tag:hover {
                    transform: scale(1.05);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                }

                .stat-item {
                    text-align: center;
                    padding: 1rem;
                    background: #f9fafb;
                    border-radius: 8px;
                    transition: all 0.2s ease;
                    cursor: pointer;
                }

                .stat-item:hover {
                    background: #f3f4f6;
                    transform: translateY(-2px);
                }

                .stat-number {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1f2937;
                    display: block;
                }

                .stat-label {
                    font-size: 0.75rem;
                    color: #6b7280;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }

                .social-links {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .social-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: #f3f4f6;
                    border-radius: 50%;
                    color: #6b7280;
                    text-decoration: none;
                    transition: all 0.2s ease;
                }

                .social-link:hover {
                    background: #667eea;
                    color: white;
                    transform: translateY(-2px);
                }

                .action-buttons {
                    display: flex;
                    gap: 0.75rem;
                    margin-top: 1.5rem;
                }

                .btn {
                    flex: 1;
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-align: center;
                    text-decoration: none;
                    display: inline-block;
                }

                .btn-primary {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
                }

                .btn-secondary {
                    background: #f3f4f6;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .btn-secondary:hover {
                    background: #e5e7eb;
                    transform: translateY(-1px);
                }

                @media (max-width: 768px) {
                    .profile-card {
                        padding: 1.5rem;
                    }
                    
                    .info-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .stats-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    
                    .action-buttons {
                        flex-direction: column;
                    }
                }
            </style>

            <div class="profile-card" data-testid="profile-card">
                <div class="profile-header">
                    <div class="avatar-container">
                        <img class="avatar" src="${this.userData.avatar}" alt="${this.userData.name}" data-testid="user-avatar">
                        <div class="status-indicator" data-testid="status-online"></div>
                    </div>
                    <h2 class="profile-name" data-testid="user-name">${this.userData.name}</h2>
                    <div class="profile-role" data-testid="user-role">${this.userData.role}</div>
                    <div class="profile-department" data-testid="user-department">${this.userData.department}</div>
                </div>

                <div class="profile-sections">
                    <div class="section">
                        <h3 class="section-title">Information</h3>
                        <div class="info-grid">
                            <div class="info-item" data-testid="user-location">
                                <i class="fas fa-map-marker-alt info-icon"></i>
                                <span class="info-text">${this.userData.location}</span>
                            </div>
                            <div class="info-item" data-testid="user-email">
                                <i class="fas fa-envelope info-icon"></i>
                                <span class="info-text">${this.userData.email}</span>
                            </div>
                            <div class="info-item" data-testid="user-join-date">
                                <i class="fas fa-calendar info-icon"></i>
                                <span class="info-text">Joined ${new Date(this.userData.joinDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h3 class="section-title">Skills</h3>
                        <div class="skills-container">
                            ${this.userData.skills.map(skill => 
                                `<span class="skill-tag" data-testid="skill-${skill.toLowerCase()}" data-skill="${skill}">${skill}</span>`
                            ).join('')}
                        </div>
                    </div>

                    <div class="section">
                        <h3 class="section-title">Statistics</h3>
                        <div class="stats-grid">
                            <div class="stat-item" data-testid="stat-projects" data-stat="projects">
                                <span class="stat-number">${this.userData.stats.projects}</span>
                                <span class="stat-label">Projects</span>
                            </div>
                            <div class="stat-item" data-testid="stat-commits" data-stat="commits">
                                <span class="stat-number">${this.userData.stats.commits}</span>
                                <span class="stat-label">Commits</span>
                            </div>
                            <div class="stat-item" data-testid="stat-reviews" data-stat="reviews">
                                <span class="stat-number">${this.userData.stats.reviews}</span>
                                <span class="stat-label">Reviews</span>
                            </div>
                            <div class="stat-item" data-testid="stat-contributions" data-stat="contributions">
                                <span class="stat-number">${this.userData.stats.contributions}</span>
                                <span class="stat-label">Contributions</span>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h3 class="section-title">Social Links</h3>
                        <div class="social-links">
                            <a href="${this.userData.social.linkedin}" class="social-link" data-testid="social-linkedin" target="_blank">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a href="${this.userData.social.github}" class="social-link" data-testid="social-github" target="_blank">
                                <i class="fab fa-github"></i>
                            </a>
                            <a href="${this.userData.social.twitter}" class="social-link" data-testid="social-twitter" target="_blank">
                                <i class="fab fa-twitter"></i>
                            </a>
                        </div>
                    </div>

                    <div class="action-buttons">
                        <button class="btn btn-primary" data-testid="message-user" data-action="message">
                            <i class="fas fa-envelope"></i> Message
                        </button>
                        <button class="btn btn-secondary" data-testid="view-profile" data-action="view-profile">
                            <i class="fas fa-user"></i> View Profile
                        </button>
                    </div>
                </div>

                <!-- Nested Shadow DOM Component: Profile Actions Menu -->
                <profile-actions-menu data-testid="profile-actions"></profile-actions-menu>
            </div>
        `;

        // Create nested Shadow DOM component
        this.createNestedComponent();
    }

    createNestedComponent() {
        // Create and register the nested ProfileActionsMenu component
        if (!customElements.get('profile-actions-menu')) {
            class ProfileActionsMenu extends BaseComponent {
                constructor() {
                    super();
                    this.isOpen = false;
                }

                connectedCallback() {
                    super.connectedCallback();
                    this.render();
                }

                render() {
                    this.shadowRoot.innerHTML = `
                        <style>
                            :host {
                                position: relative;
                                display: block;
                            }

                            .actions-menu {
                                position: absolute;
                                top: -10px;
                                right: 10px;
                                z-index: 1000;
                            }

                            .menu-trigger {
                                background: rgba(255, 255, 255, 0.9);
                                border: 1px solid #e5e7eb;
                                border-radius: 50%;
                                width: 36px;
                                height: 36px;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                backdrop-filter: blur(10px);
                            }

                            .menu-trigger:hover {
                                background: white;
                                transform: scale(1.1);
                                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                            }

                            .menu-dropdown {
                                position: absolute;
                                top: 45px;
                                right: 0;
                                background: white;
                                border-radius: 8px;
                                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                                min-width: 200px;
                                opacity: 0;
                                visibility: hidden;
                                transform: translateY(-10px);
                                transition: all 0.3s ease;
                                border: 1px solid #e5e7eb;
                            }

                            .menu-dropdown.open {
                                opacity: 1;
                                visibility: visible;
                                transform: translateY(0);
                            }

                            .menu-item {
                                padding: 0.75rem 1rem;
                                border-bottom: 1px solid #f3f4f6;
                                cursor: pointer;
                                transition: background-color 0.2s ease;
                                display: flex;
                                align-items: center;
                                gap: 0.75rem;
                            }

                            .menu-item:last-child {
                                border-bottom: none;
                            }

                            .menu-item:hover {
                                background: #f9fafb;
                            }

                            .menu-item:first-child {
                                border-radius: 8px 8px 0 0;
                            }

                            .menu-item:last-child {
                                border-radius: 0 0 8px 8px;
                            }

                            .menu-icon {
                                width: 16px;
                                height: 16px;
                                color: #6b7280;
                            }

                            .menu-text {
                                font-size: 0.875rem;
                                color: #374151;
                            }
                        </style>

                        <div class="actions-menu">
                            <button class="menu-trigger" data-testid="profile-menu-trigger">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>

                            <div class="menu-dropdown" data-testid="profile-menu-dropdown">
                                <div class="menu-item" data-testid="menu-edit-profile" data-action="edit">
                                    <i class="fas fa-edit menu-icon"></i>
                                    <span class="menu-text">Edit Profile</span>
                                </div>
                                <div class="menu-item" data-testid="menu-settings" data-action="settings">
                                    <i class="fas fa-cog menu-icon"></i>
                                    <span class="menu-text">Settings</span>
                                </div>
                                <div class="menu-item" data-testid="menu-export" data-action="export">
                                    <i class="fas fa-download menu-icon"></i>
                                    <span class="menu-text">Export Data</span>
                                </div>
                                <div class="menu-item" data-testid="menu-share" data-action="share">
                                    <i class="fas fa-share menu-icon"></i>
                                    <span class="menu-text">Share Profile</span>
                                </div>
                            </div>
                        </div>
                    `;

                    this.setupMenuInteractions();
                }

                setupMenuInteractions() {
                    const trigger = this.shadowRoot.querySelector('.menu-trigger');
                    const dropdown = this.shadowRoot.querySelector('.menu-dropdown');
                    const menuItems = this.shadowRoot.querySelectorAll('.menu-item');

                    trigger.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.isOpen = !this.isOpen;
                        dropdown.classList.toggle('open', this.isOpen);
                    });

                    // Close menu when clicking outside
                    document.addEventListener('click', () => {
                        if (this.isOpen) {
                            this.isOpen = false;
                            dropdown.classList.remove('open');
                        }
                    });

                    menuItems.forEach(item => {
                        item.addEventListener('click', (e) => {
                            const action = item.dataset.action;
                            this.handleMenuAction(action);
                            this.isOpen = false;
                            dropdown.classList.remove('open');
                        });
                    });
                }

                handleMenuAction(action) {
                    console.log(`Profile menu action: ${action}`);
                    this.dispatchEvent(new CustomEvent('profile-action', {
                        detail: { action },
                        bubbles: true
                    }));
                }
            }

            customElements.define('profile-actions-menu', ProfileActionsMenu);
        }
    }

    initializeInteractions() {
        // Skill tag interactions
        const skillTags = this.shadowRoot.querySelectorAll('.skill-tag');
        skillTags.forEach(tag => {
            tag.addEventListener('click', () => {
                const skill = tag.dataset.skill;
                console.log(`Skill clicked: ${skill}`);
                this.dispatchEvent(new CustomEvent('skill-selected', {
                    detail: { skill },
                    bubbles: true
                }));
            });
        });

        // Stat item interactions
        const statItems = this.shadowRoot.querySelectorAll('.stat-item');
        statItems.forEach(item => {
            item.addEventListener('click', () => {
                const stat = item.dataset.stat;
                console.log(`Stat clicked: ${stat}`);
                this.dispatchEvent(new CustomEvent('stat-selected', {
                    detail: { stat },
                    bubbles: true
                }));
            });
        });

        // Action button interactions
        const actionButtons = this.shadowRoot.querySelectorAll('[data-action]');
        actionButtons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                console.log(`Profile action: ${action}`);
                this.dispatchEvent(new CustomEvent('profile-action', {
                    detail: { action },
                    bubbles: true
                }));
            });
        });

        // Social link interactions
        const socialLinks = this.shadowRoot.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                console.log(`Social link clicked: ${link.href}`);
                this.dispatchEvent(new CustomEvent('social-link-clicked', {
                    detail: { url: link.href },
                    bubbles: true
                }));
            });
        });
    }
}

// Register the component
customElements.define('user-profile-card', UserProfileCard);
