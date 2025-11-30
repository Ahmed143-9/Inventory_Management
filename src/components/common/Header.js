// src/components/common/Header.js
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) {
    return null;
  }

  return (
    <header className="header">
      <div className="container">
        <h2>Inventory Manager</h2>
        <nav>
          <Link 
            to="/dashboard" 
            className={location.pathname === '/dashboard' ? 'active' : ''}
          >
            Dashboard
          </Link>
          <Link 
            to="/products" 
            className={location.pathname === '/products' ? 'active' : ''}
          >
            Products
          </Link>
          {currentUser?.role === 'superadmin' && (
            <Link 
              to="/admin" 
              className={location.pathname === '/admin' ? 'active' : ''}
            >
              Admin Panel
            </Link>
          )}
        </nav>
        <div className="user-info">
          <span>Welcome, {currentUser?.name}</span>
          <span className="user-role">({currentUser?.role})</span>
          <button className="btn btn-outline" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;