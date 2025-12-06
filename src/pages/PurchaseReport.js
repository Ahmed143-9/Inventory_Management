import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PurchaseReport = () => {
  const { loading, purchases, products } = useInventory();
  const [filter, setFilter] = useState('all'); // all, paid, pending
  const [sortBy, setSortBy] = useState('date'); // date, amount, supplier

  if (loading) {
    return <LoadingSpinner message="Loading purchase report..." />;
  }

  // Create a map of products by ID for easy lookup
  const productMap = {};
  products.forEach(product => {
    productMap[product.id] = product;
  });

  // Enhanced purchase data with product info
  const enhancedPurchases = purchases.map(purchase => ({
    ...purchase,
    productName: purchase.productName || (productMap[purchase.productId] ? productMap[purchase.productId].productName : 'Unknown Product')
  }));

  // Sort purchases
  const sortedPurchases = [...enhancedPurchases].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.purchaseDate) - new Date(a.purchaseDate);
    } else if (sortBy === 'amount') {
      return b.totalCost - a.totalCost;
    } else if (sortBy === 'supplier') {
      return a.supplier.localeCompare(b.supplier);
    }
    return 0;
  });

  // Filter purchases
  const filteredPurchases = sortedPurchases.filter(purchase => {
    if (filter === 'paid' && purchase.paymentStatus !== 'Paid') return false;
    if (filter === 'pending' && purchase.paymentStatus === 'Paid') return false;
    return true;
  });

  // Calculate totals
  const totalPurchases = filteredPurchases.reduce((sum, purchase) => sum + (purchase.totalCost || 0), 0);
  const totalQuantity = filteredPurchases.reduce((sum, purchase) => sum + (purchase.quantityPurchased || 0), 0);
  const paidPurchases = filteredPurchases.filter(p => p.paymentStatus === 'Paid').length;
  const pendingPurchases = filteredPurchases.filter(p => p.paymentStatus !== 'Paid').length;

  return (
    <div className="purchase-report-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Purchase Report</h2>
              <p className="text-muted mb-0">Analysis of all purchase transactions</p>
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
              <h6 className="text-muted mb-2">Total Purchases</h6>
              <h3 className="text-primary mb-0">${totalPurchases.toLocaleString()}</h3>
              <small className="text-muted">Total value</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Items Purchased</h6>
              <h3 className="text-success mb-0">{totalQuantity}</h3>
              <small className="text-muted">Total quantity</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Paid Purchases</h6>
              <h3 className="text-info mb-0">{paidPurchases}</h3>
              <small className="text-muted">Completed transactions</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body">
              <h6 className="text-muted mb-2">Pending Payments</h6>
              <h3 className="text-warning mb-0">{pendingPurchases}</h3>
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
                      className={`btn ${sortBy === 'supplier' ? 'btn-secondary' : 'btn-outline-secondary'}`}
                      onClick={() => setSortBy('supplier')}
                    >
                      Supplier
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Report Table */}
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Date</th>
                  <th>Invoice No</th>
                  <th>Product</th>
                  <th>Supplier</th>
                  <th className="text-center">Qty</th>
                  <th>Unit Price</th>
                  <th>Total Cost</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredPurchases.map(purchase => (
                  <tr key={purchase.id}>
                    <td>{purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString() : 'N/A'}</td>
                    <td>{purchase.invoiceNo || 'N/A'}</td>
                    <td>
                      <div>
                        <strong>{purchase.productName}</strong>
                        <div className="small text-muted">{purchase.model || ''}</div>
                      </div>
                    </td>
                    <td>{purchase.supplier || 'N/A'}</td>
                    <td className="text-center">{purchase.quantityPurchased || 0}</td>
                    <td>${(purchase.unitPrice || 0).toLocaleString()}</td>
                    <td>
                      <strong>${(purchase.totalCost || 0).toLocaleString()}</strong>
                    </td>
                    <td>
                      <span className={`badge ${
                        purchase.paymentStatus === 'Paid' ? 'bg-success' :
                        purchase.paymentStatus === 'Partial' ? 'bg-warning' : 'bg-danger'
                      }`}>
                        {purchase.paymentStatus || 'N/A'}
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
      {filteredPurchases.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-cart-plus text-muted" style={{fontSize: '3rem'}}></i>
          <h5 className="mt-3 text-muted">No purchase data available</h5>
          <p className="text-muted">Try adjusting your filters or add purchase records</p>
        </div>
      )}
    </div>
  );
};

export default PurchaseReport;