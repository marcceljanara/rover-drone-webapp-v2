import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Pengajuan.css';  // Import CSS

function Pengajuan() {
  const navigate = useNavigate();

  const handleAjukanClick = () => {
    // Arahkan ke halaman lanjutan setelah pengajuan
    navigate('/penyewaan/lanjutan');
  };

  return (
    <div className="pengajuan-container">
      <h2>Form Pengajuan Penyewaan</h2>
      <p>Silakan lengkapi formulir pengajuan di bawah ini untuk memulai perjalanan Anda dengan drone rover kami.</p>

      {/* Tombol Ajukan */}
      <button className="ajukan-button" onClick={handleAjukanClick}>
        Ajukan
      </button>
    </div>
  );
}

export default Pengajuan;
