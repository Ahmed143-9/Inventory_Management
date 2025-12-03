// src/components/common/Header.js - BLACK TEXT VERSION
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container-fluid px-3 px-lg-5">
        {/* Brand/Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/dashboard">
          <div className="brand-icon bg-primary bg-opacity-10 rounded me-2 p-2">
            <i className="bi bi-boxes text-primary fs-4"></i>
          </div>
          <div className="brand-text">
            <div className="fw-bold fs-5 lh-1 text-dark">Inventory Management</div>
            <small className="text-muted d-none d-md-block" style={{fontSize: '0.7rem'}}>
              Professional Stock Control System
            </small>
          </div>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          {/* Main Navigation */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link 
                to="/dashboard" 
                className={`nav-link px-3 text-dark fw-semibold ${isActive('/dashboard') ? 'active bg-primary bg-opacity-10 rounded' : ''}`}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Dashboard
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                to="/products" 
                className={`nav-link px-3 text-dark fw-semibold ${isActive('/products') ? 'active bg-primary bg-opacity-10 rounded' : ''}`}
              >
                <i className="bi bi-box-seam me-2"></i>
                Products
              </Link>
            </li>
            {currentUser?.role === 'superadmin' && (
              <li className="nav-item">
                <Link 
                  to="/admin" 
                  className={`nav-link px-3 text-dark fw-semibold ${isActive('/admin') ? 'active bg-primary bg-opacity-10 rounded' : ''}`}
                >
                  <i className="bi bi-shield-check me-2"></i>
                  Admin Panel
                </Link>
              </li>
            )}
          </ul>

          {/* User Section */}
          <div className="d-flex align-items-center">
            {/* User Info Dropdown */}
            <div className="dropdown">
              <button 
                className="btn btn-link text-dark text-decoration-none dropdown-toggle d-flex align-items-center"
                onClick={() => setShowUserMenu(!showUserMenu)}
                onBlur={() => setTimeout(() => setShowUserMenu(false), 200)}
              >
                <div className="user-avatar bg-primary bg-opacity-10 rounded-circle me-2 d-flex align-items-center justify-content-center"
                     style={{width: '40px', height: '40px'}}>
                  <i className="bi bi-person-fill text-primary fs-5"></i>
                </div>
                <div className="text-start d-none d-lg-block">
                  <div className="fw-semibold small text-dark">{currentUser?.name}</div>
                  <div className="text-muted" style={{fontSize: '0.7rem'}}>
                    {currentUser?.role === 'superadmin' ? 'Super Admin' : 
                     currentUser?.role === 'manager' ? 'Manager' : 'User'}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="dropdown-menu dropdown-menu-end show" style={{minWidth: '200px'}}>
                  <div className="dropdown-header">
                    <div className="fw-bold">{currentUser?.name}</div>
                    <small className="text-muted">{currentUser?.email}</small>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item text-dark" to="/dashboard">
                    <i className="bi bi-speedometer2 me-2"></i>
                    Dashboard
                  </Link>
                  <Link className="dropdown-item" to="/products">
                    <i className="bi bi-box-seam me-2"></i>
                    Products
                  </Link>
                  {currentUser?.role === 'superadmin' && (
                    <Link className="dropdown-item" to="/admin">
                      <i className="bi bi-shield-check me-2"></i>
                      Admin Panel
                    </Link>
                  )}
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;