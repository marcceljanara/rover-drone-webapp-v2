const bulanIndo = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export function formatTanggalIndonesia(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = bulanIndo[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function formatTanggalDanWaktuIndonesia(dateStr) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = bulanIndo[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}
