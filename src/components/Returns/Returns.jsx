import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Returns.css";

const API = "https://dev-api.xsmartagrichain.com/v1/returns";

export default function Returns() {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [returns, setReturns] = useState([]);
  const [status, setStatus] = useState("");
  const [courier, setCourier] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchAllReturns = useCallback(async () => {
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
      if (!res.ok) throw new Error(data.message);
      setReturns(data.data.returns || []);
    } catch (e) {
      setError(e.message || "Gagal memuat daftar pengembalian");
      setReturns([]);
    } finally {
      setLoading(false);
    }
  }, [status, courier, token]);

  useEffect(() => {
    fetchAllReturns();
  }, [fetchAllReturns]);

  useEffect(() => {
    fetchAllReturns();
  }, [status, courier, fetchAllReturns]);

  return (
    <div className="ret-container">
      <h1 className="ret-title">Daftar Pengembalian</h1>

      <div className="ret-filter">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="requested">Requested</option>
          <option value="returning">Returning</option>
          <option value="returned">Returned</option>
          <option value="failed">Failed</option>
        </select>

        <input
          type="text"
          placeholder="Kurir (mis. JNE)"
          value={courier}
          onChange={(e) => setCourier(e.target.value)}
        />

        <button onClick={fetchAllReturns}>Cari</button>
      </div>

      <div className="ret-table-wrapper">
        {error && <p className="ret-error">{error}</p>}

        <table className="ret-table">
          <thead>
            <tr>
              <th>#</th>
              <th>ID Pengembalian</th>
              <th>Rental ID</th>
              <th>Kurir</th>
              <th>Resi</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="ret-loading">Memuat…</td>
              </tr>
            ) : returns.length ? (
              returns.map((r, i) => (
                <tr key={r.id}>
                  <td data-label="#">{i + 1}</td>
                  <td data-label="ID Pengembalian">
                    <span
                      onClick={() => navigate(`/returns/${r.rental_id}`)}
                      className="ret-link"
                    >
                      {r.id}
                    </span>
                  </td>
                  <td data-label="Rental ID">{r.rental_id}</td>
                  <td data-label="Kurir">{r.courier_name}</td>
                  <td data-label="Resi">{r.tracking_number}</td>
                  <td data-label="Status">{r.status}</td>
                  <td data-label="Created">
                    {new Date(r.created_at).toLocaleDateString("id-ID")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="ret-empty">Tidak ada data</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
