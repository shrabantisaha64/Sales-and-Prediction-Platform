import React, { useState, useEffect } from 'react';
import './Settings.css';
import { connectSocket } from './services/api';

const Settings = ({ onNavigate, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Business');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [settingsData, setSettingsData] = useState({
    business: {
      storeName: 'Fresh Mart Grocery Store',
      ownerName: 'Rajesh Kumar',
      address: '123 Main Street, Mumbai, Maharashtra 400001',
      phone: '+91 98765 43210',
      email: 'rajesh@freshmart.com',
      gstNumber: '27ABCDE1234F1Z5',
      currency: 'INR',
      timezone: 'Asia/Kolkata'
    },
    notifications: {
      lowStockAlerts: true,
      dailyReports: true,
      weeklyReports: false,
      monthlyReports: true,
      criticalAlerts: true,
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true
    },
    inventory: {
      autoReorder: false,
      reorderThreshold: 20,
      leadTime: 7,
      stockValuation: 'FIFO',
      trackExpiry: true,
      barcodeScanning: false,
      multiLocation: false,
      negativeStock: false
    },
    system: {
      language: 'English',
      dateFormat: 'DD/MM/YYYY',
      numberFormat: 'Indian',
      backupFrequency: 'Daily',
      dataRetention: '2 years',
      apiAccess: false,
      debugMode: false,
      maintenanceMode: false
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    // Connect to socket for real-time updates
    const socket = connectSocket();

    // Listen for settings updates
    socket.on('settingsUpdate', (data) => {
      console.log('Settings updated:', data);
      if (data) {
        setSettingsData(prevData => ({ ...prevData, ...data }));
      }
    });

    return () => {
      socket.off('settingsUpdate');
    };
  }, []);

  const handleInputChange = (section, field, value) => {
    setSettingsData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    console.log('Saving settings:', settingsData);
    setIsEditing(false);
    setHasChanges(false);
    
    // Show success message (you can implement a toast notification here)
    alert('Settings saved successfully!');
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default values?')) {
      // Reset to default values
      setSettingsData({
        business: {
          storeName: 'Fresh Mart Grocery Store',
          ownerName: 'Rajesh Kumar',
          address: '123 Main Street, Mumbai, Maharashtra 400001',
          phone: '+91 98765 43210',
          email: 'rajesh@freshmart.com',
          gstNumber: '27ABCDE1234F1Z5',
          currency: 'INR',
          timezone: 'Asia/Kolkata'
        },
        notifications: {
          lowStockAlerts: true,
          dailyReports: true,
          weeklyReports: false,
          monthlyReports: true,
          criticalAlerts: true,
          emailNotifications: true,
          smsNotifications: false,
          pushNotifications: true
        },
        inventory: {
          autoReorder: false,
          reorderThreshold: 20,
          leadTime: 7,
          stockValuation: 'FIFO',
          trackExpiry: true,
          barcodeScanning: false,
          multiLocation: false,
          negativeStock: false
        },
        system: {
          language: 'English',
          dateFormat: 'DD/MM/YYYY',
          numberFormat: 'Indian',
          backupFrequency: 'Daily',
          dataRetention: '2 years',
          apiAccess: false,
          debugMode: false,
          maintenanceMode: false
        }
      });
      setHasChanges(false);
      setIsEditing(false);
    }
  };

  const renderBusinessSettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Business Information</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label">Store Name</label>
          <input
            type="text"
            value={settingsData.business.storeName}
            onChange={(e) => handleInputChange('business', 'storeName', e.target.value)}
            className="setting-input"
            disabled={!isEditing}
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Owner Name</label>
          <input
            type="text"
            value={settingsData.business.ownerName}
            onChange={(e) => handleInputChange('business', 'ownerName', e.target.value)}
            className="setting-input"
            disabled={!isEditing}
          />
        </div>
        <div className="setting-item full-width">
          <label className="setting-label">Address</label>
          <textarea
            value={settingsData.business.address}
            onChange={(e) => handleInputChange('business', 'address', e.target.value)}
            className="setting-textarea"
            disabled={!isEditing}
            rows="3"
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Phone Number</label>
          <input
            type="tel"
            value={settingsData.business.phone}
            onChange={(e) => handleInputChange('business', 'phone', e.target.value)}
            className="setting-input"
            disabled={!isEditing}
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Email</label>
          <input
            type="email"
            value={settingsData.business.email}
            onChange={(e) => handleInputChange('business', 'email', e.target.value)}
            className="setting-input"
            disabled={!isEditing}
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">GST Number</label>
          <input
            type="text"
            value={settingsData.business.gstNumber}
            onChange={(e) => handleInputChange('business', 'gstNumber', e.target.value)}
            className="setting-input"
            disabled={!isEditing}
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Currency</label>
          <select
            value={settingsData.business.currency}
            onChange={(e) => handleInputChange('business', 'currency', e.target.value)}
            className="setting-select"
            disabled={!isEditing}
          >
            <option value="INR">Indian Rupee (₹)</option>
            <option value="USD">US Dollar ($)</option>
            <option value="EUR">Euro (€)</option>
          </select>
        </div>
        <div className="setting-item">
          <label className="setting-label">Timezone</label>
          <select
            value={settingsData.business.timezone}
            onChange={(e) => handleInputChange('business', 'timezone', e.target.value)}
            className="setting-select"
            disabled={!isEditing}
          >
            <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
            <option value="America/New_York">America/New_York (EST)</option>
            <option value="Europe/London">Europe/London (GMT)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Notification Preferences</h3>
      <div className="settings-grid">
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Low Stock Alerts</label>
            <p className="setting-description">Get notified when products are running low</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.notifications.lowStockAlerts}
              onChange={(e) => handleInputChange('notifications', 'lowStockAlerts', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Daily Reports</label>
            <p className="setting-description">Receive daily sales and inventory reports</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.notifications.dailyReports}
              onChange={(e) => handleInputChange('notifications', 'dailyReports', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Weekly Reports</label>
            <p className="setting-description">Receive weekly performance summaries</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.notifications.weeklyReports}
              onChange={(e) => handleInputChange('notifications', 'weeklyReports', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Monthly Reports</label>
            <p className="setting-description">Receive monthly business insights</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.notifications.monthlyReports}
              onChange={(e) => handleInputChange('notifications', 'monthlyReports', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Critical Alerts</label>
            <p className="setting-description">Immediate notifications for urgent issues</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.notifications.criticalAlerts}
              onChange={(e) => handleInputChange('notifications', 'criticalAlerts', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Email Notifications</label>
            <p className="setting-description">Send notifications via email</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.notifications.emailNotifications}
              onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderInventorySettings = () => (
    <div className="settings-section">
      <h3 className="section-title">Inventory Management</h3>
      <div className="settings-grid">
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Auto Reorder</label>
            <p className="setting-description">Automatically create purchase orders when stock is low</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.inventory.autoReorder}
              onChange={(e) => handleInputChange('inventory', 'autoReorder', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item">
          <label className="setting-label">Reorder Threshold</label>
          <input
            type="number"
            value={settingsData.inventory.reorderThreshold}
            onChange={(e) => handleInputChange('inventory', 'reorderThreshold', parseInt(e.target.value))}
            className="setting-input"
            disabled={!isEditing}
            min="1"
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Lead Time (Days)</label>
          <input
            type="number"
            value={settingsData.inventory.leadTime}
            onChange={(e) => handleInputChange('inventory', 'leadTime', parseInt(e.target.value))}
            className="setting-input"
            disabled={!isEditing}
            min="1"
          />
        </div>
        <div className="setting-item">
          <label className="setting-label">Stock Valuation Method</label>
          <select
            value={settingsData.inventory.stockValuation}
            onChange={(e) => handleInputChange('inventory', 'stockValuation', e.target.value)}
            className="setting-select"
            disabled={!isEditing}
          >
            <option value="FIFO">FIFO (First In, First Out)</option>
            <option value="LIFO">LIFO (Last In, First Out)</option>
            <option value="Average">Weighted Average</option>
          </select>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Track Expiry Dates</label>
            <p className="setting-description">Monitor product expiration dates</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.inventory.trackExpiry}
              onChange={(e) => handleInputChange('inventory', 'trackExpiry', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">Allow Negative Stock</label>
            <p className="setting-description">Allow selling products with zero stock</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.inventory.negativeStock}
              onChange={(e) => handleInputChange('inventory', 'negativeStock', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="settings-section">
      <h3 className="section-title">System Configuration</h3>
      <div className="settings-grid">
        <div className="setting-item">
          <label className="setting-label">Language</label>
          <select
            value={settingsData.system.language}
            onChange={(e) => handleInputChange('system', 'language', e.target.value)}
            className="setting-select"
            disabled={!isEditing}
          >
            <option value="English">English</option>
            <option value="Hindi">हिंदी (Hindi)</option>
            <option value="Marathi">मराठी (Marathi)</option>
          </select>
        </div>
        <div className="setting-item">
          <label className="setting-label">Date Format</label>
          <select
            value={settingsData.system.dateFormat}
            onChange={(e) => handleInputChange('system', 'dateFormat', e.target.value)}
            className="setting-select"
            disabled={!isEditing}
          >
            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
          </select>
        </div>
        <div className="setting-item">
          <label className="setting-label">Number Format</label>
          <select
            value={settingsData.system.numberFormat}
            onChange={(e) => handleInputChange('system', 'numberFormat', e.target.value)}
            className="setting-select"
            disabled={!isEditing}
          >
            <option value="Indian">Indian (1,23,456.78)</option>
            <option value="International">International (123,456.78)</option>
          </select>
        </div>
        <div className="setting-item">
          <label className="setting-label">Backup Frequency</label>
          <select
            value={settingsData.system.backupFrequency}
            onChange={(e) => handleInputChange('system', 'backupFrequency', e.target.value)}
            className="setting-select"
            disabled={!isEditing}
          >
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
        <div className="setting-item">
          <label className="setting-label">Data Retention</label>
          <select
            value={settingsData.system.dataRetention}
            onChange={(e) => handleInputChange('system', 'dataRetention', e.target.value)}
            className="setting-select"
            disabled={!isEditing}
          >
            <option value="1 year">1 Year</option>
            <option value="2 years">2 Years</option>
            <option value="5 years">5 Years</option>
            <option value="Indefinite">Indefinite</option>
          </select>
        </div>
        <div className="setting-item toggle-item">
          <div className="toggle-info">
            <label className="setting-label">API Access</label>
            <p className="setting-description">Enable third-party API integrations</p>
          </div>
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={settingsData.system.apiAccess}
              onChange={(e) => handleInputChange('system', 'apiAccess', e.target.checked)}
              disabled={!isEditing}
            />
            <span className="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
  );

  const tabs = ['Business', 'Notifications', 'Inventory', 'System'];

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
          <span className="logo-icon">⚙️</span>
          <span>Settings</span>
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
          <div className="nav-item" onClick={() => {
            onNavigate && onNavigate('forecasting');
            setIsMobileSidebarOpen(false);
          }}>
            <span className="nav-icon">📊</span>
            <span className="nav-text">Forecasting</span>
          </div>
          <div className="nav-item active">
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
            <h1 className="page-title">Settings</h1>
            <p className="page-subtitle">Configure your business preferences and system settings</p>
          </div>
          <div className="header-right">
            <div className="header-actions">
              {!isEditing ? (
                <button className="action-btn primary" onClick={() => setIsEditing(true)}>
                  <span className="btn-icon">✏️</span>
                  <span className="btn-text">Edit Settings</span>
                </button>
              ) : (
                <>
                  <button className="action-btn" onClick={() => setIsEditing(false)}>
                    <span className="btn-text">Cancel</span>
                  </button>
                  <button 
                    className="action-btn primary" 
                    onClick={handleSaveSettings}
                    disabled={!hasChanges}
                  >
                    <span className="btn-icon">💾</span>
                    <span className="btn-text">Save Changes</span>
                  </button>
                </>
              )}
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
          {/* Settings Tabs */}
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Settings Content */}
          <div className="settings-content">
            {activeTab === 'Business' && renderBusinessSettings()}
            {activeTab === 'Notifications' && renderNotificationSettings()}
            {activeTab === 'Inventory' && renderInventorySettings()}
            {activeTab === 'System' && renderSystemSettings()}
          </div>

          {/* Settings Actions */}
          {isEditing && (
            <div className="settings-actions">
              <button className="action-btn danger" onClick={handleResetSettings}>
                <span className="btn-icon">🔄</span>
                <span className="btn-text">Reset to Defaults</span>
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Settings;