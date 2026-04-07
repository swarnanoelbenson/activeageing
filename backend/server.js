const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Allow requests from your Vercel frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
}));

app.use(express.json());

// Routes
app.use("/api/example", require("./routes/example"));
app.use("/api/survey", require("./routes/survey"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Required for Vercel serverless
module.exports = app;
