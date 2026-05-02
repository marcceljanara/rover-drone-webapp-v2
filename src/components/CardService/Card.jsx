import React from "react";
import "./Card.css";

const Card = ({ emoji, heading, detail, color, link }) => {
  return (
    <article className="service-card" style={{ "--service-accent": color }}>
      <img src={emoji} alt="" aria-hidden="true" />
      <h3>{heading}</h3>
      <p>{detail}</p>
      <a className="c-button" href={link}>
        Learn more
      </a>
    </article>
  );
};

export default Card;
