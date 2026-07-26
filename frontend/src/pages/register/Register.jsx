import React, { useState } from "react";
import "../login/login.css"; /* reuse same modal CSS */
import API from "../../services/api.js"
const Register = ({ onClose, switchToLogin }) => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/register", formData);
      alert("Account created! Please log in.");
      switchToLogin();
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-brand">StayEase</div>
        <h2 className="modal-title">Create Account</h2>
        <p className="modal-sub">Join us for seamless hotel bookings</p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="field-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="field-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="modal-btn" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="modal-switch">
          Already have an account?{" "}
          <span onClick={switchToLogin}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default Register;