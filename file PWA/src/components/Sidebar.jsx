import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";
import Logo from "../imgs/rover2.png";
import {
  UilSignOutAlt,
  UilBars,
  UilRocket,
  UilEstate,
  UilChart,
  UilUsdCircle,
  UilCar,
} from "@iconscout/react-unicons";
import { motion } from "framer-motion";

// Sidebar menu items
export const SidebarData = [
  { heading: "Dashboard", icon: UilEstate, link: "/dashboard" },
  { heading: "Power Data", icon: UilChart, link: "/power-data" },
  { heading: "Non Fungible Token", icon: UilUsdCircle, link: "/non-fungible-token" },
  { heading: "Perangkat", icon: UilRocket, link: "/devices" },
  { heading: "Penyewaan", icon: UilCar, link: "/penyewaan" },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const location = useLocation();

  // Responsiveness: update state on screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Variants for animation
  const sidebarVariants = {
    true: { left: "0" },
    false: { left: "-60%" },
  };

  return (
    <>
      {/* Toggle Button */}
      {isMobile && (
        <div
          className="bars"
          style={expanded ? { left: "60%" } : { left: "5%" }}
          onClick={() => setExpanded(!expanded)}
        >
          <UilBars />
        </div>
      )}

      {/* Sidebar */}
      <motion.div
        className="sidebar"
        variants={sidebarVariants}
        initial={false}
        animate={isMobile ? `${expanded}` : "true"}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            Ro<span>o</span>ne
          </span>
        </div>

        <div className="role-badge">
          Role: {localStorage.getItem("role") || "guest"}
        </div>

        <div className="menu">
          {SidebarData.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                to={item.link}
                key={index}
                className={location.pathname === item.link ? "menuItem active" : "menuItem"}
                onClick={() => isMobile && setExpanded(false)}
                style={{ textDecoration: "none" }}
              >
                <Icon />
                <span>{item.heading}</span>
              </NavLink>
            );
          })}

          <div className="menuItem">
            <NavLink to="/" className="menuItemLink" onClick={() => isMobile && setExpanded(false)}>
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
