/**
 * Buildfolio — Vercel Serverless API
 * Handles all /api/* routes as a single Express serverless function
 * .cjs extension = always CommonJS (no ESM conflict with root package.json)
 */

const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "https://buildfolio-one.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin))
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

// ── MongoDB — cached connection for serverless warm reuse ─────────────────────
let dbReady = false;
async function connectDB() {
  if (dbReady && mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGO_URI);
  dbReady = true;
}

app.use(async (req, res, next) => {
  try { await connectDB(); next(); }
  catch (e) { res.status(500).json({ message: "DB connection failed", error: e.message }); }
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get("/api/health", (_req, res) =>
  res.json({ status: "ok", time: new Date(), db: mongoose.connection.readyState === 1 ? "connected" : "disconnected" })
);

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth",      require("../backend/routes/auth"));
app.use("/api/portfolio", require("../backend/routes/portfolio"));
app.use("/api/export",    require("../backend/routes/export"));
if (process.env.GEMINI_API_KEY)
  app.use("/api/gemini",  require("../backend/routes/gemini"));

// ── Error handlers ────────────────────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ message: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error("[API Error]", err.message);
  res.status(500).json({ message: "Server error", error: err.message });
});

module.exports = app;
