import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function ProductList({ products, onAdd, onUpdate, onDelete, onImport }) {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    quantity: 0,
    price: 0,
    reorderLevel: 10
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'price' || name === 'reorderLevel' 
        ? parseFloat(value) || 0 
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      onUpdate(editingProduct.id, formData);
    } else {
      onAdd(formData);
    }
    handleCloseModal();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      quantity: product.quantity,
      price: product.price,
      reorderLevel: product.reorderLevel
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      category: '',
      quantity: 0,
      price: 0,
      reorderLevel: 10
    });
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Map Excel columns to product format
        const products = jsonData.map(row => ({
          name: row['Product Name'] || row['name'] || '',
          sku: row['SKU'] || row['sku'] || '',
          category: row['Category'] || row['category'] || '',
          quantity: parseFloat(row['Quantity'] || row['quantity'] || 0),
          price: parseFloat(row['Price'] || row['price'] || 0),
          reorderLevel: parseFloat(row['Reorder Level'] || row['reorderLevel'] || 10)
        }));

        onImport(products);
        e.target.value = ''; // Reset file input
      } catch (error) {
        alert('Error reading Excel file. Please check the format.');
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const getStockLevel = (product) => {
    const percentage = (product.quantity / (product.reorderLevel * 3)) * 100;
    if (percentage > 66) return { level: 'high', width: Math.min(percentage, 100) };
    if (percentage > 33) return { level: 'medium', width: percentage };
    return { level: 'low', width: percentage };
  };

  return (
    <div className="product-list">
      <div className="product-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <label className="btn-import">
            📤 Import Excel
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleExcelUpload}
              style={{ display: 'none' }}
            />
          </label>
          <button className="btn-add" onClick={() => setShowModal(true)}>
            ➕ Add Product
          </button>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: 'white',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
          <h2>No Products Yet</h2>
          <p style={{ color: '#999', marginTop: '10px' }}>
            Add your first product or import from Excel to get started
          </p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map(product => {
            const stockInfo = getStockLevel(product);
            return (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <div className="product-info">
                  <strong>SKU:</strong> {product.sku}
                </div>
                <div className="product-info">
                  <strong>Category:</strong> {product.category}
                </div>
                <div className="product-info">
                  <strong>Price:</strong> ৳{product.price.toLocaleString()}
                </div>
                <div className="product-info">
                  <strong>Quantity:</strong> {product.quantity} units
                </div>
                
                <div className="product-stock">
                  <div className="stock-label">Stock Level</div>
                  <div className="stock-bar">
                    <div 
                      className={`stock-fill ${stockInfo.level}`}
                      style={{ width: `${stockInfo.width}%` }}
                    />
                  </div>
                  {product.quantity <= product.reorderLevel && (
                    <div style={{color: '#f44336', fontSize: '12px', marginTop: '5px'}}>
                      ⚠️ Low stock - Reorder needed
                    </div>
                  )}
                </div>

                <div className="product-actions">
                  <button className="btn-edit" onClick={() => handleEdit(product)}>
                    ✏️ Edit
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(product.id)}>
                    🗑️ Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter product name"
                />
              </div>

              <div className="form-group">
                <label>SKU *</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter SKU"
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter category"
                />
              </div>

              <div className="form-group">
                <label>Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="Enter quantity"
                />
              </div>

              <div className="form-group">
                <label>Price (৳) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="Enter price"
                />
              </div>

              <div className="form-group">
                <label>Reorder Level *</label>
                <input
                  type="number"
                  name="reorderLevel"
                  value={formData.reorderLevel}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="Enter reorder level"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingProduct ? 'Update' : 'Add'} Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;