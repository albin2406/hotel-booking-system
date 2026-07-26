import React, { useState, useEffect } from "react";
import "./booking.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import API from "../../services/api.js";
import Header from "../../components/header/Header";

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const [checkIn, setCheckIn] = useState(params.get("checkIn") || "");
  const [checkOut, setCheckOut] = useState(params.get("checkOut") || "");
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get(`/rooms/${id}`).then((res) => setRoom(res.data));
  }, [id]);

  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, diff / (1000 * 60 * 60 * 24));
  };

  const totalDays = calculateDays();
  const totalPrice = room ? totalDays * room.price : 0;

  const handleBooking = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to book a room.");
      return;
    }
    if (totalDays <= 0) {
      alert("Please select valid dates.");
      return;
    }
    setLoading(true);
    
    try {
      await API.post("/bookings/create", { roomId: id, checkIn, checkOut });
      navigate("/my-bookings");
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  if (!room)
    return (
      <div className="booking-loading">
        <Header />
        <div className="loading-state">
          <span>Loading room details...</span>
        </div>
      </div>
    );

  return (
    <div className="bookingPage">
      <Header />

      <div className="booking-hero">
        <img
          src={
            room.images?.[0]
              ? `http://localhost:5000${room.images[0]}`
              : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80"
          }
          alt={room.title}
        />
        <div className="booking-hero-overlay" />
        <div className="booking-hero-text">
          <span className="booking-eyebrow">Reserve Your Room</span>
          <h1>{room.type} Room</h1>
        </div>
      </div>

      <div className="bookingContainer">
        <div className="booking-form-panel">
          <h2 className="booking-panel-title">Select Your Dates</h2>
          <div className="room-summary">
            <div className="summary-row">
              <span>Room Type</span>
              <strong>{room.type}</strong>
            </div>

            <div className="summary-row">
              <span>Capacity</span>
              <strong>{room.maxGuest} Guests</strong>
            </div>

            <div className="summary-row">
              <span>Status</span>
              <strong>{room.status}</strong>
            </div>
          </div>
          <div className="dateInputs">
            <div className="booking-field">
              <label>Check In</label>
              <input
                type="date"
                value={checkIn}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="booking-field">
              <label>Check Out</label>
              <input
                type="date"
                value={checkOut}
                min={checkIn || new Date().toISOString().split("T")[0]}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>

          <div className="priceInfo">
            <div className="price-row">
              <span>Price per night</span>
              <span>₹{room.price}</span>
            </div>
            <div className="price-row">
              <span>Duration</span>
              <span>
                {totalDays} night{totalDays !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="price-divider" />
            <div className="price-row total">
              <span>Total</span>
              <span>₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <button
            className="paymentBtn"
            onClick={handleBooking}
            disabled={loading || totalDays <= 0}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </button>
          <p className="booking-note">
            Booking is subject to admin approval. Payment is made after
            approval.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Booking;
