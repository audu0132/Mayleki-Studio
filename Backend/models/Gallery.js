const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    default: ""
  },
  likes: {
    type: String,
    default: "0"
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Gallery", gallerySchema);
