// src/App.js - COMPLETE FIXED VERSION
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';

// Layout Components
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import ViewProduct from './pages/ViewProduct';
import ImportProductsPage from './pages/ImportProductsPage';
import AdminPanel from './pages/AdminPanel';
import Reports from './pages/Reports';
import StockReport from './pages/StockReport';
import UserProfile from './pages/UserProfile';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

// Import CSS
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <InventoryProvider>
          <div className="App">
            {/* Header সব পেজে show হবে (Login page ছাড়া) */}
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<MainLayout />} />
            </Routes>
          </div>
        </InventoryProvider>
      </AuthProvider>
    </Router>
  );
}

// Main Layout for authenticated users
function MainLayout() {
  return (
    <>
      <Header />
      <div className="main-content">
        <Routes>
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/add" element={<AddProduct />} />
            <Route path="/products/edit/:id" element={<EditProduct />} />
            <Route path="/products/view/:id" element={<ViewProduct />} />
            <Route path="/products/import" element={<ImportProductsPage />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/stock" element={<StockReport />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          
          {/* Admin Only Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPanel />} />
          </Route>
          
          {/* Default Routes */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;