import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './hooks/AppContext';
import { HomePage } from './pages/HomePage';
import { ClientPage } from './pages/ClientPage';
import { StaffPage } from './pages/StaffPage';
import { OwnerPage } from './pages/OwnerPage';
import './App.css';

function App() {
  return (
    <BrowserRouter basename="/LoyaltyCard">
      <AppProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/client" element={<ClientPage />} />
          <Route path="/client/:businessId" element={<ClientPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/staff/:businessId" element={<StaffPage />} />
          <Route path="/owner" element={<OwnerPage />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;