import React, { useState } from "react";
import Cards from "../Cards/Cards";
import Table from "../Table/Table";
import "./PowerData.css";

export const CardsDataComponent = () => {
  const [selectedRange, setSelectedRange] = useState("1h");

  const cardsData = [
    {
      title: "Voltage",
      color: {
        backGround: "linear-gradient(180deg, #bb67ff 0%, #c484f3 100%)",
        boxShadow: "0px 10px 20px 0px #e0c6f5",
      },
      value: 220,
      satuan: " V",
      barValue: 70,
      png: () => <i className="fa fa-bolt fa-2x" />,
      series: [
        {
          name: "Voltage",
          data: [210, 215, 218, 222, 221, 220, 219],
        },
      ],
      xaxis: [
        "2025-06-01T10:00",
        "2025-06-01T10:10",
        "2025-06-01T10:20",
        "2025-06-01T10:30",
        "2025-06-01T10:40",
        "2025-06-01T10:50",
        "2025-06-01T11:00",
      ],
    },
    // Tambahkan data lain jika perlu
  ];

  return {
    cardsData,
    selectedRange,
    setSelectedRange,
  };
};

const PowerData = () => {
  const { cardsData, selectedRange, setSelectedRange } = CardsDataComponent();

  return (
    <div className="PowerData">
<h1 className="power-title">Power Data</h1>

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

      <Cards cardsData={cardsData} selectedRange={selectedRange} />
      <Table />
    </div>
  );
};

export default PowerData;
