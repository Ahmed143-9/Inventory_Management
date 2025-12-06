import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const SalesReport = () => {
  const { loading, sales, products } = useInventory();
  const [filter, setFilter] = useState('all'); // all, paid, pending
  const [sortBy, setSortBy] = useState('date'); // date, amount, customer

  if (loading) {
    return <LoadingSpinner message="Loading sales report..." />;
  }

  // Create a map of products by ID for easy lookup
  const productMap = {};
  products.forEach(product => {
    productMap[product.id] = product;
  });

  // Enhanced sales data with product info
  const enhancedSales = sales.map(sale => ({
    ...sale,
    productName: sale.productName || (productMap[sale.productId] ? productMap[sale.productId].productName : 'Unknown Product')
  }));

  // Sort sales
  const sortedSales = [...enhancedSales].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.saleDate) - new Date(a.saleDate);
    } else if (sortBy === 'amount') {
      return b.totalSale - a.totalSale;
    } else if (sortBy === 'customer') {
      return a.customerName.localeCompare(b.customerName);
    }
    return 0;
  });

  // Filter sales
  const filteredSales = sortedSales.filter(sale => {
    if (filter === 'paid' && sale.paymentStatus !== 'Paid') return false;
    if (filter === 'pending' && sale.paymentStatus === 'Paid') return false;
    return true;
  });

  // Calculate totals
  const totalSales = filteredSales.reduce((sum, sale) => sum + (sale.totalSale || 0), 0);
  const totalQuantity = filteredSales.reduce((sum, sale) => sum + (sale.quantitySold || 0), 0);
  const paidSales = filteredSales.filter(s => s.paymentStatus === 'Paid').length;
  const pendingSales = filteredSales.filter(s => s.paymentStatus !== 'Paid').length;

  return (
    <div className="sales-report-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Sales Report</h2>
              <p className="text-muted mb-0">Analysis of all sales transactions</p>
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
              <h6 className="text-muted mb-2">Total Sales</h6>
              <h3 className="text-primary mb-0">${totalSales.toLocaleString()}</h3>
              <small className="text-muted">Revenue generated</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Items Sold</h6>
              <h3 className="text-success mb-0">{totalQuantity}</h3>
              <small className="text-muted">Total quantity</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Paid Sales</h6>
              <h3 className="text-info mb-0">{paidSales}</h3>
              <small className="text-muted">Completed transactions</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Pending Payments</h6>
              <h3 className="text-warning mb-0">{pendingSales}</h3>
              <small className="text-muted">Open transactions</small>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <h6 className="mb-0">Filter by Payment Status</h6>
                  <div className="btn-group mt-2">
                    <button
                      className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setFilter('all')}
                    >
                      All
                    </button>
                    <button
                      className={`btn ${filter === 'paid' ? 'btn-success' : 'btn-outline-success'}`}
                      onClick={() => setFilter('paid')}
                    >
                      Paid
                    </button>
                    <button
                      className={`btn ${filter === 'pending' ? 'btn-warning' : 'btn-outline-warning'}`}
                      onClick={() => setFilter('pending')}
                    >
                      Pending
                    </button>
                  </div>
                </div>
                
                <div>
                  <h6 className="mb-0">Sort By</h6>
                  <div className="btn-group mt-2">
                    <button
                      className={`btn ${sortBy === 'date' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => setSortBy('date')}
                    >
                      Date
                    </button>
                    <button
                      className={`btn ${sortBy === 'amount' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => setSortBy('amount')}
                    >
                      Amount
                    </button>
                    <button
                      className={`btn ${sortBy === 'customer' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => setSortBy('customer')}
                    >
                      Customer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Report Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Invoice No</th>
                  <th>Product</th>
                  <th>Customer</th>
                  <th className="text-center">Qty</th>
                  <th>Unit Price</th>
                  <th>Total Sale</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map(sale => (
                  <tr key={sale.id}>
                    <td>{sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{sale.invoiceNo || 'N/A'}</td>
                    <td>
                      <div>
                        <strong>{sale.productName}</strong>
                      </div>
                    </td>
                    <td>{sale.customerName || 'N/A'}</td>
                    <td className="text-center">{sale.quantitySold || 0}</td>
                    <td>${(sale.unitPrice || 0).toLocaleString()}</td>
                    <td>
                      <strong>${(sale.totalSale || 0).toLocaleString()}</strong>
                    </td>
                    <td>
                      <span className={`badge ${
                        sale.paymentStatus === 'Paid' ? 'bg-success' :
                        sale.paymentStatus === 'Partial' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {sale.paymentStatus || 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* No data message */}
      {filteredSales.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-cart-check text-muted" style={{fontSize: '3rem'}}></i>
          <h5 className="mt-3 text-muted">No sales data available</h5>
          <p className="text-muted">Try adjusting your filters or add sales records</p>
        </div>
      )}
    </div>
  );
};

export default SalesReport;