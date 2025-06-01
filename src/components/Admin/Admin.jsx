import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5); // bisa diganti oleh user
    const [totalPages, setTotalPages] = useState(1);
    const [notification, setNotification] = useState(null);
    const [glowingButton, setGlowingButton] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [formData, setFormData] = useState({
      username: '',
      password: '',
      confirmPassword: '',
      fullname: '',
      email: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const navigate = useNavigate();

    const accessToken = localStorage.getItem('accessToken');

    const fetchUsers = async () => {
      try {
        const response = await fetch(`https://dev-api.xsmartagrichain.com/v1/admin?limit=${limit}&page=${currentPage}&search=${searchTerm}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message || 'Gagal memuat data pengguna');

        setUsers(result.data.users);
        setTotalPages(result.totalPages);
      } catch (error) {
        setNotification(`Gagal: ${error.message}`);
        setTimeout(() => setNotification(null), 3000);
      }
    };

    useEffect(() => {
      fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentPage, searchTerm, limit]);

    const handleGlow = (buttonType) => {
      setGlowingButton(buttonType);
      setTimeout(() => setGlowingButton(null), 1000);
    };

    const handleAddUser = async () => {
      // Pastikan password dan konfirmasi password cocok
      if (formData.password !== formData.confirmPassword) {
        setNotification("Password dan konfirmasi password tidak cocok");
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      try {
        const response = await fetch('https://dev-api.xsmartagrichain.com/v1/admin', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password, // Kirim hanya password yang asli
            fullname: formData.fullname,
            email: formData.email,
          }),
        });

        const result = await response.json();

        if (!response.ok) throw new Error(result.message || 'Gagal menambahkan pengguna');

        setNotification(result.message);
        setShowAddModal(false);
        setFormData({ username: '', password: '', confirmPassword: '', fullname: '', email: '' });
        fetchUsers();
      } catch (error) {
        setNotification(`Error: ${error.message}`);
      }

      setTimeout(() => setNotification(null), 3000);
    };

    return (
      <div className="container">
        <h2>Kelola Pengguna</h2>
        <div className="search-add-bar">
          <input
            type="text"
            placeholder="Cari Pengguna"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select value={limit} onChange={(e) => {
            setLimit(parseInt(e.target.value));
            setCurrentPage(1);
          }}>
            <option value={5}>5 / halaman</option>
            <option value={10}>10 / halaman</option>
            <option value={15}>15 / halaman</option>
            <option value={20}>20 / halaman</option>
          </select>
          <button
            className={`add-btn ${glowingButton === 'add' ? 'glow' : ''}`}
            onClick={() => {
              setShowAddModal(true);
              handleGlow('add');
            }}
          >
            + Tambah Pengguna
          </button>
        </div>

        {notification && <div className="notification">{notification}</div>}

        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Status Verifikasi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="clickable-id" onClick={() => navigate(`/admin/${user.id}`)}>
                {user.id}
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.is_verified ? 'Terverifikasi' : 'Belum Terverifikasi'}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="footer">
          <span>
            Menampilkan {users.length} pengguna di halaman {currentPage} dari {totalPages}
          </span>
          <div className="pagination">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>◀</button>
            <span className="page-number">Halaman {String(currentPage).padStart(2, '0')}</span>
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>▶</button>
          </div>
        </div>

        {/* Modal Tambah Pengguna */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h3>Tambah Pengguna Baru</h3>
              <label>Username:</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              />
              <label>Password:</label>
              <div className="password-input">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <i
                  className={`fa ${passwordVisible ? 'fa-eye' : 'fa-eye-slash'}`}
                  onClick={() => setPasswordVisible((prev) => !prev)}
                />
              </div>
              <label>Konfirmasi Password:</label>
              <div className="password-input">
                <input
                  type={confirmPasswordVisible ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <i
                  className={`fa ${confirmPasswordVisible ? 'fa-eye' : 'fa-eye-slash'}`}
                  onClick={() => setConfirmPasswordVisible((prev) => !prev)}
                />
              </div>
              <label>Nama Lengkap:</label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
              />
              <label>Email:</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <div className="modal-actions">
                <button onClick={handleAddUser} className="add-btn">Buat Pengguna</button>
                <button onClick={() => setShowAddModal(false)} className="cancel-btn">Batal</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

export default Admin;
