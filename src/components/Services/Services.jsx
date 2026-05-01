import React from "react";
import "./Services.css";
import Card from "../CardService/Card";
import HeartEmoji from "../../imgs/heartemoji.png";
import Glasses from "../../imgs/glasses.png";
import Humble from "../../imgs/humble.png";
import { motion } from "framer-motion";

const Services = () => {
  const transition = {
    duration: 0.6,
    type: "spring",
  };

  const cardData = [
    {
      emoji: HeartEmoji,
      heading: "Monitoring",
      detail: "Pantau rover-drone, sensor lahan, dan status operasi secara real-time dari satu dashboard.",
      link: "/monitoring.html",
      color: "#167a3f",
    },
    {
      emoji: Glasses,
      heading: "AI Agents",
      detail: "Ubah data lapangan menjadi rekomendasi agronomi yang cepat, relevan, dan mudah dieksekusi.",
      link: "/data.html",
      color: "#2563eb",
    },
    {
      emoji: Humble,
      heading: "Automation",
      detail: "Koordinasikan drone dan rover untuk monitoring lahan tanpa kontrol manual terus-menerus.",
      link: "/automation.html",
      color: "#f2a51a",
    },
  ];

  return (
    <section className="services" id="services" aria-labelledby="services-title">
      <div className="awesome">
        <p className="eyebrow">Capabilities</p>
        <h2 id="services-title">Our Innovative Services</h2>
        <p>
          AgroSwarm menggabungkan pemantauan udara, inspeksi darat, dan analisis AI untuk
          membantu tim lapangan mendeteksi anomali tanaman, memprioritaskan tindakan,
          dan menjaga operasional tetap efisien.
        </p>
      </div>

      <div className="cards">
        {cardData.map((card, i) => (
          <motion.div
            key={card.heading}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ ...transition, delay: i * 0.08 }}
          >
            <Card {...card} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Services;
