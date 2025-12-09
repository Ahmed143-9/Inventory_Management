import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { migrateData } from '../utils/dataMigration';

// Initial state
const initialState = {
  documents: [],
  salesBills: [],
  totalExtraCost: 0
};

// Action types
const ACTIONS = {
  SET_DOCUMENTS: 'SET_DOCUMENTS',
  ADD_DOCUMENT: 'ADD_DOCUMENT',
  DELETE_DOCUMENT: 'DELETE_DOCUMENT',
  UPDATE_TOTAL_COST: 'UPDATE_TOTAL_COST',
  SET_SALES_BILLS: 'SET_SALES_BILLS',
  ADD_SALES_BILL: 'ADD_SALES_BILL',
  DELETE_SALES_BILL: 'DELETE_SALES_BILL'
};

// Reducer
const documentReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_DOCUMENTS:
      return {
        ...state,
        documents: action.payload
      };
    
    case ACTIONS.ADD_DOCUMENT:
      return {
        ...state,
        documents: [...state.documents, action.payload]
      };
    
    case ACTIONS.DELETE_DOCUMENT:
      return {
        ...state,
        documents: state.documents.filter(doc => doc.id !== action.payload)
      };
      
    case ACTIONS.UPDATE_TOTAL_COST:
      return {
        ...state,
        totalExtraCost: action.payload
      };
      
    case ACTIONS.SET_SALES_BILLS:
      return {
        ...state,
        salesBills: action.payload
      };
    
    case ACTIONS.ADD_SALES_BILL:
      return {
        ...state,
        salesBills: [...state.salesBills, action.payload]
      };
    
    case ACTIONS.DELETE_SALES_BILL:
      return {
        ...state,
        salesBills: state.salesBills.filter(bill => bill.id !== action.payload)
      };
    
    default:
      return state;
  }
};

// Create context
const DocumentContext = createContext();

// Provider component
export const DocumentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(documentReducer, initialState, () => {
    // Load initial state from localStorage if available
    try {
      const savedState = localStorage.getItem('documentState');
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        
        // Validate the structure of the loaded state
        if (typeof parsedState === 'object' && parsedState !== null) {
          // Ensure all required properties exist
          const validatedState = {
            documents: Array.isArray(parsedState.documents) ? parsedState.documents : [],
            salesBills: Array.isArray(parsedState.salesBills) ? parsedState.salesBills : [],
            totalExtraCost: typeof parsedState.totalExtraCost === 'number' ? parsedState.totalExtraCost : 0
          };
          
          console.log('Document state loaded successfully from localStorage');
          return validatedState;
        }
      }
      return initialState;
    } catch (error) {
      console.error('Error loading document state from localStorage:', error);
      console.warn('Using initial state due to loading error');
      
      // Attempt to clear corrupted data
      try {
        localStorage.removeItem('documentState');
      } catch (clearError) {
        console.error('Failed to clear corrupted document state:', clearError);
      }
      
      return initialState;
    }
  });

  // Enhanced save function with retry mechanism
  const saveToLocalStorage = useCallback((state) => {
    try {
      localStorage.setItem('documentState', JSON.stringify(state));
    } catch (error) {
      console.error('Error saving document state to localStorage:', error);
      
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Attempting to clear old data...');
        
        // Try to free up space by removing older entries
        try {
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('document_') && key !== 'documentState') {
              keysToRemove.push(key);
            }
          }
          
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
          });
          
          // Retry saving
          localStorage.setItem('documentState', JSON.stringify(state));
          console.log('Successfully saved after clearing old data');
        } catch (retryError) {
          console.error('Failed to save even after cleanup:', retryError);
        }
      }
    }
  }, []);

  // Debounced save to localStorage with error handling
  const debouncedSave = useCallback(
    debounce((state) => {
      saveToLocalStorage(state);
    }, 1000),
    [saveToLocalStorage]
  );

  // Save state to localStorage whenever it changes (debounced)
  useEffect(() => {
    debouncedSave(state);
    
    // Update total extra cost whenever documents change
    const totalCost = state.documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);
    if (totalCost !== state.totalExtraCost) {
      dispatch({ type: ACTIONS.UPDATE_TOTAL_COST, payload: totalCost });
    }
  }, [state, debouncedSave]);

  // Action creators
  const setDocuments = (documents) => {
    dispatch({ type: ACTIONS.SET_DOCUMENTS, payload: documents });
  };

  const addDocument = (document) => {
    dispatch({ type: ACTIONS.ADD_DOCUMENT, payload: document });
  };

  const deleteDocument = (id) => {
    dispatch({ type: ACTIONS.DELETE_DOCUMENT, payload: id });
  };
  
  const setSalesBills = (salesBills) => {
    dispatch({ type: ACTIONS.SET_SALES_BILLS, payload: salesBills });
  };

  const addSalesBill = (salesBill) => {
    dispatch({ type: ACTIONS.ADD_SALES_BILL, payload: salesBill });
  };

  const deleteSalesBill = (id) => {
    dispatch({ type: ACTIONS.DELETE_SALES_BILL, payload: id });
  };

  // Context value
  const value = {
    ...state,
    setDocuments,
    addDocument,
    deleteDocument,
    setSalesBills,
    addSalesBill,
    deleteSalesBill
  };

  return (
    <DocumentContext.Provider value={value}>
      {children}
    </DocumentContext.Provider>
  );
};

// Custom hook to use the document context
export const useDocument = () => {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error('useDocument must be used within a DocumentProvider');
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