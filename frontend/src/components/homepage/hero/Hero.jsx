import React, { useState } from "react";
import "./hero.css";
import { useNavigate } from "react-router-dom";

const Hero = ({ onSearch }) => {
  const [search, setSearch] = useState({
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) =>
    setSearch({ ...search, [e.target.name]: e.target.value });

  const handleSearch = () => {
    
    if (!search.checkIn || !search.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }

    if (search.checkOut <= search.checkIn) {
      alert("Check-out date must be after check-in date");
      return;
    }

    onSearch(search);

    setTimeout(() => {
      document.getElementById("rooms-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
  };

  return (
    <div className="hero">
      <div className="hero-overlay" />
      <div className="hero-content">
        <span className="hero-eyebrow">Luxury Redefined</span>
        <h1 className="hero-title">
          Your Perfect Stay
          <br />
          Awaits You
        </h1>
        <p className="hero-sub">
          Handpicked rooms. Exceptional comfort. Unforgettable memories.
        </p>

        <div className="searchBox">
          <div className="search-field">
            <label>Check In</label>
            <input
              type="date"
              name="checkIn"
              min={today}
              onChange={handleChange}
            />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <label>Check Out</label>
            <input
              type="date"
              name="checkOut"
              min={search.checkIn || today}
              onChange={handleChange}
            />
          </div>
          <div className="search-divider" />
          <div className="search-field">
            <label>Guests</label>
            <input
              type="number"
              name="guests"
              placeholder="2"
              min="1"
              onChange={handleChange}
            />
          </div>
          <button className="search-btn" onClick={handleSearch}>
            Check Availability
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;
