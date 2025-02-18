import React, { useState } from 'react';
import './Activation.css'; // Import file CSS

const Activation = () => {
  // State untuk mengatur status tombol
  const [isActive, setIsActive] = useState(false);
  const [notification, setNotification] = useState('');

  // Fungsi untuk mengubah status tombol
  const toggleActivation = (status) => {
    setIsActive(status);
    setNotification(status ? 'System is ON' : 'System is OFF');
    
    // Menghapus notifikasi setelah 1 detik
    setTimeout(() => {
      setNotification('');
    }, 1000);
  };

  return (
    <div className="activation-container">
      <h1>Activation Page</h1>
      <p>This is the Activation page content.</p>
      
      {/* Tombol ON dan OFF */}
      <div className="button-container">
        <button 
          className={`toggle-button ${isActive ? 'active' : ''}`} 
          onClick={() => toggleActivation(true)} // Set status ON
        >
          ON
        </button>
        <button 
          className={`toggle-button ${!isActive ? 'active' : ''}`} 
          onClick={() => toggleActivation(false)} // Set status OFF
        >
          OFF
        </button>
      </div>

      {/* Notifikasi */}
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default Activation;
