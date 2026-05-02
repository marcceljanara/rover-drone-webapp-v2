import React from "react";
import "./Works.css";
import Pertamina from "../../imgs/pertamina.png";
import Bumn from "../../imgs/bumn.png";
import Sawit from "../../imgs/sawit.png";
import Unila from "../../imgs/unila.png";
import Handayani from "../../imgs/handayani.png";
import { motion } from "framer-motion";

const partners = [
  { name: "Pertamina", logo: Pertamina },
  { name: "BUMN", logo: Bumn },
  { name: "Sawit", logo: Sawit },
  { name: "Universitas Lampung", logo: Unila },
  { name: "Handayani", logo: Handayani },
];

const Works = () => {
  return (
    <section className="works" id="works" aria-labelledby="works-title">
      <div className="w-left">
        <div className="awesome">
          <p className="eyebrow">Ecosystem</p>
          <h2 id="works-title">Built for Field Teams and Research Partners</h2>
          <p>
            Platform ini dirancang untuk mendukung kolaborasi operasional, riset, dan
            implementasi teknologi pertanian yang membutuhkan data akurat dari udara dan darat.
          </p>
        </div>
      </div>

      <motion.div
        className="w-right"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {partners.map((partner) => (
          <article className="partner-card" key={partner.name}>
            <img src={partner.logo} alt={partner.name} />
            <span>{partner.name}</span>
          </article>
        ))}
      </motion.div>
    </section>
  );
};

export default Works;
