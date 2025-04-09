import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-scroll";

const Navbar = () => {
  const [loginClicked, setLoginClicked] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleLoginClick = () => {
    setShowSignUpForm(false);
    setShowLoginForm(true);
    setLoginClicked(true);
    setShowVerify(false);
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
    setLoginClicked(false);
  };

  const handleSignUpClick = () => {
    setShowLoginForm(false);
    setShowSignUpForm(true);
    setShowVerify(false);
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

  const showSuccessNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    showSuccessNotification("✅ Login berhasil! Selamat datang kembali.");
    setShowLoginForm(false);
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    showSuccessNotification("✅ Sign up berhasil! Silakan verifikasi akun.");
    setShowSignUpForm(false);
    setShowVerify(true); // Langsung masuk ke verify setelah sign up
  };

  const handleVerifySubmit = (e) => {
    e.preventDefault();
    const otp = e.target.otp.value;
    if (otp.trim().length >= 4) {
      showSuccessNotification("✅ OTP berhasil diverifikasi!");
      setShowVerify(false);
      setShowLoginForm(true); // Setelah verifikasi berhasil, masuk ke login
    } else {
      alert("❌ Masukkan OTP yang valid.");
    }
  };

  const handleResendOTP = (e) => {
    e.preventDefault();
    alert("🔄 OTP berhasil dikirim ulang!");
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
              <button
                className={`button n-button ${loginClicked ? "clicked" : ""}`}
                onClick={handleLoginClick}
              >
                Login
              </button>
            </li>
          </ul>
        </div>
        <a
          href="https://wa.me/6282178452180"
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="button n-button contact-button">Contact</button>
        </a>
      </div>

      {(showLoginForm || showSignUpForm || showVerify) && (
        <div className="login-overlay active" onClick={closeAllForms}></div>
      )}

      {showNotification && (
        <div className="notification">{notificationMessage}</div>
      )}

      {/* SIGN IN */}
      {showLoginForm && (
        <div className="login-form">
          <button className="close-btn" onClick={closeLoginForm}>
            &times;
          </button>
          <h2>Sign In</h2>
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" id="email" name="email" required />
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

      {/* SIGN UP */}
      {showSignUpForm && (
        <div className="login-form">
          <button className="close-btn" onClick={closeSignUpForm}>
            &times;
          </button>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Nama Lengkap</label>
              <input type="text" id="fullname" name="fullname" required />
            </div>
            <div className="form-group">
              <label htmlFor="username">Nama Pengguna</label>
              <input type="text" id="username" name="username" required />
            </div>
            <div className="form-group">
              <label htmlFor="email-signup">Email</label>
              <input type="text" id="email-signup" name="email-signup" required />
            </div>
            <div className="form-group">
              <label htmlFor="password-signup">Password</label>
              <input type="password" id="password-signup" name="password-signup" required />
            </div>
            <button type="submit" className="login-btn">Sign Up</button>
          </form>
          <p>
            Already have an account?{" "}
            <a href="#" onClick={handleLoginClick}>Sign in</a>
          </p>
        </div>
      )}

      {/* VERIFY OTP */}
      {showVerify && (
        <div className="login-form verify-form">
          <button className="close-btn" onClick={closeAllForms}>
            &times;
          </button>
          <h2>Let’s Go To Verify</h2>
          <form onSubmit={handleVerifySubmit}>
            <label htmlFor="otp">OTP</label>
            <input type="text" id="otp" name="otp" maxLength="6" required />
            <ul className="otp-hints">
              <li>Use 6 or more characters</li>
              <li>Use a number (e.g. 1234)</li>
              <li>Use upper and lower case letters (e.g. Aa)</li>
              <li>Use a symbol (e.g. !@#$)</li>
            </ul>
            <button type="submit" className="login-btn">Verify</button>
            <p className="terms">
              By creating an account, you agree to the{" "}
              <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
            </p>
            <p className="resend">
              Not received OTP?{" "}
              <a href="#" onClick={handleResendOTP}>Resend</a>
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Navbar;
