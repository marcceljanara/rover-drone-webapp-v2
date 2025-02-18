import React from 'react';
import Cards from "../PowerData/CardsPower";
import Table from "../PowerData/Table";
import "../MainDash/MainDash.css";


const PowerData = () => {
  return (
    <div>
      <h1 style={{ marginTop: '40px' }}>Power Data</h1>
      <div className="MainDash">
      <Cards />
      <Table />
    </div>
    </div>
  );
};

export default PowerData;
