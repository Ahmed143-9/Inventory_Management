// src/components/auth/Login.js - Professional Design
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser && !loading) {
      navigate('/dashboard');
    }
  }, [currentUser, loading, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login(email, password);
    if (result.success) {
      setError('');
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Left Side - Branding */}
          <div className="col-lg-6 d-none d-lg-flex login-brand-section">
            <div className="d-flex flex-column justify-content-center align-items-center w-100 text-white p-5">
              <div className="brand-logo-large mb-4">
                <i className="bi bi-boxes display-1"></i>
              </div>
              <h1 className="display-4 fw-bold mb-3">Inventory Management</h1>
              <p className="lead text-center mb-4">
                Professional Stock Control System
              </p>
              <div className="features-list text-start">
                <div className="feature-item mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Real-time inventory tracking
                </div>
                <div className="feature-item mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Smart stock alerts & notifications
                </div>
                <div className="feature-item mb-3">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Bulk import & export capabilities
                </div>
                <div className="feature-item">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Multi-user role management
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light">
            <div className="login-form-container w-100 px-4" style={{maxWidth: '500px'}}>
              {/* Mobile Logo */}
              <div className="text-center mb-4 d-lg-none">
                <div className="brand-logo-mobile mb-3">
                  <i className="bi bi-boxes display-4 text-primary"></i>
                </div>
                <h4 className="fw-bold">Inventory Management</h4>
              </div>

              {/* Login Card */}
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4 p-md-5">
                  <div className="text-center mb-4">
                    <h3 className="fw-bold mb-2">Welcome Back!</h3>
                    <p className="text-muted">Sign in to your account to continue</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                      <button 
                        type="button" 
                        className="btn-close" 
                        onClick={() => setError('')}
                      ></button>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        Email Address
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-envelope text-muted"></i>
                        </span>
                        <input
                          type="email"
                          className="form-control border-start-0 ps-0"
                          id="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          autoFocus
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                      <label htmlFor="password" className="form-label fw-semibold">
                        Password
                      </label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control border-start-0 border-end-0 ps-0"
                          id="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          className="btn btn-outline-secondary border-start-0"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-100 py-2 mb-3">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </button>
                  </form>

                  {/* Demo Credentials */}
                  {/* <div className="demo-credentials-box mt-4 p-3 bg-light rounded">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-info-circle text-primary me-2"></i>
                      <strong className="small">Demo Credentials</strong>
                    </div>
                    <div className="small">
                      <div className="mb-2">
                        <span className="badge bg-primary me-2">Super Admin</span>
                        <div className="mt-1 text-muted">
                          <strong>Email:</strong> superadmin@inventory.com<br/>
                          <strong>Pass:</strong> admin123
                        </div>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>

              {/* Footer */}
              <div className="text-center mt-4">
                <small className="text-muted">
                  © 2025 Inventory Management System. All rights reserved.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;