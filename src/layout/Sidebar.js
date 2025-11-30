import React from 'react';

function Sidebar({ currentView, setCurrentView }) {
  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'inventory', label: '📦 Inventory' }
  ];

  return (
    <div className="sidebar">
      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li
            key={item.id}
            className={currentView === item.id ? 'active' : ''}
            onClick={() => setCurrentView(item.id)}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;