import express from "express";
import {
  approveBooking,
  createBooking,
  getAllBookings,
  getMyBookings,
  rejectBooking,
} from "../controllers/bookingController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createBooking);

router.get("/", protect, adminOnly, getAllBookings);
router.put("/approve/:id", protect, adminOnly, approveBooking);
router.put("/reject/:id", protect, adminOnly, rejectBooking);
router.get("/my-bookings", protect, getMyBookings)

export default router;
