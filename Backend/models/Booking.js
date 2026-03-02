const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userName: String,
  phone: String,
  date: String,
  timeSlot: String,
  service: String,
  price: Number,
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
