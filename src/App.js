import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import ProductList from './components/inventory/ProductList';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentView, setCurrentView] = useState('login');
  const [products, setProducts] = useState([]);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Load from localStorage
    const savedUser = localStorage.getItem('currentUser');
    const savedProducts = localStorage.getItem('products');
    const savedActivities = localStorage.getItem('activities');
    
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedActivities) setActivities(JSON.parse(savedActivities));
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (activities.length > 0) {
      localStorage.setItem('activities', JSON.stringify(activities));
    }
  }, [activities]);

  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentView('dashboard');
  };

  const handleRegister = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    setCurrentView('login');
  };

  const addActivity = (action, details) => {
    const newActivity = {
      id: Date.now(),
      action,
      details,
      user: currentUser?.email || 'Unknown',
      timestamp: new Date().toISOString()
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 50));
  };

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    setProducts(prev => [...prev, newProduct]);
    addActivity('Product Added', `${product.name} (SKU: ${product.sku})`);
  };

  const updateProduct = (id, updatedProduct) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...updatedProduct, id } : p));
    addActivity('Product Updated', `${updatedProduct.name} (SKU: ${updatedProduct.sku})`);
  };

  const deleteProduct = (id) => {
    const product = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (product) {
      addActivity('Product Deleted', `${product.name} (SKU: ${product.sku})`);
    }
  };

  const importProducts = (importedProducts) => {
    const newProducts = importedProducts.map(p => ({
      ...p,
      id: Date.now() + Math.random(),
      createdAt: new Date().toISOString()
    }));
    setProducts(prev => [...prev, ...newProducts]);
    addActivity('Bulk Import', `${newProducts.length} products imported`);
  };

  if (!currentUser) {
    return (
      <div className="App">
        {currentView === 'login' ? (
          <Login 
            onLogin={handleLogin} 
            onSwitchToRegister={() => setCurrentView('register')} 
          />
        ) : (
          <Register 
            onRegister={handleRegister} 
            onSwitchToLogin={() => setCurrentView('login')} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="App">
      <Navbar user={currentUser} onLogout={handleLogout} />
      <div className="main-container">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="content">
          {currentView === 'dashboard' && (
            <Dashboard products={products} activities={activities} />
          )}
          {currentView === 'inventory' && (
            <ProductList
              products={products}
              onAdd={addProduct}
              onUpdate={updateProduct}
              onDelete={deleteProduct}
              onImport={importProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;