import React, { useState } from "react";
import "./cta.css";
import Login from "../../../pages/login/Login";
import Register from "../../../pages/register/Register";

const CTA = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  if (user) return null; // hide CTA when logged in

  return (
    <>
      <div className="cta">
        <div className="cta-inner">
          <span className="cta-tag">Members Only</span>
          <h2 className="cta-title">Ready to Experience Luxury?</h2>
          <p className="cta-sub">Create an account or sign in to book rooms, manage reservations, and unlock exclusive rates.</p>
          <div className="ctaButtons">
            <button className="cta-login" onClick={() => setShowLogin(true)}>Sign In</button>
            <button className="cta-register" onClick={() => setShowRegister(true)}>Create Account</button>
          </div>
        </div>
      </div>

      {showLogin && (
        <Login onClose={() => setShowLogin(false)} switchToRegister={() => { setShowLogin(false); setShowRegister(true); }} />
      )}
      {showRegister && (
        <Register onClose={() => setShowRegister(false)} switchToLogin={() => { setShowRegister(false); setShowLogin(true); }} />
      )}
    </>
  );
};

export default CTA;