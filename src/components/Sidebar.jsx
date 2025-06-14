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
  UilUsersAlt,
} from "@iconscout/react-unicons";

const allSidebarData = [
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

  const role = localStorage.getItem("role") || "guest";

  const filteredSidebarData = allSidebarData.filter((item) => {
    if (role === "user") {
      return !["/payments", "/reports", "/admin"].includes(item.link);
    }
    return true;
  });

  useEffect(() => {
    const handleResize = () => {
      setExpanded(window.innerWidth > 768);
    };
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
          left: expanded ? "0" : window.innerWidth <= 768 ? "-100%" : "0",
          position: window.innerWidth <= 768 ? "fixed" : "relative",
        }}
      >
        <div className="logo">
          <img src={Logo} alt="logo" />
          <span>
            Ro<span>o</span>ne
          </span>
        </div>

        <div className="role-badge">Role: {role}</div>

        <div className="menu">
          {filteredSidebarData.map((item, index) => {
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
