import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ViewProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useInventory();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
    setLoading(false);
  }, [id, products]);

  if (loading) {
    return <LoadingSpinner message="Loading product details..." />;
  }

  if (!product) {
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

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'danger', icon: 'bi-x-circle' };
    if (quantity < 10) return { text: 'Low Stock', class: 'warning', icon: 'bi-exclamation-triangle' };
    return { text: 'In Stock', class: 'success', icon: 'bi-check-circle' };
  };

  const stockStatus = getStockStatus(product.quantity || 0);
  
  // Calculate profit margin
  const calculateProfitMargin = (unitRate, sellRate) => {
    if (unitRate <= 0) return 0;
    return ((sellRate - unitRate) / unitRate) * 100;
  };
  
  const profitMargin = calculateProfitMargin(product.unitRate, product.sellRate);

  return (
    <div className="view-product-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Product Details</h2>
              <p className="text-muted mb-0 small">Complete information about the product</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={() => navigate('/products')}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to Products
              </button>
              <Link 
                to={`/products/edit/${id}`}
                className="btn btn-primary btn-sm"
              >
                <i className="bi bi-pencil me-1"></i>
                Edit Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-gradient-primary text-white py-2">
              <div className="d-flex align-items-center">
                <i className="bi bi-box-seam me-2"></i>
                <h5 className="mb-0 small">Product Information</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Product Code</label>
                    <div className="h6 mb-0">
                      <span className="badge bg-primary small">{product.productCode}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Product Type</label>
                    <div className="h6 mb-0 small">{product.product}</div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Product Name</label>
                    <div className="h5 text-primary mb-0 small">{product.productName}</div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Model Number</label>
                    <div className="h6 mb-0">
                      {product.modelNo ? (
                        <span className="badge bg-info small">{product.modelNo}</span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Brand</label>
                    <div className="h6 mb-0">
                      {product.brand ? (
                        <span className="badge bg-secondary small">{product.brand}</span>
                      ) : 'N/A'}
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Size</label>
                    <div className="h6 mb-0">
                      {product.size ? (
                        <span className="badge bg-warning text-dark small">{product.size}</span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Material</label>
                    <div className="h6 mb-0">
                      {product.material ? (
                        <span className="badge bg-success small">{product.material}</span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Color</label>
                    <div className="h6 mb-0">
                      {product.color ? (
                        <span className="badge bg-dark small">{product.color}</span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Grade</label>
                    <div className="h6 mb-0">
                      {product.grade ? (
                        <span className="badge bg-info small">{product.grade}</span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Category</label>
                    <div className="h6 mb-0">
                      <span className="badge bg-light text-dark small">{product.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-12">
                  <div className="mb-0">
                    <label className="form-label text-muted fw-medium small">Description</label>
                    <div className="bg-light p-2 rounded small">
                      {product.description || 'No description provided'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-info text-white py-2">
              <div className="d-flex align-items-center">
                <i className="bi bi-calculator me-2"></i>
                <h5 className="mb-0 small">Inventory Details</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Unit</label>
                    <div className="h6 mb-0 small">{product.unit || 'PCS'}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Unit Quantity</label>
                    <div className="h6 mb-0 small">{product.unitQty || 1}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Current Stock</label>
                    <div className="h6 mb-0 small">{product.quantity || 0} {product.unit || 'PCS'}</div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="mb-3">
                    <label className="form-label text-muted fw-medium small">Stock Status</label>
                    <div className={`h6 mb-0 text-${stockStatus.class} small`}>
                      <i className={`bi ${stockStatus.icon} me-1`}></i>
                      {stockStatus.text}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-gradient-success text-white py-2">
              <div className="d-flex align-items-center">
                <i className="bi bi-currency-dollar me-2"></i>
                <h5 className="mb-0 small">Pricing Information</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Purchase Rate</label>
                <div className="h5 text-primary mb-0 small">৳{product.unitRate || 0}</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Sell Rate</label>
                <div className="h5 text-success mb-0 small">৳{product.sellRate || 0}</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Approximate Rate</label>
                <div className="h6 mb-0 small">৳{product.approximateRate || 0}</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Authentication Rate</label>
                <div className="h6 mb-0 small">৳{product.authenticationRate || 0}</div>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Total Buy Cost</label>
                <div className="h6 mb-0 small">৳{product.totalBuy || 0}</div>
              </div>
              
              <hr className="my-3" />
              
              <div className="alert alert-info mb-0 py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fw-medium small">Profit Margin:</span>
                  <span className={`fw-medium small ${profitMargin >= 20 ? 'text-success' : 
                                                       profitMargin >= 0 ? 'text-warning' : 'text-danger'}`}>
                    {profitMargin.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-gradient-warning text-white py-2">
              <div className="d-flex align-items-center">
                <i className="bi bi-graph-up me-2"></i>
                <h5 className="mb-0 small">Financial Summary</h5>
              </div>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Total Stock Value</label>
                <div className="h6 text-primary mb-0 small">
                  ৳{(product.quantity * product.unitRate).toLocaleString()}
                </div>
                <small className="text-muted small">
                  ({product.quantity || 0} × ৳{product.unitRate || 0})
                </small>
              </div>
              
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Potential Revenue</label>
                <div className="h6 text-success mb-0 small">
                  ৳{(product.quantity * product.sellRate).toLocaleString()}
                </div>
                <small className="text-muted small">
                  ({product.quantity || 0} × ৳{product.sellRate || 0})
                </small>
              </div>
              
              <div className="mb-0">
                <label className="form-label text-muted fw-medium small">Potential Profit</label>
                <div className={`h6 mb-0 small ${profitMargin >= 0 ? 'text-success' : 'text-danger'}`}>
                  ৳{((product.quantity * (product.sellRate - product.unitRate))).toLocaleString()}
                </div>
                <small className="text-muted small">
                  ({product.quantity || 0} × (৳{product.sellRate || 0} - ৳{product.unitRate || 0}))
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-gradient-secondary text-white py-2">
          <div className="d-flex align-items-center">
            <i className="bi bi-clock-history me-2"></i>
            <h5 className="mb-0 small">Product Timeline</h5>
          </div>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Created At</label>
                <div className="h6 mb-0 small">
                  <i className="bi bi-calendar me-1"></i>
                  {new Date(product.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted fw-medium small">Last Updated</label>
                <div className="h6 mb-0 small">
                  <i className="bi bi-calendar-check me-1"></i>
                  {new Date(product.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;