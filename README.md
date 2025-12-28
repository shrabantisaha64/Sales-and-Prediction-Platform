# Sales & Demand Prediction Platform

A full-stack business analytics platform for grocery stores with real-time inventory management, sales forecasting, and AI-powered insights.

## 🏗️ Project Structure

```
sales-prediction-platform/
├── frontend/                 # React Frontend Application
│   ├── src/
│   │   ├── components/       # React Components
│   │   │   ├── Dashboard.js  # Main Dashboard
│   │   │   ├── Inventory.js  # Inventory Management
│   │   │   ├── Alerts.js     # Stock Alerts
│   │   │   ├── SalesAnalytics.js # Sales Analytics
│   │   │   ├── Forecasting.js    # AI Forecasting
│   │   │   └── Settings.js   # System Settings
│   │   ├── services/         # API Services
│   │   │   └── api.js        # Backend API Integration
│   │   └── styles/           # CSS Stylesheets
│   ├── public/               # Static Assets
│   ├── package.json          # Frontend Dependencies
│   └── package-lock.json
│
├── backend/                  # Node.js Backend Server
│   ├── src/
│   │   └── server.js         # Express Server & Socket.io
│   ├── data/                 # Sample Data Files
│   │   ├── sample-sales-data.csv
│   │   └── sample-clothing-data.csv
│   ├── uploads/              # CSV Upload Directory
│   ├── package.json          # Backend Dependencies
│   └── package-lock.json
│
└── README.md                 # Project Documentation
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sales-prediction-platform
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   npm start
   ```
   Backend will run on: http://localhost:5000

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm start
   ```
   Frontend will run on: http://localhost:3000

### 🔧 Quick Test
After setup, you can test the system:
- Backend API: http://localhost:5000/api/dashboard
- Frontend App: http://localhost:3000
- Real-time updates work automatically via WebSocket

## 📊 Features

### 🔐 Authentication
- **Login**: Demo mode - any email/password combination works
- **Session Management**: User session maintained until logout
- **Logout**: Click logout button in sidebar to return to login page
- **Auto-disconnect**: WebSocket connections automatically closed on logout

### 🏠 Dashboard
- Real-time business analytics
- Revenue tracking and forecasting
- Best/worst selling products
- Interactive sales performance charts
- AI assistant for business insights

### 📦 Inventory Management
- Product stock tracking
- Low stock alerts
- Reorder level management
- Category-wise organization
- Real-time inventory updates

### 🚨 Alerts System
- Critical stock alerts
- Low stock warnings
- Dead stock detection
- Real-time notifications

### 📈 Sales Analytics
- Detailed sales performance analysis
- Category-wise revenue breakdown
- Top products ranking
- Growth indicators

### 📊 Forecasting
- AI-powered demand prediction
- Revenue forecasting
- Seasonal trend analysis
- Confidence level indicators

### ⚙️ Settings
- Business configuration
- Notification preferences
- Inventory settings
- System configuration

## 🛠️ Technology Stack

### Frontend
- **React.js** - UI Framework
- **CSS3** - Styling & Responsive Design
- **Socket.io Client** - Real-time Updates
- **Axios** - HTTP Client

### Backend
- **Node.js** - Runtime Environment
- **Express.js** - Web Framework
- **Socket.io** - Real-time Communication
- **Multer** - File Upload Handling
- **CSV-Parser** - Data Processing

## 📱 Responsive Design

- **Desktop**: Full sidebar navigation with all features
- **Tablet**: Collapsible sidebar with optimized layout
- **Mobile**: Hamburger menu with touch-friendly interface

## 🔄 Real-time Features

- Live inventory updates every 30 seconds
- WebSocket-based real-time communication
- Instant CSV data processing
- Live dashboard statistics

## 📈 Business Intelligence

- Revenue forecasting with 87% confidence
- Demand prediction algorithms
- Stock optimization recommendations
- Seasonal trend analysis
- Dead stock detection

## 🎯 Use Cases

- **Grocery Stores**: Inventory and sales management
- **Retail Businesses**: Product performance tracking
- **Small Businesses**: Business analytics and forecasting
- **Any Product-based Business**: Universal CSV data support

## 🔧 Development

### Backend Development
```bash
cd backend
npm run dev  # Development mode with auto-restart
```

### Frontend Development
```bash
cd frontend
npm start    # Development mode with hot reload
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please open an issue in the repository.