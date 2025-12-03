import React, { createContext, useState, useContext, useEffect, useRef } from 'react';

const InventoryContext = createContext();

// Initial sample data
const initialProducts = [
  {
    id: 1,
    productCode: "D-AROMA-5560-AB-001",
    product: "Door Lock",
    productName: "Lever Lock AROMA",
    size: "",
    brand: "",
    grade: "",
    material: "AB",
    color: "",
    modelNo: "556.0",
    category: "Door Hardware",
    unit: "PCS",
    unitQty: 1,
    quantity: 6,
    unitRate: 2035,
    totalBuy: 12210,
    approximateRate: 2500,
    authenticationRate: 2450,
    sellRate: 2800,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z"
  },
  {
    id: 2,
    productCode: "D-EMA-5570-ORB-002",
    product: "Door Lock",
    productName: "Lever Lock EMA",
    size: "",
    brand: "",
    grade: "",
    material: "ORB",
    color: "",
    modelNo: "5570.0",
    category: "Door Hardware",
    unit: "PCS",
    unitQty: 1,
    quantity: 6,
    unitRate: 2035,
    totalBuy: 12210,
    approximateRate: 2500,
    authenticationRate: 2450,
    sellRate: 2800,
    createdAt: "2024-01-15T11:00:00Z",
    updatedAt: "2024-01-15T11:00:00Z"
  }
];

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔥 FIX: Use ref to track latest products for import
  const productsRef = useRef(products);
  
  useEffect(() => {
    productsRef.current = products;
  }, [products]);

  // Load data from localStorage on initial load
  useEffect(() => {
    const loadData = () => {
      try {
        const savedProducts = localStorage.getItem('inventory_products');
        const savedPurchases = localStorage.getItem('inventory_purchases');
        const savedSales = localStorage.getItem('inventory_sales');
        const savedSuppliers = localStorage.getItem('inventory_suppliers');
        const savedCustomers = localStorage.getItem('inventory_customers');

        setProducts(savedProducts ? JSON.parse(savedProducts) : initialProducts);
        setPurchases(savedPurchases ? JSON.parse(savedPurchases) : []);
        setSales(savedSales ? JSON.parse(savedSales) : []);
        setSuppliers(savedSuppliers ? JSON.parse(savedSuppliers) : []);
        setCustomers(savedCustomers ? JSON.parse(savedCustomers) : []);
        
        console.log('✅ Data loaded from localStorage');
      } catch (error) {
        console.error('❌ Error loading data:', error);
        setProducts(initialProducts);
        setPurchases([]);
        setSales([]);
        setSuppliers([]);
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (!loading && products.length > 0) {
      localStorage.setItem('inventory_products', JSON.stringify(products));
      console.log('💾 Products saved to localStorage:', products.length);
    }
  }, [products, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('inventory_purchases', JSON.stringify(purchases));
    }
  }, [purchases, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('inventory_sales', JSON.stringify(sales));
    }
  }, [sales, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('inventory_suppliers', JSON.stringify(suppliers));
    }
  }, [suppliers, loading]);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem('inventory_customers', JSON.stringify(customers));
    }
  }, [customers, loading]);

  // 🔥 FIX: addProduct - Works with ref for imports
  const addProduct = (productData) => {
    console.log('📦 Adding product:', productData);
    
    const newProduct = {
      id: Date.now() + Math.random(), // Ensure unique ID
      productCode: productData.productCode || generateProductCode(productData),
      product: productData.product || '',
      productName: productData.productName || '',
      size: productData.size || '',
      brand: productData.brand || '',
      grade: productData.grade || '',
      material: productData.material || '',
      color: productData.color || '',
      modelNo: productData.modelNo || '',
      unit: productData.unit || 'PCS',
      unitQty: productData.unitQty || 1,
      unitRate: parseFloat(productData.unitRate) || 0,
      totalBuy: parseFloat(productData.totalBuy) || (parseFloat(productData.unitRate || 0) * parseFloat(productData.quantity || 0)),
      category: productData.category || 'Uncategorized',
      quantity: parseInt(productData.quantity) || 0,
      approximateRate: parseFloat(productData.approximateRate) || 0,
      authenticationRate: parseFloat(productData.authenticationRate) || 0,
      sellRate: parseFloat(productData.sellRate) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      stockValue: (parseFloat(productData.quantity) || 0) * (parseFloat(productData.unitRate) || 0),
      potentialValue: (parseFloat(productData.quantity) || 0) * (parseFloat(productData.sellRate) || 0),
      profitMargin: productData.unitRate > 0 ? 
        ((parseFloat(productData.sellRate) - parseFloat(productData.unitRate)) / parseFloat(productData.unitRate) * 100) : 0
    };
    
    // 🔥 FIX: Use functional update with ref
    setProducts(prev => {
      const updated = [...prev, newProduct];
      console.log('✅ Product added. Total products:', updated.length);
      return updated;
    });
    
    return newProduct;
  };

  // 🔥 FIX: updateProduct - Properly updates specific product
  const updateProduct = (id, updates) => {
    console.log(`🔄 Updating product ${id}:`, updates);
    
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map(product => {
        if (product.id === id) {
          const updated = {
            ...product,
            ...updates,
            updatedAt: new Date().toISOString()
          };
          
          // Recalculate totalBuy if quantity or unitRate changed
          if (updates.quantity !== undefined || updates.unitRate !== undefined) {
            updated.totalBuy = (updated.quantity || 0) * (updated.unitRate || 0);
          }
          
          console.log(`✅ Product ${id} updated`);
          return updated;
        }
        return product;
      });
      
      return updatedProducts;
    });
  };

  const deleteProduct = (id) => {
    console.log(`🗑️ Deleting product ${id}`);
    setProducts(prevProducts => {
      const filtered = prevProducts.filter(product => product.id !== id);
      console.log('✅ Product deleted. Remaining:', filtered.length);
      return filtered;
    });
  };

  const getProductByCode = (productCode) => {
    return products.find(product => product.productCode === productCode);
  };

  // Utility Functions
  const generateProductCode = (product) => {
    const prefix = product.product?.substring(0, 3).toUpperCase() || 'PRO';
    const model = product.modelNo?.replace(/\./g, '').substring(0, 4) || '0000';
    const material = product.material?.substring(0, 2).toUpperCase() || 'XX';
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}-${model}-${material}-${random}`;
  };

  const generateInvoiceNumber = (type, count) => {
    const date = new Date();
    const year = date.getFullYear().toString().substr(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${type}${year}${month}${day}${count.toString().padStart(3, '0')}`;
  };

  // Dashboard Statistics
  const getDashboardStats = () => {
    const totalProducts = products.length;
    const totalStockValue = products.reduce((sum, product) => 
      sum + ((product.quantity || 0) * (product.unitRate || 0)), 0
    );
    
    const lowStockCount = products.filter(p => 
      (p.quantity || 0) > 0 && (p.quantity || 0) < 10
    ).length;
    
    const outOfStockCount = products.filter(p => 
      (p.quantity || 0) === 0
    ).length;
    
    const totalSalesValue = sales.reduce((sum, sale) => 
      sum + (sale.totalSale || 0), 0
    );
    
    const totalPurchaseValue = purchases.reduce((sum, purchase) => 
      sum + (purchase.totalPurchaseCost || 0), 0
    );
    
    const profit = totalSalesValue - totalPurchaseValue;
    
    return {
      totalProducts,
      totalStockValue,
      lowStockCount,
      outOfStockCount,
      totalSalesValue,
      totalPurchaseValue,
      profit,
      customerCount: customers.length,
      supplierCount: suppliers.length
    };
  };

  const getLowStockProducts = () => {
    return products
      .filter(p => (p.quantity || 0) > 0 && (p.quantity || 0) < 10)
      .sort((a, b) => (a.quantity || 0) - (b.quantity || 0))
      .slice(0, 10);
  };

  const getOutOfStockProducts = () => {
    return products
      .filter(p => (p.quantity || 0) === 0)
      .slice(0, 10);
  };

  const getRecentSales = () => {
    return sales
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const getRecentPurchases = () => {
    return purchases
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  };

  const getStockReport = () => {
    return products.map(product => {
      const purchaseCost = product.unitRate || 0;
      const sellingPrice = product.sellRate || 0;
      const stockValue = (product.quantity || 0) * purchaseCost;
      const potentialValue = (product.quantity || 0) * sellingPrice;
      const potentialProfit = potentialValue - stockValue;
      
      return {
        ...product,
        stockValue,
        potentialValue,
        potentialProfit,
        profitMargin: purchaseCost > 0 ? ((sellingPrice - purchaseCost) / purchaseCost * 100) : 0
      };
    });
  };

  const value = {
    products,
    purchases,
    sales,
    suppliers,
    customers,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductByCode,
    getDashboardStats,
    getLowStockProducts,
    getOutOfStockProducts,
    getRecentSales,
    getRecentPurchases,
    getStockReport,
    generateProductCode,
    generateInvoiceNumber
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within InventoryProvider');
  }
  return context;
};