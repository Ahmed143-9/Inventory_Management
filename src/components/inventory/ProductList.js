// src/components/inventory/ProductList.js
import React, { useState } from 'react';
import ProductsTable from './ProductsTable';
import ProductCard from './ProductCard';

const ProductList = ({ products, onUpdate, onDelete }) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  return (
    <div className="product-list">
      {/* View Mode Toggle - Full Width */}
      <div className="card border-0 shadow-sm mb-3">
        <div className="card-body py-2">
          <div className="d-flex justify-content-between align-items-center">
            <h6 className="mb-0 text-muted">
              Showing {products.length} product{products.length !== 1 ? 's' : ''}
            </h6>
            <div className="btn-group btn-group-sm">
              <button
                className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('table')}
              >
                <i className="bi bi-table me-1"></i> Table
              </button>
              <button
                className={`btn ${viewMode === 'card' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('card')}
              >
                <i className="bi bi-grid me-1"></i> Cards
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Render appropriate view */}
      {viewMode === 'table' ? (
        <ProductsTable 
          products={products} 
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ) : (
        <div className="row g-2">
          {products.map(product => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <ProductCard 
                product={product}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductList;