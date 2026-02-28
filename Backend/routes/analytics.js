const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

router.get("/dashboard", async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();

    const revenueData = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$price" },
        },
      },
    ]);

    const totalRevenue = revenueData.length > 0
      ? revenueData[0].totalRevenue
      : 0;

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