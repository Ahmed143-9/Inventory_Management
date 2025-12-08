import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useDocument } from '../context/DocumentContext';

const ProfitLossReport = () => {
  const { products, purchases, sales } = useInventory();
  const { documents } = useDocument();
  const [sortBy, setSortBy] = useState('profitMargin');
  const [sortOrder, setSortOrder] = useState('desc');

  // Calculate total extra costs from documents
  const totalExtraCost = useMemo(() => {
    return documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);
  }, [documents]);

  // Calculate profit data for each product
  const profitData = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    
    return products.map(product => {
      // Safely extract product information with fallbacks
      const productId = product.id || '';
      const productName = product.productName || product.name || 'Unknown Product';
      const productCode = product.productCode || product.code || '';
      
      // Extract quantity with multiple fallbacks
      const quantity = (() => {
        if (typeof product.quantity === 'number') return product.quantity;
        if (typeof product.currentStock === 'number') return product.currentStock;
        if (typeof product.stock === 'number') return product.stock;
        return 0;
      })();
      
      // Extract cost with multiple fallbacks
      const cost = (() => {
        if (typeof product.cost === 'number') return product.cost;
        if (typeof product.unitRate === 'number') return product.unitRate;
        if (typeof product.buyPrice === 'number') return product.buyPrice;
        if (typeof product.purchasePrice === 'number') return product.purchasePrice;
        return 0;
      })();
      
      // Extract price with multiple fallbacks
      const price = (() => {
        if (typeof product.price === 'number') return product.price;
        if (typeof product.sellRate === 'number') return product.sellRate;
        if (typeof product.sellPrice === 'number') return product.sellPrice;
        return 0;
      })();
      
      // Calculate total quantity from purchases
      const totalPurchased = purchases
        .filter(p => p.productId === productId)
        .reduce((sum, purchase) => sum + (purchase.quantity || 0), 0);
      
      // Calculate total sold quantity from sales
      const totalSold = sales
        .filter(s => s.productId === productId)
        .reduce((sum, sale) => sum + (sale.quantity || 0), 0);
      
      // Total investment (cost of all purchased items)
      const totalInvestment = totalPurchased * cost;
      
      // Total revenue (sell price * quantity sold)
      const totalRevenue = totalSold * price;
      
      // Total profit
      const totalProfit = totalRevenue - (totalSold * cost);
      
      // Profit margin percentage
      const profitMargin = totalSold > 0 && (totalSold * cost) > 0 ? 
        (totalProfit / (totalSold * cost)) * 100 : 0;
      
      return {
        productId,
        productName,
        productCode,
        quantity,
        totalInvestment,
        totalRevenue,
        totalProfit,
        profitMargin
      };
    });
  }, [products, purchases, sales]);

  // Calculate totals
  const totals = useMemo(() => {
    return {
      totalInvestment: profitData.reduce((sum, item) => sum + (item.totalInvestment || 0), 0),
      totalRevenue: profitData.reduce((sum, item) => sum + (item.totalRevenue || 0), 0),
      totalProfit: profitData.reduce((sum, item) => sum + (item.totalProfit || 0), 0)
    };
  }, [profitData]);

  // Adjusted profit after extra costs
  const adjustedProfit = (totals.totalProfit || 0) - (totalExtraCost || 0);
  
  // Overall profit margins
  const overallProfitMargin = (totals.totalInvestment || 0) > 0 ? 
    ((totals.totalProfit || 0) / (totals.totalInvestment || 0)) * 100 : 0;
    
  const adjustedProfitMargin = (totals.totalInvestment || 0) > 0 ? 
    ((adjustedProfit || 0) / (totals.totalInvestment || 0)) * 100 : 0;

  // Sort profit data
  const sortedProfitData = useMemo(() => {
    return [...profitData].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'productName':
          aValue = a.productName.toLowerCase();
          bValue = b.productName.toLowerCase();
          break;
        case 'totalProfit':
          aValue = a.totalProfit;
          bValue = b.totalProfit;
          break;
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        default: // profitMargin
          aValue = a.profitMargin;
          bValue = b.profitMargin;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [profitData, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

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
          <i className="bi bi-currency-dollar me-2"></i>
          Profit & Loss Report
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Investment</h5>
              <h2>{formatCurrency(totals.totalInvestment)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Total Revenue</h5>
              <h2>{formatCurrency(totals.totalRevenue)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-info">Gross Profit</h5>
              <h2>{formatCurrency(totals.totalProfit)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-warning">Net Profit</h5>
              <h2>{formatCurrency(adjustedProfit)}</h2>
              {totalExtraCost > 0 && (
                <small className="text-danger">
                  After {formatCurrency(totalExtraCost)} extra costs
                </small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profit Margin Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-success shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">
                <i className="bi bi-percent me-2"></i>
                Gross Profit Margin
              </h5>
              <h2>{overallProfitMargin.toFixed(2)}%</h2>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-warning shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-warning">
                <i className="bi bi-percent me-2"></i>
                Net Profit Margin
              </h5>
              <h2>{adjustedProfitMargin.toFixed(2)}%</h2>
              {totalExtraCost > 0 && (
                <small className="text-danger">
                  Reduced by extra costs
                </small>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Extra Costs Summary */}
      {totalExtraCost > 0 && (
        <div className="row g-4 mb-4">
          <div className="col-12">
            <div className="card border-danger shadow-sm">
              <div className="card-header bg-danger text-white py-3">
                <h5 className="mb-0">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Extra Costs Impact
                </h5>
              </div>
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <p className="mb-0">
                      Extra costs of {formatCurrency(totalExtraCost)} are reducing your net profit 
                      from {formatCurrency(totals.totalProfit)} to {formatCurrency(adjustedProfit)}.
                    </p>
                    {documents.length > 0 && (
                      <button 
                        className="btn btn-outline-primary btn-sm mt-2"
                        data-bs-toggle="modal" 
                        data-bs-target="#extraCostsModal"
                      >
                        <i className="bi bi-list me-1"></i>
                        View Details
                      </button>
                    )}
                  </div>
                  <div className="col-md-4 text-end">
                    <h4 className="text-danger mb-0">{formatCurrency(totalExtraCost)}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profitable vs Non-Profitable */}
      <div className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card border-success shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">
                <i className="bi bi-arrow-up-circle me-2"></i>
                Profitable Products
              </h5>
              <h2>{profitData.filter(p => p.totalProfit > 0).length}</h2>
              <p className="text-muted mb-0">
                Products generating positive profit
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-danger shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-danger">
                <i className="bi bi-arrow-down-circle me-2"></i>
                Non-Profitable Products
              </h5>
              <h2>{profitData.filter(p => p.totalProfit <= 0).length}</h2>
              <p className="text-muted mb-0">
                Products with zero or negative profit
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Product Profit Analysis</h5>
            <div className="d-flex gap-2">
              <select 
                className="form-select" 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="profitMargin">Sort by Profit Margin</option>
                <option value="productName">Sort by Product Name</option>
                <option value="totalProfit">Sort by Total Profit</option>
                <option value="quantity">Sort by Quantity</option>
              </select>
              <button 
                className="btn btn-outline-secondary"
                onClick={toggleSortOrder}
              >
                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Profit Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-table me-2"></i>
            Detailed Profit Analysis
          </h5>
        </div>
        <div className="card-body">
          {sortedProfitData.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Investment</th>
                    <th>Revenue</th>
                    <th>Gross Profit</th>
                    <th>Profit Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProfitData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="fw-bold">{item.productName}</div>
                        <small className="text-muted">{item.productCode}</small>
                      </td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.totalInvestment)}</td>
                      <td>{formatCurrency(item.totalRevenue)}</td>
                      <td>
                        <span className={item.totalProfit >= 0 ? 'text-success' : 'text-danger'}>
                          {formatCurrency(item.totalProfit)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${
                          item.profitMargin > 20 ? 'bg-success' : 
                          item.profitMargin > 10 ? 'bg-warning' : 
                          item.profitMargin > 0 ? 'bg-info' : 'bg-danger'
                        }`}>
                          {item.profitMargin.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-info-circle display-1 text-muted"></i>
              <h4 className="mt-3">No profit data available</h4>
              <p className="text-muted">
                Add products and transactions to generate profit analysis
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Extra Costs Modal */}
      <div className="modal fade" id="extraCostsModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Extra Costs Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(doc => (
                      <tr key={doc.id}>
                        <td>{doc.title}</td>
                        <td>{doc.description || '-'}</td>
                        <td className="text-danger fw-bold">{formatCurrency(doc.amount)}</td>
                        <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossReport;