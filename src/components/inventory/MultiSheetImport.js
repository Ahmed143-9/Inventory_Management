import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import * as XLSX from 'xlsx';
import { parseExcelFile, formatProductData, formatPurchaseData, formatSalesData, validateProduct, validatePurchase, validateSale } from '../../utils/excelUtils';

const MultiSheetImport = () => {
  const { addProduct, addPurchase, addSale } = useInventory();
  const [message, setMessage] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState({
    products: 0,
    purchases: 0,
    sales: 0
  });
  const [validationErrors, setValidationErrors] = useState([]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setMessage('Processing file...');
    setValidationErrors([]);

    try {
      // Parse Excel file
      const excelData = await parseExcelFile(file);
      
      let results = {
        products: 0,
        purchases: 0,
        sales: 0
      };
      
      let allErrors = [];

      // Process Product Master sheet (supporting various sheet names)
      const productSheetNames = ['Product Master', 'Products', 'Product_Master', 'Sheet1'];
      let productSheet = null;
      
      for (const sheetName of productSheetNames) {
        if (excelData[sheetName]) {
          productSheet = excelData[sheetName];
          break;
        }
      }
      
      if (productSheet) {
        const { formattedData, errors: formatErrors } = formatProductData(productSheet);
        allErrors = [...allErrors, ...formatErrors];
        
        let validProducts = 0;
        let productErrors = [];
        
        formattedData.forEach((product, index) => {
          // Validate product data
          const errors = validateProduct(product);
          if (errors.length === 0) {
            addProduct(product);
            validProducts++;
          } else {
            productErrors.push({
              type: 'Product',
              row: index + 2,
              name: product.productName || 'Unknown',
              errors
            });
          }
        });
        
        allErrors = [...allErrors, ...productErrors];
        results.products = validProducts;
        setMessage(`Processed ${validProducts} valid products!`);
      }

      // Process Purchase Record sheet (supporting various sheet names)
      const purchaseSheetNames = ['Purchase Record', 'Purchases', 'Purchase_Record', 'Sheet1'];
      let purchaseSheet = null;
      
      for (const sheetName of purchaseSheetNames) {
        if (excelData[sheetName] && sheetName !== 'Sheet1') { // Prefer specifically named sheets
          purchaseSheet = excelData[sheetName];
          break;
        } else if (excelData[sheetName] && !productSheet && sheetName === 'Sheet1') { // Only use Sheet1 if no products used it
          purchaseSheet = excelData[sheetName];
          break;
        }
      }
      
      if (purchaseSheet) {
        const { formattedData, errors: formatErrors } = formatPurchaseData(purchaseSheet);
        allErrors = [...allErrors, ...formatErrors];
        
        let validPurchases = 0;
        let purchaseErrors = [];
        
        formattedData.forEach((purchase, index) => {
          // Validate purchase data
          const errors = validatePurchase(purchase);
          if (errors.length === 0) {
            addPurchase(purchase);
            validPurchases++;
          } else {
            purchaseErrors.push({
              type: 'Purchase',
              row: index + 2,
              name: purchase.productName || purchase.invoiceNo || 'Unknown',
              errors
            });
          }
        });
        
        allErrors = [...allErrors, ...purchaseErrors];
        results.purchases = validPurchases;
        setMessage(prev => prev + ` Processed ${validPurchases} valid purchases.`);
      }

      // Process Sales Record sheet (supporting various sheet names)
      const salesSheetNames = ['Sales Record', 'Sales', 'Sales_Record', 'Sheet1'];
      let salesSheet = null;
      
      for (const sheetName of salesSheetNames) {
        if (excelData[sheetName] && sheetName !== 'Sheet1') { // Prefer specifically named sheets
          salesSheet = excelData[sheetName];
          break;
        } else if (excelData[sheetName] && !productSheet && !purchaseSheet && sheetName === 'Sheet1') { // Only use Sheet1 if no products or purchases used it
          salesSheet = excelData[sheetName];
          break;
        }
      }
      
      if (salesSheet) {
        // Filter out empty rows
        const validSalesRows = salesSheet.filter(row => 
          row['Product ID'] || row['Product Name'] || row['Customer Name'] || row['Quantity Sold']
        );
        
        if (validSalesRows.length > 0) {
          const { formattedData, errors: formatErrors } = formatSalesData(validSalesRows);
          allErrors = [...allErrors, ...formatErrors];
          
          let validSales = 0;
          let salesErrors = [];
          
          formattedData.forEach((sale, index) => {
            // Validate sale data
            const errors = validateSale(sale);
            if (errors.length === 0) {
              addSale(sale);
              validSales++;
            } else {
              salesErrors.push({
                type: 'Sale',
                row: index + 2,
                name: sale.productName || sale.customerName || sale.invoiceNo || 'Unknown',
                errors
              });
            }
          });
          
          allErrors = [...allErrors, ...salesErrors];
          results.sales = validSales;
          setMessage(prev => prev + ` Processed ${validSales} valid sales.`);
        }
      }

      setImportResults(results);
      setValidationErrors(allErrors);
      
      // Show success/error message
      if (allErrors.length > 0) {
        setMessage(prev => prev + ` Found ${allErrors.length} validation errors. Please check the details below.`);
      } else {
        setTimeout(() => {
          setMessage(`Import completed successfully! Products: ${results.products}, Purchases: ${results.purchases}, Sales: ${results.sales}`);
        }, 1000);
      }
      
    } catch (error) {
      console.error('Error processing file:', error);
      setMessage('Error processing file. Please check the file format and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const resetImport = () => {
    setMessage('');
    setImportResults({
      products: 0,
      purchases: 0,
      sales: 0
    });
    setValidationErrors([]);
  };

  return (
    <div className="multi-sheet-import-container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header Card */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-info text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                <h4 className="mb-0">Multi-Sheet Excel Import</h4>
              </div>
              <p className="mb-0 mt-1 opacity-75">Import data from Excel files with multiple sheets</p>
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('Error') || validationErrors.length > 0 ? 'alert-warning' : 'alert-success'} d-flex align-items-center`}>
              <i className={`bi ${message.includes('Error') || validationErrors.length > 0 ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
              {message}
            </div>
          )}

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-warning text-white py-3">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <h5 className="mb-0">Validation Errors ({validationErrors.length})</h5>
                </div>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Type</th>
                        <th>Row</th>
                        <th>Name/ID</th>
                        <th>Errors</th>
                      </tr>
                    </thead>
                    <tbody>
                      {validationErrors.map((error, index) => (
                        <tr key={index}>
                          <td>
                            <span className={`badge ${
                              error.type === 'Product' ? 'bg-primary' :
                              error.type === 'Purchase' ? 'bg-success' : 'bg-info'
                            }`}>
                              {error.type}
                            </span>
                          </td>
                          <td>{error.row}</td>
                          <td>{error.name}</td>
                          <td>
                            <ul className="mb-0">
                              {error.errors.map((err, errIndex) => (
                                <li key={errIndex} className="text-danger">{err}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="alert alert-info mt-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Please correct these errors in your Excel file and try importing again.
                </div>
              </div>
            </div>
          )}

          {/* Import Options */}
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h5 className="card-title mb-4">Upload Excel File</h5>
              
              <div className="row g-4">
                <div className="col-md-12">
                  <div className="card h-100 border">
                    <div className="card-body text-center p-4">
                      <i className="bi bi-cloud-arrow-up text-primary" style={{fontSize: '3rem'}}></i>
                      <h5 className="card-title mt-3">Upload Multi-Sheet Excel File</h5>
                      <p className="card-text text-muted">
                        Upload an Excel file containing multiple sheets: Product Master, Purchase Record, Sales Record
                      </p>
                      <div className="mt-3">
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileUpload}
                          className="form-control"
                          id="multiSheetUpload"
                          disabled={isImporting}
                        />
                      </div>
                      {isImporting && (
                        <div className="mt-3">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Processing...</span>
                          </div>
                          <p className="mt-2">Importing data, please wait...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {importResults.products > 0 || importResults.purchases > 0 || importResults.sales > 0 ? (
                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="bi bi-bar-chart me-2"></i>
                          Import Summary
                        </h6>
                        <div className="row text-center">
                          <div className="col-md-4">
                            <div className="p-3">
                              <h3 className="text-primary">{importResults.products}</h3>
                              <p className="text-muted mb-0">Products Imported</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="p-3">
                              <h3 className="text-success">{importResults.purchases}</h3>
                              <p className="text-muted mb-0">Purchases Imported</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="p-3">
                              <h3 className="text-info">{importResults.sales}</h3>
                              <p className="text-muted mb-0">Sales Imported</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-3">
                          <button 
                            className="btn btn-outline-primary"
                            onClick={resetImport}
                          >
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Import Another File
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiSheetImport;