import React, { createContext, useState, useContext, useEffect } from 'react';

const InventoryContext = createContext();

// Initial sample data matching your Excel structure
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
    specifications: {
      type: "Lever Lock",
      finish: "AB",
      mechanism: "Single Cylinder"
    },
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
  },
  {
    id: 3,
    productCode: "DS-EASY-MED-AC-003",
    product: "DOOR STOPPER",
    productName: "EASY DOOR STOPPER",
    size: "medium",
    brand: "",
    grade: "",
    material: "AC",
    color: "",
    modelNo: "",
    category: "Door Accessories",
    unit: "PCS",
    unitQty: 1,
    quantity: 100,
    unitRate: 165,
    totalBuy: 16500,
    approximateRate: 200,
    authenticationRate: 190,
    sellRate: 250,
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z"
  },
  {
    id: 4,
    productCode: "SC-STAR-58-7C-004",
    product: "screw",
    productName: "star screw prime - quality",
    size: "5/8''",
    brand: "",
    grade: "ptrmium",
    material: "7 color",
    color: "",
    modelNo: "",
    category: "Fasteners",
    unit: "PCS",
    unitQty: 1,
    quantity: 2,
    unitRate: 310,
    totalBuy: 620,
    approximateRate: 350,
    authenticationRate: 340,
    sellRate: 400,
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:00Z"
  },
  {
    id: 5,
    productCode: "DL-SMB-9216-AB-005",
    product: "Door Lock",
    productName: "Round lock SMB",
    size: "",
    brand: "",
    grade: "",
    material: "AB",
    color: "",
    modelNo: "9216.0",
    category: "Door Hardware",
    unit: "PCS",
    unitQty: 1,
    quantity: 5,
    unitRate: 1320,
    totalBuy: 6600,
    approximateRate: 1600,
    authenticationRate: 1550,
    sellRate: 1800,
    createdAt: "2024-01-18T10:45:00Z",
    updatedAt: "2024-01-18T10:45:00Z"
  }
];

const initialPurchases = [
  {
    id: 1,
    date: "2024-01-15T10:30:00Z",
    invoiceNo: "PUR2401001",
    productId: "D-AROMA-5560-AB-001",
    productName: "Lever Lock AROMA",
    model: "556.0",
    size: "",
    colorOrMaterial: "AB",
    quality: "",
    quantityPurchased: 6,
    unitPriceBuy: 2035,
    totalPurchaseCost: 12210,
    supplier: "NEW JANATHA HARDWORK",
    paymentStatus: "Paid"
  },
  {
    id: 2,
    date: "2024-01-15T11:00:00Z",
    invoiceNo: "PUR2401002",
    productId: "D-EMA-5570-ORB-002",
    productName: "Lever Lock EMA",
    model: "5570.0",
    size: "",
    colorOrMaterial: "ORB",
    quality: "",
    quantityPurchased: 6,
    unitPriceBuy: 2035,
    totalPurchaseCost: 12210,
    supplier: "NEW JANATHA HARDWORK",
    paymentStatus: "Paid"
  },
  {
    id: 3,
    date: "2024-01-16T09:15:00Z",
    invoiceNo: "PUR2401003",
    productId: "DS-EASY-MED-AC-003",
    productName: "EASY DOOR STOPPER",
    model: "",
    size: "medium",
    colorOrMaterial: "AC",
    quality: "medium",
    quantityPurchased: 100,
    unitPriceBuy: 165,
    totalPurchaseCost: 16500,
    supplier: "NEW JANATHA HARDWORK",
    paymentStatus: "Paid"
  }
];

const initialSales = [
  {
    id: 1,
    date: "2024-01-20T14:30:00Z",
    invoiceNo: "SAL2401001",
    customerName: "Mr. Rahman",
    productId: "D-AROMA-5560-AB-001",
    productName: "Lever Lock AROMA",
    quantitySold: 2,
    unitPriceSell: 2800,
    totalSale: 5600,
    paymentStatus: "Paid"
  },
  {
    id: 2,
    date: "2024-01-21T11:20:00Z",
    invoiceNo: "SAL2401002",
    customerName: "Alif Hardware Store",
    productId: "DS-EASY-MED-AC-003",
    productName: "EASY DOOR STOPPER",
    quantitySold: 25,
    unitPriceSell: 250,
    totalSale: 6250,
    paymentStatus: "Paid"
  }
];

