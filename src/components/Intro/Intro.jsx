import React, { useEffect, useState } from "react";
import "./Intro.css";
import Vector1 from "../../imgs/slime.png";
import Vector2 from "../../imgs/Vector2.png";
import boy from "../../imgs/rover2.png";
import thumbup from "../../imgs/thumbup.png";
import crown from "../../imgs/crown.png";
import FloatinDiv from "../FloatingDiv/FloatingDiv";
import Github from "../../imgs/github.png";
import LinkedIn from "../../imgs/linkedin.png";
import Instagram from "../../imgs/instagram.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Intro = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const transition = { duration: 2, type: "spring" };

  const handleScroll = () => {
    const introSection = document.getElementById("Intro");
    const rect = introSection.getBoundingClientRect();
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      setIsAnimated(true);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="Intro" id="Intro">
      <div className="i-left">
        <div className="i-name">
          <span>AgroSwarm</span>
          <span>Integrated Rover-Drone</span>
          <span className="intro-description">
  Welcome to Agro-Swarm — an autonomous drone-rover swarm system powered by AI <br />
  to deliver real-time, energy-efficient, and scalable monitoring for precision agriculture.
</span>

        </div>
        <Link to="/dashboard" className="i-button" style={{ textDecoration: 'none' }}>
          <button className="button">Dashboard</button>
        </Link>
        <div className="i-icons">
          <img src={Github} alt="GitHub" />
          <img src={LinkedIn} alt="LinkedIn" />
          <img src={Instagram} alt="Instagram" />
        </div>
      </div>
      <div className="i-right">
        <img src={Vector1} alt="vector1" />
        <img src={Vector2} alt="vector2" />
        <motion.img
          src={boy}
          alt="boy"
          initial={{ y: 0 }}
          animate={isAnimated ? { y: [0, -100, 0] } : { y: 0 }}
          transition={transition}
          onAnimationComplete={() => setIsAnimated(false)}
        />
        <motion.div
          initial={{ top: "-4%", left: "60%" }}
          whileInView={{ left: "50%" }}
          transition={transition}
          className="floating-div"
        >
          <FloatinDiv img={crown} text1="AI" text2="Agent" />
        </motion.div>
        <motion.div
          initial={{ left: "9rem", top: "18rem" }}
          whileInView={{ left: "0rem" }}
          transition={transition}
          className="floating-div"
        >
          <FloatinDiv img={thumbup} text1="Best Monitoring" text2="System" />
        </motion.div>
        <div className="blur" style={{ background: "rgb(238 210 255)" }}></div>
        <div className="blur" style={{
          background: "#C1F5FF",
          top: "17rem",
          width: "21rem",
          height: "11rem",
          left: "-9rem"
        }}></div>
      </div>
    </div>
  );
};

export default Intro;
