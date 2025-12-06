import React, { useMemo, useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useDocument } from '../context/DocumentContext';

const ProfitLossReport = () => {
  const { products } = useInventory();
  const { totalExtraCost, documents } = useDocument();
  const [sortBy, setSortBy] = useState('profitMargin'); // profitMargin, productName, quantity
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc

  // Calculate profit data for each product
  const profitData = useMemo(() => {
    return products.map(product => {
      const buyPrice = product.unitRate || 0;
      const sellPrice = product.sellRate || 0;
      const quantity = product.quantity || 0;
      
      const profitPerUnit = sellPrice - buyPrice;
      const totalProfit = profitPerUnit * quantity;
      const profitMargin = buyPrice > 0 ? (profitPerUnit / buyPrice) * 100 : 0;
      
      return {
        ...product,
        buyPrice,
        sellPrice,
        profitPerUnit,
        totalProfit,
        profitMargin
      };
    });
  }, [products]);

  // Sort products based on selected criteria
  const sortedProfitData = useMemo(() => {
    return [...profitData].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle special sorting for profit margin
      if (sortBy === 'profitMargin') {
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

  // Calculate overall totals
  const totals = useMemo(() => {
    return profitData.reduce((acc, product) => {
      acc.totalInvestment += product.buyPrice * product.quantity;
      acc.totalRevenue += product.sellPrice * product.quantity;
      acc.totalProfit += product.totalProfit;
      return acc;
    }, {
      totalInvestment: 0,
      totalRevenue: 0,
      totalProfit: 0
    });
  }, [profitData]);

  // Calculate adjusted profit (subtracting extra costs)
  const adjustedProfit = totals.totalProfit - totalExtraCost;
  
  // Calculate profit margin percentage
  const overallProfitMargin = totals.totalInvestment > 0 
    ? (totals.totalProfit / totals.totalInvestment) * 100 
    : 0;
    
  const adjustedProfitMargin = totals.totalInvestment > 0 
    ? (adjustedProfit / totals.totalInvestment) * 100 
    : 0;

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

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
                    <th>Category</th>
                    <th>Quantity</th>
                    <th>Buy Price</th>
                    <th>Sell Price</th>
                    <th>Profit/Unit</th>
                    <th>Total Profit</th>
                    <th>Profit Margin</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedProfitData.map(product => (
                    <tr key={product.id}>
                      <td>
                        <div className="fw-bold">{product.productName}</div>
                        <small className="text-muted">{product.productCode}</small>
                      </td>
                      <td>{product.category}</td>
                      <td>{product.quantity} {product.unit}</td>
                      <td>{formatCurrency(product.buyPrice)}</td>
                      <td>{formatCurrency(product.sellPrice)}</td>
                      <td className={product.profitPerUnit >= 0 ? 'text-success' : 'text-danger'}>
                        {formatCurrency(product.profitPerUnit)}
                      </td>
                      <td className={product.totalProfit >= 0 ? 'text-success' : 'text-danger'}>
                        {formatCurrency(product.totalProfit)}
                      </td>
                      <td>
                        <span className={`badge ${
                          product.profitMargin > 20 ? 'bg-success' : 
                          product.profitMargin > 0 ? 'bg-warning' : 'bg-danger'
                        }`}>
                          {product.profitMargin.toFixed(2)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <th colSpan="5">Totals</th>
                    <th>{formatCurrency(totals.totalRevenue - totals.totalInvestment)}</th>
                    <th>{formatCurrency(totals.totalProfit)}</th>
                    <th>{overallProfitMargin.toFixed(2)}%</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-currency-dollar text-muted" style={{fontSize: '3rem'}}></i>
              <h4 className="mt-3">No products found</h4>
              <p className="text-muted">There are no products in your inventory to analyze.</p>
            </div>
          )}
        </div>
      </div>

      {/* Extra Costs Modal */}
      <div className="modal fade" id="extraCostsModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="bi bi-receipt me-2"></i>
                Extra Costs Breakdown
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Description</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map(document => (
                      <tr key={document.id}>
                        <td>{document.title}</td>
                        <td>{document.description || '-'}</td>
                        <td className="text-danger">{formatCurrency(document.amount)}</td>
                        <td>{new Date(document.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="table-light">
                    <tr>
                      <th colSpan="2">Total Extra Costs</th>
                      <th className="text-danger">{formatCurrency(totalExtraCost)}</th>
                      <th></th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLossReport;