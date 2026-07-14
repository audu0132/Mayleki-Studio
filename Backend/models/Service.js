const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number }, // in minutes
  category: { type: String }, // e.g. Hair, Skin, Bridal, Makeup
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
