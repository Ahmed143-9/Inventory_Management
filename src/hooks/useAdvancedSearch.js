import { useMemo } from 'react';
import useDebounce from './useDebounce';

/**
 * Advanced search hook with multiple field support
 * @param {Array} data - Array of objects to search through
 * @param {string} searchTerm - Search term
 * @param {Array} searchFields - Fields to search in
 * @param {Object} filters - Additional filters to apply
 * @returns {Array} Filtered data
 */
const useAdvancedSearch = (data, searchTerm, searchFields = [], filters = {}) => {
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredData = useMemo(() => {
    if (!data || data.length === 0) {
      return [];
    }

    // If no search term and no filters, return original data
    if (!debouncedSearchTerm && Object.keys(filters).length === 0) {
      return data;
    }

    const lowerSearchTerm = debouncedSearchTerm?.toLowerCase() || '';

    return data.filter(item => {
      // Apply search term filter
      let matchesSearch = true;
      if (lowerSearchTerm) {
        matchesSearch = searchFields.some(field => {
          const fieldValue = item[field];
          if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(lowerSearchTerm);
          } else if (typeof fieldValue === 'number') {
            return fieldValue.toString().includes(lowerSearchTerm);
          }
          return false;
        });
      }

      // Apply additional filters
      let matchesFilters = true;
      if (Object.keys(filters).length > 0) {
        matchesFilters = Object.entries(filters).every(([key, value]) => {
          if (value === 'all' || value === '' || value === null || value === undefined) {
            return true;
          }
          return item[key] === value;
        });
      }

      return matchesSearch && matchesFilters;
    });
  }, [data, debouncedSearchTerm, searchFields, filters]);

  return filteredData;
};

export default useAdvancedSearch;