// components/common/Header.js
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Login from '../auth/Login';

const Header = ({ currentPage, setCurrentPage }) => {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <Login />;
  }

  return (
    <header className="header">
      <div className="container">
        <h2>Inventory Manager</h2>
        <nav>
          <span 
            className={currentPage === 'dashboard' ? 'active' : ''}
            onClick={() => setCurrentPage('dashboard')}
          >
            Dashboard
          </span>
          <span 
            className={currentPage === 'inventory' ? 'active' : ''}
            onClick={() => setCurrentPage('inventory')}
          >
            Products
          </span>
          {currentUser?.role === 'superadmin' && (
            <span 
              className={currentPage === 'admin' ? 'active' : ''}
              onClick={() => setCurrentPage('admin')}
            >
              Admin Panel
            </span>
          )}
          <span>Reports</span>
        </nav>
        <div className="user-info">
          <span>Welcome, {currentUser?.name}</span>
          <span className="user-role">({currentUser?.role})</span>
          <button className="btn btn-outline" onClick={logout}>Logout</button>
        </div>
      </div>
    </header>
  );
};

export default Header;