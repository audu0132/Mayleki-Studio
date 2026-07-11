const express = require("express");
const router = express.Router();
const {
  register,
  login,
  profile,
  profileUpdate,
  forgotPassword,
  resetPassword,
  logout
} = require("../controllers/authController");
const protectUser = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/logout", logout);

// Protected routes (Customer)
router.get("/profile", protectUser, profile);
router.put("/profile", protectUser, profileUpdate);

module.exports = router;
