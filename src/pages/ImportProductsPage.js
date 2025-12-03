import React from 'react';
import ImportProducts from '../components/inventory/ImportProducts';
import { useInventory } from '../context/InventoryContext';

const ImportProductsPage = () => {
  const { addProduct } = useInventory();

  return (
    <div className="import-products-page">
      <ImportProducts onAdd={addProduct} />
    </div>
  );
};

export default ImportProductsPage;