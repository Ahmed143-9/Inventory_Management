import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Initial state
const initialState = {
  products: [],
  purchases: [],
  sales: [],
  suppliers: [],
  customers: []
};

// Action types
const ACTIONS = {
  SET_PRODUCTS: 'SET_PRODUCTS',
  ADD_PRODUCT: 'ADD_PRODUCT',
  UPDATE_PRODUCT: 'UPDATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  ADD_PURCHASE: 'ADD_PURCHASE',
  ADD_SALE: 'ADD_SALE',
  SET_PURCHASES: 'SET_PURCHASES',
  SET_SALES: 'SET_SALES'
};

// Reducer
const inventoryReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_PRODUCTS:
      return {
        ...state,
        products: action.payload
      };
    
    case ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload]
      };
    
    case ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map(product =>
          product.id === action.payload.id ? { ...product, ...action.payload } : product
        )
      };
    
    case ACTIONS.DELETE_PRODUCT:
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    
    case ACTIONS.ADD_PURCHASE:
      return {
        ...state,
        purchases: [...state.purchases, action.payload]
      };
    
    case ACTIONS.ADD_SALE:
      return {
        ...state,
        sales: [...state.sales, action.payload]
      };
      
    case ACTIONS.SET_PURCHASES:
      return {
        ...state,
        purchases: action.payload
      };
      
    case ACTIONS.SET_SALES:
      return {
        ...state,
        sales: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const InventoryContext = createContext();

// Provider component
export const InventoryProvider = ({ children }) => {
  const [state, dispatch] = useReducer(inventoryReducer, initialState, () => {
    // Load initial state from localStorage if available
    try {
      const savedState = localStorage.getItem('inventoryState');
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error('Error loading inventory state from localStorage:', error);
      return initialState;
    }
  });

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    debounce((state) => {
      try {
        localStorage.setItem('inventoryState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving inventory state to localStorage:', error);
      }
    }, 1000),
    []
  );

  // Save state to localStorage whenever it changes (debounced)
  useEffect(() => {
    debouncedSave(state);
  }, [state, debouncedSave]);

  // Action creators
  const setProducts = (products) => {
    dispatch({ type: ACTIONS.SET_PRODUCTS, payload: products });
  };

  const addProduct = (product) => {
    dispatch({ type: ACTIONS.ADD_PRODUCT, payload: product });
  };

  const updateProduct = (id, updatedFields) => {
    // Create an object with only the fields that need to be updated
    const productToUpdate = state.products.find(product => product.id === id);
    if (!productToUpdate) return;
    
    const updatedProduct = { ...productToUpdate, ...updatedFields, updatedAt: new Date().toISOString() };
    dispatch({ type: ACTIONS.UPDATE_PRODUCT, payload: updatedProduct });
  };

  const deleteProduct = (id) => {
    dispatch({ type: ACTIONS.DELETE_PRODUCT, payload: id });
  };

  const addPurchase = (purchase) => {
    dispatch({ type: ACTIONS.ADD_PURCHASE, payload: purchase });
  };

  const addSale = (sale) => {
    dispatch({ type: ACTIONS.ADD_SALE, payload: sale });
  };

  const setPurchases = (purchases) => {
    dispatch({ type: ACTIONS.SET_PURCHASES, payload: purchases });
  };

  const setSales = (sales) => {
    dispatch({ type: ACTIONS.SET_SALES, payload: sales });
  };

  // Context value
  const value = {
    ...state,
    setProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addPurchase,
    addSale,
    setPurchases,
    setSales
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

// Custom hook to use the inventory context
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}