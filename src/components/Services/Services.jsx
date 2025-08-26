import React from "react";
import "./Services.css";
import Card from "../CardService/Card";
import HeartEmoji from "../../imgs/heartemoji.png";
import Glasses from "../../imgs/glasses.png";
import Humble from "../../imgs/humble.png";
import { motion } from "framer-motion";

const Services = () => {
  const transition = {
    duration: 1,
    type: "spring",
  };

  const cardData = [
    {
      emoji: HeartEmoji,
      heading: <span style={{ color: "orange" }}>Monitoring</span>,

      detail: (
        <a
          href="/monitoring.html"
          target="_self"
          style={{ textDecoration: "none", color: "black" }}
        >
          Monitor your rover drone and field data seamlessly in real-time from anywhere.
        </a>
      ),
      link: "/monitoring.html",
      color: "#FF6347",
    },
    {
      emoji: Glasses,
      heading: <span style={{ color: "orange" }}>AI Agents</span>,
      detail: (
        <a
          href="/data.html"
          target="_self"
          style={{ textDecoration: "none", color: "black" }}
        >
          AI Agents generate smart farming recommendations from real-time field data.
        </a>
      ),
      link: "/data.html",
      color: "#4682B4",
    },
    {
      emoji: Humble,
      heading: <span style={{ color: "orange" }}>Automation</span>,
      detail: (
        <a
          href="/automation.html"
          target="_self"
          style={{ textDecoration: "none", color: "black" }}
        >
          Autonomous rover-drone swarm performs field monitoring and response without manual input.
        </a>
      ),
      link: "/automation.html",
      color: "rgba(252, 166, 31, 0.45)",
    },
  ];

  return (
    <div className="services" id="services">
      {/* Left side */}
      <div className="awesome">
        <span>Our Innovative</span>
        <span>Services</span>
        <span style={{ color: "black" }}>
          Assessing plant health in precision agriculture involves multi-layered monitoring <br />
          using aerial and ground-based data. Drone-based NDVI imaging provides rapid, large-scale <br />
          detection of vegetation anomalies, while autonomous ground rovers conduct localized <br /> 
          analysis such as soil moisture measurement and close-up visual inspections—enabling <br />
          accurate, real-time diagnostics for targeted interventions.
        </span>
        <div className="blur s-blur1" style={{ background: "#ABF1FF94" }}></div>
      </div>

      {/* Right side cards */}
      <div className="cards">
        {cardData.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={transition}
          >
            <Card {...card} index={i} />
          </motion.div>
        ))}
        <div className="blur s-blur2" style={{ background: "var(--purple)" }}></div>
      </div>
    </div>
  );
};

export default Services;
