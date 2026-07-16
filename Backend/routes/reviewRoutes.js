const express = require("express");
const Review = require("../models/Review");
const protect = require("../middleware/protect");

const router = express.Router();

// @desc    Get approved reviews (Public)
// @route   GET /api/reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Get reviews error:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// @desc    Get all reviews (Admin)
// @route   GET /api/reviews/admin
router.get("/admin", protect, async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error("Get admin reviews error:", error);
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

// @desc    Submit a review (Public)
// @route   POST /api/reviews
router.post("/", async (req, res) => {
  try {
    const { name, text, rating, source } = req.body;
    if (!name || !text) {
      return res.status(400).json({ message: "Name and text are required" });
    }

    const review = new Review({
      name,
      text,
      rating: rating || 5,
      approved: false, // requires admin approval
      source: source || "Website"
    });

    const saved = await review.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Post review error:", error);
    res.status(500).json({ message: "Error saving review" });
  }
});

// @desc    Toggle review approval status (Admin)
// @route   PUT /api/reviews/:id/approve
router.put("/:id/approve", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.approved = !review.approved;
    const saved = await review.save();
    res.json(saved);
  } catch (error) {
    console.error("Approve review error:", error);
    res.status(500).json({ message: "Error updating review status" });
  }
});

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await review.deleteOne();
    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Delete review error:", error);
    res.status(500).json({ message: "Error deleting review" });
  }
});

module.exports = router;
