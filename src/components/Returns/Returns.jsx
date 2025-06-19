// Returns.jsx
import React, { useEffect, useState } from "react";
import "./Returns.css";
import axios from "axios";

const API_BASE = "https://dev-api.xsmartagrichain.com/v1/returns";

const Returns = ({ role = "user" }) => {
  const [returns, setReturns] = useState([]);
  const [selectedReturn, setSelectedReturn] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ status: "", courierName: "" });
  const [formData, setFormData] = useState({
    courierName: "",
    courierService: "",
    trackingNumber: "",
    pickedUpAt: "",
    returnedAt: "",
    newAddressId: "",
    status: "",
    note: "",
  });

  const fetchReturns = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_BASE, { params: filters });
      setReturns(res.data.data.returns);
    } catch (err) {
      console.error("Error fetching returns:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReturns();
  }, [filters]);

  const handleSelectReturn = (ret) => {
    setSelectedReturn(ret);
    setFormData({
      courierName: ret.courier_name || "",
      courierService: ret.courier_service || "",
      trackingNumber: ret.tracking_number || "",
      pickedUpAt: ret.picked_up_at?.slice(0, 16) || "",
      returnedAt: ret.returned_at?.slice(0, 16) || "",
      newAddressId: "",
      status: ret.status || "",
      note: ret.notes || "",
    });
  };

  const handleUpdate = async (id) => {
    try {
      const response = await axios.put(`${API_BASE}/${id}`, {
        courierName: formData.courierName,
        courierService: formData.courierService,
        trackingNumber: formData.trackingNumber,
        pickedUpAt: formData.pickedUpAt,
        returnedAt: formData.returnedAt,
      });
      alert("Return info updated successfully");
      fetchReturns();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal update return.");
    }
  };

  const handlePatch = async (id, field) => {
    let payload = {};
    switch (field) {
      case "address":
        payload = { newAddressId: formData.newAddressId };
        break;
      case "status":
        payload = { status: formData.status };
        break;
      case "note":
        payload = { note: formData.note };
        break;
      default:
        return;
    }

    try {
      const res = await axios.patch(`${API_BASE}/${id}/${field}`, payload);
      alert(`Field ${field} berhasil diperbarui.`);
      fetchReturns();
    } catch (err) {
      alert(err.response?.data?.message || `Gagal update field ${field}`);
    }
  };

  return (
    <div className="returns-container">
      <h2>Manajemen Returns</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter status (e.g. returned)"
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter kurir (e.g. JNE)"
          value={filters.courierName}
          onChange={(e) => setFilters({ ...filters, courierName: e.target.value })}
        />
      </div>

      {loading ? (
        <p className="loading">Memuat data returns...</p>
      ) : (
        <div className="returns-table">
          <table>
            <thead>
              <tr>
                <th>ID Return</th>
                <th>Rental ID</th>
                <th>Kurir</th>
                <th>Resi</th>
                <th>Tgl Terima</th>
                <th>Status</th>
                <th>Note</th>
                {role === "admin" && <th>Aksi</th>}
              </tr>
            </thead>
            <tbody>
              {returns.map((ret) => (
                <tr key={ret.id}>
                  <td>{ret.id}</td>
                  <td>{ret.rental_id}</td>
                  <td>{ret.courier_name || "-"}</td>
                  <td>{ret.tracking_number || "-"}</td>
                  <td>{ret.received_date?.split("T")[0] || "-"}</td>
                  <td>{ret.status || "-"}</td>
                  <td>{ret.notes || "-"}</td>
                  {role === "admin" && (
                    <td>
                      <button onClick={() => handleSelectReturn(ret)}>Edit</button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedReturn && role === "admin" && (
        <div className="edit-section">
          <h3>Edit Return ID: {selectedReturn.id}</h3>
          <div className="edit-grid">
            <input type="text" placeholder="Kurir" value={formData.courierName} onChange={(e) => setFormData({ ...formData, courierName: e.target.value })} />
            <input type="text" placeholder="Layanan Kurir" value={formData.courierService} onChange={(e) => setFormData({ ...formData, courierService: e.target.value })} />
            <input type="text" placeholder="No Resi" value={formData.trackingNumber} onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })} />
            <input type="datetime-local" value={formData.pickedUpAt} onChange={(e) => setFormData({ ...formData, pickedUpAt: e.target.value })} />
            <input type="datetime-local" value={formData.returnedAt} onChange={(e) => setFormData({ ...formData, returnedAt: e.target.value })} />
            <input type="text" placeholder="ID Alamat Baru" value={formData.newAddressId} onChange={(e) => setFormData({ ...formData, newAddressId: e.target.value })} />
            <input type="text" placeholder="Status Baru" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} />
            <input type="text" placeholder="Catatan" value={formData.note} onChange={(e) => setFormData({ ...formData, note: e.target.value })} />
          </div>

          <div className="edit-buttons">
            <button onClick={() => handleUpdate(selectedReturn.id)}>Update Info</button>
            <button onClick={() => handlePatch(selectedReturn.id, "address")}>Ubah Alamat</button>
            <button onClick={() => handlePatch(selectedReturn.id, "status")}>Ubah Status</button>
            <button onClick={() => handlePatch(selectedReturn.id, "note")}>Ubah Catatan</button>
            <button onClick={() => setSelectedReturn(null)}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Returns;
