import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import BusinessSetup from './BusinessSetup';
import Inventory from './Inventory';
import Alerts from './Alerts';
import SalesAnalytics from './SalesAnalytics';
import Forecasting from './Forecasting';
import Settings from './Settings';
import { connectSocket, disconnectSocket } from './services/api';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'inventory', 'alerts'
  const [socket, setSocket] = useState(null);
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  // Connect to socket when logged in
  useEffect(() => {
    if (showDashboard && !socket) {
      const newSocket = connectSocket();
      setSocket(newSocket);

      // Listen for real-time updates
      newSocket.on('businessUpdate', (data) => {
        console.log('Business updated:', data);
      });

      newSocket.on('productAdded', (product) => {
        console.log('Product added:', product);
      });

      newSocket.on('salesDataUploaded', (data) => {
        console.log('Sales data uploaded:', data);
      });

      newSocket.on('dashboardUpdate', (stats) => {
        console.log('Dashboard updated:', stats);
      });
    }

    return () => {
      if (socket) {
        disconnectSocket();
      }
    };
  }, [showDashboard, socket]);

  const handleLoginInputChange = (field, value) => {
    setLoginData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.email && loginData.password) {
      setIsLoggedIn(true);
    } else {
      alert('Please enter both email and password');
    }
  };

  const handleBusinessSetupComplete = () => {
    setShowDashboard(true);
  };

  const handleLogout = () => {
    // Disconnect socket
    if (socket) {
      disconnectSocket();
      setSocket(null);
    }
    
    // Reset all states to initial values
    setIsLoggedIn(false);
    setShowDashboard(false);
    setCurrentPage('dashboard');
    setLoginData({
      email: '',
      password: '',
      rememberMe: false
    });
    
    console.log('User logged out successfully');
  };

  const renderLogin = () => (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="user-avatar">
            <div className="avatar-icon">👤</div>
          </div>
          <h1 className="login-title">Sign in</h1>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <div className="input-icon">📧</div>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => handleLoginInputChange('email', e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="input-group">
            <div className="input-icon">🔒</div>
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => handleLoginInputChange('password', e.target.value)}
              className="login-input"
              required
            />
          </div>

          <div className="login-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={loginData.rememberMe}
                onChange={(e) => handleLoginInputChange('rememberMe', e.target.checked)}
              />
              <span className="checkmark">✓</span>
              Remember me
            </label>
            <a href="#forgot" className="forgot-password">Forgot password?</a>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          <div className="signup-link">
            Not registered? <a href="#signup">Create an account!</a>
          </div>
        </form>
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return renderLogin();
  }

  // If setup is complete, show the appropriate page
  if (showDashboard) {
    switch (currentPage) {
      case 'inventory':
        return <Inventory onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'alerts':
        return <Alerts onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'analytics':
        return <SalesAnalytics onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'forecasting':
        return <Forecasting onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'settings':
        return <Settings onNavigate={setCurrentPage} onLogout={handleLogout} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={setCurrentPage} onLogout={handleLogout} />;
    }
  }

  // Show business setup page
  return <BusinessSetup onComplete={handleBusinessSetupComplete} />;
};

export default App;