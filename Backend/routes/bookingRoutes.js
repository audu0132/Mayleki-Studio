const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

const timeSlots = [
  "10:00 AM","11:00 AM","12:00 PM",
  "1:00 PM","2:00 PM","3:00 PM",
  "4:00 PM","5:00 PM","6:00 PM","7:00 PM"
];

// GET available slots
router.get("/available/:date", async (req, res) => {
  try {
    const { date } = req.params;

    const bookings = await Booking.find({ date });

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

// CREATE booking
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time } = req.body;

    console.log("Incoming:", req.body); // DEBUG

    if (!name || !phone || !date || !time) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (!timeSlots.includes(time)) {
      return res.status(400).json({ message: "Invalid time slot" });
    }

    const exists = await Booking.findOne({
      date,
      timeSlot: time
    });

    if (exists) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    const booking = new Booking({
      userName: name,
      phone,
      date,
      timeSlot: time
    });

    await booking.save();

    res.status(201).json({ message: "Booking Confirmed" });

  } catch (err) {
    console.error("ERROR:", err); // 🔥 IMPORTANT
    res.status(500).json({ message: "Booking failed" });
  }
});

module.exports = router;