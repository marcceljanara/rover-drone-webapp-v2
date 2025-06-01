import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Payments.css';

const itemsPerPage = 5;

const Payments = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState(null);
  const [glowingButton, setGlowingButton] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [formData, setFormData] = useState({
    paymentStatus: 'completed',
    paymentMethod: '',
    transactionDescription: '',
  });

  const navigate = useNavigate();

  const fetchPayments = async () => {
    const accessToken = localStorage.getItem('accessToken');
    try {
      const response = await fetch('https://dev-api.xsmartagrichain.com/v1/payments', {
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
      const payments = result.data.payments.map((payment) => ({
        id: payment.id,
        rentalId: payment.rental_id ?? 'null',
        amount: payment.amount,
        payment_status: payment.payment_status,
      }));

      setData(payments);
    } catch (error) {
      console.error('Error saat mengambil data perangkat:', error.message);
      alert(`Gagal memuat data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleGlow = (id) => {
    setGlowingButton(id);
    setTimeout(() => setGlowingButton(null), 1000);
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`https://dev-api.xsmartagrichain.com/v1/payments/${selectedPaymentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) throw new Error(result.message);

      setNotification(result.message);
      setShowModal(false);
      fetchPayments();
    } catch (error) {
      setNotification(`Error: ${error.message}`);
    }

    setTimeout(() => setNotification(null), 3000);
  };

  const filteredData = data.filter((item) =>
    item.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.payment_status.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.rentalId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h2>Kelola Pembayaran Rover Drone</h2>
      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Cari Pembayaran"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {notification && <div className="notification">{notification}</div>}

      <table className="data-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Rental Id</th>
            <th>Biaya</th>
            <th>Status Pembayaran</th>
            <th>Tindakan</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((item) => (
            <tr key={item.id}>
              <td className="clickable-id" onClick={() => navigate(`/payments/${item.id}`)}>
                {item.id}
              </td>
              <td>{item.rentalId}</td>
              <td>{Number(item.amount).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
              <td>{item.payment_status}</td>
              <td>
              <button
              className={`edit-btn ${glowingButton === item.id ? 'glow' : ''}`}
              disabled={item.payment_status === 'completed' || item.payment_status === 'failed'}
              onClick={() => {
                handleGlow(item.id);
                setSelectedPaymentId(item.id);
                setFormData({
                  paymentStatus: 'completed',
                  paymentMethod: '',
                  transactionDescription: '',
                });
                setShowModal(true);
              }}
            >
              Selesaikan
            </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Verifikasi Pembayaran</h3>

            <label>Status Pembayaran:</label>
            <select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
            >
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <label>Metode Pembayaran:</label>
            <input
              type="text"
              value={formData.paymentMethod}
              onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            />

            <label>Deskripsi Transaksi:</label>
            <textarea
              value={formData.transactionDescription}
              onChange={(e) => setFormData({ ...formData, transactionDescription: e.target.value })}
            />

            <div className="modal-buttons">
              <button onClick={handleSubmit}>Verifikasi</button>
              <button onClick={() => setShowModal(false)}>Batal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
