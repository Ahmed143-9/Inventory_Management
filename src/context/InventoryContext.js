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
  const [nextId, setNextId] = useState(101); // Start from 101

  // Load products and determine next ID
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem('inventoryProducts');
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts);
          
          // Find the highest ID and set nextId to highest + 1
          if (parsedProducts.length > 0) {
            const maxId = Math.max(...parsedProducts.map(p => p.id));
            setNextId(maxId + 1);
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
          setProducts(initialProducts);
          setNextId(104); // Next ID after 103
          localStorage.setItem('inventoryProducts', JSON.stringify(initialProducts));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setProducts([]);
        setNextId(101);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem('inventoryProducts', JSON.stringify(products));
        console.log('Products saved. Current IDs:', products.map(p => p.id));
      } catch (error) {
        console.error('Error saving products:', error);
      }
    }
  }, [products, loading]);

 const addProduct = (productData) => {
  // Simple sequential ID based on current products
  const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 101;
  
  const newProduct = {
    id: newId,
    ...productData,
    createdAt: new Date().toISOString()
  };
  
  console.log('Adding product with ID:', newProduct.id);
  
  setProducts(prev => [...prev, newProduct]);
  return newProduct;
};

  const updateProduct = (productId, updatedData) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId ? { ...product, ...updatedData, updatedAt: new Date().toISOString() } : product
      )
    );
  };

  const deleteProduct = (productId) => {
    setProducts(prev => prev.filter(product => product.id !== productId));
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