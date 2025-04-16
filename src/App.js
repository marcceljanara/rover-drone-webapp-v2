import './App.css';
import MainDash from './components/MainDash/MainDash';
import RightSide from './components/RightSide/RightSide';
import Sidebar from './components/Sidebar';
import PowerData from './components/PowerData/PowerData';
import NonFungibleToken from './components/NonFungibleToken/NonFungibleToken';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home/Home';
import Pengajuan from './components/Penyewaan/Pengajuan'; // ✅ Ganti ini
import Penyewaan from './components/Penyewaan/Penyewaan'; // ✅ Tetap ini
import Activation from './components/Activation/Activation';
import DeviceDetail from './components/Activation/DeviceDetail';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Rute Home tanpa sidebar dan right side */}
          <Route path="/" element={<Home />} />

          {/* Rute lainnya dengan tata letak penuh */}
          <Route path="/dashboard" element={
            <div className="AppGlass">
              <Sidebar />
              <MainDash />
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

          {/* Saat klik menu Penyewaan, tampilkan Pengajuan.jsx */}
          <Route path="/penyewaan" element={
            <div className="AppGlass">
              <Sidebar />
              <Pengajuan /> {/* ✅ ini sekarang Pengajuan, bukan Penyewaan */}
              <RightSide />
            </div>
          } />

          {/* Rute baru untuk Penyewaan.jsx setelah klik tombol "Ajukan" */}
          <Route path="/penyewaan/lanjutan" element={
            <div className="AppGlass">
              <Sidebar />
              <Penyewaan />
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

          <Route path="/devices/:id" element={<DeviceDetail />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
