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
    const savedUser = localStorage.getItem('inventory_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('inventory_user');
      }
    }
    
    // Load users list
    const savedUsers = localStorage.getItem('inventory_users');
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers);
        // Ensure SUPER_ADMIN is always present
        if (!parsedUsers.some(u => u.id === SUPER_ADMIN.id)) {
          setUsers([SUPER_ADMIN, ...parsedUsers]);
        } else {
          setUsers(parsedUsers);
        }
      } catch (err) {
        console.error('Error parsing saved users:', err);
        // Fallback to initial state with SUPER_ADMIN
        setUsers([SUPER_ADMIN]);
      }
    }
    
    setLoading(false);
  }, []);

  // Save user to localStorage when it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('inventory_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('inventory_user');
    }
  }, [currentUser]);
  
  // Save users list to localStorage when it changes
  useEffect(() => {
    // Don't save SUPER_ADMIN in the list since it's hardcoded
    const usersToSave = users.filter(u => u.id !== SUPER_ADMIN.id);
    localStorage.setItem('inventory_users', JSON.stringify(usersToSave));
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