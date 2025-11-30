// src/pages/Products.js
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import ProductList from '../components/inventory/ProductList';
import AddProductForm from '../components/inventory/AddProductForm';
import ImportProducts from '../components/inventory/ImportProducts';
import ProtectedRoute from '../components/common/ProtectedRoute';

const Products = () => {
  const { products, updateProduct, deleteProduct, addProduct, loading } = useInventory();
  const [activeTab, setActiveTab] = useState('view');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'view':
        return (
          <ProductList 
            products={products} 
            onUpdate={updateProduct}
            onDelete={deleteProduct}
          />
        );
      case 'add':
        return <AddProductForm onAdd={addProduct} />;
      case 'import':
        return <ImportProducts onAdd={addProduct} />;
      default:
        return (
          <ProductList 
            products={products} 
            onUpdate={updateProduct}
            onDelete={deleteProduct}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="products-page container-fluid px-3 px-md-4 px-lg-5">
        {/* Header Section - Full Width */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-3">
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <h2 className="card-title mb-1">
                      <i className="bi bi-box-seam text-primary me-2"></i>
                      Product Management
                    </h2>
                    <p className="text-muted mb-0 small">
                      Manage your inventory products, add new items, or bulk import from CSV.
                    </p>
                  </div>
                  <div className="col-md-4 text-end">
                    <div className="bg-primary bg-opacity-10 rounded p-2 d-inline-block">
                      <i className="bi bi-graph-up text-primary fs-4"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation - Full Width */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body py-2">
                <ul className="nav nav-pills nav-fill" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'view' ? 'active' : ''}`}
                      onClick={() => setActiveTab('view')}
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-grid me-2"></i>
                      View Products
                      <span className="badge bg-secondary ms-2">{products.length}</span>
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'add' ? 'active' : ''}`}
                      onClick={() => setActiveTab('add')}
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-plus-circle me-2"></i>
                      Add Single Product
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${activeTab === 'import' ? 'active' : ''}`}
                      onClick={() => setActiveTab('import')}
                      type="button"
                      role="tab"
                    >
                      <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                      Import from Excel
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Content - Full Width */}
        <div className="row">
          <div className="col-12">
            <div className="tab-content">
              <div className="tab-pane fade show active">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Footer - Full Width */}
        <div className="row mt-3">
          <div className="col-12">
            <div className="card border-0 bg-light">
              <div className="card-body py-2">
                <div className="row text-center">
                  <div className="col-6 col-md-3">
                    <small className="text-muted d-block">Total Products</small>
                    <strong className="text-primary">{products.length}</strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <small className="text-muted d-block">Categories</small>
                    <strong className="text-success">
                      {[...new Set(products.map(p => p.category))].length}
                    </strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <small className="text-muted d-block">Low Stock</small>
                    <strong className="text-warning">
                      {products.filter(p => p.quantity < 10 && p.quantity > 0).length}
                    </strong>
                  </div>
                  <div className="col-6 col-md-3">
                    <small className="text-muted d-block">Out of Stock</small>
                    <strong className="text-danger">
                      {products.filter(p => p.quantity === 0).length}
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Products;