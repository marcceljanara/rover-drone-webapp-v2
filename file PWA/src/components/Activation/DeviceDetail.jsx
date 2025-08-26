/* eslint-disable react-hooks/exhaustive-deps */
// ...import tetap
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DeviceDetail.css';
import Sidebar from '../Sidebar';
import RightSide from '../RightSide/RightSide';

const DeviceDetail = () => {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success'); // success atau error
  const [showPopup, setShowPopup] = useState(false);

  const triggerPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000); // Popup muncul selama 3 detik
  };

  const fetchDeviceDetails = async () => {

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/devices/${id}`, {
        method: 'GET',
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal memuat detail perangkat');
      }

      const result = await response.json();
      setDevice(result.data.device);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeviceDetails();
  }, [id]);

  const handleToggle = async (status) => {
    const endpoint = `${process.env.REACT_APP_API_URL}/v1/devices/${id}/control`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: status ? 'on' : 'off',
          command: 'power',
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Gagal mengontrol perangkat');
      }

      setIsOn(status);
      triggerPopup(`Perangkat berhasil dinyalakan: ${status ? 'ON' : 'OFF'}`, 'success');
      await fetchDeviceDetails();
    } catch (error) {
      triggerPopup(`Error: ${error.message}`, 'error');
    }
  };

  const handleChangeTopic = async (type) => {
    const endpoint = `${process.env.REACT_APP_API_URL}/v1/devices/${id}/${type === 'sensor' ? 'mqttsensor' : 'mqttcontrol'}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Gagal mengubah ${type} topic`);
      }

      triggerPopup(result.message, 'success');
      fetchDeviceDetails();
    } catch (error) {
      triggerPopup(`Error: ${error.message}`, 'error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="AppGlass">
      <Sidebar />
      <div className="device-detail-container">
        <h2>Detail Perangkat Rover</h2>

        {device ? (
          <div className="device-detail-card">
            {/* Informasi perangkat */}
            <div className="detail-item"><strong>ID Perangkat:</strong><div className="detail-value">{device.id}</div></div>
            <div className="detail-item"><strong>Status:</strong><div className={`status-badge ${device.status?.toLowerCase() || 'unknown'}`}>{device.status}</div></div>
            <div className="detail-item"><strong>Rental ID:</strong><div className="detail-value">{device.rental_id || 'Tidak tersedia'}</div></div>
            <div className="detail-item"><strong>Last Reported Issue:</strong><div className="detail-value">{device.last_reported_issue || 'Tidak ada'}</div></div>
            <div className="detail-item"><strong>Last Active:</strong><div className="detail-value">{device.last_active}</div></div>
            <div className="detail-item">
              <strong>Sensor Topic:</strong>
              <div className="topic-with-button">
                <span>{device.sensor_topic}</span>
                <button onClick={() => handleChangeTopic('sensor')}>Change</button>
              </div>
            </div>
            <div className="detail-item">
              <strong>Control Topic:</strong>
              <div className="topic-with-button">
                <span>{device.control_topic}</span>
                <button onClick={() => handleChangeTopic('control')}>Change</button>
              </div>
            </div>
            <div className="detail-item"><strong>Created At:</strong><div className="detail-value">{new Date(device.created_at).toLocaleString()}</div></div>
          </div>
        ) : (
          <div>Perangkat tidak ditemukan</div>
        )}

        {/* Tombol ON/OFF */}
        <div className="toggle-buttons">
          <button className={`on-btn ${isOn ? 'active' : ''}`} onClick={() => handleToggle(true)}>ON</button>
          <button className={`off-btn ${!isOn ? 'active' : ''}`} onClick={() => handleToggle(false)}>OFF</button>
        </div>

        {/* Notifikasi pop-up */}
        {showPopup && (
          <div className={`notification-popup ${popupType === 'error' ? 'error' : ''}`}>
            <div className="popup-icon">
              {popupType === 'error' ? '⚠️' : '✅'}
            </div>
            <div className="popup-content">
              <strong>{popupType === 'error' ? 'Gagal' : 'Berhasil'}:</strong>
              <span>{popupMessage.replace('Error: ', '')}</span>
            </div>
          </div>
        )}
      </div>
      <RightSide />
    </div>
  );
};

export default DeviceDetail;
