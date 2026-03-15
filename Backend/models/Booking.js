const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const bookingSchema = new mongoose.Schema({
  userName: String,
  phone: String,
  date: String,
  timeSlot: String,
  service: String,
  price: Number,
}, { timestamps: true });

bookingSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

module.exports = mongoose.model("Booking", bookingSchema);