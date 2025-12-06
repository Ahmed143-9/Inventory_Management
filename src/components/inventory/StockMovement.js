import React, { useState } from 'react';
import { useInventory } from '../../context/InventoryContext';

const StockMovement = ({ product, onClose }) => {
  const { updateProduct } = useInventory();
  const [movementType, setMovementType] = useState('IN'); // IN or OUT
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      setError('Please enter a valid quantity');
      return;
    }
    
    const qty = parseInt(quantity);
    
    // Calculate new quantity based on movement type
    let newQuantity;
    if (movementType === 'IN') {
      newQuantity = (product.quantity || 0) + qty;
    } else {
      if (qty > (product.quantity || 0)) {
        setError('Cannot remove more than available stock');
        return;
      }
      newQuantity = (product.quantity || 0) - qty;
    }
    
    // Update product quantity
    updateProduct(product.id, { 
      quantity: newQuantity,
      updatedAt: new Date().toISOString()
    });
    
    // Close the modal
    onClose();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="bi bi-arrow-left-right me-2"></i>
              Stock Movement
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Product</label>
                <div className="border rounded p-3 bg-light">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-1">{product.productName}</h6>
                      <p className="mb-0 small text-muted">{product.product} - {product.modelNo}</p>
                    </div>
                    <div className="text-end">
                      <span className="badge bg-primary">Current: {product.quantity || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label fw-semibold">Movement Type</label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="movementType" 
                      id="movementIn" 
                      value="IN"
                      checked={movementType === 'IN'}
                      onChange={(e) => setMovementType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="movementIn">
                      <i className="bi bi-arrow-down-circle text-success me-1"></i>
                      Stock In
                    </label>
                  </div>
                  <div className="form-check">
                    <input 
                      className="form-check-input" 
                      type="radio" 
                      name="movementType" 
                      id="movementOut" 
                      value="OUT"
                      checked={movementType === 'OUT'}
                      onChange={(e) => setMovementType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="movementOut">
                      <i className="bi bi-arrow-up-circle text-danger me-1"></i>
                      Stock Out
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label fw-semibold">
                  Quantity
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  placeholder="Enter quantity"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="notes" className="form-label fw-semibold">
                  Notes (Optional)
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  rows="3"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this stock movement..."
                ></textarea>
              </div>
              
              {error && (
                <div className="alert alert-danger">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-check-circle me-2"></i>
                Confirm Movement
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StockMovement;