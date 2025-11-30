// src/pages/ImportProductsPage.js
import React, { useState } from 'react';
import { useInventory } from '../context/InventoryContext';
import { useNavigate } from 'react-router-dom';

const ImportProductsPage = () => {
  const { addProduct } = useInventory();
  const navigate = useNavigate();
  const [csvData, setCsvData] = useState('');
  const [message, setMessage] = useState('');
  const [previewData, setPreviewData] = useState([]);

  const parseCSV = (text) => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim());
      const product = {};
      
      headers.forEach((header, index) => {
        if (values[index]) {
          switch(header) {
            case 'name':
            case 'description':
            case 'category':
              product[header] = values[index];
              break;
            case 'quantity':
              product[header] = parseInt(values[index]) || 0;
              break;
            case 'price':
              product[header] = parseFloat(values[index]) || 0;
              break;
            default:
              product[header] = values[index];
          }
        }
      });
      
      return product;
    }).filter(product => product.name); // Only include products with names
  };

  const handleCSVChange = (e) => {
    const text = e.target.value;
    setCsvData(text);
    
    if (text.trim()) {
      const parsed = parseCSV(text);
      setPreviewData(parsed);
    } else {
      setPreviewData([]);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvData(event.target.result);
      const parsed = parseCSV(event.target.result);
      setPreviewData(parsed);
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (previewData.length === 0) {
      setMessage('No valid products to import');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    let importedCount = 0;
    previewData.forEach(product => {
      if (product.name) {
        addProduct(product);
        importedCount++;
      }
    });

    setMessage(`Successfully imported ${importedCount} products!`);
    setTimeout(() => setMessage(''), 5000);
    
    // Reset form
    setCsvData('');
    setPreviewData([]);
  };

  const downloadTemplate = () => {
    const template = `name,description,quantity,price,category
Laptop,High-performance laptop,15,999.99,Electronics
Mouse,Wireless mouse,50,25.99,Electronics
Notebook,A4 size notebook,100,4.99,Stationery`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'product_template.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="import-products-page">
      <div className="page-header">
        <h3>Import Products from Excel/CSV</h3>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/products')}
        >
          Back to Products
        </button>
      </div>

      {message && (
        <div className={`alert ${message.includes('Successfully') ? 'alert-success' : 'alert-danger'}`}>
          {message}
        </div>
      )}

      <div className="import-section">
        <div className="import-options">
          <div className="option-card">
            <h4>Upload CSV File</h4>
            <p>Upload a CSV file with product data</p>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="file-input"
            />
            <small>Supported formats: CSV, TXT</small>
          </div>

          <div className="option-card">
            <h4>Paste CSV Data</h4>
            <p>Or paste your CSV data directly</p>
            <button 
              className="btn btn-outline"
              onClick={downloadTemplate}
            >
              Download Template
            </button>
          </div>
        </div>

        <div className="csv-input-section">
          <label>CSV Data:</label>
          <textarea
            placeholder={`Paste your CSV data here...\n\nFormat:\nname,description,quantity,price,category\nLaptop,High-performance laptop,15,999.99,Electronics`}
            value={csvData}
            onChange={handleCSVChange}
            rows="10"
            className="csv-textarea"
          />
        </div>

        {previewData.length > 0 && (
          <div className="preview-section">
            <h4>Preview ({previewData.length} products)</h4>
            <div className="preview-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.slice(0, 5).map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.description}</td>
                      <td>{product.quantity}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {previewData.length > 5 && (
                <p className="preview-more">... and {previewData.length - 5} more products</p>
              )}
            </div>
            
            <button 
              className="btn btn-success btn-large"
              onClick={handleImport}
            >
              Import {previewData.length} Products
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImportProductsPage;