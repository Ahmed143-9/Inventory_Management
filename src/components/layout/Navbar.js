import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null; // Don't show navbar on login page
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/dashboard">
          <i className="bi bi-building-gear me-2"></i>
          Hardware Inventory
        </Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/dashboard">
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Link>
            </li>
            
            <li className="nav-item dropdown">
              <button 
                className="btn btn-link nav-link dropdown-toggle d-flex align-items-center"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className="user-avatar bg-white rounded-circle me-2 d-flex align-items-center justify-content-center"
                     style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-person text-primary"></i>
                </div>
                <span>{currentUser.name}</span>
              </button>
              
              {showUserMenu && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ position: 'absolute', right: 0 }}>
                  <div className="dropdown-header">
                    <strong>{currentUser.name}</strong>
                    <small className="d-block text-muted">{currentUser.email}</small>
                    <span className={`badge bg-${currentUser.role === 'superadmin' ? 'danger' : 'primary'} mt-1`}>
                      {currentUser.role}
                    </span>
                  </div>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </Link>
                  {currentUser.role === 'superadmin' && (
                    <Link className="dropdown-item" to="/admin">
                      <i className="bi bi-shield-lock me-2"></i>
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
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;