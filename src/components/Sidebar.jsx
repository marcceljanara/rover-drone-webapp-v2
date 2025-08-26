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
      setExpanded(window.innerWidth > 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fungsi klik icon lokasi
  const handleIconLokasiClick = () => {
    if (location.pathname === "/addresses" && window.innerWidth <= 1024) {
      setExpanded(false);
    } else {
      navigate("/addresses");
      if (window.innerWidth <= 1024) setExpanded(false);
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
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  return (
    <>
      {/* Tombol hamburger */}
      <div className="bars" onClick={() => setExpanded((prev) => !prev)}>
        <UilBars />
      </div>

      {/* Sidebar */}
      <div
        className={`sidebar ${expanded ? "open" : "closed"}`}
        style={{
          left: expanded ? "0" : "-100%",
          position: window.innerWidth <= 1024 ? "fixed" : "relative",
          zIndex: 100,
        }}
      >
        <div className="logo">
          <img src={Logo} alt="logo" className="logo-img" />
          <div className="logo-text">
            <span className="brand-name">
              A<span>gro</span>S
            </span>
            <img
              src={IconLokasi}
              className={`icon-lokasi ${location.pathname === "/addresses" ? "active" : ""}`}
              alt="lokasi"
              onClick={handleIconLokasiClick}
            />
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
              className={({ isActive }) => `menuItem ${isActive ? "active" : ""}`}
              onClick={() => window.innerWidth <= 1024 && setExpanded(false)}
            >
              <Icon />
              <span>{heading}</span>
            </NavLink>
          ))}

          {isAuthenticated && (
            <div className="menuItem signout-section" onClick={handleLogout}>
              <UilSignOutAlt />
              <span>Sign Out</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
