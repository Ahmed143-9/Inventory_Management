import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';

const AddProduct = () => {
  const navigate = useNavigate();
  const { addProduct } = useInventory();
  
  // Excel Sheet এর Header অনুযায়ী Form Data
  const [formData, setFormData] = useState({
    // Product
    product: '',
    productName: '',
    size: '',
    brand: '',
    grade: '',
    material: '',
    color: '',
    modelNo: '',
    productCode: '',
    unitQty: 1,
    unit: 'PCS',
    unitRate: 0,
    totalBuy: 0,
    category: '',
    quantity: 0,
    approximateRate: 0,
    authenticationRate: 0,
    sellRate: 0
  });

  // তোমার Excel Sheet থেকে Categories
  const productCategories = [
    'Door Lock',
    'DOOR STOPPER', 
    'Door VIEWER',
    'screw',
    'cabinet magnet',
    'DRAWER LOCK',
    'HANDLE LOCK',
    'body Lock',
    'SIS LOCK',
    'Tower Bolt',
    'DOOR HINGES',
    'Hej BOLT',
    'HANDLE',
    'NET',
    'para',
    'Ring',
    'Clamp',
    'Hinges'
  ];

  // Materials/Colors তোমার Excel Sheet থেকে
  const materials = [
    'AB', 'AC', 'SS', 'CF', 'ORB', 
    'MAB WOOD', 'LAB WOOD', 'MAE WOOD',
    'Black', 'Golden', 'Silver',
    '7 color', 'GERY', 'Digital',
    'SS(20) Ac(20)', 'SL', 'black',
    'R/G', 'ST.', '3color', 'GP+R/G',
    'B-St', 'AB. 96', 'R/G+AB', '2R/G+ST+COOP',
    'GP+COP+R/G', 'bg'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updatedData = {
        ...prev,
        [name]: value
      };
      
      // Auto-calculate total buy
      if (name === 'unitRate' || name === 'quantity') {
        const unitRate = parseFloat(updatedData.unitRate) || 0;
        const quantity = parseFloat(updatedData.quantity) || 0;
        updatedData.totalBuy = unitRate * quantity;
        
        // Auto-calculate rates
        updatedData.approximateRate = Math.round(unitRate * 1.25);
        updatedData.authenticationRate = Math.round(unitRate * 1.20);
        updatedData.sellRate = Math.round(unitRate * 1.35);
      }
      
      // Auto-generate Product Code
      if (updatedData.product && updatedData.productName && updatedData.modelNo) {
        const code = generateProductCode(updatedData);
        updatedData.productCode = code;
      }
      
      return updatedData;
    });
  };

  const generateProductCode = (data) => {
    // Format: Product-Model-Size-Material-Color
    const parts = [
      data.product?.substring(0, 3).toUpperCase() || 'PRO',
      data.modelNo?.replace(/\./g, '').substring(0, 4) || '0000',
      data.size?.replace(/\s/g, '').substring(0, 3) || '000',
      data.material?.substring(0, 2).toUpperCase() || 'XX',
      data.color?.substring(0, 1).toUpperCase() || 'X'
    ];
    return parts.join('-');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.product || !formData.productName) {
      alert('Product and Product Name are required!');
      return;
    }

    // Add to inventory
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
              <h2 className="mb-1">Add New Product (Excel Format)</h2>
              <p className="text-muted mb-0">
                Product Code: <strong>{formData.productCode || 'Auto-generated on save'}</strong>
              </p>
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
            {/* Row 1: Basic Information */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  <i className="bi bi-tag me-1"></i>
                  Product *
                </label>
                <select
                  className="form-select"
                  name="product"
                  value={formData.product}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Product Type</option>
                  {productCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-5 mb-3">
                <label className="form-label">
                  <i className="bi bi-card-text me-1"></i>
                  Product Name *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  placeholder="e.g., Lever Lock AROMA, Round lock SMB"
                  required
                />
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-rulers me-1"></i>
                  Size
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  placeholder="e.g., 5/8'', 8'', medium"
                />
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-building me-1"></i>
                  Brand
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g., ATM, FSB, EASY"
                />
              </div>
            </div>

            {/* Row 2: Specifications */}
            <div className="row mb-4">
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-star me-1"></i>
                  Grade
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  placeholder="e.g., High, Premium"
                />
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-bricks me-1"></i>
                  Material *
                </label>
                <select
                  className="form-select"
                  name="material"
                  value={formData.material}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Material</option>
                  {materials.map(mat => (
                    <option key={mat} value={mat}>{mat}</option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-palette me-1"></i>
                  Color
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  placeholder="e.g., Black, Silver, Golden"
                />
              </div>
              
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  <i className="bi bi-upc-scan me-1"></i>
                  Model No *
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="modelNo"
                  value={formData.modelNo}
                  onChange={handleChange}
                  placeholder="e.g., 556.0, 9216.0, 5798XL"
                  required
                />
              </div>
              
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  <i className="bi bi-hash me-1"></i>
                  Product Code
                </label>
                <input
                  type="text"
                  className="form-control bg-light"
                  name="productCode"
                  value={formData.productCode}
                  readOnly
                  placeholder="Auto-generated"
                />
              </div>
            </div>

            {/* Row 3: Pricing */}
            <div className="row mb-4">
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-box me-1"></i>
                  Unit Qty
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="unitQty"
                  value={formData.unitQty}
                  onChange={handleChange}
                  min="1"
                />
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-box-seam me-1"></i>
                  Unit
                </label>
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
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-currency-dollar me-1"></i>
                  Unit Rate *
                </label>
                <div className="input-group">
                  <span className="input-group-text">৳</span>
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
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-calculator me-1"></i>
                  Quantity *
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-cash-stack me-1"></i>
                  Total Buy
                </label>
                <div className="input-group">
                  <span className="input-group-text">৳</span>
                  <input
                    type="number"
                    className="form-control bg-light"
                    name="totalBuy"
                    value={formData.totalBuy}
                    readOnly
                  />
                </div>
              </div>
              
              <div className="col-md-2 mb-3">
                <label className="form-label">
                  <i className="bi bi-grid-3x3 me-1"></i>
                  Category
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g., Door Hardware"
                />
              </div>
            </div>

            {/* Row 4: Selling Rates */}
            <div className="row mb-4">
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  <i className="bi bi-tag me-1"></i>
                  Approximate Rate
                </label>
                <div className="input-group">
                  <span className="input-group-text">৳</span>
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
              
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  <i className="bi bi-shield-check me-1"></i>
                  Authentication Rate
                </label>
                <div className="input-group">
                  <span className="input-group-text">৳</span>
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
              
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  <i className="bi bi-currency-dollar me-1"></i>
                  Sell Rate *
                </label>
                <div className="input-group">
                  <span className="input-group-text">৳</span>
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
              
              <div className="col-md-3 mb-3">
                <label className="form-label">
                  <i className="bi bi-percent me-1"></i>
                  Profit Margin
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={formData.unitRate > 0 ? 
                      Math.round(((formData.sellRate - formData.unitRate) / formData.unitRate) * 100) : 0
                    }
                    readOnly
                  />
                  <span className="input-group-text">%</span>
                </div>
              </div>
            </div>

            {/* Summary Card */}
            <div className="card bg-light border-0 mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-3">
                    <small className="text-muted d-block">Total Investment</small>
                    <h5 className="text-primary">৳ {formData.totalBuy.toLocaleString()}</h5>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted d-block">Potential Sales</small>
                    <h5 className="text-success">
                      ৳ {(formData.quantity * formData.sellRate).toLocaleString()}
                    </h5>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted d-block">Potential Profit</small>
                    <h5 className="text-warning">
                      ৳ {((formData.quantity * formData.sellRate) - formData.totalBuy).toLocaleString()}
                    </h5>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted d-block">Profit Margin</small>
                    <h5 className="text-info">
                      {formData.unitRate > 0 ? 
                        Math.round(((formData.sellRate - formData.unitRate) / formData.unitRate) * 100) : 0
                      }%
                    </h5>
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="row mt-4">
              <div className="col-md-12">
                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => {
                      if (window.confirm('Are you sure? All data will be lost.')) {
                        setFormData({
                          product: '',
                          productName: '',
                          size: '',
                          brand: '',
                          grade: '',
                          material: '',
                          color: '',
                          modelNo: '',
                          productCode: '',
                          unitQty: 1,
                          unit: 'PCS',
                          unitRate: 0,
                          totalBuy: 0,
                          category: '',
                          quantity: 0,
                          approximateRate: 0,
                          authenticationRate: 0,
                          sellRate: 0
                        });
                      }
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Clear Form
                  </button>
                  
                  <div className="d-flex gap-2">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => navigate('/products')}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary px-4"
                    >
                      <i className="bi bi-check-circle me-2"></i>
                      Save Product
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Help Text */}
      <div className="alert alert-info mt-4">
        <i className="bi bi-info-circle me-2"></i>
        <strong>Note:</strong> This form follows your Excel sheet structure. Fields marked with * are required.
        Product Code is auto-generated based on Product, Model No, Size, Material, and Color.
      </div>
    </div>
  );
};

export default AddProduct;