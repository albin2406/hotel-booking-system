import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCheckoutSession, paymentSuccess } from "../controllers/paymentController.js";


const router = express.Router();

router.post("/checkout-session", protect, createCheckoutSession);
router.get("/success", paymentSuccess);

export default router;