const express = require("express");
const Staff = require("../models/Staff");
const protect = require("../middleware/protect");

const router = express.Router();

// @desc    Get active staff members (Public)
// @route   GET /api/staff
router.get("/", async (req, res) => {
  try {
    const staffMembers = await Staff.find({ status: "Active" })
      .populate("services")
      .sort({ name: 1 });
    res.json(staffMembers);
  } catch (error) {
    console.error("Get public staff error:", error);
    res.status(500).json({ message: "Error fetching staff members" });
  }
});

// @desc    Get all staff members (Admin)
// @route   GET /api/staff/admin
router.get("/admin", protect, async (req, res) => {
  try {
    const staffMembers = await Staff.find()
      .populate("services")
      .sort({ createdAt: -1 });
    res.json(staffMembers);
  } catch (error) {
    console.error("Get admin staff error:", error);
    res.status(500).json({ message: "Error fetching staff members" });
  }
});

// @desc    Create new staff member (Admin)
// @route   POST /api/staff
router.post("/", protect, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      status,
      specialties,
      services,
      image,
      workingDays,
      workingHours
    } = req.body;

    if (!name || !email || !phone || !role) {
      return res.status(400).json({ message: "Name, email, phone, and role are required" });
    }

    const exists = await Staff.findOne({ email: email.toLowerCase().trim() });
    if (exists) {
      return res.status(400).json({ message: "Staff member with this email already exists" });
    }

    const staff = new Staff({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      role: role.trim(),
      status: status || "Active",
      specialties: Array.isArray(specialties) ? specialties : [],
      services: Array.isArray(services) ? services : [],
      image: image || "",
      workingDays: Array.isArray(workingDays) ? workingDays : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      workingHours: workingHours || { start: "10:00 AM", end: "08:00 PM" }
    });

    const saved = await staff.save();
    const populated = await Staff.findById(saved._id).populate("services");
    res.status(201).json(populated);
  } catch (error) {
    console.error("Create staff error:", error);
    res.status(500).json({ message: "Error creating staff member" });
  }
});

// @desc    Update staff member (Admin)
// @route   PUT /api/staff/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      role,
      status,
      specialties,
      services,
      image,
      workingDays,
      workingHours
    } = req.body;

    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    if (email && email.toLowerCase().trim() !== staff.email) {
      const exists = await Staff.findOne({ email: email.toLowerCase().trim() });
      if (exists) {
        return res.status(400).json({ message: "Staff member with this email already exists" });
      }
      staff.email = email.toLowerCase().trim();
    }

    if (name !== undefined) staff.name = name.trim();
    if (phone !== undefined) staff.phone = phone.trim();
    if (role !== undefined) staff.role = role.trim();
    if (status !== undefined) staff.status = status;
    if (specialties !== undefined) staff.specialties = specialties;
    if (services !== undefined) staff.services = services;
    if (image !== undefined) staff.image = image;
    if (workingDays !== undefined) staff.workingDays = workingDays;
    if (workingHours !== undefined) staff.workingHours = workingHours;

    const updated = await staff.save();
    const populated = await Staff.findById(updated._id).populate("services");
    res.json(populated);
  } catch (error) {
    console.error("Update staff error:", error);
    res.status(500).json({ message: "Error updating staff member" });
  }
});

// @desc    Delete staff member (Admin)
// @route   DELETE /api/staff/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    await Staff.findByIdAndDelete(req.params.id);
    res.json({ message: "Staff member deleted successfully" });
  } catch (error) {
    console.error("Delete staff error:", error);
    res.status(500).json({ message: "Error deleting staff member" });
  }
});

module.exports = router;
