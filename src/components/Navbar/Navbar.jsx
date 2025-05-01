import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import "./Navbar.css";
import { Link } from "react-scroll";

const Navbar = () => {
  const [loginClicked, setLoginClicked] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          handleLogout();
          window.location.reload();
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Token invalid:", error);
        handleLogout();
      }
    }
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      handleLogout();
    } else {
      setShowSignUpForm(false);
      setShowVerify(false);
      setShowLoginForm(true);
      setLoginClicked(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    showSuccessNotification("🔒 Anda telah berhasil keluar.");
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
    setLoginClicked(false);
  };

  const handleSignUpClick = () => {
    setShowLoginForm(false);
    setShowVerify(false);
    setShowSignUpForm(true);
  };

  const closeSignUpForm = () => {
    setShowSignUpForm(false);
  };

  const closeAllForms = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowVerify(false);
    setLoginClicked(false);
  };

  const showSuccessNotification = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch("https://dev-api.xsmartagrichain.com/v1/authentications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login gagal.");
      }

      const data = await response.json();
      const accessToken = data.data.accessToken;
      const refreshToken = data.data.refreshToken;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      try {
        const decoded = jwtDecode(accessToken);
        const role = decoded.role;
        if (role) {
          localStorage.setItem("role", role);
        }
      } catch (err) {
        console.error("Gagal decode token:", err);
      }

      showSuccessNotification(`✅ Login berhasil! Selamat datang kembali ${localStorage.getItem("role")}`);
      setShowLoginForm(false);
      setLoginClicked(false);
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Login Error:", error);
      showSuccessNotification(`❌ ${error.message}`, "error");
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const fullname = e.target.fullname.value;
    const username = e.target.username.value;
    const email = e.target["email-signup"].value;
    const password = e.target["password-signup"].value;

    try {
      const response = await fetch("https://dev-api.xsmartagrichain.com/v1/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Pendaftaran gagal.");
      }

      setShowSignUpForm(false);
      setShowVerify(true);
      setRegisteredEmail(email);
      showSuccessNotification("✅ Sign Up berhasil! Silakan verifikasi email Anda.");
    } catch (error) {
      console.error("Sign Up Error:", error);
      showSuccessNotification(error.message || "❌ Pendaftaran gagal.", "error");
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;

    try {
      const response = await fetch("https://dev-api.xsmartagrichain.com/v1/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, otp }),
      });

      if (response.status === 200) {
        showSuccessNotification("✅ OTP berhasil diverifikasi!");
        setShowVerify(false);
        setShowLoginForm(true);
      } else {
        showSuccessNotification("❌ OTP salah atau kadaluarsa.", "error");
      }
    } catch (error) {
      console.error("Error verifikasi OTP:", error);
      showSuccessNotification("❌ Terjadi kesalahan jaringan saat verifikasi.", "error");
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    if (resendCooldown > 0) return;

    try {
      const response = await fetch("https://dev-api.xsmartagrichain.com/v1/users/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mengirim ulang OTP.");
      }

      const data = await response.json();
      showSuccessNotification("✅ " + data.message);
      setResendCooldown(60);

      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Resend OTP error:", error);
      showSuccessNotification(error.message, "error");
    }
  };

  return (
    <div className="n-wrapper" id="Navbar">
      <div className="n-left">
        <div className="n-name">Roone</div>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <div className={`n-right ${isMenuOpen ? "open" : ""}`}>
        <div className="n-list">
          <ul>
            <li><Link activeClass="active" to="Navbar" spy={true} smooth={true}>Home</Link></li>
            <li><Link to="services" spy={true} smooth={true}>Services</Link></li>
            <li><Link to="works" spy={true} smooth={true}>Experience</Link></li>
            <li>
              <button className={`button n-button ${loginClicked ? "clicked" : ""}`} onClick={handleLoginClick}>
                {isLoggedIn ? "Log Out" : "Login"}
              </button>
            </li>
          </ul>
        </div>
        <a href="https://wa.me/6282178452180" target="_blank" rel="noopener noreferrer">
          <button className="button n-button contact-button">kontak</button>
        </a>
      </div>

      {(showLoginForm || showSignUpForm || showVerify) && (
        <div className="login-overlay active" onClick={closeAllForms}></div>
      )}

      {showNotification && (
        <div className={`notification ${notificationType}`}>{notificationMessage}</div>
      )}

      {showLoginForm && (
        <div className="login-form">
          <button className="close-btn" onClick={closeLoginForm}>&times;</button>
          <h2>Sign In</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group"><label>Email</label><input type="email" name="email" required /></div>
            <div className="form-group"><label>Password</label><input type="password" name="password" required /></div>
            <div className="form-group">
              <input type="checkbox" id="remember-me" name="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit" className="login-btn">Sign In</button>
          </form>
          <p>Don't have an account? <a href="#" onClick={handleSignUpClick}>Sign up</a></p>
        </div>
      )}

      {showSignUpForm && (
        <div className="login-form">
          <button className="close-btn" onClick={closeSignUpForm}>&times;</button>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group"><label>Full Name</label><input type="text" name="fullname" required /></div>
            <div className="form-group"><label>Username</label><input type="text" name="username" required /></div>
            <div className="form-group"><label>Email</label><input type="email" name="email-signup" required /></div>
            <div className="form-group"><label>Password</label><input type="password" name="password-signup" required /></div>
            <button type="submit" className="login-btn">Register</button>
          </form>
        </div>
      )}

      {showVerify && (
        <div className="login-form">
          <button className="close-btn" onClick={() => setShowVerify(false)}>&times;</button>
          <h2>Verifikasi Email</h2>
          <p>Masukkan kode OTP yang dikirim ke email Anda.</p>
          <form onSubmit={handleVerifySubmit}>
            <div className="form-group"><input type="text" name="otp" placeholder="Masukkan OTP" required /></div>
            <button type="submit" className="login-btn">Verifikasi</button>
          </form>
          <button onClick={handleResendOTP} disabled={resendCooldown > 0}>
            Kirim Ulang OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
