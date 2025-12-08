// src/pages/Inventory.js
import React from 'react';
import { useInventory } from '../context/InventoryContext';
import ProductList from '../components/inventory/ProductList';
import AddProduct from './AddProduct';
import ProtectedRoute from '../components/common/ProtectedRoute';

const Inventory = () => {
  const { products, sales, addProduct, updateProduct, deleteProduct } = useInventory();

  return (
    <ProtectedRoute>
      <div className="inventory-page">
        <h2>Product Inventory</h2>
        
        <AddProduct onAdd={addProduct} />
        <ProductList 
          products={products} 
          sales={sales}
          onUpdate={updateProduct}
          onDelete={deleteProduct}
        />
      </div>
    </ProtectedRoute>
  );
};

export default Inventory;