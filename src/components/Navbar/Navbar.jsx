import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-scroll";

const Navbar = () => {
  const [loginClicked, setLoginClicked] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setLoginClicked(true);
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
    setLoginClicked(false);
  };

  const handleSignUpClick = () => {
    setShowLoginForm(false);
    setShowSignUpForm(true);
  };

  const closeSignUpForm = () => {
    setShowSignUpForm(false);
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
    closeLoginForm();
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    showSuccessNotification("Sign up berhasil! Silakan login.");
    setShowSignUpForm(false);
    setShowLoginForm(true);
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

      {(showLoginForm || showSignUpForm) && (
        <div className="login-overlay active" onClick={closeLoginForm}></div>
      )}

      {showNotification && (
        <div className="notification">{notificationMessage}</div>
      )}

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
            <button type="submit" className="login-btn">
              Sign In
            </button>
          </form>
          <p>
            Don't have an account?{" "}
            <a href="#" onClick={handleSignUpClick}>
              Sign up
            </a>
          </p>
        </div>
      )}

      {showSignUpForm && (
        <div className="login-form">
          <button className="close-btn" onClick={closeSignUpForm}>
            &times;
          </button>
          <h2>Sign Up</h2>
          <form onSubmit={handleSignUpSubmit}>
            <div className="form-group">
              <label htmlFor="fullname">Full Name</label>
              <input type="text" id="fullname" name="fullname" required />
            </div>
            <div className="form-group">
              <label htmlFor="email-signup">Email</label>
              <input type="text" id="email-signup" name="email-signup" required />
            </div>
            <div className="form-group">
              <label htmlFor="password-signup">Password</label>
              <input type="password" id="password-signup" name="password-signup" required />
            </div>
            <button type="submit" className="login-btn">
              Sign Up
            </button>
          </form>
          <p>
            Already have an account?{" "}
            <a href="#" onClick={handleLoginClick}>
              Sign in
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
