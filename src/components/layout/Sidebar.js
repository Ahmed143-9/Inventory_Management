import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useAuth();
  const [expanded, setExpanded] = useState(true);

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'bi-speedometer2',
      roles: ['superadmin', 'manager', 'user']
    },
    {
      title: 'Inventory',
      icon: 'bi-box-seam',
      roles: ['superadmin', 'manager', 'user'],
      submenu: [
        { title: 'Products', path: '/products', icon: 'bi-box' },
        { title: 'Add Product', path: '/products/add', icon: 'bi-plus-circle' },
        { title: 'Import Products', path: '/products/import', icon: 'bi-file-earmark-arrow-up' }
      ]
    },
    {
      title: 'Purchase',
      icon: 'bi-cart-plus',
      roles: ['superadmin', 'manager'],
      submenu: [
        { title: 'Purchase List', path: '/purchase', icon: 'bi-list-ul' },
        { title: 'Add Purchase', path: '/purchase/add', icon: 'bi-cart-plus' }
      ]
    },
    {
      title: 'Sales',
      icon: 'bi-cart-check',
      roles: ['superadmin', 'manager', 'user'],
      submenu: [
        { title: 'Sales List', path: '/sales', icon: 'bi-receipt' },
        { title: 'New Sale', path: '/sales/add', icon: 'bi-cart-plus' }
      ]
    },
    {
      title: 'Suppliers',
      path: '/suppliers',
      icon: 'bi-truck',
      roles: ['superadmin', 'manager']
    },
    {
      title: 'Customers',
      path: '/customers',
      icon: 'bi-people',
      roles: ['superadmin', 'manager', 'user']
    },
    {
      title: 'Reports',
      icon: 'bi-graph-up',
      roles: ['superadmin', 'manager'],
      submenu: [
        { title: 'All Reports', path: '/reports', icon: 'bi-clipboard-data' },
        { title: 'Stock Report', path: '/reports/stock', icon: 'bi-boxes' },
        { title: 'Sales Report', path: '/reports/sales', icon: 'bi-currency-dollar' },
        { title: 'Profit & Loss', path: '/reports/profit-loss', icon: 'bi-calculator' }
      ]
    },
    {
      title: 'Admin',
      path: '/admin',
      icon: 'bi-shield-lock',
      roles: ['superadmin']
    }
  ];

  const filteredMenu = menuItems.filter(item => 
    item.roles.includes(currentUser?.role)
  );

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`sidebar bg-dark text-white ${expanded ? 'expanded' : 'collapsed'}`}
         style={{
           width: expanded ? '250px' : '60px',
           minHeight: 'calc(100vh - 56px)',
           position: 'fixed',
           left: 0,
           top: '56px',
           zIndex: 100,
           transition: 'width 0.3s ease'
         }}>
      <div className="sidebar-header p-3 border-bottom border-secondary">
        <button 
          className="btn btn-link text-white p-0"
          onClick={() => setExpanded(!expanded)}
        >
          <i className={`bi ${expanded ? 'bi-chevron-left' : 'bi-chevron-right'}`}></i>
        </button>
        {expanded && (
          <span className="ms-2 fw-semibold">Navigation</span>
        )}
      </div>
      
      <div className="sidebar-menu p-2">
        {filteredMenu.map((item, index) => (
          <div key={index} className="menu-item">
            {item.submenu ? (
              <div className="submenu">
                <div className="submenu-header d-flex align-items-center p-2 rounded hover-bg">
                  <i className={`bi ${item.icon} ${expanded ? 'me-3' : ''}`}></i>
                  {expanded && <span>{item.title}</span>}
                </div>
                {expanded && (
                  <div className="submenu-items ms-4">
                    {item.submenu.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.path}
                        className={({ isActive }) => 
                          `d-flex align-items-center p-2 rounded text-white text-decoration-none hover-bg ${isActive ? 'active-menu' : ''}`
                        }
                      >
                        <i className={`bi ${subItem.icon} me-3`}></i>
                        <span>{subItem.title}</span>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) => 
                  `d-flex align-items-center p-2 rounded text-white text-decoration-none hover-bg ${isActive ? 'active-menu' : ''}`
                }
              >
                <i className={`bi ${item.icon} ${expanded ? 'me-3' : ''}`}></i>
                {expanded && <span>{item.title}</span>}
              </NavLink>
            )}
          </div>
        ))}
      </div>
      
      <style jsx>{`
        .hover-bg:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .active-menu {
          background-color: var(--secondary-color) !important;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;