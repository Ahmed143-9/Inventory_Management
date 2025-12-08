import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, updateProduct } = useInventory();
  
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [originalProduct, setOriginalProduct] = useState(null);

  useEffect(() => {
    const product = products.find(p => p.id === parseInt(id));
    if (product) {
      setFormData({ ...product });
      setOriginalProduct(product);
    }
    setLoading(false);
  }, [id, products]);

  if (loading) {
    return <LoadingSpinner message="Loading product..." />;
  }

  if (!formData) {
    return (
      <div className="text-center py-5">
        <h3>Product not found</h3>
        <button 
          className="btn btn-primary mt-3"
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    // Handle number inputs properly
    const val = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create an object with only the changed fields
    const updates = {};
    Object.keys(formData).forEach(key => {
      if (formData[key] !== originalProduct[key]) {
        updates[key] = formData[key];
      }
    });
    
    // Always update the updatedAt timestamp
    updates.updatedAt = new Date().toISOString();
    
    // Recalculate totalBuy if quantity or unitRate changed
    if (updates.quantity !== undefined || updates.unitRate !== undefined) {
      updates.totalBuy = (formData.quantity || 0) * (formData.unitRate || 0);
    }
    
    updateProduct(parseInt(id), updates);
    alert('Product updated successfully!');
    navigate('/products');
  };

  return (
    <div className="edit-product-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Edit Product</h2>
              <p className="text-muted mb-0">
                Product Code: <strong>{formData.productCode}</strong>
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
            <div className="row">
              <div className="col-md-6 mb-3">
                <h5 className="border-bottom pb-2 mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Basic Information
                </h5>
                
                <div className="mb-3">
                  <label className="form-label">Product Type</label>
                  <input
                    type="text"
                    className="form-control"
                    name="product"
                    value={formData.product || ''}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Product Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productName"
                    value={formData.productName || ''}
                    onChange={handleChange}
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
                      value={formData.size || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Model No</label>
                    <input
                      type="text"
                      className="form-control"
                      name="modelNo"
                      value={formData.modelNo || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Category</label>
                  <input
                    type="text"
                    className="form-control"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <h5 className="border-bottom pb-2 mb-3">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Pricing & Stock
                </h5>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Current Quantity</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={formData.quantity || ''}
                      onChange={handleChange}
                      min="0"
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Unit</label>
                    <input
                      type="text"
                      className="form-control"
                      name="unit"
                      value={formData.unit || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Purchase Rate</label>
                  <div className="input-group">
                    <span className="input-group-text">৳</span>
                    <input
                      type="number"
                      className="form-control"
                      name="unitRate"
                      value={formData.unitRate || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Sell Rate</label>
                  <div className="input-group">
                    <span className="input-group-text">৳</span>
                    <input
                      type="number"
                      className="form-control"
                      name="sellRate"
                      value={formData.sellRate || ''}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Material</label>
                    <input
                      type="text"
                      className="form-control"
                      name="material"
                      value={formData.material || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Color</label>
                    <input
                      type="text"
                      className="form-control"
                      name="color"
                      value={formData.color || ''}
                      onChange={handleChange}
                    />
                  </div>
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
                    Update Product
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

export default EditProduct;