import React from "react";
import "./roomcard.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BASE_URL = import.meta.env.VITE_SERVER_URL;

const RoomCard = ({ room, onView }) => {
  return (
    <article className="rc">
      {/* ── Image carousel ── */}
      <div className="rc__gallery">
        <img
          src={
            room.images?.length > 0
              ? `${BASE_URL}${room.images[0]}`
              : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=80"
          }
          alt={room.type}
          className="rc__img"
        />

        {/* Status ribbon */}
        <span
          className={`rc__status rc__status--${room.status?.toLowerCase()}`}
        >
          {room.status}
        </span>

        {/* Price badge */}
        <div className="rc__price">
          <span className="rc__price-amount">
            ₹{room.price?.toLocaleString("en-IN")}
          </span>
          <span className="rc__price-unit">/night</span>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="rc__body">
        <header className="rc__header">
          <div>
            {/* <p className="rc__room-no">Room {room.roomNumber}</p> */}
            <h3 className="rc__type">{room.type}</h3>
          </div>
          <div className="rc__guests">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            {room.maxGuest}
          </div>
        </header>

        <p className="rc__desc">{room.description}</p>

        {room.amenities?.length > 0 && (
          <ul className="rc__amenities">
            {room.amenities.slice(0, 4).map((a, i) => (
              <li key={i} className="rc__amenity">
                {a}
              </li>
            ))}
            {room.amenities.length > 4 && (
              <li className="rc__amenity rc__amenity--more">
                +{room.amenities.length - 4}
              </li>
            )}
          </ul>
        )}

        <button className="rc__btn" onClick={onView}>
          <span>View Details</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
};

export default RoomCard;
