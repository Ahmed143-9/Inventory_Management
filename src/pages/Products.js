import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Products = () => {
  const { products, loading, deleteProduct } = useInventory();
  const { currentUser } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Check if user is admin (only admins can delete)
  const isAdmin = currentUser && currentUser.role === 'superadmin';

  // Memoize filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    if (!searchTerm && selectedCategory === 'all') {
      return products;
    }
    
    return products.filter(product => {
      // Create a comprehensive search string that includes all relevant fields
      const searchableText = [
        product.productName,
        product.productCode,
        product.product,
        product.material,
        product.modelNo,
        product.brand,
        product.grade,
        product.color,
        product.size,
        product.category,
        product.description
      ].filter(Boolean).join(' ').toLowerCase();
      
      const matchesSearch = searchTerm === '' || 
        searchableText.includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
        (product.category || 'Uncategorized') === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Memoize categories to prevent unnecessary re-renders
  const categories = useMemo(() => {
    return ['all', ...new Set(products.map(p => p.category || 'Uncategorized'))];
  }, [products]);

  const handleDelete = (id, name) => {
    if (isAdmin && window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
    }
  };

  // Memoize stock status calculation
  const getStockStatus = useMemo(() => {
    return (quantity) => {
      if (quantity === 0) {
        return { class: 'bg-danger', text: 'Out of Stock' };
      } else if (quantity <= 5) {
        return { class: 'bg-warning', text: 'Low Stock' };
      } else {
        return { class: 'bg-success', text: 'In Stock' };
      }
    };
  }, []);

  // Calculate profit margin
  const calculateProfitMargin = (unitRate, sellRate) => {
    if (unitRate <= 0) return 0;
    return ((sellRate - unitRate) / unitRate) * 100;
  };

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  return (
    <div className="products-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Products Inventory</h2>
              <p className="text-muted mb-0 small">
                Total: {products.length} products • Filtered: {filteredProducts.length}
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/products/add" className="btn btn-primary btn-sm">
                <i className="bi bi-plus-circle me-1"></i>
                Add Product
              </Link>
              {/* Import button removed as per requirement - only one centralized import location */}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-light border-0">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control border-0 bg-light"
              placeholder="Search products by name, code, material, model, brand, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select border-0 bg-light"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-striped table-hover mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th width="25%" className="small">Product Information</th>
                      <th width="15%" className="small">Category & Brand</th>
                      <th width="20%" className="small">Specifications</th>
                      <th width="15%" className="small">Inventory</th>
                      <th width="15%" className="small">Pricing</th>
                      <th width="10%" className="small">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5">
                          <i className="bi bi-inbox display-1 text-muted"></i>
                          <h5 className="mt-3">No products found</h5>
                          <p className="text-muted small">
                            {searchTerm ? 'Try adjusting your search term' : 'Add your first product to get started'}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map(product => {
                        // Determine stock status
                        const stockStatus = getStockStatus(product.quantity);
                        
                        // Calculate profit margin
                        const profitMargin = calculateProfitMargin(product.unitRate, product.sellRate);
                        const profitMarginClass = profitMargin >= 20 ? 'text-success' : 
                                                profitMargin >= 0 ? 'text-warning' : 'text-danger';

                        return (
                          <tr key={product.id} className="align-middle">
                            <td className="small">
                              <div className="d-flex">
                                <div className="me-2">
                                  <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{width: '30px', height: '30px'}}>
                                    <i className="bi bi-box-seam text-primary small"></i>
                                  </div>
                                </div>
                                <div>
                                  <div className="fw-bold text-dark small mb-0">{product.productName}</div>
                                  <div className="text-muted small mb-0">{product.productCode}</div>
                                  <div className="text-muted small mb-0">{product.product}</div>
                                </div>
                              </div>
                            </td>
                            <td className="small">
                              <div>
                                <span className="badge bg-primary small">{product.category || 'Uncategorized'}</span>
                              </div>
                              <div className="mt-1">
                                {product.brand && <span className="badge bg-secondary me-1 small">{product.brand}</span>}
                                {product.grade && <span className="badge bg-info small">{product.grade}</span>}
                              </div>
                            </td>
                            <td className="small">
                              <div className="d-flex flex-wrap gap-1">
                                {product.modelNo && <span className="badge bg-light text-dark border small">{product.modelNo}</span>}
                                {product.size && <span className="badge bg-light text-dark border small">{product.size}</span>}
                                {product.material && <span className="badge bg-light text-dark border small">{product.material}</span>}
                                {product.color && <span className="badge bg-light text-dark border small">{product.color}</span>}
                              </div>
                            </td>
                            <td className="small">
                              <div className="d-flex align-items-center mb-1">
                                <span className={`badge ${stockStatus.class} me-2 small`}>
                                  {product.quantity} {product.unit || 'PCS'}
                                </span>
                              </div>
                              <div className="text-muted small">{stockStatus.text}</div>
                              {product.quantity <= 5 && product.quantity > 0 && (
                                <div className="mt-1">
                                  <span className="badge bg-warning text-dark small">
                                    <i className="bi bi-exclamation-triangle me-1"></i>
                                    Low Stock
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="small">
                              <div className="mb-1">
                                <span className="text-muted small">Buy: </span>
                                <strong className="text-primary small">৳{product.unitRate || 0}</strong>
                              </div>
                              <div className="mb-1">
                                <span className="text-muted small">Sell: </span>
                                <strong className="text-success small">৳{product.sellRate || 0}</strong>
                              </div>
                              <div>
                                <span className={`badge ${profitMarginClass} small`}>
                                  {profitMargin.toFixed(1)}%
                                </span>
                              </div>
                            </td>
                            <td className="small">
                              <div className="btn-group btn-group-sm">
                                <Link 
                                  to={`/products/view/${product.id}`}
                                  className="btn btn-outline-info btn-sm"
                                  title="View Details"
                                >
                                  <i className="bi bi-eye"></i>
                                </Link>
                                <Link 
                                  to={`/products/edit/${product.id}`}
                                  className="btn btn-outline-primary btn-sm"
                                  title="Edit"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Link>
                              </div>
                              {isAdmin && (
                                <button
                                  className="btn btn-outline-danger btn-sm w-100 mt-1"
                                  onClick={() => handleDelete(product.id, product.productName)}
                                  title="Delete"
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;