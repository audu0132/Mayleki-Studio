const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const auth = require("../middleware/authMiddleware");



router.post("/", async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json(booking);
});

router.get("/", async (req, res) => {
  res.send("API is running")
  try {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

//Delete Booking
router.delete("/:id", auth, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;