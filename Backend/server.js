const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const bookingRoutes = require("./routes/bookings");
const analyticsRoutes = require("./routes/analytics");

connectDB();

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mayleki-studio.vercel.app/"
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
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/users", require("./routes/users"));
app.use("/api/bookings", bookingRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});