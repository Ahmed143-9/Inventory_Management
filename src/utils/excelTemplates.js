import * as XLSX from 'xlsx';

/**
 * Generate a template for Product Master sheet
 * @returns {Blob} Excel file blob with Product Master template
 */
export const generateProductTemplate = () => {
  // Sample product data structure
  const productData = [
    {
      'No.': '',
      'Product': 'Door Lock',
      'Product Name': 'Lever Lock AROMA',
      'Size': '556',
      'Brand': '',
      'Grade': '',
      'Material': '',
      'Color': '',
      'Model No': '556',
      'Product Code': 'D-LEVER-556---',
      'Unit Qty': 0,
      'Unit': 'PCS',
      'Unit Rate': 0,
      'Total Buy': 0,
      'Category': 'Door Lock',
      'Quantity': 0,
      'Approximate Rate': 0,
      'Authentication Rate': 0,
      'Sell Rate': 0
    },
    {
      'No.': '',
      'Product': 'Door Lock',
      'Product Name': 'Round lock SMB',
      'Size': '9216',
      'Brand': '',
      'Grade': '',
      'Material': '',
      'Color': '',
      'Model No': '9216',
      'Product Code': 'D-ROUND-9216---',
      'Unit Qty': 0,
      'Unit': 'PCS',
      'Unit Rate': 0,
      'Total Buy': 0,
      'Category': 'Door Lock',
      'Quantity': 0,
      'Approximate Rate': 0,
      'Authentication Rate': 0,
      'Sell Rate': 0
    },
    {
      'No.': '',
      'Product': 'screw',
      'Product Name': 'star screw prime - quality',
      'Size': '5 /8\'\'',
      'Brand': '',
      'Grade': '',
      'Material': '',
      'Color': '',
      'Model No': '',
      'Product Code': 'S-STAR -0---',
      'Unit Qty': 5,
      'Unit': 'PCS',
      'Unit Rate': 0,
      'Total Buy': 0,
      'Category': 'screw',
      'Quantity': 0,
      'Approximate Rate': 0,
      'Authentication Rate': 0,
      'Sell Rate': 0
    }
  ];
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(productData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Product Master');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
};

/**
 * Generate a template for Purchase Record sheet
 * @returns {Blob} Excel file blob with Purchase Record template
 */
export const generatePurchaseTemplate = () => {
  // Sample purchase data structure
  const purchaseData = [
    {
      'Date': new Date().toISOString().split('T')[0],
      'Invoice No': 'INV-001',
      'Product ID': 'D-LEVER-556---',
      'Product Name': 'Lever Lock AROMA',
      'Model': '556',
      'Size': '556',
      'Color or material': 'AB',
      'Quality': '',
      'Quantity Purchased': 6,
      'Unit Price (Buy)': 0,
      'Total Purchase Cost': 0,
      'Supplier': 'Sample Supplier',
      'Payment Status': 'Paid'
    },
    {
      'Date': new Date().toISOString().split('T')[0],
      'Invoice No': 'INV-002',
      'Product ID': 'D-ROUND-9216---',
      'Product Name': 'Round lock SMB',
      'Model': '9216',
      'Size': '9216',
      'Color or material': 'CF',
      'Quality': '',
      'Quantity Purchased': 5,
      'Unit Price (Buy)': 0,
      'Total Purchase Cost': 0,
      'Supplier': 'Sample Supplier',
      'Payment Status': 'Pending'
    }
  ];
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(purchaseData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Purchase Record');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
};

/**
 * Generate a template for Sales Record sheet
 * @returns {Blob} Excel file blob with Sales Record template
 */
export const generateSalesTemplate = () => {
  // Sample sales data structure
  const salesData = [
    {
      'Date': new Date().toISOString().split('T')[0],
      'Invoice No': 'SL-001',
      'Customer Name': 'Sample Customer',
      'Product ID': 'D-LEVER-556---',
      'Product Name': 'Lever Lock AROMA',
      'Quantity Sold': 2,
      'Unit Price (Sell)': 0,
      'Total Sale': 0,
      'Payment Status': 'Paid'
    },
    {
      'Date': new Date().toISOString().split('T')[0],
      'Invoice No': 'SL-002',
      'Customer Name': 'Sample Customer',
      'Product ID': 'D-ROUND-9216---',
      'Product Name': 'Round lock SMB',
      'Quantity Sold': 1,
      'Unit Price (Sell)': 0,
      'Total Sale': 0,
      'Payment Status': 'Pending'
    }
  ];
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(salesData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Record');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
};

/**
 * Generate a template for Profit Loss sheet
 * @returns {Blob} Excel file blob with Profit Loss template
 */
export const generateProfitLossTemplate = () => {
  // Sample profit/loss data structure
  const profitLossData = [
    {
      'Date': new Date().toISOString().split('T')[0],
      'Product ID': 'D-LEVER-556---',
      'Product Name': 'Lever Lock AROMA',
      'Quantity Sold': 2,
      'Total Sale Amount': 0,
      'Total Purchase Cost': 0,
      'Profit/Loss': 0
    },
    {
      'Date': new Date().toISOString().split('T')[0],
      'Product ID': 'D-ROUND-9216---',
      'Product Name': 'Round lock SMB',
      'Quantity Sold': 1,
      'Total Sale Amount': 0,
      'Total Purchase Cost': 0,
      'Profit/Loss': 0
    }
  ];
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(profitLossData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Profit Loss');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
};

/**
 * Generate a multi-sheet template with all sheets
 * @returns {Blob} Excel file blob with all templates
 */
export const generateMultiSheetTemplate = () => {
  // Create workbook
  const wb = XLSX.utils.book_new();
  
  // Add Product Master sheet
  const productData = [
    {
      'No.': '',
      'Product': 'Door Lock',
      'Product Name': 'Lever Lock AROMA',
      'Size': '556',
      'Brand': '',
      'Grade': '',
      'Material': '',
      'Color': '',
      'Model No': '556',
      'Product Code': 'D-LEVER-556---',
      'Unit Qty': 0,
      'Unit': 'PCS',
      'Unit Rate': 0,
      'Total Buy': 0,
      'Category': 'Door Lock',
      'Quantity': 0,
      'Approximate Rate': 0,
      'Authentication Rate': 0,
      'Sell Rate': 0
    }
  ];
  const productWs = XLSX.utils.json_to_sheet(productData);
  XLSX.utils.book_append_sheet(wb, productWs, 'Product Master');
  
  // Add Purchase Record sheet
  const purchaseData = [
    {
      'Date': new Date().toISOString().split('T')[0],
      'Invoice No': 'INV-001',
      'Product ID': 'D-LEVER-556---',
      'Product Name': 'Lever Lock AROMA',
      'Model': '556',
      'Size': '556',
      'Color or material': 'AB',
      'Quality': '',
      'Quantity Purchased': 6,
      'Unit Price (Buy)': 0,
      'Total Purchase Cost': 0,
      'Supplier': 'Sample Supplier',
      'Payment Status': 'Paid'
    }
  ];
  const purchaseWs = XLSX.utils.json_to_sheet(purchaseData);
  XLSX.utils.book_append_sheet(wb, purchaseWs, 'Purchase Record');
  
  // Add Sales Record sheet
  const salesData = [
    {
      'Date': new Date().toISOString().split('T')[0],
      'Invoice No': 'SL-001',
      'Customer Name': 'Sample Customer',
      'Product ID': 'D-LEVER-556---',
      'Product Name': 'Lever Lock AROMA',
      'Quantity Sold': 2,
      'Unit Price (Sell)': 0,
      'Total Sale': 0,
      'Payment Status': 'Paid'
    }
  ];
  const salesWs = XLSX.utils.json_to_sheet(salesData);
  XLSX.utils.book_append_sheet(wb, salesWs, 'Sales Record');
  
  // Add Profit Loss sheet
  const profitLossData = [
    {
      'Date': new Date().toISOString().split('T')[0],
      'Product ID': 'D-LEVER-556---',
      'Product Name': 'Lever Lock AROMA',
      'Quantity Sold': 2,
      'Total Sale Amount': 0,
      'Total Purchase Cost': 0,
      'Profit/Loss': 0
    }
  ];
  const profitLossWs = XLSX.utils.json_to_sheet(profitLossData);
  XLSX.utils.book_append_sheet(wb, profitLossWs, 'Profit Loss');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
};