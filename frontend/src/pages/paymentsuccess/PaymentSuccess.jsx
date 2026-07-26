import React, { useEffect } from "react";
import API from "../../services/api.js";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./paymentsuccess.css";

const PaymentSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const bookingId = params.get("bookingId");

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        if (!bookingId) return;

        await API.get(`/payment/success?bookingId=${bookingId}`);

        setTimeout(() => {
          navigate("/my-bookings");
        }, 3000);
      } catch (error) {
        console.log(error);
      }
    };

    confirmPayment();
  }, [bookingId, navigate]);

  return (
    <div className="payment-success">
      <div className="payment-card">
        <div className="success-icon">
          <div className="checkmark"></div>
        </div>

        <h1>Payment Successful</h1>

        <p>
          Your payment has been received successfully and your booking has been
          confirmed.
        </p>

        <div className="redirect-text">
          Redirecting to your bookings...
        </div>

        <button
          className="booking-btn"
          onClick={() => navigate("/my-bookings")}
        >
          View My Bookings
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;