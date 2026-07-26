import React, { useEffect, useState } from "react";
import API from "../../../services/api.js";
import { useNavigate } from "react-router-dom";
import "./Reviews.css";

const Stars = ({ rating }) => (
  <div className="review-stars" aria-label={`${rating} out of 5 stars`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    ))}
  </div>
);

const initials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(3);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchReviews = async () => {
    try {
      const res = await API.get("/reviews");
      setReviews(res.data.reviews);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  const alreadyReviewed =
    user && reviews.some((r) => r.user?._id === user._id);

  return (
    <section className="reviews">
      <div className="reviews-header">
        <span className="reviews-eyebrow">Guest Reviews</span>
        <h2 className="reviews-title">What Our Guests Say</h2>

        {!loading && reviews.length > 0 && (
          <div className="reviews-summary">
            <span className="reviews-avg-number">{avgRating.toFixed(1)}</span>
            <div className="reviews-summary-meta">
              <Stars rating={Math.round(avgRating)} />
              <span className="reviews-count">{reviews.length} reviews</span>
            </div>
          </div>
        )}

        {user && (
          <button
            className="reviews-cta"
            onClick={() => navigate("/write-review")}
            disabled={alreadyReviewed}
          >
            {alreadyReviewed ? "You've Already Reviewed" : "Write a Review"}
          </button>
        )}
      </div>

      {loading ? (
        <div className="reviews-grid">
          {Array.from({ length: 3 }).map((_, i) => (
            <div className="review-card skeleton" key={i}>
              <div className="review-top">
                <div className="skeleton-avatar" />
                <div className="skeleton-lines">
                  <div className="skeleton-line short" />
                  <div className="skeleton-line" />
                </div>
              </div>
              <div className="skeleton-line" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="reviews-empty">
          <p>No reviews yet. Be the first to share your experience.</p>
        </div>
      ) : (
        <>
          <div className="reviews-grid">
            {reviews.slice(0, visible).map((r) => (
              <div className="review-card" key={r._id}>
                <span className="review-quote">"</span>
                <div className="review-top">
                  <div className="review-avatar">{initials(r.user?.name)}</div>
                  <div>
                    <p className="review-user">{r.user?.name || "Guest"}</p>
                    <Stars rating={r.rating} />
                  </div>
                </div>
                <p className="review-comment">{r.comment}</p>
              </div>
            ))}
          </div>

          {visible < reviews.length && (
            <button
              className="reviews-more"
              onClick={() => setVisible((v) => v + 3)}
            >
              Load More Reviews
            </button>
          )}
        </>
      )}
    </section>
  );
};

export default Reviews;