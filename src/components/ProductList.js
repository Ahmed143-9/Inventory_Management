// components/ProductList.js
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';

const ProductList = ({ products, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <div className="product-list">
      <SearchBar 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterCategory={filterCategory}
        onFilterChange={setFilterCategory}
        categories={categories}
      />
      
      <div className="products-grid">
        {filteredProducts.map(product => (
          <ProductCard 
            key={product.id}
            product={product}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="empty-state">
          <p>No products found. Add some products to get started!</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;