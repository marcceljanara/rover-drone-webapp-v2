import React from "react";
import "./Card.css";

const Card = ({ emoji, heading, detail, color, link }) => {
  return (
    <div className="card" style={{ borderColor: color }}>
      <img src={emoji} alt="" />
      <span>{heading}</span>
      <span>{detail}</span>
      {/* Tombol "LEARN MORE" sebagai link yang membuka halaman baru */}
      <a href={link} target="_blank" rel="noopener noreferrer">
        <button className="c-button">LEARN MORE</button>
      </a>
    </div>
  );
};

export default Card;
