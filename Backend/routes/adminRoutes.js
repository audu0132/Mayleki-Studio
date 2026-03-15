const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const router = express.Router();

// Admin Register (Run Once)
router.post("/register", async (req, res) => {

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const admin = new Admin({
    email: req.body.email,
    password: hashedPassword
  });

  await admin.save();
  res.json({ message: "Admin Created" });
});

// Login

router.post("/login", async (req, res) => {
  try {
  const admin = await Admin.findOne({ email: req.body.email });

  if (!admin) return res.status(400).json({ message: "Invalid email" });

  const isMatch = await bcrypt.compare(req.body.password, admin.password);

  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    { id: admin._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

 res.json({
      message: "Login successful",
      token
    });
  }
  catch (error) {
  res.status(500).json({ message: "Error" });
}
});

module.exports = router;