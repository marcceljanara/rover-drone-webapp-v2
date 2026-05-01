// src/components/Addresses/Addresses.jsx
import React, { useState, useEffect, useCallback } from "react";
import { UilPlus, UilTimes, UilEye, UilPen, UilTrashAlt, UilMapMarker, UilCheckCircle, UilExclamationTriangle } from "@iconscout/react-unicons";
import "./Addresses.css";

const EMPTY = {
  namaPenerima: "",
  noHp: "",
  alamatLengkap: "",
  provinsi: "",
  kabupatenKota: "",
  kecamatan: "",
  kelurahan: "",
  kodePos: "",
  isDefault: false,
};

const Addresses = () => {
  /* ---------- State ---------- */
  const [addresses, setAddresses]     = useState([]);
  const [showForm, setShowForm]       = useState(false);
  const [form, setForm]               = useState(EMPTY);
  const [loading, setLoading]         = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [detail, setDetail]           = useState(null);
  const [showDetail, setShowDetail]   = useState(false);
  const [editId, setEditId]           = useState(null);
  const [deleteId, setDeleteId]       = useState(null);

  /* ---------- Notification ---------- */
  const [notification, setNotification] = useState(null); // { message, type: 'success'|'error' }

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  /* ---------- Data wilayah ---------- */
  const [provinces, setProvinces]   = useState([]);
  const [kabupaten, setKabupaten]   = useState([]);
  const [kecamatan, setKecamatan]   = useState([]);
  const [kelurahan, setKelurahan]   = useState([]);
  const [provId, setProvId]         = useState("");
  const [kabId, setKabId]           = useState("");
  const [kecId, setKecId]           = useState("");

  /* ---------- Fetch alamat ---------- */
  const fetchAddresses = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/users/addresses`,
        { headers: { "Content-Type": "application/json" }, credentials: "include" }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat alamat");
      setAddresses(data.data.addresses || []);
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setFetchLoading(false);
    }
  }, []);

  /* ---------- Fetch detail alamat ---------- */
  const fetchAddressDetail = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/users/addresses/${id}`,
        { credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memuat detail alamat");
      setDetail(data.data.address);
      setShowDetail(true);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  useEffect(() => { fetchAddresses(); }, [fetchAddresses]);

  /* ---------- Provinsi ---------- */
  useEffect(() => {
    fetch("https://ibnux.github.io/data-indonesia/provinsi.json")
      .then((r) => r.json())
      .then(setProvinces)
      .catch(() => showNotification("Tidak bisa memuat data provinsi", "error"));
  }, []);

  /* ---------- Cascade wilayah ---------- */
  useEffect(() => {
    if (!provId) return;
    fetch(`https://ibnux.github.io/data-indonesia/kabupaten/${provId}.json`)
      .then((r) => r.json())
      .then(setKabupaten)
      .catch(() => showNotification("Gagal memuat kabupaten/kota", "error"));
    setKabId(""); setKecId("");
    setKecamatan([]); setKelurahan([]);
    setForm((f) => ({ ...f, kabupatenKota: "", kecamatan: "", kelurahan: "", kodePos: "" }));
  }, [provId]);

  useEffect(() => {
    if (!kabId) return;
    fetch(`https://ibnux.github.io/data-indonesia/kecamatan/${kabId}.json`)
      .then((r) => r.json())
      .then(setKecamatan)
      .catch(() => showNotification("Gagal memuat kecamatan", "error"));
    setKecId(""); setKelurahan([]);
    setForm((f) => ({ ...f, kecamatan: "", kelurahan: "", kodePos: "" }));
  }, [kabId]);

  useEffect(() => {
    if (!kecId) return;
    fetch(`https://ibnux.github.io/data-indonesia/kelurahan/${kecId}.json`)
      .then((r) => r.json())
      .then(setKelurahan)
      .catch(() => showNotification("Gagal memuat kelurahan", "error"));
    setForm((f) => ({ ...f, kelurahan: "" }));
  }, [kecId]);

  /* ---------- Form handlers ---------- */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const resetForm = () => {
    setShowForm(false);
    setForm(EMPTY);
    setEditId(null);
    setProvId(""); setKabId(""); setKecId("");
    setKabupaten([]); setKecamatan([]); setKelurahan([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const method = editId ? "PUT" : "POST";
      const url = editId
        ? `${process.env.REACT_APP_API_URL}/v1/users/addresses/${editId}`
        : `${process.env.REACT_APP_API_URL}/v1/users/addresses`;

      const res = await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menyimpan alamat");

      showNotification(data.message || (editId ? "Alamat berhasil diperbarui." : "Alamat berhasil disimpan."));
      await fetchAddresses();
      resetForm();
    } catch (err) {
      showNotification(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  /* ---------- Set default ---------- */
  const setAsDefault = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/users/addresses/${id}`,
        { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal memperbarui default");
      showNotification(data.message || "Alamat berhasil dijadikan default.");
      await fetchAddresses();
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  /* ---------- Hapus ---------- */
  const handleDeleteAddress = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}/v1/users/addresses/${deleteId}`,
        { method: "DELETE", credentials: "include", headers: { "Content-Type": "application/json" } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Gagal menghapus alamat");
      showNotification(data.message || "Alamat berhasil dihapus.");
      await fetchAddresses();
      setDeleteId(null);
    } catch (err) {
      showNotification(err.message, "error");
    }
  };

  /* ---------- JSX ---------- */
  return (
    <div className="addresses-page">

      {/* ===== Notification Toast ===== */}
      {notification && (
        <div className={`addr-notification addr-notification--${notification.type}`} role="alert">
          {notification.type === "success"
            ? <UilCheckCircle size="18" />
            : <UilExclamationTriangle size="18" />}
          <span>{notification.message}</span>
          <button className="addr-notif-close" onClick={() => setNotification(null)}>
            <UilTimes size="14" />
          </button>
        </div>
      )}

      {/* ===== Header ===== */}
      <div className="addresses-header">
        <div className="addresses-header__title">
          <UilMapMarker size="24" />
          <div>
            <h2>Alamat Pengiriman</h2>
            <p>Kelola alamat penerima untuk keperluan pengiriman</p>
          </div>
        </div>
        <button className="add-address-btn" onClick={() => { resetForm(); setShowForm(true); }}>
          <UilPlus size="18" /> Tambah Alamat
        </button>
      </div>

      {/* ===== Form Tambah/Edit ===== */}
      {showForm && (
        <div className="address-form-card">
          <div className="address-form-card__header">
            <h3>{editId ? "Edit Alamat" : "Tambah Alamat Baru"}</h3>
            <button className="form-close-btn" onClick={resetForm} aria-label="Tutup form">
              <UilTimes size="18" />
            </button>
          </div>

          <form className="address-form" onSubmit={handleSubmit}>
            <div className="form-grid">
              {[
                ["namaPenerima", "Nama Penerima", "text", "Nama lengkap penerima"],
                ["noHp",         "Nomor HP",      "tel",  "Contoh: 08123456789"],
              ].map(([k, l, t, ph]) => (
                <div className="form-row" key={k}>
                  <label htmlFor={`addr-${k}`}>{l}</label>
                  <input
                    id={`addr-${k}`}
                    name={k}
                    type={t}
                    value={form[k]}
                    onChange={handleChange}
                    placeholder={ph}
                    required
                  />
                </div>
              ))}
            </div>

            <div className="form-row form-row--full">
              <label htmlFor="addr-alamat">Alamat Lengkap</label>
              <textarea
                id="addr-alamat"
                name="alamatLengkap"
                value={form.alamatLengkap}
                onChange={handleChange}
                placeholder="Nama jalan, nomor rumah, RT/RW, dll."
                rows={3}
                required
              />
            </div>

            <div className="form-grid">
              {/* Provinsi */}
              <div className="form-row">
                <label htmlFor="addr-provinsi">Provinsi</label>
                <select
                  id="addr-provinsi"
                  value={provId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setProvId(id);
                    const p = provinces.find((v) => v.id === id);
                    setForm((f) => ({ ...f, provinsi: p ? p.nama : "" }));
                  }}
                  required
                >
                  <option value="">-- Pilih Provinsi --</option>
                  {provinces.map((p) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </div>

              {/* Kabupaten */}
              <div className="form-row">
                <label htmlFor="addr-kabupaten">Kabupaten / Kota</label>
                <select
                  id="addr-kabupaten"
                  value={kabId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setKabId(id);
                    const k = kabupaten.find((v) => v.id === id);
                    setForm((f) => ({ ...f, kabupatenKota: k ? k.nama : "" }));
                  }}
                  disabled={!kabupaten.length}
                  required
                >
                  <option value="">-- Pilih Kabupaten/Kota --</option>
                  {kabupaten.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </div>

              {/* Kecamatan */}
              <div className="form-row">
                <label htmlFor="addr-kecamatan">Kecamatan</label>
                <select
                  id="addr-kecamatan"
                  value={kecId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setKecId(id);
                    const kc = kecamatan.find((v) => v.id === id);
                    setForm((f) => ({ ...f, kecamatan: kc ? kc.nama : "" }));
                  }}
                  disabled={!kecamatan.length}
                  required
                >
                  <option value="">-- Pilih Kecamatan --</option>
                  {kecamatan.map((kc) => (
                    <option key={kc.id} value={kc.id}>{kc.nama}</option>
                  ))}
                </select>
              </div>

              {/* Kelurahan */}
              <div className="form-row">
                <label htmlFor="addr-kelurahan">Kelurahan</label>
                <select
                  id="addr-kelurahan"
                  value={form.kelurahan}
                  onChange={(e) => setForm((f) => ({ ...f, kelurahan: e.target.value }))}
                  disabled={!kelurahan.length}
                  required
                >
                  <option value="">-- Pilih Kelurahan --</option>
                  {kelurahan.map((kel) => (
                    <option key={kel.id} value={kel.nama}>{kel.nama}</option>
                  ))}
                </select>
              </div>

              {/* Kode Pos */}
              <div className="form-row">
                <label htmlFor="addr-kodepos">Kode Pos</label>
                <input
                  id="addr-kodepos"
                  name="kodePos"
                  type="text"
                  inputMode="numeric"
                  value={form.kodePos}
                  onChange={handleChange}
                  placeholder="Contoh: 12345"
                  required
                />
              </div>
            </div>

            {/* Default checkbox */}
            <label className="checkbox-row">
              <input
                type="checkbox"
                name="isDefault"
                checked={form.isDefault}
                onChange={handleChange}
              />
              <span>Jadikan sebagai alamat utama</span>
            </label>

            {/* Actions */}
            <div className="form-actions">
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Batal
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? "Menyimpan..." : editId ? "Perbarui Alamat" : "Simpan Alamat"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Daftar Alamat ===== */}
      {fetchLoading ? (
        <div className="addr-skeleton-list">
          {[1, 2].map((i) => <div key={i} className="addr-skeleton-card" />)}
        </div>
      ) : addresses.length === 0 ? (
        <div className="addr-empty-state">
          <UilMapMarker size="52" className="addr-empty-icon" />
          <h3>Belum ada alamat tersimpan</h3>
          <p>Tambahkan alamat pengiriman untuk memudahkan proses pemesanan Anda.</p>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
            <UilPlus size="18" /> Tambah Alamat Pertama
          </button>
        </div>
      ) : (
        <ul className="address-list">
          {addresses.map((a) => (
            <li key={a.id} className={`address-item ${a.is_default ? "address-item--default" : ""}`}>
              <div className="address-item__header">
                <div className="address-item__name">
                  <strong>{a.nama_penerima}</strong>
                  {a.is_default && <span className="badge-default">Utama</span>}
                </div>
                <div className="address-item__actions">
                  <button className="icon-btn icon-btn--view" title="Lihat detail" onClick={() => fetchAddressDetail(a.id)}>
                    <UilEye size="16" />
                  </button>
                  <button
                    className="icon-btn icon-btn--edit"
                    title="Edit alamat"
                    onClick={() => {
                      setForm({
                        namaPenerima: a.nama_penerima,
                        noHp: a.no_hp,
                        alamatLengkap: a.alamat_lengkap,
                        provinsi: a.provinsi,
                        kabupatenKota: a.kabupaten_kota,
                        kecamatan: a.kecamatan,
                        kelurahan: a.kelurahan,
                        kodePos: a.kode_pos,
                        isDefault: a.is_default,
                      });
                      const prov = provinces.find((p) => p.nama === a.provinsi);
                      if (prov) setProvId(prov.id);
                      setEditId(a.id);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <UilPen size="16" />
                  </button>
                  <button className="icon-btn icon-btn--delete" title="Hapus alamat" onClick={() => setDeleteId(a.id)}>
                    <UilTrashAlt size="16" />
                  </button>
                </div>
              </div>

              <div className="address-item__body">
                <p className="address-item__street">{a.alamat_lengkap}</p>
                <p className="address-item__region">
                  {a.kelurahan}, {a.kecamatan}, {a.kabupaten_kota}
                </p>
                <p className="address-item__region">{a.provinsi} {a.kode_pos}</p>
                <p className="address-item__phone">📞 {a.no_hp}</p>
              </div>

              {!a.is_default && (
                <button className="btn-set-default" onClick={() => setAsDefault(a.id)}>
                  Jadikan Alamat Utama
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* ===== Modal Detail ===== */}
      {showDetail && detail && (
        <div className="modal-overlay" onClick={() => setShowDetail(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box__header">
              <h3>Detail Alamat</h3>
              <button className="modal-close-btn" onClick={() => setShowDetail(false)} aria-label="Tutup">
                <UilTimes size="18" />
              </button>
            </div>
            <div className="modal-box__body">
              {detail.is_default && <span className="badge-default">Alamat Utama</span>}
              <dl className="detail-list">
                <dt>Nama Penerima</dt>
                <dd>{detail.nama_penerima}</dd>
                <dt>Nomor HP</dt>
                <dd>{detail.no_hp}</dd>
                <dt>Alamat Lengkap</dt>
                <dd>{detail.alamat_lengkap}</dd>
                <dt>Kelurahan</dt>
                <dd>{detail.kelurahan}</dd>
                <dt>Kecamatan</dt>
                <dd>{detail.kecamatan}</dd>
                <dt>Kabupaten / Kota</dt>
                <dd>{detail.kabupaten_kota}</dd>
                <dt>Provinsi</dt>
                <dd>{detail.provinsi}</dd>
                <dt>Kode Pos</dt>
                <dd>{detail.kode_pos}</dd>
              </dl>
            </div>
          </div>
        </div>
      )}

      {/* ===== Modal Konfirmasi Hapus ===== */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal-box modal-box--confirm" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box__header">
              <h3>Hapus Alamat</h3>
              <button className="modal-close-btn" onClick={() => setDeleteId(null)} aria-label="Tutup">
                <UilTimes size="18" />
              </button>
            </div>
            <div className="modal-box__body">
              <p>Apakah Anda yakin ingin menghapus alamat ini? Tindakan ini tidak dapat dibatalkan.</p>
            </div>
            <div className="modal-box__footer">
              <button className="btn-secondary" onClick={() => setDeleteId(null)}>Batal</button>
              <button className="btn-danger" onClick={handleDeleteAddress}>Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Addresses;
