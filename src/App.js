import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { InventoryProvider } from './context/InventoryContext';
import AppRoutes from './routes/AppRoutes';
import Navbar from './components/layout/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <InventoryProvider>
          <div className="App">
            <Navbar />
            <main className="container-fluid px-0">
              <AppRoutes />
            </main>
          </div>
        </InventoryProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;