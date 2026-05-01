import React from "react";
import "./Footer.css";
import Insta from "@iconscout/react-unicons/icons/uil-instagram";
import Facebook from "@iconscout/react-unicons/icons/uil-facebook";
import Github from "@iconscout/react-unicons/icons/uil-github";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="site-footer-content">
        <div>
          <span>AgroSwarm</span>
          <p>Autonomous rover-drone monitoring for precision agriculture.</p>
        </div>
        <div className="site-footer-icons" aria-label="Social media">
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <Insta size="1.35rem" />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <Facebook size="1.35rem" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <Github size="1.35rem" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
