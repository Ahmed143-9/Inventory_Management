// src/components/inventory/ProductCard.js
import React, { useState, useEffect } from 'react';

const ProductCard = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState({});

  // Initialize editedProduct when product changes
  useEffect(() => {
    console.log(`🔄 ProductCard ${product.id} - Product updated:`, product);
    setEditedProduct({ ...product });
  }, [product]);

  // Debug: Log when editing state changes
  useEffect(() => {
    console.log(`✏️ ProductCard ${product.id} - Editing:`, isEditing);
    if (isEditing) {
      console.log(`📝 ProductCard ${product.id} - Edited product:`, editedProduct);
    }
  }, [isEditing, editedProduct, product.id]);

  const handleSave = () => {
    console.log(`💾 ProductCard ${product.id} - Saving:`, editedProduct);
    onUpdate(product.id, editedProduct);
    setIsEditing(false);
  };

  const handleCancel = () => {
    console.log(`❌ ProductCard ${product.id} - Canceling edit`);
    setEditedProduct({ ...product });
    setIsEditing(false);
  };

  // Quick quantity adjustments - DIRECT update, no local state
  const handleQuickQuantity = (change) => {
    console.log(`🔢 ProductCard ${product.id} - Quick quantity change: ${change}`);
    const newQuantity = Math.max(0, product.quantity + change);
    onUpdate(product.id, { quantity: newQuantity });
  };

  // Quick price adjustments - DIRECT update, no local state
  const handleQuickPrice = (change) => {
    console.log(`💰 ProductCard ${product.id} - Quick price change: ${change}`);
    const newPrice = Math.max(0, product.price + change);
    onUpdate(product.id, { price: parseFloat(newPrice.toFixed(2)) });
  };

  // Set custom quantity - DIRECT update
  const handleCustomQuantity = () => {
    console.log(`📝 ProductCard ${product.id} - Custom quantity prompt`);
    const newQuantity = prompt(`Set quantity for ${product.name}:`, product.quantity);
    if (newQuantity !== null) {
      const quantity = parseInt(newQuantity);
      if (!isNaN(quantity) && quantity >= 0) {
        onUpdate(product.id, { quantity });
      } else {
        alert('Please enter a valid number for quantity.');
      }
    }
  };

  // Set custom price - DIRECT update
  const handleCustomPrice = () => {
    console.log(`💵 ProductCard ${product.id} - Custom price prompt`);
    const newPrice = prompt(`Set price for ${product.name}:`, product.price);
    if (newPrice !== null) {
      const price = parseFloat(newPrice);
      if (!isNaN(price) && price >= 0) {
        onUpdate(product.id, { price: parseFloat(price.toFixed(2)) });
      } else {
        alert('Please enter a valid number for price.');
      }
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'bg-danger';
    if (quantity < 10) return 'bg-warning';
    return 'bg-success';
  };

  const getStockText = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="card h-100 shadow-sm product-card" data-product-id={product.id}>
      <div className={`card-header ${getStockStatus(product.quantity)} text-white`}>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">{product.name}</h6>
          <span className="badge bg-light text-dark">#{product.id}</span>
        </div>
      </div>
      
      <div className="card-body">
        {isEditing ? (
          // Full Edit Mode
          <div className="edit-form">
            <div className="mb-2">
              <label className="form-label small">Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={editedProduct.name || ''}
                onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
              />
            </div>
            <div className="mb-2">
              <label className="form-label small">Description</label>
              <textarea
                className="form-control form-control-sm"
                value={editedProduct.description || ''}
                onChange={(e) => setEditedProduct({...editedProduct, description: e.target.value})}
                rows="2"
              />
            </div>
            <div className="row g-2 mb-2">
              <div className="col-6">
                <label className="form-label small">Quantity</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={editedProduct.quantity || ''}
                  onChange={(e) => setEditedProduct({...editedProduct, quantity: parseInt(e.target.value) || 0})}
                  min="0"
                />
              </div>
              <div className="col-6">
                <label className="form-label small">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control form-control-sm"
                  value={editedProduct.price || ''}
                  onChange={(e) => setEditedProduct({...editedProduct, price: parseFloat(e.target.value) || 0})}
                  min="0"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small">Category</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={editedProduct.category || ''}
                onChange={(e) => setEditedProduct({...editedProduct, category: e.target.value})}
              />
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-success btn-sm" onClick={handleSave}>
                <i className="bi bi-check me-1"></i>
                Save
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                <i className="bi bi-x me-1"></i>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Mode with Quick Controls
          <>
            <p className="card-text text-muted small mb-3">{product.description}</p>
            
            <div className="mb-3">
              <span className="badge bg-secondary">{product.category}</span>
            </div>

            {/* Quick Quantity Controls */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted fw-semibold">Quantity</small>
                <span className={`badge ${getStockStatus(product.quantity)}`}>
                  {getStockText(product.quantity)}
                </span>
              </div>
              
              {/* Main Quantity Controls */}
              <div className="d-flex align-items-center justify-content-center mb-1">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleQuickQuantity(-1)}
                  disabled={product.quantity <= 0}
                  title="Decrease by 1"
                >
                  <i className="bi bi-dash"></i>
                </button>
                
                <span className={`
                  fw-bold fs-5 mx-3 text-center min-width-50
                  ${product.quantity === 0 ? 'text-danger' : 
                    product.quantity < 10 ? 'text-warning' : 'text-success'}
                `}>
                  {product.quantity}
                </span>
                
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => handleQuickQuantity(1)}
                  title="Increase by 1"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>

              {/* Bulk Quantity Controls - Below main buttons */}
              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  className="btn btn-outline-warning btn-xs"
                  onClick={() => handleQuickQuantity(-5)}
                  disabled={product.quantity < 5}
                  title="Decrease by 5"
                >
                  -5
                </button>
                
                <button
                  className="btn btn-outline-secondary btn-xs"
                  onClick={handleCustomQuantity}
                  title="Set custom quantity"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                
                <button
                  className="btn btn-outline-info btn-xs"
                  onClick={() => handleQuickQuantity(5)}
                  title="Increase by 5"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Quick Price Controls */}
            <div className="mb-3">
              <small className="text-muted fw-semibold d-block mb-2">Price</small>
              
              {/* Main Price Controls */}
              <div className="d-flex align-items-center justify-content-center mb-1">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuickPrice(-1)}
                  disabled={product.price <= 1}
                  title="Decrease by $1"
                >
                  <i className="bi bi-dash"></i>
                </button>
                
                <strong className="text-primary fs-5 mx-3 text-center min-width-60">
                  ${product.price}
                </strong>
                
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuickPrice(1)}
                  title="Increase by $1"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>

              {/* Bulk Price Controls - Below main buttons */}
              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  className="btn btn-outline-warning btn-xs"
                  onClick={() => handleQuickPrice(-5)}
                  disabled={product.price <= 5}
                  title="Decrease by $5"
                >
                  -5
                </button>
                
                <button
                  className="btn btn-outline-secondary btn-xs"
                  onClick={handleCustomPrice}
                  title="Set custom price"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                
                <button
                  className="btn btn-outline-info btn-xs"
                  onClick={() => handleQuickPrice(5)}
                  title="Increase by $5"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-3">
              <small className="text-muted fw-semibold d-block mb-1">Quick Actions</small>
              <div className="d-flex justify-content-center gap-1">
                <button
                  className="btn btn-outline-primary btn-xs"
                  onClick={() => handleQuickQuantity(10)}
                  title="Add 10 to quantity"
                >
                  +10
                </button>
                <button
                  className="btn btn-outline-success btn-xs"
                  onClick={() => handleQuickQuantity(25)}
                  title="Add 25 to quantity"
                >
                  +25
                </button>
              </div>
            </div>

            {/* Total Value */}
            <div className="border-top pt-2">
              <div className="text-center">
                <small className="text-muted d-block">Total Value</small>
                <strong className="text-success fs-5">
                  ${(product.quantity * product.price).toFixed(2)}
                </strong>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Card Footer - Actions */}
      {!isEditing && (
        <div className="card-footer">
          <div className="d-grid gap-2">
            <button 
              className="btn btn-warning btn-sm"
              onClick={() => {
                console.log(`🛠️ ProductCard ${product.id} - Starting full edit`);
                setEditedProduct({ ...product });
                setIsEditing(true);
              }}
              title="Edit all product details"
            >
              <i className="bi bi-pencil me-1"></i>
              Full Edit
            </button>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => {
                console.log(`🗑️ ProductCard ${product.id} - Delete initiated`);
                if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                  onDelete(product.id);
                }
              }}
              title="Delete this product"
            >
              <i className="bi bi-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;