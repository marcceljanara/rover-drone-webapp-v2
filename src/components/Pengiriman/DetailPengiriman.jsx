import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailPengiriman.css";
import { formatTanggalDanWaktuIndonesia } from "../../utils/datetimeIndonesia";

export default function DetailPengiriman() {
  const { rentalId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [data, setData] = useState(null);
  const [shipmentId, setShipmentId] = useState("");   // simpan id asli shipment
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState({
    courierName: "",
    courierService: "",
    trackingNumber: "",
    notes: "",
  });

  useEffect(() => {
    fetchDetail();
  }, [rentalId, token]);

  useEffect(() => {
    if (data) {
      setDraft({
        courierName: data.courier_name || "",
        courierService: data.courier_service || "",
        trackingNumber: data.tracking_number || "",
        notes: data.notes || "",
      });
    }
  }, [data]);

  const fetchDetail = async () => {
    try {
      setError("");
      const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/shipments/${rentalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal memuat detail");
      setData(json.data.shipment);
      setShipmentId(json.data.shipment.id); 
    } catch (e) {
      setError(e.message);
      setData(null);
    }
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`https://dev-api.xsmartagrichain.com/v1/shipments/${shipmentId}/info`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draft),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Gagal memperbarui");
      alert(json.message || "Berhasil diperbarui");
      setEditMode(false);
      fetchDetail();
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="ship-detail-container">
      <h2 className="ship-detail-title">Detail Pengiriman</h2>

      {error ? (
        <p className="ship-error">{error}</p>
      ) : !data ? (
        <p className="ship-loading">Memuat detail...</p>
      ) : (
        <>
          <div className="ship-detail-table-wrapper">
            <table className="ship-detail-table">
              <tbody>
                <tr><td>ID</td><td>{data.id}</td></tr>
                <tr><td>Rental ID</td><td>{data.rental_id}</td></tr>
                <tr><td>Alamat Pengiriman</td><td>{data.shipping_address_id}</td></tr>
                <tr>
                  <td>Kurir / Layanan</td>
                  <td>
                    {editMode ? (
                      <>
                        <input
                          value={draft.courierName}
                          onChange={(e) => setDraft({ ...draft, courierName: e.target.value })}
                          className="ship-inline-input"
                        />
                        {" / "}
                        <input
                          value={draft.courierService}
                          onChange={(e) => setDraft({ ...draft, courierService: e.target.value })}
                          className="ship-inline-input"
                        />
                      </>
                    ) : (
                      `${data.courier_name} / ${data.courier_service}`
                    )}
                  </td>
                </tr>
                <tr>
                  <td>No. Resi</td>
                  <td>
                    {editMode ? (
                      <input
                        value={draft.trackingNumber}
                        onChange={(e) => setDraft({ ...draft, trackingNumber: e.target.value })}
                        className="ship-inline-input"
                      />
                    ) : (
                      data.tracking_number || "-"
                    )}
                  </td>
                </tr>
                <tr><td>Status</td><td>{data.shipping_status}</td></tr>
                <tr><td>Perkiraan Kirim</td><td>{formatTanggalDanWaktuIndonesia(data.estimated_shipping_date)}</td></tr>
                <tr><td>Perkiraan Sampai</td><td>{formatTanggalDanWaktuIndonesia(data.estimated_delivery_date)}</td></tr>
                <tr>
                  <td>Tanggal Kirim Sebenarnya</td>
                  <td>{data.actual_shipping_date ? formatTanggalDanWaktuIndonesia(data.actual_shipping_date) : "-"}</td>
                </tr>
                <tr>
                  <td>Tanggal Sampai Sebenarnya</td>
                  <td>{data.actual_delivery_date ? formatTanggalDanWaktuIndonesia(data.actual_delivery_date) : "-"}</td>
                </tr>
                <tr>
                  <td>Catatan</td>
                  <td>
                    {editMode ? (
                      <textarea
                        value={draft.notes}
                        onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                        rows={2}
                        className="ship-inline-input"
                      />
                    ) : (
                      data.notes || "-"
                    )}
                  </td>
                </tr>
                <tr>
                  <td>Bukti Pengiriman</td>
                  <td>
                    {data.delivery_proof_url ? (
                      <a href={data.delivery_proof_url} target="_blank" rel="noopener noreferrer">
                        Lihat Bukti
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
                <tr><td>Dibuat</td><td>{formatTanggalDanWaktuIndonesia(data.created_at)}</td></tr>
                <tr><td>Diperbarui</td><td>{formatTanggalDanWaktuIndonesia(data.updated_at)}</td></tr>
              </tbody>
            </table>
          </div>

          {/* Tombol Aksi */}
          {!editMode ? (
            <button className="ship-edit-btn" onClick={() => setEditMode(true)}>
              Edit Info Pengiriman
            </button>
          ) : (
            <div className="ship-detail-actions">
              <button className="ship-save-btn" onClick={handleSave}>Simpan</button>
              <button className="ship-cancel-btn" onClick={() => setEditMode(false)}>Batal</button>
            </div>
          )}
        </>
      )}

      <button onClick={() => navigate(-1)} className="ship-back-btn">Kembali</button>
    </div>
  );
}
