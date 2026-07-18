const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Import Routes
const busRoutes = require("./routes/bus.routes");
const authRoutes = require("./routes/auth.routes");

// Home Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Backend Running 🚀"
    });
});

// Auth Routes  (login / register)
app.use("/api/auth", authRoutes);

// Bus Routes
app.use("/api/buses", busRoutes);

module.exports = app;