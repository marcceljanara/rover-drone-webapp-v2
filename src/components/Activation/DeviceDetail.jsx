import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './DeviceDetail.css';
import Sidebar from '../Sidebar';
import RightSide from '../RightSide/RightSide';

const DeviceDetail = () => {
  const { id } = useParams();
  const [isOn, setIsOn] = useState(false);

  const handleToggle = (status) => {
    setIsOn(status);
    alert(`Device ${id} is now ${status ? 'ON' : 'OFF'}`);
  };

  return (
    <div className="AppGlass">
      <Sidebar />
      <div className="device-detail-container">
        <h2>Aktivasi Rover</h2>
        <div className="toggle-buttons">
          <button
            className="on-btn"
            onClick={() => handleToggle(true)}
            style={{ backgroundColor: isOn ? 'lime' : '' }}
          >
            ON
          </button>
          <button
            className="off-btn"
            onClick={() => handleToggle(false)}
            style={{ backgroundColor: !isOn ? 'red' : '' }}
          >
            OFF
          </button>
        </div>
      </div>
      <RightSide />
    </div>
  );
};

export default DeviceDetail;
