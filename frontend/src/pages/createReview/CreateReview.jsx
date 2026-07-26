import React, { useState } from "react";
import API from "../../services/api.js";
import { useNavigate } from "react-router-dom";
import "./createreview.css";

const CreateReview = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError("");

    if (!rating) {
      setError("Please select a rating.");
      return;
    }

    if (!comment.trim()) {
      setError("Please write a comment.");
      return;
    }

    try {
      setSubmitting(true);
      await API.post("/reviews", { rating, comment });
      setSuccess(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="createReview">
      <div className="createReview-header">
        <div className="createReview-title-wrap">
          <span className="createReview-eyebrow">Share Your Experience</span>
          <h2>Write a Review</h2>
        </div>
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

      <div className="createReview-card">
        {success ? (
          <div className="review-success">
            <div className="review-success-icon">✓</div>
            <h3>Thank you for your feedback</h3>
            <p>Your review has been submitted successfully.</p>
            <button className="home-btn filled" onClick={() => navigate("/")}>
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div className="rating-field">
              <label>Your Rating</label>
              <div className="star-input">
                {Array.from({ length: 5 }).map((_, i) => {
                  const value = i + 1;
                  return (
                    <span
                      key={value}
                      className={
                        value <= (hoverRating || rating)
                          ? "star filled"
                          : "star"
                      }
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      onMouseLeave={() => setHoverRating(0)}
                    >
                      ★
                    </span>
                  );
                })}
              </div>
            </div>

            <div className="comment-field">
              <label>Your Comment</label>
              <textarea
                placeholder="Tell us about your stay..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                maxLength={500}
              />
              <span className="char-count">{comment.length}/500</span>
            </div>

            {error && <p className="createReview-error">{error}</p>}

            <button
              className="submit-btn"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateReview;