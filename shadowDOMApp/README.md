# Shadow DOM Test Application

A comprehensive, deeply nested Shadow DOM application designed specifically for testing the **Element AI Extractor VS Code extension**. This application showcases complex Shadow Root structures with modern web application components that the extension needs to extract and analyze.

## 🎯 Purpose

This application serves as a testing ground for Shadow DOM element extraction, featuring:
- **Deep Shadow DOM nesting** (up to 4 levels)
- **Complex component interactions**
- **Real-world web application patterns**
- **Comprehensive test scenarios**
- **Modern UI components**

## 🏗️ Architecture

### Component Structure
```
📦 shadowDOMApp/
├── 📄 index.html                    # Main application structure
├── 🎨 styles.css                    # Global CSS framework
├── ⚙️ app.js                        # Main application logic & testing utilities
└── 📁 components/
    ├── 🧩 base-component.js          # Base class for all components
    ├── 🧭 header-nav.js              # Multi-level navigation (4 levels deep)
    ├── 📊 dashboard-widget.js         # Analytics dashboard (3 levels deep)
    ├── 👤 user-profile-card.js       # User profile with nested menus
    ├── 🗔 modal-container.js          # Advanced modal system (4 levels deep)
    ├── 📝 complex-form-widget.js     # Multi-step form wizard
    ├── 📋 data-table-widget.js       # Enterprise data table
    ├── 💬 chat-widget.js             # Real-time messaging (3 levels deep)
    ├── 🔔 notification-system.js     # Global notification system
    ├── 🖼️ media-gallery.js           # Media management with lightbox
    └── 🛒 shopping-cart.js           # E-commerce cart with checkout
```

## 🌳 Shadow DOM Nesting Levels

### Level 4 Nesting (Deepest)
- **Navigation System**: Main nav → User menu → Settings panel → Quick actions
- **Modal Container**: Modal → Content type → Form elements → Input widgets

### Level 3 Nesting
- **Dashboard**: Widget → Chart components → Data points
- **Chat Widget**: Main chat → Message threads → Media players
- **User Profile**: Card → Actions menu → Dropdown options

### Level 2 Nesting
- **Form Components**: Wizard → Step panels
- **Media Gallery**: Gallery → Lightbox modal
- **Shopping Cart**: Cart panel → Checkout modal

## 🎮 Interactive Features

### Navigation System (`header-nav`)
- Multi-level dropdown menus
- Global search functionality
- User account management
- Notification indicators
- Mobile-responsive design

### Dashboard Analytics (`dashboard-widget`)
- Interactive charts and metrics
- Real-time data updates
- Geographic distribution maps
- Performance monitoring
- Export functionality

### Form Wizard (`complex-form-widget`)
- Multi-step registration process
- Real-time validation
- File upload handling
- Address autocomplete
- Password strength meter

### Modal System (`modal-container`)
- Login/authentication forms
- Contact forms
- Image galleries
- Video players
- Fullscreen capabilities

### Data Table (`data-table-widget`)
- Sorting and filtering
- Pagination controls
- Bulk operations
- Search functionality
- CSV export

### Chat System (`chat-widget`)
- Multiple conversations
- File attachments
- Emoji picker
- Video/audio calls
- Typing indicators

### Shopping Cart (`shopping-cart`)
- Product management
- Discount codes
- Shipping options
- Checkout flow
- Payment forms

### Media Gallery (`media-gallery`)
- Grid and list views
- File upload (drag & drop)
- Lightbox viewer
- Bulk operations
- Image/video preview

### Notification System (`notification-system`)
- Toast notifications
- Notification center
- Action buttons
- Auto-dismiss timers
- Keyboard shortcuts

## 🧪 Testing Features

### Data Test IDs
Every interactive element includes `data-testid` attributes for easy extraction:
```html
<button data-testid="login-submit">Login</button>
<input data-testid="search-input" type="search">
<div data-testid="cart-item-123">Product Item</div>
```

### Testing Utilities
Access via browser console:
```javascript
// Get all Shadow DOM roots
window.testShadowDOM.getAllShadowRoots()

// Find elements across all Shadow DOMs
window.testShadowDOM.findElementInShadowDOM('button')

// Extract all elements for analysis
window.testShadowDOM.extractAllElements()

// Get component states
window.testShadowDOM.getComponentStates()

// Run accessibility audit
window.testShadowDOM.runAccessibilityCheck()

// Simulate interactions
window.testShadowDOM.simulateInteraction('chat-widget', 'send-message', {
  text: 'Hello world!',
  recipient: 'user123'
})
```

