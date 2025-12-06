import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Initial state
const initialState = {
  documents: [],
  totalExtraCost: 0
};

// Action types
const ACTIONS = {
  SET_DOCUMENTS: 'SET_DOCUMENTS',
  ADD_DOCUMENT: 'ADD_DOCUMENT',
  DELETE_DOCUMENT: 'DELETE_DOCUMENT',
  UPDATE_TOTAL_COST: 'UPDATE_TOTAL_COST'
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
      return savedState ? JSON.parse(savedState) : initialState;
    } catch (error) {
      console.error('Error loading document state from localStorage:', error);
      return initialState;
    }
  });

  // Debounced save to localStorage
  const debouncedSave = useCallback(
    debounce((state) => {
      try {
        localStorage.setItem('documentState', JSON.stringify(state));
      } catch (error) {
        console.error('Error saving document state to localStorage:', error);
      }
    }, 1000),
    []
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

  // Context value
  const value = {
    ...state,
    setDocuments,
    addDocument,
    deleteDocument
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