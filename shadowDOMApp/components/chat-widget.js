// Advanced Chat Widget with Real-time Messaging
class ChatWidget extends BaseComponent {
    constructor() {
        super();
        this.isOpen = false;
        this.isMinimized = false;
        this.currentUser = {
            id: 1,
            name: 'John Doe',
            avatar: 'https://via.placeholder.com/40x40/667eea/ffffff?text=JD',
            status: 'online'
        };
        this.messages = this.generateMockMessages();
        this.typingUsers = new Set();
        this.unreadCount = 3;
        this.activeConversation = 'general';
        this.conversations = {
            general: { name: 'General Chat', participants: 24, unread: 3 },
            support: { name: 'Support Team', participants: 5, unread: 0 },
            project: { name: 'Project Alpha', participants: 8, unread: 1 }
        };
    }

    connectedCallback() {
        super.connectedCallback();
        this.render();
        this.initializeChat();
        this.startTypingSimulation();
    }

    generateMockMessages() {
        const users = [
            { id: 2, name: 'Alice Smith', avatar: 'https://via.placeholder.com/40x40/f093fb/ffffff?text=AS', status: 'online' },
            { id: 3, name: 'Bob Johnson', avatar: 'https://via.placeholder.com/40x40/4ade80/ffffff?text=BJ', status: 'away' },
            { id: 4, name: 'Carol Wilson', avatar: 'https://via.placeholder.com/40x40/fb7185/ffffff?text=CW', status: 'online' },
            { id: 5, name: 'David Brown', avatar: 'https://via.placeholder.com/40x40/fbbf24/ffffff?text=DB', status: 'offline' }
        ];

        const messages = [
            { id: 1, user: users[0], text: 'Hey everyone! How\'s the project going?', timestamp: new Date(Date.now() - 3600000), type: 'text' },
            { id: 2, user: users[1], text: 'Looking good! Just finished the authentication module.', timestamp: new Date(Date.now() - 3300000), type: 'text' },
            { id: 3, user: this.currentUser, text: 'Awesome! I\'ll review it later today.', timestamp: new Date(Date.now() - 3000000), type: 'text' },
            { id: 4, user: users[2], text: 'Here\'s the latest mockup:', timestamp: new Date(Date.now() - 2700000), type: 'text' },
            { id: 5, user: users[2], text: 'https://via.placeholder.com/300x200/667eea/ffffff?text=Mockup', timestamp: new Date(Date.now() - 2690000), type: 'image' },
            { id: 6, user: users[0], text: 'Perfect! The design looks clean and modern.', timestamp: new Date(Date.now() - 2400000), type: 'text' },
            { id: 7, user: users[3], text: 'Should we schedule a meeting for tomorrow?', timestamp: new Date(Date.now() - 1800000), type: 'text' },
            { id: 8, user: this.currentUser, text: 'Sure, let me check my calendar...', timestamp: new Date(Date.now() - 1500000), type: 'text' },
            { id: 9, user: users[1], text: '📅 How about 2 PM EST?', timestamp: new Date(Date.now() - 900000), type: 'text' },
            { id: 10, user: users[0], text: 'Works for me! 👍', timestamp: new Date(Date.now() - 600000), type: 'text' }
        ];

        return messages;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    z-index: 10000;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }

                .chat-widget {
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    width: 350px;
                    height: 500px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    transform: translateY(100%);
                    opacity: 0;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                    border: 1px solid #e5e7eb;
                }

                :host(.open) .chat-widget {
                    transform: translateY(0);
                    opacity: 1;
                }

                :host(.minimized) .chat-widget {
                    height: 60px;
                }

                .chat-trigger {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                    margin-left: auto;
                    margin-top: auto;
                }

