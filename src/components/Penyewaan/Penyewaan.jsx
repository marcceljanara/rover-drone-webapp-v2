import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Penyewaan.css';
import roverImage from '../../imgs/rover2.png';
import lokasiIcon from '../../imgs/Icon-Lokasi.png';

function calculateRentalCost(interval) {
  const dailyRate = 100000;
  const rentalDays = interval * 30;

  const discountRates = {
    6: 0.05,
    12: 0.10,
    24: 0.15,
    36: 0.20,
  };

  const baseCost = rentalDays * dailyRate;
  const discountRate = discountRates[interval] || 0;
  const discount = baseCost * discountRate;
  const finalCost = baseCost - discount;

  return {
    rentalDays,
    baseCost,
    discount,
    finalCost,
    discountPercentage: discountRate * 100,
  };
}

const Penyewaan = () => {
  const [duration, setDuration] = useState(null);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({ loading: true, value: null, error: null });

  const [checkboxes, setCheckboxes] = useState({
    lux: false,
    temperature: false,
    humidity: false,
  });

  const [showLokasiForm, setShowLokasiForm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  useEffect(() => {
    const fetchAvailableDevices = async () => {
      try {
        const response = await fetch('https://dev-api.xsmartagrichain.com/v1/devices?scope=available', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setDeviceStatus({ loading: false, value: data.data.devices.length, error: null });
      } catch {
        setDeviceStatus({ loading: false, value: null, error: 'Gagal memuat perangkat' });
      }
    };

    fetchAvailableDevices();
  }, [token]);

  const handleCheckboxChange = (key) => {
    setCheckboxes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePilih = (dur) => setDuration(dur);

  const handleSewa = async () => {
    if (![6, 12, 24, 36].includes(duration)) {
      setNotification('Durasi sewa tidak valid.');
      setShowNotification(true);
      return;
    }

    if (!token) {
      setNotification('Token tidak tersedia. Silakan login terlebih dahulu.');
      setShowNotification(true);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://dev-api.xsmartagrichain.com/v1/rentals', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ interval: duration }),
      });

      const data = await response.json().catch(() => ({}));
      const message = data?.message || (response.ok ? 'Berhasil menyewa perangkat!' : 'Gagal menyewa.');
      setNotification(message);

      if (response.ok) {
        setTimeout(() => navigate('/riwayat-sewa'), 2000);
      }
    } catch (error) {
      setNotification(error.message || 'Terjadi kesalahan saat menyewa.');
    } finally {
      setLoading(false);
      setShowNotification(true);
    }
  };

  const handleIconClick = () => {
    setShowLokasiForm(!showLokasiForm);
  };

  const renderTableRows = () => {
    return [6, 12, 24, 36].map((dur) => {
      const { finalCost, rentalDays, discount, discountPercentage } = calculateRentalCost(dur);
      const daily = (finalCost / rentalDays).toFixed(2);

      return (
        <tr key={dur}>
          <td>{dur} Bulan</td>
          <td>Rp{finalCost.toLocaleString('id-ID')}</td>
          <td>Rp{Number(daily).toLocaleString('id-ID')}</td>
          <td>{discountPercentage}%</td>
          <td>Rp{discount.toLocaleString('id-ID')}</td>
          <td>
            <button
              className={`sewa-button ${duration === dur ? 'selected' : ''}`}
              onClick={() => handlePilih(dur)}
            >
              Pilih
            </button>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="penyewaan-container">
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Kembali</button>

      <h1>“SAATNYA LAHAN ANDA DIAWASI OLEH TEKNOLOGI MASA DEPAN!” 🚀</h1>
      <h2>“BOSAN RUGI? CAPEK KERJA MANUAL? BANGKITKAN PRODUKTIVITAS DENGAN DRONE ROVER KAMI!”</h2>
      <p>Lupakan kerja manual dan hasil yang tak optimal. Kini hadir DRONE ROVER CANGGIH!</p>

      <div className="image-container">
        <img src={roverImage} alt="Drone Rover" className="rover-image" />
      </div>

      <h3>Formulir Penyewaan</h3>

      <div className="device-status">
        <span className="device-label">📦 Jumlah Perangkat Tersedia:</span>
        <span className="device-value">
          {deviceStatus.loading
            ? 'Memuat...'
            : deviceStatus.error
            ? deviceStatus.error
            : deviceStatus.value}
        </span>
      </div>

      <div className="lokasi-checkbox-row">
        <div className="checkbox-container">
          <label>
            <input type="checkbox" checked={checkboxes.lux} onChange={() => handleCheckboxChange('lux')} />
            Lux
          </label>
          <label>
            <input type="checkbox" checked={checkboxes.temperature} onChange={() => handleCheckboxChange('temperature')} />
            Temperature
          </label>
          <label>
            <input type="checkbox" checked={checkboxes.humidity} onChange={() => handleCheckboxChange('humidity')} />
            Humidity
          </label>
        </div>
        <img
          src={lokasiIcon}
          alt="Ikon Lokasi"
          className={`lokasi-icon ${showLokasiForm ? 'active' : ''}`}
          onClick={handleIconClick}
        />
      </div>

      {showLokasiForm && (
        <div className="lokasi-box-container">
          <div className="lokasi-section">
            <label htmlFor="provinsi">Provinsi</label>
            <input type="text" id="provinsi" placeholder="Masukkan provinsi" />
          </div>
          <div className="lokasi-section">
            <label htmlFor="kota">Kota</label>
            <input type="text" id="kota" placeholder="Masukkan kota" />
          </div>
          <div className="lokasi-section">
            <label htmlFor="kecamatan">Kecamatan</label>
            <input type="text" id="kecamatan" placeholder="Masukkan kecamatan" />
          </div>
          <div className="lokasi-section">
            <label htmlFor="kelurahan">Kelurahan</label>
            <input type="text" id="kelurahan" placeholder="Masukkan kelurahan" />
          </div>
        </div>
      )}

      <div className="form-container">
        <div className="table-responsive">
          <table className="rental-table">
            <thead>
              <tr>
                <th>Durasi</th>
                <th>Harga Total</th>
                <th>Harga/Hari</th>
                <th>Diskon (%)</th>
                <th>Diskon (Rp)</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>{renderTableRows()}</tbody>
          </table>
        </div>

        <button
          className={`sewa-button ${!duration || loading ? 'disabled' : ''}`}
          disabled={!duration || loading}
          onClick={handleSewa}
        >
          {loading ? <span className="spinner" /> : 'Sewa'}
        </button>
      </div>

      {showNotification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default Penyewaan;
