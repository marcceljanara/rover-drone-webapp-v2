import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Penyewaan.css';

function DetailPenyewaan() {
  const { id } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem('accessToken');

  const [rental, setRental] = useState(null);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    let interval;

    const fetchRental = async () => {
      try {
        const response = await fetch(`https://dev-api.xsmartagrichain.com/v1/rentals/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const res = await response.json();

        if (!response.ok) {
          throw new Error(res.message || 'Gagal mengambil detail penyewaan');
        }

        const rentalData = res.data.rental;
        setRental(rentalData);

        // Parse reserved_until to Date and ensure the time is in UTC
        const reservedUntil = new Date(rentalData.reserved_until).getTime();
        const now = new Date().getTime();

        // Jika waktu sekarang sudah melewati reservedUntil, langsung tampilkan "Batas waktu pembayaran habis"
        if (now > reservedUntil) {
          setTimeLeft('Batas waktu pembayaran habis');
          return; // Jangan jalankan countdown jika waktu sudah habis
        }

        const updateCountdown = () => {
          const distance = reservedUntil - new Date().getTime();
          if (distance <= 0) {
            setTimeLeft('Batas waktu pembayaran habis');
            clearInterval(interval); // Stop the interval when the time is up
          } else {
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
          }
        };

        // Jalankan langsung satu kali di awal
        updateCountdown();

        // Buat interval jika waktu masih ada
        interval = setInterval(updateCountdown, 1000);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchRental();

    return () => clearInterval(interval); // Pastikan interval dibersihkan saat komponen tidak aktif lagi
  }, [id, accessToken]);

  if (error) {
    return (
      <div className="container">
        <p style={{ color: 'red' }}>{error}</p>
        <button onClick={() => navigate(-1)} className="back-btn">Kembali</button>
      </div>
    );
  }

  if (!rental) {
    return <div className="container">Memuat detail penyewaan...</div>;
  }

  return (
    <div className="container">
      <h2>Detail Penyewaan</h2>
      <table className="data-table">
        <tbody>
          {Object.entries(rental).map(([key, value]) => (
            <tr key={key}>
              <td><strong>{key}</strong></td>
              <td>{value}</td>
            </tr>
          ))}
          <tr>
            <td><strong>Sisa Waktu Pembayaran</strong></td>
            <td style={{ color: timeLeft === 'Batas waktu pembayaran habis' ? 'red' : 'black' }}>
              {timeLeft}
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={() => navigate(-1)} className="back-btn">Kembali</button>
    </div>
  );
}

export default DetailPenyewaan;
