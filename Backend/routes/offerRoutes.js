const express = require("express");
const Offer = require("../models/Offer");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get active offer (Public)
router.get("/", async (req, res) => {
  const offer = await Offer.findOne({ isActive: true });
  res.json(offer);
});

// Create Offer (Admin)
router.post("/", protect, async (req, res) => {
  const offer = new Offer(req.body);
  const saved = await offer.save();
  res.json(saved);
});

// Update Offer
router.put("/:id", protect, async (req, res) => {
  const updated = await Offer.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

// Delete Offer
router.delete("/:id", protect, async (req, res) => {
  await Offer.findByIdAndDelete(req.params.id);
  res.json({ message: "Offer deleted" });
});

module.exports = router;