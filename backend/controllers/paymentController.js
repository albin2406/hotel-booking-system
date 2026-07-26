import dotenv from "dotenv";
dotenv.config();
import Stripe from "stripe";
import Booking from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId).populate("room");

    console.log("BOOKING:", booking);

    console.log("STRIPE KEY:", process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `Room ${booking.room.roomNumber}`,
            },
            unit_amount: booking.totalPrice * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/payment-success?bookingId=${bookingId}`,
      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.log("STRIPE ERROR:");
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
};

// update status
export const paymentSuccess = async (req, res) => {
  try {
    const { bookingId } = req.query;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    booking.paymentStatus = "paid";
    booking.status = "confirmed";

    await booking.save();

    res.json({
      message: "Payment successful. Booking confirmed",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
