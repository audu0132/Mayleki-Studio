const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  title: String,
  description: String,
  discount: String,
  validTill: Date,
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);