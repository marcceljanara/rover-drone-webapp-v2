import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailShipment.css'; // Reuse styling

function DetailPengiriman() {
  const { id } = useParams(); // rentalId
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const [shipment, setShipment] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/shipments/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Gagal memuat detail pengiriman');

        setShipment(data.data.shipment);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchShipment();
  }, [id, token]);

  if (error) {
    return (
      <div className="rental-detail-container">
        <p className="rental-detail-error">{error}</p>
        <button onClick={() => navigate(-1)} className="rental-detail-back-btn">Kembali</button>
      </div>
    );
  }

  if (!shipment) {
    return <div className="rental-detail-container">Memuat detail pengiriman...</div>;
  }

  return (
    <div className="rental-detail-container">
      <h2 className="rental-detail-title">Detail Pengiriman</h2>
      <div className="rental-detail-table-wrapper">
        <table className="rental-detail-table">
          <tbody>
            {Object.entries(shipment).map(([key, value]) => (
              <tr key={key}>
                <td data-label="Field"><strong>{key}</strong></td>
                <td data-label={key}>{String(value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={() => navigate(-1)} className="rental-detail-back-btn">Kembali</button>
    </div>
  );
}

export default DetailPengiriman;
