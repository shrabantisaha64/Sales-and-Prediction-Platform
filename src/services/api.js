import axios from 'axios';
import io from 'socket.io-client';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Socket.io connection
let socket = null;

export const connectSocket = () => {
  if (!socket) {
    socket = io('http://localhost:5000');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

// API functions
export const businessAPI = {
  save: (data) => api.post('/business', data),
};

export const productsAPI = {
  add: (data) => api.post('/products', data),
  getAll: () => api.get('/products'),
};

export const salesAPI = {
  uploadCSV: (file) => {
    const formData = new FormData();
    formData.append('csvFile', file);
    return api.post('/upload-csv', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  getAll: () => api.get('/sales'),
};

export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
};

export const inventoryAPI = {
  getData: () => api.get('/inventory'),
};

export default api;