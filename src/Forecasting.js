import React, { useState, useEffect } from 'react';
import './Forecasting.css';
import { dashboardAPI, connectSocket } from './services/api';

const Forecasting = ({ onNavigate, onLogout }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Next 30 Days');
  const [selectedModel, setSelectedModel] = useState('AI Prediction');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [forecastData, setForecastData] = useState({
    nextMonthRevenue: 165000,
    growthPrediction: 14.2,
    confidenceLevel: 87,
    riskFactors: 3,
    demandForecast: [
      { product: 'Milk Packet (1 Liter)', currentStock: 180, predictedDemand: 220, recommendation: 'Increase Stock', confidence: 92 },
      { product: 'Rice Bag (Premium Basmati)', currentStock: 85, predictedDemand: 95, recommendation: 'Maintain Stock', confidence: 88 },
      { product: 'Banana (Per Dozen)', currentStock: 150, predictedDemand: 180, recommendation: 'Increase Stock', confidence: 85 },
      { product: 'Tea Pack (250g)', currentStock: 5, predictedDemand: 45, recommendation: 'Critical Restock', confidence: 95 },
      { product: 'Cooking Oil (1 Liter)', currentStock: 12, predictedDemand: 35, recommendation: 'Increase Stock', confidence: 78 }
    ],
    revenueForecast: [
      { period: 'Week 1', predicted: 38000, lower: 35000, upper: 42000 },
      { period: 'Week 2', predicted: 41000, lower: 37500, upper: 45000 },
      { period: 'Week 3', predicted: 43500, lower: 39000, upper: 48000 },
      { period: 'Week 4', predicted: 42500, lower: 38000, upper: 47000 }
    ],
    seasonalTrends: [
      { factor: 'Festival Season', impact: '+25%', period: 'Next 2 weeks', type: 'positive' },
      { factor: 'Monsoon Effect', impact: '-8%', period: 'Next month', type: 'negative' },
      { factor: 'School Reopening', impact: '+15%', period: 'Week 3-4', type: 'positive' }
    ]
  });

  useEffect(() => {
    // Connect to socket for real-time updates
    const socket = connectSocket();

    // Load real data in background without showing loading
    loadForecastDataInBackground();

    // Listen for real-time updates
    socket.on('forecastUpdate', (data) => {
      console.log('Real-time forecast update:', data);
      if (data) {
        setForecastData(prevData => ({ ...prevData, ...data }));
      }
    });

    return () => {
      socket.off('forecastUpdate');
    };
  }, []);

  const loadForecastDataInBackground = async () => {
    try {
      const response = await dashboardAPI.getData();
      if (response.data.success) {
        // Transform dashboard data for forecasting
        const dashData = response.data.data;
        setForecastData(prevData => ({
          ...prevData,
          nextMonthRevenue: Math.round((dashData.totalSales || 144775) * 1.14),
          demandForecast: dashData.topProducts?.map(product => ({
            product: product.name,
            currentStock: Math.floor(Math.random() * 200) + 50,
            predictedDemand: Math.floor(product.demand * 1.2),
            recommendation: product.demand > 100 ? 'Increase Stock' : 'Maintain Stock',
            confidence: Math.floor(Math.random() * 20) + 80
          })) || prevData.demandForecast
        }));
      }
    } catch (error) {
      console.error('Error loading forecast data in background:', error);
      // Keep the initial sample data if API fails
    }
  };

  const generateForecastChart = () => {
    return forecastData.revenueForecast.map((item, index) => ({
      ...item,
      x: index * 80 + 40,
      predictedY: 180 - (item.predicted / 500),
      lowerY: 180 - (item.lower / 500),
      upperY: 180 - (item.upper / 500)
    }));
  };

  const chartData = generateForecastChart();

  const getRecommendationClass = (recommendation) => {
    switch (recommendation) {
      case 'Critical Restock': return 'critical';
      case 'Increase Stock': return 'increase';
      case 'Maintain Stock': return 'maintain';
      default: return 'maintain';
    }
  };

  const getImpactClass = (type) => {
    return type === 'positive' ? 'positive' : 'negative';
  };

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
          <span>Forecasting</span>
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
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('analytics');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">📈</span>
            <span className="nav-text">Sales Analytics</span>
          </div>
          <div className="nav-item active">
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
            <h1 className="page-title">Sales Forecasting</h1>
            <p className="page-subtitle">AI-powered demand and revenue predictions</p>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="action-btn">
                <span className="btn-icon">📥</span>
                <span className="btn-text">Export Forecast</span>
              </button>
              <button className="action-btn primary">
                <span className="btn-icon">🤖</span>
                <span className="btn-text">Run AI Analysis</span>
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
          {/* Forecast Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card primary">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Revenue Forecast</h3>
                  <p className="stat-subtitle">Next month prediction</p>
                </div>
                <div className="stat-icon forecast">🎯</div>
              </div>
              <div className="stat-value">₹{forecastData.nextMonthRevenue?.toLocaleString()}</div>
              <div className="stat-change positive">
                <span className="change-icon">📈</span>
                <span>+{forecastData.growthPrediction}% predicted growth</span>
              </div>
            </div>

            <div className="stat-card success">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Confidence Level</h3>
                  <p className="stat-subtitle">AI model accuracy</p>
                </div>
                <div className="stat-icon confidence">🎯</div>
              </div>
              <div className="stat-value">{forecastData.confidenceLevel}%</div>
              <div className="stat-change positive">
                <span className="change-icon">🤖</span>
                <span>High accuracy model</span>
              </div>
            </div>

            <div className="stat-card info">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Seasonal Factors</h3>
                  <p className="stat-subtitle">Market influences</p>
                </div>
                <div className="stat-icon seasonal">🌟</div>
              </div>
              <div className="stat-value">{forecastData.seasonalTrends?.length || 0}</div>
              <div className="stat-change neutral">
                <span className="change-icon">📊</span>
                <span>Active trend factors</span>
              </div>
            </div>

            <div className="stat-card warning">
              <div className="stat-header">
                <div className="stat-info">
                  <h3 className="stat-title">Risk Factors</h3>
                  <p className="stat-subtitle">Potential challenges</p>
                </div>
                <div className="stat-icon risk">⚠️</div>
              </div>
              <div className="stat-value">{forecastData.riskFactors}</div>
              <div className="stat-change negative">
                <span className="change-icon">🚨</span>
                <span>Factors to monitor</span>
              </div>
            </div>
          </div>

          {/* Forecast Chart and Controls */}
          <div className="forecast-row">
            <div className="forecast-chart-container">
              <div className="chart-header">
                <div className="chart-title-section">
                  <h3 className="chart-title">Revenue Forecast</h3>
                  <p className="chart-subtitle">Predicted vs confidence intervals</p>
                </div>
                <div className="chart-controls">
                  <button 
                    className={`control-btn ${selectedTimeframe === 'Next 7 Days' ? 'active' : ''}`}
                    onClick={() => setSelectedTimeframe('Next 7 Days')}
                  >
                    7D
                  </button>
                  <button 
                    className={`control-btn ${selectedTimeframe === 'Next 30 Days' ? 'active' : ''}`}
                    onClick={() => setSelectedTimeframe('Next 30 Days')}
                  >
                    30D
                  </button>
                  <button 
                    className={`control-btn ${selectedTimeframe === 'Next 90 Days' ? 'active' : ''}`}
                    onClick={() => setSelectedTimeframe('Next 90 Days')}
                  >
                    90D
                  </button>
                </div>
              </div>
              
              <div className="chart-area">
                <svg className="chart-svg" viewBox="0 0 360 200">
                  <defs>
                    <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#48bb78" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#48bb78" stopOpacity="0"/>
                    </linearGradient>
                    <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#ed8936" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#ed8936" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  
                  {/* Grid */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={i} x1="0" y1={i * 40} x2="360" y2={i * 40} stroke="#f0f0f0" strokeWidth="1"/>
                  ))}
                  
                  {/* Confidence Interval Area */}
                  <path
                    d={`M ${chartData[0]?.x},${chartData[0]?.upperY} ${chartData.map(point => 
                      `L ${point.x},${point.upperY}`
                    ).join(' ')} ${chartData.slice().reverse().map(point => 
                      `L ${point.x},${point.lowerY}`
                    ).join(' ')} Z`}
                    fill="url(#confidenceGradient)"
                  />
                  
                  {/* Predicted Revenue Line */}
                  <polyline
                    fill="none"
                    stroke="#48bb78"
                    strokeWidth="3"
                    points={chartData.map(point => `${point.x},${point.predictedY}`).join(' ')}
                  />
                  
                  {/* Upper Bound Line */}
                  <polyline
                    fill="none"
                    stroke="#ed8936"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                    points={chartData.map(point => `${point.x},${point.upperY}`).join(' ')}
                  />
                  
                  {/* Lower Bound Line */}
                  <polyline
                    fill="none"
                    stroke="#ed8936"
                    strokeWidth="2"
                    strokeDasharray="3,3"
                    points={chartData.map(point => `${point.x},${point.lowerY}`).join(' ')}
                  />
                  
                  {/* Data points */}
                  {chartData.map((point, index) => (
                    <circle
                      key={index}
                      cx={point.x}
                      cy={point.predictedY}
                      r="4"
                      fill="#48bb78"
                    />
                  ))}
                </svg>
                
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color forecast"></span>
                    <span>Predicted Revenue</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color confidence"></span>
                    <span>Confidence Interval</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Seasonal Trends */}
            <div className="seasonal-trends">
              <div className="section-header">
                <h3 className="section-title">Seasonal Trends</h3>
                <div className="section-actions">
                  <button className="filter-btn active">All Factors</button>
                  <button className="filter-btn">High Impact</button>
                </div>
              </div>
              <div className="trends-list">
                {forecastData.seasonalTrends.map((trend, index) => (
                  <div key={index} className="trend-item">
                    <div className="trend-info">
                      <div className="trend-factor">{trend.factor}</div>
                      <div className="trend-period">{trend.period}</div>
                    </div>
                    <div className={`trend-impact ${getImpactClass(trend.type)}`}>
                      {trend.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Demand Forecast Table */}
          <div className="demand-forecast-container">
            <div className="section-header">
              <h3 className="section-title">Product Demand Forecast</h3>
              <div className="section-actions">
                <select 
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="filter-select"
                >
                  <option value="AI Prediction">AI Prediction</option>
                  <option value="Historical Trend">Historical Trend</option>
                  <option value="Seasonal Model">Seasonal Model</option>
                </select>
              </div>
            </div>
            
            <div className="demand-table-container">
              <table className="demand-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Current Stock</th>
                    <th>Predicted Demand</th>
                    <th>Confidence</th>
                    <th>Recommendation</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {forecastData.demandForecast.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="product-info">
                          <div className="product-icon">🍽️</div>
                          <div className="product-name">{item.product}</div>
                        </div>
                      </td>
                      <td>
                        <span className="stock-number">{item.currentStock}</span>
                      </td>
                      <td>
                        <span className="demand-number">{item.predictedDemand}</span>
                      </td>
                      <td>
                        <div className="confidence-indicator">
                          <div className="confidence-bar">
                            <div 
                              className="confidence-fill"
                              style={{width: `${item.confidence}%`}}
                            ></div>
                          </div>
                          <span className="confidence-text">{item.confidence}%</span>
                        </div>
                      </td>
                      <td>
                        <span className={`recommendation-badge ${getRecommendationClass(item.recommendation)}`}>
                          {item.recommendation}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn-small">Apply</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Forecasting;