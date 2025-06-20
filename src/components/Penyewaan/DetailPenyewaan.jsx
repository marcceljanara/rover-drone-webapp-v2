import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailPenyewaan.css';

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
      <div className="rental-detail-container">
        <p className="rental-detail-error">{error}</p>
        <button onClick={() => navigate(-1)} className="rental-detail-back-btn">Kembali</button>
      </div>
    );
  }

  if (!rental) {
    return <div className="rental-detail-container">Memuat detail penyewaan...</div>;
  }

  return (
    <div className="rental-detail-container">
      <h2 className="rental-detail-title">Detail Penyewaan</h2>
      <div className="rental-detail-table-wrapper">
        <table className="rental-detail-table">
          <tbody>
            {Object.entries(rental).map(([key, value]) => (
              <tr key={key}>
                <td data-label="Field"><strong>{key}</strong></td>
                <td data-label={key}>{String(value)}</td>
              </tr>
            ))}
            <tr>
              <td data-label="Field"><strong>Sisa Waktu Pembayaran</strong></td>
              <td
                data-label="Sisa Waktu Pembayaran"
                style={{ color: timeLeft === 'Batas waktu pembayaran habis' ? 'red' : 'black' }}
              >
                {timeLeft}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <button
      onClick={() => navigate(`/penyewaan/${id}/shipment`)}
      className="rental-detail-back-btn"
      style={{ marginTop: '10px', backgroundColor: '#00796b', color: '#fff' }}
    >
      Pengiriman
    </button>
      <button onClick={() => navigate(-1)} className="rental-detail-back-btn">Kembali</button>

    </div>
  );
}

export default DetailPenyewaan;
