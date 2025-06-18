import React, { useEffect, useState } from "react";

const API_BASE = "https://dev-api.xsmartagrichain.com/api/pengiriman";

export default function Pengiriman() {
  const [pengirimanList, setPengirimanList] = useState([]);
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [formData, setFormData] = useState({
    nama_produk: "",
    tanggal_pengiriman: "",
    jumlah: 0,
    tujuan_pengiriman: "",
  });
  const [selectedId, setSelectedId] = useState(null);
  const [detailPengiriman, setDetailPengiriman] = useState(null);
  const [riwayatStatus, setRiwayatStatus] = useState([]);
  const [lokasi, setLokasi] = useState(null);
  const [statusBaru, setStatusBaru] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPengiriman();
  }, []);

  const fetchPengiriman = async () => {
    setLoading(true);
    setError("");
    try {
      let url = API_BASE;
      if (tanggalAwal && tanggalAkhir) {
        url += `?tanggal_awal=${tanggalAwal}&tanggal_akhir=${tanggalAkhir}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setPengirimanList(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError("Gagal mengambil data pengiriman.");
      setPengirimanList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nama_produk || !formData.tanggal_pengiriman || !formData.tujuan_pengiriman || !formData.jumlah) {
      alert("Lengkapi semua field!");
      return;
    }
    try {
      const url = selectedId ? `${API_BASE}/${selectedId}` : API_BASE;
      const method = selectedId ? "PUT" : "POST";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      fetchPengiriman();
      resetForm();
      setSelectedId(null);
    } catch (err) {
      alert("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus pengiriman ini?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      fetchPengiriman();
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  const getDetail = async (id) => {
    try {
      setSelectedId(id);
      const [detail, riwayat, lokasi] = await Promise.all([
        fetch(`${API_BASE}/${id}`).then((res) => res.json()),
        fetch(`${API_BASE}/${id}/riwayat`).then((res) => res.json()),
        fetch(`${API_BASE}/${id}/lokasi`).then((res) => res.json()),
      ]);
      setDetailPengiriman(detail?.data || null);
      setRiwayatStatus(Array.isArray(riwayat?.data) ? riwayat.data : []);
      setLokasi(lokasi?.data || null);
    } catch (err) {
      alert("Gagal mengambil detail pengiriman.");
    }
  };

  const updateStatusPengiriman = async () => {
    if (!statusBaru || !selectedId) return;
    try {
      await fetch(`${API_BASE}/${selectedId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: statusBaru }),
      });
      getDetail(selectedId);
      setStatusBaru("");
    } catch (err) {
      alert("Gagal update status.");
    }
  };

  const resetForm = () => {
    setFormData({
      nama_produk: "",
      tanggal_pengiriman: "",
      jumlah: 0,
      tujuan_pengiriman: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans text-gray-800 space-y-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Manajemen Pengiriman</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="date"
          value={tanggalAwal}
          onChange={(e) => setTanggalAwal(e.target.value)}
          className="border rounded px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-300"
        />
        <input
          type="date"
          value={tanggalAkhir}
          onChange={(e) => setTanggalAkhir(e.target.value)}
          className="border rounded px-3 py-2 text-sm shadow-sm focus:ring focus:ring-blue-300"
        />
        <button
          onClick={fetchPengiriman}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
        >
          Cari
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm border-collapse">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs">
            <tr>
              <th className="p-3 border">No</th>
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Produk</th>
              <th className="p-3 border">Tanggal</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Mengambil data...
                </td>
              </tr>
            ) : pengirimanList.length > 0 ? (
              pengirimanList.map((item, index) => (
                <tr key={item.id} className="even:bg-gray-50">
                  <td className="border px-3 py-2">{index + 1}</td>
                  <td className="border px-3 py-2">{item.id}</td>
                  <td className="border px-3 py-2">{item.nama_produk}</td>
                  <td className="border px-3 py-2">{item.tanggal_pengiriman}</td>
                  <td className="border px-3 py-2">{item.status_pengiriman}</td>
                  <td className="border px-3 py-2 space-x-1">
                    <button
                      onClick={() => getDetail(item.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Detail
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  Tidak ada data pengiriman.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form */}
      <div className="bg-gray-50 p-5 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">
          {selectedId ? "Edit Pengiriman" : "Tambah Pengiriman"}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nama_produk"
            placeholder="Nama Produk"
            value={formData.nama_produk}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="date"
            name="tanggal_pengiriman"
            value={formData.tanggal_pengiriman}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="number"
            name="jumlah"
            placeholder="Jumlah"
            value={formData.jumlah}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            required
          />
          <input
            type="text"
            name="tujuan_pengiriman"
            placeholder="Tujuan Pengiriman"
            value={formData.tujuan_pengiriman}
            onChange={handleInputChange}
            className="border rounded px-3 py-2 shadow-sm focus:ring focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            className="col-span-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            {selectedId ? "Simpan Perubahan" : "Tambah Pengiriman"}
          </button>
        </form>
      </div>

      {/* Detail Section */}
      {detailPengiriman && (
        <div className="bg-white p-5 rounded shadow space-y-3">
          <h3 className="text-lg font-semibold">Detail Pengiriman</h3>
          <div className="space-y-1 text-sm">
            <p><strong>Produk:</strong> {detailPengiriman.nama_produk}</p>
            <p><strong>Jumlah:</strong> {detailPengiriman.jumlah}</p>
            <p><strong>Tujuan:</strong> {detailPengiriman.tujuan_pengiriman}</p>
            <p><strong>Status:</strong> {detailPengiriman.status_pengiriman}</p>
            <p><strong>Tanggal:</strong> {detailPengiriman.tanggal_pengiriman}</p>
          </div>

          <div>
            <h4 className="font-semibold mt-3">Riwayat Status</h4>
            <ul className="list-disc list-inside text-gray-600 text-sm">
              {riwayatStatus.map((r, idx) => (
                <li key={idx}>
                  {r.tanggal} - {r.status}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={statusBaru}
              onChange={(e) => setStatusBaru(e.target.value)}
              className="border rounded px-2 py-1 text-sm shadow-sm"
            >
              <option value="">-- Pilih Status --</option>
              <option value="Diproses">Diproses</option>
              <option value="Dikirim">Dikirim</option>
              <option value="Selesai">Selesai</option>
            </select>
            <button
              onClick={updateStatusPengiriman}
              className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition"
            >
              Update
            </button>
          </div>

          {lokasi && (
            <div className="text-sm text-gray-700 mt-2">
              <h4 className="font-semibold">Lokasi Pengiriman</h4>
              <p>Latitude: {lokasi.latitude}</p>
              <p>Longitude: {lokasi.longitude}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
