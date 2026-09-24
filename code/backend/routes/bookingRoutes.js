const express = require("express");
const router = express.Router();
const { createBooking, getBookings, updateBookingStatus, getUnavailableSlots } = require("../controllers/bookingController");
const { verifyToken, requireRole } = require("../middleware/authMiddleware");

// Both routes require the user to be logged in
router.post("/", verifyToken, createBooking);
router.get("/", verifyToken, getBookings);
router.get("/unavailable-slots", verifyToken, getUnavailableSlots);
router.put("/:id/status", verifyToken, requireRole("officer", "admin"), updateBookingStatus);

module.exports = router;