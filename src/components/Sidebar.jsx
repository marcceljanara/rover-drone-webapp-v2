import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import axios from "axios";
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
} from "@iconscout/react-unicons";

const menuData = [
  { heading: "Dashboard", icon: UilEstate, link: "/dashboard" },
  { heading: "Power Data", icon: UilChart, link: "/power-data" },
  { heading: "Non Fungible Token", icon: UilUsdCircle, link: "/non-fungible-token" },
  { heading: "Perangkat", icon: UilRocket, link: "/devices" },
  { heading: "Penyewaan", icon: UilCar, link: "/penyewaan" },
  { heading: "Pembayaran", icon: UilMoneyBill, link: "/payments" },
  { heading: "Laporan Keuangan", icon: UilFileAlt, link: "/reports" },
  { heading: "Manajemen Pengguna", icon: UilUsersAlt, link: "/admin" },
];

const Sidebar = () => {
  const [expanded, setExpanded] = useState(window.innerWidth > 768);
  const [showLocationBox, setShowLocationBox] = useState(false);
  const [searchProvinsi, setSearchProvinsi] = useState("");
  const [searchDistrict, setSearchDistrict] = useState("");
  const [searchSubDistrict, setSearchSubDistrict] = useState("");
  const [searchVillage, setSearchVillage] = useState("");

  const [districts, setDistricts] = useState([]);
  const [subDistricts, setSubDistricts] = useState([]);
  const [villages, setVillages] = useState([]);

  const [selectedProvinceCode, setSelectedProvinceCode] = useState("");
  const [selectedDistrictCode, setSelectedDistrictCode] = useState("");
  const [selectedSubDistrictCode, setSelectedSubDistrictCode] = useState("");

  const role = localStorage.getItem("role") || "guest";
  const location = useLocation();
  const boxRef = useRef(null);

  const filteredMenu = menuData.filter((item) =>
    role === "user"
      ? !["/payments", "/reports", "/admin"].includes(item.link)
      : true
  );

  useEffect(() => {
    const handleResize = () => setExpanded(window.innerWidth > 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShowLocationBox(false);
      }
    };
    if (showLocationBox) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showLocationBox]);

  const fetchAPI = async (url) => (await axios.get(url)).data.data;

  const handleSearchProvinsi = async (e) => {
    if (e.key === "Enter" && searchProvinsi.trim()) {
      try {
        const provinces = await fetchAPI("https://wilayah.id/api/provinces.json");
        const matched = provinces.find((p) =>
          p.name.toLowerCase() === searchProvinsi.trim().toLowerCase()
        );
        if (!matched) return alert("Provinsi tidak ditemukan.");

        setSelectedProvinceCode(matched.code);
        const districtRes = await fetchAPI(`https://wilayah.id/api/regencies/${matched.code}.json`);
        setDistricts(districtRes);
        setSelectedDistrictCode("");
        setSubDistricts([]);
        setVillages([]);
        alert(`Provinsi "${matched.name}" ditemukan.`);
      } catch (err) {
        alert("Gagal mencari provinsi.");
      }
    }
  };

  const handleSearchDistrictEnter = async (e) => {
    if (e.key === "Enter" && searchDistrict.trim()) {
      try {
        const provs = await fetchAPI("https://wilayah.id/api/provinces.json");
        const codes = provs.map((p) => p.code);
        let all = [];
        for (const code of codes) {
          const res = await fetchAPI(`https://wilayah.id/api/regencies/${code}.json`);
          all.push(...res);
        }
        const match = all.find((d) =>
          d.name.toLowerCase().includes(searchDistrict.trim().toLowerCase())
        );
        if (!match) return alert("Kabupaten/Kota tidak ditemukan.");

        setDistricts([match]);
        setSelectedDistrictCode(match.code);
        setSubDistricts([]);
        setVillages([]);
        alert(`Kabupaten/Kota "${match.name}" ditemukan.`);
        const subRes = await fetchAPI(`https://wilayah.id/api/districts/${match.code}.json`);
        setSubDistricts(subRes);
      } catch {
        alert("Gagal mencari kabupaten/kota.");
      }
    }
  };

  const handleSearchSubDistrictEnter = async (e) => {
    if (e.key === "Enter" && searchSubDistrict.trim()) {
      try {
        let all = [];
        for (const d of districts) {
          const res = await fetchAPI(`https://wilayah.id/api/districts/${d.code}.json`);
          all.push(...res);
        }
        const match = all.find((s) =>
          s.name.toLowerCase().includes(searchSubDistrict.trim().toLowerCase())
        );
        if (!match) return alert("Kecamatan tidak ditemukan.");
        setSubDistricts([match]);
        setSelectedSubDistrictCode(match.code);
        setVillages([]);
        alert(`Kecamatan "${match.name}" ditemukan.`);
        const villageRes = await fetchAPI(`https://wilayah.id/api/villages/${match.code}.json`);
        setVillages(villageRes);
      } catch {
        alert("Gagal mencari kecamatan.");
      }
    }
  };

  const handleSearchVillageEnter = async (e) => {
    if (e.key === "Enter" && searchVillage.trim()) {
      try {
        let all = [];
        for (const s of subDistricts) {
          const res = await fetchAPI(`https://wilayah.id/api/villages/${s.code}.json`);
          all.push(...res);
        }
        const match = all.find((v) =>
          v.name.toLowerCase().includes(searchVillage.trim().toLowerCase())
        );
        if (!match) return alert("Kelurahan tidak ditemukan.");
        setVillages([match]);
        alert(`Kelurahan "${match.name}" ditemukan.`);
      } catch {
        alert("Gagal mencari kelurahan.");
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
        }}
      >
        <div className="logo">
          <img src={Logo} alt="logo" className="logo-img" />
          <div className="logo-text" ref={boxRef}>
            <span className="brand-name">
              Ro<span>o</span>ne
            </span>
            <img
              src={IconLokasi}
              alt="lokasi"
              className={`icon-lokasi ${showLocationBox ? "active" : ""}`}
              onClick={() => setShowLocationBox((prev) => !prev)}
            />
            {showLocationBox && (
              <div className="lokasi-box-container active">
                <div className="lokasi-section">
                  <label>Provinsi</label>
                  <input
                    type="text"
                    placeholder="Ketik nama provinsi dan tekan Enter"
                    value={searchProvinsi}
                    onChange={(e) => setSearchProvinsi(e.target.value)}
                    onKeyDown={handleSearchProvinsi}
                  />
                </div>
                <div className="lokasi-section">
                  <label>Kabupaten/Kota</label>
                  <input
                    type="text"
                    placeholder="Ketik nama kabupaten/kota dan tekan Enter"
                    value={searchDistrict}
                    onChange={(e) => setSearchDistrict(e.target.value)}
                    onKeyDown={handleSearchDistrictEnter}
                  />
                </div>
                <div className="lokasi-section">
                  <label>Kecamatan</label>
                  <input
                    type="text"
                    placeholder="Ketik nama kecamatan dan tekan Enter"
                    value={searchSubDistrict}
                    onChange={(e) => setSearchSubDistrict(e.target.value)}
                    onKeyDown={handleSearchSubDistrictEnter}
                  />
                </div>
                <div className="lokasi-section">
                  <label>Kelurahan</label>
                  <input
                    type="text"
                    placeholder="Ketik nama kelurahan dan tekan Enter"
                    value={searchVillage}
                    onChange={(e) => setSearchVillage(e.target.value)}
                    onKeyDown={handleSearchVillageEnter}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="role-badge">Role: {role}</div>

        <div className="menu">
          {filteredMenu.map((item, index) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={index}
                to={item.link}
                className={({ isActive }) => `menuItem ${isActive ? "active" : ""}`}
                onClick={() => window.innerWidth <= 768 && setExpanded(false)}
              >
                <Icon />
                <span>{item.heading}</span>
              </NavLink>
            );
          })}

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
