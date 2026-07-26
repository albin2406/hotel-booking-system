import express from "express";
import { createReview, deleteReview, getReviews } from "../controllers/reviewController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/", protect, createReview);
router.get("/", getReviews);
router.delete("/:id", protect, adminOnly, deleteReview);

export default router;