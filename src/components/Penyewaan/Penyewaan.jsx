/* istanbul ignore file */
import React, { useState, useEffect } from 'react';
import './Penyewaan.css';
import roverImage from '../../imgs/rover2.png';

function calculateRentalCost(interval) {
  const dailyRate = 100000; // Harga per hari
  const daysInMonth = 30; // Rata-rata hari dalam sebulan
  const rentalDays = interval * daysInMonth;

  const discountRates = {
    6: 0.05,  // 5% diskon
    12: 0.10, // 10% diskon
    24: 0.15, // 15% diskon
    36: 0.20, // 20% diskon
  };

  const baseCost = rentalDays * dailyRate;
  const discount = baseCost * (discountRates[interval] || 0);
  const finalCost = baseCost - discount;

  return {
    rentalDays,
    baseCost,
    discount,
    finalCost,
    discountPercentage: discountRates[interval] * 100, // Menambahkan persentase diskon
  };
}

const Penyewaan = () => {
  const [duration, setDuration] = useState(null);
  const [showPrice, setShowPrice] = useState(false);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [jumlahRover, setJumlahRover] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setJumlahRover(5);
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
  };

  const handleSewa = () => {
    if (duration !== null) {
      setShowPrice(true);
      setNotification('Sewa berhasil!');
      setShowNotification(true);
    } else {
      setNotification('Silakan pilih durasi sewa terlebih dahulu.');
      setShowNotification(true);
    }
  };

  const handleBatal = () => {
    setDuration(null);
    setShowPrice(false);
  };

  const calculatePrice = (duration) => {
    return calculateRentalCost(duration).finalCost;
  };

  const calculateDailyPrice = (duration) => {
    const { rentalDays, finalCost } = calculateRentalCost(duration);
    return (finalCost / rentalDays).toFixed(2);
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
        <li>🔍 "Tahu Sebelum Terlambat" - Deteksi hama, kekeringan, dan masalah lahan sebelum menimbulkan kerugian besar. Keputusan tepat waktu = Hasil Maksimal!</li>
        <li>💰 “Lebih Hemat, Lebih Cepat, Lebih Pintar” - Sewa hanya saat butuh! Tanpa beli alat mahal, tanpa investasi yang menguras kantong. Cukup sewa – hasil melesat!</li>
        <li>🌐 "Pantau dari Mana Saja, Kapan Saja!" - Dengan data real-time dan aplikasi canggih, cukup buka layar gadget Anda – semua informasi ada di genggaman. Tidak perlu turun ke lapangan!</li>
        <li>🚜 “Tembus Semua Medan” - Lahan berlumpur, curam, atau terpencil? Bukan masalah! Drone rover ini siap menjangkau tempat yang manusia tak bisa.</li>
      </ul>
      <h3>🔥 “STOP KEHILANGAN WAKTU & UANG!” 🔥</h3>
      <p>
        Dengan Drone Rover kami:
        <ul>
          <li>✅ Produktivitas naik hingga 40% lebih baik.</li>
          <li>✅ Hemat biaya tenaga kerja hingga 50%.</li>
          <li>✅ Tindakan cepat, hasil maksimal!</li>
        </ul>
      </p>
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
      {showPrice ? (
        <div className="price-container">
          <h2>Harga Sewa</h2>
          <p>Durasi: {duration} bulan</p>
          <p>Harga Total: Rp{calculatePrice(duration).toLocaleString('id-ID')}</p>
          <p>Harga Per Hari: Rp{calculateDailyPrice(duration).toLocaleString('id-ID')}</p>
          <p>
            <strong>Rumus:</strong> Harga = (Durasi x 30 hari) x Rp100.000 - Diskon
          </p>
          <button onClick={handleBatal} className="batal-button">Kembali</button>
        </div>
      ) : (
        <div className="form-container">
          <table>
            <thead>
              <tr>
                <th>Durasi</th>
                <th>Harga Total</th>
                <th>Harga Per Hari</th>
                <th>Diskon (%)</th> {/* Kolom Diskon Persentase */}
                <th>Diskon (Rp)</th> {/* Kolom Diskon Nominal */}
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
                    <td>{discountPercentage}%</td> {/* Menampilkan diskon persentase */}
                    <td>Rp{(discount).toLocaleString('id-ID')}</td> {/* Menampilkan diskon nominal */}
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
            disabled={duration === null}
            className={`sewa-button ${duration === null ? 'disabled' : ''}`}
          >
            Sewa
          </button>
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
