const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/results/:catId
// Returns category info, momentum, and exercises for a given category
router.get("/:catId", async (req, res) => {
  const catId = parseInt(req.params.catId);

  if (!catId || catId < 1 || catId > 4) {
    return res.status(400).json({ error: "Invalid category id" });
  }

  try {
    const [[category]] = await pool.query(
      `SELECT c.cat_id, c.name, c.description, m.label, m.description AS momentum_desc
       FROM category c
       LEFT JOIN momentum m ON m.cat_id = c.cat_id
       WHERE c.cat_id = ?`,
      [catId]
    );

    const [exercises] = await pool.query(
      `SELECT exe_id, name, gif, steps FROM exercise WHERE cat_id = ?`,
      [catId]
    );

    res.json({ category, exercises });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
