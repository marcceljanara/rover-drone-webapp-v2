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
  const [notificationType, setNotificationType] = useState("success"); // atau 'error'


  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);



  const handleLoginClick = () => {
    setShowSignUpForm(false);
    setShowVerify(false);
    setShowLoginForm(true);
    setLoginClicked(true);
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
    setNotificationType(type); // <--- ini dia
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Login gagal.");
      }
  
      // Simpan token ke localStorage
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
  
      // Tampilkan notifikasi sukses
      showSuccessNotification("✅ Login berhasil! Selamat datang kembali.");
  
      // Tutup form login
      setShowLoginForm(false);
      setLoginClicked(false);
  
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ fullname, username, email, password })
      });
      console.log(response.body);

      if (!response.ok) {
        throw new Error("Pendaftaran gagal.");
      }

      const data = await response.json();
      console.log("Register response:", data);

      setShowSignUpForm(false);
      setShowVerify(true);
      setRegisteredEmail(email);
      showSuccessNotification("✅ Sign Up berhasil! Silakan verifikasi email Anda.");
    } catch (error) {
      console.error("Sign Up Error:", error);
      showSuccessNotification(error.body.message, 'error');
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
  
    const otp = e.target.otp.value;
  
    try {
      const response = await fetch("https://dev-api.xsmartagrichain.com/v1/users/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: registeredEmail,
          otp
        })
      });
  
      if (response.status === 200) {
        showSuccessNotification("✅ OTP berhasil diverifikasi!");
        setShowVerify(false);
        setShowLoginForm(true);
      } else {
        const errorData = await response.json();
        console.error("Verifikasi gagal:", errorData);
        showSuccessNotification("❌ OTP salah atau sudah kadaluarsa.", 'error');
      }
    } catch (error) {
      console.error("Error saat verifikasi OTP:", error);
      showSuccessNotification("❌ Terjadi kesalahan jaringan saat verifikasi.", 'error');
    }
  };

  const handleResendOTP = async (e) => {
    e.preventDefault();
    
    if (resendCooldown > 0) return;
  
    try {
      const response = await fetch("https://dev-api.xsmartagrichain.com/v1/users/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: registeredEmail })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Gagal mengirim ulang OTP.");
      }
  
      showSuccessNotification("✅ " + data.message);
      setResendCooldown(60);
  
      const interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
  
    } catch (error) {
      console.error("Resend OTP error:", error);
      showSuccessNotification(error.message, 'error');
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

      {(showLoginForm || showSignUpForm || showVerify) && (
        <div className="login-overlay active" onClick={closeAllForms}></div>
      )}

      {showNotification && (
        <div className={`notification ${notificationType}`}>
          {notificationMessage}
        </div>
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
              <input type="email" id="email-signup" name="email-signup" required />
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
          <h2>Silahkan lakukan verifikasi akun</h2>
          <form onSubmit={handleVerifySubmit}>
            <label htmlFor="otp">OTP</label>
            <input type="text" id="otp" name="otp" maxLength="6" required />
            <ul className="otp-hints">
              <li>Masukkan 6 digit angka yang diterima email</li>
            </ul>
            <button type="submit" className="login-btn">Verify</button>
            <p className="terms">
              By creating an account, you agree to the{" "}
              <a href="#">Terms of use</a> and <a href="#">Privacy Policy</a>.
            </p>
            <p className="resend">
            Not received OTP?{" "}
            <a href="#" onClick={handleResendOTP} style={{ pointerEvents: resendCooldown > 0 ? 'none' : 'auto', opacity: resendCooldown > 0 ? 0.5 : 1 }}>
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend"}
            </a>
          </p>

          </form>
        </div>
      )}
    </div>
  );
};

export default Navbar;
