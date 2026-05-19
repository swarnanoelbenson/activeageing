// backend/routes/example.js — scaffold file, NOT used in production.
// Left over from initial project setup. The GET /api/example endpoint runs
// SELECT 1 + 1 as a DB connectivity smoke-test but is not mounted for real users.
// Safe to delete once all real routes are verified working.

const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/example
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
