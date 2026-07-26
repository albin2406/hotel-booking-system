import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// create booking
export const createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({
        message: "Room, check-in and check-out are required",
      });
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    if (room.status !== "available") {
      return res.status(400).json({
        message: "Room is not available",
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({
        message: "Check-out must be after check-in",
      });
    }

    const existingBooking = await Booking.findOne({
      room: roomId,
      status: { $in: ["pending", "approved", "confirmed"] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Room already booked for these dates",
      });
    }

    const duplicateBooking = await Booking.findOne({
      user: req.user.id,
      room: roomId,
      checkIn,
      checkOut,
      status: {
        $in: ["pending", "approved"],
      },
    });

    if (duplicateBooking) {
      return res.status(400).json({
        message: "You have already booked this room for these dates.",
      });
    }

    const days = Math.max(
      1,
      Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)),
    );

    const totalPrice = days * room.price;

    const booking = await Booking.create({
      user: req.user.id,
      room: roomId,
      checkIn,
      checkOut,
      totalPrice,
      status: "pending",
    });

    res.status(201).json({
      message: "Booking request sent successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// get all bookings
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("room").populate("user");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// booking approval
export const approveBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const conflictBooking = await Booking.findOne({
      _id: { $ne: booking._id },
      room: booking.room,
      status: { $in: ["approved", "confirmed"] },
      checkIn: { $lt: booking.checkOut },
      checkOut: { $gt: booking.checkIn },
    });

    if (conflictBooking) {
      return res.status(400).json({
        message: "Another booking is already approved for these dates",
      });
    }

    booking.status = "approved";
    await booking.save();

    res.json({
      message: "Booking approved successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// reject booking
export const rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.status = "rejected";

    await booking.save();

    res.json({
      message: "Booking rejected successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// getMyBookings
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate("room");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
