// Dashboard Widget with Multiple Nested Shadow DOM Components
class DashboardWidget extends BaseComponent {
    static get observedAttributes() {
        return ['data-testid', 'theme'];
    }

    constructor() {
        super();
        this.state = {
            metrics: {
                users: 12548,
                revenue: 45236.78,
                orders: 896,
                conversion: 3.24
            },
            loading: false,
            timeframe: '7d'
        };
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    display: block;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.1);
                    overflow: hidden;
                }

                .dashboard-container {
                    padding: 1.5rem;
                }

                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 2rem;
                    padding-bottom: 1rem;
                    border-bottom: 2px solid #e9ecef;
                }

                .dashboard-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #2c3e50;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .timeframe-selector {
                    display: flex;
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 4px;
                    gap: 4px;
                }

                .timeframe-btn {
                    padding: 8px 16px;
                    border: none;
                    background: transparent;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 500;
                }

                .timeframe-btn.active {
                    background: #007bff;
                    color: white;
                    box-shadow: 0 2px 4px rgba(0,123,255,0.3);
                }

                .metrics-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    margin-bottom: 2rem;
                }

                .metric-card {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    position: relative;
                    overflow: hidden;
                    transition: transform 0.3s ease;
                }

                .metric-card:hover {
                    transform: translateY(-5px);
                }

                .metric-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.1);
                    transform: skewY(-5deg);
                    z-index: 0;
                }

                .metric-content {
                    position: relative;
                    z-index: 1;
                }

                .metric-value {
                    font-size: 2rem;
                    font-weight: bold;
                    margin-bottom: 0.5rem;
                }

                .metric-label {
                    font-size: 0.9rem;
                    opacity: 0.9;
                    margin-bottom: 0.5rem;
                }

                .metric-change {
                    font-size: 0.8rem;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .metric-change.positive {
                    color: #4CAF50;
                }

                .metric-change.negative {
                    color: #FF5722;
                }

                .chart-section {
                    margin-bottom: 2rem;
                }

                .section-title {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .quick-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    margin-top: 1.5rem;
                }

                .action-btn {
                    padding: 12px 20px;
                    border: none;
                    border-radius: 8px;
                    background: #007bff;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .action-btn:hover {
                    background: #0056b3;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,123,255,0.3);
                }

                .action-btn.secondary {
                    background: #6c757d;
                }

                .action-btn.secondary:hover {
                    background: #545b62;
                }

                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(255,255,255,0.9);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }

                :host([loading]) .loading-overlay {
                    opacity: 1;
                    visibility: visible;
                }

                .spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #e9ecef;
                    border-top: 4px solid #007bff;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                @media (max-width: 768px) {
                    .dashboard-header {
                        flex-direction: column;
                        gap: 1rem;
                        align-items: stretch;
                    }

                    .timeframe-selector {
                        justify-content: center;
                    }

                    .metrics-grid {
                        grid-template-columns: 1fr;
                    }

                    .quick-actions {
                        flex-direction: column;
                    }
                }
            </style>

            <div class="dashboard-container">
                <div class="loading-overlay">
                    <div class="spinner"></div>
                </div>

                <div class="dashboard-header">
                    <h2 class="dashboard-title">
                        <i class="fas fa-chart-line"></i>
                        Analytics Dashboard
                    </h2>

                    <div class="timeframe-selector">
                        <button class="timeframe-btn ${this.state.timeframe === '1d' ? 'active' : ''}" data-timeframe="1d" data-testid="timeframe-1d">1D</button>
                        <button class="timeframe-btn ${this.state.timeframe === '7d' ? 'active' : ''}" data-timeframe="7d" data-testid="timeframe-7d">7D</button>
                        <button class="timeframe-btn ${this.state.timeframe === '30d' ? 'active' : ''}" data-timeframe="30d" data-testid="timeframe-30d">30D</button>
                        <button class="timeframe-btn ${this.state.timeframe === '90d' ? 'active' : ''}" data-timeframe="90d" data-testid="timeframe-90d">90D</button>
                    </div>
                </div>

                <div class="metrics-grid">
                    <div class="metric-card" data-testid="metric-users">
                        <div class="metric-content">
                            <div class="metric-value">${this.formatNumber(this.state.metrics.users)}</div>
                            <div class="metric-label">Total Users</div>
                            <div class="metric-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +12.5%
                            </div>
                        </div>
                    </div>

                    <div class="metric-card" data-testid="metric-revenue">
                        <div class="metric-content">
                            <div class="metric-value">$${this.formatNumber(this.state.metrics.revenue)}</div>
                            <div class="metric-label">Revenue</div>
                            <div class="metric-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +8.2%
                            </div>
                        </div>
                    </div>

                    <div class="metric-card" data-testid="metric-orders">
                        <div class="metric-content">
                            <div class="metric-value">${this.formatNumber(this.state.metrics.orders)}</div>
                            <div class="metric-label">Orders</div>
                            <div class="metric-change negative">
                                <i class="fas fa-arrow-down"></i>
                                -3.1%
                            </div>
                        </div>
                    </div>

                    <div class="metric-card" data-testid="metric-conversion">
                        <div class="metric-content">
                            <div class="metric-value">${this.state.metrics.conversion}%</div>
                            <div class="metric-label">Conversion Rate</div>
                            <div class="metric-change positive">
                                <i class="fas fa-arrow-up"></i>
                                +0.8%
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chart-section">
                    <h3 class="section-title">
                        <i class="fas fa-chart-area"></i>
                        Performance Overview
                    </h3>
                    <!-- Nested Chart Widget -->
                    <chart-widget id="performance-chart" data-type="line" data-period="${this.state.timeframe}"></chart-widget>
                </div>

                <div class="chart-section">
                    <h3 class="section-title">
                        <i class="fas fa-users"></i>
                        User Engagement
                    </h3>
                    <!-- Nested Engagement Widget -->
                    <engagement-widget id="engagement-chart" data-period="${this.state.timeframe}"></engagement-widget>
                </div>

                <div class="chart-section">
                    <h3 class="section-title">
                        <i class="fas fa-map-marker-alt"></i>
                        Geographic Distribution
                    </h3>
                    <!-- Nested Map Widget -->
                    <geo-map-widget id="geo-distribution" data-metric="users"></geo-map-widget>
                </div>

                <div class="quick-actions">
                    <button class="action-btn" data-action="export-report" data-testid="export-report">
                        <i class="fas fa-download"></i>
                        Export Report
                    </button>
                    
                    <button class="action-btn secondary" data-action="schedule-report" data-testid="schedule-report">
                        <i class="fas fa-clock"></i>
                        Schedule Report
                    </button>
                    
                    <button class="action-btn secondary" data-action="share-dashboard" data-testid="share-dashboard">
                        <i class="fas fa-share"></i>
                        Share Dashboard
                    </button>

                    <button class="action-btn secondary" data-action="customize" data-testid="customize-dashboard">
                        <i class="fas fa-cog"></i>
                        Customize
                    </button>
                </div>

                <!-- Nested Alert System -->
                <alert-system-widget id="dashboard-alerts"></alert-system-widget>

                <!-- Nested Real-time Updates -->
                <realtime-updates-widget id="realtime-updates" data-enabled="true"></realtime-updates-widget>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        // Timeframe selector
        this.$$('.timeframe-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const timeframe = btn.dataset.timeframe;
                this.setState({ timeframe });
                this.loadData(timeframe);
            });
        });

        // Action buttons
        this.$$('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                this.handleAction(action);
            });
        });

        // Metric cards click
        this.$$('.metric-card').forEach(card => {
            card.addEventListener('click', () => {
                const metric = card.dataset.testid?.replace('metric-', '');
                this.emit('metric-clicked', { metric });
            });
        });
    }

    formatNumber(num) {
        return new Intl.NumberFormat().format(num);
    }

    async loadData(timeframe) {
        this.setAttribute('loading', 'true');
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Update nested components
            const chartWidget = this.$('#performance-chart');
            const engagementWidget = this.$('#engagement-chart');
            
            if (chartWidget) chartWidget.setAttribute('data-period', timeframe);
            if (engagementWidget) engagementWidget.setAttribute('data-period', timeframe);
            
            this.emit('data-loaded', { timeframe });
        } catch (error) {
            this.handleError(error, 'Data loading');
        } finally {
            this.removeAttribute('loading');
        }
    }

    handleAction(action) {
        switch (action) {
            case 'export-report':
                this.exportReport();
                break;
            case 'schedule-report':
                this.openScheduleModal();
                break;
            case 'share-dashboard':
                this.openShareModal();
                break;
            case 'customize':
                this.openCustomizePanel();
                break;
        }
    }

    exportReport() {
        this.emit('export-report', { format: 'pdf', timeframe: this.state.timeframe });
    }

    openScheduleModal() {
        const modal = document.createElement('schedule-modal');
        modal.setAttribute('type', 'report');
        document.body.appendChild(modal);
    }

    openShareModal() {
        const modal = document.createElement('share-modal');
        modal.setAttribute('type', 'dashboard');
        document.body.appendChild(modal);
    }

    openCustomizePanel() {
        const panel = document.createElement('customize-panel');
        panel.setAttribute('target', 'dashboard');
        document.body.appendChild(panel);
    }
}

