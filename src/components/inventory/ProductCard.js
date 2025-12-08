// src/components/inventory/ProductCard.js
import React, { useState, useMemo } from 'react';

const ProductCard = ({ product, sales, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);

  // Calculate profit margin based on actual sales data
  const profitInfo = useMemo(() => {
    if (!sales || !Array.isArray(sales)) {
      return { profitMargin: 0, totalSold: 0 };
    }

    // Filter sales for this specific product
    const productSales = sales.filter(sale => sale.productId === product.id);
    
    // Calculate total sold quantity
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
    
    return {
      profitMargin,
      totalSold,
      totalProfit
    };
  }, [product, sales]);

  console.log(`🎯 ProductCard ${product.id} rendering - Editing: ${isEditing}`);

  // Initialize editedProduct ONLY when starting to edit THIS specific product
  const startEditing = () => {
    console.log(`🛠️ STARTING EDIT for product ${product.id}:`, product);
    setEditedProduct({ 
      name: product.name,
      description: product.description,
      quantity: product.quantity,
      price: product.price,
      cost: product.cost || product.unitRate || 0,
      category: product.category
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!editedProduct) return;
    
    console.log(`💾 SAVING product ${product.id}:`, editedProduct);
    onUpdate(product.id, editedProduct);
    setIsEditing(false);
    setEditedProduct(null);
  };

  const handleCancel = () => {
    console.log(`❌ CANCELLING edit for product ${product.id}`);
    setIsEditing(false);
    setEditedProduct(null);
  };

  // Handle input changes for THIS product only
  const handleInputChange = (field, value) => {
    console.log(`📝 Product ${product.id} - Changing ${field} to:`, value);
    setEditedProduct(prev => ({
      ...prev,
      [field]: field === 'quantity' || field === 'price' || field === 'cost' ? 
        (field === 'quantity' ? parseInt(value) || 0 : parseFloat(value) || 0) : value
    }));
  };

  // Quick actions - directly update without affecting other products
  const handleQuickQuantity = (change) => {
    console.log(`🔢 Product ${product.id} - Quick quantity: ${change}`);
    const newQuantity = Math.max(0, product.quantity + change);
    onUpdate(product.id, { quantity: newQuantity });
  };

  const handleQuickPrice = (change) => {
    console.log(`💰 Product ${product.id} - Quick price: ${change}`);
    const newPrice = Math.max(0, product.price + change);
    onUpdate(product.id, { price: parseFloat(newPrice.toFixed(2)) });
  };

  const handleQuickCost = (change) => {
    console.log(`💵 Product ${product.id} - Quick cost: ${change}`);
    const costField = product.cost !== undefined ? 'cost' : 'unitRate';
    const currentCost = product[costField] || 0;
    const newCost = Math.max(0, currentCost + change);
    onUpdate(product.id, { [costField]: parseFloat(newCost.toFixed(2)) });
  };

  const handleCustomQuantity = () => {
    const newQuantity = prompt(`Set quantity for ${product.name}:`, product.quantity);
    if (newQuantity !== null) {
      const quantity = parseInt(newQuantity);
      if (!isNaN(quantity) && quantity >= 0) {
        onUpdate(product.id, { quantity });
      }
    }
  };

  const handleCustomPrice = () => {
    const newPrice = prompt(`Set price for ${product.name}:`, product.price);
    if (newPrice !== null) {
      const price = parseFloat(newPrice);
      if (!isNaN(price) && price >= 0) {
        onUpdate(product.id, { price: parseFloat(price.toFixed(2)) });
      }
    }
  };

  const handleCustomCost = () => {
    const costField = product.cost !== undefined ? 'cost' : 'unitRate';
    const currentCost = product[costField] || 0;
    const newCost = prompt(`Set cost for ${product.name}:`, currentCost);
    if (newCost !== null) {
      const cost = parseFloat(newCost);
      if (!isNaN(cost) && cost >= 0) {
        onUpdate(product.id, { [costField]: parseFloat(cost.toFixed(2)) });
      }
    }
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) return 'bg-danger';
    if (quantity < 10) return 'bg-warning';
    return 'bg-success';
  };

  const getStockText = (quantity) => {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  };

  return (
    <div className="card h-100 shadow-sm product-card" data-product-id={product.id}>
      <div className={`card-header ${getStockStatus(product.quantity)} text-white`}>
        <div className="d-flex justify-content-between align-items-center">
          <h6 className="mb-0">{product.name}</h6>
          <span className="badge bg-light text-dark">#{product.id}</span>
        </div>
      </div>
      
      <div className="card-body">
        {isEditing && editedProduct ? (
          // Edit Mode - ONLY for this specific product
          <div className="edit-form">
            <div className="mb-2">
              <label className="form-label small">Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={editedProduct.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            <div className="mb-2">
              <label className="form-label small">Description</label>
              <textarea
                className="form-control form-control-sm"
                value={editedProduct.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows="2"
              />
            </div>
            <div className="row g-2 mb-2">
              <div className="col-4">
                <label className="form-label small">Quantity</label>
                <input
                  type="number"
                  className="form-control form-control-sm"
                  value={editedProduct.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="col-4">
                <label className="form-label small">Price</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control form-control-sm"
                  value={editedProduct.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </div>
              <div className="col-4">
                <label className="form-label small">Cost</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-control form-control-sm"
                  value={editedProduct.cost}
                  onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label small">Category</label>
              <input
                type="text"
                className="form-control form-control-sm"
                value={editedProduct.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              />
            </div>
            <div className="d-grid gap-2">
              <button className="btn btn-success btn-sm" onClick={handleSave}>
                <i className="bi bi-check me-1"></i>
                Save
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleCancel}>
                <i className="bi bi-x me-1"></i>
                Cancel
              </button>
            </div>
          </div>
        ) : (
          // View Mode
          <>
            <p className="card-text text-muted small mb-3">{product.description}</p>
            
            <div className="mb-3">
              <span className="badge bg-secondary">{product.category}</span>
            </div>

            {/* Quick Quantity Controls */}
            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <small className="text-muted fw-semibold">Quantity</small>
                <span className={`badge ${getStockStatus(product.quantity)}`}>
                  {getStockText(product.quantity)}
                </span>
              </div>
              
              <div className="d-flex align-items-center justify-content-center mb-1">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => handleQuickQuantity(-1)}
                  disabled={product.quantity <= 0}
                  title="Decrease by 1"
                >
                  <i className="bi bi-dash"></i>
                </button>
                
                <span className={`
                  fw-bold fs-5 mx-3 text-center min-width-50
                  ${product.quantity === 0 ? 'text-danger' : 
                    product.quantity < 10 ? 'text-warning' : 'text-success'}
                `}>
                  {product.quantity}
                </span>
                
                <button
                  className="btn btn-outline-success btn-sm"
                  onClick={() => handleQuickQuantity(1)}
                  title="Increase by 1"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  className="btn btn-outline-warning btn-xs"
                  onClick={() => handleQuickQuantity(-5)}
                  disabled={product.quantity < 5}
                  title="Decrease by 5"
                >
                  -5
                </button>
                
                <button
                  className="btn btn-outline-secondary btn-xs"
                  onClick={handleCustomQuantity}
                  title="Set custom quantity"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                
                <button
                  className="btn btn-outline-info btn-xs"
                  onClick={() => handleQuickQuantity(5)}
                  title="Increase by 5"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Quick Price Controls */}
            <div className="mb-3">
              <small className="text-muted fw-semibold d-block mb-2">Price</small>
              
              <div className="d-flex align-items-center justify-content-center mb-1">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuickPrice(-1)}
                  disabled={product.price <= 1}
                  title="Decrease by ৳1"
                >
                  <i className="bi bi-dash"></i>
                </button>
                
                <strong className="text-primary fs-5 mx-3 text-center min-width-60">
                  ৳{product.price}
                </strong>
                
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuickPrice(1)}
                  title="Increase by ৳1"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  className="btn btn-outline-warning btn-xs"
                  onClick={() => handleQuickPrice(-5)}
                  disabled={product.price <= 5}
                  title="Decrease by ৳5"
                >
                  -5
                </button>
                
                <button
                  className="btn btn-outline-secondary btn-xs"
                  onClick={handleCustomPrice}
                  title="Set custom price"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                
                <button
                  className="btn btn-outline-info btn-xs"
                  onClick={() => handleQuickPrice(5)}
                  title="Increase by ৳5"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Quick Cost Controls */}
            <div className="mb-3">
              <small className="text-muted fw-semibold d-block mb-2">Cost</small>
              
              <div className="d-flex align-items-center justify-content-center mb-1">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuickCost(-1)}
                  disabled={(product.cost || product.unitRate || 0) <= 1}
                  title="Decrease by ৳1"
                >
                  <i className="bi bi-dash"></i>
                </button>
                
                <strong className="text-secondary fs-5 mx-3 text-center min-width-60">
                  ৳{product.cost || product.unitRate || 0}
                </strong>
                
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => handleQuickCost(1)}
                  title="Increase by ৳1"
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>

              <div className="d-flex justify-content-center align-items-center gap-2">
                <button
                  className="btn btn-outline-warning btn-xs"
                  onClick={() => handleQuickCost(-5)}
                  disabled={(product.cost || product.unitRate || 0) <= 5}
                  title="Decrease by ৳5"
                >
                  -5
                </button>
                
                <button
                  className="btn btn-outline-secondary btn-xs"
                  onClick={handleCustomCost}
                  title="Set custom cost"
                >
                  <i className="bi bi-pencil-square"></i>
                </button>
                
                <button
                  className="btn btn-outline-info btn-xs"
                  onClick={() => handleQuickCost(5)}
                  title="Increase by ৳5"
                >
                  +5
                </button>
              </div>
            </div>

            {/* Profit Margin */}
            <div className="mb-3 border-top pt-2">
              <div className="text-center">
                <small className="text-muted d-block">Profit Margin</small>
                <strong className={profitInfo.totalProfit >= 0 ? 'text-success fs-5' : 'text-danger fs-5'}>
                  {profitInfo.totalProfit >= 0 ? '+' : ''}{profitInfo.profitMargin.toFixed(1)}%
                </strong>
                <div className="small text-muted">
                  {profitInfo.totalSold} sold
                </div>
              </div>
            </div>

            {/* Total Value */}
            <div className="border-top pt-2">
              <div className="text-center">
                <small className="text-muted d-block">Total Value</small>
                <strong className="text-success fs-5">
                  ৳{(product.quantity * product.price).toFixed(2)}
                </strong>
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Card Footer */}
      {!isEditing && (
        <div className="card-footer">
          <div className="d-grid gap-2">
            <button 
              className="btn btn-warning btn-sm"
              onClick={startEditing}
              title="Edit all product details"
            >
              <i className="bi bi-pencil me-1"></i>
              Full Edit
            </button>
            <button 
              className="btn btn-danger btn-sm"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete "${product.name}"?`)) {
                  onDelete(product.id);
                }
              }}
              title="Delete this product"
            >
              <i className="bi bi-trash me-1"></i>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProductCard);