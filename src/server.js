const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs-extra');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('../uploads'));

// Ensure uploads and data directories exist
fs.ensureDirSync('../uploads');
fs.ensureDirSync('../data');

// In-memory storage (in production, use a real database)
let businessData = {};
let products = [];
let salesData = [];
let dashboardStats = {
  totalSales: 0,
  forecastedGrowth: 0,
  bestSellingProduct: null,
  worstSellingProduct: null,
  alerts: [],
  deadStock: [],
  topProducts: []
};

// Load sample data on server start
function loadSampleData() {
  const sampleSalesData = [
    { productName: 'Rice Bag (Premium Basmati)', quantity: 45, price: 1200, stock: 85, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Milk Packet (1 Liter)', quantity: 150, price: 50, stock: 180, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Sugar Pack (1 KG)', quantity: 35, price: 45, stock: 65, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Cooking Oil (1 Liter)', quantity: 25, price: 160, stock: 45, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Wheat Flour (5 KG)', quantity: 30, price: 245, stock: 35, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Onion Bag (2 KG)', quantity: 85, price: 35, stock: 95, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Potato Bag (3 KG)', quantity: 70, price: 40, stock: 80, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Tea Pack (250g)', quantity: 25, price: 120, stock: 15, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Soap Bar (Premium)', quantity: 40, price: 35, stock: 120, category: 'Health & Beauty', date: '2024-01-15' },
    { productName: 'Banana (Per Dozen)', quantity: 120, price: 30, stock: 150, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Tomato Pack (1 KG)', quantity: 95, price: 60, stock: 140, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Bread Loaf (White)', quantity: 110, price: 25, stock: 125, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Egg Tray (30 pieces)', quantity: 65, price: 180, stock: 75, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Chicken (1 KG)', quantity: 35, price: 280, stock: 25, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Fish (1 KG)', quantity: 20, price: 320, stock: 18, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Yogurt Cup (200ml)', quantity: 80, price: 15, stock: 95, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Cheese Block (200g)', quantity: 15, price: 85, stock: 22, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Biscuits Pack', quantity: 55, price: 40, stock: 85, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Noodles Pack', quantity: 75, price: 12, stock: 110, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Shampoo Bottle (200ml)', quantity: 25, price: 95, stock: 45, category: 'Health & Beauty', date: '2024-01-15' },
    { productName: 'Toothpaste Tube', quantity: 45, price: 55, stock: 65, category: 'Health & Beauty', date: '2024-01-15' },
    { productName: 'Detergent Powder (1 KG)', quantity: 30, price: 120, stock: 35, category: 'Household', date: '2024-01-15' },
    { productName: 'Toilet Paper (4 rolls)', quantity: 40, price: 80, stock: 55, category: 'Household', date: '2024-01-15' },
    { productName: 'Garlic (500g)', quantity: 60, price: 25, stock: 70, category: 'Food & Beverages', date: '2024-01-15' },
    { productName: 'Ginger (500g)', quantity: 50, price: 30, stock: 60, category: 'Food & Beverages', date: '2024-01-15' }
  ];

  // Convert to proper format and add IDs
  salesData = sampleSalesData.map((item, index) => ({
    id: `sample_${index + 1}`,
    ...item,
    createdAt: new Date().toISOString()
  }));

  console.log(`Loaded ${salesData.length} sample products with stock data for real-time dashboard and inventory`);
  updateDashboardStats();
}

// Load sample data when server starts
loadSampleData();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current dashboard and inventory data to new client
  socket.emit('dashboardUpdate', dashboardStats);
  
  const inventoryStats = calculateInventoryStats();
  socket.emit('inventoryUpdate', inventoryStats);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Routes

// Save business details
app.post('/api/business', (req, res) => {
  businessData = req.body;
  console.log('Business data saved:', businessData);
  
  // Broadcast update to all clients
  io.emit('businessUpdate', businessData);
  
  res.json({ success: true, data: businessData });
});

// Add product
app.post('/api/products', (req, res) => {
  const product = {
    id: uuidv4(),
    ...req.body,
    createdAt: new Date().toISOString()
  };
  
  products.push(product);
  console.log('Product added:', product);
  
  // Update dashboard stats
  updateDashboardStats();
  
  // Broadcast update to all clients
  io.emit('productAdded', product);
  io.emit('dashboardUpdate', dashboardStats);
  
  res.json({ success: true, data: product });
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json({ success: true, data: products });
});

// Upload and process CSV file
app.post('/api/upload-csv', upload.single('csvFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const filePath = req.file.path;
  const newSalesData = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Process each row of CSV data
      const salesRecord = {
        id: uuidv4(),
        productName: row.productName || row['Product Name'] || row.product,
        quantity: parseInt(row.quantity) || parseInt(row.Quantity) || 0,
        price: parseFloat(row.price) || parseFloat(row.Price) || 0,
        stock: parseInt(row.stock) || parseInt(row.Stock) || Math.floor(Math.random() * 200) + 50,
        date: row.date || row.Date || new Date().toISOString().split('T')[0],
        category: row.category || row.Category || 'General',
        createdAt: new Date().toISOString()
      };
      
      if (salesRecord.productName && salesRecord.quantity > 0) {
        newSalesData.push(salesRecord);
      }
    })
    .on('end', () => {
      // Replace existing sales data with new CSV data
      salesData = newSalesData;
      
      console.log(`Processed ${newSalesData.length} sales records from CSV`);
      
      // Update dashboard and inventory statistics
      updateDashboardStats();
      const inventoryStats = calculateInventoryStats();
      
      // Clean up uploaded file
      fs.remove(filePath);
      
      // Broadcast updates to all clients
      io.emit('salesDataUploaded', {
        recordsProcessed: newSalesData.length,
        totalRecords: salesData.length
      });
      io.emit('dashboardUpdate', dashboardStats);
      io.emit('inventoryUpdate', inventoryStats);
      
      res.json({
        success: true,
        message: `Successfully processed ${newSalesData.length} records`,
        data: {
          recordsProcessed: newSalesData.length,
          totalRecords: salesData.length,
          dashboardStats,
          inventoryStats
        }
      });
    })
    .on('error', (error) => {
      console.error('Error processing CSV:', error);
      fs.remove(filePath);
      res.status(500).json({
        success: false,
        message: 'Error processing CSV file',
        error: error.message
      });
    });
});

// Get dashboard data
app.get('/api/dashboard', (req, res) => {
  res.json({ success: true, data: dashboardStats });
});

// Get inventory data
app.get('/api/inventory', (req, res) => {
  // Calculate inventory statistics from sales data
  const inventoryStats = calculateInventoryStats();
  
  res.json({ success: true, data: inventoryStats });
});

// Function to calculate inventory statistics
function calculateInventoryStats() {
  if (salesData.length === 0) {
    return {
      totalProducts: 25,
      lowStockAlerts: 8,
      outOfStock: 3,
      deadStock: 2,
      products: []
    };
  }

  // Group sales data by product to calculate inventory
  const productInventory = {};
  
  salesData.forEach(record => {
    if (!productInventory[record.productName]) {
      productInventory[record.productName] = {
        id: record.id,
        name: record.productName,
        category: record.category,
        stock: record.stock || Math.floor(Math.random() * 100) + 10,
        price: record.price,
        reorderLevel: Math.max(10, Math.floor(record.stock * 0.2)) || 20, // 20% of stock as reorder level
        totalSold: 0,
        lastUpdated: new Date().toISOString(),
        status: 'In Stock'
      };
    }
    productInventory[record.productName].totalSold += record.quantity;
    
    // Update stock based on original CSV stock value, not sales reduction
    if (record.stock !== undefined) {
      productInventory[record.productName].stock = record.stock;
    }
  });

  const products = Object.values(productInventory);
  
  // Update product status based on stock levels
  products.forEach(product => {
    if (product.stock === 0) {
      product.status = 'Out of Stock';
    } else if (product.stock <= product.reorderLevel) {
      product.status = 'Low Stock';
    } else {
      product.status = 'In Stock';
    }
  });
  
  // Calculate statistics
  const totalProducts = products.length;
  const lowStockAlerts = products.filter(p => p.stock <= p.reorderLevel && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock === 0).length;
  const deadStock = products.filter(p => p.totalSold < 5 && p.stock > 50).length; // High stock but low sales

  console.log(`Inventory Stats: ${totalProducts} products, ${lowStockAlerts} low stock, ${outOfStock} out of stock`);

  return {
    totalProducts,
    lowStockAlerts,
    outOfStock,
    deadStock,
    products: products.sort((a, b) => a.stock - b.stock), // Sort by stock level (lowest first)
    lastUpdated: new Date().toISOString()
  };
}

// Get sales data
app.get('/api/sales', (req, res) => {
  res.json({ success: true, data: salesData });
});

