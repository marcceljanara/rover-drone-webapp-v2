import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-scroll";

const Navbar = () => {
  const [loginClicked, setLoginClicked] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setLoginClicked(true);
  };

  const closeLoginForm = () => {
    setShowLoginForm(false);
    setLoginClicked(false);
  };

  return (
    <div className="n-wrapper" id="Navbar">
      {/* Navbar */}
      <div className="n-left">
        <div className="n-name">Roone</div>
      </div>
      <div className="n-right">
        <div className="n-list">
          <ul style={{ listStyleType: "none" }}>
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
        <a href="https://wa.me/6282178452180" target="_blank" rel="noopener noreferrer">
  <button className="button n-button contact-button">Contact</button>
</a>
      </div>

      {/* Overlay */}
      {showLoginForm && <div className="login-overlay active" onClick={closeLoginForm}></div>}

      {/* Login Form */}
      {showLoginForm && (
        <div className="login-form" id="login-form">
          <button className="close-btn" onClick={closeLoginForm}>
            &times;
          </button>
          <h2>Sign In</h2>
          <form id="signInForm">
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
            <button type="submit" className="login-btn" id="signInButton">
              Sign In
            </button>
          </form>
          <p>
            Don't have an account? <a href="#" id="signUpLink">Sign up</a>
          </p>
          <p>
            This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#">Learn more</a>.
          </p>
        </div>
      )}
    </div>
  );
};

export default Navbar;
