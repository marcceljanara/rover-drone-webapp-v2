import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailShipment.css";
import { formatTanggalDanWaktuIndonesia } from "../../utils/datetimeIndonesia";

const API_HOST = "https://dev-api.xsmartagrichain.com";

export default function DetailShipment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setError("");
        const res = await fetch(`${API_HOST}/v1/shipments/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Gagal memuat detail");
        setData(json.data.shipment);
      } catch (e) {
        setError(e.message);
      }
    };
    fetchDetail();
  }, [id, token]);

  const getProofUrl = (relativeUrl) =>
    !relativeUrl
      ? ""
      : relativeUrl.startsWith("http")
      ? relativeUrl
      : `${API_HOST}${relativeUrl}`;

  if (error)
    return (
      <div className="ship-detail-container">
        <p className="ship-error">{error}</p>
        <button onClick={() => navigate(-1)} className="ship-back-btn">
          Kembali
        </button>
      </div>
    );

  if (!data)
    return <div className="ship-detail-container">Memuat detail…</div>;

  return (
    <div className="ship-detail-container">
      <h2 className="ship-detail-title">Detail Pengiriman</h2>

      <div className="ship-detail-table-wrapper">
        <table className="ship-detail-table">
          <tbody>
            <tr><td>ID Pengiriman</td><td>{data.id}</td></tr>
            <tr><td>Rental ID</td><td>{data.rental_id}</td></tr>
            <tr><td>Alamat Pengiriman</td><td>{data.full_address}</td></tr>
            <tr><td>Kurir / Layanan</td><td>{`${data.courier_name} / ${data.courier_service}`}</td></tr>
            <tr><td>No. Resi</td><td>{data.tracking_number || "-"}</td></tr>
            <tr><td>Status</td><td>{data.shipping_status}</td></tr>
            <tr><td>Perkiraan Kirim</td><td>{formatTanggalDanWaktuIndonesia(data.estimated_shipping_date)}</td></tr>
            <tr><td>Perkiraan Sampai</td><td>{formatTanggalDanWaktuIndonesia(data.estimated_delivery_date)}</td></tr>
            <tr><td>Tgl Kirim Sebenarnya</td><td>{data.actual_shipping_date ? formatTanggalDanWaktuIndonesia(data.actual_shipping_date) : "-"}</td></tr>
            <tr><td>Tgl Sampai Sebenarnya</td><td>{data.actual_delivery_date ? formatTanggalDanWaktuIndonesia(data.actual_delivery_date) : "-"}</td></tr>
            <tr><td>Catatan</td><td>{data.notes || "-"}</td></tr>
            <tr>
              <td>Bukti Pengiriman</td>
              <td>
                {data.delivery_proof_url ? (
                  <a href={getProofUrl(data.delivery_proof_url)} target="_blank" rel="noopener noreferrer">
                    <img src={getProofUrl(data.delivery_proof_url)} alt="Bukti Pengiriman" className="ship-proof-img" />
                  </a>
                ) : "-"}
              </td>
            </tr>
            <tr><td>Dibuat</td><td>{formatTanggalDanWaktuIndonesia(data.created_at)}</td></tr>
            <tr><td>Diperbarui</td><td>{formatTanggalDanWaktuIndonesia(data.updated_at)}</td></tr>
          </tbody>
        </table>
      </div>

      <button onClick={() => navigate(-1)} className="ship-back-btn">Kembali</button>
    </div>
  );
}
