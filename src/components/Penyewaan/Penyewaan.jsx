import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './Penyewaan.css';
import roverImage from '../../imgs/rover2.png';
import lokasiIcon from '../../imgs/Icon-Lokasi.png';

const DISCOUNT_RATES = { 6: 0.05, 12: 0.1, 24: 0.15, 36: 0.2 };
const DAILY_RATE = 100000;

const calculateRentalCost = (interval, sensorTotal = 0) => {
  const rentalDays = interval * 30;
  const baseCost = DAILY_RATE * rentalDays;
  const discountRate = DISCOUNT_RATES[interval] || 0;
  const discount = baseCost * discountRate;
  const finalCost = baseCost - discount + sensorTotal;

  return {
    rentalDays,
    baseCost,
    discount,
    finalCost,
    discountPercentage: discountRate * 100,
  };
};

const Penyewaan = () => {
  const [duration, setDuration] = useState(null);
  const [notification, setNotification] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceStatus, setDeviceStatus] = useState({ loading: true, value: null, error: null });
  const [availableSensors, setAvailableSensors] = useState([]);
  const [checkboxes, setCheckboxes] = useState({});
  const [showLokasiForm, setShowLokasiForm] = useState(false);
  const [ongkir, setOngkir] = useState(0);

  const [lokasiForm, setLokasiForm] = useState({
    namaPenerima: '', noHp: '', alamatLengkap: '',
    provinsi: '', kabupatenKota: '', kecamatan: '', kelurahan: '', kodePos: ''
  });

  const [provinces, setProvinces] = useState([]);
  const [kabupaten, setKabupaten] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [kelurahan, setKelurahan] = useState([]);
  const [provId, setProvId] = useState('');
  const [kabId, setKabId] = useState('');
  const [kecId, setKecId] = useState('');

  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  const sensorTotal = useMemo(() => availableSensors.reduce((total, sensor) => (
    checkboxes[sensor.id] ? total + sensor.cost : total
  ), 0), [checkboxes, availableSensors]);

  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => setShowNotification(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const deviceRes = await fetch('https://dev-api.xsmartagrichain.com/v1/devices?scope=available', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const deviceData = await deviceRes.json();
        setDeviceStatus({ loading: false, value: deviceData.data.devices.length, error: null });
      } catch {
        setDeviceStatus({ loading: false, value: null, error: 'Gagal memuat perangkat' });
      }

      try {
        const sensorRes = await fetch('https://dev-api.xsmartagrichain.com/v1/sensors/available', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const sensorData = await sensorRes.json();
        const sensors = sensorData?.data?.sensors || [];
        setAvailableSensors(sensors);
        const initial = Object.fromEntries(sensors.map(sensor => [sensor.id, false]));
        setCheckboxes(initial);
      } catch (err) {
        console.error('Gagal memuat sensor:', err);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    fetch("https://ibnux.github.io/data-indonesia/provinsi.json")
      .then((res) => res.json())
      .then(setProvinces)
      .catch(() => alert("Gagal memuat provinsi"));
  }, []);

  useEffect(() => {
    if (!provId) return;
    fetch(`https://ibnux.github.io/data-indonesia/kabupaten/${provId}.json`)
      .then((r) => r.json())
      .then(setKabupaten)
      .catch(() => alert("Gagal memuat kabupaten/kota"));
    setKabId(''); setKecId(''); setKecamatan([]); setKelurahan([]);
    setLokasiForm((f) => ({ ...f, kabupatenKota: '', kecamatan: '', kelurahan: '' }));
  }, [provId]);

  useEffect(() => {
    if (!kabId) return;
    fetch(`https://ibnux.github.io/data-indonesia/kecamatan/${kabId}.json`)
      .then((r) => r.json())
      .then(setKecamatan)
      .catch(() => alert("Gagal memuat kecamatan"));
    setKecId(''); setKelurahan([]);
    setLokasiForm((f) => ({ ...f, kecamatan: '', kelurahan: '' }));
  }, [kabId]);

  useEffect(() => {
    if (!kecId) return;
    fetch(`https://ibnux.github.io/data-indonesia/kelurahan/${kecId}.json`)
      .then((r) => r.json())
      .then(setKelurahan)
      .catch(() => alert("Gagal memuat kelurahan"));
    setLokasiForm((f) => ({ ...f, kelurahan: '' }));
  }, [kecId]);

  const handleCheckboxChange = (id) => setCheckboxes(prev => ({ ...prev, [id]: !prev[id] }));
  const handlePilih = (dur) => setDuration(dur);
  const handleIconClick = () => setShowLokasiForm(prev => !prev);
  const handleCekOngkir = () => setOngkir(30000 + Object.values(checkboxes).filter(Boolean).length * 5000);
  const handleLokasiChange = (e) => setLokasiForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSewa = async () => {
    if (![6, 12, 24, 36].includes(duration)) {
      setNotification('Durasi sewa tidak valid.'); setShowNotification(true); return;
    }
    if (!token) {
      setNotification('Token tidak tersedia. Silakan login terlebih dahulu.'); setShowNotification(true); return;
    }
    setLoading(true);
    try {
      const response = await fetch('https://dev-api.xsmartagrichain.com/v1/rentals', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval: duration }),
      });
      const data = await response.json();
      setNotification(data?.message || (response.ok ? 'Berhasil menyewa perangkat!' : 'Gagal menyewa.'));
      if (response.ok) setTimeout(() => navigate('/riwayat-sewa'), 2000);
    } catch (error) {
      setNotification(error.message || 'Terjadi kesalahan saat menyewa.');
    } finally {
      setLoading(false); setShowNotification(true);
    }
  };

  return (
    <div className="penyewaan-container">
      <button className="back-button" onClick={() => navigate(-1)}>⬅ Kembali</button>

      <h1>“SAATNYA LAHAN ANDA DIAWASI OLEH TEKNOLOGI MASA DEPAN!” 🚀</h1>
      <h2>“BOSAN RUGI? CAPEK KERJA MANUAL? BANGKITKAN PRODUKTIVITAS DENGAN DRONE ROVER KAMI!”</h2>
      <p>Lupakan kerja manual dan hasil yang tak optimal. Kini hadir DRONE ROVER CANGGIH!</p>

      <div className="image-container">
        <img src={roverImage} alt="Drone Rover" className="rover-image" />
      </div>

      <h3>Formulir Penyewaan</h3>

      <div className="device-status">
        <span className="device-label">📦 Jumlah Perangkat Tersedia:</span>
        <span className="device-value">
          {deviceStatus.loading ? 'Memuat...' : deviceStatus.error || deviceStatus.value}
        </span>
      </div>

      <div className="lokasi-checkbox-row">
        <div className="checkbox-container">
          {availableSensors.length === 0 ? (
            <p><i>Memuat sensor...</i></p>
          ) : (
            availableSensors.map(sensor => (
              <label key={sensor.id}>
                <input
                  type="checkbox"
                  checked={checkboxes[sensor.id] || false}
                  onChange={() => handleCheckboxChange(sensor.id)}
                />
                {sensor.id} (Rp{sensor.cost.toLocaleString('id-ID')})
              </label>
            ))
          )}
        </div>
        <img
          src={lokasiIcon}
          alt="Lokasi"
          className={`lokasi-icon ${showLokasiForm ? 'active' : ''}`}
          onClick={handleIconClick}
        />
      </div>

      {showLokasiForm && (
        <div className="lokasi-box-container">
          {["namaPenerima", "noHp", "alamatLengkap"].map((field) => (
            <div className="lokasi-section" key={field}>
              <label htmlFor={field}>{field}</label>
              <input
                type="text"
                id={field}
                name={field}
                value={lokasiForm[field]}
                onChange={handleLokasiChange}
                placeholder={`Masukkan ${field}`}
              />
            </div>
          ))}

          <div className="lokasi-section">
            <label>Provinsi</label>
            <select value={provId} onChange={(e) => {
              const id = e.target.value;
              setProvId(id);
              const p = provinces.find((v) => v.id === id);
              setLokasiForm(f => ({ ...f, provinsi: p ? p.nama : '' }));
            }}>
              <option value="">-- Pilih Provinsi --</option>
              {provinces.map((p) => <option key={p.id} value={p.id}>{p.nama}</option>)}
            </select>
          </div>

          <div className="lokasi-section">
            <label>Kabupaten/Kota</label>
            <select value={kabId} onChange={(e) => {
              const id = e.target.value;
              setKabId(id);
              const k = kabupaten.find((v) => v.id === id);
              setLokasiForm(f => ({ ...f, kabupatenKota: k ? k.nama : '' }));
            }} disabled={!kabupaten.length}>
              <option value="">-- Pilih Kabupaten/Kota --</option>
              {kabupaten.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
            </select>
          </div>

          <div className="lokasi-section">
            <label>Kecamatan</label>
            <select value={kecId} onChange={(e) => {
              const id = e.target.value;
              setKecId(id);
              const kc = kecamatan.find((v) => v.id === id);
              setLokasiForm(f => ({ ...f, kecamatan: kc ? kc.nama : '' }));
            }} disabled={!kecamatan.length}>
              <option value="">-- Pilih Kecamatan --</option>
              {kecamatan.map((kc) => <option key={kc.id} value={kc.id}>{kc.nama}</option>)}
            </select>
          </div>

          <div className="lokasi-section">
            <label>Kelurahan</label>
            <select value={lokasiForm.kelurahan} onChange={(e) => setLokasiForm(f => ({ ...f, kelurahan: e.target.value }))} disabled={!kelurahan.length}>
              <option value="">-- Pilih Kelurahan --</option>
              {kelurahan.map((kel) => <option key={kel.id} value={kel.nama}>{kel.nama}</option>)}
            </select>
          </div>

          <div className="lokasi-section">
            <label>Kode Pos</label>
            <input type="text" name="kodePos" value={lokasiForm.kodePos} onChange={handleLokasiChange} placeholder="Masukkan kode pos" />
          </div>

          <button className="cek-ongkir-button" onClick={handleCekOngkir}>Cek Ongkir</button>
          <div className="ongkir-info">Estimasi Ongkir: <strong>Rp{ongkir.toLocaleString('id-ID')}</strong></div>
        </div>
      )}

      <div className="form-container">
        <div className="table-responsive">
          <table className="rental-table">
            <thead>
              <tr>
                <th>Durasi</th><th>Harga Total</th><th>Harga/Hari</th><th>Diskon (%)</th><th>Diskon (Rp)</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {[6, 12, 24, 36].map((dur) => {
                const { finalCost, rentalDays, discount, discountPercentage } = calculateRentalCost(dur, sensorTotal);
                const daily = (finalCost / rentalDays).toFixed(2);
                return (
                  <tr key={dur}>
                    <td>{dur} Bulan</td>
                    <td>Rp{finalCost.toLocaleString('id-ID')}</td>
                    <td>Rp{Number(daily).toLocaleString('id-ID')}</td>
                    <td>{discountPercentage}%</td>
                    <td>Rp{discount.toLocaleString('id-ID')}</td>
                    <td>
                      <button className={`sewa-button ${duration === dur ? 'selected' : ''}`} onClick={() => handlePilih(dur)}>Pilih</button>
                    </td>
                  </tr>
                );
              })}
              {duration && (
                <tr className="total-row">
                  <td colSpan="5"><strong>Total Keseluruhan</strong></td>
                  <td><strong>Rp{(calculateRentalCost(duration, sensorTotal).finalCost + ongkir).toLocaleString('id-ID')}</strong></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button className={`sewa-button ${!duration || loading ? 'disabled' : ''}`} disabled={!duration || loading} onClick={handleSewa}>
          {loading ? <span className="spinner" /> : 'Sewa'}
        </button>
      </div>

      {showNotification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default Penyewaan;
