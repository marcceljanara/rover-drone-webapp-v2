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
  UilMoneyBill,
  UilFileAlt,
  UilUsersAlt
} from "@iconscout/react-unicons";

export const SidebarData = [
  { heading: "Dashboard", icon: UilEstate, link: "/dashboard" },
  { heading: "Power Data", icon: UilChart, link: "/power-data" },
  { heading: "Non Fungible Token", icon: UilUsdCircle, link: "/non-fungible-token" },
  { heading: "Perangkat", icon: UilRocket, link: "/devices" },
  { heading: "Penyewaan", icon: UilCar, link: "/penyewaan" },
  { heading: "Pembayaran", icon: UilMoneyBill, link: "/payments" },
  { heading: "Laporan Keuangan", icon: UilFileAlt, link: "/reports" },
  { heading: "Manajemen Pengguna", icon: UilUsersAlt, link: "/admin" }
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(window.innerWidth > 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Hamburger Icon */}
      <div className="bars" onClick={() => setExpanded(prev => !prev)}>
        <UilBars />
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar ${expanded ? "open" : "closed"}`}
        style={{
          left: expanded ? "0" : window.innerWidth <= 768 ? "-100%" : "0",
          position: window.innerWidth <= 768 ? "fixed" : "relative"
        }}
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
                onClick={() => {
                  if (window.innerWidth <= 768) setExpanded(false);
                }}
              >
                <Icon />
                <span>{item.heading}</span>
              </NavLink>
            );
          })}

          <div className="menuItem signout-section">
            <NavLink
              to="/"
              className="menuItemLink"
              onClick={() => {
                if (window.innerWidth <= 768) setExpanded(false);
              }}
            >
              <UilSignOutAlt />
              <span>Sign Out</span>
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
