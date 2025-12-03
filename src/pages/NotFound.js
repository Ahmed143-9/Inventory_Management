import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="not-found-page min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="error-icon mb-4">
          <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
        </div>
        <h1 className="display-1 fw-bold">404</h1>
        <h2 className="mb-4">Page Not Found</h2>
        <p className="lead mb-4">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/" className="btn btn-primary">
            <i className="bi bi-house me-2"></i>
            Go to Dashboard
          </Link>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;