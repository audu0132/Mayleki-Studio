const express = require("express");
const Settings = require("../models/Settings");
const protect = require("../middleware/protect");

const router = express.Router();

// @desc    Get business settings (Public)
// @route   GET /api/settings
router.get("/", async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Initialize with defaults if none exists
      settings = new Settings();
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ message: "Error fetching settings" });
  }
});

// @desc    Update business settings (Admin)
// @route   PUT /api/settings
router.put("/", protect, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    const {
      businessName,
      email,
      phone,
      whatsappNumber,
      address,
      businessHours,
      autoConfirmBookings,
      instagramLink,
      facebookLink,
      googleReviewLink
    } = req.body;

    if (businessName !== undefined) settings.businessName = businessName;
    if (email !== undefined) settings.email = email;
    if (phone !== undefined) settings.phone = phone;
    if (whatsappNumber !== undefined) settings.whatsappNumber = whatsappNumber;
    if (address !== undefined) settings.address = address;
    
    if (businessHours !== undefined) {
      if (businessHours.start !== undefined) settings.businessHours.start = businessHours.start;
      if (businessHours.end !== undefined) settings.businessHours.end = businessHours.end;
    }
    
    if (autoConfirmBookings !== undefined) settings.autoConfirmBookings = autoConfirmBookings;
    if (instagramLink !== undefined) settings.instagramLink = instagramLink;
    if (facebookLink !== undefined) settings.facebookLink = facebookLink;
    if (googleReviewLink !== undefined) settings.googleReviewLink = googleReviewLink;

    const saved = await settings.save();
    res.json(saved);
  } catch (error) {
    console.error("Update settings error:", error);
    res.status(500).json({ message: "Error updating settings" });
  }
});

module.exports = router;
