import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Activation.css';

const initialData = Array.from({ length: 18 }, (_, i) => ({
  id: `device-${i + 1}`,
  rentalId: 'null',
  status: 'inactive',
  lastIssue: 'null',
  lastActive: '00 Hari 00:00:00',
}));

const statusOptions = ['active', 'inactive', 'maintenance', 'error'];
const itemsPerPage = 5;

const Activation = () => {
  const [data, setData] = useState(initialData);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const handleEdit = (id) => setEditingId(id);

  const handleStatusChange = (id, newStatus) => {
    setData(data.map(item => item.id === id ? { ...item, status: newStatus } : item));
    setEditingId(null);
  };

  const handleDelete = (id) => {
    const updatedData = data.filter(item => item.id !== id);
    setData(updatedData);
    if ((currentPage - 1) * itemsPerPage >= updatedData.length) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleAdd = () => {
    const newId = `device-${data.length + 1}`;
    const newItem = {
      id: newId,
      rentalId: 'null',
      status: 'inactive',
      lastIssue: 'null',
      lastActive: '00 Hari 00:00:00',
    };
    setData([...data, newItem]);
  };

  const filteredData = data.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="container">
      <h2>Kelola Data Drone Rover</h2>
      <div className="search-add-bar">
        <input
          type="text"
          placeholder="Cari Drone Rover"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="add-btn" onClick={handleAdd}>+ Tambah Penyewaan</button>
      </div>

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
                onClick={() => navigate(`/device/${item.id}`)}
              >
                {item.id}
              </td>
              <td>{item.rentalId}</td>
              <td>
                {editingId === item.id ? (
                  <select
                    value={item.status}
                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                  >
                    {statusOptions.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  item.status
                )}
              </td>
              <td>{item.lastIssue}</td>
              <td>{item.lastActive}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(item.id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>Hapus</button>
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
    </div>
  );
};

export default Activation;
