const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");
const analyticsRoutes = require("./routes/analytics");

dotenv.config();
connectDB();

const app = express();

// ✅ CORRECT CORS SETUP
app.options("*", cors());

app.use(express.json());

// ✅ ROOT ROUTE (important)
app.get("/", (req, res) => {
  res.send("Mayleki Backend Running 🚀");
});

// ✅ ROUTES
app.use("/api/offers", require("./routes/offerRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/users"));
app.use("/api/booking", require("./routes/bookings"));
app.use("/api/bookings", bookingRoutes);
app.use("/api/analytics", analyticsRoutes);

// ✅ PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});