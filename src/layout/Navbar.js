import React from 'react';

function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        📦 Inventory Pro
      </div>
      <div className="navbar-user">
        <span>Welcome, {user.name || user.email}</span>
        <button className="btn-logout" onClick={onLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;