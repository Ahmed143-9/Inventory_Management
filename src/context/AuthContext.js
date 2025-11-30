// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  // Initialize with a super admin
  useEffect(() => {
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
    
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

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
    const newUser = {
      id: users.length + 1,
      ...userData,
      createdAt: new Date().toISOString()
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const deleteUser = (userId) => {
    if (userId === currentUser.id) {
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
    deleteUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};