// Function to update dashboard statistics
function updateDashboardStats() {
  if (salesData.length === 0) {
    // Generate sample data if no sales data exists
    dashboardStats = {
      totalSales: 250000,
      forecastedGrowth: 87500,
      bestSellingProduct: { name: 'Milk Packet', totalQuantity: 1200, category: 'Food & Beverages' },
      worstSellingProduct: { name: 'Soap Bar', totalQuantity: 75, category: 'Health & Beauty' },
      alerts: [
        {
          type: 'critical',
          title: 'Critical: Rice Bag Low Stock!',
          subtitle: 'Lead Time: 5 days',
          units: 50
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
        { name: 'Milk Packet', demand: 1200, revenue: 460 },
        { name: 'Rice Bag', demand: 980, revenue: 585 }
      ],
      lastUpdated: new Date().toISOString()
    };
    return;
  }

  // Calculate total sales
  const totalSales = salesData.reduce((sum, record) => sum + (record.quantity * record.price), 0);
  
  // Calculate product sales
  const productSales = {};
  salesData.forEach(record => {
    if (!productSales[record.productName]) {
      productSales[record.productName] = {
        name: record.productName,
        totalQuantity: 0,
        totalRevenue: 0,
        category: record.category
      };
    }
    productSales[record.productName].totalQuantity += record.quantity;
    productSales[record.productName].totalRevenue += (record.quantity * record.price);
  });

  // Find best and worst selling products
  const productArray = Object.values(productSales);
  const bestSelling = productArray.reduce((max, product) => 
    product.totalQuantity > max.totalQuantity ? product : max, productArray[0]);
  const worstSelling = productArray.reduce((min, product) => 
    product.totalQuantity < min.totalQuantity ? product : min, productArray[0]);

  // Generate forecasted growth (simple calculation - in real app, use ML algorithms)
  const forecastedGrowth = Math.round(totalSales * 0.35); // 35% growth prediction

  // Generate alerts based on actual data
  const alerts = [];
  productArray.forEach(product => {
    if (product.totalQuantity < 10) {
      alerts.push({
        type: 'critical',
        title: `Critical: ${product.name} Low Stock!`,
        subtitle: 'Lead Time: 5 days',
        units: product.totalQuantity
      });
    } else if (product.totalQuantity > 50) {
      alerts.push({
        type: 'safe',
        title: `Safe: ${product.name} stock level is optimal`,
        subtitle: ''
      });
    }
  });

  // Generate dead stock (products with very low sales)
  const deadStock = productArray
    .filter(product => product.totalQuantity < 5)
    .map(product => ({
      name: product.name,
      status: 'Not in business since',
      value: Math.round(product.totalRevenue)
    }));

  // Top products by demand
  const topProducts = productArray
    .sort((a, b) => b.totalQuantity - a.totalQuantity)
    .slice(0, 5)
    .map(product => ({
      name: product.name,
      demand: product.totalQuantity,
      revenue: Math.round(product.totalRevenue)
    }));

  // Update dashboard stats
  dashboardStats = {
    totalSales: Math.round(totalSales),
    forecastedGrowth,
    bestSellingProduct: bestSelling,
    worstSellingProduct: worstSelling,
    alerts: alerts.slice(0, 5), // Limit to 5 alerts
    deadStock: deadStock.slice(0, 5), // Limit to 5 items
    topProducts,
    lastUpdated: new Date().toISOString()
  };

  console.log('Dashboard stats updated:', dashboardStats);
}

// Simulate real-time updates (in production, this would be triggered by actual events)
setInterval(() => {
  if (salesData.length > 0) {
    // Simulate small changes in inventory data
    const randomIndex = Math.floor(Math.random() * salesData.length);
    const randomProduct = salesData[randomIndex];
    
    // Simulate stock changes (restocking or sales)
    const stockChange = Math.floor(Math.random() * 10) - 5; // Random change -5 to +5
    if (randomProduct.stock !== undefined) {
      randomProduct.stock = Math.max(0, randomProduct.stock + stockChange);
    }
    
    // Simulate new sales
    randomProduct.quantity += Math.floor(Math.random() * 3); // Add 0-2 new sales
    
    updateDashboardStats();
    const inventoryStats = calculateInventoryStats();
    
    // Broadcast updates to all connected clients
    io.emit('dashboardUpdate', dashboardStats);
    io.emit('inventoryUpdate', inventoryStats);
    
    console.log(`Real-time update: ${randomProduct.productName} stock: ${randomProduct.stock}`);
  }
}, 30000); // Update every 30 seconds

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard: http://localhost:3000`);
  console.log(`API: http://localhost:${PORT}`);
});

module.exports = app;