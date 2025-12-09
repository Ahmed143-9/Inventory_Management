import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useDocument } from '../context/DocumentContext';
import { useNavigate } from 'react-router-dom';

const DailySalesReport = () => {
  const { sales, products, addSale } = useInventory();
  const { addSalesBill } = useDocument();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSubmitSection, setShowSubmitSection] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [showBillInputForm, setShowBillInputForm] = useState(false);
  const [billFormData, setBillFormData] = useState({
    invoiceNo: '',
    customerName: '',
    customerPhone: '',
    customerAddress: '',
    productId: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    discount: 0,
    tax: 0,
    paymentStatus: 'Paid',
    paymentMethod: 'Cash',
    remarks: ''
  });
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showProductSuggestions, setShowProductSuggestions] = useState(false);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [recentCustomers, setRecentCustomers] = useState([]);
  const [showCustomerSuggestions, setShowCustomerSuggestions] = useState(false);
  const [quickInputMode, setQuickInputMode] = useState(false);
  const [quickInputText, setQuickInputText] = useState('');
  const navigate = useNavigate();
  
  const productSearchRef = useRef(null);
  const customerNameRef = useRef(null);

  // Filter sales by selected date
  const dailySales = useMemo(() => {
    return sales.filter(sale => {
      if (!sale.date) return false;
      
      const saleDate = new Date(sale.date);
      const selectedDateObj = new Date(selectedDate);
      
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

  // Extract recent customers from sales
  useEffect(() => {
    const uniqueCustomers = [];
    const seenCustomers = new Set();
    
    sales.slice().reverse().forEach(sale => {
      if (sale.customerName && sale.customerName !== 'Walk-in Customer' && !seenCustomers.has(sale.customerName)) {
        seenCustomers.add(sale.customerName);
        uniqueCustomers.push({
          name: sale.customerName,
          phone: sale.customerPhone,
          lastPurchase: sale.date
        });
      }
      if (uniqueCustomers.length >= 10) return;
    });
    
    setRecentCustomers(uniqueCustomers);
  }, [sales]);

  // Generate invoice number
  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}${day}-${random}`;
  };

  // Initialize form
  useEffect(() => {
    if (showBillInputForm) {
      setBillFormData(prev => ({
        ...prev,
        invoiceNo: generateInvoiceNumber(),
        date: selectedDate
      }));
    }
  }, [showBillInputForm, selectedDate]);

  // Auto-complete for product search
  useEffect(() => {
    if (productSearchTerm.trim()) {
      const filtered = products.filter(product =>
        product.productName?.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
        product.productCode?.toLowerCase().includes(productSearchTerm.toLowerCase())
      ).slice(0, 8);
      setFilteredProducts(filtered);
      setShowProductSuggestions(true);
    } else {
      setFilteredProducts([]);
      setShowProductSuggestions(false);
    }
  }, [productSearchTerm, products]);

  // Handle product selection from suggestions
  const handleProductSelect = (product) => {
    setBillFormData({
      ...billFormData,
      productId: product.id,
      productName: product.productName,
      productCode: product.productCode,
      unitPrice: product.sellingPrice || 0
    });
    setProductSearchTerm(product.productName);
    setShowProductSuggestions(false);
  };

  // Handle customer selection from suggestions
  const handleCustomerSelect = (customer) => {
    setBillFormData({
      ...billFormData,
      customerName: customer.name,
      customerPhone: customer.phone || ''
    });
    setShowCustomerSuggestions(false);
  };

  // Quick input parsing function
  const parseQuickInput = (input) => {
    // Example input: "john 01712345678 hammer 2 500 cash"
    const parts = input.trim().split(/\s+/);
    const result = {
      customerName: '',
      customerPhone: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      paymentMethod: 'Cash'
    };

    let i = 0;
    
    // Parse customer name (first word)
    if (parts.length > i) {
      result.customerName = parts[i];
      i++;
    }

    // Check if second part is phone number
    if (parts.length > i && /^01[3-9]\d{8}$/.test(parts[i])) {
      result.customerPhone = parts[i];
      i++;
    }

    // Product name (could be multiple words)
    const productWords = [];
    while (i < parts.length && isNaN(parts[i])) {
      productWords.push(parts[i]);
      i++;
    }
    result.productName = productWords.join(' ');

    // Quantity
    if (parts.length > i && !isNaN(parts[i])) {
      result.quantity = parseInt(parts[i]);
      i++;
    }

    // Unit price
    if (parts.length > i && !isNaN(parts[i])) {
      result.unitPrice = parseFloat(parts[i]);
      i++;
    }

    // Payment method
    if (parts.length > i) {
      const method = parts[i].toLowerCase();
      if (['cash', 'card', 'bkash', 'nagad', 'bank'].includes(method)) {
        result.paymentMethod = method.charAt(0).toUpperCase() + method.slice(1);
      }
    }

    return result;
  };

  // Handle quick input
  const handleQuickInputSubmit = () => {
    if (!quickInputText.trim()) return;

    const parsed = parseQuickInput(quickInputText);
    
    // Find product by name
    const foundProduct = products.find(p => 
      p.productName.toLowerCase().includes(parsed.productName.toLowerCase()) ||
      p.productCode.toLowerCase().includes(parsed.productName.toLowerCase())
    );

    if (!foundProduct) {
      alert(`Product "${parsed.productName}" not found. Please use full form.`);
      return;
    }

    // Set form data
    setBillFormData({
      invoiceNo: generateInvoiceNumber(),
      customerName: parsed.customerName || 'Walk-in Customer',
      customerPhone: parsed.customerPhone || '',
      customerAddress: '',
      productId: foundProduct.id,
      productName: foundProduct.productName,
      productCode: foundProduct.productCode,
      quantity: parsed.quantity || 1,
      unitPrice: parsed.unitPrice || foundProduct.sellingPrice || 0,
      discount: 0,
      tax: 0,
      paymentStatus: 'Paid',
      paymentMethod: parsed.paymentMethod || 'Cash',
      remarks: 'Quick Input'
    });

    setQuickInputText('');
    setQuickInputMode(false);
    alert('Data loaded! Please review and submit.');
  };

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = billFormData.quantity * billFormData.unitPrice;
    const discountAmount = subtotal * (billFormData.discount / 100);
    const taxAmount = subtotal * (billFormData.tax / 100);
    const total = subtotal - discountAmount + taxAmount;
    
    return {
      subtotal,
      discountAmount,
      taxAmount,
      total
    };
  };

  // Handle form submit
  const handleBillSubmit = (e) => {
    e.preventDefault();
    
    if (!billFormData.productId) {
      alert('Please select a product');
      return;
    }

    const totals = calculateTotals();
    
    const newSale = {
      id: Date.now().toString(),
      date: selectedDate,
      invoiceNo: billFormData.invoiceNo,
      customerName: billFormData.customerName || 'Walk-in Customer',
      customerPhone: billFormData.customerPhone,
      customerAddress: billFormData.customerAddress,
      productId: billFormData.productId,
      productName: billFormData.productName,
      quantitySold: parseInt(billFormData.quantity),
      unitPrice: parseFloat(billFormData.unitPrice),
      totalSale: totals.total,
      discount: parseFloat(billFormData.discount),
      tax: parseFloat(billFormData.tax),
      paymentStatus: billFormData.paymentStatus,
      paymentMethod: billFormData.paymentMethod,
      remarks: billFormData.remarks,
      createdAt: new Date().toISOString()
    };

    // Add to sales
    addSale(newSale);

    // Generate and save bill copy
    const billCopy = generateBillCopy(newSale);

    addSalesBill(billCopy);

    // Reset form
    setBillFormData({
      invoiceNo: generateInvoiceNumber(),
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      discount: 0,
      tax: 0,
      paymentStatus: 'Paid',
      paymentMethod: 'Cash',
      remarks: ''
    });
    
    setProductSearchTerm('');
    setShowBillInputForm(false);
    alert('Bill added successfully!');
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '৳0.00';
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BDT'
      }).format(amount);
    } catch (error) {
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
    
    const printWindow = window.open('', '_blank');
    const printContent = generateBillHTML(bill);
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
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

  // Quick Input Modal
  const QuickInputModal = () => {
    const examples = [
      "john 01712345678 hammer 2 500 cash",
      "smith nail 5 100",
      "alex screwdriver 1 250 bkash",
      "walkin paint 3 1200"
    ];

    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Quick Bill Input</h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={() => setQuickInputMode(false)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="alert alert-info">
                <i className="bi bi-lightbulb me-2"></i>
                <strong>Type everything in one line!</strong> The system will automatically parse customer, product, quantity, price, and payment method.
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">Enter Bill Details</label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Example: john 01712345678 hammer 2 500 cash"
                    value={quickInputText}
                    onChange={(e) => setQuickInputText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleQuickInputSubmit()}
                    autoFocus
                  />
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={handleQuickInputSubmit}
                    disabled={!quickInputText.trim()}
                  >
                    <i className="bi bi-arrow-right"></i>
                  </button>
                </div>
                <div className="form-text">
                  Press Enter or click the arrow to process
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">Format Examples</h6>
                </div>
                <div className="card-body">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Input</th>
                        <th>Parsed As</th>
                      </tr>
                    </thead>
                    <tbody>
                      {examples.map((example, idx) => (
                        <tr key={idx}>
                          <td>
                            <code className="text-primary">{example}</code>
                          </td>
                          <td>
                            <small className="text-muted">
                              {(() => {
                                const parsed = parseQuickInput(example);
                                return `Customer: ${parsed.customerName}, Product: ${parsed.productName}, Qty: ${parsed.quantity}, Price: ${parsed.unitPrice}, Payment: ${parsed.paymentMethod}`;
                              })()}
                            </small>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-3">
                <h6>Quick Reference:</h6>
                <ul className="list-unstyled">
                  <li><small><strong>Format:</strong> [Customer] [Phone] [Product] [Quantity] [Price] [Payment]</small></li>
                  <li><small><strong>Phone:</strong> Optional, must start with 01 and 11 digits</small></li>
                  <li><small><strong>Product:</strong> Must exist in your product list</small></li>
                  <li><small><strong>Payment:</strong> Cash, Card, bKash, Nagad, Bank (optional, defaults to Cash)</small></li>
                </ul>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={() => setQuickInputMode(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="btn btn-primary"
                onClick={handleQuickInputSubmit}
                disabled={!quickInputText.trim()}
              >
                <i className="bi bi-magic me-2"></i>
                Process Input
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Bill Input Form Component
  const BillInputForm = () => {
    const totals = calculateTotals();
    
    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-xl modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Create New Bill</h5>
              <div className="d-flex gap-2">
                <button 
                  type="button"
                  className="btn btn-sm btn-outline-warning"
                  onClick={() => {
                    setQuickInputMode(true);
                    setShowBillInputForm(false);
                  }}
                >
                  <i className="bi bi-lightning me-1"></i>
                  Quick Input
                </button>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowBillInputForm(false)}
                ></button>
              </div>
            </div>
            <form onSubmit={handleBillSubmit}>
              <div className="modal-body">
                <div className="row">
                  {/* Left Column - Customer Info */}
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Customer Information</h6>
                        <small className="text-muted">Click on recent customer</small>
                      </div>
                      <div className="card-body">
                        <div className="mb-3">
                          <label className="form-label">Invoice Number *</label>
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control"
                              value={billFormData.invoiceNo}
                              onChange={(e) => setBillFormData({...billFormData, invoiceNo: e.target.value})}
                              required
                            />
                            <button 
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => setBillFormData({...billFormData, invoiceNo: generateInvoiceNumber()})}
                            >
                              <i className="bi bi-arrow-clockwise"></i>
                            </button>
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label">Customer Name *</label>
                          <input
                            ref={customerNameRef}
                            type="text"
                            className="form-control"
                            value={billFormData.customerName}
                            onChange={(e) => {
                              setBillFormData({...billFormData, customerName: e.target.value});
                              setShowCustomerSuggestions(true);
                            }}
                            placeholder="Type name or select below"
                            required
                          />
                          
                          {/* Customer Suggestions */}
                          {showCustomerSuggestions && recentCustomers.length > 0 && (
                            <div className="list-group mt-1" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                              <button
                                type="button"
                                className="list-group-item list-group-item-action"
                                onClick={() => {
                                  setBillFormData({...billFormData, customerName: 'Walk-in Customer', customerPhone: ''});
                                  setShowCustomerSuggestions(false);
                                }}
                              >
                                <i className="bi bi-person me-2"></i>
                                <strong>Walk-in Customer</strong>
                              </button>
                              {recentCustomers.map((customer, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  className="list-group-item list-group-item-action"
                                  onClick={() => handleCustomerSelect(customer)}
                                >
                                  <div className="d-flex justify-content-between">
                                    <div>
                                      <i className="bi bi-person-check me-2"></i>
                                      <strong>{customer.name}</strong>
                                      {customer.phone && (
                                        <span className="ms-2 text-muted">{customer.phone}</span>
                                      )}
                                    </div>
                                    <small className="text-muted">
                                      {new Date(customer.lastPurchase).toLocaleDateString()}
                                    </small>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Phone Number</label>
                            <input
                              type="tel"
                              className="form-control"
                              value={billFormData.customerPhone}
                              onChange={(e) => setBillFormData({...billFormData, customerPhone: e.target.value})}
                              placeholder="01XXXXXXXXX"
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Date</label>
                            <input
                              type="date"
                              className="form-control"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label className="form-label">Address</label>
                          <textarea
                            className="form-control"
                            rows="2"
                            value={billFormData.customerAddress}
                            onChange={(e) => setBillFormData({...billFormData, customerAddress: e.target.value})}
                            placeholder="Optional"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Column - Product & Payment */}
                  <div className="col-md-6">
                    <div className="card h-100">
                      <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0">Product & Payment Details</h6>
                        <small className="text-muted">Type and select from list</small>
                      </div>
                      <div className="card-body">
                        {/* Product Search */}
                        <div className="mb-3">
                          <label className="form-label">Search Product *</label>
                          <div className="input-group">
                            <input
                              ref={productSearchRef}
                              type="text"
                              className="form-control"
                              value={productSearchTerm}
                              onChange={(e) => setProductSearchTerm(e.target.value)}
                              placeholder="Type product name or code..."
                              required
                            />
                            <button 
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={() => {
                                setProductSearchTerm('');
                                setBillFormData({...billFormData, productId: '', productName: '', unitPrice: 0});
                              }}
                            >
                              <i className="bi bi-x"></i>
                            </button>
                          </div>
                          
                          {/* Product Suggestions */}
                          {showProductSuggestions && filteredProducts.length > 0 && (
                            <div className="list-group mt-1" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                              {filteredProducts.map(product => (
                                <button
                                  key={product.id}
                                  type="button"
                                  className="list-group-item list-group-item-action"
                                  onClick={() => handleProductSelect(product)}
                                >
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <strong>{product.productName}</strong>
                                      <br />
                                      <small className="text-muted">
                                        Code: {product.productCode} | 
                                        Price: {formatCurrency(product.sellingPrice || 0)} | 
                                        Stock: {product.quantity || 0}
                                      </small>
                                    </div>
                                    <i className="bi bi-arrow-right text-primary"></i>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {/* Selected Product Display */}
                        {billFormData.productId && (
                          <div className="alert alert-success mb-3">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <strong>{billFormData.productName}</strong>
                                <div className="text-muted">
                                  Price: {formatCurrency(billFormData.unitPrice)} | 
                                  Code: {products.find(p => p.id === billFormData.productId)?.productCode || 'N/A'}
                                </div>
                              </div>
                              <div className="d-flex gap-2">
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() => {
                                    const product = products.find(p => p.id === billFormData.productId);
                                    if (product) {
                                      setBillFormData({...billFormData, unitPrice: product.sellingPrice || 0});
                                    }
                                  }}
                                  title="Reset to original price"
                                >
                                  <i className="bi bi-arrow-counterclockwise"></i>
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => {
                                    setBillFormData({...billFormData, productId: '', productName: '', unitPrice: 0});
                                    setProductSearchTerm('');
                                  }}
                                  title="Clear selection"
                                >
                                  <i className="bi bi-x"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {/* Quantity and Price */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Quantity *</label>
                            <div className="input-group">
                              <button 
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setBillFormData({...billFormData, quantity: Math.max(1, billFormData.quantity - 1)})}
                              >
                                <i className="bi bi-dash"></i>
                              </button>
                              <input
                                type="number"
                                className="form-control text-center"
                                min="1"
                                value={billFormData.quantity}
                                onChange={(e) => setBillFormData({...billFormData, quantity: e.target.value})}
                                required
                              />
                              <button 
                                type="button"
                                className="btn btn-outline-secondary"
                                onClick={() => setBillFormData({...billFormData, quantity: parseInt(billFormData.quantity) + 1})}
                              >
                                <i className="bi bi-plus"></i>
                              </button>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Unit Price *</label>
                            <div className="input-group">
                              <span className="input-group-text">৳</span>
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                step="0.01"
                                value={billFormData.unitPrice}
                                onChange={(e) => setBillFormData({...billFormData, unitPrice: e.target.value})}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Quick Price Buttons */}
                        <div className="row mb-3">
                          <div className="col-12">
                            <label className="form-label">Quick Price Adjust</label>
                            <div className="d-flex flex-wrap gap-1">
                              {[50, 100, 200, 500, 1000, 2000].map(price => (
                                <button
                                  key={price}
                                  type="button"
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => setBillFormData({...billFormData, unitPrice: price})}
                                >
                                  ৳{price}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Discount and Tax */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Discount (%)</label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                max="100"
                                value={billFormData.discount}
                                onChange={(e) => setBillFormData({...billFormData, discount: e.target.value})}
                              />
                              <span className="input-group-text">%</span>
                            </div>
                            <div className="form-text">
                              Discount: {formatCurrency(totals.discountAmount)}
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Tax (%)</label>
                            <div className="input-group">
                              <input
                                type="number"
                                className="form-control"
                                min="0"
                                value={billFormData.tax}
                                onChange={(e) => setBillFormData({...billFormData, tax: e.target.value})}
                              />
                              <span className="input-group-text">%</span>
                            </div>
                            <div className="form-text">
                              Tax: {formatCurrency(totals.taxAmount)}
                            </div>
                          </div>
                        </div>
                        
                        {/* Payment Details */}
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <label className="form-label">Payment Status</label>
                            <select
                              className="form-select"
                              value={billFormData.paymentStatus}
                              onChange={(e) => setBillFormData({...billFormData, paymentStatus: e.target.value})}
                            >
                              <option value="Paid">Paid</option>
                              <option value="Pending">Pending</option>
                              <option value="Partial">Partial</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Payment Method</label>
                            <div className="d-flex flex-wrap gap-1">
                              {['Cash', 'bKash', 'Nagad', 'Card', 'Bank'].map(method => (
                                <button
                                  key={method}
                                  type="button"
                                  className={`btn btn-sm ${billFormData.paymentMethod === method ? 'btn-primary' : 'btn-outline-primary'}`}
                                  onClick={() => setBillFormData({...billFormData, paymentMethod: method})}
                                >
                                  {method}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Remarks */}
                        <div className="mb-3">
                          <label className="form-label">Remarks</label>
                          <textarea
                            className="form-control"
                            rows="2"
                            value={billFormData.remarks}
                            onChange={(e) => setBillFormData({...billFormData, remarks: e.target.value})}
                            placeholder="Any additional notes..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Total Summary */}
                <div className="card mt-3">
                  <div className="card-header">
                    <h6 className="mb-0">Bill Summary</h6>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <tbody>
                              <tr>
                                <td width="40%">Subtotal</td>
                                <td width="20%" className="text-end">{billFormData.quantity} × {formatCurrency(billFormData.unitPrice)}</td>
                                <td width="40%" className="text-end">{formatCurrency(totals.subtotal)}</td>
                              </tr>
                              {billFormData.discount > 0 && (
                                <tr>
                                  <td>Discount ({billFormData.discount}%)</td>
                                  <td className="text-end"></td>
                                  <td className="text-end text-danger">-{formatCurrency(totals.discountAmount)}</td>
                                </tr>
                              )}
                              {billFormData.tax > 0 && (
                                <tr>
                                  <td>Tax ({billFormData.tax}%)</td>
                                  <td className="text-end"></td>
                                  <td className="text-end">+{formatCurrency(totals.taxAmount)}</td>
                                </tr>
                              )}
                              <tr className="table-primary">
                                <td><strong>Grand Total</strong></td>
                                <td className="text-end"></td>
                                <td className="text-end"><strong>{formatCurrency(totals.total)}</strong></td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-grid gap-2 h-100">
                          <button type="submit" className="btn btn-primary btn-lg">
                            <i className="bi bi-save me-2"></i>
                            Save & Print Bill
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-success btn-lg"
                            onClick={(e) => {
                              e.preventDefault();
                              handleBillSubmit(e);
                              const bill = generateBillCopy({
                                ...billFormData,
                                date: selectedDate,
                                quantitySold: parseInt(billFormData.quantity),
                                totalSale: totals.total
                              });
                              // Print after save
                              setTimeout(() => {
                                const printWindow = window.open('', '_blank');
                                printWindow.document.write(generateBillHTML(bill));
                                printWindow.document.close();
                                printWindow.print();
                              }, 500);
                            }}
                          >
                            <i className="bi bi-printer me-2"></i>
                            Save & Print Now
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-outline-secondary"
                            onClick={() => setShowBillInputForm(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  // Main component return
  return (
    <div className="container-fluid py-4">
      {/* Quick Input Modal */}
      {quickInputMode && <QuickInputModal />}
      
      {/* Bill Input Form Modal */}
      {showBillInputForm && <BillInputForm />}

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-calendar-day me-2"></i>
          Daily Sales Report
        </h2>
        <div className="d-flex gap-2">
          <button 
            className="btn btn-warning"
            onClick={() => setQuickInputMode(true)}
          >
            <i className="bi bi-lightning me-2"></i>
            Quick Input
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => setShowBillInputForm(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Full Form
          </button>
        </div>
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
          <p className="text-muted">Daily Sales Report & Bill Management</p>
          <hr />
          <div className="row align-items-center">
            <div className="col-md-4 text-start">
              <h5>Date: {new Date(selectedDate).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</h5>
            </div>
            <div className="col-md-4">
              <input 
                type="date" 
                className="form-control"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div className="col-md-4 text-end">
              <button 
                className="btn btn-outline-info"
                onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              >
                <i className="bi bi-calendar-check me-2"></i>
                Today
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats and Actions */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-primary shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-primary">Total Products</h5>
              <h2>{totals.totalQuantity}</h2>
              <small className="text-muted">Sold today</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-success shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-success">Total Revenue</h5>
              <h2>{formatCurrency(totals.totalRevenue)}</h2>
              <small className="text-muted">Today's sales</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-info shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-info">Transactions</h5>
              <h2>{dailySales.length}</h2>
              <small className="text-muted">Bills today</small>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-warning shadow-sm">
            <div className="card-body text-center">
              <h5 className="card-title text-warning">Pending Bills</h5>
              <h2>{dailySales.filter(s => s.paymentStatus === 'Pending').length}</h2>
              <small className="text-muted">To collect</small>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Management Actions */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-receipt me-2"></i>
            Bill Management
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-3">
              <div className="card border-primary h-100">
                <div className="card-body text-center">
                  <i className="bi bi-lightning display-4 text-primary mb-3"></i>
                  <h5 className="card-title">Quick Input</h5>
                  <p className="card-text">Type everything in one line</p>
                  <button 
                    className="btn btn-primary mt-2 w-100"
                    onClick={() => setQuickInputMode(true)}
                  >
                    <i className="bi bi-lightning me-2"></i>
                    Quick Input
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-success h-100">
                <div className="card-body text-center">
                  <i className="bi bi-printer display-4 text-success mb-3"></i>
                  <h5 className="card-title">Print All</h5>
                  <p className="card-text">Print all bills for selected date</p>
                  <button 
                    className="btn btn-success mt-2 w-100"
                    onClick={printAllBills}
                    disabled={dailySales.length === 0}
                  >
                    <i className="bi bi-printer me-2"></i>
                    Print ({dailySales.length})
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-info h-100">
                <div className="card-body text-center">
                  <i className="bi bi-cloud-arrow-up display-4 text-info mb-3"></i>
                  <h5 className="card-title">Submit Report</h5>
                  <p className="card-text">Save all bills to system</p>
                  <button 
                    className="btn btn-info mt-2 w-100"
                    onClick={() => setShowSubmitSection(true)}
                    disabled={dailySales.length === 0}
                  >
                    <i className="bi bi-upload me-2"></i>
                    Submit
                  </button>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-warning h-100">
                <div className="card-body text-center">
                  <i className="bi bi-file-earmark-excel display-4 text-warning mb-3"></i>
                  <h5 className="card-title">Export Data</h5>
                  <p className="card-text">Export to Excel/PDF</p>
                  <button 
                    className="btn btn-warning mt-2 w-100"
                    onClick={() => alert('Export feature coming soon!')}
                    disabled={dailySales.length === 0}
                  >
                    <i className="bi bi-download me-2"></i>
                    Export
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Bills Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-receipt-cutoff me-2"></i>
              Today's Bills ({dailySales.length})
            </h5>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-sm btn-outline-success"
                onClick={printAllBills}
                disabled={dailySales.length === 0}
              >
                <i className="bi bi-printer me-2"></i>
                Print All
              </button>
              <button 
                className="btn btn-sm btn-outline-primary"
                onClick={() => setShowBillInputForm(true)}
              >
                <i className="bi bi-plus me-2"></i>
                Add Bill
              </button>
              <button 
                className="btn btn-sm btn-outline-warning"
                onClick={() => setQuickInputMode(true)}
              >
                <i className="bi bi-lightning me-2"></i>
                Quick Add
              </button>
            </div>
          </div>
        </div>
        <div className="card-body">
          {dailySales.length > 0 ? (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>SL</th>
                    <th>Invoice No</th>
                    <th>Time</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th className="text-center">Qty</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {dailySales.map((sale, index) => {
                    const product = products.find(p => p.id === sale.productId) || {};
                    const saleTime = sale.createdAt ? new Date(sale.createdAt) : new Date();
                    
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <code className="text-primary">{sale.invoiceNo || `INV-${index + 1}`}</code>
                          <br />
                          <small className="text-muted">{saleTime.toLocaleTimeString()}</small>
                        </td>
                        <td>{saleTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
                        <td>
                          <div className="fw-medium">{sale.customerName || 'Walk-in'}</div>
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
                          <br />
                          <small className="text-muted">{sale.paymentMethod || 'Cash'}</small>
                        </td>
                        <td>
                          <div className="d-flex gap-1 justify-content-center">
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => printBill(sale)}
                              title="Print Bill"
                            >
                              <i className="bi bi-printer"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-info"
                              title="View Details"
                              onClick={() => {
                                const bill = generateBillCopy(sale);
                                setSelectedBill(bill);
                              }}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success"
                              title="Edit"
                              onClick={() => {
                                // Navigate to edit or show edit modal
                                alert('Edit feature coming soon!');
                              }}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <th colSpan="5" className="text-end">Totals:</th>
                    <th className="text-center">{totals.totalQuantity}</th>
                    <th className="text-success fw-bold">{formatCurrency(totals.totalRevenue)}</th>
                    <th colSpan="2"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-receipt display-1 text-muted"></i>
              <h4 className="mt-3">No bills for selected date</h4>
              <p className="text-muted">
                Create a new bill or select a different date
              </p>
              <div className="d-flex justify-content-center gap-3 mt-3">
                <button 
                  className="btn btn-warning"
                  onClick={() => setQuickInputMode(true)}
                >
                  <i className="bi bi-lightning me-2"></i>
                  Quick Input
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowBillInputForm(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Full Form
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Report Modal */}
      {showSubmitSection && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Submit Daily Report</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowSubmitSection(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  You are about to submit the sales report for {new Date(selectedDate).toLocaleDateString()}
                </div>
                
                <div className="card mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Summary</h6>
                    <div className="row">
                      <div className="col-6">
                        <small className="text-muted">Total Bills</small>
                        <div className="fw-bold">{dailySales.length}</div>
                      </div>
                      <div className="col-6">
                        <small className="text-muted">Total Amount</small>
                        <div className="fw-bold text-success">{formatCurrency(totals.totalRevenue)}</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Note:</strong> Once submitted, bills will be finalized and cannot be edited.
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowSubmitSection(false)}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={handleSubmitReport}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  Confirm Submission
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Preview Modal */}
      {selectedBill && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bill Preview - {selectedBill.invoiceNo}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedBill(null)}></button>
              </div>
              <div className="modal-body">
                <div className="d-flex justify-content-between mb-4">
                  <div>
                    <h6 className="mb-1">Customer: {selectedBill.customerName}</h6>
                    <small className="text-muted">Date: {new Date(selectedBill.date).toLocaleDateString()}</small>
                  </div>
                  <div className="text-end">
                    <span className={`badge ${selectedBill.paymentStatus === 'Paid' ? 'bg-success' : 'bg-warning'}`}>
                      {selectedBill.paymentStatus}
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
                          <div>{selectedBill.productName}</div>
                          <small className="text-muted">Code: {selectedBill.productCode}</small>
                        </td>
                        <td className="text-center">{selectedBill.quantity}</td>
                        <td className="text-end">{formatCurrency(selectedBill.unitPrice)}</td>
                        <td className="text-end fw-bold">{formatCurrency(selectedBill.totalAmount)}</td>
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
                          <div>{selectedBill.paymentMethod}</div>
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
                          <span>{formatCurrency(selectedBill.unitPrice * selectedBill.quantity)}</span>
                        </div>
                        {selectedBill.discount > 0 && (
                          <div className="d-flex justify-content-between mb-1 text-danger">
                            <span>Discount ({selectedBill.discount}%):</span>
                            <span>-{formatCurrency((selectedBill.unitPrice * selectedBill.quantity) * (selectedBill.discount / 100))}</span>
                          </div>
                        )}
                        {selectedBill.tax > 0 && (
                          <div className="d-flex justify-content-between mb-1">
                            <span>Tax ({selectedBill.tax}%):</span>
                            <span>+{formatCurrency((selectedBill.unitPrice * selectedBill.quantity) * (selectedBill.tax / 100))}</span>
                          </div>
                        )}
                        <hr />
                        <div className="d-flex justify-content-between fw-bold">
                          <span>Total:</span>
                          <span>{formatCurrency(selectedBill.totalAmount)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedBill(null)}>
                  Close
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={() => {
                    const printWindow = window.open('', '_blank');
                    const printContent = generateBillHTML(selectedBill);
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
      )}
    </div>
  );
};

export default DailySalesReport;