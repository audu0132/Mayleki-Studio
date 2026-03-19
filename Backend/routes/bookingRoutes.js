const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");


// fixed time slots
const timeSlots = [
  "10:00 AM","11:00 AM","12:00 PM",
  "1:00 PM","2:00 PM","3:00 PM",
  "4:00 PM","5:00 PM","6:00 PM","7:00 PM"
];


// ✅ GET available slots
router.get("/available/:date", async (req, res) => {
  try {
    const { date } = req.params;

    if (!date) {
      return res.status(400).json({ message: "Date required" });
    }

    const bookings = await Booking.find({ date });

    const bookedSlots = bookings.map(b => b.timeSlot);

    const availableSlots = timeSlots.filter(
      slot => !bookedSlots.includes(slot)
    );

    res.json({ availableSlots });

  } catch (err) {
    console.error("Error fetching slots:", err);
    res.status(500).json({ message: "Error fetching slots" });
  }
});


// ✅ GET all bookings (optional date filter)
router.get("/", async (req, res) => {
  try {
    const { date } = req.query;

    const query = {};
    if (date) query.date = date;

    const bookings = await Booking.find(query).sort({
      date: 1,
      timeSlot: 1
    });

    res.json(bookings);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});


// ✅ POST create booking (FINAL FIXED)
router.post("/", async (req, res) => {
  try {
    const { name, phone, date, timeSlot, service, price } = req.body;

    // validation
    if (!name || !phone || !date || !timeSlot) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    // check valid slot
    if (!timeSlots.includes(timeSlot)) {
      return res.status(400).json({
        message: "Invalid time slot"
      });
    }

    // check duplicate booking
    const existingBooking = await Booking.findOne({
      date,
      timeSlot: timeSlot
    });

    if (existingBooking) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    // create booking
    const booking = new Booking({
      userName: name,
      phone,
      date,
      timeSlot: time,
      service,
      price
    });

    await booking.save();

    res.status(201).json({
      message: "Booking Confirmed",
      booking
    });

  } catch (err) {
    console.error("BOOKING ERROR:", err);

    // handle duplicate index error
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Slot already booked"
      });
    }

    res.status(500).json({
      message: "Booking failed"
    });
  }
});


// ✅ DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: "Booking deleted successfully"
    });

  } catch (err) {
    res.status(500).json({
      message: "Error deleting booking"
    });
  }
});

module.exports = router;