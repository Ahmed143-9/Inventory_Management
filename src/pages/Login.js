import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login, currentUser, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/dashboard';

  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, from]);

  // Load saved credentials
  useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    
    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem('remembered_email', email);
    } else {
      localStorage.removeItem('remembered_email');
    }
    
    const result = await login(email, password);
    setIsLoading(false);
    
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center justify-content-center bg-gradient-primary">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-white text-center py-4 border-0">
                <div className="mb-3">
                  <img 
                    src="/logo.jpeg" 
                    alt="Company Logo" 
                    className="img-fluid" 
                    style={{maxHeight: '80px', width: 'auto'}}
                  />
                </div>
                <h3 className="mb-1 text-primary">
                  Hardware Inventory System
                </h3>
                <p className="mb-0 text-muted small">Sign in to your account</p>
              </div>
              
              <div className="card-body p-4 p-md-5">
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => {}}
                    ></button>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-medium small text-muted">
                      <i className="bi bi-envelope me-1"></i>
                      Email Address
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-2">
                        <i className="bi bi-person text-primary"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-0 bg-light rounded-end-2"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label fw-medium small text-muted">
                      <i className="bi bi-key me-1"></i>
                      Password
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-0 rounded-start-2">
                        <i className="bi bi-lock text-primary"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-0 bg-light rounded-end-2"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                      />
                      <button 
                        type="button"
                        className="btn btn-outline-secondary border-0 rounded-end-2"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} text-muted`}></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-4 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="rememberMe"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        disabled={isLoading}
                      />
                      <label className="form-check-label small" htmlFor="rememberMe">
                        Remember me
                      </label>
                    </div>
                    
                    <div className="text-end">
                      <button 
                        type="button" 
                        className="btn btn-link p-0 text-decoration-none small"
                        onClick={() => alert('Please contact Super Admin for password reset.')}
                      >
                        Forgot password?
                      </button>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 py-2 rounded-pill fw-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-white small">
                &copy; {new Date().getFullYear()} Hardware Inventory System. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;