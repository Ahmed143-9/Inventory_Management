import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';

const DailySalesReport = () => {
  const { sales, products } = useInventory();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Filter sales by selected date
  const dailySales = useMemo(() => {
    return sales.filter(sale => {
      if (!sale.date) return false;
      
      // Parse dates and normalize them to the same timezone
      const saleDate = new Date(sale.date);
      const selectedDateObj = new Date(selectedDate);
      
      // Reset time portion for accurate date comparison
      saleDate.setHours(0, 0, 0, 0);
      selectedDateObj.setHours(0, 0, 0, 0);
      
      return saleDate.getTime() === selectedDateObj.getTime();
    });
  }, [sales, selectedDate]);

  // Calculate totals
  const totals = useMemo(() => {
    return dailySales.reduce((acc, sale) => {
      acc.totalQuantity += sale.quantitySold || 0;
      acc.totalRevenue += sale.totalSale || 0;
      return acc;
    }, { totalQuantity: 0, totalRevenue: 0 });
  }, [dailySales]);

  // Group sales by product
  const salesByProduct = useMemo(() => {
    const productMap = {};
    products.forEach(product => {
      productMap[product.id || product.productId] = product;
    });

    const grouped = {};
    dailySales.forEach(sale => {
      const productId = sale.productId;
      const product = productMap[productId] || {};
      
      if (!grouped[productId]) {
        grouped[productId] = {
          productCode: product.productCode || sale.productId,
          productName: product.productName || sale.productName || 'Unknown Product',
          totalQuantity: 0,
          totalRevenue: 0,
          sales: []
        };
      }
      
      grouped[productId].totalQuantity += sale.quantitySold || 0;
      grouped[productId].totalRevenue += sale.totalSale || 0;
      grouped[productId].sales.push(sale);
    });
    
    return Object.values(grouped);
  }, [dailySales, products]);

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
          <i className="bi bi-calendar-day me-2"></i>
          Daily Sales Report
        </h2>
      </div>

      {/* Company Logo and Header */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body text-center">
          <div className="company-logo mb-3">
            <img 
              src="/logo.jpeg" 
              alt="Company Logo" 
              className="img-fluid" 
              style={{maxHeight: '80px', width: 'auto'}}
            />
          </div>
          <h3 className="mb-1">Hardware Inventory System</h3>
          <p className="text-muted">Daily Sales Report</p>
          <hr />
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5>Date: {new Date(selectedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</h5>
            </div>
            <div>
              <input 
                type="date" 
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-primary shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-primary">Total Products Sold</h5>
              <h2>{totals.totalQuantity}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-success shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-success">Total Revenue</h5>
              <h2>{formatCurrency(totals.totalRevenue)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-info shadow-sm">
            <div className="card-body">
              <h5 className="card-title text-info">Total Transactions</h5>
              <h2>{dailySales.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Sales by Product */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-table me-2"></i>
            Sales by Product
          </h5>
        </div>
        <div className="card-body">
          {salesByProduct.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Product Code</th>
                    <th>Product Name</th>
                    <th className="text-center">Quantity Sold</th>
                    <th>Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {salesByProduct.map((product, index) => (
                    <tr key={index}>
                      <td>{product.productCode}</td>
                      <td>{product.productName}</td>
                      <td className="text-center">{product.totalQuantity}</td>
                      <td className="text-success fw-bold">{formatCurrency(product.totalRevenue)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <th colSpan="2">Totals</th>
                    <th className="text-center">{totals.totalQuantity}</th>
                    <th className="text-success fw-bold">{formatCurrency(totals.totalRevenue)}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-info-circle display-1 text-muted"></i>
              <h4 className="mt-3">No sales data for selected date</h4>
              <p className="text-muted">
                Select a different date or add sales records
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Individual Sales Details */}
      {dailySales.length > 0 && (
        <div className="card shadow-sm border-0 mt-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-list me-2"></i>
              Detailed Sales Records
            </h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Invoice No</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th className="text-center">Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySales.map((sale, index) => {
                    const product = products.find(p => p.id === sale.productId) || {};
                    return (
                      <tr key={index}>
                        <td>{sale.invoiceNo || 'N/A'}</td>
                        <td>{sale.customerName || 'N/A'}</td>
                        <td>{sale.productName || product.productName || 'Unknown Product'}</td>
                        <td className="text-center">{sale.quantitySold || 0}</td>
                        <td>{formatCurrency(sale.unitPrice || 0)}</td>
                        <td className="text-success fw-bold">{formatCurrency(sale.totalSale || 0)}</td>
                        <td>
                          <span className={`badge ${
                            sale.paymentStatus === 'Paid' ? 'bg-success' : 
                            sale.paymentStatus === 'Pending' ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {sale.paymentStatus || 'N/A'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySalesReport;