import React from "react";
import "./Cards.css";
import { CardsDataComponent } from "../../Data/Data";

import Card from "../Card/Card"; 

const Cards = ({ cardsData: cardsDataProp }) => {
  const { cardsData } = CardsDataComponent();
  const displayCards = cardsDataProp || cardsData;

  return (
    <div className="Cards">
      {Array.isArray(displayCards) && displayCards.length > 0 ? (
        displayCards.map((card, id) => (
          <div className="parentContainer" key={`${card.title}-${id}`}>
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
