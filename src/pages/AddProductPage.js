import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useInventory();
  
  const [formData, setFormData] = useState({
    product: '',
    productName: '',
    size: '',
    brand: '',
    grade: '',
    material: '',
    color: '',
    modelNo: '',
    category: '',
    unit: 'PCS',
    unitQty: 1,
    quantity: 0,
    unitRate: 0,
    approximateRate: 0,
    authenticationRate: 0,
    sellRate: 0
  });

  const categories = [
    'Door Hardware',
    'Door Accessories',
    'Fasteners',
    'Handles',
    'Locks',
    'Hinges',
    'Screws',
    'Nets',
    'PVC',
    'Tools',
    'Electrical',
    'Other'
  ];

  const materials = ['AB', 'AC', 'SS', 'CF', 'ORB', 'MAB', 'MAE', 'MAC', 'LAB', '7 color', 'Black', 'Golden', 'Silver'];
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate sell rate if purchase rate changes
    if (name === 'unitRate') {
      const rate = parseFloat(value) || 0;
      setFormData(prev => ({
        ...prev,
        approximateRate: Math.round(rate * 1.25),
        authenticationRate: Math.round(rate * 1.20),
        sellRate: Math.round(rate * 1.35)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.product || !formData.productName) {
      alert('Product and Product Name are required!');
      return;
    }

    addProduct(formData);
    
    alert('Product added successfully!');
    navigate('/products');
  };

  return (
    <div className="add-product-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Add New Product</h2>
              <p className="text-muted mb-0">Add a new product to inventory</p>
            </div>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => navigate('/products')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back to Products
            </button>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Basic Information */}
              <div className="col-md-6 mb-3">
                <h5 className="border-bottom pb-2 mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Basic Information
                </h5>
                
                <div className="mb-3">
                  <label className="form-label">Product Type*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="product"
                    value={formData.product}
                    onChange={handleChange}
                    placeholder="e.g., Door Lock, Screw, Handle"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Name*</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productName"
                    value={formData.productName}
                    onChange={handleChange}
                    placeholder="e.g., Lever Lock AROMA, Star Screw Prime"
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Size</label>
                    <input
                      type="text"
                      className="form-control"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      placeholder="e.g., 5/8'', medium"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Model No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="modelNo"
                      value={formData.modelNo}
                      onChange={handleChange}
                      placeholder="e.g., 556.0, 9216.0"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Material</label>
                    <select
                      className="form-select"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                    >
                      <option value="">Select Material</option>
                      {materials.map(mat => (
                        <option key={mat} value={mat}>{mat}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      placeholder="e.g., Black, Silver"
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="col-md-6 mb-3">
                <h5 className="border-bottom pb-2 mb-3">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Pricing & Stock
                </h5>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Unit</label>
                    <select
                      className="form-select"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                    >
                      <option value="PCS">PCS</option>
                      <option value="BOX">BOX</option>
                      <option value="SET">SET</option>
                      <option value="KG">KG</option>
                      <option value="METER">METER</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Unit Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="unitQty"
                      value={formData.unitQty}
                      onChange={handleChange}
                      min="1"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Initial Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="0"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Purchase Rate (Unit Price)*</label>
                  <div className="input-group">
                    <span className="input-group-text">$</span>
                    <input
                      type="number"
                      className="form-control"
                      name="unitRate"
                      value={formData.unitRate}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Approx. Rate</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        name="approximateRate"
                        value={formData.approximateRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Auth. Rate</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        name="authenticationRate"
                        value={formData.authenticationRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Sell Rate*</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        name="sellRate"
                        value={formData.sellRate}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Brand</label>
                  <input
                    type="text"
                    className="form-control"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g., ATM, FSB, EASY"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Grade</label>
                  <input
                    type="text"
                    className="form-control"
                    name="grade"
                    value={formData.grade}
                    onChange={handleChange}
                    placeholder="e.g., Premium, High, Medium"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-4">
              <div className="col-md-12">
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate('/products')}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Add Product
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;