import React, { useContext, useMemo, useState } from 'react';
import { useInventory } from '../context/InventoryContext';

const StockReport = () => {
  const { products } = useInventory();
  const [filter, setFilter] = useState('all'); // all, low, out, high

  // Filter products based on stock status
  const filteredProducts = useMemo(() => {
    switch (filter) {
      case 'low':
        return products.filter(product => product.quantity <= 5 && product.quantity > 0);
      case 'out':
        return products.filter(product => product.quantity === 0);
      case 'high':
        return products.filter(product => product.quantity > 5);
      default:
        return products;
    }
  }, [products, filter]);

  // Sort products by quantity (ascending for low stock, descending for high stock)
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (filter === 'low' || filter === 'out') {
        return a.quantity - b.quantity;
      } else if (filter === 'high') {
        return b.quantity - a.quantity;
      }
      return a.productName.localeCompare(b.productName);
    });
  }, [filteredProducts, filter]);

  // Calculate totals
  const totals = useMemo(() => {
    return products.reduce((acc, product) => {
      acc.totalQuantity += product.quantity;
      acc.totalValue += product.quantity * product.unitRate;
      return acc;
    }, { totalQuantity: 0, totalValue: 0 });
  }, [products]);

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-inboxes me-2"></i>
          Stock Report
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Products</h5>
              <h2>{products.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-warning">Low Stock (&lt; 5)</h5>
              <h2>{products.filter(p => p.quantity <= 5 && p.quantity > 0).length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-danger shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-danger">Out of Stock</h5>
              <h2>{products.filter(p => p.quantity === 0).length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Total Quantity</h5>
              <h2>{totals.totalQuantity}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Stock Status</h5>
            <div className="btn-group" role="group">
              <button 
                type="button" 
                className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setFilter('all')}
              >
                All Products
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'high' ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setFilter('high')}
              >
                High Stock
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'low' ? 'btn-warning' : 'btn-outline-warning'}`}
                onClick={() => setFilter('low')}
              >
                Low Stock
              </button>
              <button 
                type="button" 
                className={`btn ${filter === 'out' ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setFilter('out')}
              >
                Out of Stock
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stock Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-list me-2"></i>
            Product Stock Details
          </h5>
        </div>
        <div className="card-body">
          {sortedProducts.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Unit</th>
                    <th>Quantity</th>
                    <th>Unit Rate</th>
                    <th>Sell Rate</th>
                    <th>Total Value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProducts.map(product => (
                    <tr key={product.id}>
                      <td>{product.productCode}</td>
                      <td>
                        <div className="fw-bold">{product.productName}</div>
                        <small className="text-muted">{product.product}</small>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.unit}</td>
                      <td>
                        <span className={`badge ${
                          product.quantity === 0 ? 'bg-danger' : 
                          product.quantity <= 5 ? 'bg-warning' : 'bg-success'
                        }`}>
                          {product.quantity} {product.unit}
                        </span>
                      </td>
                      <td>${product.unitRate.toFixed(2)}</td>
                      <td>${product.sellRate.toFixed(2)}</td>
                      <td>${(product.quantity * product.unitRate).toFixed(2)}</td>
                      <td>
                        {product.quantity === 0 ? (
                          <span className="badge bg-danger">Out of Stock</span>
                        ) : product.quantity <= 5 ? (
                          <span className="badge bg-warning">Low Stock</span>
                        ) : (
                          <span className="badge bg-success">In Stock</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <th colSpan="7">Totals</th>
                    <th>${totals.totalValue.toFixed(2)}</th>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{fontSize: '3rem'}}></i>
              <h4 className="mt-3">No products found</h4>
              <p className="text-muted">
                {filter === 'low' 
                  ? "No products with low stock (quantity ≤ 5)" 
                  : filter === 'out' 
                  ? "No products are currently out of stock" 
                  : filter === 'high' 
                  ? "No products with high stock (quantity > 5)" 
                  : "No products in inventory"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockReport;