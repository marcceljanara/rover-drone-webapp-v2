import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UilTimes } from '@iconscout/react-unicons';
import { formatTanggalIndonesia, formatTanggalDanWaktuIndonesia } from '../../utils/datetimeIndonesia';
import Pagination from '../Pagination/Pagination';
import TableEmptyState from '../TableEmptyState/TableEmptyState';
import './Reports.css';

const itemsPerPage = 5;

const Reports = () => {
  const getDefaultDates = () => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    return {
      start: formatDate(firstDay),
      end: formatDate(lastDay)
    };
  };

  const defaults = getDefaultDates();
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [glowingButton, setGlowingButton] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [startDate, setStartDate] = useState(defaults.start);
  const [endDate, setEndDate] = useState(defaults.end);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const fetchReports = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/v1/reports', {
        method: 'GET',
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal memuat data laporan');

      const data = result.data.reports.map((report) => ({
        id: report.id,
        reportDate: report.report_date,
        totalTransactions: report.total_transactions,
        startDate: report.start_date,
        endDate: report.end_date,
      }));

      setReports(data);
    } catch (error) {
      alert(`Gagal memuat laporan: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAdd = async () => {
    try {
      const response = await fetch(process.env.REACT_APP_API_URL + '/v1/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: "include",
        body: JSON.stringify({ startDate, endDate }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal menambahkan laporan');

      setNotification(result.message || 'Laporan berhasil ditambahkan');
      setTimeout(() => setNotification(null), 3000);
      setShowAddModal(false);
      setStartDate(defaults.start);
      setEndDate(defaults.end);
      await fetchReports();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/reports/${deleteId}`, {
        method: 'DELETE',
        credentials: "include",
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal menghapus laporan');

      setNotification(result.message || 'Laporan berhasil dihapus');
      setTimeout(() => setNotification(null), 3000);
      setShowDeleteModal(false);
      setDeleteId(null);
      await fetchReports();
    } catch (error) {
      alert(`Gagal menghapus: ${error.message}`);
      setShowDeleteModal(false);
    }
  };

  const handleGlow = (buttonType) => {
    setGlowingButton(buttonType);
    setTimeout(() => setGlowingButton(null), 1000);
  };

  const filteredData = reports.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h2>Daftar Laporan Keuangan</h2>
      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Cari ID Laporan"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className={`add-btn ${glowingButton === 'add' ? 'glow' : ''}`}
          onClick={() => {
            setShowAddModal(true);
            handleGlow('add');
          }}
        >
          + Buat Laporan
        </button>
      </div>

      {notification && <div className="notification">{notification}</div>}

      <div className="table-wrapper">
        <table className="responsive-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tanggal Laporan</th>
              <th>Total Transaksi</th>
              <th>Tanggal Mulai</th>
              <th>Tanggal Akhir</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {currentData.length === 0 ? (
              <TableEmptyState
                colSpan={6}
                icon="📊"
                title="Tidak ada data laporan"
                subtitle="Belum ada laporan yang dibuat."
              />
            ) : currentData.map((item) => (
              <tr key={item.id}>
                <td data-label="ID" className="clickable-id" onClick={() => navigate(`/reports/${item.id}`)}>{item.id}</td>
                <td data-label="Tanggal Laporan">{formatTanggalDanWaktuIndonesia(item.reportDate)}</td>
                <td data-label="Total Transaksi">{item.totalTransactions}</td>
                <td data-label="Tanggal Mulai">{formatTanggalIndonesia(item.startDate)}</td>
                <td data-label="Tanggal Akhir">{formatTanggalIndonesia(item.endDate)}</td>
                <td data-label="Aksi">
                  <button className="delete-btn" onClick={() => confirmDelete(item.id)}>Hapus</button>
                </td>
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
        itemLabel="laporan"
      />

      {/* Modal Tambah */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Buat Laporan Baru</h3>
              <button className="modal-close-btn" onClick={() => setShowAddModal(false)}>
                <UilTimes size="22" />
              </button>
            </div>

            <div className="modal-body">
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '20px', textAlign: 'center' }}>
                Pilih rentang tanggal untuk merekap transaksi menjadi laporan bulanan.
              </p>
              
              <div className="form-group">
                <label>Tanggal Mulai</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>

              <div className="form-group" style={{ marginTop: '16px' }}>
                <label>Tanggal Akhir</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowAddModal(false)} className="cancel-btn">Batal</button>
              <button onClick={handleAdd} className="add-btn">Buat Laporan</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Hapus */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Konfirmasi Hapus</h3>
              <button className="modal-close-btn" onClick={() => setShowDeleteModal(false)}>
                <UilTimes size="22" />
              </button>
            </div>
            <div className="modal-body">
              <p>Apakah kamu yakin ingin menghapus laporan ini?</p>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="cancel-btn">Batal</button>
              <button onClick={handleDelete} className="delete-btn">Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
