import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Pengiriman.css";

const API = "https://dev-api.xsmartagrichain.com/v1/shipments";

export default function Shipments() {
  const token = localStorage.getItem("accessToken");
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [courier, setCourier] = useState("");
  const navigate = useNavigate();

  const fetchShipments = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (status) params.append("status", status);
      if (courier) params.append("courierName", courier);

      const res = await fetch(`${API}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat pengiriman");

      setShipments(data.data.shipments || []);
    } catch (e) {
      setError(e.message);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  }, [status, courier, token]);

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  return (
    <div className="ship-container">
      <h1 className="ship-title">Daftar Pengiriman</h1>

      <div className="ship-filter">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="waiting">Waiting</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>

        <input
          type="text"
          placeholder="Kurir (mis. JNE)"
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
        />

        <button onClick={fetchShipments}>Cari</button>
      </div>

      <div className="ship-table-wrapper">
        {error && <p className="ship-error">{error}</p>}

        <table className="ship-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID Pengiriman</th>
              <th>Kurir / Layanan</th>
              <th>Resi</th>
              <th>Status</th>
              <th>Tanggal Buat</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="ship-loading">Memuat…</td>
              </tr>
            ) : shipments.length ? (
              shipments.map((s, i) => (
                <tr key={s.id}>
                  <td data-label="#"> {i + 1} </td>
                  <td data-label="ID Pengiriman">
                    <button
                      onClick={() => navigate(`/pengiriman/${s.rental_id}`)}
                      className="ship-link"
                    >
                      {s.id}
                    </button>
                  </td>
                  <td data-label="Kurir / Layanan">
                    {s.courier_name} / {s.courier_service}
                  </td>
                  <td data-label="Resi">{s.tracking_number}</td>
                  <td data-label="Status">{s.shipping_status}</td>
                  <td data-label="Tanggal Buat">
                    {new Date(s.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="ship-empty">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
