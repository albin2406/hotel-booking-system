import { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, roomsRes, usersRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/rooms"),
          api.get("/auth/users"),
        ]);

        const b = bookingsRes.data;
        setBookings(b);

        const revenue = b
          .filter((x) => x.paymentStatus === "paid")
          .reduce((sum, x) => sum + (x.totalPrice || 0), 0);

        setStats({
          totalRooms: roomsRes.data.length,
          totalBookings: b.length,
          totalUsers: usersRes.data.length,
          revenue,
          pending: b.filter((x) => x.status === "pending").length,
          confirmed: b.filter((x) => x.status === "confirmed").length,
        });
      } catch (err) {
        console.error(err);

        if (err.response?.status === 401) {
          localStorage.removeItem("adminToken");
          window.location.href = "/login";
        }
      }
    };
    fetchData();
  }, []);

  const monthlyRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((acc, b) => {
      const month = new Date(b.createdAt).toLocaleString("default", {
        month: "short",
      });
      const existing = acc.find((x) => x.month === month);
      if (existing) existing.revenue += b.totalPrice || 0;
      else acc.push({ month, revenue: b.totalPrice || 0 });
      return acc;
    }, []);

  const cards = [
    { label: "Total Rooms", value: stats?.totalRooms },
    { label: "Total Bookings", value: stats?.totalBookings },
    { label: "Total Users", value: stats?.totalUsers },
    {
      label: "Revenue",
      value: `₹${stats?.revenue?.toLocaleString("en-IN") || 0}`,
    },
    { label: "Pending", value: stats?.pending },
    { label: "Confirmed", value: stats?.confirmed },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className="bg-white rounded-xl p-5 shadow border">
            <p className="text-sm text-gray-500">{c.label}</p>

            <p className="text-3xl font-bold text-gray-800 mt-1">
              {c.value ?? "..."}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Booking Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Pending Bookings</span>
              <span className="font-semibold text-orange-500">
                {stats?.pending}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Confirmed Bookings</span>
              <span className="font-semibold text-green-500">
                {stats?.confirmed}
              </span>
            </div>

            <div className="flex justify-between">
              <span>Total Revenue</span>
              <span className="font-semibold text-blue-500">
                ₹{stats?.revenue?.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">System Overview</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Rooms</span>
              <span>{stats?.totalRooms}</span>
            </div>

            <div className="flex justify-between">
              <span>Users</span>
              <span>{stats?.totalUsers}</span>
            </div>

            <div className="flex justify-between">
              <span>Bookings</span>
              <span>{stats?.totalBookings}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}