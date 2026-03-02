const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

router.get("/dashboard", async (req, res) => {
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