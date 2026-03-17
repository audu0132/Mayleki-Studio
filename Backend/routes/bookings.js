const express = require("express");
const Booking = require("../models/Booking");

const router = express.Router();

// canonical time slots (single source)
const timeSlots = [
  "10:00 AM","11:00 AM","12:00 PM",
  "1:00 PM","2:00 PM","3:00 PM",
  "4:00 PM","5:00 PM","6:00 PM","7:00 PM"
];

/**
 * GET /available/:date
 * Return available slots for a given date
 */
router.get("/available/:date", async (req, res) => {
  try {
    const { date } = req.params;
    if (!date) return res.status(400).json({ message: "Date parameter is required" });

    const bookings = await Booking.find({ date });

    // tolerate both possible field names in DB while migrating: timeSlot preferred
    const bookedSlots = bookings.map(b => b.timeSlot || b.time);

    const availableSlots = timeSlots.filter(slot => !bookedSlots.includes(slot));

    return res.json({ availableSlots });
  } catch (err) {
    console.error("Error fetching slots:", err);
    return res.status(500).json({ message: "Error fetching slots" });
  }
});

/**
 * GET /
 * Optional query: ?date=YYYY-MM-DD
 * Returns bookings (all or for a date)
 */
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    const query = {};
    if (date) query.date = date;

    const bookings = await Booking.find(query).sort({ date: 1, timeSlot: 1 });
    return res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    return res.status(500).json({ message: "Error fetching bookings" });
  }
});

/**
 * POST /
 * Create a booking
 */
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, time, service, price } = req.body;

    // basic validation
    if (!name || !phone || !date || !time) {
      return res.status(400).json({ message: "Missing required fields: name, phone, date, time" });
    }

    // check if time is within allowed slots (optional)
    if (!timeSlots.includes(time)) {
      return res.status(400).json({ message: "Invalid time slot" });
    }

    // check existing booking for same date & slot
    const existingBooking = await Booking.findOne({ date: date, timeSlot: time });
    if (existingBooking) {
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

    return res.status(201).json({ message: "Booking Confirmed", booking });
  } catch (err) {
    console.error("Booking failed:", err);
    return res.status(500).json({ message: "Booking failed" });
  }
});

module.exports = router;