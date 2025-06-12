import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DeviceDetail.css';

const DeviceDetail = () => {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [isOn, setIsOn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const [showPopup, setShowPopup] = useState(false);

  const triggerPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  const fetchDeviceDetails = async () => {
    const accessToken = localStorage.getItem('accessToken');

    try {
      const response = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
    const accessToken = localStorage.getItem('accessToken');
    const endpoint = `https://dev-api.xsmartagrichain.com/v1/devices/${id}/control`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
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
    const accessToken = localStorage.getItem('accessToken');
    const endpoint = `https://dev-api.xsmartagrichain.com/v1/devices/${id}/${type === 'sensor' ? 'mqttsensor' : 'mqttcontrol'}`;

    try {
      const response = await fetch(endpoint, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
    <div className="device-detail-container">
      <h2>Detail Perangkat Rover</h2>

      {device ? (
        <div className="device-detail-card">
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

      <div className="toggle-buttons">
        <button className={`on-btn ${isOn ? 'active' : ''}`} onClick={() => handleToggle(true)}>ON</button>
        <button className={`off-btn ${!isOn ? 'active' : ''}`} onClick={() => handleToggle(false)}>OFF</button>
      </div>

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
  );
};

export default DeviceDetail;
