import React, { useState } from "react";
import "./header.css";
import { useNavigate } from "react-router-dom";
import Login from "../../pages/login/Login";
import Register from "../../pages/register/Register";

const Header = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setMenuOpen(false);
    navigate("/");
    window.location.reload();
  };

  const closeMenu = () => setMenuOpen(false);

  const scrollToRooms = () => {
    if (window.location.pathname !== "/") {
      navigate("/");

      setTimeout(() => {
        document.getElementById("rooms-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);
    } else {
      document.getElementById("rooms-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <>
      <header className="header">
        {/* Logo */}
        <div className="logo" onClick={() => navigate("/")}>
          StayEase
        </div>

        {/* Desktop Nav */}
        <ul className="nav">
          <li onClick={() => navigate("/")}>Home</li>
          <li onClick={scrollToRooms}>Rooms</li>
          <li onClick={() => navigate("/about")}>About</li>
          <li onClick={() => navigate("/contact")}>Contact</li>
          {user && (
            <li onClick={() => navigate("/my-bookings")}>My Bookings</li>
          )}
        </ul>

        {/* Desktop Auth */}
        <div className="auth">
          {user ? (
            <>
              <span className="welcome">Hello, {user.name}</span>
              <button className="logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => setShowLogin(true)}>
                Login
              </button>
              <button
                className="register-btn"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </>
          )}
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? "hamburger--open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${menuOpen ? "mobile-drawer--open" : ""}`}>
        <nav className="mobile-nav">
          <a
            onClick={() => {
              navigate("/");
              closeMenu();
            }}
          >
            Home
          </a>
          <a
            onClick={() => {
              closeMenu();
              scrollToRooms();
            }}
          >
            Rooms
          </a>
          <a onClick={closeMenu}>About</a>
          <a onClick={closeMenu}>Contact</a>
          {user && (
            <a
              onClick={() => {
                navigate("/my-bookings");
                closeMenu();
              }}
            >
              My Bookings
            </a>
          )}
        </nav>
        <div className="mobile-auth">
          {user ? (
            <>
              <span className="mobile-welcome">Hello, {user.name}</span>
              <button className="mobile-logout" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="mobile-login-btn"
                onClick={() => {
                  setShowLogin(true);
                  closeMenu();
                }}
              >
                Login
              </button>
              <button
                className="mobile-register-btn"
                onClick={() => {
                  setShowRegister(true);
                  closeMenu();
                }}
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="drawer-overlay" onClick={closeMenu} />}

      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          switchToRegister={() => {
            setShowLogin(false);
            setShowRegister(true);
          }}
        />
      )}
      {showRegister && (
        <Register
          onClose={() => setShowRegister(false)}
          switchToLogin={() => {
            setShowRegister(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
};

export default Header;
