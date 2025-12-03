import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Products = () => {
  const { products, loading, deleteProduct } = useInventory();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (loading) {
    return <LoadingSpinner message="Loading products..." />;
  }

  // Get unique categories
  const categories = ['all', ...new Set(products.map(p => p.category || 'Uncategorized'))];

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = searchTerm === '' || 
      product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.productCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.product?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      (product.category || 'Uncategorized') === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', class: 'danger' };
    if (quantity < 10) return { text: 'Low Stock', class: 'warning' };
    return { text: 'In Stock', class: 'success' };
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="products-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Products Inventory</h2>
              <p className="text-muted mb-0">
                Total: {products.length} products • Filtered: {filteredProducts.length}
              </p>
            </div>
            <div className="d-flex gap-2">
              <Link to="/products/add" className="btn btn-primary">
                <i className="bi bi-plus-circle me-2"></i>
                Add Product
              </Link>
              <Link to="/products/import" className="btn btn-outline-primary">
                <i className="bi bi-upload me-2"></i>
                Import
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products by name, code, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-4">
          <select
            className="form-select"
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
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Product Code</th>
                  <th>Product</th>
                  <th>Product Name</th>
                  <th>Size</th>
                  <th>Material</th>
                  <th>Model No</th>
                  <th>Quantity</th>
                  <th>Unit Rate</th>
                  <th>Total Buy</th>
                  <th>Sell Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <thead className="table-light">
                <tr>
                  <th>Product Code</th>
                  <th>Product</th>
                  <th>Product Name</th>
                  <th>Size</th>
                  <th>Material</th>
                  <th>Model No</th>
                  <th>Quantity</th>
                  <th>Unit Rate</th>
                  <th>Total Buy</th>
                  <th>Sell Rate</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-4">
                      <i className="bi bi-box display-4 text-muted mb-3"></i>
                      <h5>No products found</h5>
                      <p className="text-muted">Try adjusting your search or add a new product</p>
                      <Link to="/products/add" className="btn btn-primary">
                        Add First Product
                      </Link>
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map(product => {
                    const stockStatus = getStockStatus(product.quantity || 0);
                    
                    return (
                      <tr key={product.id}>
                        <td>
                          <span className="badge bg-secondary font-monospace">
                            {product.productCode}
                          </span>
                        </td>
                        <td>{product.product}</td>
                        <td>
                          <strong>{product.productName}</strong>
                        </td>
                        <td>{product.size || '-'}</td>
                        <td>
                          <span className="badge bg-info">{product.material}</span>
                        </td>
                        <td>{product.modelNo || '-'}</td>
                        <td className="text-center">
                          <span className={`badge ${
                            product.quantity === 0 ? 'bg-danger' : 
                            product.quantity < 10 ? 'bg-warning' : 'bg-success'
                          }`}>
                            {product.quantity}
                          </span>
                        </td>
                        <td>৳{product.unitRate}</td>
                        <td>
                          <strong>৳{product.totalBuy}</strong>
                        </td>
                        <td>
                          <strong className="text-success">৳{product.sellRate}</strong>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link 
                              to={`/products/view/${product.id}`}
                              className="btn btn-outline-info"
                              title="View"
                            >
                              <i className="bi bi-eye"></i>
                            </Link>
                            <Link 
                              to={`/products/edit/${product.id}`}
                              className="btn btn-outline-primary"
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button
                              className="btn btn-outline-danger"
                              onClick={() => handleDelete(product.id, product.productName)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
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
  );
};

export default Products;