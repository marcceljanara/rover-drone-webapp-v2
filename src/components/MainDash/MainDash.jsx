import React, { useState } from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import "./MainDash.css";

const MainDash = () => {
  const [selectedRange, setSelectedRange] = useState("1h");

  return (
    <div>
      <h1 className="dashboard-title">Dashboard</h1>

      {/* Dropdown menu */}
      <div className="dropdown-container">
        <select
          className="custom-dropdown"
          value={selectedRange}
          onChange={(e) => setSelectedRange(e.target.value)}
        >
          <option value="15m">15m</option>
          <option value="1h">1h</option>
          <option value="6h">6h</option>
          <option value="12h">12h</option>
          <option value="24h">24h</option>
          <option value="7d">7d</option>
          <option value="30d">30d</option>
          <option value="60d">60d</option>
          <option value="90d">90d</option>
        </select>
      </div>

      <div className="MainDash">
        <Cards selectedRange={selectedRange} />
        <Table />
      </div>
    </div>
  );
};

export default MainDash;
