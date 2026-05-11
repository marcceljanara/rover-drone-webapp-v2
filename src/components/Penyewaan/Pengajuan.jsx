import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UilPlus } from '@iconscout/react-unicons';
import { useAuth } from '../../context/AuthContext'; // 🔑 ambil dari context
import Pagination from '../Pagination/Pagination';
import './Penyewaan.css';
import TableEmptyState from '../TableEmptyState/TableEmptyState';
import './Pengajuan.css';

function KelolaPenyewaan() {
  const navigate = useNavigate();
  const { user } = useAuth(); // user = { id, role, email } dari AuthContext
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 4;

  const allColumns = [
    { key: 'id', label: 'ID' },
    { key: 'start_date', label: 'Tanggal Mulai' },
    { key: 'end_date', label: 'Tanggal Berakhir' },
    { key: 'rental_status', label: 'Status' },
    { key: 'total_cost', label: 'Biaya (Rp)' },
    { key: 'action', label: 'Aksi' },
  ];

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/v1/rentals`,
          {
            credentials: 'include', // kirim cookie otomatis
            headers: { Accept: 'application/json' },
          }
        );
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

    if (user) fetchRentals();
  }, [user]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleAction = async (id) => {
    try {
      const isAdmin = user?.role === 'admin';
      const url = isAdmin
        ? `${process.env.REACT_APP_API_URL}/v1/rentals/${id}`
        : `${process.env.REACT_APP_API_URL}/v1/rentals/${id}/cancel`;

      const options = {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/rentals/${id}/status`,
        {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
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

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <main className="container" role="main">
      <h2 className="page-title">Kelola Penyewaan Rover Drone</h2>

      <div className="search-add-bar rental-toolbar">
        <input
          type="text"
          className="rental-toolbar__search"
          aria-label="Cari ID penyewaan"
          placeholder="Cari ID Penyewaan"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />
        {user?.role === 'user' && (
          <button
            type="button"
            className="add-btn rental-add-btn"
            onClick={() => navigate('/penyewaan/lanjutan')}
            aria-label="Ajukan penyewaan baru"
          >
            <UilPlus size="18" />
            <span>Ajukan Penyewaan Baru</span>
          </button>
        )}
      </div>

      {loading ? (
        <p>Memuat data...</p>
      ) : error ? (
        <div className="notification error">{error}</div>
      ) : (
        <>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  {allColumns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.length === 0 ? (
                  <TableEmptyState
                    colSpan={allColumns.length}
                    icon="📋"
                    title="Tidak ada data penyewaan"
                    subtitle="Tidak ada data yang cocok dengan pencarian."
                  />
                ) : currentItems.map((item) => (
                  <tr key={item.id}>
                    {allColumns.map((col) => {
                      const key = col.key;

                      if (key === 'action') {
                        return (
                          <td key="action" data-label="Aksi">
                            <div className="action-wrapper">
                              {user?.role === 'admin' && (
                                <button
                                  className="action-btn admin"
                                  onClick={() => handleComplete(item.id)}
                                  disabled={item.rental_status !== 'active'}
                                >
                                  Selesaikan
                                </button>
                              )}
                              <button
                                className={`action-btn ${user?.role}`}
                                onClick={() => handleAction(item.id)}
                                disabled={user?.role === 'user' && item.rental_status !== 'pending'}
                              >
                                {user?.role === 'admin' ? 'Hapus Sewa' : 'Batalkan'}
                              </button>
                            </div>
                          </td>
                        );
                      }

                      if (key === 'rental_status') {
                        return (
                          <td key="status" data-label="Status">
                            <span className={`status-badge status-${item.rental_status}`}>
                              {item.rental_status}
                            </span>
                          </td>
                        );
                      }

                      if (key === 'start_date' || key === 'end_date') {
                        return (
                          <td key={key} data-label={col.label}>
                            {new Date(item[key]).toLocaleDateString('id-ID')}
                          </td>
                        );
                      }

                      if (key === 'total_cost') {
                        return (
                          <td key={key} data-label={col.label}>
                            {item[key]?.toLocaleString('id-ID')}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={key}
                          data-label={col.label}
                          className={key === 'id' ? 'clickable-id' : ''}
                          onClick={key === 'id' ? () => navigate(`/penyewaan/${item.id}`) : null}
                        >
                          {item[key]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredData.length}
            pageSize={itemsPerPage}
            itemLabel="penyewaan"
          />
        </>
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
