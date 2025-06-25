import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './DeviceDetail.css';

const DeviceDetail = () => {
  const { id } = useParams();
  const [device, setDevice] = useState(null);
  const [localStatus, setLocalStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState('success');
  const [showPopup, setShowPopup] = useState(false);
  const [isOn, setIsOn] = useState(false);
  const [dailyData, setDailyData] = useState({ deviceId: '', usedHoursToday: 0 });
  const [loadingDaily, setLoadingDaily] = useState(true);

  const fetchDevice = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const result = await res.json();
      if (!res.ok || !result.data?.device) throw new Error(result.message || 'Gagal memuat detail perangkat');
      setDevice(result.data.device);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data perangkat');
    } finally {
      setLoading(false);
    }
  };

  const fetchDailyData = async () => {
    const token = localStorage.getItem('accessToken');
    setLoadingDaily(true);
    try {
      const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/daily`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const result = await res.json();

      if (res.status === 400) throw new Error('Permintaan tidak valid (400)');
      if (res.status === 401) throw new Error('Token tidak valid atau sesi kedaluwarsa (401)');
      if (res.status === 404) throw new Error('Perangkat tidak ditemukan (404)');
      if (res.status === 500) throw new Error('Server error (500)');

      if (!res.ok || result.status !== 'success') {
        throw new Error(result.message || 'Gagal ambil data harian');
      }

      const data = result?.data || {};
      const deviceId = data.deviceId || data.deviceid || 'Tidak diketahui';
      const usedHoursToday = typeof data.usedHoursToday === 'number' ? data.usedHoursToday : 0;

      setDailyData({ deviceId, usedHoursToday });
    } catch (err) {
      triggerPopup(err.message || 'Gagal mengambil data harian', 'error');
    } finally {
      setLoadingDaily(false);
    }
  };

  const triggerPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const updateDeviceStatus = async (newStatus) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setLocalStatus(newStatus);
      triggerPopup(`Status berhasil diubah ke ${newStatus}`);
    } catch (err) {
      triggerPopup(`Gagal mengubah status: ${err.message}`, 'error');
    }
  };

  const handleToggle = async (status) => {
    if (status) {
      setIsOn(true);
      await updateDeviceStatus('active');
    } else {
      setIsOn(false);
      await updateDeviceStatus('inactive');
    }
  };

  const handleChangeTopic = async (type) => {
    const token = localStorage.getItem('accessToken');
    const endpoint = type === 'sensor' ? 'mqttsensor' : 'mqttcontrol';
    try {
      const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/${endpoint}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      triggerPopup(`Topik ${type} berhasil diubah`);
    } catch (err) {
      triggerPopup(`Gagal mengubah topik ${type}: ${err.message}`, 'error');
    }
  };

  useEffect(() => {
    if (!id) {
      setError('ID perangkat tidak ditemukan.');
      setLoading(false);
      setLoadingDaily(false);
      return;
    }
    fetchDevice();
    fetchDailyData();
  }, [id]);

  useEffect(() => {
    if (device?.status) {
      setLocalStatus(device.status);
      setIsOn(device.status.toLowerCase() === 'active');
    }
  }, [device]);

  if (loading) return <div className="loading-message">🔄 Memuat data perangkat...</div>;
  if (error) return <div className="error-message">❌ {error}</div>;

  return (
    <div className="device-detail-container">
      <h2>Detail Perangkat Rover</h2>

      {device ? (
        <div className="device-detail-card">
          <div className="detail-item"><strong>ID Perangkat:</strong><div className="detail-value">{device.id}</div></div>
          <div className="detail-item"><strong>Status:</strong><div className={`status-badge ${localStatus ? localStatus.toLowerCase() : 'unknown'}`}>{localStatus || 'Unknown'}</div></div>
          <div className="detail-item"><strong>Rental ID:</strong><div className="detail-value">{device.rental_id || 'Tidak tersedia'}</div></div>
          <div className="detail-item"><strong>Last Issue:</strong><div className="detail-value">{device.last_reported_issue || 'Tidak ada'}</div></div>
          <div className="detail-item"><strong>Last Active:</strong><div className="detail-value">{device.last_active ? new Date(device.last_active).toLocaleString() : 'Tidak tersedia'}</div></div>
          <div className="detail-item"><strong>Sensor Topic:</strong><div className="topic-with-button"><span>{device.sensor_topic}</span><button onClick={() => handleChangeTopic('sensor')}>Change</button></div></div>
          <div className="detail-item"><strong>Control Topic:</strong><div className="topic-with-button"><span>{device.control_topic}</span><button onClick={() => handleChangeTopic('control')}>Change</button></div></div>
          <div className="detail-item"><strong>Created:</strong><div className="detail-value">{device.created_at ? new Date(device.created_at).toLocaleString() : 'Tidak tersedia'}</div></div>
          <div className="detail-item"><strong>Updated:</strong><div className="detail-value">{device.updated_at ? new Date(device.updated_at).toLocaleString() : 'Tidak tersedia'}</div></div>
          <div className="detail-item"><strong>Group ID:</strong><div className="detail-value">{device.group_id || 'Tidak tersedia'}</div></div>
        </div>
      ) : (
        <div>Perangkat tidak ditemukan</div>
      )}

      <div className="toggle-buttons">
        <button className={`on-btn ${isOn ? 'active' : ''}`} onClick={() => handleToggle(true)}>ON</button>
        <button className={`off-btn ${!isOn ? 'active' : ''}`} onClick={() => handleToggle(false)} disabled={!isOn}>OFF</button>
      </div>

      <div className="daily-data">
        <h3>Penggunaan Hari Ini</h3>
        <button onClick={fetchDailyData} className="refresh-daily-button">🔄 Refresh</button>
        {loadingDaily ? (
          <p>Memuat data jam pemakaian...</p>
        ) : (
          <>
            <p><strong>Device ID:</strong> {dailyData.deviceId}</p>
            {dailyData.usedHoursToday === 0 ? (
              <p><strong>Perangkat belum digunakan hari ini.</strong></p>
            ) : (
              <p><strong>Used Hours Today:</strong> {dailyData.usedHoursToday.toFixed(2)} jam</p>
            )}
          </>
        )}
      </div>

      {showPopup && (
        <div className={`notification-popup ${popupType}`}>
          <div className="popup-icon">{popupType === 'error' ? '⚠️' : '✅'}</div>
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
