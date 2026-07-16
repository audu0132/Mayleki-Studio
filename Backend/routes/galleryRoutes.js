const express = require("express");
const Gallery = require("../models/Gallery");
const protect = require("../middleware/protect");

const router = express.Router();

// @desc    Get active gallery items (Public)
// @route   GET /api/gallery
router.get("/", async (req, res) => {
  try {
    const items = await Gallery.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Get gallery items error:", error);
    res.status(500).json({ message: "Error fetching gallery items" });
  }
});

// @desc    Get all gallery items (Admin)
// @route   GET /api/gallery/admin
router.get("/admin", protect, async (req, res) => {
  try {
    const items = await Gallery.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Get admin gallery error:", error);
    res.status(500).json({ message: "Error fetching gallery items" });
  }
});

// @desc    Create a gallery item / seed bulk (Admin)
// @route   POST /api/gallery
router.post("/", protect, async (req, res) => {
  try {
    const { url, caption, likes, isActive, bulk } = req.body;
    
    // Support bulk seeding
    if (bulk && Array.isArray(bulk)) {
      const items = await Gallery.insertMany(bulk);
      return res.status(201).json(items);
    }

    if (!url) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const item = new Gallery({
      url,
      caption: caption || "",
      likes: likes || "0",
      isActive: isActive !== undefined ? isActive : true
    });

    const saved = await item.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create gallery item error:", error);
    res.status(500).json({ message: "Error creating gallery item" });
  }
});

// @desc    Update a gallery item (Admin)
// @route   PUT /api/gallery/:id
router.put("/:id", protect, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    const { url, caption, likes, isActive } = req.body;

    if (url !== undefined) item.url = url;
    if (caption !== undefined) item.caption = caption;
    if (likes !== undefined) item.likes = likes;
    if (isActive !== undefined) item.isActive = isActive;

    const saved = await item.save();
    res.json(saved);
  } catch (error) {
    console.error("Update gallery item error:", error);
    res.status(500).json({ message: "Error updating gallery item" });
  }
});

// @desc    Delete a gallery item (Admin)
// @route   DELETE /api/gallery/:id
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Gallery item not found" });
    }

    await item.deleteOne();
    res.json({ message: "Gallery item deleted successfully" });
  } catch (error) {
    console.error("Delete gallery item error:", error);
    res.status(500).json({ message: "Error deleting gallery item" });
  }
});

module.exports = router;
