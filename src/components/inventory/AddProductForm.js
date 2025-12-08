// src/components/inventory/AddProductForm.js
import React, { useState } from 'react';

const AddProductForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    quantity: '',
    price: '',
    cost: '',
    category: ''
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!formData.name.trim()) {
      setMessage('Product name is required');
      setTimeout(() => setMessage(''), 3000);
      setIsSubmitting(false);
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        quantity: parseInt(formData.quantity) || 0,
        price: parseFloat(formData.price) || 0,
        cost: parseFloat(formData.cost) || 0,
        category: formData.category.trim()
      };

      onAdd(productData);
      
      setMessage('Product added successfully!');
      setTimeout(() => setMessage(''), 3000);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        quantity: '',
        price: '',
        cost: '',
        category: ''
      });
    } catch (error) {
      setMessage('Error adding product. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClear = () => {
    setFormData({
      name: '',
      description: '',
      quantity: '',
      price: '',
      cost: '',
      category: ''
    });
    setMessage('');
  };

  return (
    <div className="add-product-form-container">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-plus-circle me-2"></i>
                <h4 className="mb-0">Add New Product</h4>
              </div>
              <p className="mb-0 mt-1 opacity-75">Fill in the product details below</p>
            </div>
            
            <div className="card-body p-4">
              {message && (
                <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'} d-flex align-items-center`}>
                  <i className={`bi ${message.includes('successfully') ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Product Name */}
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="productName" className="form-label fw-semibold">
                      Product Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-box"></i>
                      </span>
                      <input
                        type="text"
                        id="productName"
                        name="name"
                        className="form-control form-control-lg"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-text">Enter a descriptive name for the product</div>
                  </div>
                </div>

                {/* Description */}
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="productDescription" className="form-label fw-semibold">
                      Description
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light align-items-start">
                        <i className="bi bi-text-paragraph"></i>
                      </span>
                      <textarea
                        id="productDescription"
                        name="description"
                        className="form-control"
                        placeholder="Enter product description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="3"
                      />
                    </div>
                    <div className="form-text">Provide details about the product (optional)</div>
                  </div>
                </div>

                {/* Quantity, Price, Category */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <label htmlFor="productQuantity" className="form-label fw-semibold">
                      Quantity
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-123"></i>
                      </span>
                      <input
                        type="number"
                        id="productQuantity"
                        name="quantity"
                        className="form-control"
                        placeholder="0"
                        value={formData.quantity}
                        onChange={handleChange}
                        min="0"
                      />
                    </div>
                    <div className="form-text">Current stock quantity</div>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="productCost" className="form-label fw-semibold">
                      Cost (৳)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">৳</span>
                      <input
                        type="number"
                        id="productCost"
                        name="cost"
                        className="form-control"
                        placeholder="0.00"
                        value={formData.cost}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="form-text">Unit cost in BDT</div>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="productPrice" className="form-label fw-semibold">
                      Price (৳)
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">৳</span>
                      <input
                        type="number"
                        id="productPrice"
                        name="price"
                        className="form-control"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                      />
                    </div>
                    <div className="form-text">Unit price in BDT</div>
                  </div>

                  <div className="col-md-3">
                    <label htmlFor="productCategory" className="form-label fw-semibold">
                      Category
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light">
                        <i className="bi bi-tags"></i>
                      </span>
                      <input
                        type="text"
                        id="productCategory"
                        name="category"
                        className="form-control"
                        placeholder="e.g., Electronics"
                        value={formData.category}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-text">Product category or type</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="row">
                  <div className="col-md-12">
                    <div className="d-flex gap-2 justify-content-end border-top pt-4">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary px-4"
                        onClick={handleClear}
                        disabled={isSubmitting}
                      >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Clear Form
                      </button>
                      <button 
                        type="submit" 
                        className="btn btn-success px-4"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Adding...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle me-2"></i>
                            Add Product
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="card mt-4 border-0 bg-light">
            <div className="card-body">
              <h6 className="card-title d-flex align-items-center">
                <i className="bi bi-lightbulb text-warning me-2"></i>
                Quick Tips
              </h6>
              <ul className="list-unstyled mb-0 small">
                <li className="mb-1">
                  <i className="bi bi-check text-success me-2"></i>
                  Use descriptive names for easy identification
                </li>
                <li className="mb-1">
                  <i className="bi bi-check text-success me-2"></i>
                  Set accurate quantities to track inventory levels
                </li>
                <li className="mb-1">
                  <i className="bi bi-check text-success me-2"></i>
                  Categorize products for better organization
                </li>
                <li className="mb-0">
                  <i className="bi bi-check text-success me-2"></i>
                  Include prices for value tracking and reporting
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductForm;