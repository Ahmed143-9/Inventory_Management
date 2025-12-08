/**
 * Data Migration Utility
 * Handles versioning and migration of localStorage data structures
 */

// Current data versions
const DATA_VERSIONS = {
  inventory: '1.1',
  documents: '1.0',
  auth: '1.0'
};

// Migration functions for different versions
const MIGRATIONS = {
  inventory: {
    '1.0->1.1': (data) => {
      // Add suppliers and customers arrays if they don't exist
      if (!data.suppliers) data.suppliers = [];
      if (!data.customers) data.customers = [];
      return data;
    }
  },
  documents: {
    // No migrations yet
  },
  auth: {
    // No migrations yet
  }
};

/**
 * Get stored data version
 * @param {string} dataType - Type of data (inventory, documents, auth)
 * @returns {string} Version string
 */
export const getDataVersion = (dataType) => {
  try {
    const version = localStorage.getItem(`${dataType}_version`);
    return version || '1.0';
  } catch (error) {
    console.error(`Error getting ${dataType} version:`, error);
    return '1.0';
  }
};

/**
 * Set stored data version
 * @param {string} dataType - Type of data (inventory, documents, auth)
 * @param {string} version - Version string
 */
export const setDataVersion = (dataType, version) => {
  try {
    localStorage.setItem(`${dataType}_version`, version);
  } catch (error) {
    console.error(`Error setting ${dataType} version:`, error);
  }
};

/**
 * Migrate data to current version
 * @param {string} dataType - Type of data (inventory, documents, auth)
 * @param {Object} data - Data to migrate
 * @returns {Object} Migrated data
 */
export const migrateData = (dataType, data) => {
  try {
    const currentVersion = DATA_VERSIONS[dataType];
    const storedVersion = getDataVersion(dataType);
    
    if (storedVersion === currentVersion) {
      return data; // No migration needed
    }
    
    console.log(`Migrating ${dataType} data from ${storedVersion} to ${currentVersion}`);
    
    // Apply migrations in order
    let migratedData = { ...data };
    const migrations = MIGRATIONS[dataType] || {};
    
    // Simple version comparison for now (can be enhanced for complex versioning)
    const migrationKey = `${storedVersion}->${currentVersion}`;
    if (migrations[migrationKey]) {
      migratedData = migrations[migrationKey](migratedData);
    }
    
    // Update version
    setDataVersion(dataType, currentVersion);
    
    return migratedData;
  } catch (error) {
    console.error(`Error migrating ${dataType} data:`, error);
    return data; // Return original data if migration fails
  }
};

/**
 * Clear all application data
 * @returns {boolean} Success status
 */
export const clearAllData = () => {
  try {
    const keysToRemove = [];
    
    // Collect all keys related to the application
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('inventory_')) {
        keysToRemove.push(key);
      }
    }
    
    // Remove all collected keys
    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
    });
    
    console.log('All application data cleared successfully');
    return true;
  } catch (error) {
    console.error('Error clearing application data:', error);
    return false;
  }
};

/**
 * Export all application data
 * @returns {Object} Exported data
 */
export const exportAllData = () => {
  try {
    const exportData = {};
    
    // Collect all keys related to the application
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('inventory_')) {
        const value = localStorage.getItem(key);
        exportData[key] = value;
      }
    }
    
    // Add metadata
    exportData.exportDate = new Date().toISOString();
    exportData.version = DATA_VERSIONS;
    
    return exportData;
  } catch (error) {
    console.error('Error exporting application data:', error);
    return null;
  }
};

/**
 * Import application data
 * @param {Object} data - Data to import
 * @returns {boolean} Success status
 */
export const importData = (data) => {
  try {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid data format for import');
    }
    
    // Import each key-value pair
    Object.keys(data).forEach(key => {
      if (key !== 'exportDate' && key !== 'version') {
        localStorage.setItem(key, data[key]);
      }
    });
    
    console.log('Application data imported successfully');
    return true;
  } catch (error) {
    console.error('Error importing application data:', error);
    return false;
  }
};

export default {
  getDataVersion,
  setDataVersion,
  migrateData,
  clearAllData,
  exportAllData,
  importData
};