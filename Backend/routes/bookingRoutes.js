const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const protectUser = require("../middleware/authMiddleware");
const protect = require("../middleware/protect");
const jwt = require("jsonwebtoken");

const timeSlots = [
  "10:00 AM", "11:00 AM", "12:00 PM",
  "1:00 PM", "2:00 PM", "3:00 PM",
  "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"
];

// ✅ GET AVAILABLE SLOTS
router.get("/available/:date", async (req, res) => {
  try {
    const bookings = await Booking.find({ date: req.params.date });

    const bookedSlots = bookings
      .filter(b => b.status !== "Cancelled") // Exclude cancelled slots from being blocked
      .map(b => b.timeSlot);

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
      timeSlot: time,
      status: { $ne: "Cancelled" } // Ignore cancelled bookings when checking slot conflict
    });

    if (existing) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    // Try to extract customer user ID from optional Bearer token
    let userId = null;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        console.log("Optional auth in booking creation skipped:", err.message);
      }
    }

    const booking = new Booking({
      user: userId,
      userName: name,
      phone,
      date,
      timeSlot: time,
      service,
      price,
      status: "Confirmed"
    });

    await booking.save();

    res.status(201).json({ message: "Booking Confirmed", booking });

  } catch (err) {
    console.error("Booking error:", err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// ✅ GET MY BOOKINGS (CUSTOMER)
router.get("/my-bookings", protectUser, async (req, res) => {
  try {
    // Find bookings belonging to user by user ID or user's registered phone
    const bookings = await Booking.find({
      $or: [
        { user: req.user._id },
        { phone: req.user.phone }
      ]
    }).sort({ date: -1, timeSlot: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("Fetch my bookings error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ CANCEL BOOKING (CUSTOMER)
router.put("/:id/cancel", protectUser, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Authorize: user must own the booking by user ID or phone
    const isOwner = 
      (booking.user && booking.user.toString() === req.user._id.toString()) ||
      (booking.phone === req.user.phone);

    if (!isOwner) {
      return res.status(403).json({ message: "Unauthorized to cancel this booking" });
    }

    booking.status = "Cancelled";
    await booking.save();

    res.json({ message: "Booking cancelled successfully", booking });
  } catch (err) {
    console.error("Cancel booking error:", err);
    res.status(500).json({ message: "Error cancelling booking" });
  }
});

// ✅ RESCHEDULE BOOKING (CUSTOMER)
router.put("/:id/reschedule", protectUser, async (req, res) => {
  try {
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time slot are required" });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Authorize: user must own the booking by user ID or phone
    const isOwner = 
      (booking.user && booking.user.toString() === req.user._id.toString()) ||
      (booking.phone === req.user.phone);

    if (!isOwner) {
      return res.status(403).json({ message: "Unauthorized to reschedule this booking" });
    }

    // Check if the slot is already taken on new date
    const existing = await Booking.findOne({
      date,
      timeSlot: time,
      status: { $ne: "Cancelled" }
    });

    if (existing && existing._id.toString() !== booking._id.toString()) {
      return res.status(400).json({ message: "Slot already booked" });
    }

    booking.date = date;
    booking.timeSlot = time;
    booking.status = "Confirmed"; // Reset to Confirmed if rescheduled from a different state (or keep)
    await booking.save();

    res.json({ message: "Booking rescheduled successfully", booking });
  } catch (err) {
    console.error("Reschedule booking error:", err);
    res.status(500).json({ message: "Error rescheduling booking" });
  }
});

// ✅ GET ALL BOOKINGS (ADMIN)
router.get("/", protect, async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    console.error("Fetch bookings error:", err);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// ✅ DELETE BOOKING (ADMIN)
router.delete("/:id", protect, async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);

    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    console.error("Delete booking error:", err);
    res.status(500).json({ message: "Error deleting booking" });
  }
});

module.exports = router;