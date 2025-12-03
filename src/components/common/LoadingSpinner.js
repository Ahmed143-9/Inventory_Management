import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClass = {
    sm: 'spinner-border-sm',
    md: '',
    lg: 'spinner-border-lg'
  }[size];

  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-50 py-5">
      <div className={`spinner-border ${sizeClass} text-primary`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && (
        <p className="mt-3 text-muted">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;