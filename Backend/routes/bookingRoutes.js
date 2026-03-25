const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

const timeSlots = [
  "10:00 AM","11:00 AM","12:00 PM",
  "1:00 PM","2:00 PM","3:00 PM",
  "4:00 PM","5:00 PM","6:00 PM","7:00 PM"
];

// ✅ GET AVAILABLE SLOTS
router.get("/available/:date", async (req, res) => {
  try {
    const bookings = await Booking.find({ date: req.params.date });

    const bookedSlots = bookings.map(b => b.timeSlot);

    const availableSlots = timeSlots.filter(
      slot => !bookedSlots.includes(slot)
    );

    res.json({ availableSlots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching slots" });
  }
});

// ✅ CREATE BOOKING
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time, service, price } = req.body;

    if (!name || !phone || !date || !time) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await Booking.findOne({
      date,
      timeSlot: time
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = new Booking({
      userName: name,
      phone,
      date,
      timeSlot: time,
      service,
      price
    });

    await booking.save();

    res.status(201).json({ message: "Booking Confirmed" });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});

module.exports = router;