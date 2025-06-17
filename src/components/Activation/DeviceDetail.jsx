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
  const [onClickCount, setOnClickCount] = useState(0);
  const [rightBoxes, setRightBoxes] = useState([true, true, true, true]);
  const [leftBoxes, setLeftBoxes] = useState([true, true, true, true]);
  const [rightIndex, setRightIndex] = useState(3);
  const [leftIndex, setLeftIndex] = useState(3);
  const [step, setStep] = useState('idle');
  const [showTinyBoxes, setShowTinyBoxes] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [isCountdown, setIsCountdown] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      const token = localStorage.getItem('accessToken');
      try {
        const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.message || 'Gagal memuat detail perangkat');
        setDevice(result.data.device);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDevice();
  }, [id]);

  useEffect(() => {
    if (device?.status) setLocalStatus(device.status);
  }, [device]);

  const triggerPopup = (message, type = 'success') => {
    setPopupMessage(message);
    setPopupType(type);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 3000);
  };

  const handleChangeTopic = async (type) => {
    const token = localStorage.getItem('accessToken');
    const endpoint = type === 'sensor' ? 'mqttsensor' : 'mqttcontrol';
    try {
      const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/devices/${id}/${endpoint}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      triggerPopup(result.message);
    } catch (err) {
      triggerPopup(`Error: ${err.message}`, 'error');
    }
  };

  const handleToggle = (status) => {
    if (isCountdown) return;

    if (status) {
      const nextCount = onClickCount + 1;
      setOnClickCount(nextCount);
      setShowTinyBoxes(true);

      if (nextCount === 1) {
        setRightBoxes([true, true, true, true]);
        setRightIndex(3);
        setStep('right');
        setIsOn(true);
        setLocalStatus('Active');
        triggerPopup('Perangkat dinyalakan (ON)');
      } else if (nextCount === 2) {
        setLeftBoxes([true, true, true, true]);
        setLeftIndex(3);
        setStep('left');
        setIsOn(true);
        setLocalStatus('Active');
        triggerPopup('Perangkat dinyalakan ulang (Box kiri)');
      }
    } else {
      resetBoxes();
      setLocalStatus('Inactive');
      triggerPopup('Perangkat dimatikan (OFF)');
    }
  };

  const resetBoxes = () => {
    setIsOn(false);
    setOnClickCount(0);
    setStep('idle');
    setShowTinyBoxes(false);
    setRightBoxes([false, false, false, false]);
    setLeftBoxes([false, false, false, false]);
  };

  useEffect(() => {
    if (step === 'right' && rightIndex >= 0) {
      const timer = setInterval(() => {
        setRightBoxes((prev) => {
          const copy = [...prev];
          copy[rightIndex] = false;
          return copy;
        });
        setRightIndex((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }

    if (step === 'right' && rightIndex < 0) {
      setStep('countdown');
      setCountdown(10);
      setIsCountdown(true);
      setLocalStatus('Countdown');
    }
  }, [step, rightIndex]);

  useEffect(() => {
    if (step === 'countdown' && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (step === 'countdown' && countdown === 0) {
      setIsCountdown(false);
      if (onClickCount === 1) {
        setStep('idle');
        setLocalStatus('Inactive');
      } else if (onClickCount === 2) {
        setStep('countdown2');
        setCountdown(10);
        setIsCountdown(true);
        setLocalStatus('Countdown');
      }
    }
  }, [countdown, step, onClickCount]);

  useEffect(() => {
    if (step === 'left' && leftIndex >= 0 && onClickCount === 2) {
      const timer = setInterval(() => {
        setLeftBoxes((prev) => {
          const copy = [...prev];
          copy[leftIndex] = false;
          return copy;
        });
        setLeftIndex((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }

    if (step === 'left' && leftIndex < 0 && onClickCount === 2) {
      setStep('countdown');
      setCountdown(10);
      setIsCountdown(true);
      setLocalStatus('Countdown');
    }
  }, [step, leftIndex, onClickCount]);

  useEffect(() => {
    if (step === 'countdown2' && countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (step === 'countdown2' && countdown === 0) {
      setIsCountdown(false);
      setLocalStatus('Inactive');
      resetBoxes(); // reset untuk ulang siklus
    }
  }, [countdown, step]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="device-detail-container">
      <h2>Detail Perangkat Rover</h2>

      {device ? (
        <div className="device-detail-card">
          <div className="detail-item"><strong>ID Perangkat:</strong><div className="detail-value">{device.id}</div></div>
          <div className="detail-item">
            <strong>Status:</strong>
            <div className={`status-badge ${localStatus.toLowerCase()}`}>{localStatus}</div>
          </div>
          <div className="detail-item"><strong>Rental ID:</strong><div className="detail-value">{device.rental_id || 'Tidak tersedia'}</div></div>
          <div className="detail-item"><strong>Last Issue:</strong><div className="detail-value">{device.last_reported_issue || 'Tidak ada'}</div></div>
          <div className="detail-item"><strong>Last Active:</strong><div className="detail-value">{device.last_active || 'Tidak tersedia'}</div></div>
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
          <div className="detail-item"><strong>Created:</strong><div className="detail-value">{device.created_at ? new Date(device.created_at).toLocaleString() : 'Tidak tersedia'}</div></div>
        </div>
      ) : (
        <div>Perangkat tidak ditemukan</div>
      )}

      <div className="tiny-box-wrapper">
        <div className="tiny-box-group left">
          {showTinyBoxes && leftBoxes.map((v, i) => v && <div key={`l-${i}`} className="tiny-box red" />)}
        </div>

        {isCountdown && (
          <div className="countdown-timer">
            <h3>{countdown}s</h3>
          </div>
        )}

        <div className="tiny-box-group right">
          {showTinyBoxes && rightBoxes.map((v, i) => v && <div key={`r-${i}`} className="tiny-box red" />)}
        </div>
      </div>

      <div className="toggle-buttons">
        <button className={`on-btn ${isOn ? 'active' : ''}`} onClick={() => handleToggle(true)} disabled={isCountdown}>
          ON
        </button>
        <button className={`off-btn ${!isOn ? 'active' : ''}`} onClick={() => handleToggle(false)} disabled={!isOn || isCountdown}>
          OFF
        </button>
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
