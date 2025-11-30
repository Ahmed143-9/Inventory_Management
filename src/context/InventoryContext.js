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

  // Generate unique ID
  const generateId = () => {
    return Date.now() + Math.floor(Math.random() * 1000);
  };

  // Load products from localStorage on component mount
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem('inventoryProducts');
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          setProducts(parsedProducts);
        } else {
          // Initialize with some sample data
          const initialProducts = [
            {
              id: generateId(),
              name: 'Laptop',
              description: 'High-performance laptop',
              quantity: 15,
              price: 999.99,
              category: 'Electronics',
              createdAt: new Date().toISOString()
            },
            {
              id: generateId(),
              name: 'Desk Chair',
              description: 'Ergonomic office chair',
              quantity: 8,
              price: 199.99,
              category: 'Furniture',
              createdAt: new Date().toISOString()
            },
            {
              id: generateId(),
              name: 'Notebook',
              description: 'A4 size notebook',
              quantity: 0,
              price: 4.99,
              category: 'Stationery',
              createdAt: new Date().toISOString()
            }
          ];
          setProducts(initialProducts);
          localStorage.setItem('inventoryProducts', JSON.stringify(initialProducts));
        }
      } catch (error) {
        console.error('Error loading products:', error);
        // Initialize with empty array if there's an error
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    if (!loading && products.length > 0) {
      try {
        localStorage.setItem('inventoryProducts', JSON.stringify(products));
        console.log('Products saved to localStorage:', products);
      } catch (error) {
        console.error('Error saving products:', error);
      }
    }
  }, [products, loading]);

  const addProduct = (productData) => {
    console.log('Adding new product:', productData);
    const newProduct = {
      id: generateId(), // Use the new ID generator
      ...productData,
      createdAt: new Date().toISOString()
    };
    console.log('New product with ID:', newProduct.id);
    setProducts(prev => {
      const updatedProducts = [...prev, newProduct];
      console.log('Updated products array:', updatedProducts);
      return updatedProducts;
    });
    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    console.log(`Updating product ${productId}:`, updatedData);
    setProducts(prev => 
      prev.map(product => 
        product.id === productId ? { ...product, ...updatedData, updatedAt: new Date().toISOString() } : product
      )
    );
  };

  const deleteProduct = (productId) => {
    console.log(`Deleting product ${productId}`);
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