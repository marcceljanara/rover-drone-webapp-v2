import React from "react";
import "./Services.css";
import Card from "../CardService/Card";
import HeartEmoji from "../../imgs/heartemoji.png";
import Glasses from "../../imgs/glasses.png";
import Humble from "../../imgs/humble.png";
import { motion } from "framer-motion";
// import Resume from './resume.pdf';

const Services = () => {
  const transition = {
    duration: 1,
    type: "spring",
  };

  const cardData = [
    {
      emoji: HeartEmoji,
      heading: "Monitoring",
      detail: (
        <a
          href="/monitoring.html"
          target="_self"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Pemantauan otomatis dengan Drone Rover untuk kesehatan tanaman, kebutuhan pemupukan, dan pengendalian hama.
        </a>
      ),
      link: "/monitoring.html",
      color: "#FF6347",
    },
    {
      emoji: Glasses,
      heading: "Data Management",
      detail: (
        <a
          href="/data.html"
          target="_self"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Pengelolaan data perkebunan dengan Blockchain untuk transparansi dan akuntabilitas yang lebih baik.
        </a>
      ),
      link: "/data.html",
      color: "#4682B4",
    },
    {
      emoji: Humble,
      heading: "Automation",
      detail: (
        <a
          href="/automation.html"
          target="_self"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          Automatisasi proses pemeliharaan tanaman, seperti pemupukan dan penyemprotan, berdasarkan data real-time.
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
        <span>
          Kami menyediakan solusi teknologi terdepan untuk memantau dan 
          <br />
          mengelola perkebunan kelapa sawit secara efisien dan transparan.
          <br />
          Melalui teknologi blockchain dan drone rover, kami membawa revolusi 
          <br />
          dalam pengelolaan perkebunan.
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