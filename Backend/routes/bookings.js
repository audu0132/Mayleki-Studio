const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

const timeSlots = [
"10:00 AM","11:00 AM","12:00 PM",
"1:00 PM","2:00 PM","3:00 PM",
"4:00 PM","5:00 PM","6:00 PM","7:00 PM"
];

// GET BOOKINGS
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

// GET AVAILABLE SLOTS
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
    res.status(500).json({ message: "Error fetching slots" });
  }
});

// CREATE BOOKING
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time, service, price } = req.body;

    const existingBooking = await Booking.findOne({
      date: date,
      timeSlot: time
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Slot already booked"
      });
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

    res.json({ message: "Booking Confirmed" });

  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
});

module.exports = router;