import React, { useState, useEffect } from "react";
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

  // Cek token saat pertama kali komponen di-render
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginClick = () => {
    if (isLoggedIn) {
      handleLogout(); // Klik ulang jadi Log Out
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
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);

      showSuccessNotification("✅ Login berhasil! Selamat datang kembali.");
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

      const data = await response.json();
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
        const errorData = await response.json();
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
      <div className="n-right">
        <div className="n-list">
          <ul>
            <li>
              <Link activeClass="active" to="Navbar" spy={true} smooth={true}>
                Home
              </Link>
            </li>
            <li>
              <Link to="services" spy={true} smooth={true}>
                Services
              </Link>
            </li>
            <li>
              <Link to="works" spy={true} smooth={true}>
                Experience
              </Link>
            </li>
            <li>
              <button className={`button n-button ${loginClicked ? "clicked" : ""}`} onClick={handleLoginClick}>
                {isLoggedIn ? "Log Out" : "Login"}
              </button>
            </li>
          </ul>
        </div>
        <a href="https://wa.me/6282178452180" target="_blank" rel="noopener noreferrer">
          <button className="button n-button contact-button">Contact</button>
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
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" required />
            </div>
            <div className="form-group">
              <input type="checkbox" id="remember-me" name="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit" className="login-btn">Sign In</button>
          </form>
          <p>
            Don't have an account?{" "}
            <a href="#" onClick={handleSignUpClick}>Sign up</a>
          </p>
        </div>
      )}

      {showSignUpForm && (
        <div className="login-form">
          <button className="close-btn" onClick={closeSignUpForm}>&times;</button>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" id="fullname" name="fullname" required />
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className="form-group">
              <label htmlFor="email-signup">Email</label>
              <input type="email" id="email-signup" name="email-signup" required />
            </div>
            <div className="form-group">
              <label htmlFor="password-signup">Password</label>
              <input type="password" id="password-signup" name="password-signup" required />
            </div>
            <button type="submit" className="login-btn">Sign Up</button>
          </form>
        </div>
      )}

      {showVerify && (
        <div className="login-form">
          <button className="close-btn" onClick={closeAllForms}>&times;</button>
          <h2>Verifikasi Email</h2>
          <form onSubmit={handleVerifySubmit}>
            <div className="form-group">
              <label htmlFor="otp">Kode OTP</label>
              <input type="text" id="otp" name="otp" required />
            </div>
            <button type="submit" className="login-btn">Verifikasi</button>
          </form>
          <button className="resend-otp" onClick={handleResendOTP} disabled={resendCooldown > 0}>
            Resend OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
