// src/pages/AdminPanel.js - Fixed & Professional
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import ProtectedRoute from '../components/common/ProtectedRoute';

const AdminPanel = () => {
  const { currentUser, users, addUser, deleteUser, updateUserPassword } = useAuth();
  const { products } = useInventory();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [passwordData, setPasswordData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);

  // Calculate stats
  const stats = {
    totalUsers: users.length,
    totalProducts: products.length,
    lowStock: products.filter(p => p.quantity < 10 && p.quantity > 0).length,
    outOfStock: products.filter(p => p.quantity === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
    superAdmins: users.filter(u => u.role === 'superadmin').length,
    managers: users.filter(u => u.role === 'manager').length,
    regularUsers: users.filter(u => u.role === 'user').length
  };

  // Report filters and data
  const [reportFilters, setReportFilters] = useState({
    dateRange: 'all',
    category: 'all',
    stockStatus: 'all'
  });

  const handleAddUser = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setMessage('All fields are required');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const result = addUser(formData);
    
    if (result.success) {
      setMessage('User added successfully!');
      setShowAddUserModal(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDeleteUser = (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete "${userName}"?`)) {
      const result = deleteUser(userId);
      if (result.success) {
        setMessage('User deleted successfully!');
      } else {
        setMessage(result.message);
      }
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handlePasswordChange = (user) => {
    setSelectedUser(user);
    setPasswordData({ newPassword: '', confirmPassword: '' });
    setShowPasswordModal(true);
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Passwords do not match');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const result = updateUserPassword(selectedUser.id, passwordData.newPassword);
    
    if (result.success) {
      setMessage('Password updated successfully!');
      setShowPasswordModal(false);
      setSelectedUser(null);
      setPasswordData({ newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'superadmin': return 'bg-danger';
      case 'manager': return 'bg-info';
      case 'user': return 'bg-primary';
      default: return 'bg-secondary';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'superadmin': return 'bi-shield-fill-check';
      case 'manager': return 'bi-person-badge';
      case 'user': return 'bi-person';
      default: return 'bi-person';
    }
  };

  // Generate report data based on filters
  const generateReportData = () => {
    let filteredProducts = [...products];

    // Apply date range filter (simplified - in real app you'd have createdAt dates)
    if (reportFilters.dateRange === 'last7days') {
      // Filter logic for last 7 days
    } else if (reportFilters.dateRange === 'last30days') {
      // Filter logic for last 30 days
    }

    // Apply category filter
    if (reportFilters.category !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.category === reportFilters.category);
    }

    // Apply stock status filter
    if (reportFilters.stockStatus === 'low') {
      filteredProducts = filteredProducts.filter(p => p.quantity < 10 && p.quantity > 0);
    } else if (reportFilters.stockStatus === 'out') {
      filteredProducts = filteredProducts.filter(p => p.quantity === 0);
    } else if (reportFilters.stockStatus === 'healthy') {
      filteredProducts = filteredProducts.filter(p => p.quantity >= 10);
    }

    const reportStats = {
      totalItems: filteredProducts.length,
      totalValue: filteredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0),
      lowStockCount: filteredProducts.filter(p => p.quantity < 10 && p.quantity > 0).length,
      outOfStockCount: filteredProducts.filter(p => p.quantity === 0).length,
      categories: [...new Set(filteredProducts.map(p => p.category))].length,
      averagePrice: filteredProducts.length > 0 
        ? filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length 
        : 0
    };

    return reportStats;
  };

  const reportData = generateReportData();
  const categories = [...new Set(products.map(p => p.category))];

  return (
    <ProtectedRoute adminOnly={true}>
      <div className="admin-panel container-fluid px-3 px-md-4 px-lg-5">
        {/* Header */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card bg-gradient-primary text-white shadow-lg border-0">
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <div className="d-flex align-items-center">
                      <div className="admin-icon bg-white bg-opacity-20 rounded-circle p-3 me-3">
                        <i className="bi bi-shield-lock-fill fs-2"></i>
                      </div>
                      <div>
                        <h2 className="card-title mb-1">Admin Control Panel</h2>
                        <p className="card-text opacity-75 mb-0">
                          Manage users, monitor system, and control access
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-end d-none d-md-block">
                    <div className="badge bg-white bg-opacity-20 text-white px-3 py-2">
                      <i className="bi bi-person-circle me-2"></i>
                      Logged in as: <strong>{currentUser?.name}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message && (
          <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
            <i className={`bi ${message.includes('success') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
            {message}
            <button type="button" className="btn-close" onClick={() => setMessage('')}></button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-2">
                <ul className="nav nav-pills nav-fill">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Dashboard
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                      onClick={() => setActiveTab('users')}
                    >
                      <i className="bi bi-people me-2"></i>
                      User Management
                      <span className="badge bg-primary ms-2">{users.length}</span>
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${activeTab === 'reports' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reports')}
                    >
                      <i className="bi bi-bar-chart me-2"></i>
                      Reports & Analytics
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="tab-pane fade show active">
              <div className="row">
                {/* System Stats */}
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="text-muted mb-2">Total Users</h6>
                          <h3 className="text-primary mb-0">{stats.totalUsers}</h3>
                          <small className="text-muted">Registered users</small>
                        </div>
                        <div className="bg-primary bg-opacity-10 rounded p-2">
                          <i className="bi bi-people text-primary fs-4"></i>
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
                          <h6 className="text-muted mb-2">Total Products</h6>
                          <h3 className="text-success mb-0">{stats.totalProducts}</h3>
                          <small className="text-muted">In inventory</small>
                        </div>
                        <div className="bg-success bg-opacity-10 rounded p-2">
                          <i className="bi bi-box-seam text-success fs-4"></i>
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
                          <h6 className="text-muted mb-2">Inventory Value</h6>
                          <h3 className="text-info mb-0">${stats.totalValue.toLocaleString()}</h3>
                          <small className="text-muted">Total worth</small>
                        </div>
                        <div className="bg-info bg-opacity-10 rounded p-2">
                          <i className="bi bi-currency-dollar text-info fs-4"></i>
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
                          <h6 className="text-muted mb-2">Stock Alerts</h6>
                          <h3 className="text-warning mb-0">{stats.lowStock + stats.outOfStock}</h3>
                          <small className="text-muted">Need attention</small>
                        </div>
                        <div className="bg-warning bg-opacity-10 rounded p-2">
                          <i className="bi bi-exclamation-triangle text-warning fs-4"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* User Role Distribution - FIXED */}
              <div className="row mt-4">
  <div className="col-md-12">
    <div className="card border-0 shadow-sm">
      <div className="card-header bg-transparent border-0">
        <h5 className="mb-0 text-dark">
          <i className="bi bi-pie-chart me-2"></i>
          User Role Distribution
        </h5>
      </div>
      <div className="card-body">
        <div className="row text-center">
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-danger bg-opacity-10 rounded h-100">
              <i className="bi bi-shield-fill-check text-danger fs-1"></i>
              <h3 className="text-danger mt-2">{stats.superAdmins}</h3>
              <p className="text-dark mb-0 checking" style={{ color: "black" }}>
  Super Admins
</p>

              <small className="text-dark">
                {stats.totalUsers > 0 ? Math.round((stats.superAdmins / stats.totalUsers) * 100) : 0}% of total
              </small>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-info bg-opacity-10 rounded h-100">
              <i className="bi bi-person-badge text-info fs-1"></i>
              <h3 className="text-info mt-2">{stats.managers}</h3>
              <p className="text-dark mb-0">Managers</p>
              <small className="text-dark">
                {stats.totalUsers > 0 ? Math.round((stats.managers / stats.totalUsers) * 100) : 0}% of total
              </small>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="p-3 bg-primary bg-opacity-10 rounded h-100">
              <i className="bi bi-person text-primary fs-1"></i>
              <h3 className="text-primary mt-2">{stats.regularUsers}</h3>
              <p className="text-dark mb-0">Regular Users</p>
              <small className="text-dark">
                {stats.totalUsers > 0 ? Math.round((stats.regularUsers / stats.totalUsers) * 100) : 0}% of total
              </small>
            </div>
          </div>
        </div>
        
        {/* Progress Bar Visualization */}
        <div className="mt-4">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-dark">Role Distribution</small>
            <small className="text-dark">{stats.totalUsers} Total Users</small>
          </div>
          <div className="progress" style={{height: '20px'}}>
            <div 
              className="progress-bar bg-danger" 
              style={{width: `${stats.totalUsers > 0 ? (stats.superAdmins / stats.totalUsers) * 100 : 0}%`}}
              title={`Super Admins: ${stats.superAdmins}`}
            >
              {stats.superAdmins > 0 && 'Super Admins'}
            </div>
            <div 
              className="progress-bar bg-info" 
              style={{width: `${stats.totalUsers > 0 ? (stats.managers / stats.totalUsers) * 100 : 0}%`}}
              title={`Managers: ${stats.managers}`}
            >
              {stats.managers > 0 && 'Managers'}
            </div>
            <div 
              className="progress-bar bg-primary" 
              style={{width: `${stats.totalUsers > 0 ? (stats.regularUsers / stats.totalUsers) * 100 : 0}%`}}
              title={`Users: ${stats.regularUsers}`}
            >
              {stats.regularUsers > 0 && 'Users'}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="tab-pane fade show active">
              <div className="card border-0 shadow-sm">
                <div className="card-header bg-transparent border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">
                      <i className="bi bi-people me-2"></i>
                      User Management
                    </h5>
                    <button 
                      className="btn btn-primary"
                      onClick={() => setShowAddUserModal(true)}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add New User
                    </button>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>User</th>
                          <th>Email</th>
                          <th>Role</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(user => (
                          <tr key={user.id}>
                            <td>
                              <span className="badge bg-secondary">#{user.id}</span>
                            </td>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="user-avatar-sm bg-primary bg-opacity-10 rounded-circle me-2 d-flex align-items-center justify-content-center"
                                     style={{width: '35px', height: '35px'}}>
                                  <i className={`bi ${getRoleIcon(user.role)} text-primary`}></i>
                                </div>
                                <div>
                                  <strong>{user.name}</strong>
                                  {user.id === currentUser.id && (
                                    <span className="badge bg-success ms-2">You</span>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="text-black">{user.email}</td>
                            <td>
                              <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                <i className={`bi ${getRoleIcon(user.role)} me-1`}></i>
                                {user.role}
                              </span>
                            </td>
                            <td className="text-black">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              <div className="btn-group">
                                <button 
                                  className="btn btn-outline-primary btn-sm"
                                  onClick={() => handlePasswordChange(user)}
                                  title="Change Password"
                                >
                                  <i className="bi bi-key"></i>
                                </button>
                                {user.id !== currentUser.id ? (
                                  <button 
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteUser(user.id, user.name)}
                                  >
                                    <i className="bi bi-trash me-1"></i>
                                    Delete
                                  </button>
                                ) : (
                                  <span className="badge bg-success ms-2">Current User</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reports Tab - ENHANCED */}
          {activeTab === 'reports' && (
            <div className="tab-pane fade show active">
              {/* Report Filters */}
              <div className="row mb-4">
                <div className="col-md-12">
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0">
                      <h5 className="mb-0">
                        <i className="bi bi-funnel me-2"></i>
                        Report Filters
                      </h5>
                    </div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Date Range</label>
                          <select 
                            className="form-select"
                            value={reportFilters.dateRange}
                            onChange={(e) => setReportFilters({...reportFilters, dateRange: e.target.value})}
                          >
                            <option value="all">All Time</option>
                            <option value="last7days">Last 7 Days</option>
                            <option value="last30days">Last 30 Days</option>
                            <option value="last90days">Last 90 Days</option>
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Category</label>
                          <select 
                            className="form-select"
                            value={reportFilters.category}
                            onChange={(e) => setReportFilters({...reportFilters, category: e.target.value})}
                          >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label fw-semibold">Stock Status</label>
                          <select 
                            className="form-select"
                            value={reportFilters.stockStatus}
                            onChange={(e) => setReportFilters({...reportFilters, stockStatus: e.target.value})}
                          >
                            <option value="all">All Stock Status</option>
                            <option value="healthy">Healthy Stock (10+)</option>
                            <option value="low">Low Stock (1-9)</option>
                            <option value="out">Out of Stock</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Summary */}
              <div className="row mb-4">
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-box-seam display-4 text-primary mb-3"></i>
                      <h3>{reportData.totalItems}</h3>
                      <p className="text-muted mb-0">Filtered Items</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-currency-dollar display-4 text-success mb-3"></i>
                      <h3>${reportData.totalValue.toLocaleString()}</h3>
                      <p className="text-muted mb-0">Total Value</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-exclamation-triangle display-4 text-warning mb-3"></i>
                      <h3>{reportData.lowStockCount}</h3>
                      <p className="text-muted mb-0">Low Stock Items</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body text-center">
                      <i className="bi bi-x-circle display-4 text-danger mb-3"></i>
                      <h3>{reportData.outOfStockCount}</h3>
                      <p className="text-muted mb-0">Out of Stock</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Report Data */}
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0">
                      <h6 className="mb-0">
                        <i className="bi bi-graph-up me-2"></i>
                        Inventory Overview
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="list-group list-group-flush">
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <span>Categories in Filter</span>
                          <span className="badge bg-primary rounded-pill">{reportData.categories}</span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <span>Average Price</span>
                          <span className="badge bg-info rounded-pill">${reportData.averagePrice.toFixed(2)}</span>
                        </div>
                        <div className="list-group-item d-flex justify-content-between align-items-center">
                          <span>Stock Health</span>
                          <span className={`badge ${reportData.outOfStockCount > 0 ? 'bg-warning' : 'bg-success'} rounded-pill`}>
                            {reportData.outOfStockCount > 0 ? 'Needs Attention' : 'Healthy'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-transparent border-0">
                      <h6 className="mb-0">
                        <i className="bi bi-lightning me-2"></i>
                        Quick Actions
                      </h6>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        <button className="btn btn-outline-primary">
                          <i className="bi bi-download me-2"></i>
                          Export Report as CSV
                        </button>
                        <button className="btn btn-outline-success">
                          <i className="bi bi-printer me-2"></i>
                          Print Report
                        </button>
                        <button className="btn btn-outline-info">
                          <i className="bi bi-envelope me-2"></i>
                          Email Report
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add User Modal */}
        {showAddUserModal && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-person-plus me-2"></i>
                    Add New User
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowAddUserModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleAddUser}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Full Name *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-person"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter full name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Email Address *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-envelope"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Enter email address"
                          value={formData.email}
                          onChange={(e) => setFormData({...formData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Password *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter password"
                          value={formData.password}
                          onChange={(e) => setFormData({...formData, password: e.target.value})}
                          required
                        />
                        <button 
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                      <small className="text-muted">Password must be at least 6 characters long</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">User Role *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-shield"></i>
                        </span>
                        <select
                          className="form-select"
                          value={formData.role}
                          onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                          <option value="user">User - Basic Access</option>
                          <option value="manager">Manager - Advanced Access</option>
                          <option value="superadmin">Super Admin - Full Access</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowAddUserModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-circle me-2"></i>
                      Create User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showPasswordModal && selectedUser && (
          <div className="modal fade show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    <i className="bi bi-key me-2"></i>
                    Change Password for {selectedUser.name}
                  </h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setShowPasswordModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleUpdatePassword}>
                  <div className="modal-body">
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      Set a new password for this user. They will need to use this password to login.
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label fw-semibold">New Password *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-lock"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Enter new password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                          required
                        />
                        <button 
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Confirm Password *</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-lock-fill"></i>
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          placeholder="Confirm new password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button 
                      type="button" 
                      className="btn btn-secondary"
                      onClick={() => setShowPasswordModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      <i className="bi bi-check-circle me-2"></i>
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminPanel;