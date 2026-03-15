const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const offerSchema = new mongoose.Schema({
  title: String,
  description: String,
  discount: String,
  validTill: Date,
}, { timestamps: true });



module.exports = mongoose.model("Offer", offerSchema);