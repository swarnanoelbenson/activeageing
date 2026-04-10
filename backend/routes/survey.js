const express = require("express");
const router = express.Router();
const pool = require("../db");
const {
  getActivityScore,
  getModifierScore,
  getCategoryName,
  getModifierName,
  getChartPercent,
} = require("../utils/scoring");

// POST /api/survey
// Body: { answers: [exercise_frequency, session_duration, inactivity_level, sleep_hours, restedness] }
router.post("/", async (req, res) => {
  const { answers } = req.body;

  if (!answers || answers.length !== 5) {
    return res.status(400).json({ error: "Expected 5 answers" });
  }

  const [q1, q2, q3, q4, q5] = answers;
  const activityScore = getActivityScore(answers);
  const modifierScore = getModifierScore(answers);
  const categoryName  = getCategoryName(activityScore);
  const modifierName  = getModifierName(modifierScore);
  const chartPercent  = getChartPercent(activityScore);

  try {
    // Store in user_checkins
    await pool.query(
      `INSERT INTO user_checkins
        (exercise_frequency, session_duration, inactivity_level, sleep_hours, restedness,
         activity_score, modifier_score, category_name, modifier_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [q1, q2, q3, q4, q5, activityScore, modifierScore, categoryName, modifierName]
    );

    // Fetch category description
    const [[categoryRow]] = await pool.query(
      `SELECT category_name, description FROM category_thresholds WHERE category_name = ?`,
      [categoryName]
    );

    // Fetch exercises for this category + modifier combination
    const [exercises] = await pool.query(
      `SELECT exercise_name, duration_minutes, instructions, notes
       FROM exercise_recommendations
       WHERE category_name = ? AND modifier_name = ?`,
      [categoryName, modifierName]
    );

    res.json({
      activityScore,
      modifierScore,
      categoryName,
      modifierName,
      chartPercent,
      category: categoryRow,
      exercises,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;
