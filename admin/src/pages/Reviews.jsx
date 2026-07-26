import React, { useEffect, useState } from "react";
import API from "../api/axios";

const StarRow = ({ rating }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        viewBox="0 0 20 20"
        className={`w-4 h-4 ${i < rating ? "fill-amber-400" : "fill-gray-200"}`}
      >
        <path d="M10 1.5l2.6 5.6 6.1.6-4.6 4.1 1.3 6-5.4-3.2-5.4 3.2 1.3-6L1.3 7.7l6.1-.6L10 1.5z" />
      </svg>
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

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
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

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await API.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.log(err);
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  };

  const filtered = reviews.filter((r) => {
    const matchesSearch =
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchesRating =
      ratingFilter === "all" || r.rating === Number(ratingFilter);
    return matchesSearch && matchesRating;
  });

  const avgRating =
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reviews</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage guest reviews and ratings
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-5 py-3">
          <span className="text-2xl font-bold text-gray-800">
            {avgRating.toFixed(1)}
          </span>
          <div>
            <StarRow rating={Math.round(avgRating)} />
            <p className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">
              {reviews.length} total reviews
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by guest name or comment..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[220px] px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-800/10 focus:border-gray-400"
        />
        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-800/10 focus:border-gray-400"
        >
          <option value="all">All Ratings</option>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} Star{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-sm text-gray-400">
            Loading reviews...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-gray-400">
            No reviews found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left font-medium text-gray-500 px-6 py-3.5 whitespace-nowrap">
                    Guest
                  </th>
                  <th className="text-left font-medium text-gray-500 px-6 py-3.5 whitespace-nowrap">
                    Rating
                  </th>
                  <th className="text-left font-medium text-gray-500 px-6 py-3.5">
                    Comment
                  </th>
                  <th className="text-left font-medium text-gray-500 px-6 py-3.5 whitespace-nowrap">
                    Date
                  </th>
                  <th className="text-right font-medium text-gray-500 px-6 py-3.5 whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50/60"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold shrink-0">
                          {initials(r.user?.name)}
                        </div>
                        <span className="font-medium text-gray-800 whitespace-nowrap">
                          {r.user?.name || "Guest"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StarRow rating={r.rating} />
                    </td>
                    <td className="px-6 py-4 text-gray-600 max-w-md">
                      <p className="line-clamp-2">{r.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {confirmId === r._id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDelete(r._id)}
                            disabled={deletingId === r._id}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-medium hover:bg-red-700 disabled:opacity-50"
                          >
                            {deletingId === r._id ? "Deleting..." : "Confirm"}
                          </button>
                          <button
                            onClick={() => setConfirmId(null)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmId(r._id)}
                          className="px-3 py-1.5 rounded-lg text-red-600 text-xs font-medium hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}