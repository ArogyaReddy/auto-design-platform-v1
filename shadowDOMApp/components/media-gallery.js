// Media Gallery Component with Deep Shadow DOM Nesting
class MediaGallery extends BaseComponent {
    constructor() {
        super();
        this.currentView = 'grid';
        this.currentFilter = 'all';
        this.selectedItems = new Set();
        this.currentLightboxIndex = 0;
        this.mediaItems = this.generateSampleMedia();
    }

    createShadowDOM() {
        return `
            <style>
                :host {
                    display: block;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }
                
                .gallery-header {
                    padding: 20px;
                    border-bottom: 1px solid #e5e7eb;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                }
                
                .gallery-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin-bottom: 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                
                .gallery-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }
                
                .filter-buttons {
                    display: flex;
                    gap: 8px;
                }
                
                .filter-btn {
                    padding: 8px 16px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 20px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-size: 14px;
                }
                
                .filter-btn:hover,
                .filter-btn.active {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.5);
                }
                
                .view-toggles {
                    display: flex;
                    gap: 8px;
                }
                
                .view-btn {
                    padding: 8px 12px;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .view-btn:hover,
                .view-btn.active {
                    background: rgba(255, 255, 255, 0.2);
                }
                
                .upload-area {
                    margin: 20px;
                    padding: 40px;
                    border: 2px dashed #d1d5db;
                    border-radius: 8px;
                    text-align: center;
                    background: #f9fafb;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .upload-area:hover {
                    border-color: #667eea;
                    background: #f0f4ff;
                }
                
                .upload-area.dragover {
                    border-color: #667eea;
                    background: #e0e7ff;
                }
                
                .media-grid {
                    padding: 20px;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                    gap: 16px;
                }
                
                .media-list {
                    padding: 20px;
                }
                
                .media-item {
                    position: relative;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    transition: transform 0.3s;
                    background: #f3f4f6;
                }
                
                .media-item:hover {
                    transform: scale(1.02);
                }
                
                .media-thumbnail {
                    width: 100%;
                    height: 150px;
                    object-fit: cover;
                    display: block;
                }
                
                .media-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
                    opacity: 0;
                    transition: opacity 0.3s;
                    display: flex;
                    align-items: flex-end;
                    padding: 16px;
                }
                
                .media-item:hover .media-overlay {
                    opacity: 1;
                }
                
                .media-info {
                    color: white;
                    font-size: 14px;
                }
                
                .media-title {
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .media-meta {
                    font-size: 12px;
                    opacity: 0.8;
                }
                
                .media-actions {
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    display: flex;
                    gap: 4px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .media-item:hover .media-actions {
                    opacity: 1;
                }
                
                .media-action-btn {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.3s;
                }
                
                .media-action-btn:hover {
                    background: rgba(0, 0, 0, 0.9);
                }
                
                .media-checkbox {
                    position: absolute;
                    top: 8px;
                    left: 8px;
                    width: 20px;
                    height: 20px;
                    opacity: 0;
                    transition: opacity 0.3s;
                }
                
                .media-item:hover .media-checkbox,
                .media-item.selected .media-checkbox {
                    opacity: 1;
                }
                
                .media-type-badge {
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    padding: 4px 8px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    font-size: 10px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                
                .list-item {
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    border-bottom: 1px solid #e5e7eb;
                    gap: 16px;
                }
                
                .list-thumbnail {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                
                .list-content {
                    flex: 1;
                }
                
                .list-title {
                    font-weight: 600;
                    margin-bottom: 4px;
                }
                
                .list-meta {
                    font-size: 14px;
                    color: #6b7280;
                }
                
                .selection-bar {
                    position: sticky;
                    top: 0;
                    background: #3b82f6;
                    color: white;
                    padding: 12px 20px;
                    display: none;
                    align-items: center;
                    justify-content: space-between;
                    z-index: 10;
                }
                
                .selection-bar.show {
                    display: flex;
                }
                
                .selection-actions {
                    display: flex;
                    gap: 8px;
                }
                
                .selection-action {
                    padding: 6px 12px;
                    background: rgba(255, 255, 255, 0.2);
                    border: none;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }
            </style>
            
            <div class="gallery-header">
                <div class="gallery-title">
                    <i class="fas fa-images"></i>
                    Media Gallery
                </div>
                <div class="gallery-controls">
                    <div class="filter-buttons">
                        <button class="filter-btn active" data-filter="all" data-testid="filter-all">All</button>
                        <button class="filter-btn" data-filter="images" data-testid="filter-images">Images</button>
                        <button class="filter-btn" data-filter="videos" data-testid="filter-videos">Videos</button>
                        <button class="filter-btn" data-filter="documents" data-testid="filter-documents">Documents</button>
                    </div>
                    <div class="view-toggles">
                        <button class="view-btn active" data-view="grid" data-testid="view-grid">
                            <i class="fas fa-th"></i>
                        </button>
                        <button class="view-btn" data-view="list" data-testid="view-list">
                            <i class="fas fa-list"></i>
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="upload-area" id="upload-area" data-testid="upload-area">
                <i class="fas fa-cloud-upload-alt" style="font-size: 48px; color: #667eea; margin-bottom: 16px;"></i>
                <h3>Drop files here or click to upload</h3>
                <p>Support for images, videos, and documents</p>
                <input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx" style="display: none;" id="file-input">
            </div>
            
            <div class="selection-bar" id="selection-bar">
                <div class="selection-info">
                    <span id="selection-count">0</span> items selected
                </div>
                <div class="selection-actions">
                    <button class="selection-action" data-action="download" data-testid="bulk-download">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="selection-action" data-action="delete" data-testid="bulk-delete">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="selection-action" data-action="share" data-testid="bulk-share">
                        <i class="fas fa-share"></i> Share
                    </button>
                </div>
            </div>
            
            <div class="media-container" id="media-container">
                <!-- Media items will be rendered here -->
            </div>
        `;
    }

