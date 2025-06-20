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
import Returns from './components/Returns/Returns'; // ✅ Tambahan menu Return

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DetailPengiriman from './components/Pengiriman/DetailPengiriman';
import DetailShipment from './components/Penyewaan/DetailShipment';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          
          <Route path="/addresses" element={
            <div className="AppGlass">
              <Sidebar />
              <Addresses />
            </div>
          } />

          <Route path="/dashboard" element={
            <div className="AppGlass">
              <Sidebar />
              <MainDash />
            </div>
          } />

          <Route path="/dashboard/:id" element={
            <div className="AppGlass">
              <Sidebar />
              <DataDetail />
              <RightSide />
            </div>
          } />

          <Route path="/power-data" element={
            <div className="AppGlass">
              <Sidebar />
              <PowerData />
              <RightSide />
            </div>
          } />

          <Route path="/non-fungible-token" element={
            <div className="AppGlass">
              <Sidebar />
              <NonFungibleToken />
              <RightSide />
            </div>
          } />

          <Route path="/penyewaan" element={
            <div className="AppGlass">
              <Sidebar />
              <Pengajuan />
              <RightSide />
            </div>
          } />

          <Route path="/penyewaan/lanjutan" element={
            <div className="AppGlass">
              <Sidebar />
              <Penyewaan />
              <RightSide />
            </div>
          } />

          <Route path="/penyewaan/:id" element={
            <div className="AppGlass">
              <Sidebar />
              <DetailPenyewaan />
              <RightSide />
            </div>
          } />

          <Route path="/penyewaan/:id/shipment" element={
              <div className="AppGlass">
              <Sidebar />
              <DetailShipment />
              <RightSide />
            </div>
          } />


          <Route path="/devices" element={
            <div className="AppGlass">
              <Sidebar />
              <Activation />
              <RightSide />
            </div>
          } />

          <Route path="/devices/:id" element={
            <div className="AppGlass">
              <Sidebar />
              <DeviceDetail />
              <RightSide />
            </div>
          } />

          <Route path="/payments" element={
            <div className="AppGlass">
              <Sidebar />
              <Payments />
              <RightSide />
            </div>
          } />

          <Route path="/payments/:id" element={
            <div className="AppGlass">
              <Sidebar />
              <DetailPayments />
              <RightSide />
            </div>
          } />

          <Route path="/reports" element={
            <div className="AppGlass">
              <Sidebar />
              <Reports />
              <RightSide />
            </div>
          } />

          <Route path="/reports/:id" element={
            <div className="AppGlass">
              <Sidebar />
              <ReportDetail />
              <RightSide />
            </div>
          } />

          <Route path="/admin" element={
            <div className="AppGlass">
              <Sidebar />
              <Admin />
              <RightSide />
            </div>
          } />

          <Route path="/admin/:id" element={
            <div className="AppGlass">
              <Sidebar />
              <AdminDetail />
              <RightSide />
            </div>
          } />

          <Route path="/pengiriman" element={
            <div className="AppGlass">
              <Sidebar />
              <Pengiriman />
              <RightSide />
            </div>
          } />
          <Route path="/pengiriman/:rentalId" element={
            <div className="AppGlass">
              <Sidebar />
              <DetailPengiriman/>
              <RightSide />
            </div>
          } />

          {/* ✅ Rute baru untuk halaman Return */}
          <Route path="/returns" element={
            <div className="AppGlass">
              <Sidebar />
              <Returns />
              <RightSide />
            </div>
          } />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
