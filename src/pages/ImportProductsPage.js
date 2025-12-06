import React from 'react';
import { useNavigate } from 'react-router-dom';

const ImportProductsPage = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Redirect to the new unified import/export page
    navigate('/data/import-export');
  }, [navigate]);

  return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="mt-3">Redirecting to Import/Export page...</p>
    </div>
  );
};

export default ImportProductsPage;