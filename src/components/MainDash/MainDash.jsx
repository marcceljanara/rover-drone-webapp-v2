import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MainDash.css";

const MainDash = () => {
  const [devices, setDevices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch("https://dev-api.xsmartagrichain.com/v1/devices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setDevices(result.data.devices || []);
      } catch (error) {
        console.error("Error fetching devices:", error);
      }
    };

    fetchDevices();
  }, []);

  const filteredDevices = devices.filter((device) =>
    device.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#34D399"; // hijau terang
      case "inactive":
        return "#F87171"; // merah terang
      default:
        return "#D1D5DB"; // abu-abu (gray-300)
    }
  };
  

  return (
<div className="MainDash">
  <h1 className="dashboard-title">Dashboard</h1>

  <input
    type="text"
    placeholder="Cari ID device..."
    className="search-input"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <div className="cards-container">
    {filteredDevices.map((device) => (
      <div
        key={device.id}
        className="device-card"
        onClick={() => navigate(`/dashboard/${device.id}`)}
        style={{ backgroundColor: getStatusColor(device.status) }}
      >
        <h3>{device.id}</h3>
        <p>Status: {device.status}</p>
      </div>
    ))}
  </div>
</div>
  );
};

export default MainDash;
