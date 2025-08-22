import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Penyewaan.css';
import './Pengajuan.css';

function KelolaPenyewaan() {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchRentals = async () => {
      if (!token) {
        setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(process.env.REACT_APP_API_URL+'/v1/rentals', {
          method: 'GET',
          credentials: "include",
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Terjadi kesalahan saat memuat data penyewaan.');
        }

        setData(result.data.rentals || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [token]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleAction = async (id) => {
    if (!token) return;

    try {
      const url =
        role === 'admin'
          ? `${process.env.REACT_APP_API_URL}/v1/rentals/${id}`
          : `${process.env.REACT_APP_API_URL}/v1/rentals/${id}/cancel`;

      const options = {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: role === 'user' ? JSON.stringify({ rentalStatus: 'cancelled' }) : null,
      };

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Terjadi kesalahan saat mengubah status sewa.');
      }

      setNotification(result.message);
      setShowNotification(true);

      if (role === 'user') {
        setData((prev) =>
          prev.map((rental) =>
            rental.id === id ? { ...rental, rental_status: 'cancelled' } : rental
          )
        );
      } else if (role === 'admin') {
        setData((prev) => prev.filter((rental) => rental.id !== id));
      }
    } catch (err) {
      setNotification(err.message);
      setShowNotification(true);
    }
  };

  const handleComplete = async (id) => {
    if (!token) return;
  
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/rentals/${id}/status`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rentalStatus: 'completed' }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || 'Terjadi kesalahan saat menyelesaikan sewa.');
      }
  
      setNotification(result.message);
      setShowNotification(true);
  
      setData((prev) =>
        prev.map((rental) =>
          rental.id === id ? { ...rental, rental_status: 'completed' } : rental
        )
      );
    } catch (err) {
      setNotification(err.message);
      setShowNotification(true);
    }
  };
  

  return (
    <div className="container">
      <h2>Kelola Penyewaan Rover Drone</h2>

      <div className="search-add-bar">
        <input type="text" placeholder="Cari ID Penyewaan" />
        {role === 'user' && (
          <button
            className="add-btn"
            onClick={() => navigate('/penyewaan/lanjutan')}
          >
            + Ajukan Penyewaan Baru
          </button>
        )}
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : error ? (
        <div className="notification error">{error}</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Berakhir</th>
              <th>Status</th>
              <th>Biaya (Rp)</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td
                  className="clickable-id"
                  onClick={() => navigate(`/penyewaan/${item.id}`)}
                >
                  {item.id}
              </td>
                <td>{new Date(item.start_date).toLocaleDateString()}</td>
                <td>{new Date(item.end_date).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge status-${item.rental_status}`}>
                    {item.rental_status}
                  </span>
                </td>
                <td>{item.cost.toLocaleString('id-ID')}</td>
                <td>
                  {(role === 'admin' || role === 'user') && (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {role === 'admin' && (
                        <button
                          className="action-btn admin"
                          onClick={() => handleComplete(item.id)}
                          disabled={item.rental_status !== 'active'}
                          style={{
                            cursor: item.rental_status !== 'active' ? 'not-allowed' : 'pointer',
                            opacity: item.rental_status !== 'active' ? 0.5 : 1,
                          }}
                        >
                          Selesaikan
                        </button>
                      )}
                      <button
                        className={`action-btn ${role}`}
                        onClick={() => handleAction(item.id)}
                        disabled={role === 'user' && item.rental_status !== 'pending'}
                        style={{
                          cursor:
                            role === 'user' && item.rental_status !== 'pending'
                              ? 'not-allowed'
                              : 'pointer',
                          opacity:
                            role === 'user' && item.rental_status !== 'pending'
                              ? 0.5
                              : 1,
                        }}
                      >
                        {role === 'admin' ? 'Hapus Sewa' : 'Batalkan'}
                      </button>
                    </div>
                  )}
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showNotification && (
        <div
          className={`${
            notification.toLowerCase().includes('gagal') ||
            notification.toLowerCase().includes('error')
              ? 'error-notification'
              : 'notification'
          }`}
        >
          {notification}
        </div>
      )}
    </div>
  );
}

export default KelolaPenyewaan;
