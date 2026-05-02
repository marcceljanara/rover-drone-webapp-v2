// src/App.js
import React from "react";
import './App.css';
import MainDash from './components/MainDash/MainDash';
import PowerData from './components/PowerData/PowerData';
import NonFungibleToken from './components/NonFungibleToken/NonFungibleToken';
import Home from './components/Home/Home';
import Pengajuan from './components/Penyewaan/Pengajuan';
import Penyewaan from './components/Penyewaan/Penyewaan';
import DetailPenyewaan from './components/Penyewaan/DetailPenyewaan';
import Activation from './components/Activation/Activation';
import Payments from './components/Payments/Payments';
import DetailPayments from './components/Payments/DetailPayments';
import Reports from './components/Reports/Reports';
import ReportDetail from './components/Reports/ReportDetail';
import Admin from './components/Admin/Admin';
import AdminDetail from './components/Admin/AdminDetail';
import DeviceDetail from './components/Activation/DeviceDetail';
import Addresses from './components/Addresses';
import DataDetail from './components/MainDash/DataDetail';
import Pengiriman from './components/Pengiriman/Pengiriman';
import Returns from './components/Returns/Returns';
import DetailPengiriman from './components/Pengiriman/DetailPengiriman';
import DetailShipment from './components/Penyewaan/DetailShipment';
import DetailPerpanjangan from './components/Penyewaan/Extensions';
import AjukanPerpanjangan from './components/Penyewaan/AjukanPerpanjangan';
import DetailReturns from './components/Returns/DetailReturns';
import DetailReturnsUser from './components/Penyewaan/DetailPengembalian';
import ChatBot from './components/ChatBot/ChatBot';
import ResetPassword from './components/ResetPassword/ResetPassword';
import DashboardShell from './components/Layout/DashboardShell';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';

const privatePage = (children) => (
  <PrivateRoute>
    <DashboardShell>{children}</DashboardShell>
  </PrivateRoute>
);

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/addresses" element={privatePage(<Addresses />)} />
            <Route path="/dashboard" element={privatePage(<MainDash />)} />
            <Route path="/dashboard/:id" element={privatePage(<DataDetail />)} />
            <Route path="/chats" element={privatePage(<ChatBot />)} />
            <Route path="/power-data" element={privatePage(<PowerData />)} />
            <Route path="/non-fungible-token" element={privatePage(<NonFungibleToken />)} />
            <Route path="/penyewaan" element={privatePage(<Pengajuan />)} />
            <Route path="/penyewaan/lanjutan" element={privatePage(<Penyewaan />)} />
            <Route path="/penyewaan/:id" element={privatePage(<DetailPenyewaan />)} />
            <Route path="/penyewaan/:id/shipment" element={privatePage(<DetailShipment />)} />
            <Route path="/penyewaan/:id/returns" element={privatePage(<DetailReturnsUser />)} />
            <Route path="/penyewaan/:id/extensions" element={privatePage(<DetailPerpanjangan />)} />
            <Route path="/penyewaan/:id/extensions/pengajuan" element={privatePage(<AjukanPerpanjangan />)} />
            <Route path="/devices" element={privatePage(<Activation />)} />
            <Route path="/devices/:id" element={privatePage(<DeviceDetail />)} />
            <Route path="/payments" element={privatePage(<Payments />)} />
            <Route path="/payments/:id" element={privatePage(<DetailPayments />)} />
            <Route path="/reports" element={privatePage(<Reports />)} />
            <Route path="/reports/:id" element={privatePage(<ReportDetail />)} />
            <Route path="/admin" element={privatePage(<Admin />)} />
            <Route path="/admin/:id" element={privatePage(<AdminDetail />)} />
            <Route path="/pengiriman" element={privatePage(<Pengiriman />)} />
            <Route path="/pengiriman/:rentalId" element={privatePage(<DetailPengiriman />)} />
            <Route path="/returns" element={privatePage(<Returns />)} />
            <Route path="/returns/:rentalId" element={privatePage(<DetailReturns />)} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
