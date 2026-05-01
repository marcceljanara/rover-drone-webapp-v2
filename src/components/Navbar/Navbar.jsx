/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { UilBars, UilGoogle, UilTimes, UilEye, UilEyeSlash } from "@iconscout/react-unicons";
import "./Navbar.css";
import { Link } from "react-scroll";

const Navbar = () => {
  const [loginClicked, setLoginClicked] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [forgotPasswordCooldown, setForgotPasswordCooldown] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/v1/authentications/me`, {
      method: "GET",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data.data);
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  const showAppNotification = (message, type = "success") => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const closeAllForms = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowVerify(false);
    setShowForgotPassword(false);
    setLoginClicked(false);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleLoginClick = () => {
    setIsMenuOpen(false);
    if (user) {
      handleLogout();
      return;
    }

    setShowSignUpForm(false);
    setShowVerify(false);
    setShowForgotPassword(false);
    setShowLoginForm(true);
    setLoginClicked(true);
  };

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/v1/authentications/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      console.error("Logout gagal.");
    }

    setUser(null);
    showAppNotification("Anda telah berhasil keluar.");
  };

  const handleSignUpClick = () => {
    setShowLoginForm(false);
    setShowVerify(false);
    setShowForgotPassword(false);
    setShowSignUpForm(true);
  };

  const handleForgotPasswordClick = () => {
    setShowLoginForm(false);
    setShowSignUpForm(false);
    setShowVerify(false);
    setShowForgotPassword(true);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/authentications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Login gagal.");
      }

      const data = await response.json();
      setUser(data.data);
      showAppNotification(`Login berhasil. Selamat datang kembali ${data.data.role}.`);
      setShowLoginForm(false);
      setLoginClicked(false);
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login gagal.");
      showAppNotification(error.message, "error");
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
    const fullname = e.target.fullname.value;
    const username = e.target.username.value;
    const email = e.target["email-signup"].value;
    const password = e.target["password-signup"].value;
    const confirmPassword = e.target["confirm-password-signup"].value;

    if (password !== confirmPassword) {
      showAppNotification("Password dan konfirmasi password tidak cocok.", "error");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/users/register`, {
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
      showAppNotification("Sign Up berhasil. Silakan verifikasi email Anda.");
    } catch (error) {
      console.error("Pendaftaran pengguna gagal.");
      showAppNotification(error.message || "Pendaftaran gagal.", "error");
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/users/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail, otp }),
      });

      if (response.status === 200) {
        showAppNotification("OTP berhasil diverifikasi.");
        setShowVerify(false);
        setShowLoginForm(true);
      } else {
        showAppNotification("OTP salah atau kadaluarsa.", "error");
      }
    } catch {
      console.error("Verifikasi OTP gagal.");
      showAppNotification("Terjadi kesalahan jaringan saat verifikasi.", "error");
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    if (forgotPasswordCooldown > 0) return;

    const email = e.target.email.value;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/users/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Gagal mengirim email reset password.");

      showAppNotification(data.message);
      setForgotPasswordCooldown(120);

      const interval = setInterval(() => {
        setForgotPasswordCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error("Permintaan reset password gagal.");
      showAppNotification(error.message || "Gagal mengirim email reset password.", "error");
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    if (resendCooldown > 0) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/v1/users/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Gagal mengirim ulang OTP.");
      }

      const data = await response.json();
      showAppNotification(data.message);
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
      console.error("Pengiriman ulang OTP gagal.");
      showAppNotification(error.message, "error");
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header className="n-wrapper" id="Navbar">
        <div className="n-left">
          <a className="n-name" href="#Navbar" onClick={closeMenu}>AgroSwarm</a>
        </div>

        <button
          className="hamburger"
          type="button"
          aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          {isMenuOpen ? <UilTimes /> : <UilBars />}
        </button>

        <nav className={`n-right ${isMenuOpen ? "open" : ""}`} aria-label="Navigasi landing page">
          <div className="n-list">
            <ul>
              <li>
                <Link activeClass="active" to="Navbar" spy smooth onClick={closeMenu}>Home</Link>
              </li>
              <li>
                <Link to="services" spy smooth onClick={closeMenu}>Services</Link>
              </li>
              <li>
                <Link to="works" spy smooth onClick={closeMenu}>Experience</Link>
              </li>
            </ul>
          </div>
          <div className="nav-actions">
            <button className={`button n-button ${loginClicked ? "clicked" : ""}`} type="button" onClick={handleLoginClick}>
              {user ? "Log Out" : "Login"}
            </button>
            <a href="https://wa.me/6282178452180" target="_blank" rel="noopener noreferrer" className="contact-link" onClick={closeMenu}>
              Kontak
            </a>
          </div>
        </nav>
      </header>

      {(showLoginForm || showSignUpForm || showVerify || showForgotPassword) && (
        <button className="login-overlay active" type="button" aria-label="Tutup dialog" onClick={closeAllForms} />
      )}

      {showNotification && (
        <div className={`notification ${notificationType}`} role="status" aria-live="polite">
          {notificationMessage}
        </div>
      )}

      {showLoginForm && (
        <div className="login-form" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <button className="close-btn" type="button" aria-label="Tutup sign in" onClick={closeAllForms}>
            <UilTimes size="18" />
          </button>
          <h2 id="login-title">Sign In</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" type="email" name="email" autoComplete="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <div className="password-field-wrapper">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <UilEyeSlash size="18" /> : <UilEye size="18" />}
                </button>
              </div>
            </div>
            <div className="remember-group">
              <input type="checkbox" id="remember-me" name="remember-me" />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <button type="submit" className="login-btn">Sign In</button>
          </form>

          <div className="divider">Atau</div>
          <button
            className="google-btn"
            type="button"
            onClick={() => {
              window.location.href = `${process.env.REACT_APP_API_URL}/v1/authentications/google`;
            }}
          >
            <UilGoogle /> Login dengan Google
          </button>

          <p>
            Don't have an account?{" "}
            <button type="button" className="text-link" onClick={handleSignUpClick}>Sign up</button>
          </p>
          <p>
            <button type="button" className="text-link" onClick={handleForgotPasswordClick}>Forgot Password?</button>
          </p>
        </div>
      )}

      {showSignUpForm && (
        <div className="login-form" role="dialog" aria-modal="true" aria-labelledby="signup-title">
          <button className="close-btn" type="button" aria-label="Tutup sign up" onClick={closeAllForms}>
            <UilTimes size="18" />
          </button>
          <h2 id="signup-title">Sign Up</h2>
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group">
              <label htmlFor="signup-fullname">Full Name</label>
              <input id="signup-fullname" type="text" name="fullname" autoComplete="name" required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-username">Username</label>
              <input id="signup-username" type="text" name="username" autoComplete="username" required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-email">Email</label>
              <input id="signup-email" type="email" name="email-signup" autoComplete="email" required />
            </div>
            <div className="form-group">
              <label htmlFor="signup-password">Password</label>
              <div className="password-field-wrapper">
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password-signup"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <UilEyeSlash size="18" /> : <UilEye size="18" />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="signup-confirm-password">Konfirmasi Password</label>
              <div className="password-field-wrapper">
                <input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirm-password-signup"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                >
                  {showConfirmPassword ? <UilEyeSlash size="18" /> : <UilEye size="18" />}
                </button>
              </div>
            </div>
            <button type="submit" className="login-btn">Register</button>
          </form>
        </div>
      )}

      {showVerify && (
        <div className="login-form" role="dialog" aria-modal="true" aria-labelledby="verify-title">
          <button className="close-btn" type="button" aria-label="Tutup verifikasi" onClick={closeAllForms}>
            <UilTimes size="18" />
          </button>
          <h2 id="verify-title">Verifikasi Email</h2>
          <p>Masukkan kode OTP yang dikirim ke email Anda.</p>
          <form onSubmit={handleVerifySubmit}>
            <div className="form-group">
              <label htmlFor="verify-otp">Kode OTP</label>
              <input id="verify-otp" type="text" name="otp" placeholder="Masukkan OTP" inputMode="numeric" required />
            </div>
            <button type="submit" className="login-btn">Verifikasi</button>
          </form>
          <button className="resend-btn" type="button" onClick={handleResendOTP} disabled={resendCooldown > 0}>
            Kirim Ulang OTP {resendCooldown > 0 ? `(${resendCooldown}s)` : ""}
          </button>
        </div>
      )}

      {showForgotPassword && (
        <div className="login-form" role="dialog" aria-modal="true" aria-labelledby="forgot-title">
          <button className="close-btn" type="button" aria-label="Tutup forgot password" onClick={closeAllForms}>
            <UilTimes size="18" />
          </button>
          <h2 id="forgot-title">Forgot Password</h2>
          <p>Masukkan email Anda untuk menerima link reset password.</p>
          <form onSubmit={handleForgotPasswordSubmit}>
            <div className="form-group">
              <label htmlFor="forgot-email">Email</label>
              <input id="forgot-email" type="email" name="email" placeholder="Masukkan email Anda" autoComplete="email" required />
            </div>
            <button type="submit" className="login-btn" disabled={forgotPasswordCooldown > 0}>
              {forgotPasswordCooldown > 0 ? `Kirim Ulang (${formatTime(forgotPasswordCooldown)})` : "Kirim Link Reset"}
            </button>
          </form>
          <p>
            Ingat password Anda?{" "}
            <button
              type="button"
              className="text-link"
              onClick={() => {
                setShowForgotPassword(false);
                setShowLoginForm(true);
              }}
            >
              Kembali ke Login
            </button>
          </p>
        </div>
      )}
    </>
  );
};

export default Navbar;