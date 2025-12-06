import React from 'react';
import { Link } from 'react-router-dom';
import ImportProducts from '../components/inventory/ImportProducts';
import ExportProducts from '../components/inventory/ExportProducts';
import MultiSheetImport from '../components/inventory/MultiSheetImport';

const DataImportExport = () => {
  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-arrow-down-up me-2"></i>
          Data Import & Export
        </h2>
      </div>

      <div className="row g-4">
        {/* Excel Import Section */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-gradient-primary text-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                Excel Import
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                Import your product data from Excel files. Supports multiple sheets including 
                Product Master, Purchase Records, and Sales Records.
              </p>
              
              <div className="d-grid gap-2 mb-3">
                <Link 
                  to="/excel-import" 
                  className="btn btn-primary btn-lg"
                >
                  <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                  Import Excel Files
                </Link>
              </div>
              
              <div className="alert alert-info">
                <i className="bi bi-info-circle me-2"></i>
                Upload your Excel files with multiple sheets to populate your inventory system.
              </div>
            </div>
          </div>
        </div>

        {/* Single Sheet Import Section */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-gradient-success text-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-upload me-2"></i>
                Product Import (Single Sheet)
              </h5>
            </div>
            <div className="card-body">
              <p className="text-muted">
                Import products from a single Excel sheet. This is ideal for adding new products 
                to your existing inventory.
              </p>
              
              <ImportProducts />
              
              <div className="alert alert-warning mt-3">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Make sure your Excel file follows the required format with proper column headers.
              </div>
            </div>
          </div>
        </div>

        {/* Export Section */}
        <div className="col-lg-12 mt-4">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-gradient-info text-white py-3">
              <h5 className="mb-0">
                <i className="bi bi-download me-2"></i>
                Data Export
              </h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <p className="text-muted">
                    Export your current inventory data to Excel format. This creates a backup 
                    of all your products, purchases, and sales records.
                  </p>
                  
                  <ExportProducts />
                </div>
                <div className="col-md-6">
                  <div className="border rounded p-4 bg-light h-100">
                    <h6>
                      <i className="bi bi-info-circle me-2"></i>
                      Export Options
                    </h6>
                    <ul className="ps-3 mb-0">
                      <li className="py-1">Export all products to Excel</li>
                      <li className="py-1">Export purchase records</li>
                      <li className="py-1">Export sales records</li>
                      <li className="py-1">Multiple sheet format</li>
                      <li className="py-1">Compatible with import functionality</li>
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

export default DataImportExport;