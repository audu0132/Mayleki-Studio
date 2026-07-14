const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Booking = require("../models/Booking");
const protect = require("../middleware/protect");

// All routes are protected by admin protect middleware
router.use(protect);

// @desc    Get all customers with visit and spending statistics
// @route   GET /api/admin/customers
// @access  Private (Admin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    
    // Fetch all bookings to calculate statistics.
    const bookings = await Booking.find();
    
    const customerStatsMap = {};
    bookings.forEach(b => {
      // Group by user ID if exists, otherwise try phone
      const key = b.user ? b.user.toString() : b.phone;
      if (!key) return;
      
      if (!customerStatsMap[key]) {
        customerStatsMap[key] = {
          totalBookings: 0,
          totalSpent: 0,
          lastBookingDate: null,
        };
      }
      
      if (b.status !== "Cancelled") {
        customerStatsMap[key].totalBookings += 1;
        customerStatsMap[key].totalSpent += (b.price || 0);
      }
      
      const bDate = new Date(b.date);
      if (!isNaN(bDate) && b.status !== "Cancelled") {
        if (!customerStatsMap[key].lastBookingDate || bDate > new Date(customerStatsMap[key].lastBookingDate)) {
          customerStatsMap[key].lastBookingDate = b.date;
        }
      }
    });
    
    const customers = users.map(user => {
      const userIdStr = user._id.toString();
      // Try to match statistics by user ID first, fallback to phone
      const stats = customerStatsMap[userIdStr] || customerStatsMap[user.phone] || {
        totalBookings: 0,
        totalSpent: 0,
        lastBookingDate: null
      };
      
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        createdAt: user.createdAt,
        totalBookings: stats.totalBookings,
        totalSpent: stats.totalSpent,
        lastBookingDate: stats.lastBookingDate
      };
    });
    
    res.json(customers);
  } catch (error) {
    console.error("Fetch admin customers error:", error);
    res.status(500).json({ message: "Error fetching customers" });
  }
});

// @desc    Get detailed booking history for a specific customer
// @route   GET /api/admin/customers/:id/bookings
// @access  Private (Admin)
router.get("/:id/bookings", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Find bookings belonging to user by user ID or user's registered phone
    const bookings = await Booking.find({
      $or: [
        { user: user._id },
        { phone: user.phone }
      ]
    }).sort({ date: -1, timeSlot: -1 });
    
    res.json(bookings);
  } catch (error) {
    console.error("Fetch customer bookings error:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

// @desc    Create a new customer
// @route   POST /api/admin/customers
// @access  Private (Admin)
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }
    
    // Check for unique email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    
    // Check for unique mobile number
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Mobile number is already registered" });
    }
    
    // Create user with provided or default password
    const userPassword = password || "mayleki123";
    const user = await User.create({
      name,
      email,
      phone,
      password: userPassword
    });
    
    res.status(201).json({
      message: "Customer created successfully",
      customer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error("Create customer error:", error);
    res.status(500).json({ message: "Error creating customer" });
  }
});

// @desc    Update customer details
// @route   PUT /api/admin/customers/:id
// @access  Private (Admin)
router.put("/:id", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    // Check for email uniqueness if changing email
    if (email && email.toLowerCase() !== user.email.toLowerCase()) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ message: "Email is already in use" });
      }
      user.email = email;
    }
    
    // Check for phone uniqueness if changing phone
    if (phone && phone !== user.phone) {
      const phoneExists = await User.findOne({ phone });
      if (phoneExists) {
        return res.status(400).json({ message: "Phone number is already in use" });
      }
      user.phone = phone;
    }
    
    if (name) user.name = name;
    
    await user.save();
    
    res.json({
      message: "Customer updated successfully",
      customer: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error("Update customer error:", error);
    res.status(500).json({ message: "Error updating customer" });
  }
});

// @desc    Delete customer
// @route   DELETE /api/admin/customers/:id
// @access  Private (Admin)
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    // Remove user link from their bookings
    await Booking.updateMany({ user: req.params.id }, { $unset: { user: 1 } });
    
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Delete customer error:", error);
    res.status(500).json({ message: "Error deleting customer" });
  }
});

module.exports = router;
