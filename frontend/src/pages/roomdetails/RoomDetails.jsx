import React from "react";
import "./roomdetails.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const FALLBACK =
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80";

const RoomDetails = ({ room, onClose, searchData }) => {
  const navigate = useNavigate();

  const handleBooking = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to book a room.");
      onClose();
      navigate("/login");
      return;
    }

    onClose();

    if (searchData?.checkIn && searchData?.checkOut) {
      navigate(
        `/booking/${room._id}` +
          `?checkIn=${searchData.checkIn}` +
          `&checkOut=${searchData.checkOut}` +
          `&guests=${searchData.guests || 1}`,
      );
    } else {
      navigate(`/booking/${room._id}`);
    }
  };

  const images = room.images?.length > 0 ? room.images : [null];

  return (
    <div className="rd-overlay" onClick={onClose}>
      <div className="rd-modal" onClick={(e) => e.stopPropagation()}>
        {/* Close */}
        <button className="rd-close" onClick={onClose} aria-label="Close">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* ── Hero gallery ── */}
        <div className="rd__gallery">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true, type: "fraction" }}
            autoplay={{ delay: 4500, disableOnInteraction: true }}
            loop={images.length > 1}
            spaceBetween={0}
            slidesPerView={1}
            className="rd__swiper"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
                <img
                  src={img ? `${BASE_URL}${img}` : FALLBACK}
                  alt={`${room.type} – photo ${i + 1}`}
                  className="rd__img"
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Gradient overlay */}
          <div className="rd__gradient" />

          {/* Floating price */}
          <div className="rd__price-card">
            <span className="rd__price-amount">
              ₹{room.price?.toLocaleString("en-IN")}
            </span>
            <span className="rd__price-unit">per night</span>
          </div>

          {/* Status pill */}
          <span
            className={`rd__status-pill rd__status-pill--${room.status?.toLowerCase()}`}
          >
            {room.status}
          </span>
        </div>

        {/* ── Content ── */}
        <div className="rd__body">
          {/* Header */}
          <div className="rd__header">
            <div>
              {/* <p className="rd__eyebrow">
                Room&nbsp;{room.roomNumber}&nbsp;·&nbsp;{room.maxGuest} Guests
              </p> */}
              <h2 className="rd__title">{room.type} Room</h2>
            </div>
          </div>

          {/* Divider */}
          <div className="rd__divider" />

          {/* Description */}
          <p className="rd__desc">{room.description}</p>

          {/* Quick stats */}
          <div className="rd__stats">
            {[
              { label: "Max Guests", value: room.maxGuest },
              { label: "Type", value: room.type },
              { label: "Status", value: room.status },
            ].map(({ label, value }) => (
              <div key={label} className="rd__stat">
                <span className="rd__stat-label">{label}</span>
                <span className="rd__stat-value">{value}</span>
              </div>
            ))}
          </div>

          {/* Amenities */}
          {room.amenities?.length > 0 && (
            <div className="rd__amenities-wrap">
              <p className="rd__section-label">Amenities</p>
              <ul className="rd__amenities">
                {room.amenities.map((a, i) => (
                  <li key={i} className="rd__amenity">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CTA */}
          <button
            className="rd__book-btn"
            onClick={handleBooking}
            disabled={room.status !== "available"}
          >
            <span>
              {room.status === "available"
                ? "Reserve This Room"
                : "Currently Unavailable"}
            </span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;
