// src/pages/AddProductPage.js
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useNavigate } from 'react-router-dom';

const AddProductPage = () => {
  const { addProduct } = useInventory();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    category: ''
  });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setMessage('Product name is required');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      quantity: parseInt(formData.quantity) || 0,
      price: parseFloat(formData.price) || 0,
      category: formData.category.trim()
    };

    addProduct(productData);
    
    setMessage('Product added successfully!');
    setTimeout(() => setMessage(''), 3000);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      quantity: '',
      price: '',
      category: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="add-product-page">
      <div className="page-header">
        <h3>Add Single Product</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <form className="add-product-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name *</label>
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              placeholder="Enter price"
              value={formData.price}
              onChange={handleChange}
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-success btn-large">
            Add Product
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => setFormData({
              name: '',
              description: '',
              quantity: '',
              price: '',
              category: ''
            })}
          >
            Clear Form
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;