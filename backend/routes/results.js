const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/results/:categoryName/:modifierName
// Returns category info and exercises for a given category + modifier
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
