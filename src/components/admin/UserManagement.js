// src/components/admin/UserManagement.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { users, addUser, deleteUser, currentUser } = useAuth();
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = addUser(formData);
    if (result.success) {
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '', role: 'user' });
      setMessage('User created successfully!');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(result.message);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = deleteUser(userId);
      if (!result.success) {
        setMessage(result.message);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('User deleted successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    }
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h3>User Management</h3>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
        >
          Add New User
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      {showAddForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Add New User</h4>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                >
                  <option value="user">User</option>
                  <option value="manager">Manager</option>
                </select>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-success">Create User</button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.id !== currentUser.id && (
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;