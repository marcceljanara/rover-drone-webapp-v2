import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../Pagination/Pagination";
import "./MainDash.css";

const ITEMS_PER_PAGE = 6;

const MainDash = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/devices`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Gagal mengambil data perangkat.");

        const result = await response.json();
        setDevices(result?.data?.devices || []);
      } catch (err) {
        setError(err.message || "Gagal mengambil data perangkat.");
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  const filteredDevices = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return devices;

    return devices.filter((device) =>
      String(device.id || "").toLowerCase().includes(keyword)
    );
  }, [devices, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredDevices.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedDevices = filteredDevices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getStatusLabel = (status) => status || "unknown";

  const getStatusClass = (status) => {
    switch (String(status || "").toLowerCase()) {
      case "active":
        return "is-active";
      case "inactive":
        return "is-inactive";
      default:
        return "is-unknown";
    }
  };

  return (
    <section className="page-container" aria-labelledby="dashboard-title">
      <header className="page-header">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1 id="dashboard-title" className="dashboard-title">Dashboard</h1>
          <p className="page-description">
            Pantau status perangkat rover-drone dan buka detail sensor secara cepat.
          </p>
        </div>

        <div className="search-container" role="search">
          <label htmlFor="device-search">Cari perangkat</label>
          <input
            id="device-search"
            type="search"
            placeholder="Masukkan ID device"
            className="search-box"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </header>

      {error && <div className="dashboard-alert" role="alert">{error}</div>}

      <div className="dashboard-summary" aria-label="Ringkasan perangkat">
        <div>
          <span>Total perangkat</span>
          <strong>{devices.length}</strong>
        </div>
        <div>
          <span>Aktif</span>
          <strong>{devices.filter((device) => device.status === "active").length}</strong>
        </div>
        <div>
          <span>Hasil pencarian</span>
          <strong>{filteredDevices.length}</strong>
        </div>
      </div>

      <div className="cards-container">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <div className="device-card device-card-skeleton" key={index} aria-hidden="true" />
          ))
        ) : paginatedDevices.length > 0 ? (
          paginatedDevices.map((device) => (
            <button
              key={device.id}
              type="button"
              className="device-card"
              onClick={() => navigate(`/dashboard/${encodeURIComponent(device.id)}`)}
            >
              <span className={`status-pill ${getStatusClass(device.status)}`}>
                {getStatusLabel(device.status)}
              </span>
              <h2>{device.id}</h2>
              <p>Buka detail telemetry dan riwayat sensor perangkat ini.</p>
            </button>
          ))
        ) : (
          <div className="empty-dashboard-state">
            <h2>Perangkat tidak ditemukan</h2>
            <p>Coba gunakan kata kunci lain atau periksa koneksi API perangkat.</p>
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={filteredDevices.length}
        pageSize={ITEMS_PER_PAGE}
        itemLabel="perangkat"
      />
    </section>
  );
};

export default MainDash;
