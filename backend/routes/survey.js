const express = require("express");
const router = express.Router();
const pool = require("../db");
const { getScore, getCategoryId, getChartPercent } = require("../utils/scoring");

// POST /api/survey
// Body: { answers: [answer1, answer2, answer3, answer4, answer5, answer6] }
router.post("/", async (req, res) => {
  const { answers } = req.body;

  if (!answers || answers.length !== 5) {
    return res.status(400).json({ error: "Expected 5 answers" });
  }

  const score = getScore(answers);
  const catId = getCategoryId(score);
  const chartPercent = getChartPercent(score);

  try {
    await pool.query(
      `INSERT INTO survey_responses
        (exercise_frequency, session_duration, inactivity_level, sleep_hours, restedness, score, cat_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [...answers, score, catId]
    );

    // Fetch the category, momentum, and exercises for this category
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

    res.json({ score, catId, chartPercent, category, exercises });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
