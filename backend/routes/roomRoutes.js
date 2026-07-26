import express from "express";
import { addRoom, deleteRoom, getAvailabilityRooms, getRoomById, getRooms, updateRoom } from "../controllers/roomController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";


const router = express.Router();

router.post("/add", protect, adminOnly, upload.array("images", 5), addRoom);
router.get("/", getRooms);
router.get("/available", getAvailabilityRooms);
router.get("/:id", getRoomById);
router.put("/:id", protect, adminOnly, upload.array("images", 5), updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;