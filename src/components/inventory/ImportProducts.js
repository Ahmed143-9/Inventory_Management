// src/components/inventory/ImportProducts.js - FIXED
import React, { useState } from 'react';

const ImportProducts = ({ onAdd }) => {
  const [csvData, setCsvData] = useState('');
  const [message, setMessage] = useState('');
  const [previewData, setPreviewData] = useState([]);
  const [isImporting, setIsImporting] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim());
      const product = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          switch(header) {
            case 'name':
            case 'description':
            case 'category':
              product[header] = values[index];
              break;
            case 'quantity':
              product[header] = parseInt(values[index]) || 0;
              break;
            case 'price':
              product[header] = parseFloat(values[index]) || 0;
              break;
            default:
              product[header] = values[index];
          }
        }
      });
      
      return product;
    }).filter(product => product.name);
  };

  const handleCSVChange = (e) => {
    const text = e.target.value;
    setCsvData(text);
    
    if (text.trim()) {
      const parsed = parseCSV(text);
      setPreviewData(parsed);
      setActiveStep(2);
    } else {
      setPreviewData([]);
      setActiveStep(1);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target.result);
      const parsed = parseCSV(event.target.result);
      setPreviewData(parsed);
      setActiveStep(2);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      setMessage('No valid products to import');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    setIsImporting(true);
    try {
      let importedCount = 0;
      
      // 🔥 FIX: Import products - now using ref so no delay needed
      for (const product of previewData) {
        if (product.name) {
          console.log(`📦 Importing product: ${product.name}`);
          onAdd(product);
          importedCount++;
        }
      }

      setMessage(`Successfully imported ${importedCount} products!`);
      setActiveStep(3);
      
      setTimeout(() => {
        setCsvData('');
        setPreviewData([]);
        setActiveStep(1);
      }, 3000);
    } catch (error) {
      console.error('Import error:', error);
      setMessage('Error importing products. Please try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `name,description,quantity,price,category
Laptop,High-performance laptop,15,999.99,Electronics
Mouse,Wireless mouse,50,25.99,Electronics
Notebook,A4 size notebook,100,4.99,Stationery
Desk Chair,Ergonomic office chair,8,199.99,Furniture
Monitor,24-inch LED monitor,12,159.99,Electronics`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product_import_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const resetImport = () => {
    setCsvData('');
    setPreviewData([]);
    setActiveStep(1);
    setMessage('');
  };

  return (
    <div className="import-products-container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header Card */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-info text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                <h4 className="mb-0">Import Products from CSV/Excel</h4>
              </div>
              <p className="mb-0 mt-1 opacity-75">Bulk import products using CSV format</p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-4">
                  <div className={`step-indicator ${activeStep >= 1 ? 'active' : ''}`}>
                    <span className="step-number">1</span>
                    <div className="step-label">Upload Data</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`step-indicator ${activeStep >= 2 ? 'active' : ''}`}>
                    <span className="step-number">2</span>
                    <div className="step-label">Preview & Validate</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`step-indicator ${activeStep >= 3 ? 'active' : ''}`}>
                    <span className="step-number">3</span>
                    <div className="step-label">Complete</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('Successfully') ? 'alert-success' : 'alert-danger'} d-flex align-items-center`}>
              <i className={`bi ${message.includes('Successfully') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
              {message}
            </div>
          )}

          {/* Step 1: Upload Options */}
          {activeStep === 1 && (
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Choose Import Method</h5>
                
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="card h-100 border">
                      <div className="card-body text-center p-4">
                        <i className="bi bi-cloud-arrow-up text-primary" style={{fontSize: '3rem'}}></i>
                        <h5 className="card-title mt-3">Upload CSV File</h5>
                        <p className="card-text text-muted">
                          Upload a CSV file from your computer
                        </p>
                        <div className="mt-3">
                          <input
                            type="file"
                            accept=".csv,.txt"
                            onChange={handleFileUpload}
                            className="form-control"
                            id="fileUpload"
                          />
                          <label htmlFor="fileUpload" className="btn btn-primary w-100 mt-2">
                            <i className="bi bi-upload me-2"></i>
                            Choose File
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="card h-100 border">
                      <div className="card-body text-center p-4">
                        <i className="bi bi-clipboard-data text-success" style={{fontSize: '3rem'}}></i>
                        <h5 className="card-title mt-3">Paste CSV Data</h5>
                        <p className="card-text text-muted">
                          Paste CSV data directly into the text area
                        </p>
                        <div className="mt-3">
                          <button 
                            className="btn btn-outline-success w-100"
                            onClick={() => document.getElementById('csvTextarea').focus()}
                          >
                            <i className="bi bi-clipboard me-2"></i>
                            Start Pasting Data
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row mt-4">
                  <div className="col-md-12">
                    <div className="card bg-light border-0">
                      <div className="card-body">
                        <h6 className="card-title">
                          <i className="bi bi-download text-primary me-2"></i>
                          Download Template
                        </h6>
                        <p className="card-text mb-3">
                          Use our template to ensure proper formatting of your CSV file.
                        </p>
                        <button 
                          className="btn btn-outline-primary"
                          onClick={downloadTemplate}
                        >
                          <i className="bi bi-file-earmark-arrow-down me-2"></i>
                          Download CSV Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Data Input & Preview */}
          {activeStep === 2 && (
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
                <h5 className="card-title mb-4">Paste Your CSV Data</h5>
                
                <div className="row mb-4">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">CSV Data</label>
                    <textarea
                      id="csvTextarea"
                      placeholder={`Paste your CSV data here...\n\nExample format:\nname,description,quantity,price,category\nLaptop,High-performance laptop,15,999.99,Electronics\nMouse,Wireless mouse,50,25.99,Electronics`}
                      value={csvData}
                      onChange={handleCSVChange}
                      rows="10"
                      className="form-control font-monospace"
                    />
                    <div className="form-text">
                      Ensure your CSV follows the template format with headers: name, description, quantity, price, category
                    </div>
                  </div>
                </div>

                {previewData.length > 0 && (
                  <div className="preview-section">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">
                        Preview ({previewData.length} products ready for import)
                      </h6>
                      <span className="badge bg-success">
                        <i className="bi bi-check-circle me-1"></i>
                        Valid Format
                      </span>
                    </div>

                    <div className="table-responsive">
                      <table className="table table-sm table-striped">
                        <thead className="table-light">
                          <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Category</th>
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.slice(0, 5).map((product, index) => (
                            <tr key={index}>
                              <td>
                                <strong>{product.name}</strong>
                              </td>
                              <td className="text-muted">{product.description}</td>
                              <td>
                                <span className={`badge ${product.quantity === 0 ? 'bg-danger' : product.quantity < 10 ? 'bg-warning' : 'bg-success'}`}>
                                  {product.quantity}
                                </span>
                              </td>
                              <td>${product.price}</td>
                              <td>
                                <span className="badge bg-secondary">{product.category}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {previewData.length > 5 && (
                      <div className="text-center text-muted py-2">
                        <i className="bi bi-arrow-down"></i>
                        ... and {previewData.length - 5} more products
                        <i className="bi bi-arrow-down"></i>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={resetImport}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Back to Upload
                      </button>
                      <button 
                        className="btn btn-success px-4"
                        onClick={handleImport}
                        disabled={isImporting}
                      >
                        {isImporting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Importing...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cloud-arrow-up me-2"></i>
                            Import {previewData.length} Products
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Completion */}
          {activeStep === 3 && (
            <div className="card shadow-sm border-0">
              <div className="card-body text-center p-5">
                <i className="bi bi-check-circle text-success" style={{fontSize: '4rem'}}></i>
                <h3 className="mt-3 text-success">Import Successful!</h3>
                <p className="text-muted mb-4">
                  Your products have been successfully imported into the inventory system.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button 
                    className="btn btn-outline-primary"
                    onClick={resetImport}
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Import More Products
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => window.location.href = '/products'}
                  >
                    <i className="bi bi-eye me-2"></i>
                    View Products
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportProducts;