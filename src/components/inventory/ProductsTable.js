// src/components/inventory/ProductsTable.js
import React, { useState, useMemo } from 'react';
import useAdvancedSearch from '../../hooks/useAdvancedSearch';

const ProductsTable = ({ products, sales, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  // Use advanced search with debouncing
  const filteredProducts = useAdvancedSearch(
    products,
    searchTerm,
    ['name', 'description', 'productCode', 'category'],
    { category: filterCategory === 'all' ? null : filterCategory }
  );

  // Memoize categories to avoid recreating on every render
  const categories = useMemo(() => {
    const uniqueCategories = new Set(products.map(product => product.category));
    return ['all', ...uniqueCategories].filter(Boolean); // Filter out undefined/null values
  }, [products]);

  // Create a map for O(1) product lookups
  const productMap = useMemo(() => {
    const map = new Map();
    products.forEach(product => map.set(product.id, product));
    return map;
  }, [products]);

  // Create a map for O(1) sales lookups by product ID
  const salesByProductMap = useMemo(() => {
    const map = new Map();
    
    // Group sales by product ID
    sales.forEach(sale => {
      const productId = sale.productId;
      if (!map.has(productId)) {
        map.set(productId, []);
      }
      map.get(productId).push(sale);
    });
    
    return map;
  }, [sales]);

  // Quick quantity adjustment - optimized with product map
  const handleQuickQuantity = (productId, change) => {
    const product = productMap.get(productId);
    if (product) {
      const newQuantity = Math.max(0, product.quantity + change);
      onUpdate(productId, { quantity: newQuantity });
    }
  };

  // Quick price adjustment - optimized with product map
  const handleQuickPrice = (productId, change) => {
    const product = productMap.get(productId);
    if (product) {
      const newPrice = Math.max(0, product.price + change);
      onUpdate(productId, { price: parseFloat(newPrice.toFixed(2)) });
    }
  };

  // Full edit mode
  const handleEdit = (product) => {
    setEditingId(product.id);
    setEditedProduct({ ...product });
  };

  const handleSave = (productId) => {
    onUpdate(productId, editedProduct);
    setEditingId(null);
    setEditedProduct({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedProduct({});
  };

  const handleChange = (field, value) => {
    setEditedProduct(prev => ({
      ...prev,
      [field]: field === 'quantity' ? parseInt(value) || 0 : 
               field === 'price' || field === 'cost' ? parseFloat(value) || 0 : value
    }));
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  const getStockBadgeClass = (quantity) => {
    if (quantity === 0) return 'bg-danger';
    if (quantity < 10) return 'bg-warning';
    return 'bg-success';
  };

  // Memoize summary statistics calculations
  const summaryStats = useMemo(() => {
    if (filteredProducts.length === 0) {
      return {
        totalProducts: 0,
        totalValue: 0,
        lowStock: 0,
        outOfStock: 0,
        avgPrice: 0,
        totalItems: 0
      };
    }

    let totalValue = 0;
    let totalItems = 0;
    let lowStock = 0;
    let outOfStock = 0;
    let totalPrice = 0;

    // Single pass through filtered products for all calculations
    filteredProducts.forEach(product => {
      totalValue += (product.price || 0) * (product.quantity || 0);
      totalItems += product.quantity || 0;
      totalPrice += product.price || 0;
      
      if (product.quantity === 0) {
        outOfStock++;
      } else if (product.quantity < 10) {
        lowStock++;
      }
    });

    const avgPrice = filteredProducts.length > 0 ? totalPrice / filteredProducts.length : 0;

    return {
      totalProducts: filteredProducts.length,
      totalValue,
      lowStock,
      outOfStock,
      avgPrice,
      totalItems
    };
  }, [filteredProducts]);

  return (
    <div className="products-table-container">
      {/* Search and Filter */}
      <div className="row mb-3">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-light">
              <i className="bi bi-filter"></i>
            </span>
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover table-sm">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Cost</th>
              <th>Profit Margin</th>
              <th>Status</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(product => (
              <tr key={product.id} className="align-middle">
                {/* ID */}
                <td>
                  <strong>#{product.id}</strong>
                </td>

                {/* Product Name */}
                <td>
                  {editingId === product.id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editedProduct.name || ''}
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  ) : (
                    <strong>{product.name}</strong>
                  )}
                </td>

                {/* Description */}
                <td>
                  {editingId === product.id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editedProduct.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                    />
                  ) : (
                    <span className="text-muted">{product.description}</span>
                  )}
                </td>

                {/* Category */}
                <td>
                  {editingId === product.id ? (
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      value={editedProduct.category || ''}
                      onChange={(e) => handleChange('category', e.target.value)}
                    />
                  ) : (
                    <span className="badge bg-secondary">{product.category}</span>
                  )}
                </td>

                {/* Quantity - With Compact Controls */}
                <td>
                  {editingId === product.id ? (
                    <input
                      type="number"
                      className="form-control form-control-sm"
                      value={editedProduct.quantity || ''}
                      onChange={(e) => handleChange('quantity', e.target.value)}
                      min="0"
                    />
                  ) : (
                    <div className="text-center">
                      {/* Main Value */}
                      <div className={`
                        fw-bold mb-1
                        ${product.quantity === 0 ? 'text-danger' : 
                          product.quantity < 10 ? 'text-warning' : 'text-success'}
                      `}>
                        {product.quantity}
                      </div>
                      
                      {/* Compact Controls */}
                      <div className="d-flex justify-content-center gap-1">
                        <button
                          className="btn btn-outline-danger btn-xs"
                          onClick={() => handleQuickQuantity(product.id, -1)}
                          disabled={product.quantity <= 0}
                          title="Decrease by 1"
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        
                        <button
                          className="btn btn-outline-warning btn-xs"
                          onClick={() => handleQuickQuantity(product.id, -5)}
                          disabled={product.quantity < 5}
                          title="Decrease by 5"
                        >
                          -5
                        </button>
                        
                        <button
                          className="btn btn-outline-info btn-xs"
                          onClick={() => handleQuickQuantity(product.id, 5)}
                          title="Increase by 5"
                        >
                          +5
                        </button>
                        
                        <button
                          className="btn btn-outline-success btn-xs"
                          onClick={() => handleQuickQuantity(product.id, 1)}
                          title="Increase by 1"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </td>

                {/* Price - With Compact Controls */}
                <td>
                  {editingId === product.id ? (
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">৳</span>
                      <input
                        type="number"
                        className="form-control"
                        value={editedProduct.price || ''}
                        onChange={(e) => handleChange('price', e.target.value)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      {/* Main Value */}
                      <div className="fw-bold text-primary mb-1">
                        ৳{product.price}
                      </div>
                      
                      {/* Compact Controls */}
                      <div className="d-flex justify-content-center gap-1">
                        <button
                          className="btn btn-outline-secondary btn-xs"
                          onClick={() => handleQuickPrice(product.id, -1)}
                          disabled={product.price <= 1}
                          title="Decrease by ৳1"
                        >
                          <i className="bi bi-dash"></i>
                        </button>
                        
                        <button
                          className="btn btn-outline-warning btn-xs"
                          onClick={() => handleQuickPrice(product.id, -5)}
                          disabled={product.price <= 5}
                          title="Decrease by ৳5"
                        >
                          -5
                        </button>
                        
                        <button
                          className="btn btn-outline-info btn-xs"
                          onClick={() => handleQuickPrice(product.id, 5)}
                          title="Increase by ৳5"
                        >
                          +5
                        </button>
                        
                        <button
                          className="btn btn-outline-secondary btn-xs"
                          onClick={() => handleQuickPrice(product.id, 1)}
                          title="Increase by ৳1"
                        >
                          <i className="bi bi-plus"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </td>

                {/* Cost */}
                <td>
                  {editingId === product.id ? (
                    <div className="input-group input-group-sm">
                      <span className="input-group-text">৳</span>
                      <input
                        type="number"
                        className="form-control"
                        value={editedProduct.cost || ''}
                        onChange={(e) => handleChange('cost', e.target.value)}
                        step="0.01"
                        min="0"
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="fw-bold text-secondary mb-1">
                        ৳{product.cost || product.unitRate || 0}
                      </div>
                    </div>
                  )}
                </td>

                {/* Profit Margin */}
                <td>
                  <div className="text-center">
                    {(function() {
                      // Get sales for this product
                      const productSales = salesByProductMap.get(product.id) || [];
                      
                      // Calculate total sold quantity and revenue from actual sales
                      const totalSold = productSales.reduce((sum, sale) => sum + (sale.quantitySold || 0), 0);
                      
                      // Extract cost and price with fallbacks
                      const cost = product.cost || product.unitRate || 0;
                      const price = product.price || product.sellRate || 0;
                      
                      // Calculate profit based on actual sales
                      const totalRevenue = totalSold * price;
                      const totalCost = totalSold * cost;
                      const totalProfit = totalRevenue - totalCost;
                      
                      // Calculate profit margin percentage
                      const profitMargin = totalSold > 0 && totalCost > 0 ? 
                        (totalProfit / totalCost) * 100 : 0;
                      
                      return (
                        <span className={`fw-bold ${totalProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                          {totalProfit >= 0 ? '+' : ''}{profitMargin.toFixed(1)}%
                        </span>
                      );
                    })()}
                  </div>
                </td>

                {/* Status */}
                <td>
                  <span className={`badge ${getStockBadgeClass(product.quantity)}`}>
                    {getStockStatus(product.quantity)}
                  </span>
                </td>

                {/* Total Value */}
                <td>
                  <strong className="text-success">
                    ৳{(product.quantity * product.price).toFixed(2)}
                  </strong>
                </td>

                {/* Actions */}
                <td>
                  {editingId === product.id ? (
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-success"
                        onClick={() => handleSave(product.id)}
                        title="Save changes"
                      >
                        <i className="bi bi-check"></i>
                      </button>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        title="Cancel editing"
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-warning"
                        onClick={() => handleEdit(product)}
                        title="Edit all fields"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                            onDelete(product.id);
                          }
                        }}
                        title="Delete product"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-5">
          <div className="text-muted">
            <i className="bi bi-inbox display-1"></i>
            <h5 className="mt-3">No products found</h5>
            <p>Try adjusting your search or add some products to get started.</p>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      {filteredProducts.length > 0 && (
        <div className="row mt-4">
          <div className="col-md-12">
            <div className="card bg-light border-0">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-2">
                    <h6 className="text-muted">Total Products</h6>
                    <h4 className="text-primary">{summaryStats.totalProducts}</h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Total Value</h6>
                    <h4 className="text-success">
                      ৳{summaryStats.totalValue.toLocaleString()}
                    </h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Low Stock</h6>
                    <h4 className="text-warning">
                      {summaryStats.lowStock}
                    </h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Out of Stock</h6>
                    <h4 className="text-danger">
                      {summaryStats.outOfStock}
                    </h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Avg. Price</h6>
                    <h4 className="text-info">
                      ৳{summaryStats.avgPrice.toFixed(2)}
                    </h4>
                  </div>
                  <div className="col-md-2">
                    <h6 className="text-muted">Total Items</h6>
                    <h4 className="text-purple">
                      {summaryStats.totalItems.toLocaleString()}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsTable;