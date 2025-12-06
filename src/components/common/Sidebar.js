import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav id="sidebar" className="bg-dark text-white">
      <div className="sidebar-header p-3 border-bottom border-secondary">
        <h4>
          <i className="bi bi-box-seam me-2"></i>
          Inventory System
        </h4>
      </div>

      <ul className="list-unstyled components p-2">
        <li className="mb-1">
          <Link 
            to="/dashboard" 
            className={`nav-link text-white ${isActive('/dashboard') ? 'active' : ''}`}
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Dashboard
          </Link>
        </li>

        <li className="mb-1">
          <Link 
            to="/products" 
            className={`nav-link text-white ${isActive('/products') ? 'active' : ''}`}
          >
            <i className="bi bi-boxes me-2"></i>
            Products
          </Link>
        </li>

        <li className="mb-1">
          <Link 
            to="/products/add" 
            className={`nav-link text-white ${isActive('/products/add') ? 'active' : ''}`}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Product
          </Link>
        </li>

        <li className="mb-1">
          <Link 
            to="/excel-import" 
            className={`nav-link text-white ${isActive('/excel-import') ? 'active' : ''}`}
          >
            <i className="bi bi-file-earmark-spreadsheet me-2"></i>
            Excel Import
          </Link>
        </li>

        <li className="mb-1">
          <Link 
            to="/data/import-export" 
            className={`nav-link text-white ${isActive('/data/import-export') ? 'active' : ''}`}
          >
            <i className="bi bi-arrow-down-up me-2"></i>
            Import/Export
          </Link>
        </li>

        <li className="mb-1">
          <Link 
            to="/documents" 
            className={`nav-link text-white ${isActive('/documents') ? 'active' : ''}`}
          >
            <i className="bi bi-file-earmark-text me-2"></i>
            Documents
          </Link>
        </li>

        <li className="mb-1">
          <Link 
            to="/reports" 
            className={`nav-link text-white ${isActive('/reports') ? 'active' : ''}`}
          >
            <i className="bi bi-bar-chart me-2"></i>
            Reports
          </Link>
        </li>

        <li className="mb-1">
          <a 
            href="#reportSubmenu" 
            data-bs-toggle="collapse" 
            aria-expanded="false" 
            className="nav-link text-white dropdown-toggle"
          >
            <i className="bi bi-journal-text me-2"></i>
            Detailed Reports
          </a>
          <ul className="collapse list-unstyled" id="reportSubmenu">
            <li>
              <Link 
                to="/reports/stock" 
                className={`nav-link text-white ms-4 ${isActive('/reports/stock') ? 'active' : ''}`}
              >
                <i className="bi bi-inboxes me-2"></i>
                Stock Report
              </Link>
            </li>
            <li>
              <Link 
                to="/reports/profit-loss" 
                className={`nav-link text-white ms-4 ${isActive('/reports/profit-loss') ? 'active' : ''}`}
              >
                <i className="bi bi-currency-dollar me-2"></i>
                Profit/Loss Report
              </Link>
            </li>
            <li>
              <Link 
                to="/reports/purchases" 
                className={`nav-link text-white ms-4 ${isActive('/reports/purchases') ? 'active' : ''}`}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Purchase Report
              </Link>
            </li>
            <li>
              <Link 
                to="/reports/sales" 
                className={`nav-link text-white ms-4 ${isActive('/reports/sales') ? 'active' : ''}`}
              >
                <i className="bi bi-currency-exchange me-2"></i>
                Sales Report
              </Link>
            </li>
          </ul>
        </li>

        {user && user.role === 'admin' && (
          <li className="mb-1">
            <Link 
              to="/admin" 
              className={`nav-link text-white ${isActive('/admin') ? 'active' : ''}`}
            >
              <i className="bi bi-shield-lock me-2"></i>
              Admin Panel
            </Link>
          </li>
        )}

        <li className="mb-1">
          <Link 
            to="/profile" 
            className={`nav-link text-white ${isActive('/profile') ? 'active' : ''}`}
          >
            <i className="bi bi-person-circle me-2"></i>
            Profile
          </Link>
        </li>

        <li className="mb-1">
          <Link 
            to="/settings" 
            className={`nav-link text-white ${isActive('/settings') ? 'active' : ''}`}
          >
            <i className="bi bi-gear me-2"></i>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;