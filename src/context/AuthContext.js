import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

// Hardcoded Super Admin (Only this user exists initially)
const SUPER_ADMIN = {
  id: 1,
  name: "Super Admin",
  email: "admin@inventory.com",
  password: "admin123",
  role: "superadmin",
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString()
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([SUPER_ADMIN]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user and users data from localStorage on initial load
  useEffect(() => {
    // Load current user
    try {
      const savedUser = localStorage.getItem('inventory_user');
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        
        // Validate user structure
        if (typeof parsedUser === 'object' && parsedUser !== null && parsedUser.id) {
          console.log('User state loaded successfully from localStorage');
          setCurrentUser(parsedUser);
        }
      }
    } catch (err) {
      console.error('Error parsing saved user:', err);
      console.warn('Clearing corrupted user data');
      
      try {
        localStorage.removeItem('inventory_user');
      } catch (clearError) {
        console.error('Failed to clear corrupted user data:', clearError);
      }
    }
    
    // Load users list
    try {
      const savedUsers = localStorage.getItem('inventory_users');
      if (savedUsers) {
        const parsedUsers = JSON.parse(savedUsers);
        
        // Validate users array structure
        if (Array.isArray(parsedUsers)) {
          // Ensure SUPER_ADMIN is always present
          if (!parsedUsers.some(u => u.id === SUPER_ADMIN.id)) {
            setUsers([SUPER_ADMIN, ...parsedUsers]);
          } else {
            setUsers(parsedUsers);
          }
          console.log('Users list loaded successfully from localStorage');
        }
      }
    } catch (err) {
      console.error('Error parsing saved users:', err);
      console.warn('Using initial users state due to loading error');
      
      // Attempt to clear corrupted data
      try {
        localStorage.removeItem('inventory_users');
      } catch (clearError) {
        console.error('Failed to clear corrupted users data:', clearError);
      }
      
      // Fallback to initial state with SUPER_ADMIN
      setUsers([SUPER_ADMIN]);
    }
    
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('inventory_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('inventory_user');
      }
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
      
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Attempting to clear old data...');
        
        // Try to free up space
        try {
          // Remove older non-critical data
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !['inventory_user', 'inventory_users', 'inventoryState', 'documentState'].includes(key)) {
              keysToRemove.push(key);
            }
          }
          
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
          });
          
          // Retry saving
          if (currentUser) {
            localStorage.setItem('inventory_user', JSON.stringify(currentUser));
          } else {
            localStorage.removeItem('inventory_user');
          }
          console.log('Successfully saved user after clearing old data');
        } catch (retryError) {
          console.error('Failed to save user even after cleanup:', retryError);
        }
      }
    }
  }, [currentUser]);
  
  // Save users list to localStorage when it changes
  useEffect(() => {
    try {
      // Don't save SUPER_ADMIN in the list since it's hardcoded
      const usersToSave = users.filter(u => u.id !== SUPER_ADMIN.id);
      localStorage.setItem('inventory_users', JSON.stringify(usersToSave));
    } catch (error) {
      console.error('Error saving users list to localStorage:', error);
      
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Attempting to clear old data...');
        
        // Try to free up space
        try {
          // Remove older non-critical data
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && !['inventory_user', 'inventory_users', 'inventoryState', 'documentState'].includes(key)) {
              keysToRemove.push(key);
            }
          }
          
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
          });
          
          // Retry saving
          const usersToSave = users.filter(u => u.id !== SUPER_ADMIN.id);
          localStorage.setItem('inventory_users', JSON.stringify(usersToSave));
          console.log('Successfully saved users list after clearing old data');
        } catch (retryError) {
          console.error('Failed to save users list even after cleanup:', retryError);
        }
      }
    }
  }, [users]);

  const login = async (email, password) => {
    setError('');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const updatedUser = {
        ...user,
        lastLogin: new Date().toISOString()
      };
      
      // Update user in users array
      setUsers(users.map(u => u.id === user.id ? updatedUser : u));
      setCurrentUser(updatedUser);
      
      return {
        success: true,
        message: 'Login successful!',
        user: updatedUser
      };
    } else {
      setError('Invalid email or password');
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setError('');
  };

  const addUser = (userData) => {
    // Only Super Admin can add users
    if (currentUser?.role !== 'superadmin') {
      return {
        success: false,
        message: 'Unauthorized! Only Super Admin can add users.'
      };
    }

    // Check if email already exists
    if (users.some(u => u.email === userData.email)) {
      return {
        success: false,
        message: 'User with this email already exists!'
      };
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    
    setUsers([...users, newUser]);
    
    return {
      success: true,
      message: 'User added successfully!',
      user: newUser
    };
  };

  const deleteUser = (userId) => {
    // Cannot delete super admin (ID: 1)
    if (userId === 1) {
      return {
        success: false,
        message: 'Cannot delete Super Admin!'
      };
    }
    
    // Cannot delete current user
    if (userId === currentUser?.id) {
      return {
        success: false,
        message: 'Cannot delete yourself!'
      };
    }
    
    setUsers(users.filter(user => user.id !== userId));
    
    return {
      success: true,
      message: 'User deleted successfully!'
    };
  };

  const updateUserPassword = (userId, currentPassword, newPassword) => {
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return {
        success: false,
        message: 'User not found!'
      };
    }
    
    // Verify current password
    if (user.password !== currentPassword) {
      return {
        success: false,
        message: 'Current password is incorrect!'
      };
    }
    
    // Update password
    setUsers(users.map(u => 
      u.id === userId ? { ...u, password: newPassword } : u
    ));
    
    // If current user is updating their own password, update currentUser state
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, password: newPassword }));
    }
    
    return {
      success: true,
      message: 'Password updated successfully!'
    };
  };

  const resetPassword = (userId, newPassword) => {
    // Only Super Admin can reset passwords
    if (currentUser?.role !== 'superadmin') {
      return {
        success: false,
        message: 'Unauthorized! Only Super Admin can reset passwords.'
      };
    }
    
    setUsers(users.map(u => 
      u.id === userId ? { ...u, password: newPassword } : u
    ));
    
    return {
      success: true,
      message: 'Password reset successfully!'
    };
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'superadmin': return 'danger';
      case 'manager': return 'info';
      case 'user': return 'primary';
      default: return 'secondary';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'superadmin': return 'bi-shield-fill-check';
      case 'manager': return 'bi-person-badge-fill';
      case 'user': return 'bi-person-fill';
      default: return 'bi-person';
    }
  };

  const value = {
    currentUser,
    users,
    loading,
    error,
    login,
    logout,
    addUser,
    deleteUser,
    updateUserPassword,
    resetPassword,
    getRoleBadgeColor,
    getRoleIcon
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);