import React, { useState, useEffect } from 'react';
import './SalesAnalytics.css';
import { dashboardAPI, connectSocket } from './services/api';

const SalesAnalytics = ({ onNavigate, onLogout }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30 days');
  const [selectedMetric, setSelectedMetric] = useState('Revenue');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 144775,
    totalOrders: 1247,
    averageOrderValue: 116,
    topCustomers: 89,
    salesByCategory: [
      { category: 'Food & Beverages', revenue: 98500, percentage: 68, orders: 850 },
      { category: 'Health & Beauty', revenue: 25200, percentage: 17, orders: 210 },
      { category: 'Household', revenue: 15075, percentage: 10, orders: 125 },
      { category: 'Electronics', revenue: 6000, percentage: 5, orders: 62 }
    ],
    salesTrend: [
      { month: 'Jan', revenue: 120000, orders: 980 },
      { month: 'Feb', revenue: 135000, orders: 1100 },
      { month: 'Mar', revenue: 128000, orders: 1050 },
      { month: 'Apr', revenue: 142000, orders: 1180 },
      { month: 'May', revenue: 155000, orders: 1280 },
      { month: 'Jun', revenue: 144775, orders: 1247 }
    ],
    topProducts: [
      { name: 'Milk Packet (1 Liter)', revenue: 15000, units: 300, growth: 12 },
      { name: 'Rice Bag (Premium Basmati)', revenue: 12000, units: 100, growth: 8 },
      { name: 'Banana (Per Dozen)', revenue: 9600, units: 320, growth: 15 },
      { name: 'Bread Loaf (White)', revenue: 8250, units: 330, growth: 5 },
      { name: 'Cooking Oil (1 Liter)', revenue: 7200, units: 45, growth: -3 }
    ]
  });

  useEffect(() => {
    // Connect to socket for real-time updates
    const socket = connectSocket();

    // Load real data in background without showing loading
    loadAnalyticsDataInBackground();

    // Listen for real-time updates
    socket.on('salesUpdate', (data) => {
      console.log('Real-time sales analytics update:', data);
      if (data) {
        setAnalyticsData(prevData => ({ ...prevData, ...data }));
      }
    });

    return () => {
      socket.off('salesUpdate');
    };
  }, []);

  const loadAnalyticsDataInBackground = async () => {
    try {
      const response = await dashboardAPI.getData();
      if (response.data.success) {
        // Transform dashboard data for analytics
        const dashData = response.data.data;
        setAnalyticsData(prevData => ({
          ...prevData,
          totalRevenue: dashData.totalSales || prevData.totalRevenue,
          topProducts: dashData.topProducts?.map(product => ({
            name: product.name,
            revenue: product.revenue,
            units: product.demand,
            growth: Math.floor(Math.random() * 20) - 5 // Random growth for demo
          })) || prevData.topProducts
        }));
      }
    } catch (error) {
      console.error('Error loading analytics data in background:', error);
      // Keep the initial sample data if API fails
    }
  };

  const generateChartData = () => {
    return analyticsData.salesTrend.map((item, index) => ({
      ...item,
      x: index * 60,
      y: 200 - (item.revenue / 1000)
    }));
  };

  const chartData = generateChartData();

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
          <span className="logo-icon">📈</span>
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
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('dashboard');
            setIsMobileSidebarOpen(false);
          }}>
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
          <div className="nav-item active">
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
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">Sales Analytics</h1>
            <p className="page-subtitle">Detailed sales performance and insights</p>
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
              <div className="stat-value">₹{analyticsData.totalRevenue?.toLocaleString()}</div>
              <div className="stat-change positive">
                <span className="change-icon">📈</span>
                <span>+12.5% from last month</span>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Total Orders</h3>
                  <p className="stat-subtitle">This month</p>
                </div>
                <div className="stat-icon orders">📦</div>
              </div>
              <div className="stat-value">{analyticsData.totalOrders?.toLocaleString()}</div>
              <div className="stat-change positive">
                <span className="change-icon">📊</span>
                <span>+8.3% from last month</span>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Avg Order Value</h3>
                  <p className="stat-subtitle">Per transaction</p>
                </div>
                <div className="stat-icon aov">💳</div>
              </div>
              <div className="stat-value">₹{analyticsData.averageOrderValue}</div>
              <div className="stat-change positive">
                <span className="change-icon">💹</span>
                <span>+3.8% from last month</span>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Top Customers</h3>
                  <p className="stat-subtitle">Active buyers</p>
                </div>
                <div className="stat-icon customers">👥</div>
              </div>
              <div className="stat-value">{analyticsData.topCustomers}</div>
              <div className="stat-change positive">
                <span className="change-icon">👤</span>
                <span>+15 new this month</span>
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="analytics-row">
            {/* Sales Trend Chart */}
            <div className="chart-container large">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Sales Trend Analysis</h3>
                  <p className="chart-subtitle">Monthly revenue and order trends</p>
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
                <svg className="chart-svg" viewBox="0 0 360 200">
                  <defs>
                    <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#667eea" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#667eea" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="0" y1={i * 40} x2="360" y2={i * 40} stroke="#f0f0f0" strokeWidth="1"/>
                  ))}
                  
                  {/* Revenue Area */}
                  <path
                    d={`M 0,${chartData[0]?.y} ${chartData.map((point, index) => 
                      `L ${point.x},${point.y}`
                    ).join(' ')} L 360,200 L 0,200 Z`}
                    fill="url(#revenueGradient)"
                  />
                  
                  {/* Revenue Line */}
                  <polyline
                    fill="none"
                    stroke="#667eea"
                    strokeWidth="3"
                    points={chartData.map(point => `${point.x},${point.y}`).join(' ')}
                  />
                  
                  {/* Data points */}
                  {chartData.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      fill="#667eea"
                    />
                  ))}
                </svg>
                
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color revenue"></span>
                    <span>Revenue Trend</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="category-breakdown">
              <div className="section-header">
                <h3 className="section-title">Sales by Category</h3>
                <div className="section-actions">
                  <button className={`filter-btn ${selectedMetric === 'Revenue' ? 'active' : ''}`} onClick={() => setSelectedMetric('Revenue')}>Revenue</button>
                  <button className={`filter-btn ${selectedMetric === 'Orders' ? 'active' : ''}`} onClick={() => setSelectedMetric('Orders')}>Orders</button>
                </div>
              </div>
              <div className="category-list">
                {analyticsData.salesByCategory.map((category, index) => (
                  <div key={index} className="category-item">
                    <div className="category-info">
                      <div className="category-name">{category.category}</div>
                      <div className="category-stats">
                        <span className="category-revenue">₹{category.revenue.toLocaleString()}</span>
                        <span className="category-orders">{category.orders} orders</span>
                      </div>
                    </div>
                    <div className="category-chart">
                      <div className="progress-container">
                        <div 
                          className="progress-bar"
                          style={{width: `${category.percentage}%`}}
                        ></div>
                      </div>
                      <span className="category-percentage">{category.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="bottom-row">
            {/* Top Products Performance */}
            <div className="top-products-analytics">
              <div className="section-header">
                <h3 className="section-title">Top Products Performance</h3>
                <div className="section-actions">
                  <button className="filter-btn active">Revenue</button>
                  <button className="filter-btn">Units</button>
                  <button className="filter-btn">Growth</button>
                </div>
              </div>
              <div className="products-analytics-list">
                {analyticsData.topProducts.map((product, index) => (
                  <div key={index} className="product-analytics-item">
                    <div className="product-rank">#{index + 1}</div>
                    <div className="product-info">
                      <div className="product-name">{product.name}</div>
                      <div className="product-stats">
                        <span className="product-revenue">₹{product.revenue?.toLocaleString()}</span>
                        <span className="product-units">{product.units} units</span>
                      </div>
                    </div>
                    <div className="product-growth">
                      <span className={`growth-indicator ${product.growth >= 0 ? 'positive' : 'negative'}`}>
                        {product.growth >= 0 ? '↗️' : '↘️'} {Math.abs(product.growth)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SalesAnalytics;