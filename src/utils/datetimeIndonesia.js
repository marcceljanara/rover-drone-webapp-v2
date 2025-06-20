export const formatTanggalDanWaktuIndonesia = (dateString) => {
    const date = new Date(dateString);
  
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  
    const formattedTime = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  
    return `${formattedDate}, ${formattedTime}`;
  };
  
export const formatTanggalIndonesia = (dateString) => {
    const date = new Date(dateString);
  
    const formattedDate = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  
    return `${formattedDate}`;
  };
  
  export const formatIntervalIndonesian = (intervalString) => {
    if (!intervalString) return '';
  
    const [start, end] = intervalString.split(' - ');
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    const dateOptions = { day: '2-digit', month: 'long', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
  
    const formattedStartDate = startDate.toLocaleDateString('id-ID', dateOptions);
    const formattedStartTime = startDate.toLocaleTimeString('id-ID', timeOptions);
  
    const formattedEndDate = endDate.toLocaleDateString('id-ID', dateOptions);
    const formattedEndTime = endDate.toLocaleTimeString('id-ID', timeOptions);
  
    return `${formattedStartDate}, ${formattedStartTime} - ${formattedEndDate}, ${formattedEndTime}`;
  };
  
  
//   const bulanIndo = [
//   'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
//   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
// ];

// export function formatTanggalIndonesia(dateStr) {
//   const date = new Date(dateStr);
//   const day = date.getDate();
//   const month = bulanIndo[date.getMonth()];
//   const year = date.getFullYear();
//   return `${day} ${month} ${year}`;
// }

// export function formatTanggalDanWaktuIndonesia(dateStr) {
//   const date = new Date(dateStr);
//   const day = date.getDate();
//   const month = bulanIndo[date.getMonth()];
//   const year = date.getFullYear();
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   return `${day} ${month} ${year}, ${hours}:${minutes}`;
// }
