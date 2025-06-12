import React from 'react';
import MainDash from '../MainDash/MainDash';
import RightSide from '../RightSide/RightSide';
import './Dashboard.css'; // Pastikan untuk mengimpor CSS

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Dashboard</h1>
      <MainDash />
      <RightSide /> {/* Jika Anda ingin menambahkan RightSide, pastikan untuk menyesuaikan tata letak */}
    </div>
  );
}

export default Dashboard;