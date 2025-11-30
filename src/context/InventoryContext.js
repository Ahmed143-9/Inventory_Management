// context/InventoryContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const InventoryContext = createContext();

export const useInventory = () => {
  return useContext(InventoryContext);
};

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Load products from localStorage on component mount
  useEffect(() => {
    const savedProducts = localStorage.getItem('inventoryProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with some sample data
      const initialProducts = [
        {
          id: 1,
          name: 'Laptop',
          description: 'High-performance laptop',
          quantity: 15,
          price: 999.99,
          category: 'Electronics'
        },
        {
          id: 2,
          name: 'Desk Chair',
          description: 'Ergonomic office chair',
          quantity: 8,
          price: 199.99,
          category: 'Furniture'
        },
        {
          id: 3,
          name: 'Notebook',
          description: 'A4 size notebook',
          quantity: 0,
          price: 4.99,
          category: 'Stationery'
        }
      ];
      setProducts(initialProducts);
    }
  }, []);

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem('inventoryProducts', JSON.stringify(products));
  }, [products]);

  const addProduct = (productData) => {
    const newProduct = {
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      ...productData
    };
    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId ? { ...product, ...updatedData } : product
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
    deleteProduct
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};