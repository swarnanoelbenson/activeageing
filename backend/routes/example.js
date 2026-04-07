const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/example
// Replace this with your actual table and logic
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result"); // test query
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
