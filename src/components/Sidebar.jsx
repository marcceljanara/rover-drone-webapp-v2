import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

import Logo from "../imgs/rover2.png";
import IconLokasi from "../imgs/Icon-Lokasi.png";

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
  UilUsersAlt,
  UilTruck
} from "@iconscout/react-unicons";

// Semua menu yang bisa ditampilkan
const allMenu = [
  { heading: "Dashboard", icon: UilEstate, link: "/dashboard" },
  { heading: "Power Data", icon: UilChart, link: "/power-data" },
  { heading: "Non Fungible Token", icon: UilUsdCircle, link: "/non-fungible-token" },
  { heading: "Perangkat", icon: UilRocket, link: "/devices" },
  { heading: "Penyewaan", icon: UilCar, link: "/penyewaan" },
  { heading: "Shipping", icon: UilTruck, link: "/shipping", role: "admin" },
  { heading: "Pembayaran", icon: UilMoneyBill, link: "/payments", role: "admin" },
  { heading: "Laporan Keuangan", icon: UilFileAlt, link: "/reports", role: "admin" },
  { heading: "Manajemen Pengguna", icon: UilUsersAlt, link: "/admin", role: "admin" },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(window.innerWidth > 768);
  const role = localStorage.getItem("role") || "guest";

  // Filter menu berdasarkan role
  const filteredMenu = allMenu.filter((item) => {
    if (item.role && item.role !== role) return false;
    return true;
  });

  useEffect(() => {
    const handleResize = () => setExpanded(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div className="bars" onClick={() => setExpanded((prev) => !prev)}>
        <UilBars />
      </div>

      <div
        className={`sidebar ${expanded ? "open" : "closed"}`}
        style={{
          left: expanded ? "0" : "-100%",
          position: window.innerWidth <= 768 ? "fixed" : "relative",
        }}
      >
        {/* ---------- Logo & Lokasi ---------- */}
        <div className="logo">
          <img src={Logo} alt="logo" className="logo-img" />
          <div className="logo-text">
            <span className="brand-name">
              Ro<span>o</span>ne
            </span>
            <NavLink to="/addresses">
              <img src={IconLokasi} className="icon-lokasi" alt="lokasi" />
            </NavLink>
          </div>
        </div>

        <div className="role-badge">Role: {role}</div>

        {/* ---------- Menu Navigasi ---------- */}
        <div className="menu">
          {filteredMenu.map(({ heading, icon: Icon, link }) => (
            <NavLink
              key={link}
              to={link}
              className={({ isActive }) => `menuItem ${isActive ? "active" : ""}`}
              onClick={() => window.innerWidth <= 768 && setExpanded(false)}
            >
              <Icon />
              <span>{heading}</span>
            </NavLink>
          ))}

          <div className="menuItem signout-section">
            <NavLink to="/" className="menuItemLink">
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
