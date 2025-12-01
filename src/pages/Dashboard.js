// src/pages/Dashboard.js - Redesigned
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import ProtectedRoute from '../components/common/ProtectedRoute';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { products, loading } = useInventory();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const stats = {
    totalProducts: products.length,
    lowStock: products.filter(p => p.quantity < 10 && p.quantity > 0).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    inStock: products.filter(p => p.quantity >= 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    categories: [...new Set(products.map(p => p.category))].length
  };

  // Low stock products (top 5)
  const lowStockProducts = products
    .filter(p => p.quantity < 10 && p.quantity > 0)
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  // Out of stock products (top 5)
  const outOfStockProducts = products
    .filter(p => p.quantity === 0)
    .slice(0, 5);

  return (
    <ProtectedRoute>
      <div className="dashboard container-fluid px-3 px-md-4 px-lg-5">
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card bg-gradient-primary text-white shadow-lg border-0">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center mb-3">
                      <div className="welcome-icon bg-white bg-opacity-20 rounded-circle p-3 me-3">
                        <i className="bi bi-person-circle fs-2"></i>
                      </div>
                      <div>
                        <h2 className="card-title mb-1">
                          Welcome back, {currentUser?.name}! 👋
                        </h2>
                        <p className="card-text opacity-75 mb-0">
                          Here's your inventory overview for today
                        </p>
                      </div>
                    </div>
                    <div className="d-flex gap-3 mt-3">
                      <div className="stat-mini bg-white bg-opacity-20 rounded px-3 py-2">
                        <small className="d-block opacity-75">Last Login</small>
                        <strong>{new Date().toLocaleDateString()}</strong>
                      </div>
                      <div className="stat-mini bg-white bg-opacity-20 rounded px-3 py-2">
                        <small className="d-block opacity-75">Active Status</small>
                        <strong><i className="bi bi-circle-fill text-success me-1"></i>Online</strong>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-end d-none d-md-block">
                    <div className="dashboard-illustration">
                      <i className="bi bi-bar-chart-fill display-1 opacity-50"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title text-muted mb-2">Total Products</h6>
                    <h3 className="text-primary mb-0">{stats.totalProducts.toLocaleString()}</h3>
                    <small className="text-muted">Across {stats.categories} categories</small>
                  </div>
                  <div className="bg-primary bg-opacity-10 rounded p-2">
                    <i className="bi bi-box-seam text-primary fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title text-muted mb-2">Inventory Value</h6>
                    <h3 className="text-success mb-0">${stats.totalValue.toLocaleString()}</h3>
                    <small className="text-muted">Total stock value</small>
                  </div>
                  <div className="bg-success bg-opacity-10 rounded p-2">
                    <i className="bi bi-currency-dollar text-success fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title text-muted mb-2">Low Stock</h6>
                    <h3 className="text-warning mb-0">{stats.lowStock}</h3>
                    <small className="text-muted">Need restocking</small>
                  </div>
                  <div className="bg-warning bg-opacity-10 rounded p-2">
                    <i className="bi bi-exclamation-triangle text-warning fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-3 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <h6 className="card-title text-muted mb-2">Out of Stock</h6>
                    <h3 className="text-danger mb-0">{stats.outOfStock}</h3>
                    <small className="text-muted">Urgent attention needed</small>
                  </div>
                  <div className="bg-danger bg-opacity-10 rounded p-2">
                    <i className="bi bi-x-circle text-danger fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Alerts - Two Panels Side by Side */}
        <div className="row mb-4">
          {/* Low Stock Alerts */}
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0 text-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Low Stock Alerts
                </h5>
              </div>
              <div className="card-body">
                {lowStockProducts.length > 0 ? (
                  <>
                    {lowStockProducts.map(product => (
                      <div key={product.id} className="alert alert-warning mb-2 py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{product.name}</strong>
                            <br />
                            <small>Only {product.quantity} left in stock</small>
                          </div>
                          <span className="badge bg-warning">Restock</span>
                        </div>
                      </div>
                    ))}
                    {stats.lowStock > 5 && (
                      <div className="text-center mt-3">
                        <Link to="/products" className="btn btn-sm btn-outline-warning">
                          View All {stats.lowStock} Low Stock Items
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-check-circle display-4 text-success mb-3"></i>
                    <p className="mb-0">All products are well stocked! 🎉</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Out of Stock Alerts */}
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0 text-danger">
                  <i className="bi bi-x-circle me-2"></i>
                  Out of Stock
                </h5>
              </div>
              <div className="card-body">
                {outOfStockProducts.length > 0 ? (
                  <>
                    {outOfStockProducts.map(product => (
                      <div key={product.id} className="alert alert-danger mb-2 py-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <strong>{product.name}</strong>
                            <br />
                            <small className="text-muted">{product.category}</small>
                          </div>
                          <span className="badge bg-danger">0 Stock</span>
                        </div>
                      </div>
                    ))}
                    {stats.outOfStock > 5 && (
                      <div className="text-center mt-3">
                        <Link to="/products" className="btn btn-sm btn-outline-danger">
                          View All {stats.outOfStock} Out of Stock Items
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-muted py-4">
                    <i className="bi bi-check-circle display-4 text-success mb-3"></i>
                    <p className="mb-0">No products are out of stock! ✨</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions - Full Width at Bottom */}
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0">
                  <i className="bi bi-lightning text-warning me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-6 col-md-3">
                    <Link to="/products" className="card action-card text-decoration-none h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-plus-circle display-6 text-success mb-2"></i>
                        <h6 className="card-title mb-1">Add Product</h6>
                        <small className="text-muted">Single product</small>
                      </div>
                    </Link>
                  </div>
                  <div className="col-6 col-md-3">
                    <Link to="/products" className="card action-card text-decoration-none h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-file-earmark-spreadsheet display-6 text-info mb-2"></i>
                        <h6 className="card-title mb-1">Bulk Import</h6>
                        <small className="text-muted">CSV/Excel file</small>
                      </div>
                    </Link>
                  </div>
                  <div className="col-6 col-md-3">
                    <Link to="/products" className="card action-card text-decoration-none h-100">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-eye display-6 text-primary mb-2"></i>
                        <h6 className="card-title mb-1">View Products</h6>
                        <small className="text-muted">Manage inventory</small>
                      </div>
                    </Link>
                  </div>
                  {currentUser?.role === 'superadmin' && (
                    <div className="col-6 col-md-3">
                      <Link to="/admin" className="card action-card text-decoration-none h-100">
                        <div className="card-body text-center p-3">
                          <i className="bi bi-people display-6 text-purple mb-2"></i>
                          <h6 className="card-title mb-1">Admin Panel</h6>
                          <small className="text-muted">User management</small>
                        </div>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;