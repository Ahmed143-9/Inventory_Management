// src/pages/Dashboard.js
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

  // Recent products (last 5 added/modified)
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 5);

  // Low stock alert products
  const lowStockProducts = products.filter(p => p.quantity < 10 && p.quantity > 0).slice(0, 3);

  return (
    <ProtectedRoute>
      <div className="dashboard">
        {/* Welcome Header */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card bg-gradient-primary text-white shadow">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="card-title mb-2">
                      Welcome back, {currentUser?.name}! 👋
                    </h2>
                    <p className="card-text opacity-75 mb-0">
                      Here's what's happening with your inventory today.
                    </p>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="bg-white bg-opacity-20 rounded p-3 d-inline-block">
                      <i className="bi bi-graph-up-arrow display-6"></i>
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
                    <h3 className="text-primary mb-0">{stats.totalProducts}</h3>
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

        <div className="row">
          {/* Quick Actions */}
          <div className="col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-transparent border-0 pb-0">
                <h5 className="card-title mb-0">
                  <i className="bi bi-lightning text-warning me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div className="card-body">
                <div className="row g-3">
                  <div className="col-md-6">
                    <Link to="/products" className="card action-card text-decoration-none">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-plus-circle display-6 text-success mb-2"></i>
                        <h6 className="card-title mb-1">Add Product</h6>
                        <small className="text-muted">Single product</small>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/products" className="card action-card text-decoration-none">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-file-earmark-spreadsheet display-6 text-info mb-2"></i>
                        <h6 className="card-title mb-1">Bulk Import</h6>
                        <small className="text-muted">CSV/Excel file</small>
                      </div>
                    </Link>
                  </div>
                  <div className="col-md-6">
                    <Link to="/products" className="card action-card text-decoration-none">
                      <div className="card-body text-center p-3">
                        <i className="bi bi-eye display-6 text-primary mb-2"></i>
                        <h6 className="card-title mb-1">View Products</h6>
                        <small className="text-muted">Manage inventory</small>
                      </div>
                    </Link>
                  </div>
                  {currentUser?.role === 'superadmin' && (
                    <div className="col-md-6">
                      <Link to="/admin" className="card action-card text-decoration-none">
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

          {/* Low Stock Alerts */}
          {lowStockProducts.length > 0 && (
            <div className="col-md-6 mb-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-transparent border-0 pb-0">
                  <h5 className="card-title mb-0 text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Low Stock Alerts
                  </h5>
                </div>
                <div className="card-body">
                  {lowStockProducts.map(product => (
                    <div key={product.id} className="alert alert-warning alert-dismissible fade show mb-2">
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
                  {lowStockProducts.length === 0 && (
                    <div className="text-center text-muted py-4">
                      <i className="bi bi-check-circle display-4 text-success mb-3"></i>
                      <p className="mb-0">All products are well stocked! 🎉</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="row">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-transparent border-0">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">
                    <i className="bi bi-clock-history text-primary me-2"></i>
                    Recent Products
                  </h5>
                  <Link to="/products" className="btn btn-sm btn-outline-primary">
                    View All
                  </Link>
                </div>
              </div>
              <div className="card-body">
                {recentProducts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Category</th>
                          <th>Quantity</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentProducts.map(product => (
                          <tr key={product.id}>
                            <td>
                              <div>
                                <strong>{product.name}</strong>
                                <br />
                                <small className="text-muted">{product.description}</small>
                              </div>
                            </td>
                            <td>
                              <span className="badge bg-secondary">{product.category}</span>
                            </td>
                            <td>
                              <span className={`badge ${
                                product.quantity === 0 ? 'bg-danger' : 
                                product.quantity < 10 ? 'bg-warning' : 'bg-success'
                              }`}>
                                {product.quantity}
                              </span>
                            </td>
                            <td>
                              <strong>${product.price}</strong>
                            </td>
                            <td>
                              <span className={`badge ${
                                product.quantity === 0 ? 'bg-danger' : 
                                product.quantity < 10 ? 'bg-warning' : 'bg-success'
                              }`}>
                                {product.quantity === 0 ? 'Out of Stock' : 
                                 product.quantity < 10 ? 'Low Stock' : 'In Stock'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="bi bi-inbox display-1 text-muted mb-3"></i>
                    <h5 className="text-muted">No products yet</h5>
                    <p className="text-muted mb-4">Start by adding your first product to the inventory.</p>
                    <Link to="/products" className="btn btn-primary">
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Your First Product
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;