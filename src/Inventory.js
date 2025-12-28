import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { inventoryAPI, connectSocket } from './services/api';

const Inventory = ({ onNavigate, onLogout }) => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('Low Stock');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [inventoryData, setInventoryData] = useState({
    totalProducts: 25,
    lowStockAlerts: 8,
    outOfStock: 2,
    deadStock: 4,
    products: [
      { id: 1, name: 'Rice Bag (Premium Basmati)', category: 'Food & Beverages', stock: 85, price: 1200, reorderLevel: 17, status: 'In Stock' },
      { id: 2, name: 'Milk Packet (1 Liter)', category: 'Food & Beverages', stock: 180, price: 50, reorderLevel: 36, status: 'In Stock' },
      { id: 3, name: 'Tea Pack (250g)', category: 'Food & Beverages', stock: 5, price: 120, reorderLevel: 20, status: 'Low Stock' },
      { id: 4, name: 'Cooking Oil (1 Liter)', category: 'Food & Beverages', stock: 12, price: 160, reorderLevel: 30, status: 'Low Stock' },
      { id: 5, name: 'Wheat Flour (5 KG)', category: 'Food & Beverages', stock: 8, price: 245, reorderLevel: 25, status: 'Low Stock' },
      { id: 6, name: 'Chicken (1 KG)', category: 'Food & Beverages', stock: 0, price: 280, reorderLevel: 20, status: 'Out of Stock' },
      { id: 7, name: 'Detergent Powder (1 KG)', category: 'Household', stock: 0, price: 120, reorderLevel: 15, status: 'Out of Stock' },
      { id: 8, name: 'Shampoo Bottle (200ml)', category: 'Health & Beauty', stock: 7, price: 95, reorderLevel: 20, status: 'Low Stock' },
      { id: 9, name: 'Banana (Per Dozen)', category: 'Food & Beverages', stock: 150, price: 30, reorderLevel: 40, status: 'In Stock' },
      { id: 10, name: 'Bread Loaf (White)', category: 'Food & Beverages', stock: 125, price: 25, reorderLevel: 30, status: 'In Stock' }
    ]
  });

  const itemsPerPage = 5;

  useEffect(() => {
    // Connect to socket for real-time updates
    const socket = connectSocket();

    // Load real data in background without showing loading
    loadInventoryDataInBackground();

    // Listen for real-time inventory updates
    socket.on('inventoryUpdate', (data) => {
      console.log('Real-time inventory update:', data);
      if (data && data.products) {
        setInventoryData(data);
      }
    });

    return () => {
      socket.off('inventoryUpdate');
    };
  }, []);

  const loadInventoryDataInBackground = async () => {
    try {
      const response = await inventoryAPI.getData();
      if (response.data.success) {
        setInventoryData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading inventory data in background:', error);
      // Keep the initial sample data if API fails
    }
  };

  // Filter and sort products
  const filteredProducts = inventoryData.products
    .filter(product => {
      const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Low Stock':
          return a.stock - b.stock;
        case 'High Stock':
          return b.stock - a.stock;
        case 'Price Low to High':
          return a.price - b.price;
        case 'Price High to Low':
          return b.price - a.price;
        case 'Name A-Z':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getStockStatus = (stock, reorderLevel = 20) => {
    if (stock === 0) return { status: 'Out of Stock', class: 'out-of-stock' };
    if (stock <= reorderLevel) return { status: 'Low Stock', class: 'low-stock' };
    return { status: 'In Stock', class: 'in-stock' };
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

  const categories = ['All Categories', 'Food & Beverages', 'Health & Beauty', 'Household', 'Electronics', 'Accessories'];
  const sortOptions = ['Low Stock', 'High Stock', 'Price Low to High', 'Price High to Low', 'Name A-Z'];

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
          <span className="logo-icon">📦</span>
          <span>Inventory</span>
        </div>
        <div className="mobile-user">
          <span className="notification-badge">{inventoryData.lowStockAlerts}</span>
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
          <div className="nav-item active">
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
        {/* Header */}
        <header className="dashboard-header">
          <div className="header-left">
            <h1 className="page-title">Inventory Management</h1>
            <p className="page-subtitle">Manage and track your product inventory</p>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="action-btn primary">
                <span>+</span>
                <span>Add New Product</span>
              </button>
            </div>
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
          {/* Stats Cards - Exact Dashboard Style */}
          <div className="stats-grid">
            <div className="stat-card blue">
              <div className="stat-icon-container blue">
                <span className="stat-icon-large">📦</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{inventoryData.totalProducts}</div>
                <div className="stat-label">Total Products</div>
                <div className="stat-detail">12 low in stock</div>
              </div>
            </div>

            <div className="stat-card yellow">
              <div className="stat-icon-container yellow">
                <span className="stat-icon-large">⚠️</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{inventoryData.lowStockAlerts}</div>
                <div className="stat-label">Low Stock Alerts</div>
                <div className="stat-detail">Reorder needed</div>
              </div>
            </div>

            <div className="stat-card red">
              <div className="stat-icon-container red">
                <span className="stat-icon-large">🚫</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{inventoryData.outOfStock}</div>
                <div className="stat-label">Out of Stock</div>
                <div className="stat-detail">Need immediate restock</div>
              </div>
            </div>

            <div className="stat-card gray">
              <div className="stat-icon-container gray">
                <span className="stat-icon-large">💀</span>
              </div>
              <div className="stat-content">
                <div className="stat-number">{inventoryData.deadStock}</div>
                <div className="stat-label">Dead Stock</div>
                <div className="stat-detail">Unsold for 60+ days</div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="inventory-controls">
            <div className="controls-left">
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="filter-select"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>

              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select sort-select"
              >
                {sortOptions.map(option => (
                  <option key={option} value={option}>Sort by: {option}</option>
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

          {/* Products Table */}
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Reorder Level</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product, index) => {
                  const stockStatus = getStockStatus(product.stock, product.reorderLevel);
                  return (
                    <tr key={product.id || index}>
                      <td>
                        <div className="product-info">
                          <div className="product-icon">{getProductIcon(product.category)}</div>
                          <div className="product-details">
                            <div className="product-name">{product.name}</div>
                            <div className="product-category-small">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="category-text">{product.category}</span>
                      </td>
                      <td>
                        <span className={`stock-number ${stockStatus.class}`}>{product.stock}</span>
                      </td>
                      <td>
                        <div className="reorder-info">
                          <span className="reorder-level">₹ {product.reorderLevel}</span>
                          <div className="reorder-note">Reorder level</div>
                        </div>
                      </td>
                      <td>
                        <span className="price">₹ {product.price?.toLocaleString()}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${stockStatus.class}`}>
                          {stockStatus.status}
                        </span>
                      </td>
                      <td>
                        <button className="view-btn">
                          View
                          <span className="dropdown-arrow">▼</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="pagination-container">
              <div className="pagination-info">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
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

export default Inventory;