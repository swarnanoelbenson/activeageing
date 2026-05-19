// backend/routes/results.js — GET /api/results/:categoryName/:modifierName
// Secondary lookup endpoint for category description + exercises by name.
// The main survey flow uses /api/survey which scores and fetches in one call,
// but this endpoint allows re-fetching results (e.g. after a page refresh)
// when the scores are already known and stored client-side in localStorage.

const express = require("express");
const router = express.Router();
const pool = require("../db");

// Returns category description and all matching exercises (no LIMIT here,
// unlike survey.js, so callers get the full set if they want to paginate).
router.get("/:categoryName/:modifierName", async (req, res) => {
  const { categoryName, modifierName } = req.params;

  try {
    const [[category]] = await pool.query(
      `SELECT category_name, description FROM category_thresholds WHERE category_name = ?`,
      [categoryName]
    );

    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }

    const [exercises] = await pool.query(
      `SELECT exercise_name, duration_minutes, instructions, notes
       FROM exercise_recommendations
       WHERE category_name = ? AND modifier_name = ?`,
      [categoryName, modifierName]
    );

    res.json({ category, exercises });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