const initialSuppliers = [
  {
    id: 1,
    name: "NEW JANATHA HARDWORK",
    contactPerson: "Mr. Ahmed",
    phone: "+880 1234 567890",
    email: "contact@janatahardware.com",
    address: "123 Hardware Street, Dhaka",
    productsSupplied: ["Door Locks", "Door Stoppers", "Screws"],
    totalTransactions: 15,
    balance: 0,
    rating: 4.5,
    paymentTerms: "30 Days",
    notes: "Reliable supplier with good quality products"
  },
  {
    id: 2,
    name: "M/S Nuha Trading",
    contactPerson: "Ms. Nuha",
    phone: "+880 9876 543210",
    email: "sales@nuhatrading.com",
    address: "456 Trade Center, Chittagong",
    productsSupplied: ["Nets", "PVC", "Clamps"],
    totalTransactions: 8,
    balance: 12500,
    rating: 4.2,
    paymentTerms: "15 Days",
    notes: "Good for hardware accessories"
  }
];

const initialCustomers = [
  {
    id: 1,
    name: "Mr. Rahman",
    phone: "+880 1711 223344",
    email: "rahman@example.com",
    address: "789 Residential Area, Dhaka",
    customerType: "Retail",
    totalPurchases: 5600,
    lastPurchaseDate: "2024-01-20T14:30:00Z",
    creditLimit: 10000,
    currentBalance: 0,
    notes: "Regular customer, pays on time"
  },
  {
    id: 2,
    name: "Alif Hardware Store",
    phone: "+880 1811 334455",
    email: "alif@hardwarestore.com",
    address: "321 Market Street, Dhaka",
    customerType: "Wholesale",
    totalPurchases: 6250,
    lastPurchaseDate: "2024-01-21T11:20:00Z",
    creditLimit: 50000,
    currentBalance: 0,
    notes: "Wholesale buyer, bulk orders"
  }
];

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        setPurchases(savedPurchases ? JSON.parse(savedPurchases) : initialPurchases);
        setSales(savedSales ? JSON.parse(savedSales) : initialSales);
        setSuppliers(savedSuppliers ? JSON.parse(savedSuppliers) : initialSuppliers);
        setCustomers(savedCustomers ? JSON.parse(savedCustomers) : initialCustomers);
      } catch (error) {
        console.error('Error loading data from localStorage:', error);
        // Load initial data if localStorage fails
        setProducts(initialProducts);
        setPurchases(initialPurchases);
        setSales(initialSales);
        setSuppliers(initialSuppliers);
        setCustomers(initialCustomers);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('inventory_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('inventory_purchases', JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem('inventory_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('inventory_suppliers', JSON.stringify(suppliers));
  }, [suppliers]);

  useEffect(() => {
    localStorage.setItem('inventory_customers', JSON.stringify(customers));
  }, [customers]);

  // Product Functions
 const addProduct = (productData) => {
  const newProduct = {
    id: Date.now(),
    // Excel format fields
    productCode: productData.productCode || generateProductCode(productData),
    product: productData.product,
    productName: productData.productName,
    size: productData.size,
    brand: productData.brand,
    grade: productData.grade,
    material: productData.material,
    color: productData.color,
    modelNo: productData.modelNo,
    unit: productData.unit || 'PCS',
    unitQty: productData.unitQty || 1,
    unitRate: productData.unitRate || 0,
    totalBuy: productData.totalBuy || (productData.unitRate * productData.quantity) || 0,
    category: productData.category || 'Uncategorized',
    quantity: productData.quantity || 0,
    approximateRate: productData.approximateRate || 0,
    authenticationRate: productData.authenticationRate || 0,
    sellRate: productData.sellRate || 0,
    
    // System fields
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    
    // Additional fields for calculations
    stockValue: (productData.quantity || 0) * (productData.unitRate || 0),
    potentialValue: (productData.quantity || 0) * (productData.sellRate || 0),
    profitMargin: productData.unitRate > 0 ? 
      ((productData.sellRate - productData.unitRate) / productData.unitRate * 100) : 0
  };
  
  setProducts([...products, newProduct]);
  return newProduct;
};

  const updateProduct = (id, updates) => {
    const updatedProducts = products.map(product => 
      product.id === id 
        ? { 
            ...product, 
            ...updates, 
            totalBuy: (updates.quantity || product.quantity) * (updates.unitRate || product.unitRate),
            updatedAt: new Date().toISOString() 
          }
        : product
    );
    setProducts(updatedProducts);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const getProductByCode = (productCode) => {
    return products.find(product => product.productCode === productCode);
  };

  // Purchase Functions
  const addPurchase = (purchaseData) => {
    const newPurchase = {
      id: Date.now(),
      invoiceNo: generateInvoiceNumber('PUR', purchases.length + 1),
      ...purchaseData,
      date: new Date().toISOString(),
      totalPurchaseCost: purchaseData.quantityPurchased * purchaseData.unitPriceBuy
    };
    
    setPurchases([...purchases, newPurchase]);
    
    // Update product quantity
    const product = getProductByCode(purchaseData.productId);
    if (product) {
      updateProduct(product.id, {
        quantity: (product.quantity || 0) + purchaseData.quantityPurchased
      });
    }
    
    return newPurchase;
  };

  // Sales Functions
  const addSale = (saleData) => {
    const newSale = {
      id: Date.now(),
      invoiceNo: generateInvoiceNumber('SAL', sales.length + 1),
      ...saleData,
      date: new Date().toISOString(),
      totalSale: saleData.quantitySold * saleData.unitPriceSell
    };
    
    setSales([...sales, newSale]);
    
    // Update product quantity
    const product = getProductByCode(saleData.productId);
    if (product) {
      const newQuantity = (product.quantity || 0) - saleData.quantitySold;
      updateProduct(product.id, {
        quantity: Math.max(0, newQuantity)
      });
    }
    
    return newSale;
  };

  // Supplier Functions
  const addSupplier = (supplierData) => {
    const newSupplier = {
      id: Date.now(),
      ...supplierData,
      totalTransactions: 0,
      balance: 0,
      rating: 0
    };
    
    setSuppliers([...suppliers, newSupplier]);
    return newSupplier;
  };

  // Customer Functions
  const addCustomer = (customerData) => {
    const newCustomer = {
      id: Date.now(),
      ...customerData,
      totalPurchases: 0,
      currentBalance: 0
    };
    
    setCustomers([...customers, newCustomer]);
    return newCustomer;
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

  const getProfitLossReport = (startDate, endDate) => {
    const filteredSales = sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return (!startDate || saleDate >= new Date(startDate)) &&
             (!endDate || saleDate <= new Date(endDate));
    });

    const profitLossData = filteredSales.map(sale => {
      const product = getProductByCode(sale.productId);
      const purchaseCost = product ? product.unitRate || 0 : 0;
      const totalCost = purchaseCost * sale.quantitySold;
      const profit = sale.totalSale - totalCost;
      
      return {
        date: sale.date,
        productId: sale.productId,
        productName: sale.productName,
        quantitySold: sale.quantitySold,
        totalSaleAmount: sale.totalSale,
        totalPurchaseCost: totalCost,
        profitLoss: profit
      };
    });

    const totalProfit = profitLossData.reduce((sum, item) => sum + item.profitLoss, 0);
    const totalSales = profitLossData.reduce((sum, item) => sum + item.totalSaleAmount, 0);
    const totalCost = profitLossData.reduce((sum, item) => sum + item.totalPurchaseCost, 0);

    return {
      details: profitLossData,
      summary: {
        totalSales,
        totalCost,
        totalProfit,
        profitMargin: totalSales > 0 ? (totalProfit / totalSales * 100) : 0
      }
    };
  };

  const value = {
    // State
    products,
    purchases,
    sales,
    suppliers,
    customers,
    loading,
    
    // Product Functions
    addProduct,
    updateProduct,
    deleteProduct,
    getProductByCode,
    
    // Purchase Functions
    addPurchase,
    
    // Sales Functions
    addSale,
    
    // Supplier Functions
    addSupplier,
    
    // Customer Functions
    addCustomer,
    
    // Report Functions
    getDashboardStats,
    getLowStockProducts,
    getOutOfStockProducts,
    getRecentSales,
    getRecentPurchases,
    getStockReport,
    getProfitLossReport,
    
    // Utility Functions
    generateProductCode,
    generateInvoiceNumber
  };

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);