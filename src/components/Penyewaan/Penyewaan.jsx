/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Penyewaan.css';
import roverImage from '../../imgs/rover2.png';

function calculateRentalCost(interval) {
  const dailyRate = 100000;
  const daysInMonth = 30;
  const rentalDays = interval * daysInMonth;

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
  const [availableDevices, setAvailableDevices] = useState(null);
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
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          }});
        const data = await response.json();
        setAvailableDevices(data.data.devices.length);
      } catch (error) {
        console.error('Gagal memuat data perangkat:', error);
        setAvailableDevices('Gagal dimuat');
      }
    };
  
    fetchAvailableDevices();
  }, []);

  const handlePilih = (dur) => {
    setDuration(dur);
  };

  const handleSewa = async () => {
    if (!duration) {
      setNotification('Silakan pilih durasi sewa terlebih dahulu.');
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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ interval: duration }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan saat menyewa.');
      }

      if (data.status === 'success') {
        setNotification(data.message);
      } else {
        setNotification(data.message || 'Gagal menyewa.');
      }
    } catch (err) {
      setNotification(err.message);
    } finally {
      setShowNotification(true);
      setLoading(false);
    }
  };

  return (
    <div className="penyewaan-container">
      <button className="back-button" onClick={() => navigate('/penyewaan')}>
        ⬅ Kembali
      </button>

      <h1>“SAATNYA LAHAN ANDA DIAWASI OLEH TEKNOLOGI MASA DEPAN!” 🚀</h1>
      <h2>“BOSAN RUGI? CAPEK KERJA MANUAL? BANGKITKAN PRODUKTIVITAS DENGAN DRONE ROVER KAMI!”</h2>
      <p>
        Lupakan waktu terbuang, kerja manual yang melelahkan, dan hasil yang tak optimal. Kini hadir DRONE ROVER CANGGIH: teknologi pintar yang menjelajah setiap sudut lahan Anda dengan akurasi tanpa tanding!
      </p>

      <div className="image-container">
        <img src={roverImage} alt="Drone Rover" className="rover-image" />
      </div>

      <h3>Formulir Penyewaan</h3>
      <div className="device-status">
        <span className="device-label">📦 Jumlah Perangkat Tersedia:</span>
        <span className="device-value">
          {availableDevices === null ? 'Memuat...' : availableDevices}
        </span>
      </div>

      <div className="form-container">
        <table>
          <thead>
            <tr>
              <th>Durasi</th>
              <th>Harga Total</th>
              <th>Harga Per Hari</th>
              <th>Diskon (%)</th>
              <th>Diskon (Rp)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {[6, 12, 24, 36].map((dur) => {
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
                      onClick={() => handlePilih(dur)}
                      className={`sewa-button ${duration === dur ? 'selected' : ''}`}
                    >
                      Pilih
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <button
          onClick={handleSewa}
          disabled={duration === null || loading}
          className={`sewa-button ${duration === null ? 'disabled' : ''}`}
        >
          {loading ? 'Memuat...' : 'Sewa'}
        </button>
      </div>

      {showNotification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Penyewaan;