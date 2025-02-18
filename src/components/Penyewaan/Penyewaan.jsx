import React, { useState } from 'react';    
import './Penyewaan.css'; // Import file CSS untuk styling    
import roverImage from '../../imgs/rover2.png'; // Sesuaikan jalur sesuai dengan struktur folder Anda    
    
const Penyewaan = () => {    
  const [startDate, setStartDate] = useState('');    
  const [endDate, setEndDate] = useState('');    
    
  const handleSewa = () => {    
    alert(`Rover disewa dari ${startDate} hingga ${endDate}`);    
  };    
    
  const handleBatal = () => {    
    setStartDate('');    
    setEndDate('');    
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
      <div className="form-container">    
        <label>Start Date:</label>    
        <input    
          type="date"    
          value={startDate}    
          onChange={(e) => setStartDate(e.target.value)}    
        />    
        <label>End Date:</label>    
        <input    
          type="date"    
          value={endDate}    
          onChange={(e) => setEndDate(e.target.value)}    
        />    
        <div className="buttons">    
          <button onClick={handleSewa} className="sewa-button">Sewa</button>    
          <button onClick={handleBatal} className="batal-button">Batal</button>    
        </div>    
      </div>    
      <p>Jika Tertarik silahkan isi tanggal awal sewa dan akhir sewa serta klik tombol “Sewa”  untuk sewa secara resmi:</p>    
    </div>    
  );    
};    
    
export default Penyewaan;  
