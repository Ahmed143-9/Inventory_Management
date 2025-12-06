import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useInventory } from '../context/InventoryContext';
import { useDocument } from '../context/DocumentContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { products, purchases, sales } = useInventory();
  const { totalExtraCost } = useDocument();

  // Calculate dashboard statistics with memoization
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockProducts = products.filter(product => product.quantity <= 5).length;
    const outOfStockProducts = products.filter(product => product.quantity === 0).length;
    
    // Calculate total inventory value
    const totalInventoryValue = products.reduce((sum, product) => {
      return sum + (product.quantity * product.unitRate);
    }, 0);
    
    // Calculate potential profit (adjusted for extra costs)
    const totalProductValue = products.reduce((sum, product) => {
      return sum + (product.quantity * product.sellRate);
    }, 0);
    
    const totalCost = products.reduce((sum, product) => {
      return sum + (product.quantity * product.unitRate);
    }, 0);
    
    const potentialProfit = totalProductValue - totalCost - totalExtraCost;
    
    // Calculate recent transactions (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentPurchases = purchases.filter(purchase => 
      new Date(purchase.purchaseDate) >= thirtyDaysAgo
    ).length;
    
    const recentSales = sales.filter(sale => 
      new Date(sale.saleDate) >= thirtyDaysAgo
    ).length;
    
    return {
      totalProducts,
      lowStockProducts,
      outOfStockProducts,
      totalInventoryValue,
      potentialProfit,
      recentPurchases,
      recentSales
    };
  }, [products, purchases, sales, totalExtraCost]);

  // Get top 5 low stock products with memoization
  const lowStockItems = useMemo(() => {
    return products
      .filter(product => product.quantity <= 5 && product.quantity > 0)
      .sort((a, b) => a.quantity - b.quantity)
      .slice(0, 5);
  }, [products]);

  // Get out of stock products with memoization
  const outOfStockItems = useMemo(() => {
    return products
      .filter(product => product.quantity === 0)
      .slice(0, 5);
  }, [products]);

  // Get high-profit products with memoization
  const highProfitProducts = useMemo(() => {
    return products
      .map(product => ({
        ...product,
        profitMargin: product.unitRate > 0 ? 
          ((product.sellRate - product.unitRate) / product.unitRate * 100) : 0
      }))
      .filter(product => product.profitMargin > 0)
      .sort((a, b) => b.profitMargin - a.profitMargin)
      .slice(0, 5);
  }, [products]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-speedometer2 me-2"></i>
          Dashboard
        </h2>
        <div className="text-end">
          <p className="mb-0">Welcome back, {user?.name || 'User'}!</p>
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
                  <Link to="/products/add" className="btn btn-outline-primary w-100">
                    <i className="bi bi-plus-circle me-2"></i>
                    Add Product
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
                        <th>Status</th>
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
                            <span className="badge bg-danger">Out of Stock</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-check-circle text-success" style={{fontSize: '2rem'}}></i>
                  <p className="mt-2 mb-0">All products are in stock!</p>
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

        {/* High Profit Products */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-graph-up text-success me-2"></i>
                High Profit Products
              </h5>
            </div>
            <div className="card-body">
              {highProfitProducts.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Profit Margin</th>
                      </tr>
                    </thead>
                    <tbody>
                      {highProfitProducts.map(product => (
                        <tr key={product.id}>
                          <td>
                            <div className="fw-bold">{product.productName}</div>
                            <small className="text-muted">
                              Buy: ${product.unitRate.toFixed(2)} | Sell: ${product.sellRate.toFixed(2)}
                            </small>
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
                  <p className="mt-2 mb-0">No profit data available</p>
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

      {/* Recent Activity Summary */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-activity me-2"></i>
                Recent Activity
              </h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <div className="p-3 bg-light rounded">
                    <h4 className="text-primary">{stats.recentPurchases}</h4>
                    <p className="mb-0">Recent Purchases</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="p-3 bg-light rounded">
                    <h4 className="text-success">{stats.recentSales}</h4>
                    <p className="mb-0">Recent Sales</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="p-3 bg-light rounded">
                    <h4 className="text-info">{formatCurrency(stats.totalInventoryValue)}</h4>
                    <p className="mb-0">Inventory Value</p>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="p-3 bg-light rounded">
                    <h4 className="text-warning">{formatCurrency(totalExtraCost)}</h4>
                    <p className="mb-0">Extra Costs</p>
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

export default Dashboard;