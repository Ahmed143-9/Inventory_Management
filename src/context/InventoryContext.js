// src/context/InventoryContext.js - FIXED
import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

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
  
  // 🔥 FIX: Use ref to track the latest ID synchronously
  const nextIdRef = useRef(101);

  // Reliable ID generator - FIXED
  const generateNewId = () => {
    const newId = nextIdRef.current;
    nextIdRef.current += 1; // Increment for next product
    console.log(`✅ Generated ID: ${newId}, Next ID will be: ${nextIdRef.current}`);
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
          
          // 🔥 FIX: Set nextIdRef to max ID + 1
          if (parsedProducts.length > 0) {
            const maxId = Math.max(...parsedProducts.map(p => p.id));
            nextIdRef.current = maxId + 1;
            console.log(`🔢 Set next ID to: ${nextIdRef.current}`);
          }
        } else {
          // Initialize with sample data
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
          nextIdRef.current = 104; // Next ID after initial products
          localStorage.setItem('inventoryProducts', JSON.stringify(initialProducts));
        }
      } catch (error) {
        console.error('❌ Error loading products:', error);
        setProducts([]);
        nextIdRef.current = 101;
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
    
    const newId = generateNewId(); // 🔥 This will use ref, so it's always unique
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