import './App.css';
import { useEffect, useState } from 'react';

import MainDash from './components/MainDash/MainDash';
import RightSide from './components/RightSide/RightSide';
import Sidebar from './components/Sidebar';
import PowerData from './components/PowerData/PowerData';
import NonFungibleToken from './components/NonFungibleToken/NonFungibleToken';
import Dashboard from './components/Dashboard/Dashboard';
import Home from './components/Home/Home';
import Pengajuan from './components/Penyewaan/Pengajuan';
import Penyewaan from './components/Penyewaan/Penyewaan';
import Activation from './components/Activation/Activation';
import DeviceDetail from './components/Activation/DeviceDetail';
import DetailPenyewaan from './components/Penyewaan/DetailPenyewaan';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Komponen fallback offline sederhana
function OfflineFallback() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20vh' }}>
      <h2>🚫 Kamu sedang offline</h2>
      <p>Beberapa fitur mungkin tidak tersedia. Silakan sambungkan ke internet.</p>
    </div>
  );
}

function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="App">
      <Router>
        {isOffline ? (
          <OfflineFallback />
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />

            <Route
              path="/dashboard"
              element={
                <div className="AppGlass">
                  <Sidebar />
                  <MainDash />
                  <RightSide />
                </div>
              }
            />

            <Route
              path="/power-data"
              element={
                <div className="AppGlass">
                  <Sidebar />
                  <PowerData />
                  <RightSide />
                </div>
              }
            />

            <Route
              path="/non-fungible-token"
              element={
                <div className="AppGlass">
                  <Sidebar />
                  <NonFungibleToken />
                  <RightSide />
                </div>
              }
            />

            <Route
              path="/penyewaan"
              element={
                <div className="AppGlass">
                  <Sidebar />
                  <Pengajuan />
                  <RightSide />
                </div>
              }
            />

            <Route
              path="/penyewaan/lanjutan"
              element={
                <div className="AppGlass">
                  <Sidebar />
                  <Penyewaan />
                  <RightSide />
                </div>
              }
            />

            <Route
              path="/penyewaan/:id"
              element={
                <div className="AppGlass">
                  <Sidebar />
                  <DetailPenyewaan />
                  <RightSide />
                </div>
              }
            />

            <Route
              path="/devices"
              element={
                <div className="AppGlass">
                  <Sidebar />
                  <Activation />
                  <RightSide />
                </div>
              }
            />

            <Route path="/devices/:id" element={<DeviceDetail />} />
          </Routes>
        )}
      </Router>
    </div>
  );
}

export default App;
