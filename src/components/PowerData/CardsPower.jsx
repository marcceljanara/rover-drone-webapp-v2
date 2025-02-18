import React from "react";
import "../Cards/Cards.css";
import { CardsDataComponent } from "../PowerData/DataPower";

import Card from "./CardPower"; 

const Cards = () => {
  const { cardsData } = CardsDataComponent();
  console.log("cardsData:", cardsData); // Tambahkan logging untuk melihat data

  return (
    <div className="Cards">
      {Array.isArray(cardsData) && cardsData.length > 0 ? (
        cardsData.map((card, id) => (
          <div className="parentContainer" key={id}>
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              satuan={card.satuan}
              png={card.png}
              xaxis={card.xaxis}
              series={card.series}
            />
          </div>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Cards;
