import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Penyewaan.css';

const dummyData = [
  {
    id: 'rental-abcdef',
    start_date: '2025-03-09T10:00:00+07:00',
    end_date: '2026-03-09T10:00:00+07:00',
    rental_status: 'active',
    cost: 500000,
  },
  {
    id: 'rental-ghijkl',
    start_date: '2024-12-01T10:00:00+07:00',
    end_date: '2025-12-01T10:00:00+07:00',
    rental_status: 'inactive',
    cost: 450000,
  },
];

function KelolaPenyewaan() {
  const [data] = useState(dummyData);
  const navigate = useNavigate();

  return (
    <div className="container">
      <h2>Kelola Penyewaan Rover Drone</h2>

      <div className="search-add-bar">
        <input type="text" placeholder="Cari ID Penyewaan" />
        <button
          className="add-btn"
          onClick={() => navigate('/penyewaan/lanjutan')}
        >
          + Ajukan Penyewaan Baru
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tanggal Mulai</th>
            <th>Tanggal Berakhir</th>
            <th>Status</th>
            <th>Biaya (Rp)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{new Date(item.start_date).toLocaleDateString()}</td>
              <td>{new Date(item.end_date).toLocaleDateString()}</td>
              <td>
                <span className={`status-badge status-${item.rental_status}`}>
                  {item.rental_status}
                </span>
              </td>
              <td>{item.cost.toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KelolaPenyewaan;
