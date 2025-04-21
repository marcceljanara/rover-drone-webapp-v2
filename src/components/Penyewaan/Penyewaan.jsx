/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
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
  const [showPrice, setShowPrice] = useState(false);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [jumlahRover, setJumlahRover] = useState(null);
  const [rentalDetails, setRentalDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setJumlahRover(5); // Contoh jumlah rover yang tersedia
    }, 1000);
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handlePilih = (dur) => {
    setDuration(dur);
    setShowPrice(true);
  };

  const handleSewa = async () => {
    if (!duration) {
      setNotification('Silakan pilih durasi sewa terlebih dahulu.');
      setShowNotification(true);
      return;
    }

    const rentalIndex = [6, 12, 24, 36].indexOf(duration) + 1;
    const rentalId = `RNT-${rentalIndex.toString().padStart(4, '0')}`;
    const token = localStorage.getItem('token');

    if (!token) {
      setNotification('Token tidak tersedia. Silakan login terlebih dahulu.');
      setShowNotification(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://dev-api.xsmartagrichain.com/v1/rentals/${rentalId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        setRentalDetails(data.data.rental);
        setNotification('Sewa berhasil!');
        setShowNotification(true);
      } else {
        setNotification('Gagal mendapatkan detail penyewaan.');
        setShowNotification(true);
      }
    } catch (err) {
      setError(err.message);
      setNotification('Terjadi kesalahan saat mengambil detail penyewaan.');
      setShowNotification(true);
    } finally {
      setLoading(false);
    }
  };

  const handleBatal = () => {
    setDuration(null);
    setShowPrice(false);
    setRentalDetails(null);
  };

  return (
    <div className="penyewaan-container">
      <h1>“SAATNYA LAHAN ANDA DIAWASI OLEH TEKNOLOGI MASA DEPAN!” 🚀</h1>
      <h2>“BOSAN RUGI? CAPEK KERJA MANUAL? BANGKITKAN PRODUKTIVITAS DENGAN DRONE ROVER KAMI!”</h2>
      <p>
        Lupakan waktu terbuang, kerja manual yang melelahkan, dan hasil yang tak optimal. Kini hadir DRONE ROVER CANGGIH: teknologi pintar yang menjelajah setiap sudut lahan Anda dengan akurasi tanpa tanding!
      </p>
      <div className="image-container">
        <img src={roverImage} alt="Drone Rover" className="rover-image" />
      </div>
      <h3>🌾 Bayangkan Ini...</h3>
      <ul>
        <li>👉 Dalam hitungan menit, Anda tahu kondisi setiap tanaman di lahan ribuan hektar.</li>
        <li>👉 Lahan sulit? Tak masalah! Medan terberat ditembus tanpa hambatan.</li>
        <li>👉 Hama muncul? Drone rover mendeteksi lebih awal – aksi cepat, rugi minimal!</li>
      </ul>
      <h3>💡 KEUNTUNGAN YANG TAK TERBANTAHKAN 💡</h3>
      <ul>
        <li>🔍 "Tahu Sebelum Terlambat" - Deteksi hama, kekeringan, dan masalah lahan sebelum menimbulkan kerugian besar.</li>
        <li>💰 “Lebih Hemat, Lebih Cepat, Lebih Pintar” - Sewa hanya saat butuh!</li>
        <li>🌐 "Pantau dari Mana Saja, Kapan Saja!" - Data real-time langsung di gadget Anda.</li>
        <li>🚜 “Tembus Semua Medan” - Drone ini siap menjangkau tempat yang manusia tak bisa.</li>
      </ul>
      <h3>🔥 “STOP KEHILANGAN WAKTU & UANG!” 🔥</h3>
      <ul>
        <li>✅ Produktivitas naik hingga 40% lebih baik.</li>
        <li>✅ Hemat biaya tenaga kerja hingga 50%.</li>
        <li>✅ Tindakan cepat, hasil maksimal!</li>
      </ul>
      <h3>Cocok untuk:</h3>
      <ul>
        <li>✔️ Pemantauan lahan sawit, tebu, atau pertanian modern</li>
        <li>✔️ Survei proyek besar & inspeksi</li>
        <li>✔️ Solusi pertanian berkelanjutan & efisien</li>
      </ul>
      <h3>💎 "BERINVESTASI PADA TEKNOLOGI = BERINVESTASI PADA KESUKSESAN ANDA!" 💎</h3>
      <p>
        ⏳ TUNGGU APA LAGI? Waktu adalah uang, dan drone rover ini adalah solusi bisnis masa depan.<br />
        📞 Hubungi kami sekarang juga!<br />
        📊 Dapatkan presentasi GRATIS & layanan terbaik untuk Anda.<br />
        “Jangan biarkan peluang ini lewat. Masa depan perkebunan Anda dimulai HARI INI!” 🚀
      </p>

      <h3>Formulir Penyewaan</h3>
      {jumlahRover !== null ? (
        <p>Jumlah Rover Drone yang tersedia saat ini: {jumlahRover}</p>
      ) : (
        <p>Loading...</p>
      )}

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
            {[6, 12, 24, 36].map((dur, index) => {
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

      {rentalDetails && (
        <div className="rental-details">
          <h2>Detail Penyewaan</h2>
          <p><strong>User ID:</strong> {rentalDetails.user_id}</p>
          <p><strong>Start Date:</strong> {new Date(rentalDetails.start_date).toLocaleString('id-ID')}</p>
          <p><strong>End Date:</strong> {new Date(rentalDetails.end_date).toLocaleString('id-ID')}</p>
          <p><strong>Rental Status:</strong> {rentalDetails.rental_status}</p>
          <p><strong>Cost:</strong> Rp{rentalDetails.cost.toLocaleString('id-ID')}</p>
          <p><strong>Reserved Until:</strong> {new Date(rentalDetails.reserved_until).toLocaleString('id-ID')}</p>
          <p><strong>Created At:</strong> {new Date(rentalDetails.created_at).toLocaleString('id-ID')}</p>
          <p><strong>Updated At:</strong> {new Date(rentalDetails.updated_at).toLocaleString('id-ID')}</p>
          <button onClick={handleBatal} className="cancel-button">Batal</button>
        </div>
      )}

      {showNotification && (
        <div className="notification">
          {notification}
        </div>
      )}
    </div>
  );
};

export default Penyewaan;
