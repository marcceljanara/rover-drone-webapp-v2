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
  const [notification, setNotification] = useState(null); // State untuk notifikasi
  const [glowingButton, setGlowingButton] = useState(null); // State untuk efek glow
  const navigate = useNavigate();

  const fetchDevices = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch('https://dev-api.xsmartagrichain.com/v1/devices', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memuat data perangkat');
      }

      const result = await response.json();
      const devices = result.data.devices.map((device) => ({
        id: device.id,
        rentalId: device.rental_id ?? 'null',
        status: device.status,
        lastIssue: device.last_reported_issue ?? 'null',
        lastActive: device.last_active,
      }));

      setData(devices);
    } catch (error) {
      console.error('Error saat mengambil data perangkat:', error.message);
      alert(`Gagal memuat data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleEdit = (id) => setEditingId(id);

  const handleStatusChange = async (id, newStatus) => {
    const accessToken = localStorage.getItem('accessToken');
  
    try {
      const response = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengubah status perangkat');
      }
  
      const result = await response.json();
      setNotification(result.message || 'Status perangkat berhasil diubah'); // Tampilkan notifikasi
      setTimeout(() => setNotification(null), 3000); // Sembunyikan notifikasi setelah 3 detik
  
      setEditingId(null);
      await fetchDevices(); // reload data
    } catch (error) {
      console.error('Gagal mengubah status perangkat:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    const accessToken = localStorage.getItem('accessToken');
  
    try {
      const response = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus perangkat');
      }
  
      const result = await response.json();
      setNotification(result.message || 'Perangkat berhasil dihapus'); // Tampilkan notifikasi
      setTimeout(() => setNotification(null), 3000); // Sembunyikan notifikasi setelah 3 detik
  
      await fetchDevices(); // reload data setelah penghapusan berhasil
    } catch (error) {
      console.error('Gagal menghapus perangkat:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleAdd = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch('https://dev-api.xsmartagrichain.com/v1/devices', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menambahkan perangkat');
      }

      setNotification('Perangkat berhasil ditambahkan'); // Tampilkan notifikasi
      setTimeout(() => setNotification(null), 3000); // Sembunyikan notifikasi setelah 3 detik
      await fetchDevices(); // refresh data setelah tambah
    } catch (error) {
      console.error('Gagal menambahkan perangkat:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  const handleGlow = (buttonType) => {
    setGlowingButton(buttonType);
    setTimeout(() => setGlowingButton(null), 1000); // Remove glow after 1 second
  };

  // Perbaikan filter pencarian
  const filteredData = data.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lastIssue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h2>Kelola Perangkat Rover Drone</h2>
      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Cari Drone Rover"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className={`add-btn ${glowingButton === 'add' ? 'glow' : ''}`}
          onClick={() => {
            handleAdd();
            handleGlow('add');
          }}
        >
          + Tambah Perangkat
        </button>
      </div>

      {notification && <div className="notification">{notification}</div>} {/* Notifikasi */}

      <table className="data-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Rental Id</th>
            <th>Status</th>
            <th>Last Reported Issue</th>
            <th>Last Active</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td
                className="clickable-id"
                onClick={() => navigate(`/devices/${item.id}`)}
              >
                {item.id}
              </td>
              <td>{item.rentalId}</td>
              <td>
                {editingId === item.id ? (
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                    onBlur={() => setEditingId(null)}
                    className="status-dropdown"
                  >
                    <option value="" disabled>Pilih status</option>
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                    ))}
                  </select>
                ) : (
                  <span
                    className={`status-badge status-${item.status}`}
                    onClick={() => handleEdit(item.id)}
                  >
                    {item.status}
                  </span>
                )}
              </td>
              <td>{item.lastIssue}</td>
              <td>{item.lastActive}</td>
              <td>
                <button
                  className={`edit-btn ${glowingButton === 'edit' ? 'glow' : ''}`}
                  onClick={() => {
                    handleEdit(item.id);
                    handleGlow('edit');
                  }}
                >
                  Edit
                </button>
                <button
                  className={`delete-btn ${glowingButton === 'delete' ? 'glow' : ''}`}
                  onClick={() => {
                    handleDelete(item.id);
                    handleGlow('delete');
                  }}
                >
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Footer Pagination */}
      <div className="footer">
        <span>
          Showing {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length}
        </span>
        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>◀</button>
          <span className="page-number">Page {String(currentPage).padStart(2, '0')}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>▶</button>
        </div>
      </div>
    </div>
  );
};

export default Activation;
