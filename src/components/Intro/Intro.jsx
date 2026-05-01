import React from "react";
import "./Intro.css";
import Rover from "../../imgs/rover2.png";
import Github from "../../imgs/github.png";
import LinkedIn from "../../imgs/linkedin.png";
import Instagram from "../../imgs/instagram.png";
import { Link } from "react-router-dom";

const Intro = () => {
  return (
    <section className="Intro" id="Intro" aria-labelledby="intro-title">
      <div className="i-left">
        <p className="eyebrow">Precision agriculture platform</p>
        <div className="i-name">
          <h1 id="intro-title">AgroSwarm</h1>
          <p className="intro-subtitle">Integrated Rover-Drone Monitoring</p>
          <p className="intro-description">
            Sistem autonomous drone-rover berbasis AI untuk monitoring lahan real-time,
            efisien energi, dan siap diskalakan untuk operasional pertanian presisi.
          </p>
        </div>

        <div className="intro-actions">
          <Link to="/dashboard" className="i-button">
            Dashboard
          </Link>
          <a href="#services" className="secondary-button">Lihat layanan</a>
        </div>

        <div className="intro-stats" aria-label="Ringkasan fitur AgroSwarm">
          <div>
            <strong>Real-time</strong>
            <span>Telemetry</span>
          </div>
          <div>
            <strong>AI</strong>
            <span>Recommendation</span>
          </div>
          <div>
            <strong>IoT</strong>
            <span>Field sensors</span>
          </div>
        </div>

        <div className="i-icons" aria-label="Social links">
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <img src={Github} alt="" />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <img src={LinkedIn} alt="" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <img src={Instagram} alt="" />
          </a>
        </div>
      </div>

      <div className="i-right" aria-hidden="true">
        <div className="hero-visual">
          <img src={Rover} alt="" />
          <div className="hero-chip top-chip">
            <span>NDVI</span>
            <strong>Field scan</strong>
          </div>
          <div className="hero-chip bottom-chip">
            <span>Battery</span>
            <strong>Optimized</strong>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Intro;
