import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_COLORS = {
  confirmed: "bg-green-100 text-green-700",
  approved: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);

  const fetch = async () => {
    const { data } = await api.get("/bookings");
    setBookings(data);
  };

  useEffect(() => {
    fetch();
  }, []);

  const approve = async (id) => {
    try {
      await api.put(`/bookings/approve/${id}`);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || "Unable to approve booking");
    }
  };
  const reject = async (id) => {
    await api.put(`/bookings/reject/${id}`);
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
              <tr>
                {[
                  "Guest",
                  "Room",
                  "Check In",
                  "Check Out",
                  "Duration",
                  "Amount",
                  "Payment",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th key={h} className="px-4 py-3 text-left whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.user?.name}</p>
                    <p className="text-gray-400 text-xs">{b.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    Room {b.room?.roomNumber} - {b.room?.type}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(b.checkIn).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(b.checkOut).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {Math.ceil(
                      (new Date(b.checkOut) - new Date(b.checkIn)) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    nights
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    ₹{b.totalPrice?.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${b.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}
                    >
                      {b.paymentStatus === "paid" ? "Paid" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${STATUS_COLORS[b.status]}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {b.status === "pending" ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => approve(b._id)}
                          className="text-green-600 hover:underline"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => reject(b._id)}
                          className="text-red-600 hover:underline"
                        >
                          Reject
                        </button>
                      </div>
                    ) : b.status === "approved" ? (
                      <span className="text-blue-500 text-xs font-medium">
                        Awaiting Payment
                      </span>
                    ) : b.status === "confirmed" ? (
                      <span className="text-green-600 text-xs font-medium">
                        Booking Completed
                      </span>
                    ) : (
                      <span className="text-red-500 text-xs font-medium">
                        Booking Rejected
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}