                .chat-trigger:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
                }

                .chat-trigger .icon {
                    color: white;
                    font-size: 1.5rem;
                    transition: transform 0.3s ease;
                }

                :host(.open) .chat-trigger .icon {
                    transform: rotate(180deg);
                }

                .unread-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.75rem;
                    font-weight: 600;
                    transform: scale(${this.unreadCount > 0 ? '1' : '0'});
                    transition: transform 0.3s ease;
                }

                .chat-header {
                    padding: 1rem 1.5rem;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                .chat-title {
                    font-size: 1rem;
                    font-weight: 600;
                    margin: 0;
                }

                .chat-status {
                    font-size: 0.75rem;
                    opacity: 0.9;
                    margin-top: 0.25rem;
                }

                .chat-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .control-btn {
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    border-radius: 6px;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    color: white;
                    transition: background-color 0.2s ease;
                }

                .control-btn:hover {
                    background: rgba(255, 255, 255, 0.3);
                }

                .chat-tabs {
                    display: flex;
                    background: #f9fafb;
                    border-bottom: 1px solid #e5e7eb;
                    overflow-x: auto;
                }

                .chat-tab {
                    flex: 1;
                    padding: 0.75rem 1rem;
                    border: none;
                    background: transparent;
                    color: #6b7280;
                    cursor: pointer;
                    font-size: 0.875rem;
                    font-weight: 500;
                    transition: all 0.2s ease;
                    border-bottom: 2px solid transparent;
                    white-space: nowrap;
                    position: relative;
                }

                .chat-tab:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                .chat-tab.active {
                    color: #6366f1;
                    border-bottom-color: #6366f1;
                    background: white;
                }

                .tab-unread {
                    position: absolute;
                    top: 0.5rem;
                    right: 0.5rem;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    font-size: 0.625rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                    background: #f9fafb;
                }

                .message {
                    display: flex;
                    align-items: flex-start;
                    gap: 0.75rem;
                    animation: messageSlideIn 0.3s ease;
                }

                .message.own {
                    flex-direction: row-reverse;
                }

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    object-fit: cover;
                    flex-shrink: 0;
                }

                .message-content {
                    flex: 1;
                    max-width: 80%;
                }

                .message-header {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    margin-bottom: 0.25rem;
                }

                .message.own .message-header {
                    flex-direction: row-reverse;
                }

                .message-author {
                    font-weight: 600;
                    color: #374151;
                    font-size: 0.875rem;
                }

                .message-time {
                    color: #9ca3af;
                    font-size: 0.75rem;
                }

                .message-bubble {
                    background: white;
                    padding: 0.75rem 1rem;
                    border-radius: 18px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                    word-wrap: break-word;
                    font-size: 0.875rem;
                    line-height: 1.4;
                }

                .message.own .message-bubble {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                }

                .message-image {
                    max-width: 200px;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .message-image:hover {
                    transform: scale(1.05);
                }

                .typing-indicator {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 0;
                    opacity: 0;
                    transform: translateY(10px);
                    transition: all 0.3s ease;
                }

                .typing-indicator.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .typing-dots {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    background: white;
                    padding: 0.75rem 1rem;
                    border-radius: 18px;
                    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                }

                .typing-dot {
                    width: 6px;
                    height: 6px;
                    background: #9ca3af;
                    border-radius: 50%;
                    animation: typingDot 1.4s infinite;
                }

                .typing-dot:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dot:nth-child(3) {
                    animation-delay: 0.4s;
                }

                .typing-text {
                    color: #6b7280;
                    font-size: 0.75rem;
                    font-style: italic;
                }

                .chat-input-container {
                    padding: 1rem;
                    background: white;
                    border-top: 1px solid #e5e7eb;
                }

                .chat-input-wrapper {
                    display: flex;
                    align-items: flex-end;
                    gap: 0.75rem;
                    background: #f3f4f6;
                    border-radius: 24px;
                    padding: 0.5rem;
                }

                .chat-input {
                    flex: 1;
                    border: none;
                    background: transparent;
                    padding: 0.5rem 0.75rem;
                    font-size: 0.875rem;
                    resize: none;
                    outline: none;
                    max-height: 100px;
                    min-height: 20px;
                    line-height: 1.4;
                }

                .chat-input::placeholder {
                    color: #9ca3af;
                }

                .input-actions {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .input-btn {
                    width: 32px;
                    height: 32px;
                    border: none;
                    border-radius: 50%;
                    background: #6b7280;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s ease;
                }

                .input-btn:hover {
                    background: #4b5563;
                    transform: scale(1.1);
                }

                .input-btn.send {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                }

                .input-btn.send:hover {
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                }

                .input-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .quick-actions {
                    display: flex;
                    gap: 0.5rem;
                    margin-top: 0.5rem;
                    flex-wrap: wrap;
                }

                .quick-action {
                    background: #e5e7eb;
                    border: none;
                    border-radius: 16px;
                    padding: 0.25rem 0.75rem;
                    font-size: 0.75rem;
                    color: #374151;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .quick-action:hover {
                    background: #d1d5db;
                    transform: translateY(-1px);
                }

                @keyframes messageSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes typingDot {
                    0%, 60%, 100% {
                        transform: translateY(0);
                    }
                    30% {
                        transform: translateY(-10px);
                    }
                }

                /* Mobile Responsiveness */
                @media (max-width: 768px) {
                    :host {
                        bottom: 10px;
                        right: 10px;
                    }

                    .chat-widget {
                        width: calc(100vw - 20px);
                        max-width: 350px;
                        height: 450px;
                    }

                    .chat-messages {
                        padding: 0.75rem;
                    }

                    .message-content {
                        max-width: 85%;
                    }
                }

                /* Hidden state */
                :host(.hidden) {
                    display: none;
                }
            </style>

            <div class="chat-widget" data-testid="chat-widget">
                <div class="chat-header" data-testid="chat-header">
                    <div>
                        <h3 class="chat-title" data-testid="chat-title">Team Chat</h3>
                        <div class="chat-status" data-testid="chat-status">
                            ${Object.values(this.conversations)[0].participants} participants online
                        </div>
                    </div>
                    
                    <div class="chat-controls">
                        <button class="control-btn" data-testid="video-call" title="Start Video Call">
                            <i class="fas fa-video"></i>
                        </button>
                        <button class="control-btn" data-testid="phone-call" title="Start Audio Call">
                            <i class="fas fa-phone"></i>
                        </button>
                        <button class="control-btn" data-testid="minimize-chat" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>

                <div class="chat-tabs" data-testid="chat-tabs">
                    ${Object.entries(this.conversations).map(([key, conv]) => `
                        <button class="chat-tab ${key === this.activeConversation ? 'active' : ''}" 
                                data-testid="chat-tab-${key}" 
                                data-conversation="${key}">
                            ${conv.name}
                            ${conv.unread > 0 ? `<span class="tab-unread">${conv.unread}</span>` : ''}
                        </button>
                    `).join('')}
                </div>

                <div class="chat-messages" data-testid="chat-messages">
                    ${this.renderMessages()}
                    
                    <div class="typing-indicator" data-testid="typing-indicator">
                        <img class="message-avatar" src="https://via.placeholder.com/32x32/f093fb/ffffff?text=AS" alt="User typing">
                        <div class="typing-dots">
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                            <div class="typing-dot"></div>
                        </div>
                        <span class="typing-text">Alice is typing...</span>
                    </div>
                </div>

                <div class="chat-input-container" data-testid="chat-input-container">
                    <div class="chat-input-wrapper">
                        <textarea 
                            class="chat-input" 
                            placeholder="Type your message..." 
                            rows="1"
                            data-testid="chat-input"
                        ></textarea>
                        
                        <div class="input-actions">
                            <button class="input-btn" data-testid="attach-file" title="Attach File">
                                <i class="fas fa-paperclip"></i>
                            </button>
                            <button class="input-btn" data-testid="add-emoji" title="Add Emoji">
                                <i class="fas fa-smile"></i>
                            </button>
                            <button class="input-btn send" data-testid="send-message" title="Send Message">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>

                    <div class="quick-actions" data-testid="quick-actions">
                        <button class="quick-action" data-testid="quick-thanks" data-message="Thanks! 👍">Thanks! 👍</button>
                        <button class="quick-action" data-testid="quick-meeting" data-message="Let's schedule a meeting">Let's schedule a meeting</button>
                        <button class="quick-action" data-testid="quick-review" data-message="I'll review this">I'll review this</button>
                    </div>
                </div>
            </div>

            <div class="chat-trigger" data-testid="chat-trigger">
                <i class="fas fa-comments icon"></i>
                <span class="unread-badge" data-testid="unread-badge">${this.unreadCount}</span>
            </div>
        `;
    }

    renderMessages() {
        return this.messages.map(message => {
            const isOwn = message.user.id === this.currentUser.id;
            const timeString = this.formatTime(message.timestamp);
            
            if (message.type === 'image') {
                return `
                    <div class="message ${isOwn ? 'own' : ''}" data-testid="message-${message.id}">
                        <img class="message-avatar" src="${message.user.avatar}" alt="${message.user.name}">
                        <div class="message-content">
                            <div class="message-header">
                                <span class="message-author">${message.user.name}</span>
                                <span class="message-time">${timeString}</span>
                            </div>
                            <div class="message-bubble">
                                <img class="message-image" src="${message.text}" alt="Shared image" data-testid="message-image-${message.id}">
                            </div>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="message ${isOwn ? 'own' : ''}" data-testid="message-${message.id}">
                    <img class="message-avatar" src="${message.user.avatar}" alt="${message.user.name}">
                    <div class="message-content">
                        <div class="message-header">
                            <span class="message-author">${message.user.name}</span>
                            <span class="message-time">${timeString}</span>
                        </div>
                        <div class="message-bubble" data-testid="message-text-${message.id}">
                            ${this.formatMessageText(message.text)}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    formatMessageText(text) {
        // Simple emoji and link formatting
        return text
            .replace(/:\)/g, '😊')
            .replace(/:\(/g, '😢')
            .replace(/:D/g, '😃')
            .replace(/👍/g, '👍')
            .replace(/📅/g, '📅')
            .replace(/https?:\/\/[^\s]+/g, '<a href="$&" target="_blank" style="color: inherit; text-decoration: underline;">$&</a>');
    }

    formatTime(timestamp) {
        const now = new Date();
        const diff = now - timestamp;
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (hours === 0) {
            return minutes === 0 ? 'just now' : `${minutes}m ago`;
        } else if (hours < 24) {
            return `${hours}h ago`;
        } else {
            return timestamp.toLocaleDateString();
        }
    }

    initializeChat() {
        this.setupEventListeners();
        this.scrollToBottom();
    }

    setupEventListeners() {
        // Chat trigger
        const trigger = this.shadowRoot.querySelector('[data-testid="chat-trigger"]');
        trigger.addEventListener('click', () => this.toggleChat());

        // Control buttons
        const minimizeBtn = this.shadowRoot.querySelector('[data-testid="minimize-chat"]');
        minimizeBtn.addEventListener('click', () => this.minimizeChat());

        const videoCallBtn = this.shadowRoot.querySelector('[data-testid="video-call"]');
        videoCallBtn.addEventListener('click', () => this.startVideoCall());

        const phoneCallBtn = this.shadowRoot.querySelector('[data-testid="phone-call"]');
        phoneCallBtn.addEventListener('click', () => this.startPhoneCall());

        // Chat tabs
        const tabs = this.shadowRoot.querySelectorAll('.chat-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const conversation = tab.dataset.conversation;
                this.switchConversation(conversation);
            });
        });

        // Message input
        const chatInput = this.shadowRoot.querySelector('[data-testid="chat-input"]');
        const sendBtn = this.shadowRoot.querySelector('[data-testid="send-message"]');

        chatInput.addEventListener('input', () => this.handleInputChange());
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        sendBtn.addEventListener('click', () => this.sendMessage());

        // Input action buttons
        const attachBtn = this.shadowRoot.querySelector('[data-testid="attach-file"]');
        const emojiBtn = this.shadowRoot.querySelector('[data-testid="add-emoji"]');

        attachBtn.addEventListener('click', () => this.attachFile());
        emojiBtn.addEventListener('click', () => this.showEmojiPicker());

        // Quick actions
        const quickActions = this.shadowRoot.querySelectorAll('.quick-action');
        quickActions.forEach(action => {
            action.addEventListener('click', () => {
                const message = action.dataset.message;
                this.sendQuickMessage(message);
            });
        });

        // Message images
        const messageImages = this.shadowRoot.querySelectorAll('.message-image');
        messageImages.forEach(img => {
            img.addEventListener('click', () => this.openImageModal(img.src));
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.classList.toggle('open', this.isOpen);
        
        if (this.isOpen) {
            this.unreadCount = 0;
            this.updateUnreadBadge();
            this.scrollToBottom();
            this.dispatchEvent(new CustomEvent('chat-opened', { bubbles: true }));
        } else {
            this.dispatchEvent(new CustomEvent('chat-closed', { bubbles: true }));
        }
    }

    minimizeChat() {
        this.isMinimized = !this.isMinimized;
        this.classList.toggle('minimized', this.isMinimized);
        
        if (!this.isMinimized) {
            this.scrollToBottom();
        }

        this.dispatchEvent(new CustomEvent('chat-minimized', { 
            detail: { minimized: this.isMinimized },
            bubbles: true 
        }));
    }

    switchConversation(conversationId) {
        this.activeConversation = conversationId;
        
        // Update active tab
        const tabs = this.shadowRoot.querySelectorAll('.chat-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.dataset.conversation === conversationId);
        });

        // Clear unread for this conversation
        this.conversations[conversationId].unread = 0;
        
        // Update chat title and status
        const titleEl = this.shadowRoot.querySelector('[data-testid="chat-title"]');
        const statusEl = this.shadowRoot.querySelector('[data-testid="chat-status"]');
        
        titleEl.textContent = this.conversations[conversationId].name;
        statusEl.textContent = `${this.conversations[conversationId].participants} participants online`;

        // Re-render messages (in a real app, you'd load different message sets)
        this.renderMessagesForConversation(conversationId);
        
        this.dispatchEvent(new CustomEvent('conversation-switched', {
            detail: { conversationId },
            bubbles: true
        }));
    }

    renderMessagesForConversation(conversationId) {
        // In a real app, you'd filter messages by conversation
        const messagesContainer = this.shadowRoot.querySelector('[data-testid="chat-messages"]');
        messagesContainer.innerHTML = this.renderMessages() + `
            <div class="typing-indicator" data-testid="typing-indicator">
                <img class="message-avatar" src="https://via.placeholder.com/32x32/f093fb/ffffff?text=AS" alt="User typing">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <span class="typing-text">Alice is typing...</span>
            </div>
        `;
        
        this.scrollToBottom();
    }

    handleInputChange() {
        const input = this.shadowRoot.querySelector('[data-testid="chat-input"]');
        const sendBtn = this.shadowRoot.querySelector('[data-testid="send-message"]');
        
        // Enable/disable send button
        sendBtn.disabled = !input.value.trim();
        
        // Auto-resize textarea
        input.style.height = 'auto';
        input.style.height = Math.min(input.scrollHeight, 100) + 'px';

        // Simulate typing indicator
        this.showTypingIndicator();
    }

    sendMessage() {
        const input = this.shadowRoot.querySelector('[data-testid="chat-input"]');
        const messageText = input.value.trim();
        
        if (!messageText) return;

        const newMessage = {
            id: this.messages.length + 1,
            user: this.currentUser,
            text: messageText,
            timestamp: new Date(),
            type: 'text'
        };

        this.messages.push(newMessage);
        input.value = '';
        input.style.height = 'auto';

        this.updateMessagesDisplay();
        this.scrollToBottom();

        // Simulate response after a delay
        setTimeout(() => this.simulateResponse(), 1000 + Math.random() * 2000);

        this.dispatchEvent(new CustomEvent('message-sent', {
            detail: { message: newMessage },
            bubbles: true
        }));
    }

    sendQuickMessage(messageText) {
        const input = this.shadowRoot.querySelector('[data-testid="chat-input"]');
        input.value = messageText;
        this.sendMessage();
    }

    simulateResponse() {
        const responses = [
            'Got it! 👍',
            'Sounds good to me!',
            'Let me check on that...',
            'Perfect timing!',
            'I\'ll get back to you on this.',
            'Great idea! 💡',
            'Thanks for the update.',
            'I agree completely.'
        ];

        const users = [
            { id: 2, name: 'Alice Smith', avatar: 'https://via.placeholder.com/40x40/f093fb/ffffff?text=AS', status: 'online' },
            { id: 3, name: 'Bob Johnson', avatar: 'https://via.placeholder.com/40x40/4ade80/ffffff?text=BJ', status: 'away' },
            { id: 4, name: 'Carol Wilson', avatar: 'https://via.placeholder.com/40x40/fb7185/ffffff?text=CW', status: 'online' }
        ];

        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        const responseMessage = {
            id: this.messages.length + 1,
            user: randomUser,
            text: randomResponse,
            timestamp: new Date(),
            type: 'text'
        };

        this.messages.push(responseMessage);
        this.updateMessagesDisplay();
        this.scrollToBottom();

        // Update unread count if chat is closed
        if (!this.isOpen) {
            this.unreadCount++;
            this.updateUnreadBadge();
        }

        this.dispatchEvent(new CustomEvent('message-received', {
            detail: { message: responseMessage },
            bubbles: true
        }));
    }

    updateMessagesDisplay() {
        const messagesContainer = this.shadowRoot.querySelector('[data-testid="chat-messages"]');
        messagesContainer.innerHTML = this.renderMessages() + `
            <div class="typing-indicator" data-testid="typing-indicator">
                <img class="message-avatar" src="https://via.placeholder.com/32x32/f093fb/ffffff?text=AS" alt="User typing">
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <span class="typing-text">Alice is typing...</span>
            </div>
        `;

        // Re-attach event listeners for new images
        const messageImages = this.shadowRoot.querySelectorAll('.message-image');
        messageImages.forEach(img => {
            img.addEventListener('click', () => this.openImageModal(img.src));
        });
    }

    updateUnreadBadge() {
        const badge = this.shadowRoot.querySelector('[data-testid="unread-badge"]');
        badge.textContent = this.unreadCount;
        badge.style.transform = this.unreadCount > 0 ? 'scale(1)' : 'scale(0)';
    }

    scrollToBottom() {
        const messagesContainer = this.shadowRoot.querySelector('[data-testid="chat-messages"]');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showTypingIndicator() {
        const indicator = this.shadowRoot.querySelector('[data-testid="typing-indicator"]');
        indicator.classList.add('visible');
        
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            indicator.classList.remove('visible');
        }, 2000);
    }

    startTypingSimulation() {
        // Periodically show typing indicator
        setInterval(() => {
            if (Math.random() < 0.1 && this.isOpen) { // 10% chance every interval
                this.showTypingIndicator();
            }
        }, 5000);
    }

    startVideoCall() {
        this.dispatchEvent(new CustomEvent('video-call-started', {
            detail: { conversation: this.activeConversation },
            bubbles: true
        }));
        
        // Show notification or modal for video call
        console.log('Starting video call...');
    }

    startPhoneCall() {
        this.dispatchEvent(new CustomEvent('phone-call-started', {
            detail: { conversation: this.activeConversation },
            bubbles: true
        }));
        
        console.log('Starting phone call...');
    }

    attachFile() {
        // Simulate file attachment
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,document/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                console.log('File selected:', file.name);
                this.dispatchEvent(new CustomEvent('file-attached', {
                    detail: { file },
                    bubbles: true
                }));
            }
        };
        input.click();
    }

    showEmojiPicker() {
        // Simple emoji insertion
        const emojis = ['😊', '😂', '👍', '❤️', '🎉', '🔥', '💡', '✅'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        const input = this.shadowRoot.querySelector('[data-testid="chat-input"]');
        input.value += randomEmoji;
        input.focus();
        
        this.dispatchEvent(new CustomEvent('emoji-selected', {
            detail: { emoji: randomEmoji },
            bubbles: true
        }));
    }

    openImageModal(src) {
        this.dispatchEvent(new CustomEvent('image-modal-requested', {
            detail: { imageSrc: src },
            bubbles: true
        }));
    }

    // Public methods for external control
    show() {
        this.classList.remove('hidden');
    }

    hide() {
        this.classList.add('hidden');
    }

    addMessage(message) {
        this.messages.push({
            id: this.messages.length + 1,
            ...message,
            timestamp: new Date()
        });
        
        this.updateMessagesDisplay();
        this.scrollToBottom();
        
        if (!this.isOpen) {
            this.unreadCount++;
            this.updateUnreadBadge();
        }
    }

    clearMessages() {
        this.messages = [];
        this.updateMessagesDisplay();
    }
}

// Register the component
customElements.define('chat-widget', ChatWidget);
