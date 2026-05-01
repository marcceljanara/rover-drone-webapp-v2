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
  UilCar,
  UilMoneyBill,
  UilFileAlt,
  UilUsersAlt,
  UilTruck,
  UilHistory,
  UilCommentAlt,
} from "@iconscout/react-unicons";

import { useAuth } from "../context/AuthContext"; // ✅ ambil dari context

// Menu data
const menuData = [
  { heading: "Dashboard", icon: UilEstate, link: "/dashboard" },
  { heading: "Chat Bot", icon: UilCommentAlt, link: "/chats" },
  { heading: "Perangkat", icon: UilRocket, link: "/devices" },
  { heading: "Penyewaan", icon: UilCar, link: "/penyewaan" },
  { heading: "Pembayaran", icon: UilMoneyBill, link: "/payments" },
  { heading: "Pengiriman", icon: UilTruck, link: "/pengiriman" },
  { heading: "Return", icon: UilHistory, link: "/returns" },
  { heading: "Laporan Keuangan", icon: UilFileAlt, link: "/reports" },
  { heading: "Manajemen Pengguna", icon: UilUsersAlt, link: "/admin" },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ ambil user dari AuthContext
  const { user, isAuthenticated, setUser } = useAuth();
  const role = user?.role || "guest";

  // ✅ filter menu berdasarkan role
  const filteredMenu = menuData.filter((item) =>
    role === "user"
      ? !["/reports", "/admin", "/pengiriman", "/returns"].includes(item.link)
      : true
  );

  // Fungsi resize untuk mengatur expanded berdasarkan device
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setExpanded(!mobile);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fungsi klik icon lokasi
  const handleIconLokasiClick = () => {
    if (location.pathname === "/addresses" && isMobile) {
      setExpanded(false);
    } else {
      navigate("/addresses");
      if (isMobile) setExpanded(false);
    }
  };

  // ✅ handle logout
  const handleLogout = async () => {
    try {
      await fetch(process.env.REACT_APP_API_URL + "/v1/authentications", {
        method: "DELETE",
        credentials: "include",
      });
      setUser(null); // reset context
      window.location.href = "/"; // redirect ke home/login
    } catch {
      console.error("Logout gagal.");
    }
  };

  return (
    <>
      <button
        className="bars"
        type="button"
        aria-label={expanded ? "Tutup menu navigasi" : "Buka menu navigasi"}
        aria-expanded={expanded}
        aria-controls="primary-sidebar"
        onClick={() => setExpanded((prev) => !prev)}
      >
        <UilBars />
      </button>

      {isMobile && expanded && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Tutup menu navigasi"
          onClick={() => setExpanded(false)}
        />
      )}

      <nav
        id="primary-sidebar"
        className={`sidebar ${expanded ? "open" : "closed"}`}
        aria-label="Navigasi utama"
      >
        <div className="logo">
          <img src={Logo} alt="logo" className="logo-img" />
          <div className="logo-text">
            <span className="brand-name">
              A<span>gro</span>S
            </span>
            <button
              type="button"
              className={`location-button ${location.pathname === "/addresses" ? "active" : ""}`}
              onClick={handleIconLokasiClick}
              aria-label="Buka alamat lokasi"
            >
              <img src={IconLokasi} className="icon-lokasi" alt="" />
            </button>
          </div>
        </div>

        <div className="role-badge">
          {isAuthenticated ? `Role: ${role}` : "Not logged in"}
        </div>

        {/* Menu */}
        <div className="menu">
          {filteredMenu.map(({ heading, icon: Icon, link }) => (
            <NavLink
              key={link}
              to={link}
              className={({ isActive }) => `menuItem ${isActive ? "menuItemActive" : ""}`}
              onClick={() => isMobile && setExpanded(false)}
            >
              <Icon />
              <span>{heading}</span>
            </NavLink>
          ))}

          {isAuthenticated && (
            <button className="menuItem signout-section" type="button" onClick={handleLogout}>
              <UilSignOutAlt />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
