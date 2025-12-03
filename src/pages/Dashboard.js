import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { loading, getDashboardStats, getLowStockProducts, getRecentSales } = useInventory();

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  const stats = getDashboardStats ? getDashboardStats() : {
    totalProducts: 0,
    totalStockValue: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalSalesValue: 0,
    totalPurchaseValue: 0,
    profit: 0,
    customerCount: 0,
    supplierCount: 0
  };

  const lowStockProducts = getLowStockProducts ? getLowStockProducts() : [];
  const recentSales = getRecentSales ? getRecentSales() : [];

  return (
    <div className="dashboard-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card bg-gradient-primary text-white shadow-lg border-0">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <h2 className="card-title mb-1">
                    Welcome back, {currentUser?.name}! 👋
                  </h2>
                  <p className="card-text opacity-75 mb-0">
                    Here's your inventory overview for {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="col-md-4 text-end d-none d-md-block color-black">
                  <div className="badge bg-white bg-opacity-20 text-white px-3 py-2">
                    <i className="bi bi-person-circle me-2"></i>
                    Role: <strong>{currentUser?.role}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Total Products</h6>
                  <h3 className="text-primary mb-0">{stats.totalProducts}</h3>
                  <small className="text-muted">In inventory</small>
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
                  <h6 className="text-muted mb-2">Stock Value</h6>
                  <h3 className="text-success mb-0">${stats.totalStockValue.toLocaleString()}</h3>
                  <small className="text-muted">Total worth</small>
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
                  <h6 className="text-muted mb-2">Low Stock</h6>
                  <h3 className="text-warning mb-0">{stats.lowStockCount}</h3>
                  <small className="text-muted">Need attention</small>
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
                  <h6 className="text-muted mb-2">Total Sales</h6>
                  <h3 className="text-info mb-0">${stats.totalSalesValue.toLocaleString()}</h3>
                  <small className="text-muted">Revenue</small>
                </div>
                <div className="bg-info bg-opacity-10 rounded p-2">
                  <i className="bi bi-cart-check text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-transparent border-0">
              <h5 className="card-title mb-0">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6 col-md-3">
                  <Link to="/products/add" className="card text-decoration-none h-100 border">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-plus-circle display-6 text-success mb-2"></i>
                      <h6 className="card-title mb-1">Add Product</h6>
                      <small className="text-muted">New item</small>
                    </div>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/sales/add" className="card text-decoration-none h-100 border">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-cart-plus display-6 text-primary mb-2"></i>
                      <h6 className="card-title mb-1">New Sale</h6>
                      <small className="text-muted">Create invoice</small>
                    </div>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/products" className="card text-decoration-none h-100 border">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-eye display-6 text-info mb-2"></i>
                      <h6 className="card-title mb-1">View Products</h6>
                      <small className="text-muted">Manage stock</small>
                    </div>
                  </Link>
                </div>
                <div className="col-6 col-md-3">
                  <Link to="/reports" className="card text-decoration-none h-100 border">
                    <div className="card-body text-center p-3">
                      <i className="bi bi-graph-up display-6 text-warning mb-2"></i>
                      <h6 className="card-title mb-1">Reports</h6>
                      <small className="text-muted">View analytics</small>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;