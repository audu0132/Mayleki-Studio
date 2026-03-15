const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  discount: { type: String },
  validTill: { type: Date },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);