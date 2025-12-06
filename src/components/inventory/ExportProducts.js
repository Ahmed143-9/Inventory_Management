import React from 'react';
import { useInventory } from '../../context/InventoryContext';
import { exportProductsToExcel, exportPurchasesToExcel, exportSalesToExcel } from '../../utils/excelUtils';

const ExportProducts = () => {
  const { products, purchases, sales } = useInventory();

  const handleExportProducts = () => {
    try {
      const blob = exportProductsToExcel(products);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `products_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting products:', error);
      alert('Error exporting products. Please try again.');
    }
  };

  const handleExportPurchases = () => {
    try {
      const blob = exportPurchasesToExcel(purchases);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `purchases_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting purchases:', error);
      alert('Error exporting purchases. Please try again.');
    }
  };

  const handleExportSales = () => {
    try {
      const blob = exportSalesToExcel(sales);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `sales_${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting sales:', error);
      alert('Error exporting sales. Please try again.');
    }
  };

  const handleExportAll = () => {
    handleExportProducts();
    handleExportPurchases();
    handleExportSales();
  };

  return (
    <div className="export-products-container">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          {/* Header Card */}
          <div className="card shadow-sm border-0 mb-4">
            <div className="card-header bg-info text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-file-earmark-arrow-down me-2"></i>
                <h4 className="mb-0">Export Inventory Data</h4>
              </div>
              <p className="mb-0 mt-1 opacity-75">Export your inventory data to Excel format</p>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border">
                <div className="card-body text-center p-4">
                  <i className="bi bi-box-seam text-primary" style={{fontSize: '3rem'}}></i>
                  <h5 className="card-title mt-3">Export Products</h5>
                  <p className="card-text text-muted">
                    Export all products to Excel format
                  </p>
                  <div className="mt-3">
                    <button 
                      className="btn btn-outline-primary w-100"
                      onClick={handleExportProducts}
                      disabled={products.length === 0}
                    >
                      <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                      Export {products.length} Products
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border">
                <div className="card-body text-center p-4">
                  <i className="bi bi-cart-check text-success" style={{fontSize: '3rem'}}></i>
                  <h5 className="card-title mt-3">Export Purchases</h5>
                  <p className="card-text text-muted">
                    Export all purchase records to Excel format
                  </p>
                  <div className="mt-3">
                    <button 
                      className="btn btn-outline-success w-100"
                      onClick={handleExportPurchases}
                      disabled={purchases.length === 0}
                    >
                      <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                      Export {purchases.length} Purchases
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 border">
                <div className="card-body text-center p-4">
                  <i className="bi bi-currency-dollar text-warning" style={{fontSize: '3rem'}}></i>
                  <h5 className="card-title mt-3">Export Sales</h5>
                  <p className="card-text text-muted">
                    Export all sales records to Excel format
                  </p>
                  <div className="mt-3">
                    <button 
                      className="btn btn-outline-warning w-100"
                      onClick={handleExportSales}
                      disabled={sales.length === 0}
                    >
                      <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                      Export {sales.length} Sales
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card border-0 bg-light">
                <div className="card-body text-center p-4">
                  <i className="bi bi-archive text-dark" style={{fontSize: '3rem'}}></i>
                  <h5 className="card-title mt-3">Export All Data</h5>
                  <p className="card-text text-muted">
                    Export all inventory data (products, purchases, and sales) to separate Excel files
                  </p>
                  <div className="mt-3">
                    <button 
                      className="btn btn-dark px-5"
                      onClick={handleExportAll}
                      disabled={products.length === 0 && purchases.length === 0 && sales.length === 0}
                    >
                      <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                      Export All Data
                    </button>
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

export default ExportProducts;