import React, { useState, useEffect } from 'react';
import './Alerts.css';
import { inventoryAPI, connectSocket } from './services/api';

const Alerts = ({ onNavigate, onLogout }) => {
  const [selectedFilter, setSelectedFilter] = useState('All Alerts');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [alertsData, setAlertsData] = useState({
    totalAlerts: 138,
    lowStockAlerts: 56,
    criticalAlerts: 5,
    deadStock: 4,
    alerts: [
      {
        id: 'critical_1',
        type: 'Critical Alert',
        typeClass: 'critical',
        icon: '🚨',
        product: 'Chicken (1 KG)',
        category: 'Food & Beverages',
        stock: 0,
        reorderLevel: 20,
        status: 'Reorder Now',
        statusClass: 'reorder-now',
        description: 'Out of Stock'
      },
      {
        id: 'critical_2',
        type: 'Critical Alert',
        typeClass: 'critical',
        icon: '🚨',
        product: 'Detergent Powder (1 KG)',
        category: 'Household',
        stock: 0,
        reorderLevel: 15,
        status: 'Reorder Now',
        statusClass: 'reorder-now',
        description: 'Out of Stock'
      },
      {
        id: 'low_1',
        type: 'Low Stock',
        typeClass: 'low-stock',
        icon: '⚠️',
        product: 'Tea Pack (250g)',
        category: 'Food & Beverages',
        stock: 5,
        reorderLevel: 20,
        status: 'Low Stock',
        statusClass: 'low-stock',
        description: 'Low Stock'
      },
      {
        id: 'low_2',
        type: 'Low Stock',
        typeClass: 'low-stock',
        icon: '⚠️',
        product: 'Wheat Flour (5 KG)',
        category: 'Food & Beverages',
        stock: 8,
        reorderLevel: 25,
        status: 'Low Stock',
        statusClass: 'low-stock',
        description: 'Low Stock'
      },
      {
        id: 'low_3',
        type: 'Low Stock',
        typeClass: 'low-stock',
        icon: '⚠️',
        product: 'Cooking Oil (1 Liter)',
        category: 'Food & Beverages',
        stock: 12,
        reorderLevel: 30,
        status: 'Low Stock',
        statusClass: 'low-stock',
        description: 'Low Stock'
      }
    ]
  });

  const itemsPerPage = 5;

  useEffect(() => {
    // Connect to socket for real-time updates
    const socket = connectSocket();

    // Load real data in background without showing loading
    loadAlertsDataInBackground();

    // Listen for real-time inventory updates to generate alerts
    socket.on('inventoryUpdate', (data) => {
      console.log('Real-time inventory update for alerts:', data);
      if (data && data.products) {
        generateAlertsFromInventory(data);
      }
    });

    return () => {
      socket.off('inventoryUpdate');
    };
  }, []);

  const loadAlertsDataInBackground = async () => {
    try {
      const response = await inventoryAPI.getData();
      if (response.data.success && response.data.data) {
        generateAlertsFromInventory(response.data.data);
      }
    } catch (error) {
      console.error('Error loading alerts data in background:', error);
      // Keep the initial sample data if API fails
    }
  };

  const generateSampleAlerts = () => {
    const sampleAlerts = [
      {
        id: 'critical_1',
        type: 'Critical Alert',
        typeClass: 'critical',
        icon: '🚨',
        product: 'Chicken (1 KG)',
        category: 'Food & Beverages',
        stock: 0,
        reorderLevel: 20,
        status: 'Reorder Now',
        statusClass: 'reorder-now',
        description: 'Out of Stock'
      },
      {
        id: 'critical_2',
        type: 'Critical Alert',
        typeClass: 'critical',
        icon: '🚨',
        product: 'Detergent Powder (1 KG)',
        category: 'Household',
        stock: 0,
        reorderLevel: 15,
        status: 'Reorder Now',
        statusClass: 'reorder-now',
        description: 'Out of Stock'
      },
      {
        id: 'low_1',
        type: 'Low Stock',
        typeClass: 'low-stock',
        icon: '⚠️',
        product: 'Tea Pack (250g)',
        category: 'Food & Beverages',
        stock: 5,
        reorderLevel: 20,
        status: 'Low Stock',
        statusClass: 'low-stock',
        description: 'Low Stock'
      },
      {
        id: 'low_2',
        type: 'Low Stock',
        typeClass: 'low-stock',
        icon: '⚠️',
        product: 'Wheat Flour (5 KG)',
        category: 'Food & Beverages',
        stock: 8,
        reorderLevel: 25,
        status: 'Low Stock',
        statusClass: 'low-stock',
        description: 'Low Stock'
      },
      {
        id: 'low_3',
        type: 'Low Stock',
        typeClass: 'low-stock',
        icon: '⚠️',
        product: 'Cooking Oil (1 Liter)',
        category: 'Food & Beverages',
        stock: 12,
        reorderLevel: 30,
        status: 'Low Stock',
        statusClass: 'low-stock',
        description: 'Low Stock'
      }
    ];

    setAlertsData({
      totalAlerts: 138,
      lowStockAlerts: 56,
      criticalAlerts: 5,
      deadStock: 4,
      alerts: sampleAlerts
    });
  };

  const generateAlertsFromInventory = (inventoryData) => {
    const alerts = [];
    let criticalCount = 0;
    let lowStockCount = 0;
    let deadStockCount = 0;

    inventoryData.products?.forEach((product, index) => {
      const reorderLevel = product.reorderLevel || 20;
      
      if (product.stock === 0) {
        alerts.push({
          id: `critical_${index}`,
          type: 'Critical Alert',
          typeClass: 'critical',
          icon: '🚨',
          product: product.name,
          category: product.category,
          stock: product.stock,
          reorderLevel: reorderLevel,
          status: 'Reorder Now',
          statusClass: 'reorder-now',
          description: 'Out of Stock'
        });
        criticalCount++;
      } else if (product.stock <= reorderLevel) {
        alerts.push({
          id: `low_${index}`,
          type: 'Low Stock',
          typeClass: 'low-stock',
          icon: '⚠️',
          product: product.name,
          category: product.category,
          stock: product.stock,
          reorderLevel: reorderLevel,
          status: 'Low Stock',
          statusClass: 'low-stock',
          description: 'Low Stock'
        });
        lowStockCount++;
      } else if (product.totalSold < 5 && product.stock > 50) {
        alerts.push({
          id: `dead_${index}`,
          type: 'Dead Stock',
          typeClass: 'dead-stock',
          icon: '💀',
          product: product.name,
          category: product.category,
          stock: product.stock,
          reorderLevel: reorderLevel,
          status: 'Dead Stock',
          statusClass: 'dead-stock',
          description: 'Unsold for 60+ days'
        });
        deadStockCount++;
      }
    });

    setAlertsData({
      totalAlerts: alerts.length,
      lowStockAlerts: lowStockCount,
      criticalAlerts: criticalCount,
      deadStock: deadStockCount,
      alerts: alerts
    });
  };

  // Filter alerts
  const filteredAlerts = alertsData.alerts.filter(alert => {
    const matchesFilter = selectedFilter === 'All Alerts' || 
                         (selectedFilter === 'Low Stock' && alert.typeClass === 'low-stock') ||
                         (selectedFilter === 'Critical' && alert.typeClass === 'critical') ||
                         (selectedFilter === 'Dead Stock' && alert.typeClass === 'dead-stock');
    const matchesSearch = alert.product.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAlerts = filteredAlerts.slice(startIndex, startIndex + itemsPerPage);

  const getAlertIcon = (type) => {
    switch (type) {
      case 'Critical Alert': return '🚨';
      case 'Low Stock': return '⚠️';
      case 'Dead Stock': return '💀';
      default: return '📋';
    }
  };

  const getProductIcon = (category) => {
    switch (category) {
      case 'Food & Beverages': return '🍽️';
      case 'Health & Beauty': return '🧴';
      case 'Household': return '🏠';
      case 'Electronics': return '📱';
      case 'Accessories': return '🔌';
      default: return '📦';
    }
  };

  const filterOptions = ['All Alerts', 'Low Stock', 'Critical', 'Dead Stock'];

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
          <span className="logo-icon">🚨</span>
          <span>Alerts</span>
        </div>
        <div className="mobile-user">
          <span className="notification-badge">{alertsData.totalAlerts}</span>
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

      {/* Sidebar - Exact Dashboard Copy */}
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
          <div className="nav-item active">
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
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">Alerts Management</h1>
            <p className="page-subtitle">Monitor low stock, dead stock, and critical alerts</p>
          </div>
          <div className="header-right">
            <div className="user-section">
              <div className="user-profile">
                <div className="user-info">
                  <span className="user-name">Admin</span>
                  <span className="user-role">👤</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="dashboard-content">
          {/* Alert Tabs */}
          <div className="alert-tabs">
            <button 
              className={`tab-btn ${selectedFilter === 'All Alerts' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('All Alerts')}
            >
              All Alerts <span className="tab-count">{alertsData.totalAlerts}</span>
            </button>
            <button 
              className={`tab-btn ${selectedFilter === 'Low Stock' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('Low Stock')}
            >
              Low Stock <span className="tab-count">{alertsData.lowStockAlerts}</span>
            </button>
            <button 
              className={`tab-btn ${selectedFilter === 'Critical' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('Critical')}
            >
              Critical <span className="tab-count">{alertsData.criticalAlerts}</span>
            </button>
            <button 
              className={`tab-btn ${selectedFilter === 'Dead Stock' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('Dead Stock')}
            >
              Dead Stock <span className="tab-count">{alertsData.deadStock}</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="stats-grid">
            <div className="stat-card yellow">
              <div className="stat-icon-container yellow">
                <span className="stat-icon-large">⚠️</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{alertsData.lowStockAlerts}</div>
                <div className="stat-label">Low Stock Alerts</div>
                <div className="stat-detail">Reorder needed</div>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-icon-container red">
                <span className="stat-icon-large">🚨</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{alertsData.criticalAlerts}</div>
                <div className="stat-label">Critical Alerts</div>
                <div className="stat-detail">Immediate action required</div>
              </div>
            </div>

            <div className="stat-card gray">
              <div className="stat-icon-container gray">
                <span className="stat-icon-large">💀</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{alertsData.deadStock}</div>
                <div className="stat-label">Dead Stock</div>
                <div className="stat-detail">Unsold for 60+ days</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="alerts-controls">
            <div className="controls-left">
              <h3 className="alerts-title">All Alerts <span className="alerts-count">({filteredAlerts.length})</span></h3>
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="filter-select"
              >
                {filterOptions.map(option => (
                  <option key={option} value={option}>Filter by: {option}</option>
                ))}
              </select>
            </div>

            <div className="controls-right">
              <div className="search-container">
                <span className="search-icon">🔍</span>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>
            </div>
          </div>

          {/* Alerts Table */}
          <div className="alerts-table-container">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>Alert</th>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Reorder Level</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedAlerts.map((alert, index) => (
                  <tr key={alert.id || index}>
                    <td>
                      <div className="alert-info">
                        <div className={`alert-icon ${alert.typeClass}`}>
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="alert-details">
                          <div className="alert-type">{alert.type}</div>
                          <div className="alert-description">{alert.description}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="product-info">
                        <div className="product-icon">{getProductIcon(alert.category)}</div>
                        <div className="product-details">
                          <div className="product-name">{alert.product}</div>
                          <div className="product-category-small">{alert.category}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`stock-number ${alert.typeClass}`}>{alert.stock}</span>
                    </td>
                    <td>
                      <div className="reorder-info">
                        <span className="reorder-level">₹ {alert.reorderLevel}</span>
                        <div className="reorder-note">Reorder level</div>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${alert.statusClass}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="action-btn restock">Restock</button>
                        <button className="view-btn">
                          View
                          <span className="dropdown-arrow">▼</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredAlerts.length)} of {filteredAlerts.length} alerts
              </div>
              <div className="pagination-controls">
                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                
                {[...Array(Math.min(5, totalPages))].map((_, index) => {
                  const pageNum = index + 1;
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button 
                  className="pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Alerts;