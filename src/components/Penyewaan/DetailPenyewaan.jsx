// src/pages/DetailPenyewaan.js
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Penyewaan.css';

function DetailPenyewaan() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Dummy data
  const rental = {
    id: id,
    user_id: 'user-12345',
    start_date: '2025-03-09T10:00:00+07:00',
    end_date: '2026-03-09T10:00:00+07:00',
    rental_status: 'active',
    cost: 500000,
    reserved_until: '2025-03-09T10:30:00+07:00',
    created_at: '2025-03-09T09:55:00+07:00',
    updated_at: '2025-03-09T10:05:00+07:00',
  };

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
        </tbody>
      </table>
      <button onClick={() => navigate(-1)} className="back-btn">Kembali</button>
    </div>
  );
}

export default DetailPenyewaan;
