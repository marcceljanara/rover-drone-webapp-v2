import React, { useState } from "react";    
import { NavLink, useLocation } from "react-router-dom";    
import "./Sidebar.css";    
import Logo from "../imgs/logo1.png";    
import { UilSignOutAlt, UilBars, UilRocket, UilEstate, UilChart, UilUsdCircle, UilCar } from "@iconscout/react-unicons";    
import { motion } from "framer-motion";    

// SidebarData array
export const SidebarData = [
  {
    heading: "Dashboard",
    icon: UilEstate,
    link: "/dashboard",
  },
  {
    heading: "Power Data",
    icon: UilChart,
    link: "/power-data",
  },
  {
    heading: "Non Fungible Token",
    icon: UilUsdCircle,
    link: "/non-fungible-token",
  },
  {
    heading: "Activation",
    icon: UilRocket,
    link: "/activation",
  },
  {
    heading: "Penyewaan", // New menu item
    icon: UilCar, // Ganti dengan ikon mobil
    link: "/penyewaan",
  },
];

const Sidebar = () => {    
  const [expanded, setExpanded] = useState(true);    
  const location = useLocation();

  const sidebarVariants = {    
    true: {    
      left: "0",    
    },    
    false: {    
      left: "-60%",    
    },    
  };    

  return (    
    <>    
      <div    
        className="bars"    
        style={expanded ? { left: "60%" } : { left: "5%" }}    
        onClick={() => setExpanded(!expanded)}    
      >    
        <UilBars />    
      </div>    
    
      <motion.div    
        className="sidebar"    
        variants={sidebarVariants}    
        animate={window.innerWidth <= 768 ? `${expanded}` : ""}    
      >    
        <div className="logo">    
          <img src={Logo} alt="logo" />    
          <span>    
            Ro<span>o</span>ne    
          </span>    
        </div>    
    
        <div className="menu">    
          {SidebarData.map((item, index) => {    
            const IconComponent = item.icon;    
            return (    
              <NavLink    
                to={item.link}    
                className={location.pathname === item.link ? "menuItem active" : "menuItem"}    
                key={index}    
                onClick={() => setExpanded(false)} // Tutup sidebar saat menu diklik
                style={{ textDecoration: "none" }}    
              >    
                {typeof IconComponent === 'function' ? <IconComponent /> : <IconComponent />}    
                <span>{item.heading}</span>    
              </NavLink>    
            );    
          })}    

          <div className="menuItem">    
            <NavLink to="/" className="menuItemLink" onClick={() => setExpanded(false)}>    
              <UilSignOutAlt />    
              <span>Sign Out</span>    
            </NavLink>    
          </div>    
        </div>    
      </motion.div>    
    </>    
  );    
};    
    
export default Sidebar;    
