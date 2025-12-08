import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import MultiSheetImport from '../components/inventory/MultiSheetImport';
import ExportProducts from '../components/inventory/ExportProducts';

const ComprehensiveDataManagement = () => {
  const navigate = useNavigate();
  const { products, purchases, sales } = useInventory();
  
  const [activeTab, setActiveTab] = useState('import');

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-database me-2"></i>
          Comprehensive Data Management
        </h2>
        <button 
          className="btn btn-outline-secondary"
          onClick={() => navigate('/dashboard')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Dashboard
        </button>
      </div>

      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'import' ? 'active' : ''}`}
            onClick={() => setActiveTab('import')}
          >
            <i className="bi bi-cloud-arrow-up me-2"></i>
            Import Data
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            <i className="bi bi-cloud-arrow-down me-2"></i>
            Export Data
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'manage' ? 'active' : ''}`}
            onClick={() => setActiveTab('manage')}
          >
            <i className="bi bi-gear me-2"></i>
            Manage Data
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {/* Import Tab */}
        {activeTab === 'import' && (
          <div className="tab-pane fade show active">
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-primary text-white py-3">
                    <h5 className="mb-0">
                      <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                      Multi-Sheet Data Import
                    </h5>
                    <p className="mb-0 mt-1 opacity-75">
                      Import products, purchases, sales, and profit/loss data from Excel files
                    </p>
                  </div>
                  <div className="card-body">
                    <MultiSheetImport />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="tab-pane fade show active">
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-info text-white py-3">
                    <h5 className="mb-0">
                      <i className="bi bi-file-earmark-arrow-down me-2"></i>
                      Data Export
                    </h5>
                    <p className="mb-0 mt-1 opacity-75">
                      Export all inventory data to Excel format
                    </p>
                  </div>
                  <div className="card-body">
                    <ExportProducts />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div className="tab-pane fade show active">
            <div className="row">
              <div className="col-12">
                <div className="card shadow-sm border-0 mb-4">
                  <div className="card-header bg-success text-white py-3">
                    <h5 className="mb-0">
                      <i className="bi bi-table me-2"></i>
                      Data Management
                    </h5>
                    <p className="mb-0 mt-1 opacity-75">
                      View and manage your inventory data
                    </p>
                  </div>
                  <div className="card-body">
                    <div className="row g-4">
                      <div className="col-md-4">
                        <div className="card border-start border-primary border-4 h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h3 className="mb-1">{products.length}</h3>
                                <p className="text-muted mb-0">Products</p>
                              </div>
                              <i className="bi bi-box-seam text-primary" style={{fontSize: '2rem'}}></i>
                            </div>
                            <div className="mt-3">
                              <button 
                                className="btn btn-outline-primary btn-sm w-100"
                                onClick={() => navigate('/products')}
                              >
                                <i className="bi bi-eye me-1"></i>
                                View Products
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card border-start border-success border-4 h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h3 className="mb-1">{purchases.length}</h3>
                                <p className="text-muted mb-0">Purchases</p>
                              </div>
                              <i className="bi bi-cart-plus text-success" style={{fontSize: '2rem'}}></i>
                            </div>
                            <div className="mt-3">
                              <button 
                                className="btn btn-outline-success btn-sm w-100"
                                onClick={() => navigate('/reports/purchases')}
                              >
                                <i className="bi bi-eye me-1"></i>
                                View Purchases
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="card border-start border-warning border-4 h-100">
                          <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <h3 className="mb-1">{sales.length}</h3>
                                <p className="text-muted mb-0">Sales</p>
                              </div>
                              <i className="bi bi-currency-dollar text-warning" style={{fontSize: '2rem'}}></i>
                            </div>
                            <div className="mt-3">
                              <button 
                                className="btn btn-outline-warning btn-sm w-100"
                                onClick={() => navigate('/reports/sales')}
                              >
                                <i className="bi bi-eye me-1"></i>
                                View Sales
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="row mt-4">
                      <div className="col-12">
                        <div className="card border-0 bg-light">
                          <div className="card-body text-center">
                            <h5 className="card-title">
                              <i className="bi bi-info-circle me-2"></i>
                              Data Management Information
                            </h5>
                            <p className="card-text">
                              Use the Import and Export tabs to manage your inventory data.
                              All data is automatically saved in your browser's local storage.
                            </p>
                            <div className="alert alert-info mb-0">
                              <i className="bi bi-lightbulb me-2"></i>
                              Tip: Regularly export your data to prevent loss!
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComprehensiveDataManagement;