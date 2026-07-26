import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

// Add Room
export const addRoom = async (req, res) => {
  try {
    const {
      roomNumber,
      type,
      price,
      description,
      maxGuest,
      amenities,
      status,
    } = req.body;

    if (!roomNumber || !type || !price) {
      return res.status(400).json({
        message: "Room number, type and price are required",
      });
    }

    const existingRoom = await Room.findOne({ roomNumber });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room number already exists",
      });
    }

    const images = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : [];

    const room = await Room.create({
      roomNumber,
      type,
      price,
      description,
      maxGuest,
      amenities: amenities
        ? amenities.split(",").map((item) => item.trim())
        : [],
      images,
      status: status || "available",
    });

    res.status(201).json({
      message: "Room added successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get All Rooms
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Get Room By Id
export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json(room);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Check Available Rooms
export const getAvailabilityRooms = async (req, res) => {
  try {
    const { checkIn, checkOut, guests } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({
        message: "Check-in and check-out dates are required",
      });
    }

    const bookings = await Booking.find({
      checkIn: {
        $lt: new Date(checkOut),
      },
      checkOut: {
        $gt: new Date(checkIn),
      },
      status: {
        $in: ["approved", "confirmed"],
      },
    });

    const bookedRoomIds = bookings.map((booking) => booking.room.toString());

    const filter = {
      _id: {
        $nin: bookedRoomIds,
      },
      status: "available",
    };

    if (guests) {
      filter.maxGuest = {
        $gte: Number(guests),
      };
    }

    const rooms = await Room.find(filter).sort({
      roomNumber: 1,
    });

    res.json(rooms);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Update Room
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    const {
      roomNumber,
      type,
      price,
      description,
      maxGuest,
      amenities,
      status,
    } = req.body;

    if (roomNumber && roomNumber !== room.roomNumber) {
      const existingRoom = await Room.findOne({ roomNumber });

      if (existingRoom) {
        return res.status(400).json({
          message: "Room number already exists",
        });
      }

      room.roomNumber = roomNumber;
    }

    if (type !== undefined) room.type = type;
    if (price !== undefined) room.price = price;
    if (description !== undefined) room.description = description;
    if (maxGuest !== undefined) room.maxGuest = maxGuest;
    if (status !== undefined) room.status = status;

    if (amenities) {
      room.amenities = amenities.split(",").map((item) => item.trim());
    }

    if (req.files && req.files.length > 0) {
      room.images = req.files.map((file) => `/uploads/${file.filename}`);
    }

    await room.save();

    res.json({
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

// Delete Room
export const deleteRoom = async (req, res) => {
  try {
    const bookingExists = await Booking.findOne({
      room: req.params.id,
    });

    if (bookingExists) {
      return res.status(400).json({
        message: "Cannot delete a room that has booking records.",
      });
    }

    const room = await Room.findByIdAndDelete(req.params.id);

    if (!room) {
      return res.status(404).json({
        message: "Room not found",
      });
    }

    res.json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
