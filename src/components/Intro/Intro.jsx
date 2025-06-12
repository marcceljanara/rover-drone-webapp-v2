import React, { useEffect, useState } from "react";
import "./Intro.css";
import Vector1 from "../../imgs/slime.png";
import Vector2 from "../../imgs/Vector2.png";
import boy from "../../imgs/rover2.png";
import glassesimoji from "../../imgs/buah.png";
import thumbup from "../../imgs/thumbup.png";
import crown from "../../imgs/crown.png";
import FloatinDiv from "../FloatingDiv/FloatingDiv";
import Github from "../../imgs/github.png";
import LinkedIn from "../../imgs/linkedin.png";
import Instagram from "../../imgs/instagram.png";
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // Ganti impor Link

const Intro = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const transition = { duration: 2, type: "spring" };

  const handleScroll = () => {
    const introSection = document.getElementById("Intro");
    const rect = introSection.getBoundingClientRect();
    // Cek apakah bagian gambar terlihat di viewport
    if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
      setIsAnimated(true);
    }
  };

  useEffect(() => {
    // Menambahkan event listener untuk scroll
    window.addEventListener("scroll", handleScroll);

    // Menghapus event listener saat komponen unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="Intro" id="Intro">
      {/* left name side */}
      <div className="i-left">
        <div className="i-name">
          <span style={{ color: "" }}>Smart Agriculture </span>
          <span>with Drone-Rover</span>
          <span>
            Meningkatkan Produktivitas Perkebunan Kelapa Sawit dengan Teknologi <br/>
            Blockchain dan Drone Rover dari Universitas Lampung
          </span>
        </div>
          <Link to="/dashboard" className="i-button" style={{ textDecoration: 'none' }}>
            <button className="button">Dashboard</button>
          </Link>

        {/* social icons */}
        <div className="i-icons">
          <img src={Github} alt="" />
          <img src={LinkedIn} alt="" />
          <img src={Instagram} alt="" />
        </div>
      </div>
      {/* right image side */}
      <div className="i-right">
        <img src={Vector1} alt="" />
        <img src={Vector2} alt="" />
        
        {/* Gambar dengan efek naik dan turun sekali */}
        <motion.img
          src={boy}
          alt=""
          initial={{ y: 0 }} // Posisi awal
          animate={isAnimated ? { y: [0, -100, 0] } : { y: 0 }} // Naik lebih tinggi sekali
          transition={{ duration: 2, type: "spring" }} // Transisi
          onAnimationComplete={() => setIsAnimated(false)} // Setel isAnimated ke false setelah animasi selesai
        />
        
        <motion.img
          initial={{ left: "-36%" }}
          whileInView={{ left: "-24%" }}
          transition={transition}
          src={glassesimoji}
          alt=""
        />
        <motion.div
          initial={{ top: "-4%", left: "60%" }} // Adjusted left position to move it to the left
          whileInView={{ left: "50%" }} // Adjusted left position for when it comes into view
          transition={transition}
          className="floating-div"
        >
          <FloatinDiv img={crown} text1="Sawit" text2="Monitoring" />
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
        <div
          className="blur"
          style={{
            background: "#C1F5FF",
            top: "17rem",
            width: "21rem",
            height: "11rem",
            left: "-9rem",
          }}
        ></div>
      </div>
    </div>
  );
};

export default Intro;