import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { currentUser } = useAuth();

  return (
    <div className="user-profile-page">
      <div className="row mb-4">
        <div className="col-md-12">
          <h2>My Profile</h2>
          <p className="text-muted">Manage your account information</p>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center">
              <div className="user-avatar-lg bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                   style={{ width: '100px', height: '100px' }}>
                <i className="bi bi-person display-4 text-white"></i>
              </div>
              <h4>{currentUser?.name}</h4>
              <p className="text-muted">{currentUser?.email}</p>
              <span className={`badge ${
                currentUser?.role === 'superadmin' ? 'bg-danger' :
                currentUser?.role === 'manager' ? 'bg-info' : 'bg-primary'
              }`}>
                {currentUser?.role}
              </span>
            </div>
          </div>
        </div>
        
        <div className="col-md-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Account Information</h5>
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between">
                  <span>Full Name</span>
                  <strong>{currentUser?.name}</strong>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>Email Address</span>
                  <strong>{currentUser?.email}</strong>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>User Role</span>
                  <strong>{currentUser?.role}</strong>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>Account Created</span>
                  <strong>{new Date(currentUser?.createdAt).toLocaleDateString()}</strong>
                </div>
                <div className="list-group-item d-flex justify-content-between">
                  <span>Last Login</span>
                  <strong>
                    {currentUser?.lastLogin ? 
                      new Date(currentUser.lastLogin).toLocaleString() : 'N/A'
                    }
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;