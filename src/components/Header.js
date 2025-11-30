// components/Header.js
import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <h2>Inventory Manager</h2>
        <nav>
          <span>Dashboard</span>
          <span>Products</span>
          <span>Reports</span>
        </nav>
      </div>
    </header>
  );
};

export default Header;