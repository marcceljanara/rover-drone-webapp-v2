import React, { useContext } from "react";
import "./Works.css";
import Upwork from "../../imgs/bpdpks.png";
import Fiverr from "../../imgs/kemenkeu.png";
import Amazon from "../../imgs/sawit.png";
import Shopify from "../../imgs/unila.png";
import Facebook from "../../imgs/handayani.png";
// import { themeContext } from "../../Context";
import { motion } from "framer-motion";
import { Link } from 'react-scroll';

const Works = () => {
  // context
  // const theme = useContext(themeContext);
  // const darkMode = theme.state.darkMode;

  // transition
  return (
    <div className="works" id="works">
      {/* left side */}
      <div className="w-left">
        <div className="awesome">
          {/* dark Mode */}
          <span style={{ color: "" }}>
            Works for All these
          </span>
          <span>Brands & Clients</span>
          <span>
            Kami bangga telah memberikan solusi inovatif dan efisien untuk berbagai merek dan klien, <br/>membantu mereka mengatasi tantangan dalam sektor pertanian dan teknologi.
            <br />
            Kami berkomitmen untuk terus memberikan layanan terbaik dan solusi yang berdampak positif.
          </span>
          {/* <Link to="contact" smooth={true} spy={true}>
            <button className="button s-button">Hire Me</button>
          </Link> */}
          <div
            className="blur s-blur1"
            style={{ background: "#ABF1FF94" }}
          ></div>
        </div>

        {/* right side */}
      </div>
      <div className="w-right">
        <motion.div
          initial={{ rotate: 45 }}
          whileInView={{ rotate: 0 }}
          viewport={{ margin: "-40px" }}
          transition={{ duration: 3.5, type: "spring" }}
          className="w-mainCircle"
        >
          <div className="w-secCircle">
            <img src={Upwork} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Fiverr} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Amazon} alt="" />
          </div>{" "}
          <div className="w-secCircle">
            <img src={Shopify} alt="" />
          </div>
          <div className="w-secCircle">
            <img src={Facebook} alt="" />
          </div>
        </motion.div>
        {/* background Circles */}
        <div className="w-backCircle blueCircle"></div>
        <div className="w-backCircle yellowCircle"></div>
      </div>
    </div>
  );
};

export default Works;