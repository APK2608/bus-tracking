const express = require("express");
const cors = require("cors");

const { authenticate } = require("./middleware/auth.middleware");
const { errorHandler } = require("./middleware/error.middleware");
const { logger } = require("./middleware/logger.middleware");

const busRoutes = require("./routes/bus.routes");

const app = express();

// ─── Global middleware ─────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(logger);

// ─── Health check ──────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend running 🚀" });
});

// ─── Protected routes ──────────────────────────────────────────────────────
// All routes below require a valid Supabase JWT in the Authorization header.
app.use("/api/buses", authenticate, busRoutes);

// ─── 404 catch-all ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.url}`);
  err.status = 404;
  next(err);
});

// ─── Central error handler (must be last) ─────────────────────────────────
app.use(errorHandler);

module.exports = app;