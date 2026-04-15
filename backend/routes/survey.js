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

// Fallback exercises used when the DB is unavailable
const fallbackExercises = {
  "Just Getting Started": [
    { exercise_name: "Seated Marching",        duration_minutes: 5,  instructions: "Sit upright and gently lift one knee at a time, alternating sides at a comfortable pace.", notes: null, gif_url: null },
    { exercise_name: "Chair Yoga Stretch",     duration_minutes: 7,  instructions: "While seated, slowly reach both arms overhead, hold for 5 seconds, then gently lower. Repeat 5 times.", notes: null, gif_url: null },
    { exercise_name: "Seated Leg Extensions",  duration_minutes: 5,  instructions: "Sit upright and slowly extend one leg until straight, hold for 3 seconds, then lower. Alternate legs.", notes: null, gif_url: null },
  ],
  "Building Momentum": [
    { exercise_name: "Gentle Standing Stretch", duration_minutes: 8,  instructions: "Perform light full-body stretches while standing, using a wall or chair for support if needed.", notes: null, gif_url: null },
    { exercise_name: "Wall Push-Ups",           duration_minutes: 6,  instructions: "Stand arm's length from a wall, place hands flat on it, and slowly bend elbows to bring your chest toward the wall, then push back.", notes: null, gif_url: null },
    { exercise_name: "Light Walking Routine",   duration_minutes: 10, instructions: "Walk at a comfortable pace for 10 minutes on a flat surface.", notes: null, gif_url: null },
  ],
  "Thriving": [
    { exercise_name: "Brisk Walk Intervals",    duration_minutes: 12, instructions: "Alternate 1 minute of brisk walking with 1 minute of normal pace. Repeat 5 times.", notes: null, gif_url: null },
    { exercise_name: "Standing Balance Hold",   duration_minutes: 6,  instructions: "Stand on one foot near a wall for support, hold 10 seconds, then switch. Repeat 5 times each side.", notes: null, gif_url: null },
    { exercise_name: "Step Tap Cardio",         duration_minutes: 8,  instructions: "Step side to side, tapping your foot with each step. Maintain a steady rhythm for the full duration.", notes: null, gif_url: null },
  ],
};

// POST /api/survey
// Body: { answers: [exercise_frequency, session_duration, inactivity_level, sleep_hours, restedness] }
router.post("/", async (req, res) => {
  const { answers } = req.body;

  if (!answers || answers.length !== 5) {
    return res.status(400).json({ error: "Expected 5 answers" });
  }

  // Compute scores before DB — these are always returned even if DB fails
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

    // Fetch exercises for this category + modifier combination (max 3)
    const [exercises] = await pool.query(
      `SELECT exercise_name, duration_minutes, instructions, notes, gif_url
       FROM exercise_recommendations
       WHERE category_name = ? AND modifier_name = ?
       LIMIT 3`,
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
    console.error("DB error — returning computed scores with fallback exercises:", err.message);
    // DB is unavailable but scores are already computed — still return a useful response
    res.json({
      activityScore,
      modifierScore,
      categoryName,
      modifierName,
      chartPercent,
      category: null,
      exercises: fallbackExercises[categoryName] ?? fallbackExercises["Building Momentum"],
    });
  }
});

module.exports = router;
