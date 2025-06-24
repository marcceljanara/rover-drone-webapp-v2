import React, { useState, useEffect, useRef } from 'react';
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
  const [usedHours, setUsedHours] = useState(0);
  const [statusText, setStatusText] = useState('Loading...');
  const [countdown, setCountdown] = useState(null);
  const [savingStatus, setSavingStatus] = useState('');
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [liveUsedTime, setLiveUsedTime] = useState('00.00.00');

  const usageIntervalRef = useRef(null);
  const savingIntervalRef = useRef(null);
  const countdownRef = useRef(null);
  const liveTimerRef = useRef(null);

  const LS_PREFIX = `device-${id}`;

  const triggerPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const formatTime = (hours) => {
    const totalSeconds = Math.floor(hours * 3600);
    const hh = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
    const mm = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
    const ss = String(totalSeconds % 60).padStart(2, '0');
    return `${hh}.${mm}.${ss}`;
  };

  const formatCountdown = (ms) => formatTime(ms / 3600000);

  const startCountdown = (endTimestamp) => {
    clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      const now = Date.now();
      const remaining = endTimestamp - now;
      if (remaining <= 0) {
        clearInterval(countdownRef.current);
        setCountdown(null);
        setStatusText('✅ Ready to ON');
        setIsCoolingDown(false);
        localStorage.removeItem(`${LS_PREFIX}-cooldownEndTime`);
      } else {
        setCountdown(formatCountdown(remaining));
      }
    }, 1000);
  };

  const saveUsedHours = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      setSavingStatus('saving');
      await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/used`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ usedHours: parseFloat(usedHours.toFixed(6)) }),
      });
      setSavingStatus('saved');
      setTimeout(() => setSavingStatus(''), 2000);
    } catch {
      setSavingStatus('');
    }
  };

  const saveCooldownTime = async (timestamp) => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/cooldown`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cooldownEndTime: new Date(timestamp).toISOString() }),
      });
      localStorage.setItem(`${LS_PREFIX}-cooldownEndTime`, timestamp);
    } catch (err) {
      console.error('Gagal menyimpan waktu cooldown:', err);
    }
  };

  const logActivity = async (action) => {
    const token = localStorage.getItem('accessToken');
    try {
      await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/activity-log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, timestamp: new Date().toISOString() }),
      });
    } catch (err) {
      console.error('Gagal menyimpan log aktivitas:', err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const [deviceRes, usageRes] = await Promise.all([
          fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/daily`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const deviceJson = await deviceRes.json();
        const usageJson = await usageRes.json();

        if (!deviceRes.ok) throw new Error(deviceJson.message);
        if (!usageRes.ok || usageJson.status !== 'success') throw new Error('Gagal memuat penggunaan');

        const deviceData = deviceJson.data.device;
        const backendUsedHours = parseFloat(usageJson.data.usedHoursToday || 0);
        const savedLocalUsed = parseFloat(localStorage.getItem(`${LS_PREFIX}-usedHours`) || '0');
        const lastTimestamp = localStorage.getItem(`${LS_PREFIX}-lastUsedTimestamp`);
        const wasOn = localStorage.getItem(`${LS_PREFIX}-wasOn`) === 'true';

        let newUsed = Math.max(savedLocalUsed, backendUsedHours);
        if (wasOn && lastTimestamp) {
          const delta = (Date.now() - parseInt(lastTimestamp)) / 3600000;
          newUsed += delta;
        }

        if (newUsed > 4) newUsed = 4.0;

        const cooldownEndFromBackend = usageJson.data.cooldownEndTime
          ? new Date(usageJson.data.cooldownEndTime).getTime()
          : null;
        const cooldownEndFromLocal = parseInt(localStorage.getItem(`${LS_PREFIX}-cooldownEndTime`) || '0');
        const finalCooldownEnd = Math.max(cooldownEndFromBackend || 0, cooldownEndFromLocal || 0);

        setDevice(deviceData);
        setUsedHours(newUsed);
        setLiveUsedTime(formatTime(newUsed));
        localStorage.setItem(`${LS_PREFIX}-usedHours`, newUsed.toFixed(6));
        setLocalStatus(deviceData.status);

        if (finalCooldownEnd && finalCooldownEnd > Date.now()) {
          setIsCoolingDown(true);
          setIsOn(false);
          setStatusText('🛑 Cooldown (1 jam)');
          startCountdown(finalCooldownEnd);
        } else if (newUsed >= 4) {
          const cooldownEnd = Date.now() + 3600000;
          await saveCooldownTime(cooldownEnd);
          setIsCoolingDown(true);
          setIsOn(false);
          setStatusText('🛑 Cooldown (1 jam)');
          startCountdown(cooldownEnd);
        } else {
          const statusLower = deviceData.status?.toLowerCase() || '';
          setIsOn(statusLower === 'active');
          setStatusText(statusLower === 'active' ? '✅ Active' : '⚪ Inactive');
        }
      } catch (err) {
        setError(err.message);
        setStatusText('❌ Error memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      clearInterval(usageIntervalRef.current);
      clearInterval(savingIntervalRef.current);
      clearInterval(countdownRef.current);
      clearInterval(liveTimerRef.current);
    };
  }, [id]);

  useEffect(() => {
    clearInterval(liveTimerRef.current);
    if (isOn && !isCoolingDown) {
      const start = Date.now();
      liveTimerRef.current = setInterval(() => {
        const now = Date.now();
        const runtime = (now - start) / 3600000;
        setLiveUsedTime(formatTime(usedHours + runtime));
      }, 1000);
    } else {
      setLiveUsedTime(formatTime(usedHours));
    }

    return () => clearInterval(liveTimerRef.current);
  }, [isOn, isCoolingDown, usedHours]);

  useEffect(() => {
    if (isOn && !isCoolingDown && usageIntervalRef.current === null) {
      const now = Date.now();
      localStorage.setItem(`${LS_PREFIX}-lastUsedTimestamp`, now.toString());
      localStorage.setItem(`${LS_PREFIX}-wasOn`, 'true');

      usageIntervalRef.current = setInterval(() => {
        setUsedHours(prev => {
          const next = parseFloat((prev + 1 / 3600).toFixed(6));
          if (next >= 4) {
            clearInterval(usageIntervalRef.current);
            usageIntervalRef.current = null;
            setIsOn(false);
            setStatusText('🛑 Cooldown (1 jam)');
            const cooldownEnd = Date.now() + 3600000;
            saveCooldownTime(cooldownEnd);
            startCountdown(cooldownEnd);
            logActivity('OFF');
            localStorage.setItem(`${LS_PREFIX}-cooldownEndTime`, cooldownEnd);
            return 4.0;
          }
          localStorage.setItem(`${LS_PREFIX}-usedHours`, next.toFixed(6));
          return next;
        });
      }, 1000);

      savingIntervalRef.current = setInterval(saveUsedHours, 10000);
    }

    if (!isOn || isCoolingDown) {
      clearInterval(usageIntervalRef.current);
      usageIntervalRef.current = null;
      clearInterval(savingIntervalRef.current);
      savingIntervalRef.current = null;
      localStorage.setItem(`${LS_PREFIX}-wasOn`, 'false');
    }

    return () => {
      clearInterval(usageIntervalRef.current);
      usageIntervalRef.current = null;
      clearInterval(savingIntervalRef.current);
      savingIntervalRef.current = null;
    };
  }, [isOn, isCoolingDown]);

  const handleToggle = async (status) => {
    if (isCoolingDown || (usedHours >= 4 && status)) {
      triggerPopup('Perangkat sedang cooldown atau waktu habis. Tunggu 1 jam.', 'error');
      return;
    }

    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: status ? 'active' : 'inactive' }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setIsOn(status);
      setLocalStatus(status ? 'Active' : 'Inactive');
      setStatusText(status ? '✅ Active' : '⚪ Inactive');
      triggerPopup(`Perangkat ${status ? 'dinyalakan' : 'dimatikan'}`);
      await logActivity(status ? 'ON' : 'OFF');

    } catch (err) {
      triggerPopup(`Gagal mengubah status: ${err.message}`, 'error');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="device-detail-container">
      <h2>Detail Perangkat Rover</h2>
      {device ? (
        <div className="device-detail-card">
          <div className="detail-item"><strong>ID Perangkat:</strong> {device.id}</div>
          <div className="detail-item"><strong>Status:</strong> <span className={`status-badge ${localStatus?.toLowerCase()}`}>{localStatus}</span></div>
          <div className="detail-item"><strong>Rental ID:</strong> {device.rental_id || 'Tidak tersedia'}</div>
          <div className="detail-item"><strong>Last Issue:</strong> {device.last_reported_issue || 'Tidak ada'}</div>
          <div className="detail-item"><strong>Last Active:</strong> {device.last_active || 'Tidak tersedia'}</div>

          <div className="detail-item topic-with-button">
            <strong>Sensor Topic:</strong>
            <div className="detail-value">{device.sensor_topic || 'Tidak tersedia'}</div>
            <button>Change</button>
          </div>

          <div className="detail-item topic-with-button">
            <strong>Control Topic:</strong>
            <div className="detail-value">{device.control_topic || 'Tidak tersedia'}</div>
            <button>Change</button>
          </div>
        </div>
      ) : <div>Perangkat tidak ditemukan</div>}

      <div className="toggle-buttons">
        <button className={`on-btn ${isOn ? 'active' : ''}`} onClick={() => handleToggle(true)}>ON</button>
        <button className={`off-btn ${!isOn ? 'active' : ''}`} onClick={() => handleToggle(false)}>OFF</button>
      </div>

      <div className="timer-box">
        <p><strong>Used Hours:</strong> {liveUsedTime}</p>
        <p><strong>Status:</strong> {statusText}</p>
        {countdown && <p><strong>Cooldown:</strong> {countdown}</p>}
        <progress value={usedHours} max="4"></progress>
        <div className={`saving-status ${savingStatus}`}></div>
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
