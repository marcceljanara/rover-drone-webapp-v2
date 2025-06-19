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
  UilTruck,
  UilHistory, // ✅ Ikon untuk Return
} from "@iconscout/react-unicons";

// Menu utama aplikasi
const menuData = [
  { heading: "Dashboard", icon: UilEstate, link: "/dashboard" },
  { heading: "Power Data", icon: UilChart, link: "/power-data" },
  { heading: "Non Fungible Token", icon: UilUsdCircle, link: "/non-fungible-token" },
  { heading: "Perangkat", icon: UilRocket, link: "/devices" },
  { heading: "Penyewaan", icon: UilCar, link: "/penyewaan" },
  { heading: "Pembayaran", icon: UilMoneyBill, link: "/payments" },
  { heading: "Laporan Keuangan", icon: UilFileAlt, link: "/reports" },
  { heading: "Manajemen Pengguna", icon: UilUsersAlt, link: "/admin" },
  { heading: "Pengiriman", icon: UilTruck, link: "/pengiriman" },
  { heading: "Return", icon: UilHistory, link: "/returns" }, // ✅ Menu Return
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(window.innerWidth > 768);
  const role = localStorage.getItem("role") || "guest";

  // Filter menu sesuai role
  const filteredMenu = menuData.filter((item) =>
    role === "user"
      ? !["/payments", "/reports", "/admin"].includes(item.link)
      : true
  );

  // Toggle menu responsif berdasarkan ukuran layar
  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Tombol Toggle untuk mobile */}
      <div className="bars" onClick={() => setExpanded((prev) => !prev)}>
        <UilBars />
      </div>

      {/* Sidebar utama */}
      <div
        className={`sidebar ${expanded ? "open" : "closed"}`}
        style={{
          left: expanded ? "0" : "-100%",
          position: window.innerWidth <= 768 ? "fixed" : "relative",
          zIndex: 100,
        }}
      >
        {/* Logo dan Lokasi */}
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

        {/* Role Badge */}
        <div className="role-badge">Role: {role}</div>

        {/* Daftar Menu Navigasi */}
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

          {/* Tombol Sign Out */}
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
