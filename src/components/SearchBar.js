// components/SearchBar.js
import React from 'react';

const SearchBar = ({ searchTerm, onSearchChange, filterCategory, onFilterChange, categories }) => {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select 
        value={filterCategory} 
        onChange={(e) => onFilterChange(e.target.value)}
        className="filter-select"
      >
        {categories.map(category => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchBar;