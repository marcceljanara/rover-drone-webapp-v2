import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Penyewaan.css';
import './Pengajuan.css';

function KelolaPenyewaan() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const role = localStorage.getItem('role');
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    if (!token) {
      setError('Token tidak ditemukan. Silakan login terlebih dahulu.');
      setLoading(false);
      return;
    }

    const fetchRentals = async () => {
      try {
        const response = await fetch('https://dev-api.xsmartagrichain.com/v1/rentals', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || 'Gagal memuat data penyewaan.');
        setData(result.data?.rentals || []);
        setError('');
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
      const isAdmin = role === 'admin';
      const url = isAdmin
        ? `https://dev-api.xsmartagrichain.com/v1/rentals/${id}`
        : `https://dev-api.xsmartagrichain.com/v1/rentals/${id}/cancel`;

      const options = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: !isAdmin ? JSON.stringify({ rentalStatus: 'cancelled' }) : null,
      };

      const response = await fetch(url, options);
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Gagal mengubah status sewa.');

      setNotification(result.message);
      setShowNotification(true);

      setData((prev) =>
        isAdmin
          ? prev.filter((item) => item.id !== id)
          : prev.map((item) =>
              item.id === id ? { ...item, rental_status: 'cancelled' } : item
            )
      );
    } catch (err) {
      setNotification(err.message);
      setShowNotification(true);
    }
  };

  const handleComplete = async (id) => {
    if (!token) return;

    try {
      const response = await fetch(
        `https://dev-api.xsmartagrichain.com/v1/rentals/${id}/status`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ rentalStatus: 'completed' }),
        }
      );

      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Gagal menyelesaikan sewa.');

      setNotification(result.message);
      setShowNotification(true);

      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, rental_status: 'completed' } : item
        )
      );
    } catch (err) {
      setNotification(err.message);
      setShowNotification(true);
    }
  };

  const filteredData = data.filter((item) =>
    item.id.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="container" role="main">
      <h2>Kelola Penyewaan Rover Drone</h2>

      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Cari ID Penyewaan"
          aria-label="Cari ID Penyewaan"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {role === 'user' && (
          <button
            className="add-btn"
            onClick={() => navigate('/penyewaan/lanjutan')}
            aria-label="Ajukan Penyewaan Baru"
          >
            + Ajukan Penyewaan Baru
          </button>
        )}
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : error ? (
        <div className="notification error" role="alert" aria-live="assertive">
          {error}
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table" role="table" aria-label="Daftar penyewaan rover drone">
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
              {filteredData.length > 0 ? (
                filteredData.map(({ id, start_date, end_date, rental_status, total_cost }) => (
                  <tr key={id}>
                    <td
                      className="clickable-id"
                      tabIndex={0}
                      role="button"
                      aria-label={`Lihat detail penyewaan ${id}`}
                      onClick={() => navigate(`/penyewaan/${id}`)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          navigate(`/penyewaan/${id}`);
                        }
                      }}
                    >
                      {id}
                    </td>
                    <td>{new Date(start_date).toLocaleDateString('id-ID')}</td>
                    <td>{new Date(end_date).toLocaleDateString('id-ID')}</td>
                    <td>
                      <span className={`status-badge status-${rental_status}`}>
                        {rental_status}
                      </span>
                    </td>
                    <td>{total_cost?.toLocaleString('id-ID')}</td>
                    <td>
                      <div className="action-wrapper">
                        {role === 'admin' && (
                          <button
                            className="action-btn admin"
                            onClick={() => handleComplete(id)}
                            disabled={rental_status !== 'active'}
                            aria-disabled={rental_status !== 'active'}
                          >
                            Selesaikan
                          </button>
                        )}
                        <button
                          className={`action-btn ${role}`}
                          onClick={() => handleAction(id)}
                          disabled={role === 'user' && rental_status !== 'pending'}
                          aria-disabled={role === 'user' && rental_status !== 'pending'}
                        >
                          {role === 'admin' ? 'Hapus Sewa' : 'Batalkan'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>
                    Data penyewaan tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showNotification && (
        <div
          className={/gagal|error/i.test(notification) ? 'error-notification' : 'notification'}
          role="alert"
          aria-live="polite"
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        >
          {notification}
        </div>
      )}
    </main>
  );
}

export default KelolaPenyewaan;
