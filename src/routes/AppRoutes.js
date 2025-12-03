import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AdminRoute from '../components/common/AdminRoute';

// Import only the pages we've created
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Products from '../pages/Products';
import AddProduct from '../pages/AddProduct';
import EditProduct from '../pages/EditProduct';
import ViewProduct from '../pages/ViewProduct';
import ImportProductsPage from '../pages/ImportProductsPage';
import Reports from '../pages/Reports';
import StockReport from '../pages/StockReport';
import AdminPanel from '../pages/AdminPanel';
import Settings from '../pages/Settings';
import UserProfile from '../pages/UserProfile';
import NotFound from '../pages/NotFound';

// Placeholder components for missing pages
const Purchase = () => <div>Purchase Page (Coming Soon)</div>;
const AddPurchase = () => <div>Add Purchase Page (Coming Soon)</div>;
const Sales = () => <div>Sales Page (Coming Soon)</div>;
const AddSale = () => <div>Add Sale Page (Coming Soon)</div>;
const Suppliers = () => <div>Suppliers Page (Coming Soon)</div>;
const AddSupplier = () => <div>Add Supplier Page (Coming Soon)</div>;
const Customers = () => <div>Customers Page (Coming Soon)</div>;
const AddCustomer = () => <div>Add Customer Page (Coming Soon)</div>;
const SalesReport = () => <div>Sales Report Page (Coming Soon)</div>;
const ProfitLossReport = () => <div>Profit Loss Report Page (Coming Soon)</div>;

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/products" element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      } />
      
      <Route path="/products/add" element={
        <ProtectedRoute>
          <AddProduct />
        </ProtectedRoute>
      } />
      
      <Route path="/products/edit/:id" element={
        <ProtectedRoute>
          <EditProduct />
        </ProtectedRoute>
      } />
      
      <Route path="/products/view/:id" element={
        <ProtectedRoute>
          <ViewProduct />
        </ProtectedRoute>
      } />
      
      <Route path="/products/import" element={
        <ProtectedRoute>
          <ImportProductsPage />
        </ProtectedRoute>
      } />
      
      {/* Report Routes */}
      <Route path="/reports" element={
        <ProtectedRoute>
          <Reports />
        </ProtectedRoute>
      } />
      
      <Route path="/reports/stock" element={
        <ProtectedRoute>
          <StockReport />
        </ProtectedRoute>
      } />
      
      <Route path="/reports/sales" element={
        <ProtectedRoute>
          <SalesReport />
        </ProtectedRoute>
      } />
      
      <Route path="/reports/profit-loss" element={
        <ProtectedRoute>
          <ProfitLossReport />
        </ProtectedRoute>
      } />
      
      {/* Coming Soon Routes */}
      <Route path="/purchase" element={
        <ProtectedRoute>
          <Purchase />
        </ProtectedRoute>
      } />
      
      <Route path="/purchase/add" element={
        <ProtectedRoute>
          <AddPurchase />
        </ProtectedRoute>
      } />
      
      <Route path="/sales" element={
        <ProtectedRoute>
          <Sales />
        </ProtectedRoute>
      } />
      
      <Route path="/sales/add" element={
        <ProtectedRoute>
          <AddSale />
        </ProtectedRoute>
      } />
      
      <Route path="/suppliers" element={
        <ProtectedRoute>
          <Suppliers />
        </ProtectedRoute>
      } />
      
      <Route path="/suppliers/add" element={
        <ProtectedRoute>
          <AddSupplier />
        </ProtectedRoute>
      } />
      
      <Route path="/customers" element={
        <ProtectedRoute>
          <Customers />
        </ProtectedRoute>
      } />
      
      <Route path="/customers/add" element={
        <ProtectedRoute>
          <AddCustomer />
        </ProtectedRoute>
      } />
      
      {/* User Profile */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <UserProfile />
        </ProtectedRoute>
      } />
      
      {/* Admin Only Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <AdminPanel />
        </AdminRoute>
      } />
      
      <Route path="/settings" element={
        <AdminRoute>
          <Settings />
        </AdminRoute>
      } />
      
      {/* 404 Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;