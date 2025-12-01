// src/context/InventoryContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Reliable ID generator - FIXED
  const generateNewId = (currentProducts) => {
    console.log('🆔 Generating new ID for products:', currentProducts);
    
    if (currentProducts.length === 0) {
      console.log('✅ First product - ID: 101');
      return 101;
    }
    
    // Find the maximum ID safely
    const ids = currentProducts.map(p => p.id).filter(id => !isNaN(id));
    if (ids.length === 0) {
      console.log('⚠️ No valid IDs found, starting from 101');
      return 101;
    }
    
    const maxId = Math.max(...ids);
    const newId = maxId + 1;
    
    console.log(`✅ New ID generated: ${newId} (previous max: ${maxId})`);
    return newId;
  };

  // Load products
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem('inventoryProducts');
        console.log('📦 Loading from localStorage:', savedProducts);
        
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          console.log('✅ Parsed products with IDs:', parsedProducts.map(p => ({ id: p.id, name: p.name })));
          setProducts(parsedProducts);
        } else {
          // Initialize with sample data - DIFFERENT IDs
          const initialProducts = [
            { 
              id: 101, 
              name: 'Laptop', 
              description: 'High-performance laptop', 
              quantity: 15, 
              price: 999.99, 
              category: 'Electronics', 
              createdAt: new Date().toISOString() 
            },
            { 
              id: 102, 
              name: 'Desk Chair', 
              description: 'Ergonomic office chair', 
              quantity: 8, 
              price: 199.99, 
              category: 'Furniture', 
              createdAt: new Date().toISOString() 
            },
            { 
              id: 103, 
              name: 'Notebook', 
              description: 'A4 size notebook', 
              quantity: 0, 
              price: 4.99, 
              category: 'Stationery', 
              createdAt: new Date().toISOString() 
            }
          ];
          console.log('🚀 Initializing with sample products:', initialProducts.map(p => ({ id: p.id, name: p.name })));
          setProducts(initialProducts);
          localStorage.setItem('inventoryProducts', JSON.stringify(initialProducts));
        }
      } catch (error) {
        console.error('❌ Error loading products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // Save products
  useEffect(() => {
    if (!loading && products.length > 0) {
      try {
        localStorage.setItem('inventoryProducts', JSON.stringify(products));
        console.log('💾 Saved products with IDs:', products.map(p => ({ id: p.id, name: p.name })));
      } catch (error) {
        console.error('❌ Error saving products:', error);
      }
    }
  }, [products, loading]);

  const addProduct = (productData) => {
    console.log('➕ Adding new product:', productData);
    
    const newId = generateNewId(products);
    const newProduct = {
      id: newId,
      ...productData,
      createdAt: new Date().toISOString()
    };
    
    console.log(`🎯 New product created - ID: ${newId}, Name: ${productData.name}`);
    
    setProducts(prev => {
      const updated = [...prev, newProduct];
      console.log('📊 Products after addition:', updated.map(p => ({ id: p.id, name: p.name })));
      return updated;
    });
    
    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    console.log(`✏️ Updating product ID ${productId} with:`, updatedData);
    
    setProducts(prev => {
      const updated = prev.map(product => {
        if (product.id === productId) {
          console.log(`🔄 Updating: ${product.name} (ID: ${product.id})`);
          return { ...product, ...updatedData, updatedAt: new Date().toISOString() };
        }
        return product;
      });
      console.log('✅ Products after update:', updated.map(p => ({ id: p.id, name: p.name })));
      return updated;
    });
  };

  const deleteProduct = (productId) => {
    console.log(`🗑️ Deleting product ID: ${productId}`);
    setProducts(prev => {
      const updated = prev.filter(product => product.id !== productId);
      console.log('✅ Products after deletion:', updated.map(p => ({ id: p.id, name: p.name })));
      return updated;
    });
  };

  const value = {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    loading
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};