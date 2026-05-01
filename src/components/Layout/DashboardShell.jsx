import React from "react";
import Sidebar from "../Sidebar";
import "./DashboardShell.css";

const DashboardShell = ({ children }) => {
  return (
    <div className="dashboard-shell">
      <Sidebar />
      <main className="dashboard-main" id="main-content">
        {children}
      </main>
    </div>
  );
};

export default DashboardShell;
