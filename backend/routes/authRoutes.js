import express from "express";
import { getAllUsers, loginUser, registerUser } from "../controllers/authController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users", protect, adminOnly, getAllUsers);

export default router;