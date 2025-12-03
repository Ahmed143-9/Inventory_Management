import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

const ImportProducts = () => {
  const { addProduct } = useInventory();
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
            case 'productname':
              product.productName = values[index];
              break;
            case 'description':
              product.description = values[index];
              break;
            case 'category':
              product.category = values[index];
              break;
            case 'product':
              product.product = values[index];
              break;
            case 'material':
              product.material = values[index];
              break;
            case 'size':
              product.size = values[index];
              break;
            case 'modelno':
            case 'model':
              product.modelNo = values[index];
              break;
            case 'quantity':
              product.quantity = parseInt(values[index]) || 0;
              break;
            case 'price':
            case 'unitrate':
              product.unitRate = parseFloat(values[index]) || 0;
              break;
            case 'sellrate':
            case 'sellingprice':
              product.sellRate = parseFloat(values[index]) || 0;
              break;
            default:
              product[header] = values[index];
          }
        }
      });
      
      return product;
    }).filter(product => product.productName || product.name);
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
      
      console.log('🚀 Starting import of', previewData.length, 'products');
      
      // Import all products
      previewData.forEach(product => {
        if (product.productName || product.name) {
          console.log(`📦 Importing: ${product.productName || product.name}`);
          addProduct(product);
          importedCount++;
        }
      });

      console.log('✅ Import completed:', importedCount, 'products');
      setMessage(`Successfully imported ${importedCount} products!`);
      setActiveStep(3);
      
      setTimeout(() => {
        setCsvData('');
        setPreviewData([]);
        setActiveStep(1);
      }, 3000);
    } catch (error) {
      console.error('❌ Import error:', error);
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
                    <div className={`step-number ${activeStep >= 1 ? 'bg-primary text-white' : 'bg-secondary text-white'} rounded-circle d-inline-flex align-items-center justify-content-center`} style={{width: '40px', height: '40px'}}>1</div>
                    <div className="step-label mt-2">Upload Data</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`step-indicator ${activeStep >= 2 ? 'active' : ''}`}>
                    <div className={`step-number ${activeStep >= 2 ? 'bg-primary text-white' : 'bg-secondary text-white'} rounded-circle d-inline-flex align-items-center justify-content-center`} style={{width: '40px', height: '40px'}}>2</div>
                    <div className="step-label mt-2">Preview & Validate</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={`step-indicator ${activeStep >= 3 ? 'active' : ''}`}>
                    <div className={`step-number ${activeStep >= 3 ? 'bg-success text-white' : 'bg-secondary text-white'} rounded-circle d-inline-flex align-items-center justify-content-center`} style={{width: '40px', height: '40px'}}>3</div>
                    <div className="step-label mt-2">Complete</div>
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
                            onClick={() => document.getElementById('csvTextarea')?.focus()}
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

                <div className="row mt-3">
                  <div className="col-md-12">
                    <label className="form-label fw-semibold">Or Paste CSV Data Here:</label>
                    <textarea
                      id="csvTextarea"
                      placeholder="Paste your CSV data here...

Example format:
name,description,quantity,price,category
Laptop,High-performance laptop,15,999.99,Electronics
Mouse,Wireless mouse,50,25.99,Electronics"
                      value={csvData}
                      onChange={handleCSVChange}
                      rows="8"
                      className="form-control font-monospace"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Preview */}
          {activeStep === 2 && previewData.length > 0 && (
            <div className="card shadow-sm border-0">
              <div className="card-body p-4">
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
                            <strong>{product.productName || product.name}</strong>
                          </td>
                          <td className="text-muted">{product.description || '-'}</td>
                          <td>
                            <span className={`badge ${product.quantity === 0 ? 'bg-danger' : product.quantity < 10 ? 'bg-warning' : 'bg-success'}`}>
                              {product.quantity || 0}
                            </span>
                          </td>
                          <td>${product.unitRate || product.price || 0}</td>
                          <td>
                            <span className="badge bg-secondary">{product.category || 'N/A'}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {previewData.length > 5 && (
                  <div className="text-center text-muted py-2">
                    ... and {previewData.length - 5} more products
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