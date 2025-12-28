import React, { useState } from 'react';
import './BusinessSetup.css';

const BusinessSetup = ({ onComplete }) => {
  const [businessData, setBusinessData] = useState({
    businessName: 'SmartShop Grocery',
    businessType: 'Retail Store',
    currency: '₹ INR - Indian Rupee',
    timeZone: '(GMT +5:30) Kolkata'
  });

  const [uploadData, setUploadData] = useState({
    selectedFile: null,
    isDragOver: false,
    showSampleData: false
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sample data for preview
  const sampleBusinessData = {
    businessInfo: {
      name: "SmartShop Grocery Store",
      type: "Retail Store",
      currency: "INR",
      location: "Mumbai, India"
    },
    products: [
      { name: "Rice Bag (Premium Basmati)", category: "Food & Beverages", stock: 100, price: 1200 },
      { name: "Milk Packet (1 Liter)", category: "Food & Beverages", stock: 200, price: 50 },
      { name: "Sugar Pack (1 KG)", category: "Food & Beverages", stock: 80, price: 45 },
      { name: "Cooking Oil (1 Liter)", category: "Food & Beverages", stock: 60, price: 160 },
      { name: "Wheat Flour (5 KG)", category: "Food & Beverages", stock: 50, price: 245 },
      { name: "Onion Bag (2 KG)", category: "Food & Beverages", stock: 120, price: 35 },
      { name: "Potato Bag (3 KG)", category: "Food & Beverages", stock: 100, price: 40 },
      { name: "Tea Pack (250g)", category: "Food & Beverages", stock: 80, price: 120 },
      { name: "Soap Bar (Premium)", category: "Health & Beauty", stock: 150, price: 35 },
      { name: "Banana (Per Dozen)", category: "Food & Beverages", stock: 200, price: 30 }
    ],
    salesData: [
      { product: "Rice Bag (Premium Basmati)", quantitySold: 45, revenue: 54000 },
      { product: "Milk Packet (1 Liter)", quantitySold: 150, revenue: 7500 },
      { product: "Sugar Pack (1 KG)", quantitySold: 35, revenue: 1575 },
      { product: "Cooking Oil (1 Liter)", quantitySold: 25, revenue: 4000 },
      { product: "Wheat Flour (5 KG)", quantitySold: 30, revenue: 7350 }
    ]
  };

  const handleInputChange = (field, value) => {
    setBusinessData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setUploadData(prev => ({ ...prev, isDragOver: true }));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setUploadData(prev => ({ ...prev, isDragOver: false }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setUploadData(prev => ({ ...prev, isDragOver: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file && file.name.toLowerCase().endsWith('.csv')) {
      setUploadData(prev => ({ ...prev, selectedFile: file }));
    } else {
      alert('Please select a CSV file only');
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUseSampleData = () => {
    setUploadData(prev => ({ ...prev, showSampleData: !prev.showSampleData }));
  };

  const handleDownloadSample = () => {
    const csvContent = `productName,quantity,price,stock,category,date
Rice Bag (Premium Basmati),45,1200,100,Food & Beverages,2024-01-15
Milk Packet (1 Liter),150,50,200,Food & Beverages,2024-01-15
Sugar Pack (1 KG),35,45,80,Food & Beverages,2024-01-15
Cooking Oil (1 Liter),25,160,60,Food & Beverages,2024-01-15
Wheat Flour (5 KG),30,245,50,Food & Beverages,2024-01-15
Onion Bag (2 KG),85,35,120,Food & Beverages,2024-01-15
Potato Bag (3 KG),70,40,100,Food & Beverages,2024-01-15`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample-grocery-store-data.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGoToDashboard = async () => {
    // Validate business data
    if (!businessData.businessName.trim()) {
      alert('Please enter business name');
      return;
    }

    setIsLoading(true);
    
    try {
      // Save business data
      localStorage.setItem('businessData', JSON.stringify(businessData));
      
      // If sample data is used, save sample products and sales
      if (uploadData.showSampleData || !uploadData.selectedFile) {
        localStorage.setItem('products', JSON.stringify(
          sampleBusinessData.products.map((product, index) => ({
            id: Date.now() + index,
            productName: product.name,
            category: product.category,
            stockQuantity: product.stock.toString(),
            unitPrice: product.price.toString(),
            createdAt: new Date().toISOString()
          }))
        ));
        
        localStorage.setItem('salesData', JSON.stringify(sampleBusinessData.salesData));
      }
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Complete setup
      onComplete();
      
    } catch (error) {
      console.error('Error setting up business:', error);
      alert('Error setting up business. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="business-setup-container">
      <div className="business-setup-card">
        {/* Header */}
        <div className="setup-header">
          <div className="header-icon">🏢</div>
          <h1>Business Setup & Data Import</h1>
          <p>Set up your business and import your data in one simple step</p>
        </div>

        {/* Business Info Section */}
        <div className="business-info-section">
          <div className="info-row">
            <div className="form-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                type="text"
                id="businessName"
                value={businessData.businessName}
                onChange={(e) => handleInputChange('businessName', e.target.value)}
                className="form-input"
                placeholder="Enter your business name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="businessType">Business Type</label>
              <select
                id="businessType"
                value={businessData.businessType}
                onChange={(e) => handleInputChange('businessType', e.target.value)}
                className="form-select"
              >
                <option value="Retail Store">Retail Store</option>
                <option value="E-commerce">E-commerce</option>
                <option value="Wholesale">Wholesale</option>
                <option value="Manufacturing">Manufacturing</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Import Section */}
        <div className="data-import-section">
          <h2>📊 Import Your Complete Business Data</h2>
          
          {/* CSV Upload Area */}
          <div 
            className={`csv-upload-area ${uploadData.isDragOver ? 'drag-over' : ''} ${uploadData.selectedFile ? 'has-file' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {uploadData.selectedFile ? (
              <div className="file-selected">
                <div className="file-icon">📄</div>
                <div className="file-info">
                  <div className="file-name">{uploadData.selectedFile.name}</div>
                  <div className="file-size">{(uploadData.selectedFile.size / 1024).toFixed(1)} KB</div>
                </div>
                <button 
                  className="remove-file-btn"
                  onClick={() => setUploadData(prev => ({ ...prev, selectedFile: null }))}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="upload-placeholder">
                <div className="upload-icon">📁</div>
                <div className="upload-text">
                  <h3>Drag & Drop Your Business CSV File Here</h3>
                  <p>(Contains: Products + Sales + Business Info)</p>
                </div>
                <button 
                  className="browse-btn"
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  Browse Files
                </button>
                <input
                  type="file"
                  id="fileInput"
                  accept=".csv"
                  onChange={handleFileInputChange}
                  style={{ display: 'none' }}
                />
              </div>
            )}
          </div>

          {/* OR Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Sample Data Section */}
          <div className="sample-data-section">
            <button 
              className={`sample-data-toggle ${uploadData.showSampleData ? 'expanded' : ''}`}
              onClick={handleUseSampleData}
            >
              <span className="sample-icon">📋</span>
              <span>{uploadData.showSampleData ? 'Hide Sample CSV Format' : 'Show Sample CSV Format'}</span>
              <span className="expand-icon">{uploadData.showSampleData ? '▲' : '▼'}</span>
            </button>

            {/* Collapsible Sample Data Preview */}
            {uploadData.showSampleData && (
              <div className="sample-data-preview collapsible">
                <div className="csv-preview-layout">
                  {/* Left side - CSV Table */}
                  <div className="csv-table-section">
                    <div className="csv-table-container">
                      <table className="csv-sample-table">
                        <thead>
                          <tr>
                            <th>productName</th>
                            <th>quantity</th>
                            <th>price</th>
                            <th>stock</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>Rice Bag (Premium)</td>
                            <td>45</td>
                            <td>₹1200</td>
                            <td>100</td>
                          </tr>
                          <tr>
                            <td>Milk Packet (1L)</td>
                            <td>150</td>
                            <td>₹50</td>
                            <td>200</td>
                          </tr>
                          <tr>
                            <td>Sugar Pack (1KG)</td>
                            <td>35</td>
                            <td>₹45</td>
                            <td>80</td>
                          </tr>
                          <tr>
                            <td>Cooking Oil (1L)</td>
                            <td>25</td>
                            <td>₹160</td>
                            <td>60</td>
                          </tr>
                          <tr>
                            <td>Wheat Flour (5KG)</td>
                            <td>30</td>
                            <td>₹245</td>
                            <td>50</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="quick-actions">
                      <button 
                        className="btn-download-sample"
                        onClick={handleDownloadSample}
                      >
                        📥 Download Sample CSV
                      </button>
                    </div>
                  </div>

                  {/* Right side - Instructions */}
                  <div className="instructions-section">
                    <div className="instruction-card compact">
                      <h5>📝 How to create your CSV:</h5>
                      <ol>
                        <li><strong>Open Excel</strong> or Google Sheets</li>
                        <li><strong>Create columns:</strong> productName, quantity, price, stock</li>
                        <li><strong>Add your products</strong> (replace our examples)</li>
                        <li><strong>Save as CSV</strong> format</li>
                        <li><strong>Upload above</strong> ⬆️</li>
                      </ol>
                    </div>
                    
                    <div className="column-explanation compact">
                      <h5>📊 Column Meanings:</h5>
                      <div className="columns-grid compact">
                        <div className="column-item">
                          <span className="column-name">productName</span>
                          <span className="column-desc">Your product name</span>
                        </div>
                        <div className="column-item">
                          <span className="column-name">quantity</span>
                          <span className="column-desc">Units sold</span>
                        </div>
                        <div className="column-item">
                          <span className="column-name">price</span>
                          <span className="column-desc">Price per unit</span>
                        </div>
                        <div className="column-item">
                          <span className="column-name">stock</span>
                          <span className="column-desc">Current inventory</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="action-section">
          <button 
            className={`dashboard-btn ${isLoading ? 'loading' : ''}`}
            onClick={handleGoToDashboard}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading-spinner"></span>
                Setting up your business...
              </>
            ) : (
              <>
                <span className="dashboard-icon">🚀</span>
                Go to Dashboard
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessSetup;