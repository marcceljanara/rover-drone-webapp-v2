/* eslint-disable no-unused-vars */
import React, { useContext } from "react";
import "./Works.css";
import Upwork from "../../imgs/pertamina.png";
import Fiverr from "../../imgs/bumn.png";
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
          <span style={{ color: "black" }}>
  We pride ourselves on providing innovative and efficient solutions to a wide range of brands and clients,
  <br />
  helping them overcome challenges in the agricultural and technology sectors.
  <br />
  We are committed to continuing to provide the best services and solutions that have a positive impact.
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