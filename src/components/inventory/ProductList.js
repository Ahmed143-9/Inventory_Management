// src/components/inventory/ProductList.js
import React, { useState } from 'react';
import ProductsTable from './ProductsTable';
import ProductCard from './ProductCard';

const ProductList = ({ products, onUpdate, onDelete }) => {
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'card'

  return (
    <div className="product-list">
      {/* View Mode Toggle */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Products ({products.length})</h5>
        <div className="btn-group">
          <button
            className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('table')}
          >
            <i className="bi bi-table"></i> Table View
          </button>
          <button
            className={`btn btn-sm ${viewMode === 'card' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('card')}
          >
            <i className="bi bi-grid"></i> Card View
          </button>
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
        <div className="row">
         {products.map(product => (
            <div key={product.id} className="col-md-4 mb-3">
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