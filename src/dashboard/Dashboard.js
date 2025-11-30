import React from 'react';

function Dashboard({ products, activities }) {
  // Calculate statistics
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => p.quantity <= p.reorderLevel).length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);
  const categories = [...new Set(products.map(p => p.category))].length;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Products</h3>
          <div className="value">{totalProducts}</div>
        </div>
        
        <div className="stat-card low-stock">
          <h3>Low Stock Alert</h3>
          <div className="value">{lowStockProducts}</div>
        </div>
        
        <div className="stat-card value-stat">
          <h3>Total Inventory Value</h3>
          <div className="value">{formatCurrency(totalValue)}</div>
        </div>
        
        <div className="stat-card categories">
          <h3>Categories</h3>
          <div className="value">{categories}</div>
        </div>
      </div>

      <div className="activity-section">
        <h2>Recent Activity</h2>
        {activities.length === 0 ? (
          <p style={{color: '#999', textAlign: 'center', padding: '20px'}}>
            No activities yet. Start by adding products!
          </p>
        ) : (
          <ul className="activity-list">
            {activities.slice(0, 10).map(activity => (
              <li key={activity.id} className="activity-item">
                <div className="activity-info">
                  <div className="activity-action">{activity.action}</div>
                  <div className="activity-details">{activity.details}</div>
                </div>
                <div className="activity-time">{formatDate(activity.timestamp)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Dashboard;