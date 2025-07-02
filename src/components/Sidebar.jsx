// Sidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
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
  UilHistory,
} from "@iconscout/react-unicons";

const menuData = [
  { heading: "Dashboard", icon: UilEstate, link: "/dashboard" },
  { heading: "Perangkat", icon: UilRocket, link: "/devices" },
  { heading: "Penyewaan", icon: UilCar, link: "/penyewaan" },
  { heading: "Pembayaran", icon: UilMoneyBill, link: "/payments" },
  { heading: "Pengiriman", icon: UilTruck, link: "/pengiriman" },
  { heading: "Return", icon: UilHistory, link: "/returns" },
  { heading: "Laporan Keuangan", icon: UilFileAlt, link: "/reports" },
  { heading: "Manajemen Pengguna", icon: UilUsersAlt, link: "/admin" },
  { heading: "Non Fungible Token", icon: UilUsdCircle, link: "/non-fungible-token" },
  { heading: "Power Data", icon: UilChart, link: "/power-data" },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(window.innerWidth > 768);
  const role = localStorage.getItem("role") || "guest";
  const navigate = useNavigate();
  const location = useLocation();

  const filteredMenu = menuData.filter((item) =>
    role === "user"
      ? !["/payments", "/reports", "/admin", "/pengiriman", "/returns"].includes(item.link)
      : true
  );

  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleIconLokasiClick = () => {
    if (location.pathname === "/addresses" && window.innerWidth <= 768) {
      setExpanded(false);
    } else {
      navigate("/addresses");
      if (window.innerWidth <= 768) {
        setExpanded(true);
      }
    }
  };

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
          zIndex: 100,
        }}
      >
        <div className="logo">
          <img src={Logo} alt="logo" className="logo-img" />
          <div className="logo-text">
            <span className="brand-name">
              Ro<span>o</span>ne
            </span>
            <img
              src={IconLokasi}
              className={`icon-lokasi ${location.pathname === "/addresses" ? "active" : ""}`}
              alt="lokasi"
              onClick={handleIconLokasiClick}
            />
          </div>
        </div>

        <div className="role-badge">Role: {role}</div>

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