    connectedCallback() {
        super.connectedCallback();
        this.setupEventListeners();
        this.renderMediaItems();
    }

    setupEventListeners() {
        // Filter buttons
        this.shadowRoot.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentFilter = e.target.dataset.filter;
                this.updateActiveFilter();
                this.renderMediaItems();
            });
        });

        // View toggles
        this.shadowRoot.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentView = e.target.dataset.view;
                this.updateActiveView();
                this.renderMediaItems();
            });
        });

        // Upload area
        const uploadArea = this.shadowRoot.getElementById('upload-area');
        const fileInput = this.shadowRoot.getElementById('file-input');

        uploadArea.addEventListener('click', () => fileInput.click());
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            this.handleFileUpload(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', (e) => {
            this.handleFileUpload(e.target.files);
        });

        // Selection actions
        this.shadowRoot.querySelectorAll('.selection-action').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleBulkAction(e.target.dataset.action);
            });
        });
    }

    generateSampleMedia() {
        const mediaTypes = ['image', 'video', 'document'];
        const items = [];

        for (let i = 1; i <= 12; i++) {
            const type = mediaTypes[Math.floor(Math.random() * mediaTypes.length)];
            items.push({
                id: i,
                type: type,
                title: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i}`,
                filename: `sample-${type}-${i}.${type === 'image' ? 'jpg' : type === 'video' ? 'mp4' : 'pdf'}`,
                size: Math.floor(Math.random() * 5000) + 1000,
                uploadDate: new Date(Date.now() - Math.random() * 10000000000),
                thumbnail: this.generateThumbnail(type),
                url: `#${type}-${i}`
            });
        }

        return items;
    }

    generateThumbnail(type) {
        const colors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#00f2fe'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Create a simple colored rectangle as placeholder
        return `data:image/svg+xml,${encodeURIComponent(`
            <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
                <rect width="200" height="150" fill="${color}"/>
                <text x="100" y="75" text-anchor="middle" dy=".3em" fill="white" font-family="Arial" font-size="14">
                    ${type.toUpperCase()}
                </text>
            </svg>
        `)}`;
    }

    updateActiveFilter() {
        this.shadowRoot.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === this.currentFilter);
        });
    }

    updateActiveView() {
        this.shadowRoot.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === this.currentView);
        });
    }

    renderMediaItems() {
        const container = this.shadowRoot.getElementById('media-container');
        const filteredItems = this.currentFilter === 'all' 
            ? this.mediaItems 
            : this.mediaItems.filter(item => {
                if (this.currentFilter === 'images') return item.type === 'image';
                if (this.currentFilter === 'videos') return item.type === 'video';
                if (this.currentFilter === 'documents') return item.type === 'document';
                return true;
            });

        if (this.currentView === 'grid') {
            container.innerHTML = `
                <div class="media-grid">
                    ${filteredItems.map(item => this.renderGridItem(item)).join('')}
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="media-list">
                    ${filteredItems.map(item => this.renderListItem(item)).join('')}
                </div>
            `;
        }

        this.attachMediaEventListeners();
    }

    renderGridItem(item) {
        const typeIcons = {
            image: 'fas fa-image',
            video: 'fas fa-video',
            document: 'fas fa-file-pdf'
        };

        return `
            <div class="media-item ${this.selectedItems.has(item.id) ? 'selected' : ''}" 
                 data-item-id="${item.id}" 
                 data-testid="media-item-${item.id}">
                <img src="${item.thumbnail}" alt="${item.title}" class="media-thumbnail">
                <div class="media-overlay">
                    <div class="media-info">
                        <div class="media-title">${item.title}</div>
                        <div class="media-meta">${this.formatFileSize(item.size)} • ${this.formatDate(item.uploadDate)}</div>
                    </div>
                </div>
                <div class="media-actions">
                    <button class="media-action-btn" data-action="view" data-testid="view-${item.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="media-action-btn" data-action="download" data-testid="download-${item.id}">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="media-action-btn" data-action="share" data-testid="share-${item.id}">
                        <i class="fas fa-share"></i>
                    </button>
                </div>
                <input type="checkbox" class="media-checkbox" data-testid="select-${item.id}">
                <div class="media-type-badge">
                    <i class="${typeIcons[item.type]}"></i>
                </div>
            </div>
        `;
    }

    renderListItem(item) {
        return `
            <div class="list-item ${this.selectedItems.has(item.id) ? 'selected' : ''}" 
                 data-item-id="${item.id}"
                 data-testid="list-item-${item.id}">
                <input type="checkbox" class="media-checkbox" data-testid="select-list-${item.id}">
                <img src="${item.thumbnail}" alt="${item.title}" class="list-thumbnail">
                <div class="list-content">
                    <div class="list-title">${item.title}</div>
                    <div class="list-meta">${item.filename} • ${this.formatFileSize(item.size)} • ${this.formatDate(item.uploadDate)}</div>
                </div>
                <div class="media-actions">
                    <button class="media-action-btn" data-action="view" data-testid="view-list-${item.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="media-action-btn" data-action="download" data-testid="download-list-${item.id}">
                        <i class="fas fa-download"></i>
                    </button>
                </div>
            </div>
        `;
    }

    attachMediaEventListeners() {
        // Media item clicks (for lightbox)
        this.shadowRoot.querySelectorAll('.media-item, .list-item').forEach(item => {
            item.addEventListener('click', (e) => {
                if (!e.target.matches('button, input, .media-action-btn')) {
                    const itemId = parseInt(item.dataset.itemId);
                    this.openLightbox(itemId);
                }
            });
        });

        // Checkbox handling
        this.shadowRoot.querySelectorAll('.media-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                const itemId = parseInt(e.target.closest('[data-item-id]').dataset.itemId);
                this.toggleSelection(itemId);
            });
        });

        // Action buttons
        this.shadowRoot.querySelectorAll('.media-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const action = btn.dataset.action;
                const itemId = parseInt(btn.closest('[data-item-id]').dataset.itemId);
                this.handleMediaAction(action, itemId);
            });
        });
    }

    toggleSelection(itemId) {
        if (this.selectedItems.has(itemId)) {
            this.selectedItems.delete(itemId);
        } else {
            this.selectedItems.add(itemId);
        }

        this.updateSelectionUI();
    }

    updateSelectionUI() {
        const selectionBar = this.shadowRoot.getElementById('selection-bar');
        const selectionCount = this.shadowRoot.getElementById('selection-count');
        
        selectionCount.textContent = this.selectedItems.size;
        selectionBar.classList.toggle('show', this.selectedItems.size > 0);

        // Update item selection states
        this.shadowRoot.querySelectorAll('[data-item-id]').forEach(item => {
            const itemId = parseInt(item.dataset.itemId);
            item.classList.toggle('selected', this.selectedItems.has(itemId));
            const checkbox = item.querySelector('.media-checkbox');
            if (checkbox) checkbox.checked = this.selectedItems.has(itemId);
        });
    }

    handleMediaAction(action, itemId) {
        const item = this.mediaItems.find(i => i.id === itemId);
        
        switch (action) {
            case 'view':
                this.openLightbox(itemId);
                break;
            case 'download':
                this.downloadItem(item);
                break;
            case 'share':
                this.shareItem(item);
                break;
        }
    }

    handleBulkAction(action) {
        const selectedItems = Array.from(this.selectedItems).map(id => 
            this.mediaItems.find(item => item.id === id)
        );

        switch (action) {
            case 'download':
                this.downloadItems(selectedItems);
                break;
            case 'delete':
                this.deleteItems(selectedItems);
                break;
            case 'share':
                this.shareItems(selectedItems);
                break;
        }
    }

    openLightbox(itemId) {
        const item = this.mediaItems.find(i => i.id === itemId);
        this.currentLightboxIndex = this.mediaItems.findIndex(i => i.id === itemId);
        
        // Create nested shadow DOM for lightbox
        const lightbox = document.createElement('div');
        lightbox.className = 'media-lightbox';
        
        const lightboxShadow = lightbox.attachShadow({ mode: 'open' });
        lightboxShadow.innerHTML = this.getLightboxHTML(item);
        
        this.attachLightboxEventListeners(lightboxShadow);
        document.body.appendChild(lightbox);
    }

    getLightboxHTML(item) {
        return `
            <style>
                :host-context(.media-lightbox) {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .lightbox-content {
                    max-width: 90vw;
                    max-height: 90vh;
                    position: relative;
                }
                
                .lightbox-media {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: contain;
                }
                
                .lightbox-controls {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    display: flex;
                    gap: 12px;
                }
                
                .lightbox-btn {
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }
                
                .lightbox-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 44px;
                    height: 44px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                }
                
                .lightbox-prev {
                    left: 20px;
                }
                
                .lightbox-next {
                    right: 20px;
                }
                
                .lightbox-info {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    padding: 16px;
                    border-radius: 8px;
                }
                
                .lightbox-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 8px;
                }
                
                .lightbox-meta {
                    font-size: 14px;
                    opacity: 0.8;
                }
            </style>
            
            <div class="lightbox-content">
                <img src="${item.thumbnail}" alt="${item.title}" class="lightbox-media">
                
                <div class="lightbox-controls">
                    <button class="lightbox-btn" id="download-btn" data-testid="lightbox-download">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="lightbox-btn" id="share-btn" data-testid="lightbox-share">
                        <i class="fas fa-share"></i>
                    </button>
                    <button class="lightbox-btn" id="close-btn" data-testid="lightbox-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <button class="lightbox-nav lightbox-prev" id="prev-btn" data-testid="lightbox-prev">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button class="lightbox-nav lightbox-next" id="next-btn" data-testid="lightbox-next">
                    <i class="fas fa-chevron-right"></i>
                </button>
                
                <div class="lightbox-info">
                    <div class="lightbox-title">${item.title}</div>
                    <div class="lightbox-meta">
                        ${item.filename} • ${this.formatFileSize(item.size)} • ${this.formatDate(item.uploadDate)}
                    </div>
                </div>
            </div>
        `;
    }

    attachLightboxEventListeners(shadow) {
        shadow.getElementById('close-btn').addEventListener('click', () => {
            document.body.removeChild(shadow.host);
        });

        shadow.getElementById('prev-btn').addEventListener('click', () => {
            this.navigateLightbox(-1, shadow);
        });

        shadow.getElementById('next-btn').addEventListener('click', () => {
            this.navigateLightbox(1, shadow);
        });

        shadow.getElementById('download-btn').addEventListener('click', () => {
            const currentItem = this.mediaItems[this.currentLightboxIndex];
            this.downloadItem(currentItem);
        });

        shadow.getElementById('share-btn').addEventListener('click', () => {
            const currentItem = this.mediaItems[this.currentLightboxIndex];
            this.shareItem(currentItem);
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(shadow.host);
            } else if (e.key === 'ArrowLeft') {
                this.navigateLightbox(-1, shadow);
            } else if (e.key === 'ArrowRight') {
                this.navigateLightbox(1, shadow);
            }
        });
    }

    navigateLightbox(direction, shadow) {
        this.currentLightboxIndex += direction;
        if (this.currentLightboxIndex < 0) {
            this.currentLightboxIndex = this.mediaItems.length - 1;
        } else if (this.currentLightboxIndex >= this.mediaItems.length) {
            this.currentLightboxIndex = 0;
        }

        const newItem = this.mediaItems[this.currentLightboxIndex];
        shadow.innerHTML = this.getLightboxHTML(newItem);
        this.attachLightboxEventListeners(shadow);
    }

    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            const newItem = {
                id: this.mediaItems.length + 1,
                type: file.type.startsWith('image/') ? 'image' :
                      file.type.startsWith('video/') ? 'video' : 'document',
                title: file.name.split('.')[0],
                filename: file.name,
                size: file.size,
                uploadDate: new Date(),
                thumbnail: this.generateThumbnail(file.type.startsWith('image/') ? 'image' :
                                                file.type.startsWith('video/') ? 'video' : 'document'),
                url: URL.createObjectURL(file)
            };
            
            this.mediaItems.unshift(newItem);
        });

        this.renderMediaItems();
        
        // Show success notification
        this.dispatchEvent(new CustomEvent('show-notification', {
            detail: {
                type: 'success',
                title: 'Upload Complete',
                message: `${files.length} file(s) uploaded successfully.`
            },
            bubbles: true
        }));
    }

    downloadItem(item) {
        console.log('Downloading:', item.filename);
        // Simulate download
        this.dispatchEvent(new CustomEvent('show-notification', {
            detail: {
                type: 'info',
                title: 'Download Started',
                message: `Downloading ${item.filename}...`
            },
            bubbles: true
        }));
    }

    downloadItems(items) {
        console.log('Bulk downloading:', items.length, 'items');
        this.dispatchEvent(new CustomEvent('show-notification', {
            detail: {
                type: 'info',
                title: 'Bulk Download Started',
                message: `Downloading ${items.length} items...`
            },
            bubbles: true
        }));
    }

    shareItem(item) {
        console.log('Sharing:', item.filename);
        // Create share dialog (nested shadow DOM)
        this.showShareDialog([item]);
    }

    shareItems(items) {
        console.log('Bulk sharing:', items.length, 'items');
        this.showShareDialog(items);
    }

    showShareDialog(items) {
        const shareDialog = document.createElement('div');
        shareDialog.className = 'share-dialog';
        
        const shareShadow = shareDialog.attachShadow({ mode: 'open' });
        shareShadow.innerHTML = `
            <style>
                :host-context(.share-dialog) {
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
                
                .share-content {
                    background: white;
                    border-radius: 12px;
                    padding: 24px;
                    width: 90%;
                    max-width: 400px;
                }
                
                .share-title {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }
                
                .share-options {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 20px;
                }
                
                .share-option {
                    padding: 12px;
                    border: 1px solid #e5e7eb;
                    border-radius: 8px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }
                
                .share-option:hover {
                    border-color: #667eea;
                    background: #f0f4ff;
                }
                
                .share-actions {
                    display: flex;
                    gap: 12px;
                    justify-content: flex-end;
                }
                
                .share-btn {
                    padding: 8px 16px;
                    border: 1px solid #d1d5db;
                    background: white;
                    border-radius: 6px;
                    cursor: pointer;
                }
                
                .share-btn.primary {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                }
            </style>
            
            <div class="share-content">
                <div class="share-title">Share ${items.length} item(s)</div>
                <div class="share-options">
                    <div class="share-option" data-platform="email">
                        <i class="fas fa-envelope" style="font-size: 24px; margin-bottom: 8px; color: #667eea;"></i>
                        <div>Email</div>
                    </div>
                    <div class="share-option" data-platform="link">
                        <i class="fas fa-link" style="font-size: 24px; margin-bottom: 8px; color: #667eea;"></i>
                        <div>Copy Link</div>
                    </div>
                    <div class="share-option" data-platform="social">
                        <i class="fas fa-share-alt" style="font-size: 24px; margin-bottom: 8px; color: #667eea;"></i>
                        <div>Social</div>
                    </div>
                </div>
                <div class="share-actions">
                    <button class="share-btn" id="cancel-share">Cancel</button>
                    <button class="share-btn primary" id="confirm-share">Share</button>
                </div>
            </div>
        `;

        shareShadow.getElementById('cancel-share').addEventListener('click', () => {
            document.body.removeChild(shareDialog);
        });

        shareShadow.getElementById('confirm-share').addEventListener('click', () => {
            document.body.removeChild(shareDialog);
            this.dispatchEvent(new CustomEvent('show-notification', {
                detail: {
                    type: 'success',
                    title: 'Shared Successfully',
                    message: `${items.length} item(s) shared.`
                },
                bubbles: true
            }));
        });

        document.body.appendChild(shareDialog);
    }

    deleteItems(items) {
        items.forEach(item => {
            const index = this.mediaItems.findIndex(i => i.id === item.id);
            if (index !== -1) {
                this.mediaItems.splice(index, 1);
            }
            this.selectedItems.delete(item.id);
        });

        this.renderMediaItems();
        this.updateSelectionUI();

        this.dispatchEvent(new CustomEvent('show-notification', {
            detail: {
                type: 'success',
                title: 'Items Deleted',
                message: `${items.length} item(s) deleted successfully.`
            },
            bubbles: true
        }));
    }

    formatFileSize(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }

    formatDate(date) {
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
}

customElements.define('media-gallery', MediaGallery);
