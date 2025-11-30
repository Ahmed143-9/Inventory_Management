// components/ProductCard.js
import React, { useState } from 'react';

const ProductCard = ({ product, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(product);

  const handleSave = () => {
    onUpdate(product.id, editedProduct);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProduct(product);
    setIsEditing(false);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  };

  return (
    <div className={`product-card ${getStockStatus(product.quantity)}`}>
      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            value={editedProduct.name}
            onChange={(e) => setEditedProduct({...editedProduct, name: e.target.value})}
          />
          <input
            type="number"
            value={editedProduct.quantity}
            onChange={(e) => setEditedProduct({...editedProduct, quantity: parseInt(e.target.value)})}
          />
          <input
            type="number"
            step="0.01"
            value={editedProduct.price}
            onChange={(e) => setEditedProduct({...editedProduct, price: parseFloat(e.target.value)})}
          />
          <div className="edit-actions">
            <button className="btn btn-success" onClick={handleSave}>Save</button>
            <button className="btn btn-secondary" onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h3>{product.name}</h3>
          <p className="description">{product.description}</p>
          <div className="product-details">
            <span>Quantity: {product.quantity}</span>
            <span>Price: ${product.price}</span>
            <span>Category: {product.category}</span>
          </div>
          <div className="product-actions">
            <button 
              className="btn btn-warning"
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => onDelete(product.id)}
            >
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductCard;