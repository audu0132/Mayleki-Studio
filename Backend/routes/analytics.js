const express = require("express");
const Booking = require("../models/Booking");
const protect = require("../middleware/protect");

const router = express.Router();

router.get("/dashboard", protect, async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    // Get all bookings and calculate revenue from price field (if exists)
    const bookings = await Booking.find();
    const totalRevenue = bookings.reduce((sum, booking) => {
      return sum + (booking.price || 0);
    }, 0);

    res.json({
      totalBookings,
      totalRevenue,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching analytics" });
  }
});

module.exports = router;