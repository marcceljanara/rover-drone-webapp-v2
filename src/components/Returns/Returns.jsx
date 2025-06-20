
import React, { useState, useEffect } from 'react';
import './Returns.css';

const Returns = ({ role }) => {
  const [returnId, setReturnId] = useState('');
  const [returnData, setReturnData] = useState(null);
  const [allReturns, setAllReturns] = useState([]);
  const [filters, setFilters] = useState({ status: '', courierName: '' });
  const [updateData, setUpdateData] = useState({
    courierName: '', courierService: '', trackingNumber: '', pickedUpAt: '', returnedAt: ''
  });
  const [statusUpdate, setStatusUpdate] = useState('');
  const [note, setNote] = useState('');
  const [newAddressId, setNewAddressId] = useState('');
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('accessToken');

  const fetchReturnById = async () => {
    const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/returns/${returnId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setReturnData(data.data.return);
    else setMessage(data.message || 'Gagal mengambil data');
  };

  const fetchAllReturns = async () => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/returns?${query}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (res.ok) setAllReturns(data.data.returns);
    else setMessage(data.message || 'Gagal mengambil daftar pengembalian');
  };

  const updateReturnInfo = async () => {
    const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/returns/${returnId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updateData),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const updateReturnStatus = async () => {
    const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/returns/${returnId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: statusUpdate }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const updateReturnNote = async () => {
    const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/returns/${returnId}/note`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ note }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  const updateReturnAddress = async () => {
    const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/returns/${returnId}/address`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ newAddressId }),
    });
    const data = await res.json();
    setMessage(data.message);
  };

  useEffect(() => {
    fetchAllReturns();
  }, [filters]);

  return (
    <div className="returns-container">
      <h2>Manajemen Pengembalian</h2>
      <div className="search-section">
        <input value={returnId} onChange={e => setReturnId(e.target.value)} placeholder="Masukkan ID Return" />
        <button onClick={fetchReturnById}>Cari</button>
      </div>

      {returnData && (
        <div className="return-info">
          <p><strong>ID:</strong> {returnData.id}</p>
          <p><strong>Rental ID:</strong> {returnData.rental_id}</p>
          <p><strong>Kurir:</strong> {returnData.courier_name}</p>
          <p><strong>No Resi:</strong> {returnData.tracking_number}</p>
          <p><strong>Diterima:</strong> {new Date(returnData.received_date).toLocaleString('id-ID')}</p>
          <p><strong>Catatan:</strong> {returnData.notes}</p>
        </div>
      )}

      {role === 'admin' && (
        <div className="admin-tools">
          <h3>Admin Tools</h3>

          <div className="form-section">
            <h4>Update Data Return</h4>
            <input placeholder="Courier Name" onChange={e => setUpdateData({ ...updateData, courierName: e.target.value })} />
            <input placeholder="Courier Service" onChange={e => setUpdateData({ ...updateData, courierService: e.target.value })} />
            <input placeholder="Tracking Number" onChange={e => setUpdateData({ ...updateData, trackingNumber: e.target.value })} />
            <input type="datetime-local" onChange={e => setUpdateData({ ...updateData, pickedUpAt: e.target.value })} />
            <input type="datetime-local" onChange={e => setUpdateData({ ...updateData, returnedAt: e.target.value })} />
            <button onClick={updateReturnInfo}>Update Info</button>
          </div>

          <div className="form-section">
            <h4>Update Status</h4>
            <select onChange={e => setStatusUpdate(e.target.value)}>
              <option value="">-- Pilih Status --</option>
              <option value="requested">Requested</option>
              <option value="returning">Returning</option>
              <option value="returned">Returned</option>
              <option value="failed">Failed</option>
            </select>
            <button onClick={updateReturnStatus}>Update Status</button>
          </div>

          <div className="form-section">
            <h4>Update Note</h4>
            <textarea onChange={e => setNote(e.target.value)}></textarea>
            <button onClick={updateReturnNote}>Update Catatan</button>
          </div>

          <div className="form-section">
            <h4>Update Alamat Penjemputan</h4>
            <input placeholder="ID Alamat Baru" onChange={e => setNewAddressId(e.target.value)} />
            <button onClick={updateReturnAddress}>Update Alamat</button>
          </div>
        </div>
      )}

      <div className="filter-section">
        <h4>Filter Semua Pengembalian</h4>
        <input placeholder="Status (e.g., received)" onChange={e => setFilters({ ...filters, status: e.target.value })} />
        <input placeholder="Courier Name (e.g., JNE)" onChange={e => setFilters({ ...filters, courierName: e.target.value })} />
        <button onClick={fetchAllReturns}>Refresh</button>
      </div>

      <div className="returns-list">
        <h4>Daftar Pengembalian</h4>
        <table>
          <thead>
            <tr>
              <th>ID</th><th>Rental ID</th><th>Kurir</th><th>No Resi</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {allReturns.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.rental_id}</td>
                <td>{item.courier_name}</td>
                <td>{item.tracking_number}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default Returns;
