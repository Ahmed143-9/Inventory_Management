// src/components/inventory/ProductsTable.js
import React, { useState } from 'react';

const ProductsTable = ({ products, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [quickEdit, setQuickEdit] = useState({ id: null, field: null });

  const categories = ['all', ...new Set(products.map(product => product.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Quick quantity adjustment
  const handleQuickQuantity = (productId, change) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newQuantity = Math.max(0, product.quantity + change);
      onUpdate(productId, { quantity: newQuantity });
    }
  };

  // Quick price adjustment
  const handleQuickPrice = (productId, change) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      const newPrice = Math.max(0, product.price + change);
      onUpdate(productId, { price: parseFloat(newPrice.toFixed(2)) });
    }
  };

  // Full edit mode
 const handleEdit = (product) => {
  setEditingId(product.id);
  setEditedProduct({ ...product }); // Make sure to create a copy
};

  const handleSave = (productId) => {
    onUpdate(productId, editedProduct);
    setEditingId(null);
    setEditedProduct({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct({});
  };

  const handleChange = (field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: field === 'quantity' ? parseInt(value) || 0 : 
               field === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStockBadgeClass = (quantity) => {
    if (quantity === 0) return 'bg-danger';
    if (quantity < 10) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <div className="products-table-container">
      {/* Search and Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-filter"></i>
            </span>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Total Value</th>
              <th>Quick Actions</th>
              <th>Full Edit</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="align-middle">
                {/* ID */}
                <td>
                  <strong>#{product.id}</strong>
                </td>

                {/* Product Name */}
                <td>
                  {editingId === product.id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editedProduct.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  ) : (
                    <strong>{product.name}</strong>
                  )}
                </td>

                {/* Description */}
                <td>
                  {editingId === product.id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editedProduct.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                  ) : (
                    <span className="text-muted">{product.description}</span>
                  )}
                </td>

                {/* Category */}
                <td>
                  {editingId === product.id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editedProduct.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                    />
                  ) : (
                    <span className="badge bg-secondary">{product.category}</span>
                  )}
                </td>

                {/* Quantity - With Quick Controls */}
                <td>
                  {editingId === product.id ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={editedProduct.quantity || ''}
                      onChange={(e) => handleChange('quantity', e.target.value)}
                      min="0"
                    />
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleQuickQuantity(product.id, -1)}
                        disabled={product.quantity <= 0}
                        title="Decrease by 1"
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      
                      <span className={`
                        fw-bold text-center min-width-50 
                        ${product.quantity === 0 ? 'text-danger' : 
                          product.quantity < 10 ? 'text-warning' : 'text-success'}
                      `}>
                        {product.quantity}
                      </span>
                      
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => handleQuickQuantity(product.id, 1)}
                        title="Increase by 1"
                      >
                        <i className="bi bi-plus"></i>
                      </button>

                      {/* Bulk Quantity Controls */}
                      <div className="btn-group btn-group-sm ms-1">
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handleQuickQuantity(product.id, -5)}
                          disabled={product.quantity < 5}
                          title="Decrease by 5"
                        >
                          -5
                        </button>
                        <button
                          className="btn btn-outline-info"
                          onClick={() => handleQuickQuantity(product.id, 5)}
                          title="Increase by 5"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  )}
                </td>

                {/* Price - With Quick Controls */}
                <td>
                  {editingId === product.id ? (
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        value={editedProduct.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  ) : (
                    <div className="d-flex align-items-center gap-2">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleQuickPrice(product.id, -1)}
                        disabled={product.price <= 1}
                        title="Decrease by $1"
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      
                      <strong className="text-primary min-width-60 text-center">
                        ${product.price}
                      </strong>
                      
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleQuickPrice(product.id, 1)}
                        title="Increase by $1"
                      >
                        <i className="bi bi-plus"></i>
                      </button>

                      {/* Bulk Price Controls */}
                      <div className="btn-group btn-group-sm ms-1">
                        <button
                          className="btn btn-outline-warning"
                          onClick={() => handleQuickPrice(product.id, -5)}
                          disabled={product.price <= 5}
                          title="Decrease by $5"
                        >
                          -5
                        </button>
                        <button
                          className="btn btn-outline-info"
                          onClick={() => handleQuickPrice(product.id, 5)}
                          title="Increase by $5"
                        >
                          +5
                        </button>
                      </div>
                    </div>
                  )}
                </td>

                {/* Status */}
                <td>
                  <span className={`badge ${getStockBadgeClass(product.quantity)}`}>
                    {getStockStatus(product.quantity)}
                  </span>
                </td>

                {/* Total Value */}
                <td>
                  <strong className="text-success">
                    ${(product.quantity * product.price).toFixed(2)}
                  </strong>
                </td>

                {/* Quick Actions */}
                <td>
                  <div className="btn-group-vertical btn-group-sm">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleQuickQuantity(product.id, 10)}
                      title="Add 10 to quantity"
                    >
                      <i className="bi bi-arrow-up-short"></i>10
                    </button>
                    <button
                      className="btn btn-outline-warning btn-sm"
                      onClick={() => {
                        const newQuantity = prompt(`Set quantity for ${product.name}:`, product.quantity);
                        if (newQuantity !== null) {
                          const quantity = parseInt(newQuantity);
                          if (!isNaN(quantity) && quantity >= 0) {
                            onUpdate(product.id, { quantity });
                          }
                        }
                      }}
                      title="Set custom quantity"
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                  </div>
                </td>

                {/* Full Edit Actions */}
                <td>
                  {editingId === product.id ? (
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-success"
                        onClick={() => handleSave(product.id)}
                        title="Save changes"
                      >
                        <i className="bi bi-check"></i>
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        title="Cancel editing"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(product)}
                        title="Edit all fields"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                            onDelete(product.id);
                          }
                        }}
                        title="Delete product"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <i className="bi bi-inbox display-1"></i>
            <h5 className="mt-3">No products found</h5>
            <p>Try adjusting your search or add some products to get started.</p>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {filteredProducts.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card bg-light border-0">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-2">
                    <h6 className="text-muted">Total Products</h6>
                    <h4 className="text-primary">{filteredProducts.length}</h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Total Value</h6>
                    <h4 className="text-success">
                      ${filteredProducts.reduce((sum, p) => sum + (p.price * p.quantity), 0).toLocaleString()}
                    </h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Low Stock</h6>
                    <h4 className="text-warning">
                      {filteredProducts.filter(p => p.quantity < 10 && p.quantity > 0).length}
                    </h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Out of Stock</h6>
                    <h4 className="text-danger">
                      {filteredProducts.filter(p => p.quantity === 0).length}
                    </h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Avg. Price</h6>
                    <h4 className="text-info">
                      ${(filteredProducts.reduce((sum, p) => sum + p.price, 0) / filteredProducts.length).toFixed(2)}
                    </h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Total Items</h6>
                    <h4 className="text-purple">
                      {filteredProducts.reduce((sum, p) => sum + p.quantity, 0).toLocaleString()}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;