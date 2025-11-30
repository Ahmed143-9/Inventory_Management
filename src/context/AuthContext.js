// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize users and load current user from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        // Load users from localStorage or initialize with default
        const savedUsers = localStorage.getItem('inventoryUsers');
        const savedCurrentUser = localStorage.getItem('currentUser');
        
        if (savedUsers) {
          setUsers(JSON.parse(savedUsers));
        } else {
          // Initialize with default super admin
          const initialUsers = [
            {
              id: 1,
              email: 'superadmin@inventory.com',
              password: 'admin123',
              role: 'superadmin',
              name: 'Super Admin',
              createdAt: new Date().toISOString()
            }
          ];
          setUsers(initialUsers);
          localStorage.setItem('inventoryUsers', JSON.stringify(initialUsers));
        }
        
        // Load current user from localStorage
        if (savedCurrentUser) {
          const user = JSON.parse(savedCurrentUser);
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Initialize with default user if there's an error
        const initialUsers = [
          {
            id: 1,
            email: 'superadmin@inventory.com',
            password: 'admin123',
            role: 'superadmin',
            name: 'Super Admin',
            createdAt: new Date().toISOString()
          }
        ];
        setUsers(initialUsers);
        localStorage.setItem('inventoryUsers', JSON.stringify(initialUsers));
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('inventoryUsers', JSON.stringify(users));
    }
  }, [users]);

  const login = (email, password) => {
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return { success: true, user };
    }
    return { success: false, message: 'Invalid credentials' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addUser = (userData) => {
    // Check if email already exists
    if (users.find(u => u.email === userData.email)) {
      return { success: false, message: 'Email already exists' };
    }
    
    const newUser = {
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true, user: newUser };
  };

  const deleteUser = (userId) => {
    if (userId === currentUser?.id) {
      return { success: false, message: 'Cannot delete your own account' };
    }
    setUsers(prev => prev.filter(user => user.id !== userId));
    return { success: true };
  };

  const value = {
    currentUser,
    users,
    login,
    logout,
    addUser,
    deleteUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};