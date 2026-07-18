const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  businessName: {
    type: String,
    default: "Mayleki Studio & Academy"
  },
  email: {
    type: String,
    default: "maylekistudio@gmail.com"
  },
  phone: {
    type: String,
    default: "+91 87678 75492"
  },
  whatsappNumber: {
    type: String,
    default: "918767875492"
  },
  address: {
    type: String,
    default: "Mayleki Studio, Near Main Road, Pune, Maharashtra"
  },
  businessHours: {
    start: {
      type: String,
      default: "10:00 AM"
    },
    end: {
      type: String,
      default: "08:00 PM"
    }
  },
  autoConfirmBookings: {
    type: Boolean,
    default: true
  },
  instagramLink: {
    type: String,
    default: "https://instagram.com/mayleki_studio"
  },
  facebookLink: {
    type: String,
    default: "https://facebook.com/mayleki_studio"
  },
  googleReviewLink: {
    type: String,
    default: "https://g.page/r/mayleki_studio"
  }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
