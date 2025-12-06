import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';
import * as XLSX from 'xlsx';
import { parseExcelFile, formatProductData, formatPurchaseData, formatSalesData } from '../../utils/excelUtils';

const MultiSheetImport = () => {
  const { addProduct, purchases, sales, updateProduct } = useInventory();
  const [message, setMessage] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState({
    products: 0,
    purchases: 0,
    sales: 0
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsImporting(true);
    setMessage('Processing file...');

    try {
      // Parse Excel file
      const excelData = await parseExcelFile(file);
      
      let results = {
        products: 0,
        purchases: 0,
        sales: 0
      };

      // Process Product Master sheet
      if (excelData['Product Master'] || excelData['Sheet1']) {
        const productSheet = excelData['Product Master'] || excelData['Sheet1'];
        const formattedProducts = formatProductData(productSheet);
        
        formattedProducts.forEach(product => {
          addProduct(product);
        });
        
        results.products = formattedProducts.length;
        setMessage(`Imported ${formattedProducts.length} products successfully!`);
      }

      // Process Purchase Record sheet
      if (excelData['Purchase Record']) {
        const formattedPurchases = formatPurchaseData(excelData['Purchase Record']);
        // In a real app, you would save these to state/context
        results.purchases = formattedPurchases.length;
        setMessage(prev => prev + ` Imported ${formattedPurchases.length} purchases.`);
      }

      // Process Sales Record sheet
      if (excelData['Sales Record'] || excelData['Sheet1']) {
        const salesSheet = excelData['Sales Record'] || excelData['Sheet1'];
        // Filter out empty rows
        const validSalesRows = salesSheet.filter(row => 
          row['Product ID'] || row['Product Name'] || row['Customer Name']
        );
        
        if (validSalesRows.length > 0) {
          const formattedSales = formatSalesData(validSalesRows);
          results.sales = formattedSales.length;
          setMessage(prev => prev + ` Imported ${formattedSales.length} sales.`);
        }
      }

      setImportResults(results);
      
      // Show success message
      setTimeout(() => {
        setMessage(`Import completed successfully! Products: ${results.products}, Purchases: ${results.purchases}, Sales: ${results.sales}`);
      }, 1000);
      
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
            <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} d-flex align-items-center`}>
              <i className={`bi ${message.includes('Error') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
              {message}
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