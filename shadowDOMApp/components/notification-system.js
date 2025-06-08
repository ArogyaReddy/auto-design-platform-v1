// Notification System Component with Deep Shadow DOM
class NotificationSystem extends BaseComponent {
    constructor() {
        super();
        this.notifications = [];
        this.maxNotifications = 5;
        this.notificationId = 0;
    }

    createShadowDOM() {
        return `
            <style>
                :host {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    pointer-events: none;
                }
                
                .notifications-container {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    min-width: 320px;
                    max-width: 400px;
                }
                
                .notification {
                    pointer-events: auto;
                    padding: 16px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    animation: slideIn 0.3s ease-out;
                    position: relative;
                    overflow: hidden;
                }
                
                .notification.success {
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                }
                
                .notification.error {
                    background: linear-gradient(135deg, #ef4444, #dc2626);
                    color: white;
                }
                
                .notification.warning {
                    background: linear-gradient(135deg, #f59e0b, #d97706);
                    color: white;
                }
                
                .notification.info {
                    background: linear-gradient(135deg, #3b82f6, #2563eb);
                    color: white;
                }
                
                .notification-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 8px;
                }
                
                .notification-title {
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .notification-icon {
                    font-size: 16px;
                }
                
                .notification-close {
                    background: none;
                    border: none;
                    color: currentColor;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 50%;
                    opacity: 0.8;
                    transition: opacity 0.2s;
                }
                
                .notification-close:hover {
                    opacity: 1;
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .notification-content {
                    font-size: 13px;
                    line-height: 1.4;
                    margin-bottom: 12px;
                }
                
                .notification-actions {
                    display: flex;
                    gap: 8px;
                    justify-content: flex-end;
                }
                
                .notification-action {
                    padding: 6px 12px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    background: rgba(255, 255, 255, 0.1);
                    color: currentColor;
                    border-radius: 4px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                
                .notification-action:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .notification-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: rgba(255, 255, 255, 0.3);
                    animation: progressBar var(--duration, 5s) linear;
                }
                
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                
                @keyframes progressBar {
                    from { width: 100%; }
                    to { width: 0%; }
                }
                
                .notification.removing {
                    animation: slideOut 0.3s ease-in forwards;
                }
                
                @keyframes slideOut {
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
                
                .notification-center-btn {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    color: white;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    transition: transform 0.2s;
                    pointer-events: auto;
                }
                
                .notification-center-btn:hover {
                    transform: scale(1.1);
                }
                
                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }
            </style>
            
            <div class="notifications-container" id="notifications-container">
                <!-- Dynamic notifications will be inserted here -->
            </div>
            
            <button class="notification-center-btn" id="notification-center-btn" data-testid="notification-center">
                <i class="fas fa-bell"></i>
                <div class="notification-badge" id="notification-badge" style="display: none;">0</div>
            </button>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.setupEventListeners();
        this.startDemoNotifications();
        
        // Listen for custom notification events
        document.addEventListener('show-notification', (e) => {
            this.showNotification(e.detail);
        });
    }

    setupEventListeners() {
        const centerBtn = this.shadowRoot.getElementById('notification-center-btn');
        centerBtn.addEventListener('click', () => {
            this.showNotificationCenter();
        });
    }

    showNotification(config = {}) {
        const notification = {
            id: ++this.notificationId,
            type: config.type || 'info',
            title: config.title || 'Notification',
            message: config.message || 'This is a notification message.',
            duration: config.duration || 5000,
            actions: config.actions || [],
            persistent: config.persistent || false,
            ...config
        };

        this.notifications.unshift(notification);
        if (this.notifications.length > this.maxNotifications) {
            this.notifications.pop();
        }

        this.renderNotifications();
        this.updateBadge();

        if (!notification.persistent && notification.duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification.id);
            }, notification.duration);
        }

        return notification.id;
    }

    removeNotification(id) {
        const notificationEl = this.shadowRoot.querySelector(`[data-notification-id="${id}"]`);
        if (notificationEl) {
            notificationEl.classList.add('removing');
            setTimeout(() => {
                this.notifications = this.notifications.filter(n => n.id !== id);
                this.renderNotifications();
                this.updateBadge();
            }, 300);
        }
    }

    renderNotifications() {
        const container = this.shadowRoot.getElementById('notifications-container');
        
        container.innerHTML = this.notifications.map(notification => {
            const iconMap = {
                success: 'fas fa-check-circle',
                error: 'fas fa-exclamation-circle',
                warning: 'fas fa-exclamation-triangle',
                info: 'fas fa-info-circle'
            };

            const actionsHtml = notification.actions.map(action => 
                `<button class="notification-action" data-action="${action.id}" data-testid="notification-action-${action.id}">
                    ${action.label}
                </button>`
            ).join('');

            return `
                <div class="notification ${notification.type}" 
                     data-notification-id="${notification.id}"
                     data-testid="notification-${notification.type}">
                    <div class="notification-header">
                        <div class="notification-title">
                            <i class="notification-icon ${iconMap[notification.type]}"></i>
                            ${notification.title}
                        </div>
                        <button class="notification-close" 
                                data-close="${notification.id}"
                                data-testid="notification-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="notification-content">${notification.message}</div>
                    ${actionsHtml ? `<div class="notification-actions">${actionsHtml}</div>` : ''}
                    ${!notification.persistent ? `<div class="notification-progress" style="--duration: ${notification.duration}ms;"></div>` : ''}
                </div>
            `;
        }).join('');

        // Add event listeners for close buttons and actions
        container.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.closest('[data-close]').dataset.close);
                this.removeNotification(id);
            });
        });

        container.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const actionId = e.target.dataset.action;
                const notificationId = parseInt(e.target.closest('[data-notification-id]').dataset.notificationId);
                this.handleNotificationAction(notificationId, actionId);
            });
        });
    }

    updateBadge() {
        const badge = this.shadowRoot.getElementById('notification-badge');
        const count = this.notifications.length;
        
        if (count > 0) {
            badge.style.display = 'flex';
            badge.textContent = count > 99 ? '99+' : count;
        } else {
            badge.style.display = 'none';
        }
    }

    handleNotificationAction(notificationId, actionId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            const action = notification.actions.find(a => a.id === actionId);
            if (action && action.callback) {
                action.callback();
            }
            
            // Remove notification after action
            this.removeNotification(notificationId);
        }
    }

    showNotificationCenter() {
        // Create a nested shadow DOM for the notification center
        const centerModal = document.createElement('div');
        centerModal.className = 'notification-center-modal';
        
        const centerShadow = centerModal.attachShadow({ mode: 'open' });
        centerShadow.innerHTML = `
            <style>
                :host-context(.notification-center-modal) {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 10001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .center-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                }
                
                .center-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .center-body {
                    padding: 20px;
                    max-height: 400px;
                    overflow-y: auto;
                }
                
                .history-item {
                    padding: 12px;
                    border-bottom: 1px solid #f3f4f6;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .history-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    color: white;
                }
                
                .history-content {
                    flex: 1;
                }
                
                .history-title {
                    font-weight: 600;
                    font-size: 14px;
                    margin-bottom: 4px;
                }
                
                .history-message {
                    font-size: 13px;
                    color: #6b7280;
                }
                
                .close-btn {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #6b7280;
                }
            </style>
            
            <div class="center-content">
                <div class="center-header">
                    <h3>Notification Center</h3>
                    <button class="close-btn" id="close-center">×</button>
                </div>
                <div class="center-body" id="center-body">
                    ${this.renderNotificationHistory()}
                </div>
            </div>
        `;

        centerShadow.getElementById('close-center').addEventListener('click', () => {
            document.body.removeChild(centerModal);
        });

        document.body.appendChild(centerModal);
    }

    renderNotificationHistory() {
        if (this.notifications.length === 0) {
            return '<div style="text-align: center; color: #6b7280; padding: 40px;">No notifications</div>';
        }

        return this.notifications.map(notification => {
            const colorMap = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };

            return `
                <div class="history-item">
                    <div class="history-icon" style="background: ${colorMap[notification.type]}">
                        <i class="fas fa-bell"></i>
                    </div>
                    <div class="history-content">
                        <div class="history-title">${notification.title}</div>
                        <div class="history-message">${notification.message}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    startDemoNotifications() {
        // Demo notifications to showcase the system
        setTimeout(() => {
            this.showNotification({
                type: 'success',
                title: 'Welcome!',
                message: 'Shadow DOM notification system is ready.',
                duration: 4000
            });
        }, 1000);

        setTimeout(() => {
            this.showNotification({
                type: 'info',
                title: 'New Feature',
                message: 'Check out the new dashboard analytics.',
                actions: [
                    { id: 'view', label: 'View', callback: () => console.log('View clicked') },
                    { id: 'dismiss', label: 'Dismiss', callback: () => console.log('Dismissed') }
                ]
            });
        }, 3000);

        setTimeout(() => {
            this.showNotification({
                type: 'warning',
                title: 'System Update',
                message: 'A system update will be performed at midnight.',
                duration: 6000
            });
        }, 5000);
    }
}

customElements.define('notification-system', NotificationSystem);
