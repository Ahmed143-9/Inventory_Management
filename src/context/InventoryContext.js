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

  // Generate unique sequential ID
  const generateNewId = (currentProducts) => {
    if (currentProducts.length === 0) return 101;
    
    // Find the maximum ID currently in use
    const maxId = Math.max(...currentProducts.map(p => p.id));
    return maxId + 1;
  };

  // Load products from localStorage on component mount
  useEffect(() => {
    const loadProducts = () => {
      try {
        const savedProducts = localStorage.getItem('inventoryProducts');
        console.log('Loading from localStorage:', savedProducts);
        
        if (savedProducts) {
          const parsedProducts = JSON.parse(savedProducts);
          console.log('Parsed products:', parsedProducts);
          setProducts(parsedProducts);
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
          console.log('Setting initial products:', initialProducts);
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
    if (!loading) {
      try {
        localStorage.setItem('inventoryProducts', JSON.stringify(products));
        console.log('✅ Products saved to localStorage. Current products:', products);
      } catch (error) {
        console.error('Error saving products:', error);
      }
    }
  }, [products, loading]);

  const addProduct = (productData) => {
    console.log('🆕 Adding new product:', productData);
    
    const newId = generateNewId(products);
    const newProduct = {
      id: newId,
      ...productData,
      createdAt: new Date().toISOString()
    };
    
    console.log('🆔 New product ID:', newId);
    console.log('📦 New product:', newProduct);
    
    setProducts(prev => {
      const updatedProducts = [...prev, newProduct];
      console.log('📊 Updated products array:', updatedProducts);
      return updatedProducts;
    });
    
    return newProduct;
  };

  const updateProduct = (productId, updatedData) => {
    console.log('✏️ Updating product:', productId, 'with data:', updatedData);
    
    setProducts(prev => {
      const updated = prev.map(product => 
        product.id === productId 
          ? { ...product, ...updatedData, updatedAt: new Date().toISOString() } 
          : product
      );
      console.log('🔄 After update:', updated);
      return updated;
    });
  };

  const deleteProduct = (productId) => {
    console.log('🗑️ Deleting product:', productId);
    
    setProducts(prev => {
      const updated = prev.filter(product => product.id !== productId);
      console.log('✅ After deletion:', updated);
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