const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookingRoutes");
const analyticsRoutes = require("./routes/analytics");
const adminRoutes = require("./routes/adminRoutes");

connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://mayleki-studio.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mayleki Backend Running 🚀");
});

// ROUTES
app.use("/api/offers", require("./routes/offerRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", adminRoutes);
app.use("/api/admin/customers", require("./routes/customerAdminRoutes"));
app.use("/api/services", require("./routes/serviceRoutes"));
app.use("/api/staff", require("./routes/staffRoutes"));
app.use("/api/bookings", bookingRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/analytics", analyticsRoutes);

// Centralized Error Handler
app.use((err, req, res, next) => {
  console.error("Centralized Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});