/**
 * Buildfolio — Express Backend
 *
 * Run: node server.js  (or: npm run dev with nodemon)
 * Requires: .env with MONGO_URI, JWT_SECRET
 */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://buildfolio-one.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  /^https:\/\/.*\.vercel\.app$/,
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some(o =>
      o instanceof RegExp ? o.test(origin) : o === origin
    );
    callback(null, allowed ? origin : false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Explicit OPTIONS handler for all preflight requests
app.options("*", cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Load auth routes (registers Google Strategy as a side-effect)
require("./routes/auth");

// ── Routes ──────────────────────────────────────────────────────────────────
app.use("/api/auth",      require("./routes/auth"));
app.use("/api/portfolio", require("./routes/portfolio"));
app.use("/api/export",    require("./routes/export"));

// Gemini route (only if API key is set)
if (process.env.GEMINI_API_KEY) {
  app.use("/api/gemini", require("./routes/gemini"));
}

// ── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({ status: "ok", time: new Date(), db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
);

// ── 404 handler ──────────────────────────────────────────────────────────────
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// ── Error handler ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("❌ Unhandled error:", err);
  res.status(500).json({ message: "Internal server error", error: err.message });
});

// ── Connect to MongoDB and start server ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });
