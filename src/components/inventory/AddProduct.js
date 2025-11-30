// src/components/inventory/AddProduct.js
import React, { useState } from 'react';

const AddProduct = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: 0,
    price: 0,
    category: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim() === '') return;
    
    onAdd(formData);
    setFormData({
      name: '',
      description: '',
      quantity: 0,
      price: 0,
      category: ''
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' ? 
              (name === 'price' ? parseFloat(value) || 0 : parseInt(value) || 0) : 
              value
    }));
  };

  return (
    <form className="add-product-form" onSubmit={handleSubmit}>
      <h3>Add New Product</h3>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group">
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="form-row">
        <div className="form-group">
          <input
            type="number"
            name="quantity"
            placeholder="Quantity"
            value={formData.quantity}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className="form-group">
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            step="0.01"
            min="0"
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>
      </div>
      <button type="submit" className="btn btn-success">Add Product</button>
    </form>
  );
};

export default AddProduct;