## ⌨️ Keyboard Shortcuts

- **Ctrl+K** - Focus global search
- **Ctrl+M** - Open test modal
- **Ctrl+N** - Show test notification
- **Ctrl+C** - Toggle chat widget
- **Ctrl+S** - Add test item to cart
- **ESC** - Close all panels/modals

## 🎬 Demo Mode

The application includes an automatic demo sequence that:
1. Shows welcome notification with guided tour option
2. Simulates incoming chat messages
3. Adds products to shopping cart
4. Updates dashboard metrics
5. Demonstrates component interactions

## 📊 Performance Monitoring

Real-time performance metrics available:
```javascript
window.shadowDOMApp.getPerformanceMetrics()
```

Returns:
- Component count
- Shadow root count
- Total elements
- Memory usage
- Render time

## 🚀 Getting Started

1. **Open the application**:
   ```bash
   # Serve the files via a local server
   python -m http.server 8000
   # or
   npx serve .
   ```

2. **Open in browser**: 
   Navigate to `http://localhost:8000`

3. **Open Developer Tools**: 
   Press F12 to access console and testing utilities

4. **Start testing**: 
   Use the Element AI Extractor extension to analyze the Shadow DOM structure

## 🔍 Test Scenarios

### Basic Extraction
- Extract all interactive elements
- Map Shadow DOM hierarchy
- Identify nested components

### Complex Interactions
- Form submission flows
- Multi-step processes
- Real-time updates

### E-commerce Scenarios
- Product browsing
- Cart management
- Checkout process

### Communication Features
- Chat interactions
- Notification handling
- User management

### Data Management
- Table operations
- Search and filter
- Export functionality

### Media Handling
- File uploads
- Gallery navigation
- Video playback

## 🧩 Component API

### Event System
Components communicate via custom events:
```javascript
// Listen for component interactions
document.addEventListener('component-interaction', (e) => {
  console.log('Component:', e.detail.component);
  console.log('Action:', e.detail.action);
  console.log('Data:', e.detail.data);
});

// Trigger notifications
document.dispatchEvent(new CustomEvent('show-notification', {
  detail: {
    type: 'success',
    title: 'Test',
    message: 'Hello World!'
  }
}));

// Add to cart
document.dispatchEvent(new CustomEvent('add-to-cart', {
  detail: {
    id: 123,
    name: 'Product',
    price: 29.99
  }
}));
```

### State Management
Each component maintains its own state and provides access methods:
```javascript
const dashboard = document.querySelector('dashboard-widget');
dashboard.updateMetric('users', 1250);
dashboard.exportData('csv');

const cart = document.querySelector('shopping-cart');
cart.addToCart({ id: 1, name: 'Product', price: 19.99 });
cart.removeFromCart(1);
```

## 🎨 Styling System

### CSS Architecture
- **Global styles** in `styles.css`
- **Component-specific styles** in Shadow DOM
- **Responsive design** with mobile-first approach
- **Modern CSS features** (Grid, Flexbox, Custom Properties)

### Design System
- **Colors**: Consistent color palette with CSS variables
- **Typography**: System font stack with proper hierarchy
- **Spacing**: 8px grid system
- **Animations**: Smooth transitions and micro-interactions

## 🔧 Customization

### Adding New Components
1. Extend `BaseComponent` class
2. Implement `createShadowDOM()` method
3. Add event listeners in `connectedCallback()`
4. Include in `index.html`

### Modifying Test Data
Update sample data in component constructors:
- `generateSampleData()` methods
- `mockApiCalls()` functions
- Demo sequences in `app.js`

## 📋 Requirements

- **Modern browser** with Shadow DOM support
- **JavaScript enabled**
- **Local server** for file serving (security restrictions)

## 🎯 Testing Goals

This application is designed to test:
- **Shadow DOM traversal** algorithms
- **Element extraction** accuracy
- **Nested structure** mapping
- **Interactive element** identification
- **State change** detection
- **Performance** with complex DOMs
- **Accessibility** compliance
- **Cross-component** communication

## 🤝 Contributing

To add new test scenarios:
1. Create new component files
2. Follow the established patterns
3. Include comprehensive `data-testid` attributes
4. Add to the component registry in `app.js`
5. Update this documentation

## 📄 License

This test application is created specifically for testing the Element AI Extractor VS Code extension and is provided as-is for development and testing purposes.

---

**Happy Testing! 🚀**

*Built with ❤️ for comprehensive Shadow DOM testing*
