const express = require("express");
const Service = require("../models/Service");
const protect = require("../middleware/protect");

const router = express.Router();

// @desc    Get all active services (Public)
// @route   GET /api/services
router.get("/", async (req, res) => {
  try {
    const services = await Service.find({ isActive: true }).sort({ category: 1, name: 1 });
    res.json(services);
  } catch (error) {
    console.error("Get public services error:", error);
    res.status(500).json({ message: "Error fetching services" });
  }
});

// @desc    Get all services (Admin)
// @route   GET /api/services/admin
router.get("/admin", protect, async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error("Get admin services error:", error);
    res.status(500).json({ message: "Error fetching services" });
  }
});

// @desc    Create new service (Admin)
// @route   POST /api/services
router.post("/", protect, async (req, res) => {
  try {
    const { name, description, price, duration, category, image, isActive } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Service name and price are required" });
    }

    const exists = await Service.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "Service with this name already exists" });
    }

    const service = new Service({
      name: name.trim(),
      description,
      price,
      duration,
      category,
      image,
      isActive
    });

    const saved = await service.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create service error:", error);
    res.status(500).json({ message: "Error creating service" });
  }
});

// @desc    Update service (Admin)
// @route   PUT /api/services/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const { name, description, price, duration, category, image, isActive } = req.body;
    
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (name && name.trim() !== service.name) {
      const exists = await Service.findOne({ name: name.trim() });
      if (exists) {
        return res.status(400).json({ message: "Service with this name already exists" });
      }
      service.name = name.trim();
    }

    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = price;
    if (duration !== undefined) service.duration = duration;
    if (category !== undefined) service.category = category;
    if (image !== undefined) service.image = image;
    if (isActive !== undefined) service.isActive = isActive;

    const updated = await service.save();
    res.json(updated);
  } catch (error) {
    console.error("Update service error:", error);
    res.status(500).json({ message: "Error updating service" });
  }
});

// @desc    Delete service (Admin)
// @route   DELETE /api/services/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Delete service error:", error);
    res.status(500).json({ message: "Error deleting service" });
  }
});

module.exports = router;
