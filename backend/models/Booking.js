import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room"
    },

    checkIn: {
        type: Date,
        required: true
    },

    checkOut: {
        type: Date,
        required: true
    },

    totalPrice: {
        type: Number
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected", "confirmed"],
        default: "pending"
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid"],
        default: "pending"
    }
}, {timestamps: true})

const Booking = mongoose.model("Booking", bookSchema);
export default Booking;