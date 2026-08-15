/**
 * Buildfolio — Vercel Serverless API
 * CommonJS (api/package.json sets "type": "commonjs")
 */

const express  = require("express");
const mongoose = require("mongoose");
const cors     = require("cors");

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || /\.vercel\.app$/.test(origin) || origin === "http://localhost:5173")
      return cb(null, true);
    cb(new Error("CORS blocked: " + origin));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.options("*", cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ── Health (no DB needed — always fast) ───────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", time: new Date(), db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
);

// ── MongoDB (cached, 5s timeout) ──────────────────────────────────────────────
let dbReady = false;
async function connectDB() {
  if (dbReady && mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    socketTimeoutMS: 10000,
    family: 4, // Force IPv4 — fixes SRV DNS issues in Vercel serverless
  });
  dbReady = true;
}

app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (e) {
    console.error("[DB]", e.message);
    res.status(500).json({ message: "DB connection failed", error: e.message });
  }
});

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",      require("../backend/routes/auth"));
app.use("/api/portfolio", require("../backend/routes/portfolio"));
app.use("/api/export",    require("../backend/routes/export"));
if (process.env.GEMINI_API_KEY)
  app.use("/api/gemini",  require("../backend/routes/gemini"));

// ── Fallbacks ─────────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error("[API Error]", err.message);
  res.status(500).json({ message: "Server error", error: err.message });
});

module.exports = app;
