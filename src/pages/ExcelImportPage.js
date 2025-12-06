import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import * as XLSX from 'xlsx';
import { parseExcelFile, formatProductData, formatPurchaseData, formatSalesData } from '../utils/excelUtils';

const ExcelImportPage = () => {
  const { addProduct, purchases, sales } = useInventory();
  const navigate = useNavigate();
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
    setMessage('Processing file... Please wait.');

    try {
      // Parse Excel file
      const excelData = await parseExcelFile(file);
      
      let results = {
        products: 0,
        purchases: 0,
        sales: 0
      };

      // Process Product Master sheet (try different possible sheet names)
      const productSheetNames = ['Product Master', 'Sheet1', 'Products', 'Product_Master'];
      let productSheet = null;
      
      for (const sheetName of productSheetNames) {
        if (excelData[sheetName]) {
          productSheet = excelData[sheetName];
          break;
        }
      }
      
      if (productSheet) {
        const formattedProducts = formatProductData(productSheet);
        
        formattedProducts.forEach(product => {
          addProduct(product);
        });
        
        results.products = formattedProducts.length;
        setMessage(`Successfully imported ${formattedProducts.length} products!`);
      } else {
        setMessage('No product data found in the Excel file.');
      }

      // Process Purchase Record sheet
      if (excelData['Purchase Record']) {
        const formattedPurchases = formatPurchaseData(excelData['Purchase Record']);
        results.purchases = formattedPurchases.length;
        if (formattedPurchases.length > 0) {
          setMessage(prev => prev + ` Imported ${formattedPurchases.length} purchase records.`);
        }
      }

      // Process Sales Record sheet
      if (excelData['Sales Record'] || excelData['Sheet1']) {
        const salesSheet = excelData['Sales Record'] || excelData['Sheet1'];
        // Filter out empty rows
        const validSalesRows = salesSheet.filter(row => 
          row['Product ID'] || row['Product Name'] || row['Customer Name'] || row['Quantity Sold']
        );
        
        if (validSalesRows.length > 0) {
          const formattedSales = formatSalesData(validSalesRows);
          results.sales = formattedSales.length;
          if (formattedSales.length > 0) {
            setMessage(prev => prev + ` Imported ${formattedSales.length} sales records.`);
          }
        }
      }

      setImportResults(results);
      
      // Show success message
      setTimeout(() => {
        setMessage(`Import completed successfully! Products: ${results.products}, Purchases: ${results.purchases}, Sales: ${results.sales}`);
      }, 1000);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setMessage(`Error processing file: ${error.message}`);
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
    // Reset file input
    const fileInput = document.getElementById('excelUpload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const goToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="excel-import-page container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-file-earmark-spreadsheet me-2"></i>
          Excel Data Import
        </h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={goToDashboard}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Instructions Card */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-gradient-primary text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-info-circle me-2"></i>
                <h4 className="mb-0">Import Instructions</h4>
              </div>
            </div>
            <div className="card-body">
              <p>Upload your Excel files to import product data, purchase records, and sales records into the inventory system.</p>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="bi bi-file-earmark-excel text-success me-2"></i> Supported formats: .xlsx, .xls</li>
                    <li className="mb-2"><i className="bi bi-table text-primary me-2"></i> Expected sheets: Product Master, Purchase Record, Sales Record</li>
                    <li className="mb-2"><i className="bi bi-speedometer2 text-info me-2"></i> Data will be processed and displayed in the dashboard</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li className="mb-2"><i className="bi bi-graph-up text-warning me-2"></i> You can check which products are low in quantity or out of stock</li>
                    <li className="mb-2"><i className="bi bi-currency-dollar text-success me-2"></i> Profit calculations will be based on buy price vs sell price</li>
                    <li className="mb-2"><i className="bi bi-shield-check text-primary me-2"></i> All data is securely processed in your browser</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('Error') ? 'alert-danger' : 'alert-success'} d-flex align-items-center alert-dismissible fade show`}>
              <i className={`bi ${message.includes('Error') ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
              {message}
              <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          )}

          {/* Import Options */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body p-4">
              <h5 className="card-title mb-4">
                <i className="bi bi-cloud-arrow-up me-2"></i>
                Upload Excel File
              </h5>
              
              <div className="row g-4">
                <div className="col-md-12">
                  <div className="card h-100 border-dashed border-primary bg-light">
                    <div className="card-body text-center p-5">
                      <i className="bi bi-file-earmark-spreadsheet text-primary" style={{fontSize: '4rem'}}></i>
                      <h5 className="card-title mt-3">Drag & Drop Excel File</h5>
                      <p className="card-text text-muted mb-4">
                        Choose an Excel file containing your inventory data or drag it here
                      </p>
                      <div className="mt-3">
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileUpload}
                          className="form-control form-control-lg"
                          id="excelUpload"
                          disabled={isImporting}
                        />
                        <div className="form-text">
                          Supported formats: .xlsx, .xls
                        </div>
                      </div>
                      {isImporting && (
                        <div className="mt-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Processing...</span>
                          </div>
                          <p className="mt-2 text-primary fw-medium">Importing data, please wait...</p>
                          <div className="progress mt-3">
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '75%'}}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {(importResults.products > 0 || importResults.purchases > 0 || importResults.sales > 0) && (
                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="card bg-gradient-light border-0">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="bi bi-bar-chart me-2"></i>
                          Import Summary
                        </h6>
                        <div className="row text-center g-3">
                          <div className="col-md-4">
                            <div className="p-4 bg-white rounded shadow-sm h-100">
                              <div className="stat-icon bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{width: '60px', height: '60px'}}>
                                <i className="bi bi-box-seam fs-4"></i>
                              </div>
                              <h3 className="text-primary fw-bold">{importResults.products}</h3>
                              <p className="text-muted mb-0">Products Imported</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="p-4 bg-white rounded shadow-sm h-100">
                              <div className="stat-icon bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{width: '60px', height: '60px'}}>
                                <i className="bi bi-cart-plus fs-4"></i>
                              </div>
                              <h3 className="text-success fw-bold">{importResults.purchases}</h3>
                              <p className="text-muted mb-0">Purchases Imported</p>
                            </div>
                          </div>
                          <div className="col-md-4">
                            <div className="p-4 bg-white rounded shadow-sm h-100">
                              <div className="stat-icon bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 mx-auto" style={{width: '60px', height: '60px'}}>
                                <i className="bi bi-currency-dollar fs-4"></i>
                              </div>
                              <h3 className="text-info fw-bold">{importResults.sales}</h3>
                              <p className="text-muted mb-0">Sales Imported</p>
                            </div>
                          </div>
                        </div>
                        <div className="text-center mt-4">
                          <button 
                            className="btn btn-outline-primary me-2"
                            onClick={resetImport}
                          >
                            <i className="bi bi-arrow-repeat me-2"></i>
                            Import Another File
                          </button>
                          <button 
                            className="btn btn-primary"
                            onClick={goToDashboard}
                          >
                            <i className="bi bi-speedometer2 me-2"></i>
                            View Dashboard
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Supported File Formats */}
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h5 className="card-title">
                <i className="bi bi-question-circle me-2"></i>
                Supported File Formats
              </h5>
              <p className="mb-4">Your Excel files should contain the following sheets with these column headers:</p>
              <div className="row g-4">
                <div className="col-md-4">
                  <div className="border rounded p-4 h-100 bg-white shadow-sm">
                    <div className="feature-icon bg-primary bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px'}}>
                      <i className="bi bi-box-seam"></i>
                    </div>
                    <h6>
                      <i className="bi bi-table text-primary me-2"></i>
                      Product Master
                    </h6>
                    <ul className="small ps-3 mb-0">
                      <li className="py-1">Product Code</li>
                      <li className="py-1">Product Name</li>
                      <li className="py-1">Category</li>
                      <li className="py-1">Quantity</li>
                      <li className="py-1">Unit Rate (Buy Price)</li>
                      <li className="py-1">Sell Rate</li>
                      <li className="py-1">Material, Brand, Model No</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-4 h-100 bg-white shadow-sm">
                    <div className="feature-icon bg-success bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px'}}>
                      <i className="bi bi-cart-plus"></i>
                    </div>
                    <h6>
                      <i className="bi bi-table text-success me-2"></i>
                      Purchase Record
                    </h6>
                    <ul className="small ps-3 mb-0">
                      <li className="py-1">Date</li>
                      <li className="py-1">Invoice No</li>
                      <li className="py-1">Product ID</li>
                      <li className="py-1">Quantity Purchased</li>
                      <li className="py-1">Unit Price</li>
                      <li className="py-1">Supplier</li>
                      <li className="py-1">Payment Status</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-4 h-100 bg-white shadow-sm">
                    <div className="feature-icon bg-warning bg-gradient text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '50px', height: '50px'}}>
                      <i className="bi bi-currency-dollar"></i>
                    </div>
                    <h6>
                      <i className="bi bi-table text-warning me-2"></i>
                      Sales Record
                    </h6>
                    <ul className="small ps-3 mb-0">
                      <li className="py-1">Date</li>
                      <li className="py-1">Invoice No</li>
                      <li className="py-1">Customer Name</li>
                      <li className="py-1">Product ID</li>
                      <li className="py-1">Quantity Sold</li>
                      <li className="py-1">Total Sale</li>
                      <li className="py-1">Payment Status</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="alert alert-info mt-4 mb-0">
                <i className="bi bi-lightbulb me-2"></i>
                <strong>Tip:</strong> You can download a sample template from the Export section to see the exact format required.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportPage;