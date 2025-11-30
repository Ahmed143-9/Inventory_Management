// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import AddProduct from './components/AddProduct';
import Header from './components/Header';

function App() {
  const [products, setProducts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('inventory');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // Save products to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('inventory', JSON.stringify(products));
  }, [products]);

  const addProduct = (product) => {
    const newProduct = {
      id: Date.now(),
      ...product
    };
    setProducts([...products, newProduct]);
    setShowAddForm(false);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(products.map(product => 
      product.id === id ? { ...product, ...updatedProduct } : product
    ));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <div className="App">
      <Header />
      <div className="container">
        <div className="header-actions">
          <h1>Inventory Management System</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'Cancel' : 'Add Product'}
          </button>
        </div>
        
        {showAddForm && (
          <AddProduct onAdd={addProduct} />
        )}
        
        <ProductList 
          products={products}
          onUpdate={updateProduct}
          onDelete={deleteProduct}
        />
      </div>
    </div>
  );
}

export default App;