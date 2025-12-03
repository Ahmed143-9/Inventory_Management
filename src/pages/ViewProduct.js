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

  return (
    <div className="view-product-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Product Details</h2>
              <p className="text-muted mb-0">Complete information about the product</p>
            </div>
            <div className="d-flex gap-2">
              <button 
                className="btn btn-outline-secondary"
                onClick={() => navigate('/products')}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back to Products
              </button>
              <Link 
                to={`/products/edit/${id}`}
                className="btn btn-primary"
              >
                <i className="bi bi-pencil me-2"></i>
                Edit Product
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Product Information</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">Product Code</label>
                    <div className="h5">
                      <span className="badge bg-secondary">{product.productCode}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Product Type</label>
                    <div className="h5">{product.product}</div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Product Name</label>
                    <div className="h4 text-primary">{product.productName}</div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Model Number</label>
                    <div className="h5">{product.modelNo || 'N/A'}</div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Brand</label>
                    <div className="h5">{product.brand || 'N/A'}</div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label text-muted">Size</label>
                    <div className="h5">
                      {product.size ? (
                        <span className="badge bg-info">{product.size}</span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Material</label>
                    <div className="h5">
                      {product.material ? (
                        <span className="badge bg-primary">{product.material}</span>
                      ) : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Color</label>
                    <div className="h5">{product.color || 'N/A'}</div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Grade</label>
                    <div className="h5">{product.grade || 'N/A'}</div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label text-muted">Category</label>
                    <div className="h5">
                      <span className="badge bg-light text-dark">{product.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0">Stock & Pricing</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div className={`display-6 mb-2 text-${stockStatus.class}`}>
                  <i className={`bi ${stockStatus.icon}`}></i>
                </div>
                <h3 className={`text-${stockStatus.class}`}>
                  {product.quantity || 0} {product.unit || 'PCS'}
                </h3>
                <p className={`text-${stockStatus.class} fw-semibold`}>
                  {stockStatus.text}
                </p>
              </div>
              
              <div className="border-top pt-3">
                <div className="row">
                  <div className="col-6">
                    <div className="mb-2">
                      <small className="text-muted d-block">Unit</small>
                      <strong>{product.unit || 'PCS'}</strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="mb-2">
                      <small className="text-muted d-block">Unit Qty</small>
                      <strong>{product.unitQty || 1}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="mb-2">
                    <small className="text-muted d-block">Purchase Rate</small>
                    <h5 className="text-primary">${product.unitRate || 0}</h5>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted d-block">Sell Rate</small>
                    <h5 className="text-success">${product.sellRate || 0}</h5>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted d-block">Approx. Rate</small>
                    <div>${product.approximateRate || 0}</div>
                  </div>
                  
                  <div className="mb-2">
                    <small className="text-muted d-block">Auth. Rate</small>
                    <div>${product.authenticationRate || 0}</div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="alert alert-info small">
                    <i className="bi bi-info-circle me-2"></i>
                    Profit Margin: <strong>
                      {product.unitRate > 0 ? 
                        Math.round(((product.sellRate - product.unitRate) / product.unitRate) * 100) : 0
                      }%
                    </strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-light">
          <h5 className="mb-0">Additional Information</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">Created At</label>
                <div>{new Date(product.createdAt).toLocaleString()}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="mb-3">
                <label className="form-label text-muted">Last Updated</label>
                <div>{new Date(product.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="form-label text-muted">Total Stock Value</label>
            <h3 className="text-primary">
              ${((product.quantity || 0) * (product.unitRate || 0)).toLocaleString()}
            </h3>
            <small className="text-muted">
              Quantity ({product.quantity || 0}) × Purchase Rate (${product.unitRate || 0})
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;