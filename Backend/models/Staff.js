const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Please add a phone number"],
    trim: true
  },
  role: {
    type: String,
    required: [true, "Please add a role/designation"],
    trim: true
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "On Leave"],
    default: "Active"
  },
  specialties: {
    type: [String],
    default: []
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service"
  }],
  image: {
    type: String,
    default: ""
  },
  workingDays: {
    type: [String],
    default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  },
  workingHours: {
    start: {
      type: String,
      default: "10:00 AM"
    },
    end: {
      type: String,
      default: "08:00 PM"
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("Staff", staffSchema);