// Chart Widget (Level 2 Shadow DOM)
class ChartWidget extends BaseComponent {
    static get observedAttributes() {
        return ['data-type', 'data-period'];
    }

    render() {
        const chartType = this.getAttribute('data-type') || 'line';
        const period = this.getAttribute('data-period') || '7d';

        const template = this.createTemplate(`
            <style>
                :host {
                    display: block;
                    background: #f8f9fa;
                    border-radius: 8px;
                    padding: 1rem;
                    min-height: 300px;
                }

                .chart-container {
                    position: relative;
                    height: 300px;
                    background: white;
                    border-radius: 6px;
                    padding: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .chart-placeholder {
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, #f0f0f0 25%, transparent 25%), 
                                linear-gradient(-45deg, #f0f0f0 25%, transparent 25%), 
                                linear-gradient(45deg, transparent 75%, #f0f0f0 75%), 
                                linear-gradient(-45deg, transparent 75%, #f0f0f0 75%);
                    background-size: 20px 20px;
                    background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
                    border-radius: 4px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #666;
                    font-weight: bold;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                .chart-controls {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .chart-title {
                    font-weight: bold;
                    color: #2c3e50;
                }

                .chart-type-selector {
                    display: flex;
                    gap: 0.5rem;
                }

                .chart-type-btn {
                    padding: 4px 8px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .chart-type-btn.active {
                    background: #007bff;
                    color: white;
                    border-color: #007bff;
                }

                .chart-legend {
                    display: flex;
                    justify-content: center;
                    gap: 1rem;
                    margin-top: 1rem;
                    flex-wrap: wrap;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                }

                .legend-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                }
            </style>

            <div class="chart-container">
                <div class="chart-controls">
                    <div class="chart-title">${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart - ${period.toUpperCase()}</div>
                    <div class="chart-type-selector">
                        <button class="chart-type-btn ${chartType === 'line' ? 'active' : ''}" data-type="line">📈</button>
                        <button class="chart-type-btn ${chartType === 'bar' ? 'active' : ''}" data-type="bar">📊</button>
                        <button class="chart-type-btn ${chartType === 'pie' ? 'active' : ''}" data-type="pie">🥧</button>
                        <button class="chart-type-btn ${chartType === 'area' ? 'active' : ''}" data-type="area">📉</button>
                    </div>
                </div>

                <div class="chart-placeholder">
                    📊 ${chartType.toUpperCase()} CHART (${period.toUpperCase()})
                </div>

                <div class="chart-legend">
                    <div class="legend-item">
                        <div class="legend-color" style="background: #007bff;"></div>
                        <span>Current Period</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #28a745;"></div>
                        <span>Previous Period</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #ffc107;"></div>
                        <span>Target</span>
                    </div>
                </div>

                <!-- Nested Chart Data Widget -->
                <chart-data-widget id="chart-data" data-type="${chartType}" data-period="${period}"></chart-data-widget>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        this.$$('.chart-type-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.setAttribute('data-type', type);
                this.emit('chart-type-changed', { type });
            });
        });
    }
}

// Chart Data Widget (Level 3 Shadow DOM)
class ChartDataWidget extends BaseComponent {
    static get observedAttributes() {
        return ['data-type', 'data-period'];
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 0.5rem;
                    border-radius: 4px 0 0 0;
                    font-size: 0.8rem;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                :host(:hover) {
                    opacity: 1;
                }

                .data-points {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .data-point {
                    display: flex;
                    justify-content: space-between;
                    min-width: 120px;
                }
            </style>

            <div class="data-points">
                <div class="data-point">
                    <span>Max:</span>
                    <span>$45,236</span>
                </div>
                <div class="data-point">
                    <span>Min:</span>
                    <span>$12,847</span>
                </div>
                <div class="data-point">
                    <span>Avg:</span>
                    <span>$28,594</span>
                </div>
                <div class="data-point">
                    <span>Trend:</span>
                    <span>↗ +8.2%</span>
                </div>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }
}

// Engagement Widget (Level 2 Shadow DOM)
class EngagementWidget extends BaseComponent {
    static get observedAttributes() {
        return ['data-period'];
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    display: block;
                    background: white;
                    border-radius: 8px;
                    padding: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }

                .engagement-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                    gap: 1rem;
                }

                .engagement-metric {
                    text-align: center;
                    padding: 1rem;
                    background: #f8f9fa;
                    border-radius: 6px;
                    transition: transform 0.3s ease;
                }

                .engagement-metric:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .metric-icon {
                    font-size: 2rem;
                    margin-bottom: 0.5rem;
                }

                .metric-value {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 0.25rem;
                }

                .metric-label {
                    font-size: 0.9rem;
                    color: #6c757d;
                }
            </style>

            <div class="engagement-grid">
                <div class="engagement-metric">
                    <div class="metric-icon">⏱️</div>
                    <div class="metric-value">4m 32s</div>
                    <div class="metric-label">Avg Session</div>
                </div>
                
                <div class="engagement-metric">
                    <div class="metric-icon">🔄</div>
                    <div class="metric-value">68%</div>
                    <div class="metric-label">Return Rate</div>
                </div>
                
                <div class="engagement-metric">
                    <div class="metric-icon">👁️</div>
                    <div class="metric-value">3.2</div>
                    <div class="metric-label">Pages/Session</div>
                </div>
                
                <div class="engagement-metric">
                    <div class="metric-icon">⬆️</div>
                    <div class="metric-value">24%</div>
                    <div class="metric-label">Bounce Rate</div>
                </div>
            </div>

            <!-- Nested Activity Heatmap -->
            <activity-heatmap-widget id="activity-heatmap" data-period="${this.getAttribute('data-period')}"></activity-heatmap-widget>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }
}

// Activity Heatmap Widget (Level 3 Shadow DOM)
class ActivityHeatmapWidget extends BaseComponent {
    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    display: block;
                    margin-top: 1rem;
                    padding: 1rem;
                    background: #f8f9fa;
                    border-radius: 6px;
                }

                .heatmap-title {
                    font-weight: bold;
                    margin-bottom: 1rem;
                    color: #2c3e50;
                }

                .heatmap-grid {
                    display: grid;
                    grid-template-columns: repeat(24, 1fr);
                    gap: 2px;
                    margin-bottom: 0.5rem;
                }

                .heatmap-cell {
                    aspect-ratio: 1;
                    border-radius: 2px;
                    cursor: pointer;
                    transition: transform 0.2s ease;
                }

                .heatmap-cell:hover {
                    transform: scale(1.2);
                    z-index: 10;
                    position: relative;
                }

                .heatmap-cell.low { background: #eef7ff; }
                .heatmap-cell.medium { background: #66b3ff; }
                .heatmap-cell.high { background: #0066cc; }
                .heatmap-cell.very-high { background: #003d7a; }

                .heatmap-legend {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8rem;
                    color: #6c757d;
                }

                .legend-scale {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .legend-item {
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                }

                .legend-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 2px;
                }
            </style>

            <div>
                <div class="heatmap-title">Activity Heatmap (24h)</div>
                <div class="heatmap-grid">
                    ${Array.from({length: 24}, (_, i) => {
                        const intensity = Math.random();
                        let className = 'low';
                        if (intensity > 0.7) className = 'very-high';
                        else if (intensity > 0.5) className = 'high';
                        else if (intensity > 0.3) className = 'medium';
                        
                        return `<div class="heatmap-cell ${className}" title="${i}:00 - Activity: ${Math.round(intensity * 100)}%"></div>`;
                    }).join('')}
                </div>
                <div class="heatmap-legend">
                    <span>Hours (0-23)</span>
                    <div class="legend-scale">
                        <div class="legend-item">
                            <div class="legend-color low"></div>
                            <span>Low</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color medium"></div>
                            <span>Medium</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color high"></div>
                            <span>High</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color very-high"></div>
                            <span>Very High</span>
                        </div>
                    </div>
                </div>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }
}

// Geographic Map Widget (Level 2 Shadow DOM)
class GeoMapWidget extends BaseComponent {
    static get observedAttributes() {
        return ['data-metric'];
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    display: block;
                    background: white;
                    border-radius: 8px;
                    padding: 1rem;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    height: 400px;
                }

                .map-container {
                    height: 100%;
                    background: #e3f2fd;
                    border-radius: 6px;
                    position: relative;
                    overflow: hidden;
                }

                .map-placeholder {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: linear-gradient(45deg, #e3f2fd, #bbdefb);
                    font-size: 3rem;
                    color: #1976d2;
                }

                .map-overlay {
                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                    background: rgba(255,255,255,0.9);
                    padding: 1rem;
                    border-radius: 6px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    min-width: 200px;
                }

                .region-list {
                    list-style: none;
                    margin: 0;
                    padding: 0;
                }

                .region-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem 0;
                    border-bottom: 1px solid #eee;
                }

                .region-item:last-child {
                    border-bottom: none;
                }

                .region-name {
                    font-weight: 500;
                }

                .region-value {
                    color: #007bff;
                    font-weight: bold;
                }

                .map-controls {
                    position: absolute;
                    bottom: 1rem;
                    left: 1rem;
                    display: flex;
                    gap: 0.5rem;
                }

                .map-control-btn {
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: rgba(255,255,255,0.9);
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .map-control-btn:hover {
                    background: white;
                    transform: scale(1.1);
                }
            </style>

            <div class="map-container">
                <div class="map-placeholder">🗺️</div>
                
                <div class="map-overlay">
                    <h4 style="margin: 0 0 1rem 0; color: #2c3e50;">Top Regions</h4>
                    <ul class="region-list">
                        <li class="region-item">
                            <span class="region-name">🇺🇸 United States</span>
                            <span class="region-value">42%</span>
                        </li>
                        <li class="region-item">
                            <span class="region-name">🇬🇧 United Kingdom</span>
                            <span class="region-value">18%</span>
                        </li>
                        <li class="region-item">
                            <span class="region-name">🇩🇪 Germany</span>
                            <span class="region-value">12%</span>
                        </li>
                        <li class="region-item">
                            <span class="region-name">🇨🇦 Canada</span>
                            <span class="region-value">8%</span>
                        </li>
                        <li class="region-item">
                            <span class="region-name">🇦🇺 Australia</span>
                            <span class="region-value">6%</span>
                        </li>
                    </ul>
                </div>

                <div class="map-controls">
                    <button class="map-control-btn" title="Zoom In">
                        <i class="fas fa-plus"></i>
                    </button>
                    <button class="map-control-btn" title="Zoom Out">
                        <i class="fas fa-minus"></i>
                    </button>
                    <button class="map-control-btn" title="Reset View">
                        <i class="fas fa-home"></i>
                    </button>
                </div>

                <!-- Nested Region Details Widget -->
                <region-details-widget id="region-details" data-region="us"></region-details-widget>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        this.$$('.region-item').forEach(item => {
            item.addEventListener('click', () => {
                const regionName = item.querySelector('.region-name').textContent;
                this.emit('region-selected', { region: regionName });
            });
        });

        this.$$('.map-control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.title.toLowerCase().replace(' ', '-');
                this.emit('map-control', { action });
            });
        });
    }
}

// Region Details Widget (Level 3 Shadow DOM)
class RegionDetailsWidget extends BaseComponent {
    static get observedAttributes() {
        return ['data-region'];
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 1rem;
                    border-radius: 8px;
                    min-width: 250px;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    z-index: 100;
                }

                :host([visible]) {
                    opacity: 1;
                    visibility: visible;
                }

                .region-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .region-title {
                    font-weight: bold;
                    font-size: 1.1rem;
                }

                .close-btn {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                }

                .region-stats {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .stat-item {
                    text-align: center;
                }

                .stat-value {
                    font-size: 1.2rem;
                    font-weight: bold;
                    color: #4CAF50;
                }

                .stat-label {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
            </style>

            <div>
                <div class="region-header">
                    <div class="region-title">🇺🇸 United States</div>
                    <button class="close-btn" id="close-btn">×</button>
                </div>
                
                <div class="region-stats">
                    <div class="stat-item">
                        <div class="stat-value">5,247</div>
                        <div class="stat-label">Active Users</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">$28,394</div>
                        <div class="stat-label">Revenue</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">342</div>
                        <div class="stat-label">Orders</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-value">4.2%</div>
                        <div class="stat-label">Conversion</div>
                    </div>
                </div>
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        const closeBtn = this.$('#close-btn');
        closeBtn?.addEventListener('click', () => {
            this.removeAttribute('visible');
        });
    }
}

// Alert System Widget (Level 2 Shadow DOM)
class AlertSystemWidget extends BaseComponent {
    constructor() {
        super();
        this.state = {
            alerts: [
                { id: 1, type: 'warning', message: 'High traffic detected on mobile app', time: '2 min ago' },
                { id: 2, type: 'info', message: 'Scheduled maintenance tomorrow at 2 AM', time: '1 hour ago' },
                { id: 3, type: 'success', message: 'Revenue target achieved for this month', time: '3 hours ago' }
            ]
        };
    }

    render() {
        const template = this.createTemplate(`
            <style>
                :host {
                    position: fixed;
                    top: 1rem;
                    right: 1rem;
                    z-index: 1000;
                    max-width: 350px;
                }

                .alerts-container {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .alert {
                    background: white;
                    border-radius: 8px;
                    padding: 1rem;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    border-left: 4px solid;
                    animation: slideIn 0.3s ease-out;
                    position: relative;
                }

                .alert.warning {
                    border-left-color: #ff9800;
                    background: #fff3e0;
                }

                .alert.info {
                    border-left-color: #2196f3;
                    background: #e3f2fd;
                }

                .alert.success {
                    border-left-color: #4caf50;
                    background: #e8f5e8;
                }

                .alert.error {
                    border-left-color: #f44336;
                    background: #ffebee;
                }

                .alert-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 1rem;
                }

                .alert-text {
                    flex: 1;
                }

                .alert-message {
                    font-weight: 500;
                    color: #2c3e50;
                    margin-bottom: 0.25rem;
                }

                .alert-time {
                    font-size: 0.8rem;
                    color: #6c757d;
                }

                .alert-close {
                    background: none;
                    border: none;
                    font-size: 1.2rem;
                    cursor: pointer;
                    color: #6c757d;
                    padding: 0;
                    width: 20px;
                    height: 20px;
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

                .alert-icon {
                    margin-right: 0.5rem;
                }
            </style>

            <div class="alerts-container">
                ${this.state.alerts.map(alert => `
                    <div class="alert ${alert.type}" data-alert-id="${alert.id}">
                        <div class="alert-content">
                            <div class="alert-text">
                                <div class="alert-message">
                                    <span class="alert-icon">${this.getAlertIcon(alert.type)}</span>
                                    ${alert.message}
                                </div>
                                <div class="alert-time">${alert.time}</div>
                            </div>
                            <button class="alert-close" data-alert-id="${alert.id}">×</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    setupEventListeners() {
        this.$$('.alert-close').forEach(btn => {
            btn.addEventListener('click', () => {
                const alertId = parseInt(btn.dataset.alertId);
                this.dismissAlert(alertId);
            });
        });

        this.$$('.alert').forEach(alert => {
            alert.addEventListener('click', () => {
                const alertId = parseInt(alert.dataset.alertId);
                this.emit('alert-clicked', { alertId });
            });
        });
    }

    getAlertIcon(type) {
        const icons = {
            warning: '⚠️',
            info: 'ℹ️',
            success: '✅',
            error: '❌'
        };
        return icons[type] || 'ℹ️';
    }

    dismissAlert(alertId) {
        const alertElement = this.$(`[data-alert-id="${alertId}"]`);
        if (alertElement) {
            alertElement.style.animation = 'slideOut 0.3s ease-out forwards';
            setTimeout(() => {
                this.state.alerts = this.state.alerts.filter(alert => alert.id !== alertId);
                this.render();
            }, 300);
        }
    }

    addAlert(alert) {
        const newAlert = {
            id: Date.now(),
            ...alert,
            time: 'just now'
        };
        this.state.alerts.unshift(newAlert);
        this.render();
    }
}

// Real-time Updates Widget (Level 2 Shadow DOM)
class RealtimeUpdatesWidget extends BaseComponent {
    static get observedAttributes() {
        return ['data-enabled'];
    }

    constructor() {
        super();
        this.state = {
            connected: false,
            updates: []
        };
        this.updateInterval = null;
    }

    render() {
        const enabled = this.getAttribute('data-enabled') === 'true';

        const template = this.createTemplate(`
            <style>
                :host {
                    position: fixed;
                    bottom: 1rem;
                    right: 1rem;
                    background: rgba(0,0,0,0.8);
                    color: white;
                    padding: 0.75rem 1rem;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    opacity: ${enabled ? '1' : '0.5'};
                    transition: all 0.3s ease;
                    cursor: pointer;
                    z-index: 999;
                }

                :host(:hover) {
                    background: rgba(0,0,0,0.9);
                    transform: scale(1.05);
                }

                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: ${this.state.connected ? '#4CAF50' : '#f44336'};
                    animation: ${this.state.connected ? 'pulse 2s infinite' : 'none'};
                }

                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }

                .update-count {
                    background: #007bff;
                    color: white;
                    border-radius: 10px;
                    padding: 2px 6px;
                    font-size: 0.8rem;
                    font-weight: bold;
                    min-width: 16px;
                    text-align: center;
                }
            </style>

            <div class="status-indicator"></div>
            <span>${this.state.connected ? 'Live' : 'Disconnected'}</span>
            ${this.state.updates.length > 0 ? `<div class="update-count">${this.state.updates.length}</div>` : ''}
        `);

        this.shadowRoot.innerHTML = '';
        this.shadowRoot.appendChild(template);
    }

    onMount() {
        if (this.getAttribute('data-enabled') === 'true') {
            this.connect();
        }
    }

    onUnmount() {
        this.disconnect();
    }

    connect() {
        this.setState({ connected: true });
        this.updateInterval = setInterval(() => {
            this.simulateUpdate();
        }, 5000);
    }

    disconnect() {
        this.setState({ connected: false });
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    simulateUpdate() {
        const updates = [
            'New user registration',
            'Order completed',
            'Payment received',
            'Support ticket created',
            'Analytics updated'
        ];
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        this.state.updates.push({
            id: Date.now(),
            message: randomUpdate,
            timestamp: new Date()
        });

        // Keep only last 5 updates
        if (this.state.updates.length > 5) {
            this.state.updates = this.state.updates.slice(-5);
        }

        this.render();
        this.emit('realtime-update', { update: randomUpdate });
    }

    setupEventListeners() {
        this.addEventListener('click', () => {
            this.emit('show-updates', { updates: this.state.updates });
        });
    }
}

// Register all dashboard components
customElements.define('dashboard-widget', DashboardWidget);
customElements.define('chart-widget', ChartWidget);
customElements.define('chart-data-widget', ChartDataWidget);
customElements.define('engagement-widget', EngagementWidget);
customElements.define('activity-heatmap-widget', ActivityHeatmapWidget);
customElements.define('geo-map-widget', GeoMapWidget);
customElements.define('region-details-widget', RegionDetailsWidget);
customElements.define('alert-system-widget', AlertSystemWidget);
customElements.define('realtime-updates-widget', RealtimeUpdatesWidget);
