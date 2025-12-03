import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const StockReport = () => {
  const { loading, getStockReport } = useInventory();
  const [filter, setFilter] = useState('all');

  if (loading) {
    return <LoadingSpinner message="Loading stock report..." />;
  }

  const stockData = getStockReport ? getStockReport() : [];

  const filteredData = stockData.filter(item => {
    if (filter === 'low' && item.quantity >= 10) return false;
    if (filter === 'out' && item.quantity > 0) return false;
    if (filter === 'healthy' && (item.quantity === 0 || item.quantity < 10)) return false;
    return true;
  });

  const totalStockValue = filteredData.reduce((sum, item) => sum + (item.stockValue || 0), 0);
  const totalPotentialValue = filteredData.reduce((sum, item) => sum + (item.potentialValue || 0), 0);
  const totalPotentialProfit = filteredData.reduce((sum, item) => sum + (item.potentialProfit || 0), 0);

  return (
    <div className="stock-report-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Stock Report</h2>
              <p className="text-muted mb-0">Current inventory valuation and stock levels</p>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-outline-primary">
                <i className="bi bi-download me-2"></i>
                Export
              </button>
              <button className="btn btn-primary">
                <i className="bi bi-printer me-2"></i>
                Print
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Total Items</h6>
              <h3 className="text-primary mb-0">{filteredData.length}</h3>
              <small className="text-muted">Filtered products</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Stock Value</h6>
              <h3 className="text-success mb-0">${totalStockValue.toLocaleString()}</h3>
              <small className="text-muted">Current worth</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Potential Value</h6>
              <h3 className="text-info mb-0">${totalPotentialValue.toLocaleString()}</h3>
              <small className="text-muted">If all sold</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Potential Profit</h6>
              <h3 className="text-warning mb-0">${totalPotentialProfit.toLocaleString()}</h3>
              <small className="text-muted">Maximum profit</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-0">Filter by Stock Status</h6>
                </div>
                <div className="btn-group">
                  <button
                    className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setFilter('all')}
                  >
                    All
                  </button>
                  <button
                    className={`btn ${filter === 'healthy' ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setFilter('healthy')}
                  >
                    Healthy Stock
                  </button>
                  <button
                    className={`btn ${filter === 'low' ? 'btn-warning' : 'btn-outline-warning'}`}
                    onClick={() => setFilter('low')}
                  >
                    Low Stock
                  </button>
                  <button
                    className={`btn ${filter === 'out' ? 'btn-danger' : 'btn-outline-danger'}`}
                    onClick={() => setFilter('out')}
                  >
                    Out of Stock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Report Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th className="text-center">Quantity</th>
                  <th>Purchase Rate</th>
                  <th>Sell Rate</th>
                  <th>Stock Value</th>
                  <th>Potential Value</th>
                  <th>Profit Margin</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div>
                        <strong>{item.productName}</strong>
                        <div className="small text-muted">{item.productCode}</div>
                      </div>
                    </td>
                    <td>{item.category}</td>
                    <td className="text-center">
                      <span className={`badge ${
                        item.quantity === 0 ? 'bg-danger' : 
                        item.quantity < 10 ? 'bg-warning' : 'bg-success'
                      }`}>
                        {item.quantity || 0}
                      </span>
                    </td>
                    <td>${item.unitRate || 0}</td>
                    <td>${item.sellRate || 0}</td>
                    <td>
                      <strong>${(item.stockValue || 0).toLocaleString()}</strong>
                    </td>
                    <td>
                      <span className="text-success">
                        ${(item.potentialValue || 0).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        item.profitMargin > 30 ? 'bg-success' :
                        item.profitMargin > 15 ? 'bg-info' :
                        item.profitMargin > 0 ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {item.profitMargin?.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockReport;