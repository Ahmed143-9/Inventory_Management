import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDocument } from '../context/DocumentContext';

const Documents = () => {
  const { currentUser } = useAuth();
  const { documents, salesBills, addDocument, deleteDocument } = useDocument();
  const [showForm, setShowForm] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const [activeTab, setActiveTab] = useState('extra-costs'); // 'extra-costs' or 'sales-bills'

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'superadmin';

  // Calculate total extra costs
  const totalExtraCost = useMemo(() => {
    const total = documents.reduce((sum, doc) => sum + (doc.amount || 0), 0);
    return total;
  }, [documents]);

  // Sort documents by date (newest first)
  const sortedDocuments = useMemo(() => {
    return [...documents].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [documents]);

  // Sort sales bills by date (newest first)
  const sortedSalesBills = useMemo(() => {
    return [...salesBills].sort((a, b) => 
      new Date(b.submittedAt) - new Date(a.submittedAt)
    );
  }, [salesBills]);

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

    const documentData = {
      id: editingDoc ? editingDoc.id : Date.now().toString(),
      ...formData,
      amount: parseFloat(formData.amount),
      imageUrl: imagePreview,
      createdAt: editingDoc ? editingDoc.createdAt : new Date().toISOString(),
      createdBy: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email
      }
    };

    addDocument(documentData);
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      amount: ''
    });
    setImagePreview('');
    setShowForm(false);
    setEditingDoc(null);
  };

  const handleEdit = (document) => {
    setEditingDoc(document);
    setFormData({
      title: document.title,
      description: document.description || '',
      amount: document.amount.toString()
    });
    setImagePreview(document.imageUrl || '');
    setShowForm(true);
  };

  const handleDelete = (id, title) => {
    if (isAdmin && window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteDocument(id);
    }
  };

  const formatCurrency = (amount) => {
    // Handle null, undefined, or non-numeric values
    if (amount === null || amount === undefined || isNaN(amount)) {
      return '৳0.00';
    }
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'BDT'
      }).format(amount);
    } catch (error) {
      // Fallback formatting if Intl fails
      return `৳${parseFloat(amount).toFixed(2)}`;
    }
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
          Documents & Bills
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

      {/* Tabs for Extra Costs and Sales Bills */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'extra-costs' ? 'active' : ''}`}
            onClick={() => setActiveTab('extra-costs')}
          >
            <i className="bi bi-cash me-1"></i>
            Extra Costs
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'sales-bills' ? 'active' : ''}`}
            onClick={() => setActiveTab('sales-bills')}
          >
            <i className="bi bi-receipt me-1"></i>
            Sales Bills
          </button>
        </li>
      </ul>

      {/* Add Bill Form */}
      {showForm && activeTab === 'extra-costs' && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-header bg-primary text-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-receipt me-2"></i>
              {editingDoc ? 'Edit Bill' : 'Add New Bill'}
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
                  onClick={() => {
                    setShowForm(false);
                    setEditingDoc(null);
                    setFormData({
                      title: '',
                      description: '',
                      amount: ''
                    });
                    setImagePreview('');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <i className="bi bi-save me-2"></i>
                  {editingDoc ? 'Update Bill' : 'Save Bill'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extra Costs Documents List */}
      {activeTab === 'extra-costs' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-receipt me-2"></i>
              Extra Cost Entries
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
                          {formatDate(document.createdAt)}
                        </td>
                        <td>
                          {document.createdBy?.name || 'Unknown'}
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => handleEdit(document)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            {isAdmin && (
                              <button 
                                className="btn btn-outline-danger"
                                onClick={() => handleDelete(document.id, document.title)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sales Bills List */}
      {activeTab === 'sales-bills' && (
        <div className="card shadow-sm border-0">
          <div className="card-header bg-white py-3">
            <h5 className="mb-0">
              <i className="bi bi-receipt me-2"></i>
              Sales Bills
            </h5>
          </div>
          <div className="card-body">
            {sortedSalesBills.length === 0 ? (
              <div className="text-center py-5">
                <i className="bi bi-receipt display-1 text-muted"></i>
                <h4 className="mt-3">No sales bills generated yet</h4>
                <p className="text-muted">
                  Sales bills are automatically generated when daily sales reports are submitted
                </p>
                <a href="/daily-sales-report" className="btn btn-primary">
                  <i className="bi bi-calendar-day me-2"></i>
                  Go to Daily Sales Report
                </a>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Invoice No</th>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Unit Price</th>
                      <th>Total Amount</th>
                      <th>Payment Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedSalesBills.map(bill => (
                      <tr key={bill.id}>
                        <td>
                          <div className="fw-bold">{bill.invoiceNo}</div>
                        </td>
                        <td>{bill.customerName}</td>
                        <td>{bill.productName}</td>
                        <td>{bill.quantity}</td>
                        <td>{formatCurrency(bill.unitPrice)}</td>
                        <td>
                          <span className="text-success fw-bold">
                            {formatCurrency(bill.totalAmount)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            bill.paymentStatus === 'Paid' ? 'bg-success' : 
                            bill.paymentStatus === 'Pending' ? 'bg-warning' : 'bg-danger'
                          }`}>
                            {bill.paymentStatus}
                          </span>
                        </td>
                        <td>{formatDate(bill.date)}</td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <button 
                              className="btn btn-outline-primary"
                              onClick={() => {
                                // Print functionality would go here
                                const printWindow = window.open('', '_blank');
                                const printContent = `
                                  <!DOCTYPE html>
                                  <html>
                                  <head>
                                    <title>Bill Copy - ${bill.invoiceNo}</title>
                                    <style>
                                      body { font-family: Arial, sans-serif; margin: 20px; }
                                      .header { text-align: center; margin-bottom: 20px; }
                                      .bill-details { margin-bottom: 20px; }
                                      .bill-details div { margin-bottom: 5px; }
                                      .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                                      .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                      .items-table th { background-color: #f2f2f2; }
                                      .total { font-weight: bold; font-size: 1.2em; }
                                      @media print {
                                        body { margin: 0; }
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="header">
                                      <h1>Hardware Inventory System</h1>
                                      <h2>Sales Bill Copy</h2>
                                      <p>Date: ${formatDate(bill.date)}</p>
                                    </div>
                                    
                                    <div class="bill-details">
                                      <div><strong>Invoice No:</strong> ${bill.invoiceNo}</div>
                                      <div><strong>Customer:</strong> ${bill.customerName}</div>
                                      <div><strong>Product:</strong> ${bill.productName}</div>
                                      <div><strong>Payment Status:</strong> ${bill.paymentStatus}</div>
                                    </div>
                                    
                                    <table class="items-table">
                                      <thead>
                                        <tr>
                                          <th>Item</th>
                                          <th>Quantity</th>
                                          <th>Unit Price</th>
                                          <th>Total</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>${bill.productName}</td>
                                          <td>${bill.quantity}</td>
                                          <td>${formatCurrency(bill.unitPrice)}</td>
                                          <td>${formatCurrency(bill.totalAmount)}</td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    
                                    <div class="total">
                                      Total Amount: ${formatCurrency(bill.totalAmount)}
                                    </div>
                                    
                                    <div style="margin-top: 40px;">
                                      <p><strong>Thank you for your business!</strong></p>
                                    </div>
                                  </body>
                                  </html>
                                `;
                                
                                printWindow.document.write(printContent);
                                printWindow.document.close();
                                printWindow.print();
                              }}
                            >
                              <i className="bi bi-printer"></i> Print
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Image Modals */}
      {sortedDocuments.map(document => (
        document.imageUrl && (
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
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default Documents;