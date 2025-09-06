// src/App.js
import React from "react";
import './App.css';
import MainDash from './components/MainDash/MainDash';
import RightSide from './components/RightSide/RightSide';
import Sidebar from './components/Sidebar';
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

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './context/PrivateRoute';

function App() {
  return (
    <div className="App">
      <Router>
        {/* PUBLIC ROUTES (tidak perlu login) */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>

        {/* PRIVATE ROUTES (butuh login) */}
        <AuthProvider>
          <Routes>
            <Route path="/addresses" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Addresses />
                </div>
              </PrivateRoute>
            } />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <MainDash />
                </div>
              </PrivateRoute>
            } />

            <Route path="/dashboard/:id" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DataDetail />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/chats" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <ChatBot />
                </div>
              </PrivateRoute>
            } />

            <Route path="/power-data" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <PowerData />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/non-fungible-token" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <NonFungibleToken />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/penyewaan" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Pengajuan />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/penyewaan/lanjutan" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Penyewaan />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/penyewaan/:id" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DetailPenyewaan />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/penyewaan/:id/shipment" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DetailShipment />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/penyewaan/:id/returns" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DetailReturnsUser />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/penyewaan/:id/extensions" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DetailPerpanjangan />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/penyewaan/:id/extensions/pengajuan" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <AjukanPerpanjangan />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/devices" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Activation />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/devices/:id" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DeviceDetail />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/payments" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Payments />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/payments/:id" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DetailPayments />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/reports" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Reports />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/reports/:id" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <ReportDetail />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/admin" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Admin />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/admin/:id" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <AdminDetail />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/pengiriman" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Pengiriman />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/pengiriman/:rentalId" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DetailPengiriman />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/returns" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <Returns />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />

            <Route path="/returns/:rentalId" element={
              <PrivateRoute>
                <div className="AppGlass">
                  <Sidebar />
                  <DetailReturns />
                  <RightSide />
                </div>
              </PrivateRoute>
            } />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
