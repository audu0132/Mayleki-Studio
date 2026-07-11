const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
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
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email"
    ]
  },
  phone: {
    type: String,
    required: [true, "Please add a mobile number"],
    unique: true,
    trim: true,
    match: [/^\d{10}$/, "Please add a valid 10-digit mobile number"]
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minlength: 6,
    select: true
  },
  profilePicture: {
    type: String,
    default: ""
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { timestamps: true });

// Encrypt password using bcrypt
userSchema.pre("save", async function() {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);