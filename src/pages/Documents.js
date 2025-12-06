import React, { useState, useMemo } from 'react';
import { useDocument } from '../context/DocumentContext';
import { useAuth } from '../context/AuthContext';

const Documents = () => {
  const { documents, addDocument, deleteDocument, totalExtraCost } = useDocument();
  const { currentUser } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Check if user is admin (only admins can delete)
  const isAdmin = currentUser && currentUser.role === 'superadmin';

  // Memoize sorted documents
  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [documents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }
    
    const newDocument = {
      id: Date.now(),
      title: formData.title,
      amount: parseFloat(formData.amount),
      description: formData.description,
      imageUrl: imagePreview,
      date: new Date().toISOString(),
      createdBy: currentUser?.name || 'Unknown'
    };
    
    addDocument(newDocument);
    
    // Reset form
    setFormData({
      title: '',
      amount: '',
      description: '',
      image: null
    });
    setImagePreview(null);
    setShowForm(false);
  };

  const handleDelete = (id, title) => {
    if (isAdmin && window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteDocument(id);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <i className="bi bi-file-earmark-text me-2"></i>
          Documents & Extra Costs
        </h2>
        <div className="d-flex align-items-center">
          <div className="me-4">
            <h5 className="mb-0">Total Extra Costs</h5>
            <h3 className="text-danger mb-0">{formatCurrency(totalExtraCost)}</h3>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowForm(!showForm)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Add Bill
          </button>
        </div>
      </div>

      {/* Add Bill Form */}
      {showForm && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-primary text-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-receipt me-2"></i>
              Add New Bill
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Bill Title *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter bill title"
                      required
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">Amount *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter bill description"
                  rows="3"
                ></textarea>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Bill Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="img-thumbnail" 
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>
              
              <div className="d-flex justify-content-end gap-2">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-save me-2"></i>
                  Save Bill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3">
          <h5 className="mb-0">
            <i className="bi bi-receipt me-2"></i>
            Bill Entries
          </h5>
        </div>
        <div className="card-body">
          {sortedDocuments.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-receipt display-1 text-muted"></i>
              <h4 className="mt-3">No bills added yet</h4>
              <p className="text-muted">
                Add your first bill to track extra costs
              </p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowForm(true)}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add First Bill
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Created By</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedDocuments.map(document => (
                    <tr key={document.id}>
                      <td>
                        <div className="fw-bold">{document.title}</div>
                        {document.imageUrl && (
                          <button 
                            className="btn btn-sm btn-outline-primary mt-1"
                            data-bs-toggle="modal" 
                            data-bs-target={`#imageModal-${document.id}`}
                          >
                            <i className="bi bi-image me-1"></i>
                            View Image
                          </button>
                        )}
                      </td>
                      <td>
                        {document.description || '-'}
                      </td>
                      <td>
                        <span className="text-danger fw-bold">
                          {formatCurrency(document.amount)}
                        </span>
                      </td>
                      <td>
                        {formatDate(document.date)}
                      </td>
                      <td>
                        {document.createdBy}
                      </td>
                      <td>
                        {isAdmin ? (
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(document.id, document.title)}
                            title="Delete bill"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            title="Only admins can delete"
                            disabled
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="table-light">
                  <tr>
                    <th colSpan="2">Total</th>
                    <th className="text-danger">{formatCurrency(totalExtraCost)}</th>
                    <th colSpan="3"></th>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Image Modals */}
      {sortedDocuments.map(document => document.imageUrl && (
        <div 
          key={document.id} 
          className="modal fade" 
          id={`imageModal-${document.id}`} 
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{document.title}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div className="modal-body text-center">
                <img 
                  src={document.imageUrl} 
                  alt={document.title} 
                  className="img-fluid"
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Documents;