import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { dashboardAPI, connectSocket } from './services/api';

const Dashboard = ({ onNavigate, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 days');
  const [showAIAssistant, setShowAIAssistant] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalSales: 144775,
    forecastedGrowth: 50671,
    bestSellingProduct: { name: 'Milk Packet (1 Liter)', totalQuantity: 150, category: 'Food & Beverages' },
    worstSellingProduct: { name: 'Cheese Block (200g)', totalQuantity: 15, category: 'Food & Beverages' },
    alerts: [
      {
        type: 'critical',
        title: 'Critical: Tea Pack Low Stock!',
        subtitle: 'Lead Time: 5 days',
        units: 5
      },
      {
        type: 'critical',
        title: 'Critical: Cooking Oil Low Stock!',
        subtitle: 'Lead Time: 3 days',
        units: 12
      },
      {
        type: 'warning',
        title: 'Warning: Wheat Flour Low Stock!',
        subtitle: 'Lead Time: 7 days',
        units: 8
      },
      {
        type: 'safe',
        title: 'Safe: Milk Packet stock level is optimal',
        subtitle: ''
      }
    ],
    deadStock: [
      { name: 'Soap Bar', status: 'Not in business since', value: 200 },
      { name: 'Tea Pack', status: 'Got to Deadstock since', value: 105 }
    ],
    topProducts: [
      { name: 'Milk Packet (1 Liter)', demand: 150, revenue: 7500 },
      { name: 'Banana (Per Dozen)', demand: 120, revenue: 3600 },
      { name: 'Bread Loaf (White)', demand: 110, revenue: 2750 },
      { name: 'Tomato Pack (1 KG)', demand: 95, revenue: 5700 },
      { name: 'Onion Bag (2 KG)', demand: 85, revenue: 2975 }
    ],
    salesForecastData: []
  });

  useEffect(() => {
    // Connect to socket for real-time updates
    const socket = connectSocket();

    // Load real data in background without showing loading
    loadDashboardDataInBackground();

    // Listen for real-time updates
    socket.on('dashboardUpdate', (data) => {
      console.log('Real-time dashboard update:', data);
      setDashboardData(data);
    });

    return () => {
      socket.off('dashboardUpdate');
    };
  }, []);

  const loadDashboardDataInBackground = async () => {
    try {
      const response = await dashboardAPI.getData();
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard data in background:', error);
      // Keep the initial sample data if API fails
    }
  };

  // Generate real-time chart data based on selected period
  const generateChartData = () => {
    const baseValue = dashboardData.totalSales || 144775;
    let periods = [];
    let dataPoints = [];
    
    switch (selectedPeriod) {
      case '7 days':
        periods = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        dataPoints = periods.map((day, index) => ({
          period: day,
          actual: Math.round(baseValue * (0.12 + (index * 0.02) + Math.random() * 0.03)),
          predicted: Math.round(baseValue * (0.13 + (index * 0.025) + Math.random() * 0.02))
        }));
        break;
      case '30 days':
        periods = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        dataPoints = periods.map((week, index) => ({
          period: week,
          actual: Math.round(baseValue * (0.22 + (index * 0.03) + Math.random() * 0.05)),
          predicted: Math.round(baseValue * (0.24 + (index * 0.035) + Math.random() * 0.04))
        }));
        break;
      case '90 days':
        periods = ['Jan', 'Feb', 'Mar'];
        dataPoints = periods.map((month, index) => ({
          period: month,
          actual: Math.round(baseValue * (0.7 + (index * 0.15) + Math.random() * 0.1)),
          predicted: Math.round(baseValue * (0.75 + (index * 0.18) + Math.random() * 0.08))
        }));
        break;
      default:
        periods = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        dataPoints = periods.map((week, index) => ({
          period: week,
          actual: Math.round(baseValue * (0.22 + (index * 0.03) + Math.random() * 0.05)),
          predicted: Math.round(baseValue * (0.24 + (index * 0.035) + Math.random() * 0.04))
        }));
    }
    
    console.log('Chart Data Generated:', dataPoints); // Debug log
    return dataPoints;
  };

  const chartData = generateChartData();
  
  // Fallback data if chart generation fails
  const safeChartData = chartData && chartData.length > 0 ? chartData : [
    { period: 'Week 1', actual: 25000, predicted: 27000 },
    { period: 'Week 2', actual: 32000, predicted: 34000 },
    { period: 'Week 3', actual: 38000, predicted: 40000 },
    { period: 'Week 4', actual: 45000, predicted: 47000 }
  ];

  // Remove the loading check - page will always render instantly
  return (
    <div className="dashboard-container">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="mobile-logo">
          <span className="logo-icon">📊</span>
          <span>Sales Analytics</span>
        </div>
        <div className="mobile-user">
          <span className="notification-badge">3</span>
          <div className="user-avatar">👤</div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="mobile-sidebar-overlay"
          onClick={() => setIsMobileSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">📊</span>
            <div className="logo-text">
              <div className="logo-main">Sales Analytics</div>
              <div className="logo-sub">Real-time Dashboard</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-item active">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('inventory');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">📦</span>
            <span className="nav-text">Inventory</span>
          </div>
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('alerts');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">🚨</span>
            <span className="nav-text">Alerts</span>
          </div>
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('analytics');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">📈</span>
            <span className="nav-text">Sales Analytics</span>
          </div>
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('forecasting');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Forecasting</span>
          </div>
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('settings');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">⚙️</span>
            <span className="nav-text">Settings</span>
          </div>
          <div className="nav-item" onClick={() => {
            onLogout && onLogout();
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">↩️</span>
            <span className="nav-text">Logout</span>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="nav-item">
            <span className="nav-icon">❓</span>
            <span className="nav-text">Help</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Desktop Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">Dashboard Overview</h1>
            <p className="page-subtitle">Real-time business analytics and insights</p>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="action-btn">
                <span className="btn-icon">📥</span>
                <span className="btn-text">Export</span>
              </button>
              <button className="action-btn primary">
                <span className="btn-icon">📊</span>
                <span className="btn-text">Generate Report</span>
              </button>
            </div>
            <div className="user-section">
              <div className="notification-icon">
                <span>🔔</span>
                <span className="notification-badge">3</span>
              </div>
              <div className="user-profile">
                <div className="user-info">
                  <span className="user-name">Admin</span>
                  <span className="user-role">Store Manager</span>
                </div>
                <div className="user-avatar">👤</div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Total Revenue</h3>
                  <p className="stat-subtitle">This month</p>
                </div>
                <div className="stat-icon revenue">💰</div>
              </div>
              <div className="stat-value">₹{dashboardData.totalSales?.toLocaleString() || '0'}</div>
              <div className="stat-change positive">
                <span className="change-icon">📈</span>
                <span>+8.2% from last month</span>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Growth Forecast</h3>
                  <p className="stat-subtitle">Next month</p>
                </div>
                <div className="stat-icon growth">📊</div>
              </div>
              <div className="stat-value">₹{dashboardData.forecastedGrowth?.toLocaleString() || '0'}</div>
              <div className="stat-change positive">
                <span className="change-icon">🚀</span>
                <span>+35% projected growth</span>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Best Seller</h3>
                  <p className="stat-subtitle">Top performing product</p>
                </div>
                <div className="stat-icon bestseller">🏆</div>
              </div>
              <div className="stat-product">{dashboardData.bestSellingProduct?.name || 'No data'}</div>
              <div className="stat-change neutral">
                <span className="change-icon">📦</span>
                <span>{dashboardData.bestSellingProduct?.totalQuantity || '0'} units sold</span>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Stock Alerts</h3>
                  <p className="stat-subtitle">Need attention</p>
                </div>
                <div className="stat-icon alerts">⚠️</div>
              </div>
              <div className="stat-value">{dashboardData.alerts?.length || 0}</div>
              <div className="stat-change negative">
                <span className="change-icon">📋</span>
                <span>Products need restocking</span>
              </div>
            </div>
          </div>

          {/* Charts and Analytics Row */}
          <div className="analytics-row">
            {/* Sales Chart */}
            <div className="chart-container">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Sales Performance</h3>
                  <p className="chart-subtitle">Actual vs Predicted Revenue</p>
                </div>
                <div className="chart-controls">
                  <button 
                    className={`control-btn ${selectedPeriod === '7 days' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('7 days')}
                  >
                    7D
                  </button>
                  <button 
                    className={`control-btn ${selectedPeriod === '30 days' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('30 days')}
                  >
                    30D
                  </button>
                  <button 
                    className={`control-btn ${selectedPeriod === '90 days' ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod('90 days')}
                  >
                    90D
                  </button>
                </div>
              </div>
              
              <div className="chart-area">
                <svg className="chart-svg" viewBox="0 0 500 250">
                  <defs>
                    {/* Modern gradient for actual sales */}
                    <linearGradient id="modernActualGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4"/>
                      <stop offset="50%" stopColor="#7C3AED" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#EC4899" stopOpacity="0.05"/>
                    </linearGradient>
                    
                    {/* Modern gradient for predicted sales */}
                    <linearGradient id="modernPredictedGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#06B6D4" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.05"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Background grid */}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <line 
                      key={`h-${i}`} 
                      x1="60" 
                      y1={40 + i * 30} 
                      x2="440" 
                      y2={40 + i * 30} 
                      stroke="#E5E7EB" 
                      strokeWidth="0.5"
                      opacity="0.5"
                    />
                  ))}
                  
                  {/* Y-axis labels */}
                  {[0, 1, 2, 3, 4, 5].map(i => (
                    <text 
                      key={`y-label-${i}`}
                      x="50" 
                      y={195 - i * 30} 
                      fontSize="10" 
                      fill="#9CA3AF" 
                      textAnchor="end"
                    >
                      ₹{(i * 25)}K
                    </text>
                  ))}
                  
                  {/* X-axis labels */}
                  {safeChartData.map((point, index) => (
                    <text 
                      key={`x-label-${index}`}
                      x={80 + index * (320 / Math.max(1, safeChartData.length - 1))} 
                      y="220" 
                      fontSize="10" 
                      fill="#9CA3AF" 
                      textAnchor="middle"
                    >
                      {point.period}
                    </text>
                  ))}
                  
                  {/* Actual Sales Area */}
                  <path
                    d={`M 80,${200 - (safeChartData[0]?.actual / 2000)} ${safeChartData.map((point, index) => {
                      const x = 80 + index * (320 / Math.max(1, safeChartData.length - 1));
                      const y = 200 - (point.actual / 2000);
                      return `L ${x},${y}`;
                    }).join(' ')} L ${80 + (safeChartData.length - 1) * (320 / Math.max(1, safeChartData.length - 1))},200 L 80,200 Z`}
                    fill="url(#modernActualGradient)"
                  />
                  
                  {/* Predicted Sales Area */}
                  <path
                    d={`M 80,${200 - (safeChartData[0]?.predicted / 2000)} ${safeChartData.map((point, index) => {
                      const x = 80 + index * (320 / Math.max(1, safeChartData.length - 1));
                      const y = 200 - (point.predicted / 2000);
                      return `L ${x},${y}`;
                    }).join(' ')} L ${80 + (safeChartData.length - 1) * (320 / Math.max(1, safeChartData.length - 1))},200 L 80,200 Z`}
                    fill="url(#modernPredictedGradient)"
                  />
                  
                  {/* Actual Sales Line */}
                  <polyline
                    fill="none"
                    stroke="#4F46E5"
                    strokeWidth="3"
                    points={safeChartData.map((point, index) => {
                      const x = 80 + index * (320 / Math.max(1, safeChartData.length - 1));
                      const y = 200 - (point.actual / 2000);
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Predicted Sales Line */}
                  <polyline
                    fill="none"
                    stroke="#06B6D4"
                    strokeWidth="2.5"
                    strokeDasharray="8,4"
                    points={safeChartData.map((point, index) => {
                      const x = 80 + index * (320 / Math.max(1, safeChartData.length - 1));
                      const y = 200 - (point.predicted / 2000);
                      return `${x},${y}`;
                    }).join(' ')}
                  />
                  
                  {/* Data points */}
                  {safeChartData.map((point, index) => {
                    const x = 80 + index * (320 / Math.max(1, safeChartData.length - 1));
                    const actualY = 200 - (point.actual / 2000);
                    const predictedY = 200 - (point.predicted / 2000);
                    
                    return (
                      <g key={index}>
                        {/* Actual sales point */}
                        <circle
                          cx={x}
                          cy={actualY}
                          r="6"
                          fill="white"
                          stroke="#4F46E5"
                          strokeWidth="3"
                        />
                        <circle
                          cx={x}
                          cy={actualY}
                          r="3"
                          fill="#4F46E5"
                        />
                        
                        {/* Predicted sales point */}
                        <circle
                          cx={x}
                          cy={predictedY}
                          r="5"
                          fill="white"
                          stroke="#06B6D4"
                          strokeWidth="2.5"
                        />
                        <circle
                          cx={x}
                          cy={predictedY}
                          r="2.5"
                          fill="#06B6D4"
                        />
                      </g>
                    );
                  })}
                </svg>
                
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color modern-actual"></span>
                    <span>Actual Sales</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color modern-predicted"></span>
                    <span>Predicted Sales</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Assistant */}
            {showAIAssistant && (
              <div className="ai-assistant">
                <div className="ai-header">
                  <div className="ai-title">
                    <span className="ai-icon">🤖</span>
                    <span>AI Assistant</span>
                  </div>
                  <button className="ai-close" onClick={() => setShowAIAssistant(false)}>×</button>
                </div>
                <div className="ai-content">
                  <div className="ai-greeting">
                    <p>Hi there! 👋</p>
                    <p>I'm here to help you understand your business data.</p>
                  </div>
                  <div className="ai-suggestions">
                    <div className="ai-suggestion">
                      <span className="suggestion-icon">💡</span>
                      <span>What's driving my sales growth?</span>
                    </div>
                    <div className="ai-suggestion">
                      <span className="suggestion-icon">📦</span>
                      <span>Which products need restocking?</span>
                    </div>
                    <div className="ai-suggestion">
                      <span className="suggestion-icon">📈</span>
                      <span>Show me next month's forecast</span>
                    </div>
                  </div>
                  <div className="ai-input">
                    <input type="text" placeholder="Ask me anything about your business..." />
                    <button className="send-btn">→</button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Analytics Row */}
          <div className="bottom-row">
            {/* Alerts & Insights */}
            <div className="alerts-container">
              <div className="section-header">
                <h3 className="section-title">Stock Alerts</h3>
                <div className="section-actions">
                  <button className="filter-btn active">All</button>
                  <button className="filter-btn">Critical</button>
                  <button className="filter-btn">Low</button>
                </div>
              </div>
              <div className="alerts-list">
                {dashboardData.alerts?.slice(0, 4).map((alert, index) => (
                  <div key={index} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      {alert.type === 'critical' ? '🚨' : '⚠️'}
                    </div>
                    <div className="alert-content">
                      <div className="alert-title">{alert.title}</div>
                      <div className="alert-subtitle">{alert.subtitle}</div>
                    </div>
                    <div className="alert-meta">
                      <span className="alert-units">{alert.units} units</span>
                      <button className="alert-action">→</button>
                    </div>
                  </div>
                )) || (
                  <div className="no-data">
                    <span className="no-data-icon">📋</span>
                    <span>No alerts at the moment</span>
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="top-products-container">
              <div className="section-header">
                <h3 className="section-title">Top Products</h3>
                <div className="section-actions">
                  <button className="filter-btn active">Revenue</button>
                  <button className="filter-btn">Volume</button>
                </div>
              </div>
              <div className="products-list">
                {dashboardData.topProducts?.slice(0, 5).map((product, index) => (
                  <div key={index} className="product-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-stats">
                        <span className="product-demand">{product.demand} units</span>
                        <span className="product-revenue">₹{product.revenue?.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="product-chart">
                      <div 
                        className="progress-bar"
                        style={{width: `${Math.min(100, (product.demand / 150) * 100)}%`}}
                      ></div>
                    </div>
                  </div>
                )) || (
                  <div className="no-data">
                    <span className="no-data-icon">📊</span>
                    <span>No product data available</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;