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

        const reservedUntil = new Date(rentalData.reserved_until).getTime();
        const now = new Date().getTime();

        if (now > reservedUntil) {
          setTimeLeft('Batas waktu pembayaran habis');
          return;
        }

        const updateCountdown = () => {
          const distance = reservedUntil - new Date().getTime();
          if (distance <= 0) {
            setTimeLeft('Batas waktu pembayaran habis');
            clearInterval(interval);
          } else {
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            setTimeLeft(`${minutes}m ${seconds}s`);
          }
        };

        updateCountdown();
        interval = setInterval(updateCountdown, 1000);

      } catch (err) {
        setError(err.message);
      }
    };

    fetchRental();
    return () => clearInterval(interval);
  }, [id, accessToken]);

  if (error) {
    return (
      <div className="container">
        <p className="error-text">{error}</p>
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
      <div className="table-wrapper">
        <table className="data-table">
          <tbody>
            {Object.entries(rental).map(([key, value]) => (
              <tr key={key}>
                <td><strong>{key}</strong></td>
                <td>{String(value)}</td>
              </tr>
            ))}
            <tr>
              <td><strong>Sisa Waktu Pembayaran</strong></td>
              <td style={{ color: timeLeft === 'Batas waktu pembayaran habis' ? 'red' : 'black' }}>{timeLeft}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <button onClick={() => navigate(-1)} className="back-btn">Kembali</button>
    </div>
  );
}

export default DetailPenyewaan;
