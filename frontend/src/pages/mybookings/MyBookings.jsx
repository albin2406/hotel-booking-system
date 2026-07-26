import React, { useEffect, useState } from "react";
import API from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import "./mybookings.css";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my-bookings");
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setBookings(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayment = async (bookingId) => {
    try {
      const res = await API.post("/payment/checkout-session", { bookingId });
      window.location.href = res.data.url;
    } catch (error) {
      console.log(error);
    }
  };

  const statusClass = (status) => {
    if (status === "approved") return "badge badge--approved";

    if (status === "confirmed") return "badge badge--confirmed";

    if (status === "rejected") return "badge badge--rejected";

    return "badge badge--pending";
  };

  const paymentClass = (status) => {
    if (status === "paid") return "badge badge--approved";
    return "badge badge--pending";
  };

  const hasConfirmedBooking = bookings.some((b) => b.status === "confirmed");

  return (
    <div className="myBookings">
      <div className="myBookings-header">
        <div className="myBookings-title-wrap">
          <span className="myBookings-eyebrow">Your Reservations</span>
          <h2>My Bookings</h2>
        </div>

        <div className="myBookings-header-actions">
          {hasConfirmedBooking && (
            <button
              className="home-btn filled"
              onClick={() => navigate("/write-review")}
            >
              <svg
                className="home-btn-icon"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14.5 3.5L16.5 5.5L7 15L3.5 15.5L4 12L14.5 3.5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Write a Review</span>
            </button>
          )}

          <button className="home-btn" onClick={() => navigate("/")}>
            <svg
              className="home-btn-icon"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 10L10 3L17 10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 8V16H8.5V12H11.5V16H15V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Home</span>
          </button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <div className="empty-state">
          <p>No bookings found.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Room</th>
                <th>Booked On</th>
                <th>Check-In</th>
                <th>Check-Out</th>
                <th>Total Price</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="td-room">{booking.room?.type} Room</td>
                  <td>
                    {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>
                    {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>₹{booking.totalPrice?.toLocaleString("en-IN")}</td>
                  <td>
                    <span className={statusClass(booking.status)}>
                      {booking.status}
                    </span>
                  </td>
                  <td>
                    <span className={paymentClass(booking.paymentStatus)}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td>
                    {booking.status === "approved" &&
                    booking.paymentStatus === "pending" ? (
                      <button onClick={() => handlePayment(booking._id)}>
                        Pay Now
                      </button>
                    ) : booking.status === "pending" ? (
                      <span className="action-text waiting">
                        Awaiting Approval
                      </span>
                    ) : booking.status === "confirmed" ? (
                      <span className="action-text success">
                        Booking Confirmed
                      </span>
                    ) : booking.status === "rejected" ? (
                      <span className="action-text rejected">
                        Request Rejected
                      </span>
                    ) : (
                      <span className="action-text">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyBookings;