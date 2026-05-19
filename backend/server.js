// backend/server.js — Express entry point for both local dev and Vercel serverless.
// Vercel imports this file as a serverless function via the `module.exports = app`
// at the bottom; the conditional app.listen() block is skipped in that environment.

const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ── CORS ──
// Single-origin allowlist so only the deployed frontend (or localhost:5173 in
// dev) can call the API. Wildcard CORS would expose survey and route data to
// any origin, which isn't desirable for a health-adjacent app.
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

// Parse JSON request bodies for all routes
app.use(express.json());

// ── Route mounting ──
// Each route module handles its own sub-path logic; mounting here keeps
// server.js free of business logic.
app.use("/api/example", require("./routes/example"));
app.use("/api/survey", require("./routes/survey"));
app.use("/api/results", require("./routes/results"));
app.use("/api/events", require("./routes/events"));
app.use("/api/routesurvey", require("./routes/routesurvey"));
app.use("/api/routes",         require("./routes/routes"));
app.use("/api/shared-routes", require("./routes/shared-routes"));

// ── Health check ──
// Vercel and uptime monitors hit the root path to confirm the function is
// alive; returning JSON avoids HTML parse errors in monitoring dashboards.
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

// ── Local dev server ──
// Guard prevents app.listen() from running inside a Vercel serverless
// function, where the runtime manages the HTTP server itself.
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Export the app instance so Vercel can wrap it as a serverless function
module.exports = app;
