import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { parseExcelFile, formatProductData, formatPurchaseData, formatSalesData, validateProduct, validatePurchase, validateSale } from '../utils/excelUtils';
import { generateProductTemplate, generatePurchaseTemplate, generateSalesTemplate, generateProfitLossTemplate, generateMultiSheetTemplate } from '../utils/excelTemplates';

const ExcelImportPage = () => {
  const { addProduct, addPurchase, addSale } = useInventory();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [importStatus, setImportStatus] = useState({
    message: '',
    type: 'info', // 'info', 'success', 'error', 'warning'
    isProcessing: false,
    results: {
      products: { count: 0, processed: 0, failed: 0 },
      purchases: { count: 0, processed: 0, failed: 0 },
      sales: { count: 0, processed: 0, failed: 0 }
    },
    validationErrors: []
  });

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validExtensions = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      setImportStatus(prev => ({
        ...prev,
        message: `Invalid file format. Please upload ${validExtensions.join(', ')} files only.`,
        type: 'error'
      }));
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setImportStatus(prev => ({
        ...prev,
        message: 'File size exceeds 10MB limit. Please upload a smaller file.',
        type: 'error'
      }));
      return;
    }

    setImportStatus(prev => ({
      ...prev,
      isProcessing: true,
      message: 'Validating and processing file...',
      type: 'info',
      validationErrors: []
    }));

    try {
      const excelData = await parseExcelFile(file);
      
      const results = {
        products: { count: 0, processed: 0, failed: 0 },
        purchases: { count: 0, processed: 0, failed: 0 },
        sales: { count: 0, processed: 0, failed: 0 }
      };

      const validationErrors = [];

      // Process Product Master sheet
      const productSheet = findSheetByName(excelData, ['Product Master', 'Products', 'Product_Master', 'Sheet1']);
      if (productSheet && productSheet.length > 0) {
        try {
          const { formattedData, errors } = formatProductData(productSheet);
          results.products.count = formattedData.length;
          
          formattedData.forEach((product, index) => {
            try {
              // Validate product data
              const productErrors = validateProduct(product);
              if (productErrors.length > 0) {
                results.products.failed++;
                validationErrors.push({
                  sheet: 'Product Master',
                  row: index + 2,
                  error: productErrors.join(', '),
                  data: product
                });
                return;
              }
              
              addProduct(product);
              results.products.processed++;
            } catch (error) {
              results.products.failed++;
              validationErrors.push({
                sheet: 'Product Master',
                row: index + 2,
                error: error.message,
                data: product
              });
            }
          });
          
          if (errors && errors.length > 0) {
            validationErrors.push(...errors.map(err => ({ ...err, sheet: 'Product Master' })));
          }
        } catch (error) {
          validationErrors.push({
            sheet: 'Product Master',
            error: `Failed to parse sheet: ${error.message}`
          });
        }
      }

      // Process Purchase Record sheet
      const purchaseSheet = findSheetByName(excelData, ['Purchase Record', 'Purchases', 'Purchase_Record', 'Sheet1']);
      if (purchaseSheet && purchaseSheet.length > 0) {
        try {
          const { formattedData, errors } = formatPurchaseData(purchaseSheet);
          results.purchases.count = formattedData.length;
          
          formattedData.forEach((purchase, index) => {
            try {
              // Validate purchase data
              const purchaseErrors = validatePurchase(purchase);
              if (purchaseErrors.length > 0) {
                results.purchases.failed++;
                validationErrors.push({
                  sheet: 'Purchase Record',
                  row: index + 2,
                  error: purchaseErrors.join(', '),
                  data: purchase
                });
                return;
              }
              
              addPurchase(purchase);
              results.purchases.processed++;
            } catch (error) {
              results.purchases.failed++;
              validationErrors.push({
                sheet: 'Purchase Record',
                row: index + 2,
                error: error.message,
                data: purchase
              });
            }
          });
          
          if (errors && errors.length > 0) {
            validationErrors.push(...errors.map(err => ({ ...err, sheet: 'Purchase Record' })));
          }
        } catch (error) {
          validationErrors.push({
            sheet: 'Purchase Record',
            error: `Failed to parse sheet: ${error.message}`
          });
        }
      }

      // Process Sales Record sheet
      const salesSheet = findSheetByName(excelData, ['Sales Record', 'Sales', 'Sales_Record', 'Sheet1']);
      if (salesSheet && salesSheet.length > 0) {
        const validRows = salesSheet.filter(row => 
          row['Product ID'] || row['Product Name'] || row['Customer Name'] || row['Quantity Sold']
        );
        
        if (validRows.length > 0) {
          try {
            const { formattedData, errors } = formatSalesData(validRows);
            results.sales.count = formattedData.length;
            
            formattedData.forEach((sale, index) => {
              try {
                // Validate sale data
                const saleErrors = validateSale(sale);
                if (saleErrors.length > 0) {
                  results.sales.failed++;
                  validationErrors.push({
                    sheet: 'Sales Record',
                    row: index + 2,
                    error: saleErrors.join(', '),
                    data: sale
                  });
                  return;
                }
                
                addSale(sale);
                results.sales.processed++;
              } catch (error) {
                results.sales.failed++;
                validationErrors.push({
                  sheet: 'Sales Record',
                  row: index + 2,
                  error: error.message,
                  data: sale
                });
              }
            });
            
            if (errors && errors.length > 0) {
              validationErrors.push(...errors.map(err => ({ ...err, sheet: 'Sales Record' })));
            }
          } catch (error) {
            validationErrors.push({
              sheet: 'Sales Record',
              error: `Failed to parse sheet: ${error.message}`
            });
          }
        }
      }

      // Calculate totals
      const totalProcessed = 
        results.products.processed + 
        results.purchases.processed + 
        results.sales.processed;
      
      const totalFailed = 
        results.products.failed + 
        results.purchases.failed + 
        results.sales.failed;

      // Update status based on results
      let message = '';
      let type = 'success';
      
      if (totalProcessed === 0 && totalFailed === 0) {
        message = 'No valid data found in the uploaded file.';
        type = 'warning';
      } else if (totalFailed > 0) {
        message = `Import partially completed. Processed: ${totalProcessed} records, Failed: ${totalFailed} records.`;
        type = 'warning';
      } else {
        message = `Import completed successfully. Processed ${totalProcessed} records.`;
        type = 'success';
      }

      setImportStatus(prev => ({
        ...prev,
        isProcessing: false,
        message,
        type,
        results,
        validationErrors
      }));

    } catch (error) {
      console.error('Import error:', error);
      setImportStatus(prev => ({
        ...prev,
        isProcessing: false,
        message: `Import failed: ${error.message || 'Unknown error occurred'}`,
        type: 'error',
        validationErrors: [{ error: error.message }]
      }));
    }
  };

  const findSheetByName = (excelData, possibleNames) => {
    for (const name of possibleNames) {
      if (excelData[name]) {
        return excelData[name];
      }
    }
    return null;
  };

  const resetImport = () => {
    setImportStatus({
      message: '',
      type: 'info',
      isProcessing: false,
      results: {
        products: { count: 0, processed: 0, failed: 0 },
        purchases: { count: 0, processed: 0, failed: 0 },
        sales: { count: 0, processed: 0, failed: 0 }
      },
      validationErrors: []
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const downloadSampleTemplate = () => {
    try {
      const blob = generateMultiSheetTemplate();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `inventory_templates_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Error downloading template. Please try again.');
    }
  };
  
  const goToDashboard = () => {
    navigate('/dashboard');
  };

  const getStatusIcon = () => {
    switch (importStatus.type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-exclamation-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      default: return 'bi-info-circle-fill';
    }
  };

  const getStatusColor = () => {
    switch (importStatus.type) {
      case 'success': return 'success';
      case 'error': return 'danger';
      case 'warning': return 'warning';
      default: return 'info';
    }
  };

  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 className="h3 fw-bold text-dark mb-1">
            <i className="bi bi-cloud-arrow-up text-primary me-2"></i>
            Data Import
          </h1>
          <p className="text-muted mb-0">Upload and process inventory data from Excel files</p>
        </div>
        <button 
          className="btn btn-outline-gray-500 d-flex align-items-center"
          onClick={goToDashboard}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          {/* Status Alert */}
          {importStatus.message && (
            <div className={`alert alert-${getStatusColor()} border-0 shadow-sm mb-4`}>
              <div className="d-flex align-items-center">
                <i className={`bi ${getStatusIcon()} me-3 fs-5`}></i>
                <div className="flex-grow-1">
                  <strong className="d-block mb-1">
                    {importStatus.type === 'success' ? 'Success' : 
                     importStatus.type === 'error' ? 'Error' : 
                     importStatus.type === 'warning' ? 'Warning' : 'Information'}
                  </strong>
                  <span className="small">{importStatus.message}</span>
                </div>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setImportStatus(prev => ({ ...prev, message: '' }))}
                ></button>
              </div>
            </div>
          )}

          {/* Upload Card */}
          <div className="card border-0 shadow-lg mb-4">
            <div className="card-header bg-white border-bottom py-4">
              <h5 className="card-title mb-0 d-flex align-items-center">
                <i className="bi bi-upload text-primary me-3"></i>
                Upload Data File
              </h5>
            </div>
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div className="mb-3">
                  <div className="upload-area border-dashed border-2 border-primary rounded-3 p-5 bg-primary-light" 
                       style={{ backgroundColor: 'rgba(13, 110, 253, 0.05)' }}>
                    <i className="bi bi-file-earmark-spreadsheet text-primary" style={{ fontSize: '3.5rem' }}></i>
                    <h5 className="mt-3 mb-2">Drag & Drop or Browse Files</h5>
                    <p className="text-muted mb-4">
                      Upload Excel (.xlsx, .xls) or CSV files up to 10MB
                    </p>
                    
                    <div className="d-inline-block position-relative">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls,.csv"
                        onChange={handleFileUpload}
                        className="form-control form-control-lg opacity-0 position-absolute w-100 h-100"
                        style={{ zIndex: 2, cursor: 'pointer' }}
                        disabled={importStatus.isProcessing}
                        id="fileUpload"
                      />
                      <label 
                        htmlFor="fileUpload" 
                        className="btn btn-primary btn-lg px-4 py-3"
                        style={{ cursor: 'pointer' }}
                      >
                        <i className="bi bi-folder2-open me-2"></i>
                        Browse Files
                      </label>
                    </div>
                    
                    <p className="small text-muted mt-3">
                      Supported formats: Excel (.xlsx, .xls), CSV
                    </p>
                  </div>
                </div>

                {importStatus.isProcessing && (
                  <div className="mt-4">
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="spinner-border text-primary me-3" role="status">
                        <span className="visually-hidden">Processing...</span>
                      </div>
                      <div>
                        <p className="mb-1 fw-medium">Processing your file...</p>
                        <p className="small text-muted mb-0">This may take a few moments depending on file size</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Import Results */}
              {(importStatus.results.products.count > 0 || 
                importStatus.results.purchases.count > 0 || 
                importStatus.results.sales.count > 0) && (
                <div className="mt-5">
                  <h6 className="text-uppercase text-muted mb-3">
                    <i className="bi bi-clipboard-data me-2"></i>
                    Import Summary
                  </h6>
                  
                  <div className="row g-3 mb-4">
                    {[
                      { 
                        key: 'products', 
                        title: 'Products', 
                        icon: 'bi-box-seam', 
                        color: 'primary' 
                      },
                      { 
                        key: 'purchases', 
                        title: 'Purchases', 
                        icon: 'bi-cart-plus', 
                        color: 'success' 
                      },
                      { 
                        key: 'sales', 
                        title: 'Sales', 
                        icon: 'bi-currency-dollar', 
                        color: 'warning' 
                      }
                    ].map((item) => {
                      const result = importStatus.results[item.key];
                      if (result.count === 0) return null;
                      
                      return (
                        <div className="col-md-4" key={item.key}>
                          <div className={`card border-start border-${item.color} border-3 h-100`}>
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <span className={`badge bg-${item.color}-subtle text-${item.color} mb-2`}>
                                    <i className={`bi ${item.icon} me-1`}></i>
                                    {item.title}
                                  </span>
                                  <h3 className="mb-0">{result.processed}</h3>
                                </div>
                                <div className="text-end">
                                  <small className="text-muted d-block">Total: {result.count}</small>
                                  {result.failed > 0 && (
                                    <small className="text-danger d-block">Failed: {result.failed}</small>
                                  )}
                                </div>
                              </div>
                              <div className="progress" style={{ height: '4px' }}>
                                <div 
                                  className={`progress-bar bg-${item.color}`}
                                  role="progressbar" 
                                  style={{ width: `${(result.processed / result.count) * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Validation Errors */}
                  {importStatus.validationErrors.length > 0 && (
                    <div className="mt-4">
                      <div className="alert alert-warning border-0">
                        <h6 className="alert-heading mb-3">
                          <i className="bi bi-exclamation-triangle me-2"></i>
                          Validation Issues ({importStatus.validationErrors.length})
                        </h6>
                        <div className="table-responsive">
                          <table className="table table-sm mb-0">
                            <thead>
                              <tr>
                                <th>Sheet</th>
                                <th>Row</th>
                                <th>Issue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {importStatus.validationErrors.slice(0, 5).map((error, index) => (
                                <tr key={index}>
                                  <td><code>{error.sheet || 'N/A'}</code></td>
                                  <td>{error.row || 'N/A'}</td>
                                  <td className="small">{error.error}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {importStatus.validationErrors.length > 5 && (
                          <p className="mt-2 mb-0 small text-muted">
                            ... and {importStatus.validationErrors.length - 5} more issues
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="d-flex justify-content-center gap-3 mt-4">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={resetImport}
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Import Another File
                    </button>
                    <button 
                      className="btn btn-primary"
                      onClick={goToDashboard}
                    >
                      <i className="bi bi-speedometer me-2"></i>
                      View Dashboard
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Information */}
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                  <h5 className="card-title mb-1">
                    <i className="bi bi-file-earmark-text text-primary me-2"></i>
                    Required File Format
                  </h5>
                  <p className="text-muted small mb-0">Ensure your files follow these guidelines</p>
                </div>
                <button 
                  className="btn btn-outline-primary btn-sm"
                  onClick={downloadSampleTemplate}
                >
                  <i className="bi bi-download me-1"></i>
                  Download Template
                </button>
              </div>

              <div className="row g-4">
                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3">
                        <i className="bi bi-box text-primary"></i>
                      </div>
                      <h6 className="mb-0">Product Master</h6>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Product Code (Required)
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Product Name (Required)
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Category
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Quantity (Numeric)
                      </li>
                      <li className="mb-0">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Buy/Sell Prices (Numeric)
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-success bg-opacity-10 p-2 rounded-circle me-3">
                        <i className="bi bi-cart-plus text-success"></i>
                      </div>
                      <h6 className="mb-0">Purchase Records</h6>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Date (YYYY-MM-DD)
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Invoice Number
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Product ID
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Quantity (Numeric)
                      </li>
                      <li className="mb-0">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Supplier Details
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="border rounded-3 p-4 h-100">
                    <div className="d-flex align-items-center mb-3">
                      <div className="bg-warning bg-opacity-10 p-2 rounded-circle me-3">
                        <i className="bi bi-currency-dollar text-warning"></i>
                      </div>
                      <h6 className="mb-0">Sales Records</h6>
                    </div>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Date (YYYY-MM-DD)
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Customer Name
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Product ID
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Quantity (Numeric)
                      </li>
                      <li className="mb-0">
                        <i className="bi bi-check-circle text-success me-2 small"></i>
                        Total Amount
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="alert alert-info border-0 mt-4">
                <div className="d-flex">
                  <i className="bi bi-info-circle me-3 mt-1"></i>
                  <div>
                    <strong>Best Practices:</strong>
                    <ul className="mb-0 mt-2 small">
                      <li>Use consistent date formats (YYYY-MM-DD recommended)</li>
                      <li>Ensure numeric fields contain only numbers</li>
                      <li>Keep file size under 10MB for optimal performance</li>
                      <li>Validate data before uploading to minimize errors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExcelImportPage;