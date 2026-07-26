import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    roomNumber: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["Standard", "Deluxe", "Suite", "Family"],
    },

    price: {
      type: Number,
      required: true,
    },

    maxGuest: {
      type: Number,
      required: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["available", "maintenance"],
      default: "available",
    },
  },
  { timestamps: true }
);

const Room = mongoose.model("Room", roomSchema);

export default Room;