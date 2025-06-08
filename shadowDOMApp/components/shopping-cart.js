// Shopping Cart Component with Deep Shadow DOM
class ShoppingCart extends BaseComponent {
    constructor() {
        super();
        this.cart = [];
        this.isOpen = false;
        this.total = 0;
        this.currency = 'USD';
        this.discountCode = '';
        this.shippingOptions = [
            { id: 'standard', name: 'Standard Shipping', price: 5.99, days: '5-7' },
            { id: 'express', name: 'Express Shipping', price: 12.99, days: '2-3' },
            { id: 'overnight', name: 'Overnight Shipping', price: 24.99, days: '1' }
        ];
        this.selectedShipping = 'standard';
        this.initializeCart();
    }

    createShadowDOM() {
        return `
            <style>
                :host {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                }
                
                .cart-trigger {
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    transition: transform 0.3s ease;
                    position: relative;
                }
                
                .cart-trigger:hover {
                    transform: scale(1.1);
                }
                
                .cart-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 600;
                    animation: pulse 2s infinite;
                }
                
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                .cart-panel {
                    position: fixed;
                    top: 0;
                    right: 0;
                    width: 450px;
                    height: 100vh;
                    background: white;
                    box-shadow: -4px 0 20px rgba(0, 0, 0, 0.15);
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                }
                
                .cart-panel.open {
                    transform: translateX(0);
                }
                
                .cart-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .cart-title {
                    font-size: 18px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                
                .cart-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.3s;
                }
                
                .cart-close:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .cart-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }
                
                .cart-empty {
                    text-align: center;
                    padding: 60px 20px;
                    color: #6b7280;
                }
                
                .cart-empty-icon {
                    font-size: 48px;
                    margin-bottom: 16px;
                    opacity: 0.5;
                }
                
                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }
                
                .cart-item {
                    display: flex;
                    gap: 12px;
                    padding: 16px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    background: #f9fafb;
                    transition: all 0.3s;
                }
                
                .cart-item:hover {
                    border-color: #667eea;
                    background: #f0f4ff;
                }
                
                .item-image {
                    width: 60px;
                    height: 60px;
                    border-radius: 6px;
                    object-fit: cover;
                    background: #e5e7eb;
                }
                
                .item-details {
                    flex: 1;
                }
                
                .item-name {
                    font-weight: 600;
                    margin-bottom: 4px;
                    color: #1f2937;
                }
                
                .item-description {
                    font-size: 14px;
                    color: #6b7280;
                    margin-bottom: 8px;
                }
                
                .item-price {
                    font-weight: 600;
                    color: #667eea;
                }
                
                .item-actions {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                
                .quantity-controls {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                
                .quantity-btn {
                    width: 28px;
                    height: 28px;
                    border: 1px solid #d1d5db;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 14px;
                    transition: all 0.3s;
                }
                
                .quantity-btn:hover {
                    border-color: #667eea;
                    background: #f0f4ff;
                }
                
                .quantity-input {
                    width: 40px;
                    text-align: center;
                    border: 1px solid #d1d5db;
                    border-radius: 4px;
                    padding: 4px;
                    font-size: 14px;
                }
                
                .remove-btn {
                    background: none;
                    border: none;
                    color: #ef4444;
                    cursor: pointer;
                    font-size: 16px;
                    padding: 4px;
                    border-radius: 4px;
                    transition: background 0.3s;
                }
                
                .remove-btn:hover {
                    background: #fef2f2;
                }
                
                .cart-summary {
                    border-top: 1px solid #e5e7eb;
                    padding: 20px;
                    background: #f9fafb;
                }
                
                .discount-section {
                    margin-bottom: 16px;
                }
                
                .discount-input {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                }
                
                .discount-code {
                    flex: 1;
                    padding: 10px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                }
                
                .apply-discount {
                    padding: 10px 16px;
                    background: #667eea;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.3s;
                }
                
                .apply-discount:hover {
                    background: #5a67d8;
                }
                
                .discount-message {
                    font-size: 12px;
                    color: #059669;
                    margin-top: 4px;
                }
                
                .shipping-section {
                    margin-bottom: 16px;
                }
                
                .shipping-label {
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: block;
                }
                
                .shipping-options {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                
                .shipping-option {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px;
                    border: 1px solid #e5e7eb;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .shipping-option:hover,
                .shipping-option.selected {
                    border-color: #667eea;
                    background: #f0f4ff;
                }
                
                .shipping-info {
                    flex: 1;
                }
                
                .shipping-name {
                    font-weight: 600;
                    font-size: 14px;
                }
                
                .shipping-details {
                    font-size: 12px;
                    color: #6b7280;
                }
                
                .shipping-price {
                    font-weight: 600;
                    color: #667eea;
                }
                
                .totals {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 20px;
                }
                
                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .total-row.final {
                    font-size: 18px;
                    font-weight: 700;
                    padding-top: 8px;
                    border-top: 1px solid #d1d5db;
                    color: #1f2937;
                }
                
                .checkout-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s;
                }
                
                .checkout-btn:hover {
                    transform: translateY(-2px);
                }
                
                .checkout-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }
                
                .cart-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 9999;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .cart-overlay.show {
                    opacity: 1;
                    visibility: visible;
                }
                
                @media (max-width: 480px) {
                    .cart-panel {
                        width: 100vw;
                    }
                }
            </style>
            
            <div class="cart-overlay" id="cart-overlay"></div>
            
            <button class="cart-trigger" id="cart-trigger" data-testid="cart-trigger">
                <i class="fas fa-shopping-cart"></i>
                <div class="cart-badge" id="cart-badge" style="display: none;">0</div>
            </button>
            
            <div class="cart-panel" id="cart-panel">
                <div class="cart-header">
                    <div class="cart-title">
                        <i class="fas fa-shopping-cart"></i>
                        Shopping Cart
                    </div>
                    <button class="cart-close" id="cart-close" data-testid="cart-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="cart-content" id="cart-content">
                    <!-- Cart items will be rendered here -->
                </div>
                
                <div class="cart-summary" id="cart-summary" style="display: none;">
                    <div class="discount-section">
                        <div class="discount-input">
                            <input type="text" class="discount-code" placeholder="Discount code" 
                                   id="discount-input" data-testid="discount-input">
                            <button class="apply-discount" id="apply-discount" data-testid="apply-discount">
                                Apply
                            </button>
                        </div>
                        <div class="discount-message" id="discount-message" style="display: none;"></div>
                    </div>
                    
                    <div class="shipping-section">
                        <label class="shipping-label">Shipping Options</label>
                        <div class="shipping-options" id="shipping-options">
                            <!-- Shipping options will be rendered here -->
                        </div>
                    </div>
                    
                    <div class="totals" id="totals">
                        <!-- Totals will be rendered here -->
                    </div>
                    
                    <button class="checkout-btn" id="checkout-btn" data-testid="checkout-btn">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.setupEventListeners();
        this.renderCart();
        
        // Listen for add to cart events
        document.addEventListener('add-to-cart', (e) => {
            this.addToCart(e.detail);
        });
    }

    setupEventListeners() {
        const trigger = this.shadowRoot.getElementById('cart-trigger');
        const close = this.shadowRoot.getElementById('cart-close');
        const overlay = this.shadowRoot.getElementById('cart-overlay');
        const discountBtn = this.shadowRoot.getElementById('apply-discount');
        const checkoutBtn = this.shadowRoot.getElementById('checkout-btn');

        trigger.addEventListener('click', () => this.toggleCart());
        close.addEventListener('click', () => this.closeCart());
        overlay.addEventListener('click', () => this.closeCart());
        discountBtn.addEventListener('click', () => this.applyDiscount());
        checkoutBtn.addEventListener('click', () => this.proceedToCheckout());

        // Listen for Enter key on discount input
        this.shadowRoot.getElementById('discount-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.applyDiscount();
            }
        });
    }

    initializeCart() {
        // Add some sample items for testing
        setTimeout(() => {
            this.addToCart({
                id: 1,
                name: 'Premium Headphones',
                description: 'Wireless noise-canceling headphones',
                price: 199.99,
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23667eea"/><text x="30" y="35" text-anchor="middle" fill="white" font-size="10">🎧</text></svg>',
                quantity: 1
            });

            this.addToCart({
                id: 2,
                name: 'Smart Watch',
                description: 'Fitness tracking smartwatch',
                price: 299.99,
                image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23764ba2"/><text x="30" y="35" text-anchor="middle" fill="white" font-size="10">⌚</text></svg>',
                quantity: 1
            });
        }, 2000);
    }

    toggleCart() {
        this.isOpen = !this.isOpen;
        const panel = this.shadowRoot.getElementById('cart-panel');
        const overlay = this.shadowRoot.getElementById('cart-overlay');
        
        panel.classList.toggle('open', this.isOpen);
        overlay.classList.toggle('show', this.isOpen);
    }

    closeCart() {
        this.isOpen = false;
        const panel = this.shadowRoot.getElementById('cart-panel');
        const overlay = this.shadowRoot.getElementById('cart-overlay');
        
        panel.classList.remove('open');
        overlay.classList.remove('show');
    }

    addToCart(item) {
        const existingItem = this.cart.find(cartItem => cartItem.id === item.id);
        
        if (existingItem) {
            existingItem.quantity += item.quantity || 1;
        } else {
            this.cart.push({
                ...item,
                quantity: item.quantity || 1
            });
        }

        this.updateCartBadge();
        this.renderCart();
        this.calculateTotals();

        // Show notification
        this.dispatchEvent(new CustomEvent('show-notification', {
            detail: {
                type: 'success',
                title: 'Added to Cart',
                message: `${item.name} has been added to your cart.`,
                duration: 3000
            },
            bubbles: true
        }));
    }

    removeFromCart(itemId) {
        this.cart = this.cart.filter(item => item.id !== itemId);
        this.updateCartBadge();
        this.renderCart();
        this.calculateTotals();
    }

    updateQuantity(itemId, newQuantity) {
        const item = this.cart.find(cartItem => cartItem.id === itemId);
        if (item) {
            if (newQuantity <= 0) {
                this.removeFromCart(itemId);
            } else {
                item.quantity = newQuantity;
                this.renderCart();
                this.calculateTotals();
            }
        }
    }

    updateCartBadge() {
        const badge = this.shadowRoot.getElementById('cart-badge');
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        
        if (totalItems > 0) {
            badge.style.display = 'flex';
            badge.textContent = totalItems > 99 ? '99+' : totalItems;
        } else {
            badge.style.display = 'none';
        }
    }

    renderCart() {
        const content = this.shadowRoot.getElementById('cart-content');
        const summary = this.shadowRoot.getElementById('cart-summary');

        if (this.cart.length === 0) {
            content.innerHTML = `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <h3>Your cart is empty</h3>
                    <p>Add some items to get started!</p>
                </div>
            `;
            summary.style.display = 'none';
        } else {
            content.innerHTML = `
                <div class="cart-items">
                    ${this.cart.map(item => this.renderCartItem(item)).join('')}
                </div>
            `;
            summary.style.display = 'block';
            this.renderShippingOptions();
        }
    }

    renderCartItem(item) {
        return `
            <div class="cart-item" data-item-id="${item.id}" data-testid="cart-item-${item.id}">
                <img src="${item.image}" alt="${item.name}" class="item-image">
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-description">${item.description}</div>
                    <div class="item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="item-actions">
                    <div class="quantity-controls">
                        <button class="quantity-btn" data-action="decrease" data-item-id="${item.id}" 
                                data-testid="decrease-${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="1" data-item-id="${item.id}" data-testid="quantity-${item.id}">
                        <button class="quantity-btn" data-action="increase" data-item-id="${item.id}"
                                data-testid="increase-${item.id}">+</button>
                    </div>
                    <button class="remove-btn" data-item-id="${item.id}" data-testid="remove-${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    renderShippingOptions() {
        const container = this.shadowRoot.getElementById('shipping-options');
        
        container.innerHTML = this.shippingOptions.map(option => `
            <div class="shipping-option ${option.id === this.selectedShipping ? 'selected' : ''}"
                 data-shipping-id="${option.id}" data-testid="shipping-${option.id}">
                <input type="radio" name="shipping" value="${option.id}" 
                       ${option.id === this.selectedShipping ? 'checked' : ''}>
                <div class="shipping-info">
                    <div class="shipping-name">${option.name}</div>
                    <div class="shipping-details">${option.days} business days</div>
                </div>
                <div class="shipping-price">$${option.price.toFixed(2)}</div>
            </div>
        `).join('');

        // Add event listeners for shipping options
        container.querySelectorAll('.shipping-option').forEach(option => {
            option.addEventListener('click', () => {
                this.selectedShipping = option.dataset.shippingId;
                this.renderShippingOptions();
                this.calculateTotals();
            });
        });
    }

    calculateTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = this.shippingOptions.find(option => option.id === this.selectedShipping)?.price || 0;
        const discountAmount = this.calculateDiscount(subtotal);
        this.total = subtotal + shipping - discountAmount;

        this.renderTotals(subtotal, shipping, discountAmount);
    }

    calculateDiscount(subtotal) {
        if (this.discountCode === 'SAVE10') {
            return subtotal * 0.1; // 10% discount
        } else if (this.discountCode === 'SAVE20') {
            return subtotal * 0.2; // 20% discount
        } else if (this.discountCode === 'FREESHIP') {
            const shipping = this.shippingOptions.find(option => option.id === this.selectedShipping)?.price || 0;
            return shipping; // Free shipping
        }
        return 0;
    }

    renderTotals(subtotal, shipping, discount) {
        const totals = this.shadowRoot.getElementById('totals');
        
        totals.innerHTML = `
            <div class="total-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="total-row">
                <span>Shipping:</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            ${discount > 0 ? `
                <div class="total-row" style="color: #059669;">
                    <span>Discount:</span>
                    <span>-$${discount.toFixed(2)}</span>
                </div>
            ` : ''}
            <div class="total-row final">
                <span>Total:</span>
                <span>$${this.total.toFixed(2)}</span>
            </div>
        `;

        // Attach quantity control event listeners
        this.attachQuantityListeners();
    }

    attachQuantityListeners() {
        // Quantity buttons
        this.shadowRoot.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.itemId);
                const action = e.target.dataset.action;
                const item = this.cart.find(cartItem => cartItem.id === itemId);
                
                if (item) {
                    if (action === 'increase') {
                        this.updateQuantity(itemId, item.quantity + 1);
                    } else if (action === 'decrease') {
                        this.updateQuantity(itemId, item.quantity - 1);
                    }
                }
            });
        });

        // Quantity inputs
        this.shadowRoot.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const itemId = parseInt(e.target.dataset.itemId);
                const newQuantity = parseInt(e.target.value) || 1;
                this.updateQuantity(itemId, newQuantity);
            });
        });

        // Remove buttons
        this.shadowRoot.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.dataset.itemId);
                this.removeFromCart(itemId);
            });
        });
    }

    applyDiscount() {
        const input = this.shadowRoot.getElementById('discount-input');
        const message = this.shadowRoot.getElementById('discount-message');
        const code = input.value.trim().toUpperCase();

        const validCodes = {
            'SAVE10': '10% discount applied!',
            'SAVE20': '20% discount applied!',
            'FREESHIP': 'Free shipping applied!'
        };

        if (validCodes[code]) {
            this.discountCode = code;
            message.textContent = validCodes[code];
            message.style.display = 'block';
            message.style.color = '#059669';
            this.calculateTotals();
        } else if (code) {
            message.textContent = 'Invalid discount code';
            message.style.display = 'block';
            message.style.color = '#ef4444';
        } else {
            message.style.display = 'none';
        }
    }

    proceedToCheckout() {
        if (this.cart.length === 0) return;

        // Create checkout modal with nested shadow DOM
        this.createCheckoutModal();
    }

    createCheckoutModal() {
        const modal = document.createElement('div');
        modal.className = 'checkout-modal';
        
        const modalShadow = modal.attachShadow({ mode: 'open' });
        modalShadow.innerHTML = `
            <style>
                :host-context(.checkout-modal) {
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
                
                .modal-content {
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                }
                
                .modal-header {
                    padding: 24px;
                    border-bottom: 1px solid #e5e7eb;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-title {
                    font-size: 20px;
                    font-weight: 600;
                }
                
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #6b7280;
                }
                
                .modal-body {
                    padding: 24px;
                }
                
                .checkout-form {
                    display: grid;
                    gap: 20px;
                }
                
                .form-section {
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    padding: 20px;
                }
                
                .section-title {
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    color: #1f2937;
                }
                
                .form-group {
                    margin-bottom: 16px;
                }
                
                .form-label {
                    display: block;
                    font-weight: 500;
                    margin-bottom: 6px;
                    color: #374151;
                }
                
                .form-input {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.3s;
                }
                
                .form-input:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }
                
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }
                
                .order-summary {
                    background: #f9fafb;
                    border-radius: 8px;
                    padding: 16px;
                    margin-bottom: 24px;
                }
                
                .summary-item {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 8px;
                }
                
                .summary-total {
                    font-weight: 600;
                    font-size: 16px;
                    padding-top: 8px;
                    border-top: 1px solid #e5e7eb;
                }
                
                .place-order-btn {
                    width: 100%;
                    padding: 16px;
                    background: linear-gradient(135deg, #10b981, #059669);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: transform 0.3s;
                }
                
                .place-order-btn:hover {
                    transform: translateY(-2px);
                }
            </style>
            
            <div class="modal-content">
                <div class="modal-header">
                    <div class="modal-title">Checkout</div>
                    <button class="modal-close" id="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="order-summary">
                        <h4>Order Summary</h4>
                        ${this.cart.map(item => `
                            <div class="summary-item">
                                <span>${item.name} × ${item.quantity}</span>
                                <span>$${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                        <div class="summary-item summary-total">
                            <span>Total</span>
                            <span>$${this.total.toFixed(2)}</span>
                        </div>
                    </div>
                    
                    <form class="checkout-form" id="checkout-form">
                        <div class="form-section">
                            <div class="section-title">Shipping Address</div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">First Name</label>
                                    <input type="text" class="form-input" required data-testid="first-name">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">Last Name</label>
                                    <input type="text" class="form-input" required data-testid="last-name">
                                </div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Address</label>
                                <input type="text" class="form-input" required data-testid="address">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">City</label>
                                    <input type="text" class="form-input" required data-testid="city">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">ZIP Code</label>
                                    <input type="text" class="form-input" required data-testid="zip">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-section">
                            <div class="section-title">Payment Information</div>
                            <div class="form-group">
                                <label class="form-label">Card Number</label>
                                <input type="text" class="form-input" placeholder="1234 5678 9012 3456" 
                                       required data-testid="card-number">
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label class="form-label">Expiry Date</label>
                                    <input type="text" class="form-input" placeholder="MM/YY" 
                                           required data-testid="expiry">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">CVV</label>
                                    <input type="text" class="form-input" placeholder="123" 
                                           required data-testid="cvv">
                                </div>
                            </div>
                        </div>
                        
                        <button type="submit" class="place-order-btn" data-testid="place-order">
                            Place Order - $${this.total.toFixed(2)}
                        </button>
                    </form>
                </div>
            </div>
        `;

        modalShadow.getElementById('modal-close').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modalShadow.getElementById('checkout-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.completeOrder();
            document.body.removeChild(modal);
        });

        document.body.appendChild(modal);
    }

    completeOrder() {
        // Clear cart
        this.cart = [];
        this.updateCartBadge();
        this.renderCart();
        this.closeCart();

        // Show success notification
        this.dispatchEvent(new CustomEvent('show-notification', {
            detail: {
                type: 'success',
                title: 'Order Placed!',
                message: 'Your order has been placed successfully. You will receive a confirmation email shortly.',
                duration: 5000
            },
            bubbles: true
        }));
    }
}

customElements.define('shopping-cart', ShoppingCart);
