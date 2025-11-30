// App.js
import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import Header from './components/common/Header';
import Login from './components/auth/Login';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AdminPanel from './pages/AdminPanel';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const { currentUser } = AuthProvider ? {} : { currentUser: null }; // This is just for structure

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'inventory':
        return <Inventory />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AuthProvider>
      <InventoryProvider>
        <div className="app">
          <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
          <main className="main-content">
            {renderPage()}
          </main>
        </div>
      </InventoryProvider>
    </AuthProvider>
  );
}

export default App;