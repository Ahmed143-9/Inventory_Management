import React from 'react';
import { Link } from 'react-router-dom';

const Reports = () => {
  const reportCards = [
    {
      title: 'Stock Report',
      description: 'View current stock levels and valuation',
      icon: 'bi-boxes',
      color: 'primary',
      link: '/reports/stock'
    },
    {
      title: 'Sales Report',
      description: 'Analyze sales performance and trends',
      icon: 'bi-currency-dollar',
      color: 'success',
      link: '/reports/sales'
    },
    {
      title: 'Profit & Loss',
      description: 'Calculate profit margins and losses',
      icon: 'bi-calculator',
      color: 'info',
      link: '/reports/profit-loss'
    },
    {
      title: 'Purchase Report',
      description: 'Track purchases and supplier performance',
      icon: 'bi-cart-plus',
      color: 'warning',
      link: '/reports/purchases'
    }
  ];

  return (
    <div className="reports-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Reports & Analytics</h2>
              <p className="text-muted mb-0">Generate and view business reports</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {reportCards.map((report, index) => (
          <div key={index} className="col-md-3 mb-4">
            <Link to={report.link} className="card text-decoration-none h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className={`icon-wrapper bg-${report.color} bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3`}
                     style={{ width: '70px', height: '70px' }}>
                  <i className={`bi ${report.icon} text-${report.color}`} style={{ fontSize: '2rem' }}></i>
                </div>
                <h5 className="card-title">{report.title}</h5>
                <p className="card-text text-muted small">{report.description}</p>
                <div className="mt-3">
                  <span className={`badge bg-${report.color}`}>
                    View Report <i className="bi bi-arrow-right ms-1"></i>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-light">
              <h5 className="mb-0">Quick Statistics</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="p-3">
                    <h3 className="text-primary">15</h3>
                    <p className="text-muted mb-0">Products</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3">
                    <h3 className="text-success">$12,500</h3>
                    <p className="text-muted mb-0">Total Sales</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3">
                    <h3 className="text-warning">3</h3>
                    <p className="text-muted mb-0">Low Stock</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="p-3">
                    <h3 className="text-info">$4,200</h3>
                    <p className="text-muted mb-0">Total Profit</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;