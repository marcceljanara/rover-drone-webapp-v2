// Activation.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Activation.css';

const statusOptions = ['active', 'inactive', 'maintenance', 'error'];
const itemsPerPage = 5;

const Activation = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await fetch('https://dev-api.xsmartagrichain.com/v1/devices', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        const devices = result.data.devices.map(device => ({
          id: device.id,
          rentalId: device.rental_id || 'null',
          status: device.status,
          lastIssue: device.last_reported_issue || 'null',
          lastActive: device.last_active,
        }));
        setData(devices);
      } catch (err) {
        alert(`Gagal memuat data: ${err.message}`);
      }
    };

    fetchDevices();
  }, []);

  const handleEdit = (id) => setEditingId(id);

  const handleStatusChange = async (id, newStatus) => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      setNotification(`Status perangkat ${id} diubah menjadi ${newStatus}`);
      setTimeout(() => setNotification(null), 3000);
      setData(prev => prev.map(item => item.id === id ? { ...item, status: newStatus } : item));
      setEditingId(null);
    } catch (err) {
      alert(`Gagal ubah status: ${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotification(`Perangkat ${id} berhasil dihapus`);
      setTimeout(() => setNotification(null), 3000);
      setData(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert(`Gagal menghapus: ${err.message}`);
    }
  };

  const handleAdd = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch('https://dev-api.xsmartagrichain.com/v1/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setNotification('Perangkat berhasil ditambahkan');
      setTimeout(() => setNotification(null), 3000);
      window.location.reload();
    } catch (err) {
      alert(`Gagal menambahkan: ${err.message}`);
    }
  };

  const filteredData = data.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="activation-container">
      <h2 className="activation-title">Kelola Perangkat Rover Drone</h2>

      <div className="activation-box">
        <div className="search-add">
          <input
            type="text"
            placeholder="Cari perangkat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="add-btn" onClick={handleAdd}>+ Tambah</button>
        </div>

        {notification && <div className="notif">{notification}</div>}

        <div className="table-wrapper">
          <table className="activation-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Rental ID</th>
                <th>Status</th>
                <th>Masalah Terakhir</th>
                <th>Aktif Terakhir</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody className="table-content">
              {currentData.map(item => (
                <tr key={item.id}>
                  <td data-label="ID" className="clickable" onClick={() => navigate(`/devices/${item.id}`)}>{item.id}</td>
                  <td data-label="Rental ID">{item.rentalId}</td>
                  <td data-label="Status">
                    {editingId === item.id ? (
                      <select
                        defaultValue={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                      >
                        <option disabled>Pilih status</option>
                        {statusOptions.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <span className={`badge ${item.status}`} onClick={() => handleEdit(item.id)}>{item.status}</span>
                    )}
                  </td>
                  <td data-label="Masalah Terakhir">{item.lastIssue}</td>
                  <td data-label="Aktif Terakhir">{item.lastActive}</td>
                  <td data-label="Aksi" className="action-col">
                    <button className="delete-btn" onClick={() => handleDelete(item.id)}>Hapus</button>
                    <button className="edit-btn" onClick={() => handleEdit(item.id)}>Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>Halaman {currentPage} dari {totalPages}</span>
          <div>
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>◀</button>
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>▶</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activation;
