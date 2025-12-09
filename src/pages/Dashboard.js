import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useDocument } from '../context/DocumentContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { products } = useInventory();
  const { documents } = useDocument();

  // Calculate total extra costs from documents
  const totalExtraCost = useMemo(() => {
    return documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);
  }, [documents]);

  // Calculate dashboard stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(p => {
      const quantity = typeof p.quantity === 'number' ? p.quantity : 
                      typeof p.currentStock === 'number' ? p.currentStock : 
                      typeof p.stock === 'number' ? p.stock : 0;
      const minStock = typeof p.minStock === 'number' ? p.minStock : 0;
      return quantity <= minStock;
    }).length;
    
    const outOfStockProducts = products.filter(p => {
      const quantity = typeof p.quantity === 'number' ? p.quantity : 
                      typeof p.currentStock === 'number' ? p.currentStock : 
                      typeof p.stock === 'number' ? p.stock : 0;
      return quantity === 0;
    }).length;
    
    // Calculate potential profit (without extra costs)
    const totalValue = products.reduce((sum, product) => {
      // Extract price with multiple fallbacks
      const price = typeof product.price === 'number' ? product.price :
                   typeof product.sellRate === 'number' ? product.sellRate :
                   typeof product.sellPrice === 'number' ? product.sellPrice : 0;
                   
      // Extract quantity with multiple fallbacks
      const quantity = typeof product.quantity === 'number' ? product.quantity :
                      typeof product.currentStock === 'number' ? product.currentStock :
                      typeof product.stock === 'number' ? product.stock : 0;
      
      const value = price * quantity;
      return sum + value;
    }, 0);
    
    const totalCost = products.reduce((sum, product) => {
      // Extract cost with multiple fallbacks
      const cost = typeof product.cost === 'number' ? product.cost :
                  typeof product.unitRate === 'number' ? product.unitRate :
                  typeof product.buyPrice === 'number' ? product.buyPrice :
                  typeof product.purchasePrice === 'number' ? product.purchasePrice :
                  typeof product.price === 'number' ? product.price : 0;
                  
      // Extract quantity with multiple fallbacks
      const quantity = typeof product.quantity === 'number' ? product.quantity :
                      typeof product.currentStock === 'number' ? product.currentStock :
                      typeof product.stock === 'number' ? product.stock : 0;
      
      const costValue = cost * quantity;
      return sum + costValue;
    }, 0);
    
    const potentialProfit = totalValue - totalCost;

    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      potentialProfit
    };
  }, [products]);

  // Low stock items
  const lowStockItems = useMemo(() => {
    return products
      .filter(product => (product.quantity || 0) <= (product.minStock || 0) && (product.quantity || 0) > 0)
      .slice(0, 5);
  }, [products]);

  // Out of stock items
  const outOfStockItems = useMemo(() => {
    return products
      .filter(product => (product.quantity || 0) === 0)
      .slice(0, 5);
  }, [products]);

  // Top profitable products
  const topProfitableProducts = useMemo(() => {
    return products
      .filter(product => (product.profitMargin || 0) > 0)
      .sort((a, b) => (b.profitMargin || 0) - (a.profitMargin || 0))
      .slice(0, 5);
  }, [products]);

  const formatCurrency = (amount) => {
    // Handle null, undefined, or non-numeric values
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '৳0.00';
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BDT'
      }).format(amount);
    } catch (error) {
      // Fallback formatting if Intl fails
      return `৳${parseFloat(amount).toFixed(2)}`;
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </h2>
        <div className="text-end">
          <p className="mb-0">Welcome back, {currentUser?.name || 'User'}!</p>
          <small className="text-muted">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </small>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-primary shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title text-primary">Total Products</h5>
                  <h2 className="mb-0">{stats.totalProducts}</h2>
                </div>
                <i className="bi bi-boxes text-primary" style={{fontSize: '2.5rem'}}></i>
              </div>
              <Link to="/products" className="stretched-link"></Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-warning shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title text-warning">Low Stock Items</h5>
                  <h2 className="mb-0">{stats.lowStockProducts}</h2>
                </div>
                <i className="bi bi-exclamation-triangle text-warning" style={{fontSize: '2.5rem'}}></i>
              </div>
              <Link to="/reports/stock" className="stretched-link"></Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-danger shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title text-danger">Out of Stock</h5>
                  <h2 className="mb-0">{stats.outOfStockProducts}</h2>
                </div>
                <i className="bi bi-x-circle text-danger" style={{fontSize: '2.5rem'}}></i>
              </div>
              <Link to="/reports/stock" className="stretched-link"></Link>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-success shadow-sm h-100">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="card-title text-success">Potential Profit</h5>
                  <h2 className="mb-0">{formatCurrency(stats.potentialProfit)}</h2>
                  {totalExtraCost > 0 && (
                    <small className="text-danger">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      Includes {formatCurrency(totalExtraCost)} extra costs
                    </small>
                  )}
                </div>
                <i className="bi bi-currency-dollar text-success" style={{fontSize: '2.5rem'}}></i>
              </div>
              <Link to="/reports/profit-loss" className="stretched-link"></Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-md-3 col-6">
                  <Link to="/daily-sales-report" className="btn btn-outline-primary w-100">
                    <i className="bi bi-calendar-day me-2"></i>
                    Daily Sell
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to="/excel-import" className="btn btn-outline-success w-100">
                    <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                    Import Excel
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to="/documents" className="btn btn-outline-info w-100">
                    <i className="bi bi-file-earmark-text me-2"></i>
                    Documents
                  </Link>
                </div>
                <div className="col-md-3 col-6">
                  <Link to="/reports/profit-loss" className="btn btn-outline-warning w-100">
                    <i className="bi bi-currency-dollar me-2"></i>
                    Profit Report
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Sections */}
      <div className="row g-4">
        {/* Low Stock Items */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-exclamation-triangle text-warning me-2"></i>
                Low Stock Items
              </h5>
            </div>
            <div className="card-body">
              {lowStockItems.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lowStockItems.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="fw-bold">{product.productName}</div>
                            <small className="text-muted">{product.productCode}</small>
                          </td>
                          <td>
                            <span className="badge bg-warning">{product.quantity} {product.unit}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle text-success" style={{fontSize: '2rem'}}></i>
                  <p className="mt-2 mb-0">No low stock items!</p>
                </div>
              )}
              <div className="text-center mt-3">
                <Link to="/reports/stock" className="btn btn-outline-primary btn-sm">
                  View Full Report
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Out of Stock Items */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-x-circle text-danger me-2"></i>
                Out of Stock Items
              </h5>
            </div>
            <div className="card-body">
              {outOfStockItems.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {outOfStockItems.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="fw-bold">{product.productName}</div>
                            <small className="text-muted">{product.productCode}</small>
                          </td>
                          <td>
                            <span className="badge bg-danger">{product.category || 'Uncategorized'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle text-success" style={{fontSize: '2rem'}}></i>
                  <p className="mt-2 mb-0">All items are in stock!</p>
                </div>
              )}
              <div className="text-center mt-3">
                <Link to="/reports/stock" className="btn btn-outline-primary btn-sm">
                  View Full Report
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Top Profitable Products */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-trophy text-warning me-2"></i>
                Top Profitable Products
              </h5>
            </div>
            <div className="card-body">
              {topProfitableProducts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Profit Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProfitableProducts.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="fw-bold">{product.productName}</div>
                            <small className="text-muted">{product.productCode}</small>
                          </td>
                          <td>
                            <span className="badge bg-success">
                              {product.profitMargin.toFixed(1)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-info-circle text-info" style={{fontSize: '2rem'}}></i>
                  <p className="mt-2 mb-0">No profitable products data available</p>
                </div>
              )}
              <div className="text-center mt-3">
                <Link to="/reports/profit-loss" className="btn btn-outline-primary btn-sm">
                  View Profit Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;