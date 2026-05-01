import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UilTimes } from '@iconscout/react-unicons';
import { formatTanggalDanWaktuIndonesia } from '../../utils/datetimeIndonesia'; // perbaikan: fungsi ini tersedia
import './AdminDetail.css';

const AdminDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confNewPassword, setConfNewPassword] = useState('');
  const [notification, setNotification] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/admin/${id}`, {
          credentials: "include",
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        setUser(result.data.user);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handlePasswordUpdate = async () => {
    if (newPassword !== confNewPassword) {
      setNotification('Password dan konfirmasi tidak cocok');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/admin/${id}`, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword, confNewPassword }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setNotification(result.message);
      setShowModal(false);
      setNewPassword('');
      setConfNewPassword('');
    } catch (err) {
      setNotification(err.message);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/admin/${id}`, {
        method: 'DELETE',
        credentials: "include",
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setNotification(result.message);
      setShowDeleteModal(false);
      setTimeout(() => {
        setNotification(null);
        navigate('/admin');
      }, 2000);
    } catch (err) {
      setNotification(err.message);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  if (error) return <div className="user-detail-error">Gagal memuat data: {error}</div>;
  if (!user) return <div className="user-detail-loading">Memuat detail pengguna...</div>;

  return (
    <div className="user-detail-container">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Kembali</button>

      {notification && <div className="notification">{notification}</div>}

      <div className="user-card">
        <h2>Detail Pengguna</h2>
        <div className="user-info">
          <div><strong>ID:</strong> <span>{user.id}</span></div>
          <div><strong>Username:</strong> <span>{user.username}</span></div>
          <div><strong>Nama Lengkap:</strong> <span>{user.fullname || '-'}</span></div>
          <div><strong>Email:</strong> <span>{user.email}</span></div>
          <div><strong>Status Verifikasi:</strong>
            <span className={user.is_verified ? 'verified' : 'not-verified'}>
              {user.is_verified ? 'Terverifikasi' : 'Belum Terverifikasi'}
            </span>
          </div>
          <div><strong>Role:</strong> <span>{user.role}</span></div>
          <div><strong>Dibuat Pada:</strong> <span>{formatTanggalDanWaktuIndonesia(user.created_at)}</span></div>
          <div><strong>Terakhir Diperbarui:</strong> <span>{formatTanggalDanWaktuIndonesia(user.updated_at)}</span></div>
        </div>

        <div className="action-buttons">
          <button className="change-pass-btn" onClick={() => setShowModal(true)}>🔒 Ubah Kata Sandi</button>
          <button className="delete-user-btn" onClick={() => setShowDeleteModal(true)}>🗑 Hapus Akun</button>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Ubah Kata Sandi</h3>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                <UilTimes size="22" />
              </button>
            </div>

            <div className="modal-body">
              <label>Password Baru:</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan password baru"
                />
                <i
                  className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                />
              </div>

              <label>Konfirmasi Password:</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfPassword ? 'text' : 'password'}
                  value={confNewPassword}
                  onChange={(e) => setConfNewPassword(e.target.value)}
                  placeholder="Ulangi password baru"
                />
                <i
                  className={`fa ${showConfPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`}
                  onClick={() => setShowConfPassword(!showConfPassword)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>Batal</button>
              <button className="add-btn" onClick={handlePasswordUpdate}>Simpan Perubahan</button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Konfirmasi Hapus Akun</h3>
              <button className="modal-close-btn" onClick={() => setShowDeleteModal(false)}>
                <UilTimes size="22" />
              </button>
            </div>
            
            <div className="modal-body">
              <p style={{ color: '#4a5568', lineHeight: '1.6', margin: '0' }}>
                Apakah kamu yakin ingin menghapus akun ini? <br />
                <strong style={{ color: '#e53e3e' }}>Tindakan ini tidak bisa dibatalkan.</strong>
              </p>
            </div>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowDeleteModal(false)}>Batal</button>
              <button className="delete-btn" onClick={handleDeleteUser}>Ya, Hapus Akun</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDetail;
