const express = require("express");
const Booking = require("../models/Booking");
const protect = require("../middleware/protect");

const router = express.Router();

const timeSlots = [
  "10:00 AM","11:00 AM","12:00 PM",
  "1:00 PM","2:00 PM","3:00 PM",
  "4:00 PM","5:00 PM","6:00 PM","7:00 PM"
];


// ======================================
// GET BOOKINGS BY DATE (for slots)
// ======================================
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;

    if (date) {
      const bookings = await Booking.find({ date });
      return res.json(bookings);
    }

    const bookings = await Booking.find();
    res.json(bookings);

  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});


// ======================================
// GET AVAILABLE SLOTS
// ======================================
router.get("/available/:date", async (req, res) => {
  try {
    const { date } = req.params;

    if (!date)
      return res.status(400).json({ message: "Date required" });

    const bookings = await Booking.find({ date });

    const bookedSlots = bookings.map(b => b.timeSlot);

    const availableSlots = timeSlots.filter(
      slot => !bookedSlots.includes(slot)
    );

    res.json({
      bookedSlots });

  } catch (err) {
    res.status(500).json({ message: "Error fetching available slots" });
  }
});


// ======================================
// CREATE BOOKING
// ======================================
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time, service, price } = req.body;

    if (!name || !phone || !date || !time)
      return res.status(400).json({ message: "All fields required" });

    // ✅ CHECK IF SLOT ALREADY BOOKED (ADD HERE)
    const existingBooking = await Booking.findOne({
      date: date,
      timeSlot: time
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    // ✅ CREATE NEW BOOKING
    const booking = new Booking({
      userName: name,
      phone,
      date,
      timeSlot: time,
      service,
      price
    });

    await booking.save();

    res.json({ message: "Booking Confirmed" });

  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
});


// ======================================
// ADMIN VIEW ALL BOOKINGS
// ======================================
router.get("/admin/all", protect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching admin bookings" });
  }
});


// ======================================
// DELETE BOOKING (Admin)
// ======================================
router.delete("/:id", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;
