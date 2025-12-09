import React, { useState, useMemo } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useDocument } from '../context/DocumentContext';

const DailySalesReport = () => {
  const { sales, products } = useInventory();
  const { addSalesBill } = useDocument();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSubmitSection, setShowSubmitSection] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);

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

  // Generate a bill copy for a sale
  const generateBillCopy = (sale) => {
    const product = products.find(p => p.id === sale.productId) || {};
    return {
      id: `${sale.id || Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: sale.date || new Date().toISOString(),
      invoiceNo: sale.invoiceNo || `INV-${Date.now()}`,
      customerName: sale.customerName || 'Walk-in Customer',
      customerPhone: sale.customerPhone || 'N/A',
      customerAddress: sale.customerAddress || 'N/A',
      productName: sale.productName || product.productName || 'Unknown Product',
      productId: sale.productId || 'N/A',
      productCode: product.productCode || 'N/A',
      quantity: sale.quantitySold || 0,
      unitPrice: sale.unitPrice || 0,
      discount: sale.discount || 0,
      tax: sale.tax || 0,
      totalAmount: sale.totalSale || 0,
      paymentStatus: sale.paymentStatus || 'Paid',
      paymentMethod: sale.paymentMethod || 'Cash',
      submittedAt: new Date().toISOString(),
      type: 'sales_bill'
    };
  };

  // Generate Bill Copy HTML with professional design
  const generateBillHTML = (bill) => {
    const logoPath = '/logo.jpeg';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bill - ${bill.invoiceNo}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            font-family: 'Poppins', sans-serif;
            background: #f5f5f5;
            padding: 20px;
          }
          
          .bill-container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            padding: 30px;
            position: relative;
            overflow: hidden;
          }
          
          .bill-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 20px;
            border-bottom: 2px dashed #e0e0e0;
            margin-bottom: 30px;
            position: relative;
          }
          
          .company-info {
            flex: 1;
          }
          
          .logo-container {
            width: 120px;
            height: 120px;
            border-radius: 10px;
            overflow: hidden;
            border: 2px solid #4a90e2;
            padding: 5px;
            background: white;
          }
          
          .logo-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
          
          .company-name {
            font-size: 24px;
            font-weight: 700;
            color: #2c3e50;
            margin-bottom: 5px;
          }
          
          .company-tagline {
            color: #7f8c8d;
            font-size: 14px;
            margin-bottom: 5px;
          }
          
          .bill-title {
            text-align: center;
            margin: 25px 0;
            position: relative;
          }
          
          .bill-title h2 {
            color: #2c3e50;
            font-size: 28px;
            font-weight: 700;
            position: relative;
            display: inline-block;
            padding: 0 20px;
          }
          
          .bill-title h2:before,
          .bill-title h2:after {
            content: '';
            position: absolute;
            top: 50%;
            width: 50px;
            height: 2px;
            background: linear-gradient(90deg, transparent, #4a90e2);
          }
          
          .bill-title h2:before {
            left: -60px;
          }
          
          .bill-title h2:after {
            right: -60px;
            background: linear-gradient(90deg, #4a90e2, transparent);
          }
          
          .bill-details {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          
          .detail-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #4a90e2;
          }
          
          .detail-card h4 {
            color: #2c3e50;
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .detail-card p {
            color: #34495e;
            font-size: 16px;
            font-weight: 500;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 25px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          }
          
          .items-table thead {
            background: linear-gradient(135deg, #4a90e2, #2c3e50);
            color: white;
          }
          
          .items-table th {
            padding: 15px;
            text-align: left;
            font-weight: 600;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .items-table td {
            padding: 15px;
            border-bottom: 1px solid #eee;
          }
          
          .items-table tbody tr:hover {
            background: #f8f9fa;
          }
          
          .items-table tbody tr:last-child td {
            border-bottom: none;
          }
          
          .amount-section {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
          }
          
          .amount-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px dashed #ddd;
          }
          
          .amount-row:last-child {
            border-bottom: none;
            font-weight: 700;
            font-size: 18px;
            color: #2c3e50;
            padding-top: 15px;
            margin-top: 10px;
            border-top: 2px solid #4a90e2;
          }
          
          .payment-info {
            margin-top: 30px;
            padding: 20px;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border-radius: 10px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          
          .payment-status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .status-paid {
            background: #d4edda;
            color: #155724;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            padding-top: 20px;
            border-top: 2px dashed #e0e0e0;
            color: #7f8c8d;
            font-size: 12px;
          }
          
          .thank-you {
            font-size: 18px;
            color: #2c3e50;
            font-weight: 600;
            margin: 20px 0;
            position: relative;
            display: inline-block;
            padding: 0 20px;
          }
          
          .thank-you:before,
          .thank-you:after {
            content: '★';
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            color: #4a90e2;
          }
          
          .thank-you:before {
            left: 0;
          }
          
          .thank-you:after {
            right: 0;
          }
          
          .barcode {
            margin-top: 20px;
            text-align: center;
          }
          
          .barcode span {
            font-family: 'Libre Barcode 128', cursive;
            font-size: 40px;
            letter-spacing: 2px;
          }
          
          @media print {
            body {
              background: white;
              padding: 0;
            }
            
            .bill-container {
              box-shadow: none;
              border: 1px solid #ddd;
              max-width: 100%;
              border-radius: 0;
              padding: 20px;
            }
            
            .no-print {
              display: none !important;
            }
            
            @page {
              margin: 0;
              size: A4 portrait;
            }
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="bill-container">
          <!-- Header with Logo -->
          <div class="bill-header">
            <div class="company-info">
              <div class="company-name">HARDWARE INVENTORY SYSTEM</div>
              <div class="company-tagline">Your Trusted Hardware Solution Provider</div>
              <div class="company-tagline">
                <small>📧 info@hardware.com | 📞 +880 1234-567890</small>
              </div>
            </div>
            <div class="logo-container">
              <img src="${logoPath}" alt="Company Logo" onerror="this.style.display='none'">
            </div>
          </div>
          
          <!-- Bill Title -->
          <div class="bill-title">
            <h2>TAX INVOICE</h2>
          </div>
          
          <!-- Bill Details -->
          <div class="bill-details">
            <div class="detail-card">
              <h4>Invoice Number</h4>
              <p>${bill.invoiceNo}</p>
            </div>
            <div class="detail-card">
              <h4>Invoice Date</h4>
              <p>${new Date(bill.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
            </div>
            <div class="detail-card">
              <h4>Customer Name</h4>
              <p>${bill.customerName}</p>
            </div>
            <div class="detail-card">
              <h4>Customer Phone</h4>
              <p>${bill.customerPhone}</p>
            </div>
          </div>
          
          <!-- Items Table -->
          <table class="items-table">
            <thead>
              <tr>
                <th>SL</th>
                <th>Product Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1</td>
                <td>
                  <strong>${bill.productName}</strong><br>
                  <small>Code: ${bill.productCode}</small>
                </td>
                <td>${bill.quantity}</td>
                <td>${formatCurrency(bill.unitPrice)}</td>
                <td>${formatCurrency(bill.unitPrice * bill.quantity)}</td>
              </tr>
            </tbody>
          </table>
          
          <!-- Amount Calculation -->
          <div class="amount-section">
            <div class="amount-row">
              <span>Subtotal:</span>
              <span>${formatCurrency(bill.unitPrice * bill.quantity)}</span>
            </div>
            ${bill.discount > 0 ? `
            <div class="amount-row">
              <span>Discount (${bill.discount}%):</span>
              <span>-${formatCurrency((bill.unitPrice * bill.quantity) * (bill.discount / 100))}</span>
            </div>
            ` : ''}
            ${bill.tax > 0 ? `
            <div class="amount-row">
              <span>Tax (${bill.tax}%):</span>
              <span>+${formatCurrency((bill.unitPrice * bill.quantity) * (bill.tax / 100))}</span>
            </div>
            ` : ''}
            <div class="amount-row">
              <span>Grand Total:</span>
              <span>${formatCurrency(bill.totalAmount)}</span>
            </div>
          </div>
          
          <!-- Payment Information -->
          <div class="payment-info">
            <div>
              <h4>Payment Status</h4>
              <span class="payment-status ${bill.paymentStatus === 'Paid' ? 'status-paid' : ''}">
                ${bill.paymentStatus}
              </span>
            </div>
            <div>
              <h4>Payment Method</h4>
              <p>${bill.paymentMethod}</p>
            </div>
          </div>
          
          <!-- Barcode -->
          <div class="barcode">
            <span>${bill.invoiceNo.replace(/[^A-Z0-9]/g, '')}</span>
          </div>
          
          <!-- Thank You Message -->
          <div class="thank-you">
            Thank You For Your Business!
          </div>
          
          <!-- Footer -->
          <div class="footer">
            <p>This is a computer generated invoice and does not require signature</p>
            <p><strong>Terms & Conditions:</strong> Goods once sold will not be taken back. Warranty as per manufacturer's policy.</p>
            <p>© ${new Date().getFullYear()} Hardware Inventory System. All rights reserved.</p>
          </div>
        </div>
        
        <!-- Print Instructions -->
        <div class="no-print" style="text-align: center; margin-top: 20px; padding: 20px;">
          <p style="color: #666; font-size: 14px;">
            <strong>Printing Instructions:</strong> For best results, use A4 paper. Press Ctrl+P to print.
          </p>
        </div>
      </body>
      </html>
    `;
  };

  // Print individual bill
  const printBill = (sale) => {
    const bill = generateBillCopy(sale);
    setSelectedBill(bill);
    
    // Delay to ensure state update before printing
    setTimeout(() => {
      const printWindow = window.open('', '_blank');
      const printContent = generateBillHTML(bill);
      
      printWindow.document.write(printContent);
      printWindow.document.close();
      
      // Auto print after a short delay
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    }, 100);
  };

  // Print all bills for selected date
  const printAllBills = () => {
    if (dailySales.length === 0) {
      alert('No sales data available for the selected date.');
      return;
    }

    const printWindow = window.open('', '_blank');
    let billsHtml = '';
    
    dailySales.forEach((sale, index) => {
      const bill = generateBillCopy(sale);
      billsHtml += `
        <div style="page-break-before: ${index > 0 ? 'always' : 'auto'};">
          ${generateBillHTML(bill)}
        </div>
      `;
    });
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Daily Sales Bills - ${new Date(selectedDate).toLocaleDateString()}</title>
      </head>
      <body>
        ${billsHtml}
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // Submit report and generate bills
  const handleSubmitReport = () => {
    if (dailySales.length === 0) {
      alert('No sales data available for the selected date.');
      return;
    }

    // Generate bill copies for all sales
    const newBills = dailySales.map(sale => {
      const bill = generateBillCopy(sale);
      addSalesBill(bill);
      return bill;
    });
    
    alert(`Report submitted successfully! Generated and stored ${newBills.length} bill copies.`);
    setShowSubmitSection(false);
  };

  // Preview Bill Modal
  const BillPreviewModal = ({ bill, onClose }) => {
    if (!bill) return null;

    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Bill Preview - {bill.invoiceNo}</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <h6 className="mb-1">Customer: {bill.customerName}</h6>
                  <small className="text-muted">Date: {new Date(bill.date).toLocaleDateString()}</small>
                </div>
                <div className="text-end">
                  <span className={`badge ${bill.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                    {bill.paymentStatus}
                  </span>
                </div>
              </div>
              
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th className="text-center">Quantity</th>
                      <th className="text-end">Unit Price</th>
                      <th className="text-end">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div>{bill.productName}</div>
                        <small className="text-muted">Code: {bill.productCode}</small>
                      </td>
                      <td className="text-center">{bill.quantity}</td>
                      <td className="text-end">{formatCurrency(bill.unitPrice)}</td>
                      <td className="text-end fw-bold">{formatCurrency(bill.totalAmount)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="row">
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">Payment Details</h6>
                      <div className="mb-2">
                        <small className="text-muted">Method:</small>
                        <div>{bill.paymentMethod}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card">
                    <div className="card-body">
                      <h6 className="card-title">Amount Summary</h6>
                      <div className="d-flex justify-content-between mb-1">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(bill.unitPrice * bill.quantity)}</span>
                      </div>
                      {bill.discount > 0 && (
                        <div className="d-flex justify-content-between mb-1 text-danger">
                          <span>Discount ({bill.discount}%):</span>
                          <span>-{formatCurrency((bill.unitPrice * bill.quantity) * (bill.discount / 100))}</span>
                        </div>
                      )}
                      {bill.tax > 0 && (
                        <div className="d-flex justify-content-between mb-1">
                          <span>Tax ({bill.tax}%):</span>
                          <span>+{formatCurrency((bill.unitPrice * bill.quantity) * (bill.tax / 100))}</span>
                        </div>
                      )}
                      <hr />
                      <div className="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(bill.totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Close
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={() => {
                  const printWindow = window.open('', '_blank');
                  const printContent = generateBillHTML(bill);
                  printWindow.document.write(printContent);
                  printWindow.document.close();
                  printWindow.print();
                }}
              >
                <i className="bi bi-printer me-2"></i>
                Print Bill
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
          <p className="text-muted">Daily Sales Report & Bill Generation</p>
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

      {/* Bill Generation Controls */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-receipt me-2"></i>
            Bill Generation & Printing
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="card border-primary h-100">
                <div className="card-body text-center">
                  <i className="bi bi-printer display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Print Individual Bills</h5>
                  <p className="card-text">Select any transaction below and print a professional bill copy</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-success h-100">
                <div className="card-body text-center">
                  <i className="bi bi-printer-fill display-4 text-success mb-3"></i>
                  <h5 className="card-title">Print All Bills</h5>
                  <p className="card-text">Print all transaction bills for the selected date at once</p>
                  <button 
                    className="btn btn-success mt-2"
                    onClick={printAllBills}
                    disabled={dailySales.length === 0}
                  >
                    <i className="bi bi-printer me-2"></i>
                    Print All ({dailySales.length})
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-info h-100">
                <div className="card-body text-center">
                  <i className="bi bi-cloud-arrow-up display-4 text-info mb-3"></i>
                  <h5 className="card-title">Submit & Save</h5>
                  <p className="card-text">Submit report and save all bills to the system</p>
                  <button 
                    className="btn btn-info mt-2"
                    onClick={() => setShowSubmitSection(true)}
                    disabled={dailySales.length === 0}
                  >
                    <i className="bi bi-upload me-2"></i>
                    Submit Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Report Section */}
      {showSubmitSection && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-cloud-check me-2"></i>
              Confirm Report Submission
            </h5>
          </div>
          <div className="card-body">
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              You are about to submit the sales report for {new Date(selectedDate).toLocaleDateString()}
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">Submission Summary</h6>
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Total Transactions:</span>
                        <span className="fw-bold">{dailySales.length}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Total Products:</span>
                        <span className="fw-bold">{totals.totalQuantity}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Total Revenue:</span>
                        <span className="fw-bold text-success">{formatCurrency(totals.totalRevenue)}</span>
                      </li>
                      <li className="list-group-item d-flex justify-content-between">
                        <span>Bills to Generate:</span>
                        <span className="fw-bold text-primary">{dailySales.length}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h6 className="card-title">What will happen?</h6>
                    <div className="mb-3">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>Bill copies will be automatically generated</span>
                    </div>
                    <div className="mb-3">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>All bills will be stored in the system database</span>
                    </div>
                    <div className="mb-3">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>Data will be available for profit measurement</span>
                    </div>
                    <div className="mb-3">
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      <span>Bills can be accessed anytime from Documents</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowSubmitSection(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleSubmitReport}
                disabled={dailySales.length === 0}
              >
                <i className="bi bi-cloud-arrow-up me-2"></i>
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Total Products</h5>
              <h2>{totals.totalQuantity}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Total Revenue</h5>
              <h2>{formatCurrency(totals.totalRevenue)}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-info">Transactions</h5>
              <h2>{dailySales.length}</h2>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-warning">Bills to Print</h5>
              <h2>{dailySales.length}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Individual Sales with Bill Generation Options */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-receipt-cutoff me-2"></i>
            Sales Transactions - Generate Bill Copies
          </h5>
        </div>
        <div className="card-body">
          {dailySales.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>SL</th>
                    <th>Invoice No</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th className="text-center">Quantity</th>
                    <th>Total Amount</th>
                    <th>Status</th>
                    <th className="text-center">Bill Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySales.map((sale, index) => {
                    const product = products.find(p => p.id === sale.productId) || {};
                    const bill = generateBillCopy(sale);
                    
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <code>{sale.invoiceNo || `INV-${index + 1}`}</code>
                        </td>
                        <td>
                          <div className="fw-medium">{sale.customerName || 'Walk-in Customer'}</div>
                          {sale.customerPhone && (
                            <small className="text-muted">{sale.customerPhone}</small>
                          )}
                        </td>
                        <td>
                          <div>{sale.productName || product.productName}</div>
                          <small className="text-muted">
                            {product.productCode ? `Code: ${product.productCode}` : ''}
                          </small>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-primary rounded-pill">
                            {sale.quantitySold || 0}
                          </span>
                        </td>
                        <td className="fw-bold text-success">{formatCurrency(sale.totalSale || 0)}</td>
                        <td>
                          <span className={`badge ${
                            sale.paymentStatus === 'Paid' ? 'bg-success' : 
                            sale.paymentStatus === 'Pending' ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {sale.paymentStatus || 'Pending'}
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => printBill(sale)}
                              title="Print Bill"
                            >
                              <i className="bi bi-printer"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-info"
                              onClick={() => setSelectedBill(bill)}
                              title="Preview Bill"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => {
                                const bill = generateBillCopy(sale);
                                addSalesBill(bill);
                                alert('Bill saved to system!');
                              }}
                              title="Save Bill"
                            >
                              <i className="bi bi-save"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-receipt display-1 text-muted"></i>
              <h4 className="mt-3">No sales data for selected date</h4>
              <p className="text-muted">
                Select a different date or add sales records to generate bills
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bill Preview Modal */}
      {selectedBill && (
        <BillPreviewModal 
          bill={selectedBill} 
          onClose={() => setSelectedBill(null)} 
        />
      )}
    </div>
  );
};

export default DailySalesReport;