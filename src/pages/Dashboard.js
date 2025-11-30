// pages/Dashboard.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import ProtectedRoute from '../components/common/ProtectedRoute';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { products } = useInventory();

  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.quantity < 10 && p.quantity > 0).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0)
  };

  return (
    <ProtectedRoute>
      <div className="dashboard">
        <h2>Dashboard</h2>
        <p>Welcome back, {currentUser?.name}!</p>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-number">{stats.totalProducts}</p>
          </div>
          <div className="stat-card">
            <h3>Low Stock</h3>
            <p className="stat-number warning">{stats.lowStock}</p>
          </div>
          <div className="stat-card">
            <h3>Out of Stock</h3>
            <p className="stat-number danger">{stats.outOfStock}</p>
          </div>
          <div className="stat-card">
            <h3>Total Value</h3>
            <p className="stat-number">${stats.totalValue.toFixed(2)}</p>
          </div>
        </div>

        <div className="recent-products">
          <h3>Recent Products</h3>
          {products.slice(0, 5).map(product => (
            <div key={product.id} className="product-item">
              <span>{product.name}</span>
              <span>Qty: {product.quantity}</span>
              <span>${product.price}</span>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;