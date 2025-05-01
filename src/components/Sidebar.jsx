import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";
import Logo from "../imgs/rover2.png"; // ✅ ganti logo
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
  const location = useLocation();

  const sidebarVariants = {
    true: { left: "0" },
    false: { left: "-60%" },
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
                onClick={() => setExpanded(false)}
                style={{ textDecoration: "none" }}
              >
                <Icon />
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
