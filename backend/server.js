import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dns from "dns";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import paymentRoute from "./routes/paymentRoutes.js";
import reviewRoute from "./routes/reviewRoute.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

connectDB();

app.use(cors({
    origin: [
        process.env.CLIENT_URL,
        process.env.ADMIN_URL,
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/payment", paymentRoute);
app.use("/api/reviews", reviewRoute);

app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => res.send("Hotel Booking API Running"));
app.get("/test", (req, res) => res.json({ message: "API working" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));