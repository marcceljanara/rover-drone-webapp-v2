import React, { useState } from "react";
import Cards from "../Cards/Cards";
import Table from "./Table";
import { CardsDataComponent } from "./DataPower";
import "./PowerData.css";

const PowerData = () => {
  const [selectedRange, setSelectedRange] = useState("1h");
  const { cardsData } = CardsDataComponent();

  return (
    <section className="PowerData" aria-labelledby="power-data-title">
      <header className="power-header">
        <div>
          <p className="eyebrow">Energy telemetry</p>
          <h1 id="power-data-title" className="power-title">Power Data</h1>
          <p className="page-description">
            Lihat ringkasan baterai dan data kelistrikan perangkat secara berkala.
          </p>
        </div>

        <div className="dropdown-container">
          <label htmlFor="power-range">Rentang data</label>
          <select
            id="power-range"
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
      </header>

      <Cards cardsData={cardsData} selectedRange={selectedRange} />
      <Table />
    </section>
  );
};

export default PowerData;
