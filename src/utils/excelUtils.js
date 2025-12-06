import * as XLSX from 'xlsx';

/**
 * Parse Excel file and extract data from different sheets
 * @param {File} file - Excel file to parse
 * @returns {Promise<Object>} Parsed data from all sheets
 */
export const parseExcelFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        const result = {};
        
        // Process each sheet
        workbook.SheetNames.forEach(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
          result[sheetName] = jsonData;
        });
        
        resolve(result);
      } catch (error) {
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

/**
 * Convert Product Master sheet data to product objects
 * Handles various sheet formats including your uploaded files
 * @param {Array} rawData - Raw data from Product Master sheet
 * @returns {Array} Formatted product objects
 */
export const formatProductData = (rawData) => {
  return rawData.map((row, index) => {
    // Skip empty rows
    if ((!row['Product'] && !row['Product Name']) || 
        (row['Product'] === undefined && row['Product Name'] === undefined)) {
      return null;
    }
    
    // Handle different column names in various Excel formats
    const productCode = row['Product Code'] || 
                       row['D-LEVER-556---'] || 
                       row['D-LEVER-5570---'] || 
                       row['D-ROUND-9216---'] || 
                       row['D-ATM R-5798XL---'] || 
                       row['D-ENA G-0---'] || 
                       row['D-UNION-9800---'] || 
                       row['D-FEZA - ---'] || 
                       row['D-EASY -0---'] || 
                       row['D-DASHI-0---'] || 
                       row['D-TAIWA-0---'] || 
                       row['S-STAR -0---'] || 
                       row['C-MARS -0---'] || 
                       row['C-RAZ C-0---'] || 
                       row['D-JB DR-0---'] || 
                       row['D-CAMEL-0---'] || 
                       row['H-ATM H-2618-A3---'] || 
                       row['H-ATM H-510-008---'] || 
                       row['H-ATM H-516-016---'] || 
                       row['B-ATM S-0---'] || 
                       row['H-ARS H-538---'] || 
                       row['B-ATM B-221-56 ---'] || 
                       row['B-ATM B-72-51---'] || 
                       row['H-EASY -801-105---'] || 
                       row['H-EASY -816-016---'] || 
                       row['H-EASY -817-24 ---'] || 
                       row['H-EASY -917-024---'] || 
                       row['H-EASY - 301-10---'] || 
                       row['H-EASY -301-105---'] || 
                       row['H-EASY -916-016---'] || 
                       row['H-ATM H-917-007---'] || 
                       row['H-FSB H-81---'] || 
                       row['H-ATM H-916-016---'] || 
                       row['S-FSB S-0---'] || 
                       row['S-BRASS-0---'] || 
                       row['H-EASY -815-K04---'] || 
                       row['H-FSB H-301-081---'] || 
                       row['H-FSB H-301-081---'] || 
                       row['H-FSB H-301-081---'] || 
                       row['H-FSB H-301-081---'] || 
                       row['H-FSB H-301-081---'] || 
                       row['-DOORI-0---'] || 
                       row['-BULLE-0---'] || 
                       row['-FSB G-0---'] || 
                       row['D-FSB G-0---'] || 
                       row['D-BOSS -0---'] || 
                       row['H-HEJBO-0---'] || 
                       row['H-DOOR -0---'] || 
                       row['N- SILV----'] || 
                       row['N- BLAC----'] || 
                       row['N-GOLDE----'] || 
                       row['N-SILVE----'] || 
                       row['N- BLAC----'] || 
                       row['N-GOLDE----'] || 
                       row['N- SILV----'] || 
                       row['N-BLACK----'] || 
                       row['N-GOLDE----'] || 
                       row['0-BLACK----'] || 
                       row['0-MALE ----'] || 
                       row['P- PVC ----'] || 
                       row['P- NALI----'] || 
                       row['R-RING----'] || 
                       row['C-SS CL----'] || 
                       row['C-CHINA----'] || 
                       row['C- SS C----'] || 
                       row['C-LOCK ----'] || 
                       row['H-HINGE----'] || 
                       row['C-HINGE----'] || 
                       row['C- SS C----'] || 
                       row['C-SILVE----'] || 
                       row['C-BLACK----'] || 
                       row['C-GOLDE----'] || 
                       '';
                       
    const productName = row['Product Name'] || row['Product'] || '';
    const productType = row['Product'] || row['Product Name'] || '';
    const size = row['Size'] || '';
    const modelNo = row['Model No'] || 
                   row['556'] || 
                   row['5570'] || 
                   row['9216'] || 
                   row['5798XL'] || 
                   row['9800'] || 
                   row['5880'] || 
                   row['801-105 (medium size)'] || 
                   row['816-016 (medium size)'] || 
                   row['817-24 (medium size)'] || 
                   row['2618-A34'] || 
                   row['510-008'] || 
                   row['516-016'] || 
                   row['221-56'] || 
                   row['72-51'] || 
                   row['538'] || 
                   row['C949-1'] || 
                   row['C929-1'] || 
                   row['X7'] || 
                   row['917-024'] || 
                   row['301-105'] || 
                   row['916-016'] || 
                   row['917-007'] || 
                   row['81'] || 
                   row['815-K04'] || 
                   row['301-081'] || 
                   '';
                   
    const material = row['Material'] || '';
    const color = row['Color'] || row['Golden 20p'] || '';
    const category = row['Category'] || productType || 'Uncategorized';
    const unitQty = parseInt(row['Unit Qty']) || 1;
    const unit = row['Unit'] || 'PCS';
    const unitRate = parseFloat(row['Unit Rate']) || parseFloat(row['Total Buy']) || 0;
    const quantity = parseInt(row['Quantity']) || 0;
    const sellRate = parseFloat(row['Sell Rate']) || parseFloat(row['Approximate Rate']) || 0;
    const totalBuy = parseFloat(row['Total Buy']) || (unitRate * quantity) || 0;

    return {
      id: Date.now() + index, // Temporary ID, will be replaced by database
      productCode: productCode,
      product: productType,
      productName: productName,
      size: size,
      brand: row['Brand'] || '',
      grade: row['Grade'] || '',
      material: material,
      color: color,
      modelNo: modelNo,
      category: category,
      unitQty: unitQty,
      unit: unit,
      unitRate: unitRate,
      totalBuy: totalBuy,
      quantity: quantity,
      approximateRate: parseFloat(row['Approximate Rate']) || sellRate,
      authenticationRate: parseFloat(row['Authentication Rate']) || 0,
      sellRate: sellRate,
      description: row['Description'] || '', // Add description field
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      // Calculate profit margin
      profitMargin: unitRate > 0 ? ((sellRate - unitRate) / unitRate * 100) : 0
    };
  }).filter(item => item !== null);
};

/**
 * Convert Purchase Record sheet data to purchase objects
 * @param {Array} rawData - Raw data from Purchase Record sheet
 * @returns {Array} Formatted purchase objects
 */
export const formatPurchaseData = (rawData) => {
  return rawData.map((row, index) => {
    // Skip empty rows
    if ((!row['Product ID'] && !row['Product Name']) || 
        (row['Product ID'] === undefined && row['Product Name'] === undefined)) {
      return null;
    }
    
    return {
      id: Date.now() + index, // Temporary ID
      invoiceNo: row['Invoice No'] || '',
      productId: row['Product ID'] || '',
      productName: row['Product Name'] || '',
      model: row['Model'] || '',
      size: row['Size'] || '',
      colorOrMaterial: row['Color or material'] || '',
      quality: row['Quality'] || '',
      quantityPurchased: parseInt(row['Quantity Purchased']) || 0,
      unitPrice: parseFloat(row['Unit Price (Buy)']) || 0,
      totalCost: parseFloat(row['Total Purchase Cost']) || 0,
      supplier: row['Supplier'] || '',
      paymentStatus: row['Payment Status'] || 'Pending',
      purchaseDate: row['Date'] ? new Date(row['Date']).toISOString() : new Date().toISOString()
    };
  }).filter(item => item !== null);
};

/**
 * Convert Sales Record sheet data to sales objects
 * @param {Array} rawData - Raw data from Sales Record sheet
 * @returns {Array} Formatted sales objects
 */
export const formatSalesData = (rawData) => {
  return rawData.map((row, index) => {
    // Skip empty rows
    if ((!row['Product ID'] && !row['Product Name']) || 
        (row['Product ID'] === undefined && row['Product Name'] === undefined)) {
      return null;
    }
    
    return {
      id: Date.now() + index, // Temporary ID
      invoiceNo: row['Invoice No'] || '',
      customerId: '', // Will need to be linked to customer
      customerName: row['Customer Name'] || '',
      productId: row['Product ID'] || '',
      productName: row['Product Name'] || '',
      quantitySold: parseInt(row['Quantity Sold']) || 0,
      unitPrice: parseFloat(row['Unit Price (Sell)']) || 0,
      totalSale: parseFloat(row['Total Sale']) || 0,
      paymentStatus: row['Payment Status'] || 'Pending',
      saleDate: row['Date'] ? new Date(row['Date']).toISOString() : new Date().toISOString()
    };
  }).filter(item => item !== null);
};

/**
 * Export products to Excel format
 * @param {Array} products - Array of product objects
 * @returns {Blob} Excel file blob
 */
export const exportProductsToExcel = (products) => {
  // Format data for Excel
  const excelData = products.map(product => ({
    'No.': '', // Will be auto-filled
    'Product': product.product || '',
    'Product Name': product.productName || '',
    'Size': product.size || '',
    'Brand': product.brand || '',
    'Grade': product.grade || '',
    'Material': product.material || '',
    'Color': product.color || '',
    'Model No': product.modelNo || '',
    'Product Code': product.productCode || '',
    'Unit Qty': product.unitQty || 1,
    'Unit': product.unit || 'PCS',
    'Unit Rate': product.unitRate || 0,
    'Total Buy': product.totalBuy || 0,
    'Category': product.category || 'Uncategorized',
    'Quantity': product.quantity || 0,
    'Approximate Rate': product.approximateRate || 0,
    'Authentication Rate': product.authenticationRate || 0,
    'Sell Rate': product.sellRate || 0,
    'Description': product.description || ''
  }));
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Product Master');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
};

/**
 * Export purchases to Excel format
 * @param {Array} purchases - Array of purchase objects
 * @returns {Blob} Excel file blob
 */
export const exportPurchasesToExcel = (purchases) => {
  // Format data for Excel
  const excelData = purchases.map(purchase => ({
    'Date': purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleDateString() : '',
    'Invoice No': purchase.invoiceNo || '',
    'Product ID': purchase.productId || '',
    'Product Name': purchase.productName || '',
    'Model': purchase.model || '',
    'Size': purchase.size || '',
    'Color or material': purchase.colorOrMaterial || '',
    'Quality': purchase.quality || '',
    'Quantity Purchased': purchase.quantityPurchased || 0,
    'Unit Price (Buy)': purchase.unitPrice || 0,
    'Total Purchase Cost': purchase.totalCost || 0,
    'Supplier': purchase.supplier || '',
    'Payment Status': purchase.paymentStatus || 'Pending'
  }));
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Purchase Record');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
};

/**
 * Export sales to Excel format
 * @param {Array} sales - Array of sales objects
 * @returns {Blob} Excel file blob
 */
export const exportSalesToExcel = (sales) => {
  // Format data for Excel
  const excelData = sales.map(sale => ({
    'Date': sale.saleDate ? new Date(sale.saleDate).toLocaleDateString() : '',
    'Invoice No': sale.invoiceNo || '',
    'Customer Name': sale.customerName || '',
    'Product ID': sale.productId || '',
    'Product Name': sale.productName || '',
    'Quantity Sold': sale.quantitySold || 0,
    'Unit Price (Sell)': sale.unitPrice || 0,
    'Total Sale': sale.totalSale || 0,
    'Payment Status': sale.paymentStatus || 'Pending'
  }));
  
  // Create workbook
  const ws = XLSX.utils.json_to_sheet(excelData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Record');
  
  // Generate buffer
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], { type: 'application/octet-stream' });
};