// backend/routes/survey.js — POST /api/survey
// Scores the 5-answer wellness survey, persists the result to the DB,
// and returns the category + matching exercises to the frontend.
//
// Resilience pattern: scores are computed before the DB query so the
// endpoint can still return a useful response (with hardcoded fallback
// exercises) if the database is down.

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

// ── Fallback exercises ──
// Used when the DB is unavailable. One set per category, matching the
// "standard" modifier so they're appropriate for the widest audience.
// These are intentionally simple and safe — no equipment, low impact.
const fallbackExercises = {
  "Just Getting Started": [
    { exercise_name: "Neck Rotations",       duration_minutes: 5 },
    { exercise_name: "Seated Chest Stretch", duration_minutes: 8 },
    { exercise_name: "Ankle Rotations",      duration_minutes: 5 },
  ],
  "Building Momentum": [
    { exercise_name: "Brisk Walking", duration_minutes: 10 },
    { exercise_name: "Sit-to-Stand",  duration_minutes: 8  },
    { exercise_name: "Calf Raises",   duration_minutes: 6  },
  ],
  "Thriving": [
    { exercise_name: "Brisk Walking",        duration_minutes: 10 },
    { exercise_name: "Mini Squats",          duration_minutes: 10 },
    { exercise_name: "Standing Balance Hold",duration_minutes: 8  },
  ],
};

// POST /api/survey
// Body: { answers: [exercise_frequency, session_duration, inactivity_level, sleep_hours, restedness] }
router.post("/", async (req, res) => {
  const { answers } = req.body;

  if (!answers || answers.length !== 5) {
    return res.status(400).json({ error: "Expected 5 answers" });
  }

  // ── Scoring (DB-independent) ──
  // All five score values are computed here so they're available in the
  // catch block — if the DB insert fails we can still return a full result.
  const [q1, q2, q3, q4, q5] = answers;
  const activityScore = getActivityScore(answers);
  const modifierScore = getModifierScore(answers);
  const categoryName  = getCategoryName(activityScore);
  const modifierName  = getModifierName(modifierScore);
  const chartPercent  = getChartPercent(activityScore);

  try {
    // Persist check-in for analytics; failure here does not block the response
    await pool.query(
      `INSERT INTO user_checkins
        (exercise_frequency, session_duration, inactivity_level, sleep_hours, restedness,
         activity_score, modifier_score, category_name, modifier_name)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [q1, q2, q3, q4, q5, activityScore, modifierScore, categoryName, modifierName]
    );

    // Pull the human-readable description for the user's category
    const [[categoryRow]] = await pool.query(
      `SELECT category_name, description FROM category_thresholds WHERE category_name = ?`,
      [categoryName]
    );

    // Fetch exercises for this category × modifier combination (max 3)
    // The LIMIT 3 matches the ExerciseSession page which always shows 3 exercises.
    const [exercises] = await pool.query(
      `SELECT exercise_name, duration_minutes, instructions, notes
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
